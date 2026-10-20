import { useEffect, useRef, type CSSProperties } from 'react';
import type { Hue } from '../data';
import { hueOn, hueVar } from '../data';
import { setLevel, useLevel, type LevelFilter } from '../state';

export interface RailItem { key: string; label: string; count: string; title?: string; hue?: Hue; current: boolean; href: string }

const LEVELS: [LevelFilter, string][] = [['all', 'Wszystko'], ['mid', 'Mid'], ['senior', 'Senior']];

export function Rail({ items, unit, showLevel }: { items: RailItem[]; unit: string; showLevel: boolean }) {
  const level = useLevel();
  const ref = useRef<HTMLElement>(null);
  const current = items.find((it) => it.current)?.key;
  // On narrow screens the category list scrolls sideways: keep the current one visible.
  useEffect(() => { ref.current?.querySelector('[aria-current]')?.scrollIntoView({ block: 'nearest', inline: 'nearest' }); }, [current]);
  return (
    <aside className="rail" aria-label="Filtry i kategorie" ref={ref}>
      {showLevel && (
        <div className="level-block">
          <p className="rail-label" id="level-label">Poziom</p>
          <div className="seg" role="group" aria-labelledby="level-label">
            {LEVELS.map(([v, label]) => (
              <button key={v} type="button" aria-pressed={level === v} onClick={() => setLevel(v)}>{label}</button>
            ))}
          </div>
        </div>
      )}
      <nav aria-label="Kategorie">
        <p className="rail-label"><span>Kategorie</span><span className="unit">{unit}</span></p>
        <ul>
          {items.map((it) => (
            <li key={it.key}>
              <a className="cat-link" href={it.href} aria-current={it.current ? 'page' : undefined}
                style={it.hue ? ({ '--cat': hueVar(it.hue), '--cat-on': hueOn(it.hue) } as CSSProperties) : undefined}>
                <span className="swatch" style={{ background: it.hue ? hueVar(it.hue) : 'var(--surface-2)' }} />
                {it.label}
                <span className="n" title={it.title}>{it.count}</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
