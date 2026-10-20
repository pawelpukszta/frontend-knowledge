import { act, render, screen, within } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { App } from './App';
import { CATEGORIES, QA, TOPICS } from './data';
import { href } from './lib/router';
import { setLevel } from './state';

const go = (hash: string) => act(() => {
  location.hash = hash;
  window.dispatchEvent(new HashChangeEvent('hashchange'));
});

describe('library', () => {
  afterEach(() => { go('#/'); act(() => setLevel('all')); });

  it('shows categories on start and leads to a category and a topic', async () => {
    render(<App />);
    const cat = CATEGORIES[0];
    const card = screen.getAllByRole('link', { name: new RegExp(cat.name) }).find((a) => a.classList.contains('cat-item'))!;
    expect(within(card).getByText(String(cat.topics.length))).toBeInTheDocument();

    go(card.getAttribute('href')!);
    expect(screen.getByRole('heading', { level: 1, name: cat.name })).toBeInTheDocument();

    const topic = TOPICS.find((t) => t.id === cat.topics[0])!;
    go(`#/t/${topic.id}`);
    expect(screen.getByRole('heading', { level: 1, name: topic.title })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Źródła' })).toBeInTheDocument();
  });

  it('shows a not-found page for an unknown topic', () => {
    render(<App />);
    go('#/t/does-not-exist');
    expect(screen.getByText('Nie ma takiej strony')).toBeInTheDocument();
  });
});

describe('level filter and search', () => {
  afterEach(() => { go('#/'); act(() => setLevel('all')); });

  it('narrows the topic list of a category to the chosen level', () => {
    const cat = CATEGORIES.find((c) => new Set(c.topics.map((id) => TOPICS.find((t) => t.id === id)!.level)).size === 2)!;
    const seniors = TOPICS.filter((t) => t.category === cat.id && t.level === 'senior');
    render(<App />);
    go(href.category(cat.id));
    act(() => screen.getByRole('button', { name: 'Senior' }).click());
    const rows = document.querySelectorAll('main .trow');
    expect(rows).toHaveLength(seniors.length);
    expect(screen.getByRole('button', { name: 'Senior' })).toHaveAttribute('aria-pressed', 'true');
  });

  it('finds a topic by tag', () => {
    const t = TOPICS.find((x) => x.tags.length)!;
    render(<App />);
    go(href.search(t.tags[0]));
    expect(screen.getAllByRole('link').some((a) => a.getAttribute('href') === href.topic(t.id))).toBe(true);
  });

  it('finds an interview question by a fragment of its text', () => {
    const q = QA.find((x) => !/<[^>]+>/.test(x.q) && x.q.split(' ').length > 4)!;
    const fragment = q.q.split(' ').slice(1, 4).join(' ');
    render(<App />);
    go(href.search(fragment));
    expect(screen.getByRole('heading', { name: 'Pasujące pytania z rozmów' })).toBeInTheDocument();
    expect(document.getElementById(q.id)).not.toBeNull();
  });

  it('explains an empty result', () => {
    render(<App />);
    go(href.search('zzzqqqxxx'));
    expect(screen.getByText('Nic nie znaleziono')).toBeInTheDocument();
  });
});
