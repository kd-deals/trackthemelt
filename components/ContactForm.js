'use client';
import { useState } from 'react';
import { CONTACT_KEY } from '../lib/site';

// Web3Forms: static-site form backend, emails each submission to the address the key was created with.
export default function ContactForm() {
  const [state, setState] = useState('idle'); // idle | sending | sent | error

  async function submit(e) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form));
    if (data.botcheck) return;
    setState('sending');
    try {
      const r = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ ...data, access_key: CONTACT_KEY, subject: `Track The Melt: ${data.topic}`, from_name: 'Track The Melt' }),
      });
      const j = await r.json();
      if (!j.success) throw new Error(j.message);
      form.reset();
      setState('sent');
    } catch {
      setState('error');
    }
  }

  if (state === 'sent') return <p className="form-msg ok">Thanks, your message was sent.</p>;

  return (
    <form className="contact-form" onSubmit={submit}>
      <label>
        Topic
        <select name="topic" defaultValue="Coin correction">
          <option>Coin correction</option>
          <option>Coin request</option>
          <option>Bug report</option>
          <option>Other</option>
        </select>
      </label>
      <label>
        Email <span className="muted">(optional, if you want a reply)</span>
        <input type="email" name="email" autoComplete="email" maxLength={200} />
      </label>
      <label>
        Message
        <textarea name="message" required rows={6} maxLength={5000} />
      </label>
      <input type="checkbox" name="botcheck" className="hp" tabIndex={-1} autoComplete="off" aria-hidden="true" />
      <div>
        <button className="btn primary" type="submit" disabled={state === 'sending'}>
          {state === 'sending' ? 'Sending…' : 'Send'}
        </button>
        {state === 'error' && <span className="form-msg err">Couldn't send. Please try again.</span>}
      </div>
    </form>
  );
}
