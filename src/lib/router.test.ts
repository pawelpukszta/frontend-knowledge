import { describe, expect, it } from 'vitest';
import { href, parseHash } from './router';

describe('parseHash', () => {
  it.each([
    ['', { name: 'home' }],
    ['#/', { name: 'home' }],
    ['#/k/js', { name: 'category', id: 'js' }],
    ['#/t/js-this', { name: 'topic', id: 'js-this' }],
    [href.search('event loop & ł'), { name: 'search', q: 'event loop & ł' }],
    ['#/nope', { name: 'notFound' }],
  ])('%s', (hash, route) => expect(parseHash(hash)).toEqual(route));
});
