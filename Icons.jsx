// Icons.jsx — hand-tuned stroke icons, no external libs
const Icon = ({ d, size = 16, stroke = 1.6, fill = 'none', style }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill}
    stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round"
    style={{ flex: 'none', ...style }}>
    {typeof d === 'string' ? <path d={d} /> : d}
  </svg>
);

const Icons = {
  Shield: (p) => <Icon {...p} d="M12 3 4 6v6c0 4.5 3.2 7.8 8 9 4.8-1.2 8-4.5 8-9V6l-8-3z" />,
  Home: (p) => <Icon {...p} d="M3 11 12 4l9 7v9a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1v-9z" />,
  File: (p) => <Icon {...p} d="M7 3h7l5 5v12a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1zM14 3v5h5" />,
  FileText: (p) => <Icon {...p} d="M7 3h7l5 5v12a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1zM14 3v5h5M9 13h6M9 17h4" />,
  Folder: (p) => <Icon {...p} d="M3 7a1 1 0 0 1 1-1h5l2 2h9a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V7z" />,
  Claim: (p) => <Icon {...p} d="M4 5h16v14H4zM4 9h16M8 13h5M8 16h8" />,
  Scale: (p) => <Icon {...p} d="M12 3v18M5 6h14M6 6l-3 7c0 1.7 1.3 3 3 3s3-1.3 3-3L6 6zM18 6l-3 7c0 1.7 1.3 3 3 3s3-1.3 3-3l-3-7z" />,
  Chat: (p) => <Icon {...p} d="M4 5h16a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H9l-5 4V6a1 1 0 0 1 1-1z" />,
  Clock: (p) => <Icon {...p} d="M12 7v5l3 2M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z" />,
  Calendar: (p) => <Icon {...p} d="M4 6h16v14H4zM4 10h16M8 3v4M16 3v4" />,
  Settings: (p) => <Icon {...p} d="M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6zM19 12a7 7 0 0 0-.1-1.2l2-1.5-2-3.4-2.3.9a7 7 0 0 0-2-1.2L14 3h-4l-.6 2.6a7 7 0 0 0-2 1.2l-2.3-.9-2 3.4 2 1.5A7 7 0 0 0 5 12c0 .4 0 .8.1 1.2l-2 1.5 2 3.4 2.3-.9a7 7 0 0 0 2 1.2L10 21h4l.6-2.6a7 7 0 0 0 2-1.2l2.3.9 2-3.4-2-1.5c.1-.4.1-.8.1-1.2z" />,
  Upload: (p) => <Icon {...p} d="M12 4v12M7 9l5-5 5 5M4 18v2a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-2" />,
  Download: (p) => <Icon {...p} d="M12 4v12M7 11l5 5 5-5M4 18v2a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-2" />,
  Check: (p) => <Icon {...p} d="M5 12l4 4 10-10" />,
  CheckCircle: (p) => <Icon {...p} d="M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM8 12l3 3 5-6" />,
  X: (p) => <Icon {...p} d="M6 6l12 12M18 6L6 18" />,
  Plus: (p) => <Icon {...p} d="M12 5v14M5 12h14" />,
  Search: (p) => <Icon {...p} d="M10 4a6 6 0 1 0 0 12 6 6 0 0 0 0-12zM15 15l5 5" />,
  Arrow: (p) => <Icon {...p} d="M5 12h14M13 6l6 6-6 6" />,
  ArrowUp: (p) => <Icon {...p} d="M12 19V5M6 11l6-6 6 6" />,
  ArrowDown: (p) => <Icon {...p} d="M12 5v14M6 13l6 6 6-6" />,
  ChevronR: (p) => <Icon {...p} d="M9 6l6 6-6 6" />,
  ChevronD: (p) => <Icon {...p} d="M6 9l6 6 6-6" />,
  ChevronL: (p) => <Icon {...p} d="M15 6l-6 6 6 6" />,
  Alert: (p) => <Icon {...p} d="M12 3 2 20h20L12 3zM12 10v5M12 18v.01" />,
  Info: (p) => <Icon {...p} d="M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM12 8v.01M11 12h1v5h1" />,
  Sparkle: (p) => <Icon {...p} d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3zM19 3v3M20.5 4.5h-3" />,
  Bell: (p) => <Icon {...p} d="M6 9a6 6 0 0 1 12 0v4l2 3H4l2-3V9zM10 20a2 2 0 0 0 4 0" />,
  User: (p) => <Icon {...p} d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 20a8 8 0 0 1 16 0" />,
  Camera: (p) => <Icon {...p} d="M4 7h3l2-2h6l2 2h3a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1zM12 10a4 4 0 1 0 0 8 4 4 0 0 0 0-8z" />,
  Paperclip: (p) => <Icon {...p} d="M21 12l-8 8a5 5 0 1 1-7-7l9-9a3.5 3.5 0 1 1 5 5L11 18a2 2 0 1 1-3-3l7-7" />,
  Mail: (p) => <Icon {...p} d="M4 6h16v12H4zM4 7l8 7 8-7" />,
  Copy: (p) => <Icon {...p} d="M8 8h11v11H8zM16 8V5a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h3" />,
  Menu: (p) => <Icon {...p} d="M4 7h16M4 12h16M4 17h16" />,
  Dots: (p) => <Icon {...p} d="M6 12h.01M12 12h.01M18 12h.01" stroke="1" fill="currentColor" />,
  Filter: (p) => <Icon {...p} d="M3 5h18l-7 9v5l-4 2v-7L3 5z" />,
  Edit: (p) => <Icon {...p} d="M4 20l4-1L20 7l-3-3L5 16l-1 4zM14 6l3 3" />,
  ExternalLink: (p) => <Icon {...p} d="M14 4h6v6M10 14L20 4M20 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h5" />,
  Sun: (p) => <Icon {...p} d="M12 4V2M12 22v-2M4 12H2M22 12h-2M5.6 5.6 4.2 4.2M19.8 19.8l-1.4-1.4M5.6 18.4l-1.4 1.4M19.8 4.2l-1.4 1.4M12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10z" />,
  Moon: (p) => <Icon {...p} d="M20 15A8 8 0 1 1 9 4a7 7 0 0 0 11 11z" />,
  Lock: (p) => <Icon {...p} d="M6 11h12v9H6zM8 11V8a4 4 0 1 1 8 0v3" />,
  Building: (p) => <Icon {...p} d="M4 21V5a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v16M12 10h7a1 1 0 0 1 1 1v10M7 8h2M7 12h2M7 16h2M15 14h2M15 18h2" />,
  Trash: (p) => <Icon {...p} d="M4 7h16M6 7v13a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V7M10 11v6M14 11v6M9 7V4h6v3" />,
  Bot: (p) => <Icon {...p} d="M8 8h8a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2zM12 4v4M9 13v.01M15 13v.01M10 16h4M4 13h2M18 13h2" />,
  TrendUp: (p) => <Icon {...p} d="M3 17l6-6 4 4 8-8M15 7h6v6" />,
  TrendDown: (p) => <Icon {...p} d="M3 7l6 6 4-4 8 8M15 17h6v-6" />,
  Play: (p) => <Icon {...p} d="M7 4v16l13-8L7 4z" fill="currentColor" stroke="none" />,
  Quote: (p) => <Icon {...p} d="M7 7h4v4H8c0 2 1 3 3 3v2c-3 0-5-2-5-5V7zM14 7h4v4h-3c0 2 1 3 3 3v2c-3 0-5-2-5-5V7z" fill="currentColor" stroke="none" />,
  Target: (p) => <Icon {...p} d="M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10zM12 11a1 1 0 1 0 0 2 1 1 0 0 0 0-2z" />,
  Flag: (p) => <Icon {...p} d="M5 3v18M5 4h12l-2 4 2 4H5" />,
  Image: (p) => <Icon {...p} d="M4 5h16v14H4zM4 15l4-4 4 4 3-3 5 5M9 9a1 1 0 1 0 0 2 1 1 0 0 0 0-2z" />,
  List: (p) => <Icon {...p} d="M4 6h16M4 12h16M4 18h16" />,
  Grid: (p) => <Icon {...p} d="M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z" />,
};

Object.assign(window, { Icon, Icons });
