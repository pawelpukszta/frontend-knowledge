import type { IconName } from '../lib/icons';
import type { Mark, UserDoc } from '../lib/userData';
import { Icon } from './Icon';

export type Status = 'new' | 'read' | Mark;

export const STATUS: Record<Status, { icon: IconName; label: string }> = {
  new: { icon: 'circle', label: 'Nieprzeczytane' },
  read: { icon: 'eye', label: 'Przeczytane' },
  review: { icon: 'review', label: 'Do powtórki' },
  known: { icon: 'checkCircle', label: 'Umiem' },
};

export const topicStatus = (d: UserDoc, id: string): Status => d.topicStatus[id] ?? (d.seen.includes(id) ? 'read' : 'new');

export function StatusIcon({ status, label = STATUS[status].label }: { status: Status; label?: string }) {
  return (
    <span className={`st st-${status}`} title={label}>
      <Icon name={STATUS[status].icon} /><span className="sr-only">{label}</span>
    </span>
  );
}

export function StatusTag({ status }: { status: Mark }) {
  return <span className={`status-tag st-${status}`}><Icon name={STATUS[status].icon} />{STATUS[status].label}</span>;
}

/** "Umiem" / "Do powtórki" toggle pair; pressing the active one clears the mark. */
export function MarkButtons({ value, onToggle, label }: { value: Mark | undefined; onToggle: (m: Mark) => void; label: string }) {
  return (
    <div className="mark-btns" role="group" aria-label={label}>
      <button className="btn" type="button" data-v="known" aria-pressed={value === 'known'} onClick={() => onToggle('known')}>
        <Icon name="checkCircle" />Umiem
      </button>
      <button className="btn" type="button" data-v="review" aria-pressed={value === 'review'} onClick={() => onToggle('review')}>
        <Icon name="review" />Do powtórki
      </button>
    </div>
  );
}
