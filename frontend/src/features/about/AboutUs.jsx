import React from 'react';
import NavigationBar from '../../components/NavigationBar';
import Footer from '../../components/Footer';

const AboutUs = () => {
    return (
        <div className="about-us" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', fontFamily: 'Inter, sans-serif' }}>
            <NavigationBar showSearch={true} />

            {/* Hero Banner */}
            <div style={{
                width: '100%',
                height: '340px',
                backgroundImage: 'linear-gradient(rgba(0,0,0,0.45), rgba(0,0,0,0.65)), url("https://images.unsplash.com/photo-1551782450-a2132b4ba21d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80")',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                textAlign: 'center',
                padding: '0 20px'
            }}>
                <h1 style={{ fontSize: '52px', fontWeight: '800', margin: 0, textShadow: '0 4px 12px rgba(0,0,0,0.6)', letterSpacing: '-1px' }}>
                    SwiftServe
                </h1>
                <p style={{ fontSize: '18px', color: '#e0e0e0', marginTop: '12px', maxWidth: '600px', lineHeight: 1.6, textShadow: '0 2px 8px rgba(0,0,0,0.5)' }}>
                    Fast. Fresh. Built with passion.
                </p>
            </div>

            {/* About Content Section */}
            <section style={{
                width: '100%',
                maxWidth: '1200px',
                margin: '70px auto',
                padding: '0 20px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                gap: '60px',
                boxSizing: 'border-box'
            }}>
                <div style={{ flex: 1 }}>
                    <p style={{ fontSize: '13px', fontWeight: '700', color: '#0084ff', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '12px' }}>
                        The Creator
                    </p>
                    <h2 style={{ fontSize: '42px', fontWeight: '800', marginBottom: '24px', color: '#111', lineHeight: 1.1 }}>
                        About Me
                    </h2>
                    <p style={{ fontSize: '15px', lineHeight: '1.9', color: '#444', marginBottom: '20px' }}>
                        Hi! I'm <strong>Berchard</strong>, a passionate developer and the sole creator behind <strong>SwiftServe</strong> — a campus food ordering and delivery web application built completely from the ground up.
                    </p>
                    <p style={{ fontSize: '15px', lineHeight: '1.9', color: '#444', marginBottom: '20px' }}>
                        SwiftServe was born from a simple frustration: long canteen lines and the struggle of getting food on time during a busy school day. I designed and developed this entire platform — from the user interface to the real-time order tracking system and the admin dashboard — all by myself.
                    </p>
                    <p style={{ fontSize: '15px', lineHeight: '1.9', color: '#444' }}>
                        This project was built using <strong>React</strong>, <strong>Vite</strong>, and <strong>Supabase</strong>. It features product browsing, cart management, order placement with live status updates, and a full admin panel for managing products and orders — all wrapped in a modern, responsive design.
                    </p>
                </div>
                <div style={{ flex: '0 0 400px' }}>
                    <img
                        src="https://images.unsplash.com/photo-1571091718767-18b5b1457add?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                        alt="SwiftServe Campus Food"
                        style={{ width: '100%', height: '420px', objectFit: 'cover', borderRadius: '16px', boxShadow: '0 20px 60px rgba(0,0,0,0.15)' }}
                    />
                </div>
            </section>

            {/* Blue Banner with food delivery image */}
            <div style={{
                width: '100%',
                backgroundColor: '#0084ff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '48px 40px',
                gap: '60px',
                boxSizing: 'border-box',
                flexWrap: 'wrap'
            }}>
                <img
                    src="https://images.unsplash.com/photo-1498654896293-37aacf113fd9?ixlib=rb-4.0.3&auto=format&fit=crop&w=900&q=80"
                    alt="Food Ordering System"
                    style={{ width: '360px', height: '220px', objectFit: 'cover', borderRadius: '16px', boxShadow: '0 12px 40px rgba(0,0,0,0.35)' }}
                />
                <div style={{ color: '#fff', maxWidth: '480px' }}>
                    <h3 style={{ fontSize: '28px', fontWeight: '800', margin: '0 0 16px 0' }}>
                        Built for students, by a student.
                    </h3>
                    <p style={{ fontSize: '15px', lineHeight: '1.8', opacity: 0.92, margin: 0 }}>
                        SwiftServe brings the full campus canteen experience online — browse meals, drinks, and snacks, add them to your cart, and track your order in real-time. No more waiting in line.
                    </p>
                </div>
            </div>

            {/* Three Food Image Cards */}
            <section style={{
                width: '100%',
                maxWidth: '1100px',
                margin: '80px auto',
                padding: '0 20px',
                display: 'flex',
                justifyContent: 'center',
                gap: '24px',
                flexWrap: 'wrap',
                boxSizing: 'border-box'
            }}>
                {[
                    { src: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80', label: '🍽 Meals' },
                    { src: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80', label: '🥤 Drinks' },
                    { src: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80', label: '🍕 Snacks' },
                ].map(({ src, label }) => (
                    <div key={label} style={{ position: 'relative', overflow: 'hidden', borderRadius: '14px', boxShadow: '0 8px 28px rgba(0,0,0,0.12)' }}>
                        <img
                            src={src}
                            alt={label}
                            style={{ width: '300px', height: '340px', objectFit: 'cover', display: 'block', transition: 'transform 0.4s ease' }}
                            onMouseOver={e => e.currentTarget.style.transform = 'scale(1.06)'}
                            onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
                        />
                        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(transparent, rgba(0,0,0,0.72))', padding: '24px 16px 16px', color: '#fff', fontWeight: '700', fontSize: '17px' }}>
                            {label}
                        </div>
                    </div>
                ))}
            </section>

            <Footer />
        </div>
    );
};

export default AboutUs;
