import React, { useEffect, useState } from 'react';
import * as Icons from './icons';

interface ToastProps {
    message: string;
    onClose: () => void;
    duration?: number;
}

const Toast: React.FC<ToastProps> = ({ message, onClose, duration = 5000 }) => {
    const [isFadingOut, setIsFadingOut] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsFadingOut(true);
        }, duration);

        const fadeOutTimer = setTimeout(() => {
            onClose();
        }, duration + 500); // 500ms for fade out animation

        return () => {
            clearTimeout(timer);
            clearTimeout(fadeOutTimer);
        };
    }, [duration, onClose]);

    const handleClose = () => {
        setIsFadingOut(true);
        setTimeout(onClose, 500);
    };

    return (
        <div 
            className={`fixed bottom-5 right-5 w-full max-w-sm p-4 rounded-lg shadow-lg flex items-start gap-4 z-[100] bg-neural-gray-800 border border-ai-red-error/50 ${isFadingOut ? 'animate-fade-out' : 'animate-fade-in'}`}
            role="alert"
        >
            <div className="flex-shrink-0 text-ai-red-error">
                <Icons.AlertTriangle className="w-6 h-6" />
            </div>
            <div className="flex-grow">
                <p className="font-bold text-quantum-white">Error</p>
                <p className="text-sm text-neural-gray-200">{message}</p>
            </div>
            <div className="flex-shrink-0">
                <button onClick={handleClose} className="text-neural-gray-200 hover:text-quantum-white">
                    <Icons.XCircle className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
};

export default Toast;
