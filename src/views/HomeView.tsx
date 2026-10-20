import type { CSSProperties } from 'react';
import { Icon } from '../components/Icon';
import { StatusIcon } from '../components/Status';
import { CATEGORIES, CATEGORY, catStyle, hueVar, QA, TOPIC, TOPICS } from '../data';
import type { IconName } from '../lib/icons';
import { href } from '../lib/router';
import { plural } from '../lib/text';
import { useTitle } from '../lib/useTitle';
import { useUserData } from '../lib/userData';
import { levelOk, useLevel } from '../state';

export interface Mode { href: string; icon: IconName; title: string; desc: string; count: number; color: string; on: string }

export function HomeView({ modes }: { modes: Mode[] }) {
  useTitle();
  const level = useLevel();
  const doc = useUserData((d) => d);
  const visible = TOPICS.filter((t) => levelOk(level, t.level));
  const qa = QA.filter((q) => levelOk(level, q.level));
  const read = visible.filter((t) => doc.seen.includes(t.id)).length;
  const known = visible.filter((t) => doc.topicStatus[t.id] === 'known').length;
  const review = visible.filter((t) => doc.topicStatus[t.id] === 'review');
  const qaKnown = qa.filter((q) => doc.qaStatus[q.id] === 'known').length;
  const qaReview = qa.filter((q) => doc.qaStatus[q.id] === 'review').length;
  const last = doc.lastTopic ? TOPIC[doc.lastTopic] : undefined;
  const start = last ?? visible.find((t) => !doc.seen.includes(t.id)) ?? visible[0];
  const pct = visible.length ? Math.round((read / visible.length) * 100) : 0;

  return (
    <>
      <section className="home-intro">
        <h1>Co dziś powtarzasz?</h1>
        <p className="lede">
          {visible.length} {plural(visible.length, 'zagadnienie', 'zagadnienia', 'zagadnień')} front-end
          {level === 'all' ? ' dla mid i senior' : ` na poziomie ${level}`}. Każde ma wyjaśnienie, przykład kodu, pytania z rozmów i źródła.
        </p>
        {start && (
          <div className="head-actions">
            <a className="btn primary" href={href.topic(start.id)}>{last ? 'Kontynuuj naukę' : 'Zacznij naukę'}<Icon name="arrowRight" /></a>
          </div>
        )}
      </section>
      <div className="home-grid">
        <section className="box" aria-labelledby="h-progress">
          <h2 className="sec" id="h-progress">Twój postęp</h2>
          <div className="progress-nums">
            <div><b>{read}<small>/{visible.length}</small></b><span><Icon name="eye" />przeczytane</span></div>
            <div className="pn-known"><b>{known}</b><span><Icon name="checkCircle" />umiem</span></div>
            <div className="pn-review"><b>{review.length}</b><span><Icon name="review" />do powtórki</span></div>
          </div>
          <div className="progress" role="progressbar" aria-label="Przeczytane zagadnienia" aria-valuemin={0} aria-valuemax={100} aria-valuenow={pct}>
            <span style={{ width: `${pct}%` }} />
          </div>
          <p className="qa-summary" aria-label="Pytania z rozmów">
            <span>Pytania: {qa.length}</span>
            <span className="k"><Icon name="checkCircle" />umiem {qaKnown}</span>
            <span className="r"><Icon name="review" />do powtórki {qaReview}</span>
          </p>
          {last && <p className="last-read">Ostatnio czytane: <a href={href.topic(last.id)}>{last.title}</a></p>}
          <div className="review-head">
            <h3>Do powtórki</h3>
            {review.length + qaReview > 0 && <a href={href.review()}>Wszystkie ({review.length + qaReview})</a>}
          </div>
          {review.length ? (
            <ul className="review-list">
              {review.slice(0, 5).map((t) => (
                <li key={t.id}>
                  <a href={href.topic(t.id)}>
                    <StatusIcon status="review" /><span>{t.title}</span><span className="cat-short">{CATEGORY[t.category].short}</span>
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <p className="empty-note">Pusto. Zagadnienia oznaczone jako „Do powtórki” i błędne odpowiedzi z quizu pojawią się tutaj.</p>
          )}
        </section>
        <section className="box" aria-labelledby="h-modes">
          <h2 className="sec" id="h-modes">Tryby nauki</h2>
          <ul className="modes">
            {modes.map((m) => (
              <li key={m.href}>
                <a href={m.href} style={{ '--m': m.color, '--m-on': m.on } as CSSProperties}>
                  <Icon name={m.icon} /><b>{m.title}</b><span className="pill">{m.count}</span><small>{m.desc}</small>
                </a>
              </li>
            ))}
          </ul>
        </section>
      </div>
      <section aria-labelledby="h-cats">
        <h2 className="sec" id="h-cats">Kategorie</h2>
        <div className="cat-index">
          {CATEGORIES.map((c) => {
            const ts = visible.filter((t) => t.category === c.id);
            const r = ts.filter((t) => doc.seen.includes(t.id)).length;
            const qs = qa.filter((q) => q.category === c.id);
            const qk = qs.filter((q) => doc.qaStatus[q.id] === 'known').length;
            return (
              <a key={c.id} className="cat-item" href={href.category(c.id)} style={catStyle(c.id)}>
                <h3><span className="swatch" style={{ background: hueVar(c.hue) }} />{c.name}</h3>
                <p>{c.desc}</p>
                <span className="meta"><b>{r} z {ts.length}</b> przeczytane, <b>{qk} z {qs.length}</b> pytań umiem</span>
              </a>
            );
          })}
        </div>
      </section>
    </>
  );
}
