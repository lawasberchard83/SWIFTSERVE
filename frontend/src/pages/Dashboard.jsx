import React, { useState } from 'react';
import { Search, ShoppingCart, User } from 'lucide-react';

const Dashboard = () => {
    const [activeTab, setActiveTab] = useState('ALL');

    const products = [
        { id: 1, name: 'Product 1', description: 'Short Description of the item and its use', price: 19.99 },
        { id: 2, name: 'Product 1', description: 'Short Description of the item and its use', price: 19.99 },
        { id: 3, name: 'Product 1', description: 'Short Description of the item and its use', price: 19.99 },
        { id: 4, name: 'Product 1', description: 'Short Description of the item and its use', price: 19.99 },
        { id: 5, name: 'Product 1', description: 'Short Description of the item and its use', price: 19.99 },
        { id: 6, name: 'Product 1', description: 'Short Description of the item and its use', price: 19.99 },
        { id: 7, name: 'Product 1', description: 'Short Description of the item and its use', price: 19.99 },
        { id: 8, name: 'Product 1', description: 'Short Description of the item and its use', price: 19.99 },
    ];

    return (
        <div className="dashboard">
            <header className="navbar">
                <a href="/" className="nav-brand">SWIFTSERVE</a>

                <div className="search-bar">
                    <Search size={20} color="#666" />
                    <input
                        type="text"
                        className="search-input"
                        placeholder="Search for food..."
                    />
                </div>

                <div className="nav-actions">
                    <button className="icon-btn">
                        <ShoppingCart size={24} />
                    </button>
                    <button className="icon-btn" style={{ padding: 0, borderRadius: '50%', overflow: 'hidden' }}>
                        <User size={32} />
                    </button>
                </div>
            </header>

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
                        <div key={product.id} className="product-card">
                            <div className="product-image-container">
                                Product Image
                            </div>
                            <div className="product-info">
                                <h3 className="product-title">{product.name}</h3>
                                <p className="product-desc">{product.description}</p>
                                <div className="product-price">€{product.price.toFixed(2)}</div>
                                <div className="product-actions">
                                    <button className="btn btn-primary">Add to Cart</button>
                                    <button className="btn btn-outline" style={{ fontSize: '13px' }}>Save for later</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
