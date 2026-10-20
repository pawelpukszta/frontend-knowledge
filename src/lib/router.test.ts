import { describe, expect, it } from 'vitest';
import { href, parseHash } from './router';

describe('parseHash', () => {
  it.each([
    ['', { name: 'home' }],
    ['#/', { name: 'home' }],
    ['#/k/js', { name: 'category', id: 'js' }],
    ['#/t/js-this', { name: 'topic', id: 'js-this' }],
    [href.search('event loop & ł'), { name: 'search', q: 'event loop & ł' }],
    ['#/pytania', { name: 'qa', cat: null, status: 'all' }],
    [href.qa('js', 'review'), { name: 'qa', cat: 'js', status: 'review' }],
    ['#/pytania?s=bogus', { name: 'qa', cat: null, status: 'all' }],
    ['#/powtorka', { name: 'review' }],
    [href.quiz('js'), { name: 'quiz', cat: 'js' }],
    [href.flash(), { name: 'flash', cat: null }],
    [href.checklist(), { name: 'checklist', cat: null }],
    [href.checklist('seo'), { name: 'checklist', cat: 'seo' }],
    ['#/nope', { name: 'notFound' }],
  ])('%s', (hash, route) => expect(parseHash(hash)).toEqual(route));
});
