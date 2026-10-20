import type { Topic } from '../data';
import { href } from '../lib/router';
import { escapeHtml, highlight } from '../lib/search';
import { plural } from '../lib/text';
import { Html } from './Html';
import { Icon } from './Icon';

export function TopicRow({ topic: t, query = '' }: { topic: Topic; query?: string }) {
  return (
    <a className="trow" href={href.topic(t.id)}>
      <span className="st st-new" title="Nieprzeczytane"><Icon name="circle" /><span className="sr-only">Nieprzeczytane</span></span>
      {query ? <Html as="h3" html={highlight(escapeHtml(t.title), query)} /> : <h3>{t.title}</h3>}
      <span className="meta">
        <span className={`level level-${t.level}`}>{t.level}</span>
        <span className="pill">{t.qa.length} {plural(t.qa.length, 'pytanie', 'pytania', 'pytań')}</span>
      </span>
      <Html as="p" html={query ? highlight(t.summary, query) : t.summary} />
    </a>
  );
}
