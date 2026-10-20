import { href } from '../lib/router';
import { useTitle } from '../lib/useTitle';

export function NotFoundView() {
  useTitle('Nie znaleziono');
  return (
    <div className="empty">
      <b>Nie ma takiej strony</b>
      Link mógł się zmienić. <a href={href.home()}>Wróć na start</a>.
    </div>
  );
}
