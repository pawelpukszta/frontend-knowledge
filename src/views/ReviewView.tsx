import { QaItem } from '../components/QaItem';
import { TopicRow } from '../components/TopicRow';
import { QA, TOPICS } from '../data';
import { href } from '../lib/router';
import { useTitle } from '../lib/useTitle';
import { useUserData } from '../lib/userData';
import { levelOk, useLevel } from '../state';

export function ReviewView() {
  useTitle('Do powtórki');
  const level = useLevel();
  const doc = useUserData((d) => d);
  const topics = TOPICS.filter((t) => doc.topicStatus[t.id] === 'review' && levelOk(level, t.level));
  const questions = QA.filter((q) => doc.qaStatus[q.id] === 'review' && levelOk(level, q.level));
  return (
    <>
      <nav className="crumbs" aria-label="Ścieżka"><a href={href.home()}>Start</a><span aria-hidden="true">/</span><span>Do powtórki</span></nav>
      <div className="view-head">
        <h1>Do powtórki</h1>
        <p className="lede">Zagadnienia i pytania oznaczone „Do powtórki” albo z błędną odpowiedzią w quizie. Gdy coś opanujesz, oznacz to jako „Umiem”.</p>
      </div>
      {topics.length + questions.length === 0 && (
        <div className="empty"><b>Nic do powtórki</b>Oznacz zagadnienie lub pytanie przyciskiem „Do powtórki”.</div>
      )}
      {topics.length > 0 && (
        <section className="qa-group" aria-labelledby="h-rev-topics">
          <h2 id="h-rev-topics">Zagadnienia <span className="pill">{topics.length}</span></h2>
          <div className="tlist">{topics.map((t) => <TopicRow key={t.id} topic={t} />)}</div>
        </section>
      )}
      {questions.length > 0 && (
        <section className="qa-group" aria-labelledby="h-rev-qa">
          <h2 id="h-rev-qa">Pytania <span className="pill">{questions.length}</span></h2>
          <div className="qa">{questions.map((q) => <QaItem key={q.id} item={q} withTopic />)}</div>
        </section>
      )}
    </>
  );
}
