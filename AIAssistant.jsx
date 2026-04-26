// AIAssistant.jsx — conversational panel (confident advocate tone)

const AI_SEED = [
  { who: 'ai', text: `I've reviewed GreatWest's ${(28400).toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })} offer against 7 similar NC restaurant fire claims. Their offer is **41% below** the fair-settlement midpoint.`, refs: ['Policy §4.2', '7 comps'] },
  { who: 'ai', text: 'Three specific clauses support a higher payout. Want me to draft the rebuttal?', chips: ['Draft rebuttal email', 'Show the 3 clauses', 'Why so low?'] },
];

function AIBubble({ m }) {
  const isAI = m.who === 'ai';
  const rendered = (m.text || '').split(/(\*\*[^*]+\*\*)/g).map((p, i) =>
    p.startsWith('**') ? <strong key={i} style={{ color: 'var(--ink)', fontWeight: 600 }}>{p.slice(2, -2)}</strong> : <React.Fragment key={i}>{p}</React.Fragment>
  );
  return (
    <div style={{
      display: 'flex', gap: 8, flexDirection: isAI ? 'row' : 'row-reverse', alignItems: 'flex-start',
    }}>
      {isAI && (
        <div style={{
          width: 22, height: 22, borderRadius: 6, background: 'var(--navy)',
          color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none', marginTop: 2,
        }}>
          <ShieldedMark size={13} color="#fff" />
        </div>
      )}
      <div style={{ maxWidth: '85%', display: 'flex', flexDirection: 'column', gap: 8, alignItems: isAI ? 'flex-start' : 'flex-end' }}>
        <div style={{
          padding: '9px 12px',
          borderRadius: isAI ? '4px 12px 12px 12px' : '12px 4px 12px 12px',
          background: isAI ? 'var(--bg-card)' : 'var(--navy)',
          color: isAI ? 'var(--ink-2)' : '#fff',
          border: isAI ? '1px solid var(--line)' : 'none',
          fontSize: 13, lineHeight: 1.5,
        }}>
          {rendered}
          {m.refs && (
            <div style={{ display: 'flex', gap: 6, marginTop: 8, flexWrap: 'wrap' }}>
              {m.refs.map(r => (
                <span key={r} className="mono" style={{
                  fontSize: 10, padding: '1px 6px', borderRadius: 4,
                  background: 'var(--bg-subtle)', color: 'var(--ink-3)', border: '1px solid var(--line)',
                }}>{r}</span>
              ))}
            </div>
          )}
        </div>
        {m.chips && (
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {m.chips.map(c => (
              <button key={c} className="btn btn-ghost btn-sm" style={{ fontSize: 11.5, padding: '4px 10px', borderRadius: 99 }}>
                {c}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function AIAssistant({ onClose, docked = true }) {
  const [messages, setMessages] = React.useState(AI_SEED);
  const [input, setInput] = React.useState('');
  const [thinking, setThinking] = React.useState(false);
  const scroll = React.useRef(null);

  React.useEffect(() => {
    if (scroll.current) scroll.current.scrollTop = scroll.current.scrollHeight;
  }, [messages, thinking]);

  const send = (text) => {
    if (!text.trim()) return;
    setMessages(m => [...m, { who: 'you', text }]);
    setInput('');
    setThinking(true);
    setTimeout(() => {
      setThinking(false);
      setMessages(m => [...m, {
        who: 'ai',
        text: "Here's what I'd lean on: your policy §4.2 guarantees **replacement cost** on kitchen equipment — GreatWest valued the hood and oven at actual-cash-value, which is a $9,200 gap on its own. I'll build the rebuttal.",
        refs: ['Policy §4.2', 'Adjuster p.3'],
        chips: ['Draft the email', 'Show the math'],
      }]);
    }, 1100);
  };

  return (
    <div style={{
      width: docked ? 360 : '100%',
      background: 'var(--bg)',
      borderLeft: docked ? '1px solid var(--line)' : 'none',
      display: 'flex', flexDirection: 'column', flex: 'none',
    }}>
      <div style={{
        padding: '12px 16px', borderBottom: '1px solid var(--line)',
        display: 'flex', alignItems: 'center', gap: 10,
      }}>
        <div style={{
          width: 26, height: 26, borderRadius: 7, background: 'var(--navy)', color: '#fff',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <ShieldedMark size={15} color="#fff"/>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 6 }}>
            Shielded <span className="pill pill-teal" style={{ padding: '2px 7px', fontSize: 10 }}>
              <span className="dot pulse" style={{ background: 'var(--teal)' }}/> online
            </span>
          </div>
          <div style={{ fontSize: 11, color: 'var(--ink-4)' }}>Your claim advocate · cites policy + benchmarks</div>
        </div>
        {onClose && <button className="btn btn-quiet btn-sm" onClick={onClose} style={{ padding: 6 }}><Icons.X size={14}/></button>}
      </div>

      <div ref={scroll} style={{
        flex: 1, overflow: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: 12,
      }}>
        <div className="eyebrow" style={{ textAlign: 'center', marginBottom: 4 }}>
          Claim CLM-2041 · Fire & Smoke
        </div>
        {messages.map((m, i) => <AIBubble key={i} m={m} />)}
        {thinking && (
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <div style={{
              width: 22, height: 22, borderRadius: 6, background: 'var(--navy)',
              color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <ShieldedMark size={13} color="#fff"/>
            </div>
            <div style={{ padding: '9px 12px', background: 'var(--bg-card)', border: '1px solid var(--line)', borderRadius: 12, display: 'flex', gap: 4 }}>
              {[0, 1, 2].map(i => (
                <span key={i} style={{
                  width: 5, height: 5, borderRadius: 99, background: 'var(--ink-4)',
                  animation: `pulse-dot 1.2s ease-in-out ${i * 0.15}s infinite`,
                }}/>
              ))}
            </div>
          </div>
        )}
      </div>

      <div style={{ padding: 12, borderTop: '1px solid var(--line)' }}>
        <div style={{
          display: 'flex', gap: 8, alignItems: 'flex-end',
          background: 'var(--bg-card)', border: '1px solid var(--line)', borderRadius: 12, padding: 8,
        }}>
          <textarea
            rows={1}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(input); } }}
            placeholder="Ask about your claim, policy, or negotiation…"
            style={{
              flex: 1, resize: 'none', border: 'none', padding: '4px 4px', background: 'transparent',
              fontSize: 13, maxHeight: 100, outline: 'none', boxShadow: 'none',
            }}
          />
          <button className="btn btn-primary btn-sm" onClick={() => send(input)} style={{ padding: '6px 10px', opacity: input.trim() ? 1 : 0.45 }}>
            <Icons.ArrowUp size={14}/>
          </button>
        </div>
        <div style={{ display: 'flex', gap: 6, marginTop: 8, flexWrap: 'wrap' }}>
          {['Why is the offer low?', 'Draft rebuttal', 'Next deadline?'].map(s => (
            <button key={s} onClick={() => send(s)} className="btn btn-quiet btn-sm"
              style={{ fontSize: 11, padding: '3px 8px', color: 'var(--ink-3)' }}>
              {s}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { AIAssistant });
