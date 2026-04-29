import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../supabaseClient';
import NavigationBar from '../../components/NavigationBar';
import Footer from '../../components/Footer';
import { Package, Clock, CheckCircle, Truck, Utensils } from 'lucide-react';

const UserOrders = () => {
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const { data: ordersData } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
            const { data: productsData } = await supabase.from('products').select('name, image');
            
            if (ordersData) setOrders(ordersData);
            if (productsData) setProducts(productsData);
            
            setLoading(false);
        };
        fetchData();
    }, []);

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Preparing': return <Utensils size={18} color="#a855f7" />;
            case 'Shipped': return <Truck size={18} color="#3b82f6" />;
            case 'Delivered': return <CheckCircle size={18} color="#10b981" />;
            default: return <Clock size={18} color="#f59e0b" />;
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Preparing': return { bg: '#faf5ff', text: '#a855f7', border: '#e9d5ff' };
            case 'Shipped': return { bg: '#eff6ff', text: '#3b82f6', border: '#bfdbfe' };
            case 'Delivered': return { bg: '#f0fdf4', text: '#10b981', border: '#bbf7d0' };
            default: return { bg: '#fffbeb', text: '#f59e0b', border: '#fde68a' };
        }
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#f4f7fe', fontFamily: 'Inter, sans-serif' }}>
            <NavigationBar showSearch={false} />

            <div style={{ maxWidth: '1000px', margin: '40px auto', padding: '0 24px', flex: 1, width: '100%', boxSizing: 'border-box' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
                    <div style={{ backgroundColor: '#fff', padding: '12px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                        <Package size={28} color="#0ea5e9" />
                    </div>
                    <div>
                        <h1 style={{ fontSize: '28px', fontWeight: '800', color: '#111827', margin: 0 }}>My Orders</h1>
                        <p style={{ color: '#6b7280', margin: '4px 0 0 0', fontSize: '15px' }}>Track your food delivery status in real-time.</p>
                    </div>
                </div>

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>Loading orders...</div>
                ) : orders.length === 0 ? (
                    <div style={{ backgroundColor: '#fff', borderRadius: '24px', padding: '60px 20px', textAlign: 'center', boxShadow: '0 10px 30px rgba(0,0,0,0.03)' }}>
                        <Package size={48} color="#d1d5db" style={{ margin: '0 auto 16px' }} />
                        <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#374151', margin: '0 0 8px 0' }}>No Orders Found</h3>
                        <p style={{ color: '#6b7280', marginBottom: '24px' }}>You haven't placed any orders yet. Start exploring our menu!</p>
                        <button onClick={() => navigate('/dashboard')} style={{ backgroundColor: '#0ea5e9', color: '#fff', border: 'none', padding: '12px 24px', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', transition: 'background-color 0.2s' }} onMouseOver={(e) => e.target.style.backgroundColor = '#0284c7'} onMouseOut={(e) => e.target.style.backgroundColor = '#0ea5e9'}>
                            Browse Menu
                        </button>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gap: '20px' }}>
                        {orders.map(order => {
                            const colors = getStatusColor(order.status);
                            const firstItemName = order.items ? order.items.split(',')[0].split(' (x')[0].trim() : '';
                            const product = products.find(p => p.name === firstItemName);
                            const imageUrl = product?.image;

                            return (
                                <div key={order.id} style={{ backgroundColor: '#fff', borderRadius: '20px', padding: '24px', boxShadow: '0 10px 30px rgba(0,0,0,0.03)', display: 'flex', flexWrap: 'wrap', gap: '24px', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                                        <div style={{ backgroundColor: '#f3f4f6', width: '60px', height: '60px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                                            {imageUrl ? (
                                                <img src={imageUrl} alt={firstItemName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                            ) : (
                                                <Package size={24} color="#9ca3af" />
                                            )}
                                        </div>
                                        <div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px' }}>
                                                <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#111827', margin: 0 }}>Order #{String(order.id).padStart(5, '0')}</h3>
                                                <span style={{ fontSize: '12px', color: '#6b7280', fontWeight: '500' }}>• {new Date(order.created_at).toLocaleDateString()}</span>
                                            </div>
                                            <p style={{ margin: 0, color: '#4b5563', fontSize: '14px', lineHeight: '1.5' }}>{order.items}</p>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                                        <div style={{ textAlign: 'right' }}>
                                            <span style={{ display: 'block', fontSize: '12px', color: '#6b7280', fontWeight: '600', marginBottom: '4px', textTransform: 'uppercase' }}>Total Amount</span>
                                            <span style={{ fontSize: '18px', fontWeight: '800', color: '#111827' }}>₱{parseFloat(order.total_amount || 0).toFixed(2)}</span>
                                        </div>
                                        <div style={{ backgroundColor: colors.bg, border: `1px solid ${colors.border}`, padding: '8px 16px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            {getStatusIcon(order.status)}
                                            <span style={{ color: colors.text, fontWeight: '700', fontSize: '14px' }}>{order.status || 'Pending'}</span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            <Footer />
        </div>
    );
};

export default UserOrders;
