import { QaItem } from '../components/QaItem';
import { CATEGORIES, CATEGORY, hueVar, QA } from '../data';
import { href, navigate, type QaFilter } from '../lib/router';
import { plural } from '../lib/text';
import { useTitle } from '../lib/useTitle';
import { useUserData } from '../lib/userData';
import { levelOk, useLevel } from '../state';

const FILTERS: [QaFilter, string][] = [['all', 'Wszystkie'], ['new', 'Bez oceny'], ['review', 'Do powtórki'], ['known', 'Umiem']];

export function QaView({ cat, status }: { cat: string | null; status: QaFilter }) {
  const category = cat ? CATEGORY[cat] : undefined;
  useTitle(category ? `Pytania: ${category.name}` : 'Pytania z rozmów');
  const level = useLevel();
  const marks = useUserData((d) => d.qaStatus);
  const scope = QA.filter((q) => levelOk(level, q.level) && (!category || q.category === category.id));
  const items = scope.filter((q) => status === 'all' || (marks[q.id] ?? 'new') === status);
  const known = scope.filter((q) => marks[q.id] === 'known').length;
  const review = scope.filter((q) => marks[q.id] === 'review').length;
  const groups = CATEGORIES.map((c) => ({ c, list: items.filter((q) => q.category === c.id), all: scope.filter((q) => q.category === c.id) }))
    .filter((g) => g.list.length);
  const toggleAll = (open: boolean) => document.querySelectorAll<HTMLDetailsElement>('main .qa details').forEach((d) => (d.open = open));

  return (
    <>
      <div className="view-head">
        <h1>{category ? `Pytania: ${category.name}` : 'Pytania z rozmów'}</h1>
        <p className="lede">
          {scope.length} {plural(scope.length, 'pytanie', 'pytania', 'pytań')}. Odpowiedz na głos, zanim rozwiniesz odpowiedź, i oceń się.
          Tak ćwiczysz przywoływanie z pamięci, a nie rozpoznawanie.
        </p>
        <p className="qa-summary">
          <span>Umiem: {known} z {scope.length}</span><span>Do powtórki: {review}</span><span>Bez oceny: {scope.length - known - review}</span>
        </p>
        <div className="head-actions">
          <div className="seg" role="group" aria-label="Pokaż pytania">
            {FILTERS.map(([v, label]) => (
              <button key={v} type="button" aria-pressed={status === v} onClick={() => navigate(href.qa(cat, v), { replace: true })}>{label}</button>
            ))}
          </div>
          <button className="btn" type="button" onClick={() => toggleAll(true)}>Rozwiń wszystkie</button>
          <button className="btn ghost" type="button" onClick={() => toggleAll(false)}>Zwiń wszystkie</button>
        </div>
      </div>
      {groups.length ? groups.map((g) => (
        <section key={g.c.id} className="qa-group" aria-labelledby={`h-qa-${g.c.id}`}>
          <h2 id={`h-qa-${g.c.id}`}>
            <span className="swatch" style={{ background: hueVar(g.c.hue) }} />{g.c.name}
            <span className="pill">umiem {g.all.filter((q) => marks[q.id] === 'known').length}/{g.all.length}</span>
          </h2>
          <div className="qa">{g.list.map((q) => <QaItem key={q.id} item={q} withTopic />)}</div>
        </section>
      )) : (
        <div className="empty"><b>Brak pytań dla wybranych filtrów</b>Zmień status, poziom lub kategorię.</div>
      )}
    </>
  );
}
