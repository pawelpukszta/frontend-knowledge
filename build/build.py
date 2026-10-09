"""Build the artifact page and a standalone HTML file from template + content."""
import json
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parent
subprocess.run(["python3", str(ROOT / "parse.py"), str(ROOT / "data.json")], check=True)
data = (ROOT / "data.json").read_text(encoding="utf-8").replace("</", "<\\/")
tpl = (ROOT / "template.html").read_text(encoding="utf-8")
page = tpl.replace("__DATA__", data)
assert "—" not in page, "em dash found"

dist = ROOT.parent / "dist"
dist.mkdir(exist_ok=True)
(dist / "baza-wiedzy-fe.html").write_text(page, encoding="utf-8")  # body-only variant for claude.ai Artifact publishing

head, body = page.split('<header class="bar">', 1)
standalone = (
    '<!doctype html>\n<html lang="pl">\n<head>\n<meta charset="utf-8">\n'
    '<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n'
    + head + '</head>\n<body>\n<header class="bar">' + body + "\n</body>\n</html>\n"
)
(ROOT.parent / "index.html").write_text(standalone, encoding="utf-8")
print("built", len(page) // 1024, "KB")
