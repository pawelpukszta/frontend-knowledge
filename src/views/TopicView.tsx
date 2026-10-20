import type { ReactNode } from 'react';
import { Html } from '../components/Html';
import { Icon } from '../components/Icon';
import { CATEGORY, catStyle, type Topic } from '../data';
import { href } from '../lib/router';
import { host, readMinutes } from '../lib/text';
import { useTitle } from '../lib/useTitle';

export function TopicView({ topic: t }: { topic: Topic }) {
  useTitle(t.title);
  const c = CATEGORY[t.category];
  const mins = readMinutes([t.summary, t.body, t.analogy, t.pitfalls, ...t.qa.flatMap((q) => [q.q, q.a])]);

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
          <span className="tags">{t.tags.map((g) => <span key={g} className="topic-tag">{g}</span>)}</span>
        </div>
        <div className="tldr"><p className="tldr-label">W skrócie</p><Html as="p" className="tldr-text" html={t.summary} /></div>
        {t.body && <Section id="wyjasnienie" title="Wyjaśnienie"><Html className="prose" html={t.body} /></Section>}
        {t.flow && (
          <Section id="przeplyw" title="Przepływ">
            <ol className="flow">
              {t.flow.map((s, n) => (
                <li key={n}>
                  {n > 0 && <span className="flow-arrow" aria-hidden="true"><Icon name="arrowRight" /></span>}
                  <span className="flow-step"><span className="i">{n + 1}</span>{s}</span>
                </li>
              ))}
            </ol>
          </Section>
        )}
        {t.analogy && <Section id="analogia" title="Analogia"><Html className="callout analogy prose" html={t.analogy} /></Section>}
        {t.code && <Section id="kod" title="Przykład kodu"><Html className="prose" html={t.code} /></Section>}
        {t.pitfalls && <Section id="bledy" title="Częste błędy"><Html className="callout pitfalls prose" html={t.pitfalls} /></Section>}
        {t.qa.length > 0 && (
          <Section id="rozmowa" title="Na rozmowie">
            <p className="block-hint">Spróbuj odpowiedzieć na głos, zanim rozwiniesz odpowiedź.</p>
            <div className="qa">
              {t.qa.map((q) => (
                <details key={q.id} id={q.id}>
                  <summary><Html as="span" html={q.q} /><span className="caret" aria-hidden="true"><Icon name="caret" /></span></summary>
                  <Html className="answer prose" html={q.a} />
                </details>
              ))}
            </div>
          </Section>
        )}
        <Section id="zrodla" title="Źródła">
          <ul className="sources">
            {t.sources.map((s) => (
              <li key={s.url}>
                <a href={s.url} target="_blank" rel="noopener noreferrer">
                  <span>{s.title}</span><span className="host">{host(s.url)}</span><Icon name="external" />
                </a>
              </li>
            ))}
          </ul>
        </Section>
      </article>
    </div>
  );
}

function Section({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section className="block" id={`sec-${id}`} aria-labelledby={`h-${id}`}>
      <h2 id={`h-${id}`}>{title}</h2>
      {children}
    </section>
  );
}
