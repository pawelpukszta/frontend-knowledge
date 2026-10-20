import { act, fireEvent, render, screen, within } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import { CL_RULES, QA, QUIZ } from '../data';
import { buildQuiz, rng, scoreQuiz, shuffle } from '../lib/quiz';
import { emptyDoc, userData } from '../lib/userData';
import { ChecklistView } from './ChecklistView';
import { FlashView } from './FlashView';
import { QuizView } from './QuizView';

beforeEach(() => userData.set(() => emptyDoc()));
const click = (el: HTMLElement) => act(() => el.click());

describe('quiz', () => {
  it('runs a seeded quiz, scores it, announces the result and sends mistakes to review', () => {
    const pool = QUIZ.filter((q) => q.category === 'js');
    const expected = buildQuiz(pool, 5, rng(123));
    render(<QuizView cat="js" random={rng(123)} />);
    click(screen.getByRole('button', { name: '5' }));
    click(screen.getByRole('button', { name: /Rozpocznij quiz/ }));

    const picks: number[] = [];
    for (const item of expected) {
      expect(document.querySelector('.quiz-q')!.innerHTML).toBe(item.q);
      act(() => { fireEvent.keyDown(document, { key: '1' }); }); // first displayed option
      picks.push(item.order[0]);
      expect(document.querySelector('.feedback')!.textContent).toMatch(/Dobrze!|Nie tym razem/);
      click(screen.getByRole('button', { name: /Następne pytanie|Zobacz wynik/ }));
    }

    const { score, total, wrong } = scoreQuiz(expected, picks);
    expect(screen.getByText(`${score}/${total}`, { exact: false })).toBeInTheDocument();
    expect(screen.getAllByRole('status').some((el) => el.textContent?.startsWith(`Wynik quizu: ${score} z ${total}`))).toBe(true);
    for (const w of wrong) expect(userData.get().topicStatus[w.topic]).toBe('review');
    expect(userData.get().quizResults[0]).toMatchObject({ score, total, categories: ['js'] });
  });
});

describe('flashcards', () => {
  it('shares the status with interview questions', () => {
    const card = shuffle(QA.filter((q) => q.category === 'js'), rng(5))[0];
    render(<FlashView cat="js" random={rng(5)} />);
    expect(document.querySelector('.flashcard .front')!.innerHTML).toBe(card.q);
    act(() => { fireEvent.keyDown(document.body, { key: ' ' }); });
    expect(screen.getByText('Odpowiedź')).toBeInTheDocument();
    click(screen.getByRole('button', { name: /Umiem/ }));
    expect(userData.get().qaStatus[card.id]).toBe('known');
    expect(screen.getByText(/Umiem: 1 z/)).toBeInTheDocument();
  });
});

describe('checklist', () => {
  it('ticks a rule, updates progress and resets only the chosen scope after confirmation', () => {
    const other = CL_RULES.find((r) => r.category !== 'html')!;
    userData.set((d) => ({ ...d, checklist: { ...d.checklist, done: [other.key] } }));
    const html = CL_RULES.filter((r) => r.category === 'html');
    render(<ChecklistView cat="html" />);
    const box = screen.getAllByRole('checkbox')[0];
    act(() => { fireEvent.click(box); });
    expect(screen.getByText(`1 z ${html.length}`)).toBeInTheDocument();
    expect(userData.get().checklist.done).toContain(html[0].key);

    click(screen.getByRole('button', { name: 'Wyczyść postęp' }));
    const confirm = screen.getByRole('alert');
    expect(confirm).toHaveTextContent('tej kategorii');
    click(within(confirm).getByRole('button', { name: 'Tak, wyczyść' }));
    expect(userData.get().checklist.done).toEqual([other.key]);
  });

  it('credits the Front-End Checklist (MIT) and links each rule to the original', () => {
    render(<ChecklistView cat={null} />);
    expect(screen.getByText(/licencja MIT/)).toBeInTheDocument();
    expect(document.querySelector(`a[href="${CL_RULES[0].url}"]`)).not.toBeNull();
  });
});
