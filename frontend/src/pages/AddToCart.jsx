import React, { useState } from 'react';
import { Plus, Minus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Notification from '../components/Notification';
import NavigationBar from '../components/NavigationBar';
import Footer from '../components/Footer';

const AddToCart = () => {
    const navigate = useNavigate();
    // Mock cart items based on the provided design
    const [cartItems, setCartItems] = useState(() => {
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
    
    const [notification, setNotification] = useState({ show: false, message: '', type: 'success' });
    
    const showNotification = (message, type = 'success') => {
        setNotification({ show: true, message, type });
    };

    // Save to local storage whenever cart items change
    React.useEffect(() => {
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
    }, [cartItems]);

    const updateQuantity = (id, delta) => {
        setCartItems(cartItems.map(item => {
            if (item.id === id) {
                const maxStock = item.stock_quantity || 1; 
                let newQuantity = item.quantity + delta;
                
                if (newQuantity > maxStock) newQuantity = maxStock;
                if (newQuantity < 1) newQuantity = 1;
                
                return { ...item, quantity: newQuantity };
            }
            return item;
        }));
    };

    const handleRemove = (id) => {
        setCartItems(cartItems.filter(item => item.id !== id));
    };

    const handleCancelAll = () => {
        if(window.confirm('Are you sure you want to clear your cart?')) {
            setCartItems([]);
            localStorage.removeItem('cartItems');
        }
    };

    const subtotal = cartItems.reduce((acc, item) => acc + ((item.price || 0) * (item.quantity || 1)), 0);
    const tax = subtotal * 0.05; // Using 5% tax to match Payment UI
    const total = subtotal + tax;

    return (
        <div className="cart-page" style={{ minHeight: '100vh', backgroundColor: '#fff', display: 'flex', flexDirection: 'column' }}>
            {/* Header */}
            <NavigationBar showSearch={true} />

            {/* Consistent Hero Banner */}
            <section className="hero" style={{
                backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.7)), url(https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1600&auto=format&fit=crop)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                padding: '60px 20px',
                color: 'white',
                textAlign: 'center',
                boxShadow: '0 8px 24px rgba(0,0,0,0.1)'
            }}>
                <h1 style={{ textShadow: '0 4px 12px rgba(0,0,0,0.5)', fontSize: '36px', marginBottom: '12px' }}>
                    Campus food, delivered fast ⚡
                </h1>
                <p style={{ textShadow: '0 2px 8px rgba(0,0,0,0.5)', fontSize: '18px', maxWidth: '800px', margin: '0 auto' }}>
                    Order from your favorite campus vendors and pick up in minutes. No more long lines.
                </p>
            </section>

            {/* Cart Content */}
            <div style={{ maxWidth: '1200px', margin: '40px auto', padding: '0 20px', display: 'flex', gap: '60px', flex: 1, width: '100%' }}>

                {/* Orders List */}
                <div style={{ flex: '1 1 60%' }}>
                    <h2 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '24px', color: '#111' }}>
                        Orders:
                    </h2>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {cartItems.map((item) => (
                            <div
                                key={item.id}
                                style={{
                                    display: 'flex',
                                    border: '1px solid #eaeaea',
                                    borderRadius: '8px',
                                    overflow: 'hidden',
                                    height: '140px'
                                }}
                            >
                                {/* Item Image Placeholder / Real Image */}
                                <div style={{
                                    width: '240px',
                                    backgroundColor: '#f1f1f1',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    borderRight: '1px solid #eaeaea',
                                    backgroundImage: item.image ? `url(${item.image})` : 'none',
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center'
                                }}>
                                    {!item.image && <span style={{ fontSize: '12px', color: '#666' }}>Product Image</span>}
                                </div>

                                {/* Item Details */}
                                <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column', position: 'relative' }}>

                                    <h3 style={{ fontSize: '15px', fontWeight: '800', marginBottom: '8px', color: '#111' }}>
                                        {item.name}
                                    </h3>

                                    <p style={{ fontSize: '12px', color: '#888', marginBottom: 'auto' }}>
                                        {item.description}
                                    </p>

                                    {/* Quantity Toggle positioned bottom right */}
                                    <div style={{
                                        alignSelf: 'flex-end',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '12px',
                                        border: '1px solid #eaeaea',
                                        borderRadius: '4px',
                                        padding: '4px 8px',
                                    }}>
                                        <button
                                            onClick={() => updateQuantity(item.id, -1)}
                                            style={{ backgroundColor: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                                        >
                                            <Minus size={16} color="#666" />
                                        </button>
                                        <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#111', minWidth: '20px', textAlign: 'center' }}>
                                            {item.quantity}
                                        </span>
                                        <button
                                            onClick={() => updateQuantity(item.id, 1)}
                                            style={{ backgroundColor: 'transparent', border: 'none', cursor: item.quantity >= (item.stock_quantity || 1) ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', color: item.quantity >= (item.stock_quantity || 1) ? '#ccc' : 'inherit' }}
                                            disabled={item.quantity >= (item.stock_quantity || 1)}
                                        >
                                            <Plus size={16} />
                                        </button>
                                    </div>

                                    {/* Price and Remove position top right */}
                                    <div style={{
                                        position: 'absolute',
                                        top: '20px',
                                        right: '20px',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'flex-end',
                                        gap: '8px'
                                    }}>
                                        <span style={{ fontSize: '20px', fontWeight: '800', color: '#ff4d4f' }}>
                                            €{(item.price || 0).toFixed(2)}
                                        </span>
                                        {item.originalPrice > item.price && (
                                            <span style={{ fontSize: '14px', fontWeight: '600', color: '#555', textDecoration: 'line-through' }}>
                                                €{(item.originalPrice || 0).toFixed(2)}
                                            </span>
                                        )}
                                        <button 
                                            onClick={() => handleRemove(item.id)}
                                            style={{ marginTop: 'auto', background: 'none', border: 'none', color: '#888', textDecoration: 'underline', fontSize: '12px', cursor: 'pointer' }}
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                        {cartItems.length === 0 && (
                            <div style={{ padding: '40px', textAlign: 'center', color: '#888', border: '1px dashed #ccc', borderRadius: '8px' }}>
                                Your cart is empty.
                            </div>
                        )}
                    </div>
                </div>

                {/* Order Summary Sidebar */}
                <div style={{ flex: '1 1 35%', maxWidth: '400px' }}>
                    <h2 style={{ fontSize: '16px', fontWeight: '800', marginBottom: '24px', color: '#111' }}>
                        Order Summary:
                    </h2>

                    <div style={{ borderTop: '2px solid #333', paddingTop: '24px', paddingBottom: '24px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px', fontSize: '14px', color: '#555' }}>
                            <span>Sub-total</span>
                            <span style={{ fontWeight: '800', color: '#111' }}>€{subtotal.toFixed(2)}</span>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px', fontSize: '14px', color: '#555' }}>
                            <span>TAX (5%)</span>
                            <span style={{ fontWeight: '800', color: '#111' }}>€{tax.toFixed(2)}</span>
                        </div>
                    </div>

                    <div style={{ borderTop: '2px solid #333', paddingTop: '24px', display: 'flex', justifyContent: 'space-between', marginBottom: '40px' }}>
                        <span style={{ fontSize: '14px', fontWeight: '800', color: '#111' }}>TOTAL</span>
                        <span style={{ fontSize: '14px', fontWeight: '800', color: '#111' }}>€{total.toFixed(2)}</span>
                    </div>

                    <div style={{ display: 'flex', gap: '16px' }}>
                        <button 
                            onClick={() => {
                                                if(cartItems.length === 0) {
                                                    showNotification('Your cart is empty!', 'error');
                                                    return;
                                                }
                                                navigate('/payment');
                                            }} 
                            className="btn btn-primary" 
                            style={{ flex: 1, padding: '12px', fontSize: '14px', borderRadius: '4px' }}
                        >
                            Checkout
                        </button>
                        <button 
                            onClick={handleCancelAll}
                            className="btn btn-outline" 
                            style={{ flex: 1, padding: '12px', fontSize: '14px', borderRadius: '4px' }}
                        >
                            Cancel all
                        </button>
                    </div>
                </div>

            </div>
            
            {notification.show && (
                <Notification 
                    message={notification.message} 
                    type={notification.type} 
                    onClose={() => setNotification({ show: false, message: '', type: 'success' })} 
                />
            )}

            <Footer />
        </div>
    );
};

export default AddToCart;
