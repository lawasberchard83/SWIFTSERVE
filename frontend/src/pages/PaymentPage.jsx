import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NavigationBar from '../components/NavigationBar';
import Footer from '../components/Footer';

const PaymentPage = () => {
    const navigate = useNavigate();
    const [selectedBank, setSelectedBank] = useState(null);

    const banks = [
        { id: 1, name: 'Bank 1' },
        { id: 2, name: 'Bank 2' },
        { id: 3, name: 'Bank 3' }
    ];

    const subtotal = 23.98;
    const shipping = 3.98;
    const tax = 4.66;
    const total = subtotal + shipping + tax;

    return (
        <div className="payment-page" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#fff' }}>
            <NavigationBar showSearch={false} />

            <div style={{ maxWidth: '1200px', margin: '60px auto', padding: '0 20px', display: 'flex', gap: '80px', flex: 1, width: '100%' }}>
                {/* Left Side: Payment Method & Shipping */}
                <div style={{ flex: '1 1 60%' }}>
                    <h2 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '32px', color: '#111' }}>
                        Select Payment Method:
                    </h2>

                    {/* Bank Selection Grid */}
                    <div style={{ display: 'flex', gap: '20px', marginBottom: '80px' }}>
                        {banks.map((bank) => (
                            <div
                                key={bank.id}
                                onClick={() => setSelectedBank(bank.id)}
                                style={{
                                    width: '140px',
                                    height: '140px',
                                    backgroundColor: '#f5f5f5',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    cursor: 'pointer',
                                    border: selectedBank === bank.id ? '2px solid #0084ff' : '2px solid transparent',
                                    transition: 'border-color 0.2s'
                                }}
                            >
                                <span style={{ fontSize: '12px', color: '#666' }}>Bank Image</span>
                            </div>
                        ))}
                    </div>

                    {/* Shipping Address */}
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '20px' }}>
                        <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#111' }}>
                            Shipping Address:
                        </h2>
                        <button style={{
                            backgroundColor: '#000',
                            color: '#fff',
                            border: 'none',
                            padding: '8px 24px',
                            borderRadius: '4px',
                            fontWeight: '600',
                            fontSize: '12px',
                            cursor: 'pointer'
                        }}>
                            Change
                        </button>
                    </div>
                    <p style={{ fontSize: '14px', color: '#555', lineHeight: '1.6' }}>
                        7VVJ+QFR, Natalio B. Bacalso Ave, Cebu City, 6000 Cebu
                    </p>
                </div>

                {/* Right Side: Order Summary */}
                <div style={{ flex: '1 1 35%', maxWidth: '400px' }}>
                    <h2 style={{ fontSize: '16px', fontWeight: '800', marginBottom: '24px', color: '#111' }}>
                        Order Summary:
                    </h2>

                    <div style={{ borderTop: '2px solid #ddd', paddingTop: '24px', paddingBottom: '24px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px', fontSize: '14px', color: '#555' }}>
                            <span>Sub-total</span>
                            <span style={{ fontWeight: '800', color: '#111' }}>€{subtotal.toFixed(2)}</span>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px', fontSize: '14px', color: '#555' }}>
                            <span>Shipping</span>
                            <span style={{ fontWeight: '800', color: '#111' }}>€{shipping.toFixed(2)}</span>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px', fontSize: '14px', color: '#555' }}>
                            <span>TAX</span>
                            <span style={{ fontWeight: '800', color: '#111' }}>€{tax.toFixed(2)}</span>
                        </div>
                    </div>

                    <div style={{ borderTop: '2px solid #ddd', paddingTop: '24px', display: 'flex', justifyContent: 'space-between', marginBottom: '40px' }}>
                        <span style={{ fontSize: '14px', fontWeight: '800', color: '#111' }}>TOTAL</span>
                        <span style={{ fontSize: '14px', fontWeight: '800', color: '#111' }}>€{total.toFixed(2)}</span>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <button className="btn btn-primary" style={{ width: '100%', padding: '14px', fontSize: '14px', borderRadius: '4px', backgroundColor: '#0084ff' }}>
                            Place Order
                        </button>
                        <button className="btn btn-outline" onClick={() => navigate('/cart')} style={{ width: '100%', padding: '14px', fontSize: '14px', borderRadius: '4px', backgroundColor: '#000', color: '#fff', border: 'none' }}>
                            Cancel
                        </button>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default PaymentPage;
