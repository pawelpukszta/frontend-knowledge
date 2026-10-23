// Ships the validated content as one ES module per category (`data/<part>.<hash>.js`) and writes the index
// (categories and part URLs) into index.html. Editing a topic changes one part file and index.html; the app
// code and every other part stay cached. Invalid content fails `vite build` and the dev page load; editing a
// content file reloads the page.
import { createHash } from 'node:crypto';
import { resolve } from 'node:path';
import type { Plugin } from 'vite';
import { loadContent } from './load.ts';
import { splitContent, type ContentIndex } from './parts.ts';

interface Built { index: ContentIndex; files: Map<string, string> }

async function build(root: string): Promise<Built> {
  const data = await loadContent(root);
  const files = new Map<string, string>();
  for (const [name, part] of splitContent(data)) {
    // JSON.parse of a string literal is faster to parse than an equivalent object literal.
    const source = `export default JSON.parse(${JSON.stringify(JSON.stringify(part))});`;
    files.set(`data/${name}.${createHash('sha256').update(source).digest('hex').slice(0, 8)}.js`, source);
  }
  return { index: { categories: data.categories, clCategories: data.clCategories, parts: [...files.keys()] }, files };
}

export function contentPlugin(root = resolve('content')): Plugin {
  let built: Promise<Built> | undefined;
  const get = () => (built ??= build(root));
  return {
    name: 'kb-content',
    async transformIndexHtml() {
      const { index } = await get();
      // `<` escaped so no string in the content can close the script element.
      const json = JSON.stringify(index).replaceAll('<', '\\u003c');
      return [{ tag: 'script', attrs: { type: 'application/json', id: 'kb-content' }, children: json, injectTo: 'head' }];
    },
    async generateBundle() {
      for (const [fileName, source] of (await get()).files) this.emitFile({ type: 'asset', fileName, source });
    },
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const name = req.url?.slice(1).split('?')[0] ?? '';
        if (!name.startsWith('data/')) return next();
        get().then(({ files }) => {
          const source = files.get(name);
          if (source === undefined) return next();
          res.setHeader('Content-Type', 'text/javascript');
          res.end(source);
        }, next);
      });
      server.watcher.add(root);
      server.watcher.on('all', (_event, file) => {
        if (!resolve(file).startsWith(root)) return;
        built = undefined;
        server.ws.send({ type: 'full-reload' });
      });
    },
  };
}
