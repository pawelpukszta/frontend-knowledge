import { useEffect, useState, type ReactNode } from 'react';
import { Html } from '../components/Html';
import { Icon } from '../components/Icon';
import { QaItem } from '../components/QaItem';
import { CATEGORY, catStyle, TOPIC, type Topic } from '../data';
import { href } from '../lib/router';
import { formatDay, host, plural, readMinutes } from '../lib/text';
import { useTitle } from '../lib/useTitle';
import { markSeen, toggleTopicMark, useUserData } from '../lib/userData';
import { MarkButtons, StatusTag } from '../components/Status';

interface Sec { id: string; title: string; node: ReactNode; className?: string }

export function TopicView({ topic: t }: { topic: Topic }) {
  useTitle(t.title);
  useEffect(() => markSeen(t.id), [t.id]);
  const mark = useUserData((d) => d.topicStatus[t.id]);
  const c = CATEGORY[t.category];
  const i = c.topics.indexOf(t.id);
  const prev = TOPIC[c.topics[i - 1]];
  const next = TOPIC[c.topics[i + 1]];
  const mins = readMinutes([t.summary, t.body, t.analogy, t.pitfalls, ...t.qa.flatMap((q) => [q.q, q.a])]);

  const maybe: (Sec | false | '' | undefined)[] = [
    t.body && { id: 'wyjasnienie', title: 'Wyjaśnienie', node: <Html className="prose" html={t.body} /> },
    t.flow && {
      id: 'przeplyw', title: 'Przepływ', node: (
        <ol className="flow">
          {t.flow.map((s, n) => (
            <li key={n}>
              {n > 0 && <span className="flow-arrow" aria-hidden="true"><Icon name="arrowRight" /></span>}
              <span className="flow-step"><span className="i">{n + 1}</span>{s}</span>
            </li>
          ))}
        </ol>
      ),
    },
    t.analogy && { id: 'analogia', title: 'Analogia', node: <Html className="callout analogy prose" html={t.analogy} /> },
    t.code && { id: 'kod', title: 'Przykład kodu', node: <Html className="prose" html={t.code} /> },
    t.pitfalls && { id: 'bledy', title: 'Częste błędy', node: <Html className="callout pitfalls prose" html={t.pitfalls} /> },
    t.qa.length > 0 && {
      id: 'rozmowa', title: 'Na rozmowie', node: (
        <>
          <p className="block-hint">Spróbuj odpowiedzieć na głos, zanim rozwiniesz odpowiedź.</p>
          <div className="qa">{t.qa.map((q) => <QaItem key={q.id} item={{ ...q, category: t.category, level: t.level }} />)}</div>
        </>
      ),
    },
    {
      id: 'ocena', title: 'Jak ci poszło?', className: 'self-check', node: (
        <>
          <p>Oznacz zagadnienie. Te do powtórki zbierają się na stronie startowej i w widoku „Do powtórki”.</p>
          <MarkButtons value={mark} onToggle={(m) => toggleTopicMark(t.id, m)} label="Ocena zagadnienia" />
        </>
      ),
    },
    {
      id: 'zrodla', title: 'Źródła', node: (
        <ul className="sources">
          {t.sources.map((s) => (
            <li key={s.url}>
              <a href={s.url} target="_blank" rel="noopener noreferrer">
                <span>{s.title}</span><span className="host">{host(s.url)}</span><Icon name="external" />
              </a>
            </li>
          ))}
        </ul>
      ),
    },
  ];
  const sections = maybe.filter((s): s is Sec => Boolean(s));

  const active = useActiveSection(sections.map((s) => `sec-${s.id}`));

  return (
    <div className="topic-layout" style={catStyle(t.category)}>
      <article className="topic">
        <nav className="crumbs" aria-label="Ścieżka">
          <a href={href.home()}>Start</a><span aria-hidden="true">/</span><a href={href.category(c.id)}>{c.name}</a>
        </nav>
        <h1>{t.title}</h1>
        <div className="topic-meta">
          <span className={`level level-${t.level}`}>{t.level}</span>
          <span>{mins} min czytania</span>
          <span>dodano <time dateTime={t.added}>{formatDay(t.added)}</time></span>
          {mark && <StatusTag status={mark} />}
          <span className="tags">{t.tags.map((g) => <span key={g} className="topic-tag">{g}</span>)}</span>
        </div>
        <div className="tldr"><p className="tldr-label">W skrócie</p><Html as="p" className="tldr-text" html={t.summary} /></div>
        {sections.map((s) => (
          <section key={s.id} className={`block ${s.className ?? ''}`} id={`sec-${s.id}`} aria-labelledby={`h-${s.id}`}>
            <h2 id={`h-${s.id}`}>{s.title}</h2>
            {s.node}
          </section>
        ))}
        <nav className="pager" aria-label="Sąsiednie zagadnienia">
          {prev && <a className="prev" href={href.topic(prev.id)}><span><Icon name="arrowLeft" />Poprzednie</span><b>{prev.title}</b></a>}
          {next && <a className="next" href={href.topic(next.id)}><span>Następne<Icon name="arrowRight" /></span><b>{next.title}</b></a>}
        </nav>
      </article>
      <nav className="toc" aria-label="Na tej stronie">
        <p className="toc-title">Na tej stronie</p>
        <ol>
          {sections.map((s) => (
            <li key={s.id}>
              <button type="button" aria-current={active === `sec-${s.id}` ? 'location' : undefined}
                onClick={() => document.getElementById(`sec-${s.id}`)?.scrollIntoView({ behavior: reducedMotion() ? 'auto' : 'smooth', block: 'start' })}>
                {s.title}
              </button>
            </li>
          ))}
        </ol>
        <p className="toc-time">{mins} min czytania, {t.qa.length} {plural(t.qa.length, 'pytanie', 'pytania', 'pytań')}</p>
      </nav>
    </div>
  );
}

const reducedMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Id of the section currently being read (top band of the viewport). */
function useActiveSection(ids: string[]): string | undefined {
  const [active, setActive] = useState<string>();
  const key = ids.join(' ');
  useEffect(() => {
    if (!('IntersectionObserver' in window)) return;
    const io = new IntersectionObserver((entries) => {
      const hit = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
      if (hit) setActive(hit.target.id);
    }, { rootMargin: '-20% 0px -65% 0px' });
    key.split(' ').forEach((id) => { const el = document.getElementById(id); if (el) io.observe(el); });
    return () => io.disconnect();
  }, [key]);
  return active;
}
