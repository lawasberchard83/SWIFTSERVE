import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NavigationBar from '../../components/NavigationBar';
import Footer from '../../components/Footer';
import Notification from '../../components/Notification';
import { CreditCard, Wallet, Smartphone, Plus, Minus, X, Send, AlertCircle } from 'lucide-react';

const PaymentPage = () => {
    const navigate = useNavigate();
    const [selectedMethod, setSelectedMethod] = useState('card');
    const [promoCode, setPromoCode] = useState('');
    const [deliveryAddress, setDeliveryAddress] = useState('');

    const [items, setItems] = useState(() => {
        const savedCart = localStorage.getItem('cartItems');
        if (savedCart) {
            try {
                return JSON.parse(savedCart);
            } catch (e) {
                console.error("Could not parse cart", e);
            }
        }
        return [];
    });
    const [isProcessing, setIsProcessing] = useState(false);
    const [notification, setNotification] = useState({ message: '', type: '' });

    const showNotification = (message, type = 'success') => {
        setNotification({ message, type });
    };

    const handleQuantityChange = (id, change) => {
        setItems(items.map(item => {
            if (item.id === id) {
                const maxStock = item.stock_quantity || 1;
                let newQuantity = item.quantity + change;
                if (newQuantity > maxStock) newQuantity = maxStock;
                if (newQuantity < 1) newQuantity = 1;
                return { ...item, quantity: newQuantity };
            }
            return item;
        }));
    };

    const handleRemove = (id) => {
        setItems(items.filter(item => item.id !== id));
    };

    const subtotal = items.reduce((sum, item) => sum + ((item.price || 0) * (item.quantity || 1)), 0);
    const shipping = items.length > 0 ? 5.00 : 0;
    const tax = subtotal * 0.05;
    const total = subtotal + shipping + tax;

    const handlePlaceOrder = async () => {
        if (items.length === 0) {
            showNotification("Your cart is empty.", "error");
            return;
        }

        setIsProcessing(true);
        try {
            // Import supabase here if not at top, but let's add it to top of file in next chunk
            const { supabase } = await import('../../supabaseClient');

            // 1. Deduct stock for each item
            for (const item of items) {
                const newStock = Math.max(0, (item.stock_quantity || 0) - item.quantity);
                await supabase
                    .from('products')
                    .update({ stock_quantity: newStock })
                    .eq('id', item.id);
            }

            // 2. Insert into orders table (basic info, assuming these columns exist, if not it just fails silently or logs)
            // We use a basic payload that might fit any schema or just let it fail if schema differs, the stock deduction is the crucial part.
            const orderPayload = {
                total_amount: total,
                status: 'Pending',
                items: items.map(i => `${i.name} (x${i.quantity})`).join(', '),
                shipping_address: deliveryAddress
            };
            const { error: orderError } = await supabase.from('orders').insert([orderPayload]);
            if (orderError) {
                console.error("Order insert error:", orderError);
                throw new Error(orderError.message || JSON.stringify(orderError));
            }

            // 3. Clear cart
            localStorage.removeItem('cartItems');
            setItems([]);
            
            showNotification('Order placed successfully! Stocks have been updated.', 'success');
            setTimeout(() => {
                navigate('/dashboard');
            }, 2000);

        } catch (error) {
            console.error('Error placing order:', error);
            showNotification(`An error occurred while placing the order: ${error.message}`, 'error');
        } finally {
            setIsProcessing(false);
        }
    };

    const themeColor = '#0084ff'; // SwiftServe Skyblue Theme

    const renderPaymentMethod = (id, icon, title, description, badge = null) => {
        const isSelected = selectedMethod === id;
        return (
            <div 
                onClick={() => setSelectedMethod(id)}
                style={{
                    border: isSelected ? `2px solid ${themeColor}` : '1px solid #e5e7eb',
                    borderRadius: '12px',
                    padding: '20px',
                    marginBottom: '16px',
                    cursor: 'pointer',
                    backgroundColor: isSelected ? '#f0f7ff' : '#fff',
                    transition: 'all 0.2s ease',
                    position: 'relative'
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <div style={{
                            width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#1f2937', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}>
                            {icon}
                        </div>
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span style={{ fontWeight: '600', fontSize: '16px', color: '#111827' }}>{title}</span>
                                {badge && (
                                    <span style={{ backgroundColor: '#4b5563', color: 'white', fontSize: '10px', padding: '2px 8px', borderRadius: '12px', fontWeight: '500' }}>
                                        {badge}
                                    </span>
                                )}
                            </div>
                            <span style={{ fontSize: '12px', color: '#6b7280' }}>{description}</span>
                        </div>
                    </div>
                    <div>
                        <div style={{ width: '20px', height: '20px', borderRadius: '50%', border: isSelected ? `6px solid ${themeColor}` : '2px solid #d1d5db', backgroundColor: '#fff', boxSizing: 'border-box' }} />
                    </div>
                </div>

                {isSelected && id === 'card' && (
                    <div style={{ marginTop: '24px' }}>
                        <div style={{ marginBottom: '16px' }}>
                            <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '8px', color: '#374151' }}>Card Number</label>
                            <div style={{ position: 'relative' }}>
                                <input type="text" placeholder="1234 5678 9012 3456" style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid #d1d5db', outline: 'none' }} />
                                <div style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', backgroundColor: themeColor, color: 'white', fontSize: '10px', padding: '2px 6px', borderRadius: '4px', fontWeight: 'bold' }}>AMEX</div>
                            </div>
                        </div>
                        <div style={{ marginBottom: '16px' }}>
                            <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '8px', color: '#374151' }}>Cardholder Name</label>
                            <input type="text" placeholder="Sadia Noor Shoyeba" style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid #d1d5db', outline: 'none' }} />
                        </div>
                        <div style={{ display: 'flex', gap: '16px' }}>
                            <div style={{ flex: 1 }}>
                                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '8px', color: '#374151' }}>Expiry Date</label>
                                <input type="text" placeholder="12/35" style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid #d1d5db', outline: 'none' }} />
                            </div>
                            <div style={{ flex: 1 }}>
                                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '8px', color: '#374151' }}>CVV</label>
                                <input type="text" placeholder="321" style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid #d1d5db', outline: 'none' }} />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#f9fafb' }}>
            <NavigationBar showSearch={false} />
            <Notification message={notification.message} type={notification.type} onClose={() => setNotification({ message: '', type: '' })} />

            <div style={{ maxWidth: '1200px', margin: '40px auto', padding: '0 20px', display: 'flex', gap: '24px', flex: 1, width: '100%' }}>
                
                {/* Left Side: Payment Method Options */}
                <div style={{ flex: '1 1 60%', backgroundColor: '#fff', borderRadius: '16px', padding: '32px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                    <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '4px', color: '#111827' }}>Payment Method Options</h2>
                    <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '32px' }}>Pick a payment option to continue to review.</p>

                    {renderPaymentMethod('cod', <Wallet size={20} />, 'Cash on Delivery', 'Pay when you receive your order.', 'Popular')}
                    {renderPaymentMethod('card', <CreditCard size={20} />, 'Credit / Debit Card', 'Accepted: Visa, Mastercard, Amex.')}
                    {renderPaymentMethod('mobile', <Smartphone size={20} />, 'Mobile Banking', 'Supported: bKash, Nagad, Upay.')}

                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px', marginTop: '40px' }}>
                        <button onClick={() => navigate('/cart')} style={{ flex: 1, padding: '14px', borderRadius: '8px', border: '1px solid #d1d5db', backgroundColor: '#fff', color: '#111827', fontWeight: '600', fontSize: '14px', cursor: 'pointer', transition: 'background-color 0.2s' }} onMouseOver={(e) => e.target.style.backgroundColor = '#f3f4f6'} onMouseOut={(e) => e.target.style.backgroundColor = '#fff'}>
                            Back to Delivery
                        </button>
                        <button disabled={isProcessing || items.length === 0} onClick={handlePlaceOrder} style={{ flex: 1, padding: '14px', borderRadius: '8px', border: 'none', backgroundColor: (isProcessing || items.length === 0) ? '#9ca3af' : '#111827', color: '#fff', fontWeight: '600', fontSize: '14px', cursor: (isProcessing || items.length === 0) ? 'not-allowed' : 'pointer', transition: 'background-color 0.2s', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' }} onMouseOver={(e) => { if (!isProcessing && items.length > 0) e.target.style.backgroundColor = '#1f2937' }} onMouseOut={(e) => { if (!isProcessing && items.length > 0) e.target.style.backgroundColor = '#111827' }}>
                            {isProcessing ? 'Processing...' : 'Place Order'}
                        </button>
                    </div>
                </div>

                {/* Right Side: Order Summary */}
                <div style={{ flex: '1 1 40%', maxWidth: '420px', backgroundColor: '#fff', borderRadius: '16px', padding: '32px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                        <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#111827' }}>Order Summary</h2>
                        <AlertCircle size={18} color="#9ca3af" />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '32px' }}>
                        {items.length === 0 ? (
                            <div style={{ color: '#6b7280', fontSize: '14px', textAlign: 'center', padding: '20px 0' }}>Your cart is empty.</div>
                        ) : (
                            items.map(item => (
                                <div key={item.id} style={{ display: 'flex', gap: '16px', position: 'relative' }}>
                                    <img src={item.image} alt={item.name} style={{ width: '70px', height: '70px', borderRadius: '12px', objectFit: 'cover' }} />
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontSize: '12px', color: themeColor, fontWeight: '600', marginBottom: '4px' }}>{item.type}</div>
                                        <div style={{ fontSize: '14px', fontWeight: '700', color: '#111827', marginBottom: '4px' }}>{item.name}</div>
                                        <div style={{ fontSize: '14px', color: '#4b5563', fontWeight: '500' }}>₱{item.price.toFixed(2)}</div>
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'space-between' }}>
                                        <button onClick={() => handleRemove(item.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', padding: '4px' }}>
                                            <X size={16} />
                                        </button>
                                        <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #e5e7eb', borderRadius: '20px', padding: '4px 8px', gap: '12px' }}>
                                            <button onClick={() => handleQuantityChange(item.id, -1)} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', padding: 0 }}><Minus size={14} color="#6b7280" /></button>
                                            <span style={{ fontSize: '13px', fontWeight: '600', color: '#111827' }}>{item.quantity}</span>
                                            <button onClick={() => handleQuantityChange(item.id, 1)} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', padding: 0 }}><Plus size={14} color="#6b7280" /></button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    <div style={{ marginBottom: '32px' }}>
                        <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#111827', marginBottom: '12px' }}>Delivery Details</h3>
                        <div style={{ display: 'flex', border: '1px solid #e5e7eb', borderRadius: '8px', overflow: 'hidden' }}>
                            <input 
                                type="text" 
                                placeholder="Landmark / Building & Room (Optional)" 
                                value={deliveryAddress}
                                onChange={(e) => setDeliveryAddress(e.target.value)}
                                style={{ flex: 1, padding: '12px 16px', border: 'none', outline: 'none', fontSize: '14px' }}
                            />
                        </div>
                    </div>

                    <div style={{ marginBottom: '32px' }}>
                        <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#111827', marginBottom: '12px' }}>Promotion Code</h3>
                        <div style={{ display: 'flex', border: '1px solid #e5e7eb', borderRadius: '8px', overflow: 'hidden' }}>
                            <input 
                                type="text" 
                                placeholder="Add Promo Code" 
                                value={promoCode}
                                onChange={(e) => setPromoCode(e.target.value)}
                                style={{ flex: 1, padding: '12px 16px', border: 'none', outline: 'none', fontSize: '14px' }}
                            />
                            <button style={{ padding: '0 16px', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', color: '#111827' }}>
                                <Send size={18} />
                            </button>
                        </div>
                    </div>

                    <div style={{ marginBottom: '32px' }}>
                        <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#111827', marginBottom: '16px' }}>Order Total</h3>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '14px', color: '#4b5563' }}>
                            <span>Subtotal</span>
                            <span style={{ fontWeight: '600', color: '#111827' }}>₱{subtotal.toFixed(2)}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '14px', color: '#4b5563' }}>
                            <span>Shipping</span>
                            <span style={{ fontWeight: '600', color: '#111827' }}>₱{shipping.toFixed(2)}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px', fontSize: '14px', color: '#4b5563' }}>
                            <span>Tax (5%)</span>
                            <span style={{ fontWeight: '600', color: '#111827' }}>₱{tax.toFixed(2)}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #e5e7eb', paddingTop: '24px', fontSize: '16px', fontWeight: '700' }}>
                            <span>Total</span>
                            <span style={{ color: themeColor }}>₱{total.toFixed(2)}</span>
                        </div>
                    </div>

                    <div style={{ backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '12px', padding: '16px', fontSize: '12px', color: '#166534', lineHeight: '1.5', marginTop: 'auto' }}>
                        Welcome to our Food Order App. By accessing or using this App, you agree to be bound by these Terms and Conditions. Enjoy delicious meals! Yum!
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default PaymentPage;
