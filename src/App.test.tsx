import { act, render, screen, within } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { App } from './App';
import { CATEGORIES, TOPICS } from './data';

const go = (hash: string) => act(() => {
  location.hash = hash;
  window.dispatchEvent(new HashChangeEvent('hashchange'));
});

describe('library', () => {
  afterEach(() => go('#/'));

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
