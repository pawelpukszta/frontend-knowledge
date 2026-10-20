import { QaItem } from '../components/QaItem';
import { TopicRow } from '../components/TopicRow';
import { searchQuestions, searchTopics } from '../lib/search';
import { plural } from '../lib/text';
import { useTitle } from '../lib/useTitle';
import { levelOk, useLevel } from '../state';

export function SearchView({ q }: { q: string }) {
  useTitle(`Szukaj: ${q}`);
  const level = useLevel();
  const topics = searchTopics(q).filter((t) => levelOk(level, t.level));
  const questions = searchQuestions(q).filter((x) => levelOk(level, x.level)).slice(0, 8);
  return (
    <>
      <div className="view-head">
        <h1>Wyniki dla „{q}”</h1>
        <p className="lede" role="status">
          {topics.length} {plural(topics.length, 'zagadnienie', 'zagadnienia', 'zagadnień')}
          {level !== 'all' && ` na poziomie ${level}`}. <kbd>Esc</kbd> czyści wyszukiwanie.
        </p>
      </div>
      {topics.length
        ? <div className="tlist">{topics.map((t) => <TopicRow key={t.id} topic={t} query={q} />)}</div>
        : <div className="empty"><b>Nic nie znaleziono</b>Spróbuj innego słowa, np. „promise”, „hydration”, „aria”.</div>}
      {questions.length > 0 && (
        <section className="block qa-group" aria-labelledby="h-qa-hits">
          <h2 id="h-qa-hits">Pasujące pytania z rozmów</h2>
          <div className="qa">{questions.map((x) => <QaItem key={x.id} item={x} withTopic />)}</div>
        </section>
      )}
    </>
  );
}
