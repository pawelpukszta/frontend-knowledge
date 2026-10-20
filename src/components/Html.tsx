import type { ElementType } from 'react';

/** Trusted HTML rendered at build time from the repo's content files. */
export function Html({ html, as: Tag = 'div', className }: { html: string; as?: ElementType; className?: string }) {
  return <Tag className={className} dangerouslySetInnerHTML={{ __html: html }} />;
}
