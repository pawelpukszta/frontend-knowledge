import type { Topic } from '../data';
import { href } from '../lib/router';
import { escapeHtml, highlight } from '../lib/search';
import { plural } from '../lib/text';
import { Html } from './Html';
import { useUserData } from '../lib/userData';
import { StatusIcon, topicStatus } from './Status';

export function TopicRow({ topic: t, query = '' }: { topic: Topic; query?: string }) {
  const status = useUserData((d) => topicStatus(d, t.id));
  return (
    <a className="trow" href={href.topic(t.id)}>
      <StatusIcon status={status} />
      {query ? <Html as="h3" html={highlight(escapeHtml(t.title), query)} /> : <h3>{t.title}</h3>}
      <span className="meta">
        <span className={`level level-${t.level}`}>{t.level}</span>
        <span className="pill">{t.qa.length} {plural(t.qa.length, 'pytanie', 'pytania', 'pytań')}</span>
      </span>
      <Html as="p" html={query ? highlight(t.summary, query) : t.summary} />
    </a>
  );
}
