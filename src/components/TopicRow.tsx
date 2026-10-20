import type { Topic } from '../data';
import { href } from '../lib/router';
import { plural } from '../lib/text';
import { Html } from './Html';
import { Icon } from './Icon';

export function TopicRow({ topic: t }: { topic: Topic }) {
  return (
    <a className="trow" href={href.topic(t.id)}>
      <span className="st st-new" title="Nieprzeczytane"><Icon name="circle" /><span className="sr-only">Nieprzeczytane</span></span>
      <h3>{t.title}</h3>
      <span className="meta">
        <span className={`level level-${t.level}`}>{t.level}</span>
        <span className="pill">{t.qa.length} {plural(t.qa.length, 'pytanie', 'pytania', 'pytań')}</span>
      </span>
      <Html as="p" html={t.summary} />
    </a>
  );
}
