import React, { useState, useEffect } from 'react';
import { Search, ShoppingCart, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import ProductModal from '../components/modal/ProductModal';
import NavigationBar from '../components/NavigationBar';
import Footer from '../components/Footer';

const Dashboard = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('ALL');
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
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

    const handleProductClick = (product) => {
        setSelectedProduct(product);
        setIsModalOpen(true);
    };

    const handleAddToCart = (productWithQuantity) => {
        if (!localStorage.getItem('isAuthenticated')) {
            alert('Please login to add items to your cart.');
            navigate('/login');
            return;
        }
        console.log('Added to cart:', productWithQuantity);
    };

    return (
        <div className="dashboard" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <NavigationBar showSearch={true} />

            <section className="hero">
                <h1>Campus food, delivered fast ⚡</h1>
                <p>Order from your favorite campus vendors and pick up in minutes. No more long lines.</p>
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
                        {filteredProducts.map(product => (
                            <div key={product.id} className="product-card" onClick={() => handleProductClick(product)} style={{ cursor: 'pointer' }}>
                                <div
                                    className="product-image-container"
                                    style={{
                                        backgroundImage: `url(${product.image})`,
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center'
                                    }}
                                >
                                </div>
                                <div className="product-info">
                                    <h3 className="product-title">{product.name}</h3>
                                    <p className="product-desc">{product.description}</p>
                                    <div className="product-price">₱{parseFloat(product.price).toFixed(2)}</div>
                                    <div className="product-actions">
                                        <button className="btn btn-primary" onClick={(e) => { e.stopPropagation(); handleProductClick(product); }}>Add to Cart</button>
                                        <button className="btn btn-outline" style={{ fontSize: '13px' }} onClick={(e) => e.stopPropagation()}>Save for later</button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>

            <ProductModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                product={selectedProduct}
                onAddToCart={handleAddToCart}
            />
            <Footer />
        </div>
    );
};

export default Dashboard;
