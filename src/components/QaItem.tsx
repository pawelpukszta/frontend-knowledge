import type { Qa } from '../data';
import { TOPIC } from '../data';
import { href } from '../lib/router';
import { toggleQaMark, useUserData } from '../lib/userData';
import { Html } from './Html';
import { Icon } from './Icon';
import { MarkButtons, StatusIcon } from './Status';

/** One interview question; the answer stays hidden until opened, then the user rates themselves. */
export function QaItem({ item, withTopic = false }: { item: Qa; withTopic?: boolean }) {
  const mark = useUserData((d) => d.qaStatus[item.id]);
  return (
    <details id={item.id}>
      <summary>
        <Html as="span" html={item.q} />
        <span className="qa-side">
          {mark && <StatusIcon status={mark} />}
          <span className="caret" aria-hidden="true"><Icon name="caret" /></span>
        </span>
      </summary>
      <div className="answer prose">
        <Html html={item.a} />
        <div className="qa-assess">
          <MarkButtons value={mark} onToggle={(m) => toggleQaMark(item.id, m)} label="Oceń swoją odpowiedź" />
          {withTopic && (
            <p className="from"><a href={href.topic(item.topic)}>Zagadnienie: {TOPIC[item.topic].title}<Icon name="arrowRight" /></a></p>
          )}
        </div>
      </div>
    </details>
  );
}
