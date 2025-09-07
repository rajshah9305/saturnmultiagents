import React from 'react';
import { Variant } from '../../types';

interface PreviewPaneProps {
    variant: Variant;
    viewport: 'mobile' | 'tablet' | 'desktop';
}

const PreviewPane = ({ variant, viewport }: PreviewPaneProps) => {
    const getViewportSize = () => {
        if (viewport === 'mobile') return 'w-[375px] h-[667px] max-w-full max-h-full';
        if (viewport === 'tablet') return 'w-[768px] h-[1024px] max-w-full max-h-full';
        return 'w-full h-full';
    };

    const htmlDoc = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <script src="https://cdn.tailwindcss.com"></script>
            <style>
                /* Simple scrollbar styling for the preview */
                ::-webkit-scrollbar { width: 6px; }
                ::-webkit-scrollbar-track { background: #f1f5f9; }
                ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 3px; }
                ::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
            </style>
        </head>
        <body class="bg-white">
            ${variant.preview}
        </body>
        </html>
    `;

    return (
        <div className="w-full h-full flex items-center justify-center bg-neural-gray-200 p-4 animate-fade-in">
            <iframe
                key={variant.id} // Re-mount iframe when variant changes
                title="Preview"
                srcDoc={htmlDoc}
                className={`bg-white rounded-md shadow-lg transition-all duration-300 ease-in-out border border-neural-gray-300 ${getViewportSize()}`}
                sandbox="allow-scripts"
            />
        </div>
    );
};

export default PreviewPane;