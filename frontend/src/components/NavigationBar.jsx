import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, User, Bookmark } from 'lucide-react';

const NavigationBar = ({ showSearch = false }) => {
    const navigate = useNavigate();
    const isAuth = localStorage.getItem('isAuthenticated') === 'true';

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
                <Link to="/" className="btn btn-primary" style={{ padding: '8px 20px', fontWeight: '600', borderRadius: '20px', margin: '0 8px' }}>
                    Home
                </Link>
                <Link to="/about" className="btn btn-primary" style={{ padding: '8px 20px', fontWeight: '600', borderRadius: '20px', margin: '0 8px' }}>
                    About Us
                </Link>
                <Link to="/dashboard" className="btn btn-primary" style={{ padding: '8px 20px', fontWeight: '600', borderRadius: '20px', margin: '0 8px' }}>
                    Menu
                </Link>
                {/* On landing page we show Login/Register instead of Cart/Profile if not authenticated, 
                    but for now we'll keep the cart/profile icons to replicate the Dashboard/AboutUs style */}
                <button className="icon-btn" onClick={() => navigate('/saved')} title="Saved for later">
                    <Bookmark size={24} />
                </button>
                <button className="icon-btn" onClick={() => navigate('/cart')} title="Cart">
                    <ShoppingCart size={24} />
                </button>
                <button className="icon-btn" style={{ padding: 0, borderRadius: '50%', overflow: 'hidden' }} onClick={() => navigate('/profile')}>
                    <User size={32} />
                </button>
            </div>
        </header>
    );
};

export default NavigationBar;
