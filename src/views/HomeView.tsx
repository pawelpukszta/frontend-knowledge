import { Icon } from '../components/Icon';
import { CATEGORIES, catStyle, hueVar, TOPICS } from '../data';
import { href } from '../lib/router';
import { plural } from '../lib/text';
import { useTitle } from '../lib/useTitle';

export function HomeView() {
  useTitle();
  const first = TOPICS[0];
  return (
    <>
      <section className="home-intro">
        <h1>Co dziś powtarzasz?</h1>
        <p className="lede">{TOPICS.length} zagadnień front-end dla mid i senior. Każde ma wyjaśnienie, przykład kodu, pytania z rozmów i źródła.</p>
        {first && (
          <div className="head-actions">
            <a className="btn primary" href={href.topic(first.id)}>Zacznij naukę<Icon name="arrowRight" /></a>
          </div>
        )}
      </section>
      <section aria-labelledby="h-cats">
        <h2 className="sec" id="h-cats">Kategorie</h2>
        <div className="cat-index">
          {CATEGORIES.map((c) => {
            const ts = TOPICS.filter((t) => t.category === c.id);
            const qa = ts.reduce((n, t) => n + t.qa.length, 0);
            return (
              <a key={c.id} className="cat-item" href={href.category(c.id)} style={catStyle(c.id)}>
                <h3><span className="swatch" style={{ background: hueVar(c.hue) }} />{c.name}</h3>
                <p>{c.desc}</p>
                <span className="meta">
                  <b>{ts.length}</b> {plural(ts.length, 'zagadnienie', 'zagadnienia', 'zagadnień')}, <b>{qa}</b> {plural(qa, 'pytanie', 'pytania', 'pytań')}
                </span>
              </a>
            );
          })}
        </div>
      </section>
    </>
  );
}
