import { readFileSync, writeFileSync, statSync } from 'fs';

const src = 'D:/new 1/New folder/design/test/index.html';
const dst = 'D:/new 1/New folder/design/test/app.html';

let h = readFileSync(src, 'utf8');
const orig = h.length;
let hits = 0;

function rep(search, replace) {
  if (!h.includes(search)) { console.warn('MISS:', search.slice(0,60)); return; }
  h = h.replace(search, replace);
  hits++;
}

// 1. Sidebar dcNav — use window.navigate when available
rep(
`function dcNav(id) {
  const slot = DC_NAV_MAP[id];
  if (slot && window.__dcSetFocus) window.__dcSetFocus(slot);
}`,
`function dcNav(id) {
  if (window.navigate) {
    const R={dashboard:'/app/dashboard',policy:'/app/policies',claims:'/app/claims',negotiate:'/app/negotiate',benchmark:'/app/benchmark',deadlines:'/app/deadlines',documents:'/app/documents',settings:'/app/settings'};
    window.navigate(R[id]||'/app/dashboard');
  } else {
    const slot = DC_NAV_MAP[id];
    if (slot && window.__dcSetFocus) window.__dcSetFocus(slot);
  }
}`
);

// 2. Landing nav: Sign in + Start free analysis
rep(
`      <button className="btn btn-quiet btn-sm">Sign in</button>
      <button className="btn btn-primary btn-sm">Start free analysis <Icons.Arrow size={12}/></button>`,
`      <button className="btn btn-quiet btn-sm" onClick={() => window.navigate?.('/signin')}>Sign in</button>
      <button className="btn btn-primary btn-sm" onClick={() => window.navigate?.('/signup')}>Start free analysis <Icons.Arrow size={12}/></button>`
);

// 3. Hero "Analyze my policy" CTA
rep(
`          <button className="btn btn-primary" style={{ padding: '13px 20px', fontSize: 14 }}>
            Analyze my policy · free <Icons.Arrow size={13}/>`,
`          <button className="btn btn-primary" style={{ padding: '13px 20px', fontSize: 14 }} onClick={() => window.navigate?.('/signup')}>
            Analyze my policy · free <Icons.Arrow size={13}/>`
);

// 4. Auth SignIn "Start free →"
rep(
`Don't have an account? <span style={{ color: 'var(--navy)', cursor: 'pointer', fontWeight: 500 }}>Start free →</span>`,
`Don't have an account? <span onClick={() => window.navigate?.('/signup')} style={{ color: 'var(--navy)', cursor: 'pointer', fontWeight: 500 }}>Start free →</span>`
);

// 5. Auth SignIn "Forgot password?"
rep(
`<span style={{ fontSize: 12, color: 'var(--navy)', cursor: 'pointer' }}>Forgot password?</span>`,
`<span onClick={() => window.navigate?.('/forgot-pw')} style={{ fontSize: 12, color: 'var(--navy)', cursor: 'pointer' }}>Forgot password?</span>`
);

// 6. Auth SignIn "Sign in" button
rep(
`        <button className="btn btn-primary" style={{ justifyContent: 'center', padding: '11px', fontSize: 13, marginTop: 4 }}>
          Sign in <Icons.Arrow size={13}/>`,
`        <button className="btn btn-primary" onClick={() => window.navigate?.('/app/dashboard')} style={{ justifyContent: 'center', padding: '11px', fontSize: 13, marginTop: 4 }}>
          Sign in <Icons.Arrow size={13}/>`
);

// 7. Auth SignUp "Sign in →"
rep(
`Already have an account? <span style={{ color: 'var(--navy)', cursor: 'pointer', fontWeight: 500 }}>Sign in →</span>`,
`Already have an account? <span onClick={() => window.navigate?.('/signin')} style={{ color: 'var(--navy)', cursor: 'pointer', fontWeight: 500 }}>Sign in →</span>`
);

// 8. Auth SignUp submit button
rep(
`        <button className="btn btn-primary" style={{ justifyContent: 'center', padding: '12px', fontSize: 13, marginTop: 4 }}>`,
`        <button className="btn btn-primary" onClick={() => window.navigate?.('/onboard')} style={{ justifyContent: 'center', padding: '12px', fontSize: 13, marginTop: 4 }}>`
);

// 9. ForgotPassword "Back to sign in" ghost
rep(
`          <button className="btn btn-ghost" style={{ justifyContent: 'center' }}>
            <Icons.ChevronL size={12}/> Back to sign in`,
`          <button className="btn btn-ghost" onClick={() => window.navigate?.('/signin')} style={{ justifyContent: 'center' }}>
            <Icons.ChevronL size={12}/> Back to sign in`
);

// 10. ForgotPassword "Back to sign in" quiet
rep(
`          <button className="btn btn-quiet" style={{ justifyContent: 'center' }}>
            <Icons.ChevronL size={12}/> Back to sign in`,
`          <button className="btn btn-quiet" onClick={() => window.navigate?.('/signin')} style={{ justifyContent: 'center' }}>
            <Icons.ChevronL size={12}/> Back to sign in`
);

// 11. Onboarding step1 "Review results"
rep(
`                  <button className="btn btn-primary">Review results <Icons.Arrow size={12}/></button>`,
`                  <button className="btn btn-primary" onClick={() => window.navigate?.('/onboard/2')}>Review results <Icons.Arrow size={12}/></button>`
);

// 12. Onboarding step2 "Go to my dashboard" → step3
rep(
`          <button className="btn btn-primary">Go to my dashboard <Icons.Arrow size={13}/></button>`,
`          <button className="btn btn-primary" onClick={() => window.navigate?.('/onboard/3')}>Go to my dashboard <Icons.Arrow size={13}/></button>`
);

// 13. OnboardingDone "Go to my dashboard" → /app/dashboard
rep(
`        <button className="btn btn-primary" style={{ padding: '13px 28px', fontSize: 14 }}>
          Go to my dashboard <Icons.Arrow size={14}/>`,
`        <button className="btn btn-primary" onClick={() => window.navigate?.('/app/dashboard')} style={{ padding: '13px 28px', fontSize: 14 }}>
          Go to my dashboard <Icons.Arrow size={14}/>`
);

// 14. Replace the entire last <script> block with the router
const lastScriptIdx = h.lastIndexOf('<script type="text/babel" data-presets="react">');
if (lastScriptIdx === -1) { console.error('Could not find last script block!'); process.exit(1); }
hits++;

const ROUTER = `<script type="text/babel" data-presets="react">
// ─── Router ──────────────────────────────────────────────────────
window.navigate = (path) => { window.location.hash = '#' + path; };

function useRoute() {
  const get = () => (window.location.hash || '#/').replace(/^#/, '') || '/';
  const [path, setPath] = React.useState(get);
  React.useEffect(() => {
    const handler = () => setPath(get());
    window.addEventListener('hashchange', handler);
    return () => window.removeEventListener('hashchange', handler);
  }, []);
  return path;
}

// ─── Theme ───────────────────────────────────────────────────────
const APP_TWEAKS = { theme: 'light', density: 'compact', primaryHue: 264 };
function applyTheme(t) {
  const root = document.documentElement;
  root.setAttribute('data-theme', t.theme);
  const hue = t.primaryHue;
  root.style.setProperty('--navy', \`oklch(0.32 0.10 \${hue})\`);
  root.style.setProperty('--navy-2', \`oklch(0.38 0.11 \${hue})\`);
  root.style.setProperty('--navy-soft', \`oklch(0.48 0.08 \${hue})\`);
  if (t.density === 'compact') {
    root.style.setProperty('--r-lg', '8px');
    root.style.setProperty('--r-xl', '12px');
    document.body.style.fontSize = '13px';
  }
}
applyTheme(APP_TWEAKS);

// ─── AppFrame ────────────────────────────────────────────────────
function AppFrame({ active, title, subtitle, crumbs, children, right, showAI = true }) {
  const [aiOpen, setAiOpen] = React.useState(true);
  return (
    <div className="shielded-root" style={{ display:'flex', height:'100%', background:'var(--bg)' }}>
      <Sidebar active={active} compact={false} />
      <div style={{ flex:1, display:'flex', flexDirection:'column', minWidth:0, overflow:'hidden' }}>
        <TopBar title={title} subtitle={subtitle} crumbs={crumbs} right={right}/>
        <div style={{ flex:1, overflow:'auto' }}>{children}</div>
      </div>
      {showAI && aiOpen && <AIAssistant onClose={() => setAiOpen(false)}/>}
    </div>
  );
}

// ─── Page (full-screen wrapper) ───────────────────────────────────
function Page({ ch }) {
  return <div className="shielded-root" style={{ height:'100%' }}>{ch}</div>;
}

// ─── App ─────────────────────────────────────────────────────────
function App() {
  const route = useRoute();

  React.useEffect(() => {
    const onKey = (e) => {
      if (e.target.matches('input,textarea,[contenteditable]')) return;
      if (e.key === 'd' || e.key === 'D') {
        APP_TWEAKS.theme = APP_TWEAKS.theme === 'dark' ? 'light' : 'dark';
        applyTheme(APP_TWEAKS);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  if (!route || route === '/')   return <Page ch={<Landing />}/>;
  if (route === '/signin')       return <Page ch={<SignIn />}/>;
  if (route === '/signup')       return <Page ch={<SignUp />}/>;
  if (route === '/forgot-pw')    return <Page ch={<ForgotPassword />}/>;
  if (route === '/onboard' || route === '/onboard/1') return <Page ch={<OnboardingUpload />}/>;
  if (route === '/onboard/2')    return <Page ch={<OnboardingReview />}/>;
  if (route === '/onboard/3')    return <Page ch={<OnboardingDone />}/>;

  if (route === '/app/dashboard') return (
    <AppFrame active="dashboard" title="Overview" subtitle="Lumen & Loaf · Commercial Property" crumbs={['Home']}>
      <Dashboard variant="B"/>
    </AppFrame>
  );
  if (route === '/app/claims') return (
    <AppFrame active="claims" title="Claims" subtitle="1 active" crumbs={['Claims']} showAI={false}>
      <ClaimsList />
    </AppFrame>
  );
  if (route === '/app/policies') return (
    <AppFrame active="policy" title="Policies" subtitle="2 active" crumbs={['Policies']} showAI={false}>
      <PoliciesList />
    </AppFrame>
  );
  if (route === '/app/documents') return (
    <AppFrame active="documents" title="Documents" subtitle="12 files" crumbs={['Documents']} showAI={false}>
      <Documents />
    </AppFrame>
  );
  if (route === '/app/negotiate') return (
    <AppFrame active="negotiate" title="Negotiation generator" crumbs={['Claims','CLM-2041','Negotiate']}>
      <Negotiate />
    </AppFrame>
  );
  if (route === '/app/benchmark') return (
    <AppFrame active="benchmark" title="Settlement benchmarking" crumbs={['Claims','CLM-2041','Benchmark']}>
      <Benchmark />
    </AppFrame>
  );
  if (route === '/app/deadlines') return (
    <AppFrame active="deadlines" title="Deadlines" crumbs={['Deadlines']} showAI={false}>
      <Timeline />
    </AppFrame>
  );
  if (route === '/app/settings') return (
    <AppFrame active="settings" title="Settings" crumbs={['Settings']} showAI={false}>
      <Settings />
    </AppFrame>
  );
  if (route === '/app/analytics') return (
    <AppFrame active="dashboard" title="Analytics" subtitle="All claims · Lumen & Loaf" crumbs={['Analytics']} showAI={false}>
      <Analytics />
    </AppFrame>
  );
  if (route === '/app/search') return (
    <AppFrame active="dashboard" title="Search" crumbs={['Search']} showAI={false}>
      <Search />
    </AppFrame>
  );

  window.navigate('/');
  return null;
}

ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
</script>
</body>
</html>`;

h = h.slice(0, lastScriptIdx) + ROUTER;

writeFileSync(dst, h, 'utf8');
console.log(`Done. ${hits} replacements. app.html size: ${statSync(dst).size.toLocaleString()} bytes (was ${orig.toLocaleString()})`);
