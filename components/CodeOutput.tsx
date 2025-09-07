import React, { useState, useEffect, useRef } from 'react';

// Since highlight.js is loaded from a script tag, we need to declare it for TypeScript
declare const hljs: any;

interface CodeOutputProps {
  code: string;
  isGenerating: boolean;
}

const CodeOutput: React.FC<CodeOutputProps> = ({ code, isGenerating }) => {
  const codeRef = useRef<HTMLElement>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (codeRef.current && code) {
      hljs.highlightElement(codeRef.current);
    }
  }, [code]);
  
  const handleCopy = () => {
    if (code) {
      navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="h-96 bg-gray-900 rounded-lg font-mono text-sm relative">
       {code && (
        <button 
          onClick={handleCopy}
          className="absolute top-3 right-3 bg-gray-700 hover:bg-gray-600 text-gray-300 px-3 py-1 rounded-md text-xs z-20 transition-colors"
          aria-label="Copy code to clipboard"
        >
          {copied ? 'Copied!' : 'Copy'}
        </button>
      )}
      {isGenerating && (
         <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-80 z-10">
            <div className="text-center">
                 <svg className="animate-spin mx-auto h-8 w-8 text-indigo-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                 </svg>
                 <p className="mt-2 text-gray-400">Senior Engineer is coding...</p>
            </div>
         </div>
      )}
      {!code && !isGenerating && (
          <div className="flex items-center justify-center h-full text-gray-500">
              Generated code will appear here...
          </div>
      )}
      {code && (
        <pre className="h-full overflow-auto !bg-gray-900 p-4 rounded-b-lg">
          <code ref={codeRef} className="typescript !bg-transparent p-0">
            {code}
          </code>
        </pre>
      )}
    </div>
  );
};

export default CodeOutput;