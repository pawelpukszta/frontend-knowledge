import { useEffect, useLayoutEffect, useRef } from 'react';
import { Icon } from './components/Icon';
import { Rail, type RailItem } from './components/Rail';
import { SearchBox } from './components/SearchBox';
import { CATEGORIES, CATEGORY, QA, TOPIC, TOPICS } from './data';
import { href, lastPageHash, parseHash, useHash, type Route } from './lib/router';
import { useStore } from './lib/store';
import { useTheme } from './lib/theme';
import { loadProblem, setLastView, useUserData } from './lib/userData';
import { levelOk, useLevel } from './state';
import { CategoryView } from './views/CategoryView';
import { HomeView, type Mode } from './views/HomeView';
import { NotFoundView } from './views/NotFoundView';
import { QaView } from './views/QaView';
import { ReviewView } from './views/ReviewView';
import { SearchView } from './views/SearchView';
import { TopicView } from './views/TopicView';

type ModeId = 'library' | 'pytania';

const modeOf = (r: Route): ModeId => (r.name === 'qa' ? 'pytania' : 'library');

export function App() {
  const hash = useHash();
  const route = parseHash(hash);
  const mode = modeOf(route);
  const { theme, toggle } = useTheme();
  const level = useLevel();
  const problem = useStore(loadProblem, (p) => p);
  const main = useRef<HTMLElement>(null);

  const view = route.name === 'topic' && TOPIC[route.id] ? 'topic' : mode;
  useEffect(() => { document.body.dataset.view = view; }, [view]);
  useEffect(() => { if (route.name !== 'search' && route.name !== 'notFound') setLastView(hash || href.home()); }, [hash, route.name]);

  // A new page starts at the top with focus on the content; typing a query or switching a filter is not a new page.
  const pageKey = route.name === 'search' ? 'search' : route.name === 'qa' ? `qa:${route.cat}` : hash;
  useLayoutEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    if (document.activeElement?.id !== 'q') main.current?.focus({ preventScroll: true });
  }, [pageKey]);

  const qaCount = QA.filter((q) => levelOk(level, q.level)).length;
  const tabs: { id: ModeId; label: string; href: string; count?: number }[] = [
    { id: 'library', label: 'Biblioteka', href: href.home() },
    { id: 'pytania', label: 'Pytania', href: href.qa(), count: qaCount },
  ];
  const modes: Mode[] = [
    { href: href.qa(), icon: 'question', title: 'Pytania z rozmów', desc: 'Odpowiedz na głos, porównaj z modelową odpowiedzią i oceń się.', count: qaCount, color: 'var(--c-purple)', on: 'var(--on-purple)' },
  ];

  return (
    <>
      <a className="skip-link" href="#main" onClick={(e) => { e.preventDefault(); main.current?.focus(); }}>Przejdź do treści</a>
      <header className="bar">
        <div className="bar-inner">
          <a className="brand" href={href.home()}>Baza wiedzy FE</a>
          <nav className="tabs" aria-label="Tryb">
            {tabs.map((t) => (
              <a key={t.id} className="tab" data-mode={t.id} href={t.href} aria-current={mode === t.id ? 'page' : undefined}>
                {t.label}{t.count !== undefined && <span className="count">{t.count}</span>}
              </a>
            ))}
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
        {route.name === 'qa' ? <QaRail cat={route.cat} /> : <LibraryRail route={route} />}
        <main id="main" ref={main} tabIndex={-1} key={pageKey}>
          {problem && (
            <div className="load-problem" role="alert">
              <span>{problem}</span>
              <button className="btn" type="button" onClick={() => loadProblem.set(() => null)}>Rozumiem</button>
            </div>
          )}
          <Page route={route} modes={modes} />
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

function QaRail({ cat }: { cat: string | null }) {
  const level = useLevel();
  const marks = useUserData((d) => d.qaStatus);
  const visible = QA.filter((q) => levelOk(level, q.level));
  const count = (list: typeof QA) => `${list.filter((q) => marks[q.id] === 'known').length}/${list.length}`;
  const items: RailItem[] = [
    { key: '', label: 'Wszystkie kategorie', count: count(visible), current: !cat, href: href.qa() },
    ...CATEGORIES.map((c) => ({
      key: c.id, label: c.name, hue: c.hue, current: cat === c.id, href: href.qa(c.id),
      count: count(visible.filter((q) => q.category === c.id)),
    })),
  ];
  return <Rail items={items} unit="umiem / pytania" showLevel />;
}

function Page({ route, modes }: { route: Route; modes: Mode[] }) {
  if (route.name === 'home') return <HomeView modes={modes} />;
  if (route.name === 'category' && CATEGORY[route.id]) return <CategoryView category={CATEGORY[route.id]} />;
  if (route.name === 'topic' && TOPIC[route.id]) return <TopicView topic={TOPIC[route.id]} />;
  if (route.name === 'search') return <SearchView q={route.q} />;
  if (route.name === 'qa') return <QaView cat={route.cat && CATEGORY[route.cat] ? route.cat : null} status={route.status} />;
  if (route.name === 'review') return <ReviewView />;
  return <NotFoundView />;
}
