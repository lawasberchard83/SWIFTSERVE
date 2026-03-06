import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';

const CAROUSEL_ITEMS = [
    {
        image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80',
        quote: 'Fast and reliable service at your fingertips.'
    },
    {
        image: 'https://images.unsplash.com/photo-1526367790999-0150786686a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80',
        quote: 'Cravings satisfied in minutes.'
    },
    {
        image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80',
        quote: 'Delivering happiness, one order at a time.'
    }
];

const LandingPage = () => {
    const [currentSlide, setCurrentSlide] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % CAROUSEL_ITEMS.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="landing-page" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            {/* Dedicated Landing Header */}
            <header className="navbar" style={{ position: 'relative', zIndex: 10, borderBottom: 'none', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
                <Link to="/" className="nav-brand">SWIFTSERVE</Link>
                <div style={{ display: 'flex', gap: '20px', marginLeft: '40px', flex: 1 }}>
                    <Link to="/" className="btn btn-outline" style={{ border: 'none' }}>Home</Link>
                    <Link to="/dashboard" className="btn btn-outline" style={{ border: 'none' }}>Shop</Link>
                    <Link to="/about" className="btn btn-outline" style={{ border: 'none' }}>About Us</Link>
                </div>
                <div className="nav-actions">
                    <Link to="/login" className="btn btn-outline" style={{ marginRight: '16px', borderRadius: '24px', padding: '10px 24px' }}>Login</Link>
                    <Link to="/register" className="btn btn-primary" style={{ borderRadius: '24px', padding: '10px 24px' }}>Register</Link>
                </div>
            </header>

            {/* Carousel Section */}
            <div className="carousel-container">
                {CAROUSEL_ITEMS.map((item, index) => (
                    <div
                        key={index}
                        className={`carousel-slide ${index === currentSlide ? 'active' : ''}`}
                        style={{ backgroundImage: `url(${item.image})` }}
                    >
                        <div className="carousel-overlay">
                            <h2 className="carousel-quote animate-slide-up">"{item.quote}"</h2>
                        </div>
                    </div>
                ))}

                {/* Pagination Dots */}
                <div className="carousel-dots">
                    {CAROUSEL_ITEMS.map((_, index) => (
                        <div
                            key={index}
                            className={`dot ${index === currentSlide ? 'active' : ''}`}
                            onClick={() => setCurrentSlide(index)}
                        ></div>
                    ))}
                </div>
            </div>

            {/* Center Text Section */}
            <section className="landing-text-section">
                <h2>Why choose SWIFTSERVE?</h2>
                <p>Experience the best delivery service tailored for your needs.</p>
                <div className="divider-line"></div>
            </section>

            {/* 3 Column Image Grid */}
            <section className="landing-grid-section">
                <div className="grid-card">
                    <div className="grid-image-wrapper">
                        <div className="grid-image" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1617347454431-f49d7ff5c3b1?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80)' }}></div>
                    </div>
                    <div className="grid-text">
                        <h3>Fast Delivery</h3>
                        <p>We make sure your cravings are delivered hot and fresh in record time.</p>
                    </div>
                </div>
                <div className="grid-card">
                    <div className="grid-image-wrapper">
                        <div className="grid-image" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1555939594-58d7cb561ad1?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80)' }}></div>
                    </div>
                    <div className="grid-text">
                        <h3>Fresh Food</h3>
                        <p>Every order is prepared with the finest, freshest ingredients available.</p>
                    </div>
                </div>
                <div className="grid-card">
                    <div className="grid-image-wrapper">
                        <div className="grid-image" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80)' }}></div>
                    </div>
                    <div className="grid-text">
                        <h3>Best Quality</h3>
                        <p>Partnering with top restaurants to bring you premium quality meals.</p>
                    </div>
                </div>
            </section>
            <Footer />
        </div>
    );
};

export default LandingPage;
