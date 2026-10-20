import type { Topic } from '../data';
import { href } from '../lib/router';
import { escapeHtml, highlight } from '../lib/search';
import { plural } from '../lib/text';
import { Html } from './Html';
import { useUserData } from '../lib/userData';
import { StatusIcon, topicStatus } from './Status';

/** `level`: heading level of the title, matching the page outline (2 under the page h1, 3 inside a section). */
export function TopicRow({ topic: t, query = '', level = 2 }: { topic: Topic; query?: string; level?: 2 | 3 }) {
  const H = level === 2 ? 'h2' : 'h3';
  const status = useUserData((d) => topicStatus(d, t.id));
  return (
    <a className="trow" href={href.topic(t.id)}>
      <StatusIcon status={status} />
      {query ? <Html as={H} html={highlight(escapeHtml(t.title), query)} /> : <H>{t.title}</H>}
      <span className="meta">
        <span className={`level level-${t.level}`}>{t.level}</span>
        <span className="pill">{t.qa.length} {plural(t.qa.length, 'pytanie', 'pytania', 'pytań')}</span>
      </span>
      <Html as="p" html={query ? highlight(t.summary, query) : t.summary} />
    </a>
  );
}
