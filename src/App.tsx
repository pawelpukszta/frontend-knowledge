import type { CSSProperties } from 'react';
import { useEffect, useLayoutEffect, useRef } from 'react';
import { Icon } from './components/Icon';
import { CATEGORIES, CATEGORY, hueOn, hueVar, TOPIC, TOPICS } from './data';
import { href, parseHash, useHash, type Route } from './lib/router';
import { useTheme } from './lib/theme';
import { CategoryView } from './views/CategoryView';
import { HomeView } from './views/HomeView';
import { NotFoundView } from './views/NotFoundView';
import { TopicView } from './views/TopicView';

export function App() {
  const hash = useHash();
  const route = parseHash(hash);
  const { theme, toggle } = useTheme();
  const main = useRef<HTMLElement>(null);

  const view = route.name === 'topic' && TOPIC[route.id] ? 'topic' : 'library';
  useEffect(() => { document.body.dataset.view = view; }, [view]);

  // A new page starts at the top, with focus on the content for keyboard and screen reader users.
  useLayoutEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    main.current?.focus({ preventScroll: true });
  }, [hash]);

  const activeCat = route.name === 'category' ? route.id : route.name === 'topic' ? TOPIC[route.id]?.category : undefined;

  return (
    <>
      <a className="skip-link" href="#main" onClick={(e) => { e.preventDefault(); main.current?.focus(); }}>Przejdź do treści</a>
      <header className="bar">
        <div className="bar-inner">
          <a className="brand" href={href.home()}>Baza wiedzy FE</a>
          <nav className="tabs" aria-label="Tryb">
            <a className="tab" data-mode="library" href={href.home()} aria-current="page">Biblioteka</a>
          </nav>
          <div className="bar-tools">
            <button className="icon-btn" type="button" onClick={toggle} aria-label={theme === 'dark' ? 'Włącz jasny motyw' : 'Włącz ciemny motyw'}>
              <Icon name={theme === 'dark' ? 'sun' : 'moon'} />
            </button>
          </div>
        </div>
      </header>
      <div className="shell">
        <aside className="rail" aria-label="Kategorie">
          <div>
            <p className="rail-label"><span>Kategorie</span><span className="unit">zagadnienia</span></p>
            <ul>
              <li>
                <a className="cat-link" href={href.home()} aria-current={!activeCat}>
                  <span className="swatch" style={{ background: 'var(--surface-2)' }} />Start<span className="n">{TOPICS.length}</span>
                </a>
              </li>
              {CATEGORIES.map((c) => (
                <li key={c.id}>
                  <a className="cat-link" href={href.category(c.id)} aria-current={activeCat === c.id}
                    style={{ '--cat': hueVar(c.hue), '--cat-on': hueOn(c.hue) } as CSSProperties}>
                    <span className="swatch" style={{ background: hueVar(c.hue) }} />{c.name}<span className="n">{c.topics.length}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </aside>
        <main id="main" ref={main} tabIndex={-1} key={hash}>
          <Page route={route} />
        </main>
      </div>
    </>
  );
}

function Page({ route }: { route: Route }) {
  if (route.name === 'home') return <HomeView />;
  if (route.name === 'category' && CATEGORY[route.id]) return <CategoryView category={CATEGORY[route.id]} />;
  if (route.name === 'topic' && TOPIC[route.id]) return <TopicView topic={TOPIC[route.id]} />;
  return <NotFoundView />;
}
