import React, { useState, useEffect } from 'react';
import { Search, ShoppingCart, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import ProductModal from '../components/modal/ProductModal';
import AuthModal from '../components/modal/AuthModal';
import Notification from '../components/Notification';
import NavigationBar from '../components/NavigationBar';
import Footer from '../components/Footer';

const Dashboard = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('ALL');
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [notification, setNotification] = useState({ show: false, message: '', type: 'success' });
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch products from Supabase
    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            const { data, error } = await supabase
                .from('products')
                .select('*')
                .order('created_at', { ascending: false });
            if (!error) setProducts(data || []);
            setLoading(false);
        };
        fetchProducts();
    }, []);

    // Filter products by category
    const filteredProducts = activeTab === 'ALL'
        ? products
        : products.filter(p => p.category === activeTab);

    const showNotification = (message, type = 'success') => {
        setNotification({ show: true, message, type });
    };

    const handleProductClick = (product) => {
        if (product.stock_quantity <= 0) return;
        setSelectedProduct(product);
        setIsModalOpen(true);
    };

    const handleAddToCart = (productWithQuantity) => {
        if (!localStorage.getItem('isAuthenticated')) {
            setIsAuthModalOpen(true);
            return;
        }
        
        // Get existing cart
        const existingCartRaw = localStorage.getItem('cartItems');
        let cartItems = [];
        try {
            if (existingCartRaw) {
                cartItems = JSON.parse(existingCartRaw);
            }
        } catch (e) {
            console.error("Could not parse cart", e);
        }

        // Check if item already exists
        const existingItemIndex = cartItems.findIndex(item => item.id === productWithQuantity.id);
        
        let newQuantity = productWithQuantity.quantity || 1;
        
        if (existingItemIndex >= 0) {
            newQuantity += cartItems[existingItemIndex].quantity;
            if (newQuantity > (productWithQuantity.stock_quantity || 0)) {
                showNotification(`Cannot add. Only ${productWithQuantity.stock_quantity || 0} in stock.`, 'error');
                return;
            }
            cartItems[existingItemIndex].quantity = newQuantity;
        } else {
            if (newQuantity > (productWithQuantity.stock_quantity || 0)) {
                showNotification(`Cannot add. Only ${productWithQuantity.stock_quantity || 0} in stock.`, 'error');
                return;
            }
            // Add new item with minimum necessary details
            cartItems.push({
                id: productWithQuantity.id,
                name: productWithQuantity.name,
                description: productWithQuantity.description || '',
                price: parseFloat(productWithQuantity.price) || 0,
                originalPrice: parseFloat(productWithQuantity.price) || 0, // Using same for original
                quantity: newQuantity,
                image: productWithQuantity.image || '',
                stock_quantity: productWithQuantity.stock_quantity || 0
            });
        }

        // Save back to local storage
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
        showNotification(`${productWithQuantity.name} added to cart!`);
    };

    const handleSaveForLater = (e, product) => {
        e.stopPropagation();
        if (!localStorage.getItem('isAuthenticated')) {
            setIsAuthModalOpen(true);
            return;
        }

        const existingSavedRaw = localStorage.getItem('savedItems');
        let savedItems = [];
        try {
            if (existingSavedRaw) savedItems = JSON.parse(existingSavedRaw);
        } catch (e) {}

        if (savedItems.find(item => item.id === product.id)) {
            showNotification(`${product.name} is already saved!`, 'error');
            return;
        }

        savedItems.push({
            id: product.id,
            name: product.name,
            description: product.description || '',
            price: parseFloat(product.price) || 0,
            image: product.image || '',
            stock_quantity: product.stock_quantity || 0
        });

        localStorage.setItem('savedItems', JSON.stringify(savedItems));
        showNotification(`${product.name} saved for later!`);
    };

    return (
        <div className="dashboard" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <NavigationBar showSearch={true} />

            <section className="hero" style={{
                backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.7)), url(https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1600&auto=format&fit=crop)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                padding: '60px 20px',
                color: 'white',
                boxShadow: '0 8px 24px rgba(0,0,0,0.1)'
            }}>
                <h1 style={{ textShadow: '0 4px 12px rgba(0,0,0,0.5)', fontSize: '36px', marginBottom: '12px' }}>Campus food, delivered fast ⚡</h1>
                <p style={{ textShadow: '0 2px 8px rgba(0,0,0,0.5)', fontSize: '18px', maxWidth: '800px', margin: '0 auto' }}>Order from your favorite campus vendors and pick up in minutes. No more long lines.</p>
            </section>

            <main className="dashboard-content">
                <div className="category-tabs">
                    {['ALL', 'MEALS', 'DRINKS', 'SNACKS'].map(tab => (
                        <button
                            key={tab}
                            className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
                            onClick={() => setActiveTab(tab)}
                            style={activeTab !== tab ? { backgroundColor: '#8bb4f7' } : {}}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '60px', color: '#888', fontSize: '16px' }}>
                        Loading products...
                    </div>
                ) : filteredProducts.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '60px', color: '#888', fontSize: '16px' }}>
                        No products found in this category.
                    </div>
                ) : (
                    <div className="products-grid">
                        {filteredProducts.map(product => {
                            const isOutOfStock = product.stock_quantity <= 0;
                            return (
                                <div key={product.id} className="product-card" onClick={() => handleProductClick(product)} style={{ cursor: isOutOfStock ? 'not-allowed' : 'pointer', opacity: isOutOfStock ? 0.7 : 1, position: 'relative' }}>
                                    {isOutOfStock && (
                                        <div style={{ position: 'absolute', top: '12px', right: '12px', backgroundColor: '#ef4444', color: 'white', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold', zIndex: 10 }}>
                                            Out of Stock
                                        </div>
                                    )}
                                    <div
                                        className="product-image-container"
                                        style={{
                                            backgroundImage: `url(${product.image})`,
                                            backgroundSize: 'cover',
                                            backgroundPosition: 'center',
                                            filter: isOutOfStock ? 'grayscale(100%)' : 'none'
                                        }}
                                    >
                                    </div>
                                    <div className="product-info">
                                        <h3 className="product-title">{product.name}</h3>
                                        <p className="product-desc">{product.description}</p>
                                        <div className="product-price">₱{parseFloat(product.price).toFixed(2)}</div>
                                        <div className="product-actions">
                                            {isOutOfStock ? (
                                                <button className="btn" style={{ flex: 1, padding: '10px', fontSize: '14px', backgroundColor: '#f3f4f6', color: '#9ca3af', border: '1px solid #e5e7eb', cursor: 'not-allowed' }} disabled>Out of Stock</button>
                                            ) : (
                                                <button className="btn btn-primary" onClick={(e) => { e.stopPropagation(); handleAddToCart({ ...product, quantity: 1 }); }}>Add to Cart</button>
                                            )}
                                            <button className="btn btn-outline" style={{ fontSize: '13px' }} onClick={(e) => handleSaveForLater(e, product)}>Save for later</button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </main>

            <ProductModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                product={selectedProduct}
                onAddToCart={handleAddToCart}
            />
            <AuthModal
                isOpen={isAuthModalOpen}
                onClose={() => setIsAuthModalOpen(false)}
            />
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

export default Dashboard;
