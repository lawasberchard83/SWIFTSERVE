import React, { useState } from 'react';
import { Search, ShoppingCart, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ProductModal from '../components/modal/ProductModal';
import NavigationBar from '../components/NavigationBar';
import Footer from '../components/Footer';

const Dashboard = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('ALL');
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const products = [
        { id: 1, name: 'Burger', description: 'Classic beef patty with fresh lettuce and tomato', price: 8.99, image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80', vendor: 'Burger House', rating: '4.8' },
        { id: 2, name: 'Pizza Slice', description: 'New York style pepperoni slice with extra cheese', price: 4.50, image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80', vendor: 'Luigi\'s Pizza', rating: '4.5' },
        { id: 3, name: 'Berry Smoothie', description: 'Refreshing blend of mixed berries and yogurt', price: 5.49, image: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80', vendor: 'Juice Bar', rating: '4.9' },
        { id: 4, name: 'Tacos', description: 'Three authentic street tacos with your choice of meat', price: 9.99, image: 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80', vendor: 'Taco Haven', rating: '4.7' },
        { id: 5, name: 'Fried Chicken', description: 'Crispy fried chicken pieces with a side of fries', price: 11.99, image: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80', vendor: 'Crispy Craze', rating: '4.4' },
        { id: 6, name: 'Sushi Roll', description: 'Spicy tuna roll with fresh avocado and spicy mayo', price: 12.50, image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80', vendor: 'Sushi Sprint', rating: '4.8' },
        { id: 7, name: 'Pasta', description: 'Creamy fettuccine alfredo with grilled chicken', price: 14.99, image: 'https://images.unsplash.com/photo-1621996311210-ea11833c4f7b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80', vendor: 'Pasta Pronto', rating: '4.6' },
        { id: 8, name: 'Salad Bowl', description: 'Healthy salad bowl with quinoa, avocado and veggies', price: 10.99, image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80', vendor: 'Green Eats', rating: '4.7' },
    ];

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
        // Here you would typically dispatch to a Redux store or Auth Context
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

                <div className="products-grid">
                    {products.map(product => (
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
                                <div className="product-price">€{product.price.toFixed(2)}</div>
                                <div className="product-actions">
                                    <button className="btn btn-primary" onClick={(e) => { e.stopPropagation(); handleProductClick(product); }}>Add to Cart</button>
                                    <button className="btn btn-outline" style={{ fontSize: '13px' }} onClick={(e) => e.stopPropagation()}>Save for later</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
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
