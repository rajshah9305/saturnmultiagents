import React, { useEffect, useRef, useState } from 'react';
import { Variant } from '../../types';
import * as Icons from '../icons';

declare const hljs: any;

interface CodePaneProps {
    variant: Variant;
}

const CodePane = ({ variant }: CodePaneProps) => {
    const codeRef = useRef<HTMLElement>(null);
    const [isCopied, setIsCopied] = useState(false);

    useEffect(() => {
        if (variant && codeRef.current) {
            codeRef.current.textContent = variant.code;
            hljs.highlightElement(codeRef.current);
        }
    }, [variant]);

    const handleCopy = () => {
        if (!variant.code) return;
        navigator.clipboard.writeText(variant.code);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    };

    const handleDownload = () => {
        if (!variant.code) return;
        const blob = new Blob([variant.code], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${variant.name.replace(/\s+/g, '_')}.tsx`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    return (
        <div className="h-full bg-[#282c34] rounded-lg overflow-hidden flex flex-col animate-fade-in">
            <div className="flex-shrink-0 bg-[#21252b] p-2 flex justify-end gap-2">
                 <button onClick={handleDownload} className="flex items-center gap-2 px-3 py-1 bg-neural-gray-700 text-sm rounded-md hover:bg-neural-gray-600">
                    <Icons.Download className="w-4 h-4" />
                    Download File
                </button>
                <button onClick={handleCopy} className="px-3 py-1 bg-neural-gray-700 text-sm rounded-md hover:bg-neural-gray-600 w-24 text-center">
                    {isCopied ? 'Copied!' : 'Copy'}
                </button>
            </div>
            <pre className="h-full m-0 flex-grow overflow-auto">
                <code ref={codeRef} className="language-jsx p-4 block h-full font-mono">
                    {/* Content is set by highlight.js */}
                </code>
            </pre>
        </div>
    );
};

export default CodePane;