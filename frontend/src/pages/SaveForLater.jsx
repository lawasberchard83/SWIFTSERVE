import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NavigationBar from '../components/NavigationBar';
import Footer from '../components/Footer';
import Notification from '../components/Notification';
import { Trash2, ShoppingCart } from 'lucide-react';

const SaveForLater = () => {
    const navigate = useNavigate();
    const [savedItems, setSavedItems] = useState(() => {
        const saved = localStorage.getItem('savedItems');
        if (saved) {
            try {
                return JSON.parse(saved);
            } catch (e) {
                console.error("Could not parse saved items", e);
            }
        }
        return [];
    });
    const [notification, setNotification] = useState({ show: false, message: '', type: 'success' });

    const showNotification = (message, type = 'success') => {
        setNotification({ show: true, message, type });
    };

    React.useEffect(() => {
        localStorage.setItem('savedItems', JSON.stringify(savedItems));
    }, [savedItems]);

    // Remove from Save For Later
    const handleRemove = (id) => {
        setSavedItems(savedItems.filter(item => item.id !== id));
        showNotification('Item removed from saved list.', 'success');
    };

    // Move to Cart
    const handleMoveToCart = (item) => {
        const existingCartRaw = localStorage.getItem('cartItems');
        let cartItems = [];
        try {
            if (existingCartRaw) cartItems = JSON.parse(existingCartRaw);
        } catch (e) {}

        const existingItemIndex = cartItems.findIndex(cartItem => cartItem.id === item.id);
        
        if (existingItemIndex >= 0) {
            const newQuantity = cartItems[existingItemIndex].quantity + 1;
            if (newQuantity > (item.stock_quantity || 0)) {
                showNotification(`Cannot move to cart. Only ${item.stock_quantity || 0} in stock.`, 'error');
                return;
            }
            cartItems[existingItemIndex].quantity = newQuantity;
        } else {
            if (1 > (item.stock_quantity || 0)) {
                showNotification(`Cannot move to cart. Out of stock.`, 'error');
                return;
            }
            cartItems.push({
                id: item.id,
                name: item.name,
                description: item.description || '',
                price: parseFloat(item.price) || 0,
                originalPrice: parseFloat(item.price) || 0,
                quantity: 1,
                image: item.image || '',
                stock_quantity: item.stock_quantity || 0
            });
        }

        localStorage.setItem('cartItems', JSON.stringify(cartItems));
        
        // Remove from saved list after moving
        setSavedItems(savedItems.filter(saved => saved.id !== item.id));
        showNotification(`${item.name} moved to cart!`);
    };

    return (
        <div className="saved-page" style={{ minHeight: '100vh', backgroundColor: '#f9fafb', display: 'flex', flexDirection: 'column' }}>
            <NavigationBar showSearch={true} />

            <div style={{ maxWidth: '1000px', margin: '40px auto', padding: '0 20px', flex: 1, width: '100%' }}>
                <h1 style={{ fontSize: '28px', fontWeight: '800', marginBottom: '8px', color: '#111' }}>Saved for Later</h1>
                <p style={{ fontSize: '15px', color: '#666', marginBottom: '32px' }}>
                    Items you've favorited to order another time.
                </p>

                {savedItems.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '80px 20px', backgroundColor: '#fff', borderRadius: '12px', border: '1px dashed #e5e7eb' }}>
                        <div style={{ width: '64px', height: '64px', backgroundColor: '#eff6ff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                            <ShoppingCart size={32} color="#3b82f6" />
                        </div>
                        <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#111', marginBottom: '8px' }}>No saved items</h2>
                        <p style={{ color: '#666', marginBottom: '24px' }}>You haven't saved any items for later yet.</p>
                        <button onClick={() => navigate('/dashboard')} className="btn btn-primary" style={{ padding: '12px 24px' }}>
                            Browse the Menu
                        </button>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
                        {savedItems.map((item) => {
                            const isOutOfStock = item.stock_quantity <= 0;
                            return (
                                <div key={item.id} style={{ backgroundColor: '#fff', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', display: 'flex', flexDirection: 'column' }}>
                                    <div style={{ height: '200px', backgroundImage: `url(${item.image})`, backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative' }}>
                                        {isOutOfStock && (
                                            <div style={{ position: 'absolute', top: '12px', right: '12px', backgroundColor: '#ef4444', color: 'white', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' }}>
                                                Out of Stock
                                            </div>
                                        )}
                                    </div>
                                    <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                                            <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#111', margin: 0 }}>{item.name}</h3>
                                            <span style={{ fontSize: '16px', fontWeight: '800', color: '#0084ff' }}>₱{parseFloat(item.price).toFixed(2)}</span>
                                        </div>
                                        <p style={{ fontSize: '14px', color: '#666', marginBottom: '24px', flex: 1, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                            {item.description}
                                        </p>
                                        
                                        <div style={{ display: 'flex', gap: '12px' }}>
                                            <button 
                                                onClick={() => handleRemove(item.id)}
                                                style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '10px', backgroundColor: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', transition: 'background 0.2s' }}
                                                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#fca5a5'}
                                                onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#fee2e2'}
                                            >
                                                <Trash2 size={16} /> Remove
                                            </button>
                                            
                                            <button 
                                                onClick={() => handleMoveToCart(item)}
                                                disabled={isOutOfStock}
                                                style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '10px', backgroundColor: isOutOfStock ? '#f3f4f6' : '#0084ff', color: isOutOfStock ? '#9ca3af' : '#fff', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: isOutOfStock ? 'not-allowed' : 'pointer', transition: 'opacity 0.2s' }}
                                                onMouseOver={(e) => !isOutOfStock && (e.currentTarget.style.opacity = '0.9')}
                                                onMouseOut={(e) => !isOutOfStock && (e.currentTarget.style.opacity = '1')}
                                            >
                                                <ShoppingCart size={16} /> {isOutOfStock ? 'No Stock' : 'To Cart'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
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

export default SaveForLater;
