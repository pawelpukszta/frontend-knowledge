import { ICONS, type IconName } from '../lib/icons';

export function Icon({ name }: { name: IconName }) {
  return (
    <svg className="ic" viewBox="0 0 256 256" fill="currentColor" aria-hidden="true" focusable="false">
      <path d={ICONS[name]} />
    </svg>
  );
}
