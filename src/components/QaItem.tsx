import type { Qa } from '../data';
import { TOPIC } from '../data';
import { href } from '../lib/router';
import { Html } from './Html';
import { Icon } from './Icon';

/** One interview question; the answer stays hidden until the user opens it. */
export function QaItem({ item, withTopic = false }: { item: Qa; withTopic?: boolean }) {
  return (
    <details id={item.id}>
      <summary><Html as="span" html={item.q} /><span className="caret" aria-hidden="true"><Icon name="caret" /></span></summary>
      <div className="answer prose">
        <Html html={item.a} />
        {withTopic && (
          <p className="from"><a href={href.topic(item.topic)}>Zagadnienie: {TOPIC[item.topic].title}<Icon name="arrowRight" /></a></p>
        )}
      </div>
    </details>
  );
}
