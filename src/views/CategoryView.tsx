import type { CSSProperties } from 'react';
import { Icon } from '../components/Icon';
import { TopicRow } from '../components/TopicRow';
import { TOPIC, type Category } from '../data';
import { href } from '../lib/router';
import { useTitle } from '../lib/useTitle';
import { levelOk, useLevel } from '../state';

export function CategoryView({ category: c }: { category: Category }) {
  useTitle(c.name);
  const level = useLevel();
  const topics = c.topics.map((id) => TOPIC[id]).filter((t) => levelOk(level, t.level));
  return (
    <>
      <nav className="crumbs" aria-label="Ścieżka"><a href={href.home()}>Start</a><span aria-hidden="true">/</span><span>{c.name}</span></nav>
      <div className="view-head" style={{ '--mode': `var(--hue-${c.hue})` } as CSSProperties}>
        <h1>{c.name}</h1>
        <p className="lede">{c.desc}</p>
        <div className="head-actions">
          <a className="btn" href={href.qa(c.id)}><Icon name="question" />Pytania z kategorii</a>
          <a className="btn" href={href.quiz(c.id)}><Icon name="exam" />Quiz z kategorii</a>
          <a className="btn" href={href.flash(c.id)}><Icon name="cards" />Fiszki z kategorii</a>
        </div>
      </div>
      {topics.length
        ? <div className="tlist">{topics.map((t) => <TopicRow key={t.id} topic={t} />)}</div>
        : <div className="empty"><b>Brak zagadnień na poziomie {level}</b>Zmień filtr poziomu w panelu bocznym.</div>}
    </>
  );
}
