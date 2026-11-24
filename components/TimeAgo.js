'use client';
import { useEffect, useState } from 'react';
import { relative, dateTime } from '../lib/format';

// Server renders the absolute time; the browser swaps in "41m ago" so it never goes stale.
export default function TimeAgo({ iso, prefix = '' }) {
  const [text, setText] = useState(iso ? dateTime(iso) + ' CT' : '');
  useEffect(() => {
    if (!iso) return;
    const tick = () => setText(relative(iso));
    tick();
    const id = setInterval(tick, 60000);
    return () => clearInterval(id);
  }, [iso]);
  if (!iso) return null;
  return <time dateTime={iso} title={dateTime(iso) + ' CT'}>{prefix}{text}</time>;
}
