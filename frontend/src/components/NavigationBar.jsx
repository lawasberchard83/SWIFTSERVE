import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, User } from 'lucide-react';

const NavigationBar = ({ showSearch = false }) => {
    const navigate = useNavigate();

    return (
        <header className="navbar">
            <Link to="/" className="nav-brand">SWIFTSERVE</Link>

            {showSearch && (
                <div className="search-bar">
                    <Search size={20} color="#666" />
                    <input
                        type="text"
                        className="search-input"
                        placeholder="Search for food..."
                    />
                </div>
            )}

            <div className="nav-actions">
                <Link to="/" className="btn btn-outline" style={{ border: 'none', padding: '8px 16px', fontWeight: '600' }}>
                    Home
                </Link>
                <Link to="/dashboard" className="btn btn-outline" style={{ border: 'none', padding: '8px 16px', fontWeight: '600' }}>
                    Shop
                </Link>
                <Link to="/about" className="btn btn-outline" style={{ border: 'none', padding: '8px 16px', fontWeight: '600' }}>
                    About Us
                </Link>
                {/* On landing page we show Login/Register instead of Cart/Profile if not authenticated, 
                    but for now we'll keep the cart/profile icons to replicate the Dashboard/AboutUs style */}
                <button className="icon-btn" onClick={() => navigate('/cart')}>
                    <ShoppingCart size={24} />
                </button>
                <button className="icon-btn" style={{ padding: 0, borderRadius: '50%', overflow: 'hidden' }}>
                    <User size={32} />
                </button>
            </div>
        </header>
    );
};

export default NavigationBar;
