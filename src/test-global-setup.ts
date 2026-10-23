// Loads content/ once per test run; every test file gets it through inject('content') in test-setup.ts.
import type { TestProject } from 'vitest/node';
import { loadContent } from '../tools/content/load.ts';
import type { ContentData } from '../tools/content/schema.ts';

declare module 'vitest' {
  export interface ProvidedContext { content: ContentData }
}

export default async function setup(project: TestProject) {
  project.provide('content', await loadContent('content'));
}
