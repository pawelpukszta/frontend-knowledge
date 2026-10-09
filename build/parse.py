"""Parse knowledge-base content files into a JSON structure consumed by the app."""
import json
import os
import re
import sys
from pathlib import Path

import markdown

CONTENT_DIR = Path(__file__).resolve().parent.parent / "content"
MD = markdown.Markdown(extensions=["tables", "fenced_code", "sane_lists"])


def md(text: str) -> str:
    MD.reset()
    # Allow "\|" inside table cells (also inside code spans)
    return MD.convert(text.strip()).replace("\\|", "|")


def md_inline(text: str) -> str:
    html = md(text)
    # Strip a single wrapping paragraph for inline usage
    m = re.fullmatch(r"<p>(.*)</p>", html, flags=re.S)
    return m.group(1) if m else html


def parse_qa(block: str):
    items, cur = [], None
    for line in block.splitlines():
        if line.startswith("Q: "):
            if cur:
                items.append(cur)
            cur = {"q": line[3:].strip(), "a": ""}
        elif (line.startswith("A: ") or line.strip() == "A:") and cur is not None:
            cur["a"] += line[3:] + "\n"
        elif cur is not None:
            cur["a"] += line + "\n"
    if cur:
        items.append(cur)
    return [{"q": md_inline(i["q"]), "a": md(i["a"])} for i in items]


def parse_sources(block: str):
    out = []
    for line in block.splitlines():
        line = line.strip()
        if not line.startswith("- "):
            continue
        title, url = line[2:].rsplit("|", 1)
        out.append({"title": title.strip(), "url": url.strip()})
    return out


def parse_quiz(block: str, category: str):
    questions = []
    for chunk in re.split(r"\n\s*\n", block.strip()):
        q = {"category": category, "options": [], "answer": None}
        for line in chunk.splitlines():
            if line.startswith("Q: "):
                q["q"] = md_inline(line[3:])
            elif line.startswith("+ "):
                q["answer"] = len(q["options"])
                q["options"].append(md_inline(line[2:]))
            elif line.startswith("- "):
                q["options"].append(md_inline(line[2:]))
            elif line.startswith("E: "):
                q["explain"] = md_inline(line[3:])
            elif line.startswith("T: "):
                q["topic"] = line[3:].strip()
        if "q" in q:
            assert q["answer"] is not None, f"quiz without answer: {chunk[:60]}"
            questions.append(q)
    return questions


def parse_topic(tid: str, text: str, category: str):
    header, *rest = re.split(r"^::: ", text, flags=re.M)
    topic = {"id": tid, "category": category, "code": [], "qa": [], "sources": []}
    for line in header.strip().splitlines():
        key, _, value = line.partition(":")
        value = value.strip()
        if key == "tags":
            topic["tags"] = [t.strip() for t in value.split(",") if t.strip()]
        else:
            topic[key.strip()] = value
    topic["summaryHtml"] = md_inline(topic["summary"])
    for section in rest:
        head, _, body = section.partition("\n")
        parts = head.strip().split(" ", 2)
        kind = parts[0]
        body = body.rstrip()
        if kind == "body":
            topic["body"] = md(body)
        elif kind == "analogy":
            topic["analogy"] = md(body)
        elif kind == "pitfalls":
            topic["pitfalls"] = md(body)
        elif kind == "flow":
            topic["flow"] = [s.strip() for s in body.strip().split(" > ")]
        elif kind == "code":
            lang = parts[1] if len(parts) > 1 else "js"
            title = parts[2] if len(parts) > 2 else ""
            topic["code"].append({"lang": lang, "title": title, "src": body.strip("\n")})
        elif kind == "qa":
            topic["qa"] = parse_qa(body)
        elif kind == "sources":
            topic["sources"] = parse_sources(body)
        else:
            raise ValueError(f"Unknown section {kind} in {tid}")
    assert topic["sources"], f"topic {tid} has no sources"
    assert topic.get("level") in ("mid", "senior"), f"bad level in {tid}"
    return topic


def parse_file(path: Path):
    text = path.read_text(encoding="utf-8")
    blocks = re.split(r"^@(category|topic|quiz)\b", text, flags=re.M)
    category, topics, quiz = None, [], []
    it = iter(blocks[1:])
    for kind, body in zip(it, it):
        if kind == "category":
            first, _, meta = body.partition("\n")
            category = {"id": first.strip()}
            for line in meta.strip().splitlines():
                k, _, v = line.partition(":")
                category[k.strip()] = v.strip()
        elif kind == "topic":
            first, _, rest = body.partition("\n")
            topics.append(parse_topic(first.strip(), rest, category["id"]))
        elif kind == "quiz":
            quiz.extend(parse_quiz(body, category["id"]))
    return category, topics, quiz


CHECKLIST_DIR = Path(os.environ.get("KB_CHECKLIST_DIR", Path(__file__).resolve().parent.parent / "checklist"))
PRIORITIES = ("critical", "high", "medium", "low")


def parse_links(value: str):
    out = []
    for part in value.split(" ; "):
        part = part.strip()
        if not part:
            continue
        title, url = part.rsplit("|", 1)
        out.append({"title": title.strip(), "url": url.strip()})
    return out


CODE_LANGS = {"html", "css", "scss", "js", "ts", "tsx", "jsx", "json", "http", "bash", "yaml", "xml", "md", "txt", "graphql"}


def parse_checklist():
    """Parse checklist/*.txt (rules based on frontendchecklist.io) into categories > groups > rules.

    Rule fields: T title, D short description, W why it matters (one bullet per line),
    V how to verify, X common mistakes (one per line), S extra sources, plus fenced code blocks.
    """
    categories, cat, group, rule = [], None, None, None
    code = None  # open fenced code block
    for path in sorted(CHECKLIST_DIR.glob("*.txt")):
        for raw in path.read_text(encoding="utf-8").splitlines():
            line = raw.rstrip()
            if code is not None:
                if line.strip() == "```":
                    code["src"] = "\n".join(code.pop("lines")).strip("\n")
                    rule["code"].append(code)
                    code = None
                else:
                    code["lines"].append(raw)
                continue
            if not line:
                continue
            if line.startswith("```"):
                assert rule is not None, f"code block outside a rule in {path.name}"
                lang, _, title = line[3:].strip().partition(" ")
                assert lang in CODE_LANGS, f"unsupported code language '{lang}' in {cat['id']}/{rule['id']}"
                code = {"lang": lang, "title": title.strip(), "lines": []}
            elif line.startswith("@cl-category "):
                cat = {"id": line.split(" ", 1)[1].strip(), "sources": [], "groups": []}
                categories.append(cat)
                group = rule = None
            elif line.startswith("@cl-group "):
                group = {"name": line.split(" ", 1)[1].strip(), "sources": [], "rules": []}
                cat["groups"].append(group)
                rule = None
            elif line.startswith("["):
                m = re.fullmatch(r"\[([a-z0-9-]+)\] (critical|high|medium|low)", line)
                assert m, f"bad rule header: {line}"
                rule = {"id": m.group(1), "priority": m.group(2), "sources": [], "why": [], "pitfalls": [], "code": [],
                        "url": f"https://frontendchecklist.io/rules/{cat['id']}/{m.group(1)}"}
                group["rules"].append(rule)
            elif rule is not None and line[:3] in ("T: ", "D: ", "V: ", "S: ", "W: ", "X: "):
                key, val = line[0], line[3:].strip()
                if key == "T":
                    rule["title"] = md_inline(val)
                elif key == "D":
                    rule["desc"] = md_inline(val)
                elif key == "V":
                    rule["verify"] = md_inline(val)
                elif key == "W":
                    rule["why"].append(md_inline(val.lstrip("- ")))
                elif key == "X":
                    rule["pitfalls"].append(md_inline(val.lstrip("- ")))
                else:
                    rule["sources"].extend(parse_links(val))
            elif ":" in line and rule is None:
                key, _, val = line.partition(":")
                target = group if group is not None else cat
                if key.strip() == "sources":
                    target["sources"] = parse_links(val)
                else:
                    target[key.strip()] = val.strip()
            else:
                raise ValueError(f"unparsed checklist line in {path.name}: {line}")
        assert code is None, f"unclosed code block in {path.name}"
    for c in categories:
        for g in c["groups"]:
            for r in g["rules"]:
                for k in ("title", "desc", "verify"):
                    assert r.get(k), f"rule {c['id']}/{r['id']} misses {k}"
    return categories


def main():
    categories, topics, quiz = [], [], []
    for path in sorted(CONTENT_DIR.glob("*.txt")):
        c, t, q = parse_file(path)
        categories.append(c)
        topics.extend(t)
        quiz.extend(q)
    ids = {t["id"] for t in topics}
    assert len(ids) == len(topics), "duplicate topic ids"
    for q in quiz:
        assert q.get("topic") in ids, f"quiz links unknown topic {q.get('topic')}"
    checklist = parse_checklist() if CHECKLIST_DIR.exists() else []
    data = {"categories": categories, "topics": topics, "quiz": quiz, "checklist": checklist}
    out = Path(sys.argv[1] if len(sys.argv) > 1 else "data.json")
    out.write_text(json.dumps(data, ensure_ascii=False), encoding="utf-8")
    n_qa = sum(len(t["qa"]) for t in topics)
    n_rules = sum(len(g["rules"]) for c in checklist for g in c["groups"])
    print(f"{len(categories)} categories, {len(topics)} topics, {n_qa} Q&A, {len(quiz)} quiz questions, {n_rules} checklist rules")


if __name__ == "__main__":
    main()
