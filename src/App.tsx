import { useEffect, useLayoutEffect, useRef } from 'react';
import { Icon } from './components/Icon';
import { Rail, type RailItem } from './components/Rail';
import { SearchBox } from './components/SearchBox';
import { CATEGORIES, CATEGORY, TOPIC, TOPICS } from './data';
import { href, lastPageHash, parseHash, useHash, type Route } from './lib/router';
import { useTheme } from './lib/theme';
import { levelOk, useLevel } from './state';
import { CategoryView } from './views/CategoryView';
import { HomeView } from './views/HomeView';
import { NotFoundView } from './views/NotFoundView';
import { SearchView } from './views/SearchView';
import { TopicView } from './views/TopicView';

export function App() {
  const hash = useHash();
  const route = parseHash(hash);
  const { theme, toggle } = useTheme();
  const main = useRef<HTMLElement>(null);

  const view = route.name === 'topic' && TOPIC[route.id] ? 'topic' : 'library';
  useEffect(() => { document.body.dataset.view = view; }, [view]);

  // A new page starts at the top with focus on the content, except while typing a search query.
  const pageKey = route.name === 'search' ? 'search' : hash;
  useLayoutEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    if (document.activeElement?.id !== 'q') main.current?.focus({ preventScroll: true });
  }, [pageKey]);

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
            <SearchBox key={lastPageHash()} query={route.name === 'search' ? route.q : null} />
            <button className="icon-btn" type="button" onClick={toggle} aria-label={theme === 'dark' ? 'Włącz jasny motyw' : 'Włącz ciemny motyw'}>
              <Icon name={theme === 'dark' ? 'sun' : 'moon'} />
            </button>
          </div>
        </div>
      </header>
      <div className="shell">
        <LibraryRail route={route} />
        <main id="main" ref={main} tabIndex={-1} key={pageKey}>
          <Page route={route} />
        </main>
      </div>
    </>
  );
}

function LibraryRail({ route }: { route: Route }) {
  const level = useLevel();
  const active = route.name === 'category' ? route.id : route.name === 'topic' ? TOPIC[route.id]?.category : undefined;
  const visible = TOPICS.filter((t) => levelOk(level, t.level));
  const items: RailItem[] = [
    { key: '', label: 'Start', count: String(visible.length), current: !active && route.name === 'home', href: href.home() },
    ...CATEGORIES.map((c) => ({
      key: c.id, label: c.name, hue: c.hue, current: active === c.id, href: href.category(c.id),
      count: String(visible.filter((t) => t.category === c.id).length),
    })),
  ];
  return <Rail items={items} unit="zagadnienia" showLevel />;
}

function Page({ route }: { route: Route }) {
  if (route.name === 'home') return <HomeView />;
  if (route.name === 'category' && CATEGORY[route.id]) return <CategoryView category={CATEGORY[route.id]} />;
  if (route.name === 'topic' && TOPIC[route.id]) return <TopicView topic={TOPIC[route.id]} />;
  if (route.name === 'search') return <SearchView q={route.q} />;
  return <NotFoundView />;
}
