import type { CSSProperties } from 'react';
import { TopicRow } from '../components/TopicRow';
import { TOPIC, type Category } from '../data';
import { href } from '../lib/router';
import { useTitle } from '../lib/useTitle';

export function CategoryView({ category: c }: { category: Category }) {
  useTitle(c.name);
  const topics = c.topics.map((id) => TOPIC[id]);
  return (
    <>
      <nav className="crumbs" aria-label="Ścieżka"><a href={href.home()}>Start</a><span aria-hidden="true">/</span><span>{c.name}</span></nav>
      <div className="view-head" style={{ '--mode': `var(--hue-${c.hue})` } as CSSProperties}>
        <h1>{c.name}</h1>
        <p className="lede">{c.desc}</p>
      </div>
      <div className="tlist">{topics.map((t) => <TopicRow key={t.id} topic={t} />)}</div>
    </>
  );
}
