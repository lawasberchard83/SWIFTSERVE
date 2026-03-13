import React, { useEffect } from 'react';
import { CheckCircle, AlertCircle, X } from 'lucide-react';

const Notification = ({ message, type = 'success', onClose, duration = 3000 }) => {
    useEffect(() => {
        if (duration && onClose) {
            const timer = setTimeout(onClose, duration);
            return () => clearTimeout(timer);
        }
    }, [duration, onClose]);

    if (!message) return null;

    const isSuccess = type === 'success';

    return (
        <div style={{
            position: 'fixed',
            top: '24px',
            right: '24px',
            backgroundColor: '#fff',
            borderRadius: '12px',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
            padding: '16px 20px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            zIndex: 9999,
            animation: 'slideInRight 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
            minWidth: '280px',
            maxWidth: '380px',
            borderLeft: `4px solid ${isSuccess ? '#10b981' : '#ef4444'}`
        }}>
            {/* Custom inner animation style */}
            <style>
                {`
                    @keyframes slideInRight {
                        from { transform: translateX(100%); opacity: 0; }
                        to { transform: translateX(0); opacity: 1; }
                    }
                `}
            </style>

            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
            }}>
                {isSuccess ? (
                    <CheckCircle size={24} color="#10b981" />
                ) : (
                    <AlertCircle size={24} color="#ef4444" />
                )}
            </div>
            
            <div style={{ flex: 1 }}>
                <p style={{
                    margin: 0,
                    fontSize: '15px',
                    fontWeight: '600',
                    color: '#111827',
                    lineHeight: '1.4'
                }}>
                    {message}
                </p>
            </div>

            <button
                onClick={onClose}
                style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#9ca3af',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '4px',
                    marginLeft: '8px'
                }}
            >
                <X size={18} />
            </button>
        </div>
    );
};

export default Notification;
