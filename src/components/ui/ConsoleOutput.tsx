'use client';

import { Terminal, AlertCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react';

export interface ConsoleMessage {
  type: 'log' | 'error' | 'warn' | 'info' | 'result';
  content: string;
  timestamp?: number;
}

interface ConsoleOutputProps {
  messages: ConsoleMessage[];
  maxHeight?: string;
}

/**
 * ConsoleOutput - Displays console output from code execution
 * 
 * Features:
 * - Different message types (log, error, warn, info, result)
 * - Visual differentiation with icons and colors
 * - Scrollable output area
 * - Timestamp support (optional)
 */
export default function ConsoleOutput({ 
  messages, 
  maxHeight = '200px' 
}: ConsoleOutputProps) {
  const getIcon = (type: ConsoleMessage['type']) => {
    switch (type) {
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />;
      case 'warn':
        return <AlertTriangle className="w-4 h-4 text-yellow-400 flex-shrink-0" />;
      case 'info':
        return <Info className="w-4 h-4 text-blue-400 flex-shrink-0" />;
      case 'result':
        return <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />;
      default:
        return <Terminal className="w-4 h-4 text-muted flex-shrink-0" />;
    }
  };

  const getTextColor = (type: ConsoleMessage['type']) => {
    switch (type) {
      case 'error':
        return 'text-red-400';
      case 'warn':
        return 'text-yellow-400';
      case 'info':
        return 'text-blue-400';
      case 'result':
        return 'text-green-400';
      default:
        return 'text-foreground';
    }
  };

  const getBgColor = (type: ConsoleMessage['type']) => {
    switch (type) {
      case 'error':
        return 'bg-red-500/10';
      case 'warn':
        return 'bg-yellow-500/10';
      case 'result':
        return 'bg-green-500/10';
      default:
        return '';
    }
  };

  return (
    <div className="rounded-lg border border-card-border bg-[#1e1e1e] overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-2 px-3 py-2 border-b border-card-border bg-card-bg">
        <Terminal className="w-4 h-4 text-muted" />
        <span className="text-sm text-muted">Console Output</span>
        {messages.length > 0 && (
          <span className="text-xs text-muted bg-card-border px-2 py-0.5 rounded-full ml-auto">
            {messages.length} {messages.length === 1 ? 'message' : 'messages'}
          </span>
        )}
      </div>

      {/* Output Area */}
      <div 
        className="overflow-y-auto font-mono text-sm p-2 space-y-1"
        style={{ maxHeight }}
      >
        {messages.length === 0 ? (
          <div className="text-muted text-center py-4">
            Run your code to see output here
          </div>
        ) : (
          messages.map((msg, index) => (
            <div
              key={index}
              className={`
                flex items-start gap-2 px-2 py-1 rounded
                ${getBgColor(msg.type)}
              `}
            >
              {getIcon(msg.type)}
              <pre className={`${getTextColor(msg.type)} whitespace-pre-wrap break-all flex-1`}>
                {msg.content}
              </pre>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
