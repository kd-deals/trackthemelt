'use client';
import { useEffect, useState } from 'react';

// Live spot straight from gold-api.com in the visitor's browser (same approach as TrackTheMint).
// One poller per page shared by every component, one cached price shared across tabs and pages,
// refreshed at most once a minute (their rule is >= 30 s per IP), paused while the tab is hidden.
// Prices are USD per troy oz, copper (HG) per lb. Nickel/zinc/manganese stay at the exported value.
const KEY = 'ttmelt-spot-v1';
const TTL = 60000;
const SYMBOLS = ['XAU', 'XAG', 'XPT', 'XPD', 'HG'];

let current = null;
let inflight = null;
let timer = null;
const subscribers = new Set();

function readCache() {
  try { return JSON.parse(localStorage.getItem(KEY)); } catch { return null; }
}

function publish(value) {
  current = value;
  subscribers.forEach((fn) => fn(value));
}

async function fetchSpot() {
  if (inflight) return inflight;
  inflight = (async () => {
    const pairs = await Promise.all(SYMBOLS.map(async (sym) => {
      try {
        const r = await fetch(`https://api.gold-api.com/price/${sym}/USD`);
        if (!r.ok) throw new Error(r.status);
        const j = await r.json();
        return [sym, typeof j.price === 'number' && j.price > 0 ? j.price : null];
      } catch {
        return [sym, null];
      }
    }));
    const prices = Object.fromEntries(pairs.filter(([, v]) => v != null));
    if (!Object.keys(prices).length) return null;
    const next = { t: new Date().toISOString(), live: true, prices };
    try { localStorage.setItem(KEY, JSON.stringify(next)); } catch {}
    return next;
  })();
  try { return await inflight; } finally { inflight = null; }
}

async function tick() {
  if (typeof document !== 'undefined' && document.hidden) return;
  const cached = readCache();
  if (cached && Date.now() - Date.parse(cached.t) < TTL) return publish(cached);
  const fresh = await fetchSpot();
  if (fresh) publish(fresh);
}

// initial = { t, live: false, prices } from the build. Live prices are layered over it.
export function useSpot(initial) {
  const [live, setLive] = useState(null);
  useEffect(() => {
    subscribers.add(setLive);
    if (current) setLive(current);
    if (subscribers.size === 1) {
      tick();
      timer = setInterval(tick, TTL);
      document.addEventListener('visibilitychange', tick);
    }
    return () => {
      subscribers.delete(setLive);
      if (!subscribers.size) {
        clearInterval(timer);
        document.removeEventListener('visibilitychange', tick);
      }
    };
  }, []);
  if (!live) return initial;
  return { t: live.t, live: true, prices: { ...initial.prices, ...live.prices } };
}
