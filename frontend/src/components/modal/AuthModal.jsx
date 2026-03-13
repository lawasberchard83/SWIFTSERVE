import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn, UserPlus, X } from 'lucide-react';

const AuthModal = ({ isOpen, onClose }) => {
    const navigate = useNavigate();

    if (!isOpen) return null;

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px'
        }}>
            <div style={{
                backgroundColor: '#fff',
                borderRadius: '16px',
                width: '100%',
                maxWidth: '400px',
                padding: '32px',
                position: 'relative',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                textAlign: 'center'
            }}>
                <button 
                    onClick={onClose}
                    style={{
                        position: 'absolute',
                        top: '16px',
                        right: '16px',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        color: '#9ca3af',
                        padding: '4px'
                    }}
                >
                    <X size={20} />
                </button>

                <div style={{
                    width: '64px',
                    height: '64px',
                    backgroundColor: '#e0f2fe',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 24px auto'
                }}>
                    <LogIn size={32} color="#0084ff" />
                </div>

                <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#111827', marginBottom: '8px' }}>
                    Login Required
                </h2>
                
                <p style={{ fontSize: '14px', color: '#4b5563', marginBottom: '32px', lineHeight: '1.5' }}>
                    Please log in or create an account to start ordering delicious campus food!
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <button 
                        onClick={() => navigate('/login')}
                        style={{
                            width: '100%',
                            padding: '14px',
                            backgroundColor: '#0084ff',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '8px',
                            fontWeight: '600',
                            fontSize: '15px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px',
                            transition: 'background-color 0.2s'
                        }}
                        onMouseOver={(e) => e.target.style.backgroundColor = '#0066cc'}
                        onMouseOut={(e) => e.target.style.backgroundColor = '#0084ff'}
                    >
                        <LogIn size={18} />
                        Log In to SwiftServe
                    </button>
                    
                    <button 
                        onClick={() => navigate('/register')}
                        style={{
                            width: '100%',
                            padding: '14px',
                            backgroundColor: '#fff',
                            color: '#0084ff',
                            border: '2px solid #0084ff',
                            borderRadius: '8px',
                            fontWeight: '600',
                            fontSize: '15px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px',
                            transition: 'background-color 0.2s'
                        }}
                        onMouseOver={(e) => e.target.style.backgroundColor = '#f0f7ff'}
                        onMouseOut={(e) => e.target.style.backgroundColor = '#fff'}
                    >
                        <UserPlus size={18} />
                        Create New Account
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AuthModal;
