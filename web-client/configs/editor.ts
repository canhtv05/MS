import type { editor } from 'monaco-editor';

const draculaTheme = {
  base: 'vs-dark' as const,
  inherit: true,
  rules: [
    { token: 'comment', foreground: '6272a4', fontStyle: 'italic' },
    { token: 'keyword', foreground: 'ff79c6' },
    { token: 'identifier', foreground: '50fa7b' },
    { token: 'string', foreground: 'f1fa8c' },
    { token: 'type', foreground: '8be9fd' },
    { token: 'number', foreground: 'bd93f9' },
    { token: 'delimiter', foreground: 'f8f8f2' },
  ],
  colors: {
    'editor.background': '#282a36',
    'editor.foreground': '#f8f8f2',
    'editor.selectionBackground': '#44475a',
    'editor.lineHighlightBackground': '#44475a75',
    'editor.lineHighlightBorder': '#00000000',
    'editorCursor.foreground': '#f8f8f0',
    'editorWhitespace.foreground': '#3b3a32',
    'editorLineNumber.foreground': '#6272a4',
    'editorLineNumber.activeForeground': '#f8f8f2',
  },
};

const options: editor.IStandaloneEditorConstructionOptions = {
  stickyScroll: { enabled: false },
  fontSize: 14,
  fontFamily: "'Fira Code', 'Cascadia Code', Consolas, monospace",
  minimap: { enabled: false },
  scrollBeyondLastLine: false,
  automaticLayout: true,
  padding: { top: 16, bottom: 16 },
  cursorBlinking: 'smooth',
  cursorSmoothCaretAnimation: 'on',
  lineHeight: 22,
  renderLineHighlight: 'none',
  fixedOverflowWidgets: false,
  formatOnType: true,
  formatOnPaste: true,
  scrollbar: {
    vertical: 'hidden',
    horizontal: 'hidden',
    useShadows: false,
  },
  overviewRulerLanes: 0,
  quickSuggestions: false,
  suggestOnTriggerCharacters: false,
  wordBasedSuggestions: 'off',
  parameterHints: { enabled: false },
  suggest: { showWords: false },
};

export const EDITOR_CONFIGS = {
  draculaTheme,
  options,
};
