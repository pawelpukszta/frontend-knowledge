import { useEffect, useRef, useState } from 'react';
import { Html } from '../components/Html';
import { Icon } from '../components/Icon';
import { CATEGORY, hueVar, QA, type Qa } from '../data';
import { shuffle } from '../lib/quiz';
import { href } from '../lib/router';
import { useTitle } from '../lib/useTitle';
import { setQaMark } from '../lib/userData';
import { levelOk, useLevel } from '../state';

const SWIPE_PX = 60;

/**
 * Flashcards over interview questions. "Umiem" / "Powtórz" set the same status as the questions view.
 * The parent keys this view by category and level, so a new filter deals a new deck.
 */
export function FlashView({ cat, random = Math.random }: { cat: string | null; random?: () => number }) {
  const category = cat ? CATEGORY[cat] : undefined;
  useTitle(category ? `Fiszki: ${category.name}` : 'Fiszki');
  const level = useLevel();
  const newDeck = () => shuffle(QA.filter((q) => levelOk(level, q.level) && (!category || q.category === category.id)), random);
  const [deck, setDeck] = useState<Qa[]>(newDeck);
  const [total, setTotal] = useState(deck.length);
  const [known, setKnown] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const cardRef = useRef<HTMLButtonElement>(null);
  const swipe = useRef<{ x: number; moved: boolean } | null>(null);
  const card = deck[0];

  const reset = () => { const d = newDeck(); setDeck(d); setTotal(d.length); setKnown(0); setFlipped(false); };

  const answer = (isKnown: boolean) => {
    if (!card) return;
    setQaMark(card.id, isKnown ? 'known' : 'review');
    setDeck((d) => (isKnown ? d.slice(1) : [...d.slice(1), d[0]]));
    if (isKnown) setKnown((k) => k + 1);
    setFlipped(false);
    cardRef.current?.focus();
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement;
      if (e.metaKey || e.ctrlKey || e.altKey || /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName)) return;
      if (e.key === 'ArrowRight') answer(true);
      else if (e.key === 'ArrowLeft') answer(false);
      // Space flips the card unless another button has focus (then Space presses that button).
      else if (e.key === ' ' && (el.tagName !== 'BUTTON' || el === cardRef.current)) {
        e.preventDefault();
        setFlipped((f) => !f);
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  });

  const head = (
    <div className="view-head">
      <h1>{category ? `Fiszki: ${category.name}` : 'Fiszki'}</h1>
      <p className="lede">Przeczytaj pytanie, odpowiedz w myślach, odwróć kartę i oceń się. Karty oznaczone „Powtórz” wracają na koniec talii.</p>
    </div>
  );

  if (!card) {
    return (
      <>
        {head}
        <div className="panel" role="status">
          <p className="score">{known}/{total}</p>
          <p>{total ? 'Talia przerobiona.' : 'Brak pytań dla wybranych filtrów.'} Zacznij od nowa albo wybierz inną kategorię w panelu bocznym.</p>
          <div className="row-end"><span /><button className="btn primary" type="button" onClick={reset}><Icon name="shuffle" />Nowa talia</button></div>
        </div>
      </>
    );
  }

  const c = CATEGORY[card.category];
  return (
    <>
      {head}
      <div className="flash-wrap">
        <div className="flash-meta"><span>Umiem: {known} z {total}</span><span>W talii: {deck.length}</span></div>
        <div className="progress" role="progressbar" aria-label="Opanowane karty" aria-valuemin={0} aria-valuemax={total} aria-valuenow={known}>
          <span style={{ width: `${(known / (total || 1)) * 100}%` }} />
        </div>
        <div
          className="flash-area"
          onPointerDown={(e) => { if (e.pointerType !== 'mouse') swipe.current = { x: e.clientX, moved: false }; }}
          onPointerUp={(e) => {
            if (!swipe.current) return;
            const dx = e.clientX - swipe.current.x;
            if (Math.abs(dx) > SWIPE_PX) { swipe.current.moved = true; answer(dx > 0); }
          }}
          onClickCapture={(e) => { if (swipe.current?.moved) e.stopPropagation(); swipe.current = null; }}
        >
          {flipped ? (
            // The answer can hold links and code with copy buttons, so the back is not a button itself.
            <div className="flashcard is-back">
              <span className="side">
                <b>Odpowiedź</b>
                <button ref={cardRef} className="btn ghost" type="button" onClick={() => setFlipped(false)}>Wróć do pytania</button>
              </span>
              <Html as="span" className="asked" html={card.q} />
              <Html className="back prose" html={card.a} />
            </div>
          ) : (
            <button ref={cardRef} className="flashcard" type="button" onClick={() => setFlipped(true)} aria-describedby="flash-hint">
              <span className="side">
                <b>Pytanie</b>
                <span><span className="swatch" style={{ background: hueVar(c.hue) }} />{c.short}, {card.level}</span>
              </span>
              <Html as="span" className="front" html={card.q} />
              <span className="hint" id="flash-hint">Naciśnij kartę lub <kbd>Spacja</kbd>, aby zobaczyć odpowiedź. Na ekranie dotykowym przesuń w prawo („Umiem”) lub w lewo („Powtórz”).</span>
            </button>
          )}
        </div>
        <div className="flash-controls">
          <a className="btn ghost" href={href.topic(card.topic)}><Icon name="book" />Otwórz zagadnienie</a>
          <span className="btns">
            <button className="btn" type="button" onClick={() => answer(false)}><Icon name="undo" />Powtórz <kbd>←</kbd></button>
            <button className="btn primary" type="button" onClick={() => answer(true)}><Icon name="check" />Umiem <kbd>→</kbd></button>
          </span>
        </div>
        <p style={{ marginTop: 20 }}><button className="btn ghost" type="button" onClick={reset}><Icon name="shuffle" />Przetasuj od nowa</button></p>
      </div>
    </>
  );
}
