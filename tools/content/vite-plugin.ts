// Exposes the validated content as `virtual:content`. Invalid content fails `vite build`
// and shows the error overlay in dev; editing a content file reloads the page.
import { resolve } from 'node:path';
import type { Plugin } from 'vite';
import { loadContent } from './load.ts';

const ID = 'virtual:content';
const RESOLVED = '\0' + ID;

export function contentPlugin(root = resolve('content')): Plugin {
  return {
    name: 'kb-content',
    resolveId: (id) => (id === ID ? RESOLVED : undefined),
    async load(id) {
      if (id !== RESOLVED) return undefined;
      const data = await loadContent(root);
      // JSON.parse of a string literal is faster to parse than an equivalent object literal.
      return `export default JSON.parse(${JSON.stringify(JSON.stringify(data))});`;
    },
    configureServer(server) {
      server.watcher.add(root);
      server.watcher.on('all', (_event, file) => {
        if (!resolve(file).startsWith(root)) return;
        const mod = server.moduleGraph.getModuleById(RESOLVED);
        if (mod) server.moduleGraph.invalidateModule(mod);
        server.ws.send({ type: 'full-reload' });
      });
    },
  };
}
