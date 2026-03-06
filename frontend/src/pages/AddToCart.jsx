import React, { useState } from 'react';
import { Plus, Minus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import NavigationBar from '../components/NavigationBar';
import Footer from '../components/Footer';

const AddToCart = () => {
    const navigate = useNavigate();
    // Mock cart items based on the provided design
    const [cartItems, setCartItems] = useState([
        {
            id: 1,
            name: 'Product 42',
            description: 'Brief Overview and Practical Application',
            price: 11.99,
            originalPrice: 89.99,
            quantity: 1,
            image: '' // Placeholder text used in design
        },
        {
            id: 2,
            name: 'Product 33',
            description: 'Brief Overview and Practical Application',
            price: 11.99,
            originalPrice: 89.99,
            quantity: 1,
            image: '' // Placeholder text used in design
        }
    ]);

    const updateQuantity = (id, delta) => {
        setCartItems(cartItems.map(item => {
            if (item.id === id) {
                const newQuantity = Math.max(1, item.quantity + delta);
                return { ...item, quantity: newQuantity };
            }
            return item;
        }));
    };

    const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const tax = subtotal * 0.194; // Roughly based on the $4.66 tax for $23.98 subtotal
    const total = subtotal + tax;

    return (
        <div className="cart-page" style={{ minHeight: '100vh', backgroundColor: '#fff' }}>
            {/* Header */}
            <NavigationBar showSearch={true} />

            {/* Blue Banner */}
            <div style={{ backgroundColor: '#0084ff', color: 'white', textAlign: 'center', padding: '40px 20px' }}>
                <h1 style={{ fontSize: '36px', fontWeight: '800', marginBottom: '12px' }}>
                    Campus food, delivered fast ⚡
                </h1>
                <p style={{ fontSize: '16px', fontWeight: '600' }}>
                    Order from your favorite campus vendors and pick up in minutes. No more long lines.
                </p>
            </div>

            {/* Cart Content */}
            <div style={{ maxWidth: '1200px', margin: '40px auto', padding: '0 20px', display: 'flex', gap: '60px' }}>

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
                                {/* Item Image Placeholder */}
                                <div style={{
                                    width: '240px',
                                    backgroundColor: '#f1f1f1',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    borderRight: '1px solid #eaeaea'
                                }}>
                                    <span style={{ fontSize: '12px', color: '#666' }}>Product Image</span>
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
                                            style={{ backgroundColor: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                                        >
                                            <Plus size={16} color="#666" />
                                        </button>
                                    </div>

                                    {/* Price position top right */}
                                    <div style={{
                                        position: 'absolute',
                                        top: '20px',
                                        right: '20px',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'flex-end'
                                    }}>
                                        <span style={{ fontSize: '20px', fontWeight: '800', color: '#ff4d4f', marginBottom: '4px' }}>
                                            €{item.price.toFixed(2)}
                                        </span>
                                        <span style={{ fontSize: '14px', fontWeight: '600', color: '#555', textDecoration: 'line-through' }}>
                                            €{item.originalPrice.toFixed(2)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
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
                            <span>TAX</span>
                            <span style={{ fontWeight: '800', color: '#111' }}>€{tax.toFixed(2)}</span>
                        </div>
                    </div>

                    <div style={{ borderTop: '2px solid #333', paddingTop: '24px', display: 'flex', justifyContent: 'space-between', marginBottom: '40px' }}>
                        <span style={{ fontSize: '14px', fontWeight: '800', color: '#111' }}>TOTAL</span>
                        <span style={{ fontSize: '14px', fontWeight: '800', color: '#111' }}>€{total.toFixed(2)}</span>
                    </div>

                    <div style={{ display: 'flex', gap: '16px' }}>
                        <button onClick={() => navigate('/payment')} className="btn btn-primary" style={{ flex: 1, padding: '12px', fontSize: '14px', borderRadius: '4px' }}>
                            Checkout
                        </button>
                        <button className="btn btn-outline" style={{ flex: 1, padding: '12px', fontSize: '14px', borderRadius: '4px' }}>
                            Cancel all
                        </button>
                    </div>
                </div>

            </div>

            <Footer />
        </div>
    );
};

export default AddToCart;
