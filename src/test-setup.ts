import '@testing-library/jest-dom/vitest';
import 'fake-indexeddb/auto';
import { afterEach, inject } from 'vitest';
import { cleanup } from '@testing-library/react';
import { setContent } from './data';

afterEach(cleanup);
setContent(inject('content'));

// jsdom lacks these browser APIs.
window.matchMedia ??= ((query: string) => ({
  matches: false, media: query, onchange: null,
  addEventListener() {}, removeEventListener() {}, addListener() {}, removeListener() {}, dispatchEvent: () => false,
})) as typeof window.matchMedia;
window.scrollTo = () => {};
Element.prototype.scrollIntoView = () => {};
