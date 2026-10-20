import { useEffect, useRef, useState } from 'react';
import { Html } from '../components/Html';
import { Icon } from '../components/Icon';
import { CATEGORIES, CATEGORY, hueVar, QUIZ, TOPIC, type Quiz } from '../data';
import { buildQuiz, scoreQuiz, type SessionItem } from '../lib/quiz';
import { href } from '../lib/router';
import { plural } from '../lib/text';
import { useTitle } from '../lib/useTitle';
import { addQuizResult, setTopicMark } from '../lib/userData';
import { levelOk, useLevel } from '../state';

interface Session { items: SessionItem<Quiz & { level: string }>[]; picks: number[]; i: number; categories: string[] }

const COUNTS = [5, 10, 20, 0];
const withLevel = QUIZ.map((q) => ({ ...q, level: TOPIC[q.topic].level }));

/** Quiz: configuration, one question at a time with feedback, then the result with mistakes. */
export function QuizView({ cat, random = Math.random }: { cat: string | null; random?: () => number }) {
  useTitle('Quiz');
  const level = useLevel();
  const [cats, setCats] = useState<string[]>(cat && CATEGORY[cat] ? [cat] : []);
  const [count, setCount] = useState(10);
  const [session, setSession] = useState<Session | null>(null);
  const pool = withLevel.filter((q) => levelOk(level, q.level as 'mid' | 'senior') && (!cats.length || cats.includes(q.category)));

  const start = () => setSession({ items: buildQuiz(pool, count, random), picks: [], i: 0, categories: cats });

  if (!session) {
    const toggleCat = (id: string) => setCats((cs) => (cs.includes(id) ? cs.filter((c) => c !== id) : [...cs, id]));
    return (
      <>
        <div className="view-head">
          <h1>Quiz</h1>
          <p className="lede">Pytania jednokrotnego wyboru. Po każdej odpowiedzi zobaczysz wyjaśnienie, a błędy trafią na listę do powtórki.</p>
        </div>
        <div className="panel">
          <div className="field">
            <span id="quiz-cats">Kategorie</span>
            <div className="chips" role="group" aria-labelledby="quiz-cats">
              <button className="chip" type="button" aria-pressed={!cats.length} onClick={() => setCats([])}>Wszystkie</button>
              {CATEGORIES.map((c) => (
                <button key={c.id} className="chip" type="button" aria-pressed={cats.includes(c.id)} onClick={() => toggleCat(c.id)}>
                  <span className="swatch" style={{ background: hueVar(c.hue) }} />{c.short}
                </button>
              ))}
            </div>
          </div>
          <div className="field">
            <span id="quiz-count">Liczba pytań</span>
            <div className="chips" role="group" aria-labelledby="quiz-count">
              {COUNTS.map((n) => (
                <button key={n} className="chip" type="button" aria-pressed={count === n} onClick={() => setCount(n)}>{n || 'Wszystkie'}</button>
              ))}
            </div>
          </div>
          <div className="row-end">
            <span className="muted">Dostępne pytania: {pool.length}{level !== 'all' && ` (poziom ${level})`}</span>
            <button className="btn primary" type="button" disabled={!pool.length} onClick={start}>Rozpocznij quiz<Icon name="arrowRight" /></button>
          </div>
        </div>
      </>
    );
  }

  const finished = session.i >= session.items.length;
  const r = finished ? scoreQuiz(session.items, session.picks) : null;
  return (
    <>
      {finished
        ? <QuizResult session={session} onAgain={start} onSetup={() => setSession(null)} />
        : <QuizQuestion key={session.i} session={session} setSession={setSession} />}
      {/* Stays mounted while the quiz runs, so the result is announced when it appears. */}
      <p className="sr-only" role="status">{r ? `Wynik quizu: ${r.score} z ${r.total} ${plural(r.total, 'pytania', 'pytań', 'pytań')}.` : ''}</p>
    </>
  );
}

function QuizQuestion({ session, setSession }: { session: Session; setSession: (s: Session | null) => void }) {
  const item = session.items[session.i];
  const picked = session.picks[session.i];
  const answered = picked !== undefined;
  const done = session.i + (answered ? 1 : 0);
  const score = session.picks.filter((p, n) => p === session.items[n].answer).length;
  const next = useRef<HTMLButtonElement>(null);

  const pick = (opt: number) => {
    if (answered) return;
    if (opt !== item.answer) setTopicMark(item.topic, 'review'); // a wrong answer sends the topic back to review
    const picks = [...session.picks];
    picks[session.i] = opt;
    const s = { ...session, picks };
    if (picks.length === s.items.length) {
      const r = scoreQuiz(s.items, picks);
      addQuizResult({ at: new Date().toISOString(), score: r.score, total: r.total, categories: s.categories });
    }
    setSession(s);
  };

  useEffect(() => { if (answered) next.current?.focus(); }, [answered]);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey || /^(INPUT|TEXTAREA|SELECT)$/.test((e.target as HTMLElement).tagName)) return;
      const n = Number(e.key);
      if (!answered && n >= 1 && n <= item.order.length) pick(item.order[n - 1]);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  });

  return (
    <>
      <h1 className="sr-only">Quiz</h1>
      <div className="quiz-meta">
        <span><span className="swatch" style={{ background: hueVar(CATEGORY[item.category].hue) }} />{CATEGORY[item.category].name}</span>
        <span>Pytanie {session.i + 1} z {session.items.length}, wynik {score}/{done}</span>
      </div>
      <div className="panel">
        <div className="progress" role="progressbar" aria-label="Postęp quizu" aria-valuemin={0} aria-valuemax={session.items.length} aria-valuenow={done}>
          <span style={{ width: `${(done / session.items.length) * 100}%` }} />
        </div>
        <Html as="p" className="quiz-q" html={item.q} />
        <div className="options">
          {item.order.map((oi, n) => {
            const cls = answered ? (oi === item.answer ? 'correct' : oi === picked ? 'wrong' : '') : '';
            return (
              <button key={oi} className={`option ${cls}`} type="button" disabled={answered} onClick={() => pick(oi)}>
                <span className="k">{n + 1}</span>
                <Html as="span" html={item.options[oi]} />
                <span className="res">
                  {cls === 'correct' && <><Icon name="check" /><span className="sr-only">Poprawna odpowiedź</span></>}
                  {cls === 'wrong' && <><Icon name="x" /><span className="sr-only">Twoja odpowiedź, błędna</span></>}
                </span>
              </button>
            );
          })}
        </div>
        <div role="status">
          {answered && (
            <div className={`feedback ${picked === item.answer ? 'ok' : 'no'}`}>
              <b>{picked === item.answer ? 'Dobrze!' : 'Nie tym razem. Zagadnienie trafiło do powtórki.'}</b>
              {item.explain && <Html as="span" html={item.explain} />}
              <p className="from"><a href={href.topic(item.topic)}>Powtórz zagadnienie: {TOPIC[item.topic].title}</a></p>
            </div>
          )}
        </div>
        <div className="row-end">
          <span className="hint">Klawisze <kbd>1</kbd>-<kbd>{item.order.length}</kbd> wybierają odpowiedź, <kbd>Enter</kbd> przechodzi dalej</span>
          <span className="btns">
            <button className="btn ghost" type="button" onClick={() => setSession(null)}>Zakończ</button>
            {answered && (
              <button ref={next} className="btn primary" type="button" onClick={() => setSession({ ...session, i: session.i + 1 })}>
                {session.i + 1 < session.items.length ? 'Następne pytanie' : 'Zobacz wynik'}<Icon name="arrowRight" />
              </button>
            )}
          </span>
        </div>
      </div>
    </>
  );
}

function QuizResult({ session, onAgain, onSetup }: { session: Session; onAgain: () => void; onSetup: () => void }) {
  const { score, total, wrong } = scoreQuiz(session.items, session.picks);
  const pct = Math.round((score / total) * 100);
  const verdict = pct >= 85 ? 'Bardzo dobry wynik. Ten materiał masz opanowany.'
    : pct >= 60 ? 'Solidnie. Powtórz zagadnienia z listy poniżej.' : 'Warto wrócić do materiału i spróbować ponownie.';
  const byTopic = [...new Map(wrong.map((w) => [w.topic, w])).values()];
  return (
    <>
      <div className="view-head"><h1>Wynik quizu</h1></div>
      <div className="panel">
        <p className="score">{score}/{total} <small>{pct}%</small></p>
        <p>{verdict}</p>
        {byTopic.length > 0 && (
          <>
            <h2 className="sec" style={{ marginTop: 24 }}>Do powtórki</h2>
            <p className="muted" style={{ margin: '0 0 4px' }}>Te zagadnienia są już na liście do powtórki na stronie startowej.</p>
            <ul className="mistakes">
              {byTopic.map((w) => (
                <li key={w.id}><a href={href.topic(w.topic)}><b>{TOPIC[w.topic].title}</b><Html as="span" html={w.q} /></a></li>
              ))}
            </ul>
          </>
        )}
        <div className="row-end">
          <button className="btn ghost" type="button" onClick={onSetup}>Zmień ustawienia</button>
          <button className="btn primary" type="button" onClick={onAgain}><Icon name="undo" />Jeszcze raz</button>
        </div>
      </div>
    </>
  );
}
