import React from 'react';
import { Search, ShoppingCart, User } from 'lucide-react';
import NavigationBar from '../components/NavigationBar';
import Footer from '../components/Footer';

const AboutUs = () => {
    return (
        <div className="about-us" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <NavigationBar showSearch={true} />

            {/* Banner Image */}
            <div className="about-banner" style={{
                width: '100%',
                height: '300px',
                backgroundColor: '#ccc',
                backgroundImage: 'url("https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80")',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontSize: '24px',
                fontWeight: 'bold',
                textShadow: '0 2px 4px rgba(0,0,0,0.5)'
            }}>
                {/* Banner Text (optional, based on image wireframe it just says Image) */}
            </div>

            {/* About Us Content Section */}
            <section style={{
                width: '100%',
                flex: 1,
                maxWidth: '1200px',
                margin: '60px auto',
                padding: '0 20px',
                display: 'flex',
                justifyContent: 'space-between',
                gap: '60px'
            }}>
                <div style={{ flex: 1 }}>
                    <h1 style={{ fontSize: '48px', fontWeight: '400', marginBottom: '30px', color: '#000' }}>About us</h1>
                    <p style={{ fontSize: '14px', lineHeight: '1.8', color: '#111', fontWeight: '600' }}>
                        A description is an account or representation, often in words,
                        that provides details about the characteristics, features, or qualities
                        of a person, place, object, or idea to help someone understand or visualize it.
                        It involves conveying information in a way that is vivid and engaging, aiming
                        to give the reader or listener a clear mental image of the subject. Descriptions
                        are a fundamental part of communication and can be considered
                        one of the four rhetorical modes, alongside exposition, argumentation, and narration.
                    </p>
                </div>
                <div style={{ flex: '0 0 400px' }}>
                    <img
                        src="https://images.unsplash.com/photo-1617347454431-f49d7ff5c3b1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                        alt="Delivery"
                        style={{ width: '100%', height: '400px', objectFit: 'cover', backgroundColor: '#ccc' }}
                    />
                </div>
            </section>

            {/* Blue Divider */}
            <div style={{
                width: '100%',
                height: '120px',
                backgroundColor: '#0084ff'
            }}></div>

            {/* Three Images Section */}
            <section style={{
                width: '100%',
                maxWidth: '1200px',
                margin: '80px auto',
                padding: '0 20px',
                display: 'flex',
                justifyContent: 'center',
                gap: '40px'
            }}>
                <img
                    src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
                    alt="Food 1"
                    style={{ width: '300px', height: '350px', objectFit: 'cover', backgroundColor: '#ccc' }}
                />
                <img
                    src="https://images.unsplash.com/photo-1555939594-58d7cb561ad1?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
                    alt="Food 2"
                    style={{ width: '300px', height: '350px', objectFit: 'cover', backgroundColor: '#ccc' }}
                />
                <img
                    src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
                    alt="Food 3"
                    style={{ width: '300px', height: '350px', objectFit: 'cover', backgroundColor: '#ccc' }}
                />
            </section>

            <Footer />
        </div>
    );
};

export default AboutUs;
