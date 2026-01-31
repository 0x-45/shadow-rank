'use client';

import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { vscodeDark } from '@uiw/codemirror-theme-vscode';

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  readOnly?: boolean;
  height?: string;
  placeholder?: string;
}

/**
 * CodeEditor - A CodeMirror-based code editor component
 * 
 * Features:
 * - JavaScript/TypeScript syntax highlighting
 * - Dark theme (VS Code inspired)
 * - Controlled value/onChange props
 * - Configurable height
 * - Optional read-only mode
 */
export default function CodeEditor({ 
  value, 
  onChange, 
  readOnly = false,
  height = '300px',
  placeholder = '// Write your code here...'
}: CodeEditorProps) {
  return (
    <div className="rounded-lg overflow-hidden border border-card-border">
      <CodeMirror
        value={value}
        height={height}
        theme={vscodeDark}
        extensions={[javascript({ jsx: true, typescript: true })]}
        onChange={onChange}
        readOnly={readOnly}
        placeholder={placeholder}
        basicSetup={{
          lineNumbers: true,
          highlightActiveLineGutter: true,
          highlightSpecialChars: true,
          history: true,
          foldGutter: true,
          drawSelection: true,
          dropCursor: true,
          allowMultipleSelections: true,
          indentOnInput: true,
          syntaxHighlighting: true,
          bracketMatching: true,
          closeBrackets: true,
          autocompletion: true,
          rectangularSelection: true,
          crosshairCursor: true,
          highlightActiveLine: true,
          highlightSelectionMatches: true,
          closeBracketsKeymap: true,
          defaultKeymap: true,
          searchKeymap: true,
          historyKeymap: true,
          foldKeymap: true,
          completionKeymap: true,
          lintKeymap: true,
        }}
        className="text-sm"
      />
    </div>
  );
}
