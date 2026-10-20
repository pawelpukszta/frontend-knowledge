// `npm run content:check`: validates content/ without building the app.
import { resolve } from 'node:path';
import { ContentError, loadContent } from './load.ts';

try {
  const d = await loadContent(resolve('content'));
  const qa = d.topics.reduce((n, t) => n + t.qa.length, 0);
  const quiz = d.topics.reduce((n, t) => n + t.quiz.length, 0);
  console.log(`OK: ${d.categories.length} kategorii, ${d.topics.length} tematów, ${qa} pytań Q&A, ${quiz} pytań quizu, `
    + `${d.clCategories.length} kategorii checklisty, ${d.clRules.length} reguł`);
} catch (e) {
  console.error(e instanceof ContentError ? e.message : e);
  process.exit(1);
}
