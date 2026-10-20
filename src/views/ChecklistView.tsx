import { useState } from 'react';
import { Html } from '../components/Html';
import { CL_CATEGORIES, CL_CATEGORY, CL_RULES, hueVar, type ClRule, type Priority, type Source } from '../data';
import { href } from '../lib/router';
import { host, plural } from '../lib/text';
import { useTitle } from '../lib/useTitle';
import { resetRules, setChecklistPrio, setRuleDone, useUserData } from '../lib/userData';

export const PRIO: Record<Priority, string> = { critical: 'Krytyczny', high: 'Wysoki', medium: 'Średni', low: 'Niski' };
type StatusFilter = 'all' | 'todo' | 'done';
const STATUS_FILTERS: [StatusFilter, string][] = [['all', 'Wszystkie'], ['todo', 'Do zrobienia'], ['done', 'Zrobione']];
const RULE = Object.fromEntries(CL_RULES.map((r) => [r.key, r]));

const Links = ({ list }: { list: Source[] }) => (
  <>{list.map((l, i) => <span key={l.url}>{i > 0 && ', '}<a href={l.url} target="_blank" rel="noopener noreferrer">{l.title}</a></span>)}</>
);

export function ChecklistView({ cat }: { cat: string | null }) {
  const c = cat ? CL_CATEGORY[cat] : undefined;
  useTitle(c ? `${c.name} · Checklista` : 'Checklista');
  const doneList = useUserData((d) => d.checklist.done);
  const prio = useUserData((d) => d.checklist.prio);
  const [status, setStatus] = useState<StatusFilter>('all');
  const [confirmReset, setConfirmReset] = useState(false);
  const done = new Set(doneList);

  const scope = CL_RULES.filter((r) => !c || r.category === c.id);
  const visible = (r: ClRule) => (!prio.length || prio.includes(r.priority)) && (status === 'all' || (status === 'done') === done.has(r.key));
  const doneIn = (rules: ClRule[]) => rules.filter((r) => done.has(r.key)).length;
  const pct = scope.length ? Math.round((doneIn(scope) / scope.length) * 100) : 0;
  const togglePrio = (p: Priority) => setChecklistPrio(prio.includes(p) ? prio.filter((x) => x !== p) : [...prio, p]);
  const toggleAll = (open: boolean) => document.querySelectorAll<HTMLDetailsElement>('main .cl-rule details').forEach((d) => (d.open = open));

  const sections = (c ? [c] : CL_CATEGORIES).map((cc) => {
    const groups = cc.groups.map((g) => {
      const all = g.rules.map((id) => RULE[`${cc.id}/${id}`]);
      const shown = all.filter(visible);
      if (!shown.length) return null;
      return (
        <section key={g.name} className="cl-group" aria-label={g.name}>
          <h3>{g.name} <span className="pill">{doneIn(all)}/{all.length}</span></h3>
          {g.sources.length > 0 && <p className="cl-src">Standardy: <Links list={g.sources} /></p>}
          <ul className="cl-list">{shown.map((r) => <Rule key={r.key} rule={r} done={done.has(r.key)} />)}</ul>
        </section>
      );
    }).filter(Boolean);
    if (!groups.length) return null;
    return (
      <section key={cc.id} className="cl-cat" aria-labelledby={`h-cl-${cc.id}`}>
        {c ? <h2 className="sr-only" id={`h-cl-${cc.id}`}>{cc.name}</h2> : (
          <h2 className="cl-cat-title" id={`h-cl-${cc.id}`}>
            <span className="swatch" style={{ background: hueVar(cc.hue) }} /><a href={href.checklist(cc.id)}>{cc.name}</a>
          </h2>
        )}
        {groups}
      </section>
    );
  }).filter(Boolean);

  return (
    <>
      {c && <nav className="crumbs" aria-label="Ścieżka"><a href={href.checklist()}>Checklista</a><span aria-hidden="true">/</span><span>{c.name}</span></nav>}
      <div className="view-head">
        <h1>{c ? c.name : 'Checklista front-end'}</h1>
        <p className="lede">
          {c ? c.desc : `${CL_RULES.length} reguł dla nowoczesnych stron i aplikacji: dostępność, wydajność, bezpieczeństwo, prywatność, SEO, HTML, CSS, JavaScript, obrazy, testy i i18n. Postęp zapisuje się w tej przeglądarce.`}
        </p>
        {c && c.sources.length > 0 && <p className="cl-src" style={{ marginTop: 10 }}>Standardy: <Links list={c.sources} /></p>}
      </div>
      <div className="panel cl-panel">
        <div className="cl-progress-head"><b>{doneIn(scope)} z {scope.length}</b> {plural(scope.length, 'reguły', 'reguł', 'reguł')} zrobione <span className="muted">({pct}%)</span></div>
        <div className="progress" role="progressbar" aria-label="Postęp checklisty" aria-valuemin={0} aria-valuemax={100} aria-valuenow={pct}>
          <span style={{ width: `${pct}%` }} />
        </div>
        <div className="field">
          <span id="cl-prio">Filtruj po priorytecie</span>
          <div className="chips" role="group" aria-labelledby="cl-prio">
            {(Object.keys(PRIO) as Priority[]).map((p) => {
              const inP = scope.filter((r) => r.priority === p);
              return inP.length ? (
                <button key={p} className="chip" type="button" aria-pressed={prio.includes(p)} onClick={() => togglePrio(p)}>
                  {PRIO[p]} <span className="pill">{doneIn(inP)}/{inP.length}</span>
                </button>
              ) : null;
            })}
          </div>
        </div>
      </div>
      <div className="cl-toolbar">
        <div className="seg" role="group" aria-label="Status">
          {STATUS_FILTERS.map(([k, l]) => <button key={k} type="button" aria-pressed={status === k} onClick={() => setStatus(k)}>{l}</button>)}
        </div>
        <button className="btn" type="button" onClick={() => { setChecklistPrio(['critical', 'high']); setStatus('todo'); }}>Przed startem: krytyczne i wysokie</button>
        <button className="btn ghost" type="button" onClick={() => toggleAll(true)}>Rozwiń wszystkie</button>
        <button className="btn ghost" type="button" onClick={() => toggleAll(false)}>Zwiń wszystkie</button>
        {confirmReset ? (
          <span className="cl-confirm" role="alert">
            Wyczyścić postęp {c ? 'tej kategorii' : 'całej checklisty'}?
            <button className="btn danger" type="button" onClick={() => { resetRules(scope.map((r) => r.key)); setConfirmReset(false); }}>Tak, wyczyść</button>
            <button className="btn" type="button" onClick={() => setConfirmReset(false)}>Anuluj</button>
          </span>
        ) : (
          <button className="btn ghost" type="button" onClick={() => setConfirmReset(true)}>Wyczyść postęp</button>
        )}
      </div>
      {sections.length ? sections : <div className="empty"><b>Brak reguł dla wybranych filtrów</b>Zmień status lub priorytet.</div>}
      <p className="cl-attrib">
        Reguły opracowane na podstawie <a href="https://frontendchecklist.io/" target="_blank" rel="noopener noreferrer">Front-End Checklist</a> (David
        Dias, licencja MIT, <a href="https://github.com/thedaviddias/Front-End-Checklist" target="_blank" rel="noopener noreferrer">GitHub</a>),
        przetłumaczone i uzupełnione o przykłady kodu i źródła standardów. Każda reguła linkuje do oryginału.
      </p>
    </>
  );
}

function Rule({ rule: r, done }: { rule: ClRule; done: boolean }) {
  const id = `cb-${r.category}-${r.id}`;
  const links = [{ title: 'Reguła w Front-End Checklist (EN)', url: r.url }, ...r.sources];
  return (
    <li className={`cl-rule${done ? ' is-done' : ''}`}>
      <input type="checkbox" id={id} checked={done} onChange={(e) => setRuleDone(r.key, e.target.checked)}
        aria-label={`Zrobione: ${r.title.replace(/<[^>]+>/g, '')}`} />
      <details>
        <summary><Html as="span" className="cl-title" html={r.title} /><span className={`prio prio-${r.priority}`}>{PRIO[r.priority]}</span></summary>
        <div className="cl-body prose">
          <Html html={r.desc} />
          {r.why && <><h4>Dlaczego to ważne</h4><Html className="cl-why" html={r.why} /></>}
          {r.verify && <><h4>Jak sprawdzić</h4><Html html={r.verify} /></>}
          {r.code && <Html html={r.code} />}
          {r.pitfalls && <div className="callout pitfalls"><h4>Częste błędy</h4><Html html={r.pitfalls} /></div>}
          <h4>Źródła</h4>
          <ul className="cl-links">
            {links.map((l) => (
              <li key={l.url}><a href={l.url} target="_blank" rel="noopener noreferrer">{l.title}</a> <span className="host">{host(l.url)}</span></li>
            ))}
          </ul>
        </div>
      </details>
    </li>
  );
}
