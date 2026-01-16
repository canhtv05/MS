import type { editor } from 'monaco-editor';

const draculaTheme = {
  base: 'vs-dark' as const,
  inherit: true,
  rules: [
    // Comments
    { token: 'comment', foreground: '6272a4', fontStyle: 'italic' },
    { token: 'comment.block', foreground: '6272a4', fontStyle: 'italic' },
    { token: 'comment.line', foreground: '6272a4', fontStyle: 'italic' },
    { token: 'comment.doc', foreground: '6272a4', fontStyle: 'italic' },

    // Keywords (const, let, var, function, class, etc.)
    { token: 'keyword', foreground: 'ff79c6' },
    { token: 'keyword.control', foreground: 'ff79c6' },
    { token: 'keyword.control.flow', foreground: 'ff79c6' },
    { token: 'keyword.operator.new', foreground: 'ff79c6' },
    { token: 'keyword.other', foreground: 'ff79c6' },

    // Variables & Functions
    { token: 'variable', foreground: 'f8f8f2' },
    { token: 'variable.other', foreground: 'f8f8f2' },
    { token: 'variable.parameter', foreground: 'ffb86c', fontStyle: 'italic' },
    { token: 'variable.language', foreground: 'bd93f9', fontStyle: 'italic' },
    { token: 'variable.other.constant', foreground: 'bd93f9' },

    // Function Names (definitions and calls)
    { token: 'entity.name.function', foreground: '50fa7b' },
    { token: 'meta.function-call', foreground: '50fa7b' },
    { token: 'support.function', foreground: '50fa7b' },
    { token: 'meta.function-call.generic', foreground: '50fa7b' },
    { token: 'entity.name.function-call', foreground: '50fa7b' },
    { token: 'function', foreground: '50fa7b' },
    { token: 'function.call', foreground: '50fa7b' },

    // Method calls
    { token: 'meta.method-call', foreground: '50fa7b' },
    { token: 'entity.name.method', foreground: '50fa7b' },
    { token: 'method', foreground: '50fa7b' },

    // Types & Classes
    { token: 'entity.name.type', foreground: '8be9fd', fontStyle: 'italic' },
    { token: 'entity.name.class', foreground: '8be9fd' },
    { token: 'support.type', foreground: '8be9fd', fontStyle: 'italic' },
    { token: 'support.class', foreground: '8be9fd' },
    { token: 'type', foreground: '8be9fd', fontStyle: 'italic' },
    { token: 'type.identifier', foreground: '8be9fd', fontStyle: 'italic' },
    { token: 'class', foreground: '8be9fd' },
    { token: 'interface', foreground: '8be9fd', fontStyle: 'italic' },
    { token: 'enum', foreground: '8be9fd' },
    { token: 'namespace', foreground: '8be9fd' },
    { token: 'typeParameter', foreground: '8be9fd', fontStyle: 'italic' },

    // Strings
    { token: 'string', foreground: 'f1fa8c' },
    { token: 'string.quoted', foreground: 'f1fa8c' },
    { token: 'string.template', foreground: 'f1fa8c' },
    { token: 'string.regex', foreground: 'ff5555' },
    { token: 'string.escape', foreground: 'ff79c6' },

    // Numbers
    { token: 'constant.numeric', foreground: 'bd93f9' },
    { token: 'number', foreground: 'bd93f9' },
    { token: 'number.float', foreground: 'bd93f9' },
    { token: 'number.hex', foreground: 'bd93f9' },

    // Constants & Booleans
    { token: 'constant', foreground: 'bd93f9' },
    { token: 'constant.language', foreground: 'bd93f9' },
    { token: 'constant.language.boolean', foreground: 'bd93f9' },
    { token: 'constant.language.null', foreground: 'bd93f9' },
    { token: 'constant.language.undefined', foreground: 'bd93f9' },

    // Operators & Delimiters
    { token: 'keyword.operator', foreground: 'ff79c6' },
    { token: 'keyword.operator.assignment', foreground: 'ff79c6' },
    { token: 'keyword.operator.arithmetic', foreground: 'ff79c6' },
    { token: 'keyword.operator.logical', foreground: 'ff79c6' },
    { token: 'keyword.operator.comparison', foreground: 'ff79c6' },
    { token: 'operator', foreground: 'ff79c6' },
    { token: 'delimiter', foreground: 'f8f8f2' },
    { token: 'delimiter.bracket', foreground: 'f8f8f2' },
    { token: 'delimiter.parenthesis', foreground: 'f8f8f2' },
    { token: 'delimiter.square', foreground: 'f8f8f2' },
    { token: 'delimiter.curly', foreground: 'f8f8f2' },
    { token: 'delimiter.angle', foreground: 'f8f8f2' },

    // Punctuation
    { token: 'punctuation', foreground: 'f8f8f2' },
    { token: 'punctuation.definition', foreground: 'f8f8f2' },
    { token: 'punctuation.separator', foreground: 'f8f8f2' },
    { token: 'punctuation.terminator', foreground: 'f8f8f2' },

    // Properties
    { token: 'meta.object-literal.key', foreground: '8be9fd' },
    { token: 'support.variable.property', foreground: 'f8f8f2' },
    { token: 'variable.other.property', foreground: 'f8f8f2' },
    { token: 'property', foreground: '8be9fd' },
    { token: 'variable.object.property', foreground: 'f8f8f2' },

    // Storage (function, const, let, var)
    { token: 'storage', foreground: 'ff79c6' },
    { token: 'storage.type', foreground: '8be9fd', fontStyle: 'italic' },
    { token: 'storage.modifier', foreground: 'ff79c6' },
    { token: 'storage.type.function', foreground: 'ff79c6' },
    { token: 'storage.type.class', foreground: 'ff79c6' },

    // Tags (for HTML/JSX)
    { token: 'entity.name.tag', foreground: 'ff79c6' },
    { token: 'meta.tag', foreground: 'f8f8f2' },
    { token: 'tag', foreground: 'ff79c6' },
    { token: 'tag.attribute.name', foreground: '50fa7b' },

    // Attributes (JSX/HTML)
    { token: 'entity.other.attribute-name', foreground: '50fa7b' },
    { token: 'attribute.name', foreground: '50fa7b' },
    { token: 'attribute.value', foreground: 'f1fa8c' },

    // Annotations & Decorators
    { token: 'meta.decorator', foreground: '50fa7b' },
    { token: 'punctuation.decorator', foreground: '50fa7b' },
    { token: 'annotation', foreground: '50fa7b' },

    // Imports/Exports
    { token: 'keyword.control.import', foreground: 'ff79c6' },
    { token: 'keyword.control.export', foreground: 'ff79c6' },
    { token: 'keyword.control.from', foreground: 'ff79c6' },
    { token: 'keyword.control.as', foreground: 'ff79c6' },

    // Special identifiers
    { token: 'support.constant', foreground: 'bd93f9' },
    { token: 'support.variable', foreground: 'f8f8f2' },
    { token: 'meta.brace', foreground: 'f8f8f2' },

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

const lightTheme = {
  base: 'vs' as const,
  inherit: true,
  rules: [
    // Comments
    { token: 'comment', foreground: '6a737d', fontStyle: 'italic' },
    { token: 'comment.block', foreground: '6a737d', fontStyle: 'italic' },
    { token: 'comment.line', foreground: '6a737d', fontStyle: 'italic' },
    { token: 'comment.doc', foreground: '6a737d', fontStyle: 'italic' },

    // Keywords
    { token: 'keyword', foreground: 'd73a49' },
    { token: 'keyword.control', foreground: 'd73a49' },
    { token: 'keyword.control.flow', foreground: 'd73a49' },
    { token: 'keyword.operator.new', foreground: 'd73a49' },
    { token: 'keyword.other', foreground: 'd73a49' },

    // Variables & Functions
    { token: 'variable', foreground: '24292e' },
    { token: 'variable.other', foreground: '24292e' },
    { token: 'variable.parameter', foreground: 'e36209', fontStyle: 'italic' },
    { token: 'variable.language', foreground: '005cc5', fontStyle: 'italic' },
    { token: 'variable.other.constant', foreground: '005cc5' },

    // Function Names
    { token: 'entity.name.function', foreground: '6f42c1' },
    { token: 'meta.function-call', foreground: '6f42c1' },
    { token: 'support.function', foreground: '6f42c1' },
    { token: 'meta.function-call.generic', foreground: '6f42c1' },
    { token: 'entity.name.function-call', foreground: '6f42c1' },
    { token: 'function', foreground: '6f42c1' },
    { token: 'function.call', foreground: '6f42c1' },

    // Method calls
    { token: 'meta.method-call', foreground: '6f42c1' },
    { token: 'entity.name.method', foreground: '6f42c1' },
    { token: 'method', foreground: '6f42c1' },

    // Types & Classes
    { token: 'entity.name.type', foreground: '22863a', fontStyle: 'italic' },
    { token: 'entity.name.class', foreground: '22863a' },
    { token: 'support.type', foreground: '22863a', fontStyle: 'italic' },
    { token: 'support.class', foreground: '22863a' },
    { token: 'type', foreground: '22863a', fontStyle: 'italic' },
    { token: 'type.identifier', foreground: '22863a', fontStyle: 'italic' },
    { token: 'class', foreground: '22863a' },
    { token: 'interface', foreground: '22863a', fontStyle: 'italic' },
    { token: 'enum', foreground: '22863a' },
    { token: 'namespace', foreground: '22863a' },
    { token: 'typeParameter', foreground: '22863a', fontStyle: 'italic' },

    // Strings
    { token: 'string', foreground: '032f62' },
    { token: 'string.quoted', foreground: '032f62' },
    { token: 'string.template', foreground: '032f62' },
    { token: 'string.regex', foreground: '22863a' },
    { token: 'string.escape', foreground: 'd73a49' },

    // Numbers
    { token: 'constant.numeric', foreground: '005cc5' },
    { token: 'number', foreground: '005cc5' },
    { token: 'number.float', foreground: '005cc5' },
    { token: 'number.hex', foreground: '005cc5' },

    // Constants & Booleans
    { token: 'constant', foreground: '005cc5' },
    { token: 'constant.language', foreground: '005cc5' },
    { token: 'constant.language.boolean', foreground: '005cc5' },
    { token: 'constant.language.null', foreground: '005cc5' },
    { token: 'constant.language.undefined', foreground: '005cc5' },

    // Operators & Delimiters
    { token: 'keyword.operator', foreground: 'd73a49' },
    { token: 'keyword.operator.assignment', foreground: 'd73a49' },
    { token: 'keyword.operator.arithmetic', foreground: 'd73a49' },
    { token: 'keyword.operator.logical', foreground: 'd73a49' },
    { token: 'keyword.operator.comparison', foreground: 'd73a49' },
    { token: 'operator', foreground: 'd73a49' },
    { token: 'delimiter', foreground: '24292e' },
    { token: 'delimiter.bracket', foreground: '24292e' },
    { token: 'delimiter.parenthesis', foreground: '24292e' },
    { token: 'delimiter.square', foreground: '24292e' },
    { token: 'delimiter.curly', foreground: '24292e' },
    { token: 'delimiter.angle', foreground: '24292e' },

    // Punctuation
    { token: 'punctuation', foreground: '24292e' },
    { token: 'punctuation.definition', foreground: '24292e' },
    { token: 'punctuation.separator', foreground: '24292e' },
    { token: 'punctuation.terminator', foreground: '24292e' },

    // Properties
    { token: 'meta.object-literal.key', foreground: '005cc5' },
    { token: 'support.variable.property', foreground: '24292e' },
    { token: 'variable.other.property', foreground: '24292e' },
    { token: 'property', foreground: '005cc5' },
    { token: 'variable.object.property', foreground: '24292e' },

    // Storage
    { token: 'storage', foreground: 'd73a49' },
    { token: 'storage.type', foreground: 'd73a49', fontStyle: 'italic' },
    { token: 'storage.modifier', foreground: 'd73a49' },
    { token: 'storage.type.function', foreground: 'd73a49' },
    { token: 'storage.type.class', foreground: 'd73a49' },

    // Tags (HTML/JSX)
    { token: 'entity.name.tag', foreground: '22863a' },
    { token: 'meta.tag', foreground: '24292e' },
    { token: 'tag', foreground: '22863a' },
    { token: 'tag.attribute.name', foreground: '6f42c1' },

    // Attributes
    { token: 'entity.other.attribute-name', foreground: '6f42c1' },
    { token: 'attribute.name', foreground: '6f42c1' },
    { token: 'attribute.value', foreground: '032f62' },

    // Annotations & Decorators
    { token: 'meta.decorator', foreground: '6f42c1' },
    { token: 'punctuation.decorator', foreground: '6f42c1' },
    { token: 'annotation', foreground: '6f42c1' },

    // Imports/Exports
    { token: 'keyword.control.import', foreground: 'd73a49' },
    { token: 'keyword.control.export', foreground: 'd73a49' },
    { token: 'keyword.control.from', foreground: 'd73a49' },
    { token: 'keyword.control.as', foreground: 'd73a49' },

    // Special identifiers
    { token: 'support.constant', foreground: '005cc5' },
    { token: 'support.variable', foreground: '24292e' },
    { token: 'meta.brace', foreground: '24292e' },

    // Identifiers
    { token: 'identifier', foreground: '24292e' },
  ],
  colors: {
    'editor.background': '#F9FBFC',
    'editor.foreground': '#24292e',
    'editor.selectionBackground': '#b3d7ff',
    'editor.lineHighlightBackground': '#f6f8fa',
    'editor.lineHighlightBorder': '#00000000',
    'editorCursor.foreground': '#24292e',
    'editorWhitespace.foreground': '#d1d5da',
    'editorLineNumber.foreground': '#959da5',
    'editorLineNumber.activeForeground': '#24292e',
    'editorIndentGuide.background': '#e1e4e8',
    'editorIndentGuide.activeBackground': '#959da5',
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

  // Tắt tất cả các loại autocomplete/suggestions
  quickSuggestions: false,
  suggestOnTriggerCharacters: false,
  wordBasedSuggestions: 'off',
  parameterHints: { enabled: false },
  suggest: { showWords: false },
  acceptSuggestionOnCommitCharacter: false,
  acceptSuggestionOnEnter: 'off',
  tabCompletion: 'off',
  inlineSuggest: { enabled: false },

  // Enable semantic highlighting for better function call detection
  'semanticHighlighting.enabled': true,
};

export const EDITOR_CONFIGS = {
  draculaTheme,
  lightTheme,
  options,
};
