import type { editor } from 'monaco-editor';

const draculaTheme = {
  base: 'vs-dark' as const,
  inherit: true,
  rules: [
    // Comments
    { token: 'comment', foreground: '6272a4', fontStyle: 'italic' },

    // Keywords (const, let, var, function, class, etc.)
    { token: 'keyword', foreground: 'ff79c6' },
    { token: 'keyword.control', foreground: 'ff79c6' },

    // Variables & Functions
    { token: 'variable', foreground: 'f8f8f2' },
    { token: 'variable.other', foreground: 'f8f8f2' },
    { token: 'variable.parameter', foreground: 'ffb86c', fontStyle: 'italic' },

    // Function Names (definitions and calls)
    { token: 'entity.name.function', foreground: '50fa7b' },
    { token: 'meta.function-call', foreground: '50fa7b' },
    { token: 'support.function', foreground: '50fa7b' },
    { token: 'meta.function-call.generic', foreground: '50fa7b' },
    { token: 'entity.name.function-call', foreground: '50fa7b' },

    // Method calls
    { token: 'meta.method-call', foreground: '50fa7b' },
    { token: 'entity.name.method', foreground: '50fa7b' },

    // Types & Classes
    { token: 'entity.name.type', foreground: '8be9fd', fontStyle: 'italic' },
    { token: 'entity.name.class', foreground: '8be9fd' },
    { token: 'support.type', foreground: '8be9fd', fontStyle: 'italic' },
    { token: 'support.class', foreground: '8be9fd' },

    // Strings
    { token: 'string', foreground: 'f1fa8c' },
    { token: 'string.quoted', foreground: 'f1fa8c' },

    // Numbers
    { token: 'constant.numeric', foreground: 'bd93f9' },
    { token: 'number', foreground: 'bd93f9' },

    // Constants & Booleans
    { token: 'constant', foreground: 'bd93f9' },
    { token: 'constant.language', foreground: 'bd93f9' },
    { token: 'constant.language.boolean', foreground: 'bd93f9' },

    // Operators & Delimiters
    { token: 'keyword.operator', foreground: 'ff79c6' },
    { token: 'delimiter', foreground: 'f8f8f2' },
    { token: 'delimiter.bracket', foreground: 'f8f8f2' },
    { token: 'delimiter.parenthesis', foreground: 'f8f8f2' },

    // Punctuation
    { token: 'punctuation', foreground: 'f8f8f2' },
    { token: 'punctuation.definition', foreground: 'f8f8f2' },

    // Properties
    { token: 'meta.object-literal.key', foreground: 'f8f8f2' },
    { token: 'support.variable.property', foreground: 'f8f8f2' },
    { token: 'variable.other.property', foreground: 'f8f8f2' },

    // Storage (function, const, let, var)
    { token: 'storage', foreground: 'ff79c6' },
    { token: 'storage.type', foreground: '8be9fd', fontStyle: 'italic' },
    { token: 'storage.modifier', foreground: 'ff79c6' },

    // Tags (for HTML/JSX)
    { token: 'entity.name.tag', foreground: 'ff79c6' },
    { token: 'meta.tag', foreground: 'f8f8f2' },

    // Identifiers (catch-all for function calls if not matched above)
    { token: 'identifier', foreground: 'f8f8f2' },
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
    'editorIndentGuide.background': '#44475a',
    'editorIndentGuide.activeBackground': '#6272a4',
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

  // Enable semantic highlighting for better function call detection
  'semanticHighlighting.enabled': true,
};

export const EDITOR_CONFIGS = {
  draculaTheme,
  options,
};
