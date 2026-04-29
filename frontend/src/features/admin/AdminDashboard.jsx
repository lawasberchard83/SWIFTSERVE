import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    LayoutDashboard, Package, ShoppingCart, Activity, Settings,
    UserCircle, Bug, Bell, Plus, Pencil, Trash2, X, Search,
    LogOut, ChevronDown, ChevronRight
} from 'lucide-react';
import { supabase } from '../../supabaseClient';
import Notification from '../../components/Notification';

const CATEGORIES = ['ALL', 'MEALS', 'DRINKS', 'SNACKS'];

const emptyProduct = {
    name: '',
    description: '',
    price: '',
    original_price: '',
    image: '',
    vendor: '',
    category: 'MEALS',
    rating: '',
    in_stock: true,
    stock_quantity: 0,
};

// Styling tokens for consistency
const neumorphicShadow = '6px 6px 12px rgba(0,0,0,0.3), -6px -6px 12px rgba(255,255,255,0.02)';
const neumorphicInner = 'inset 4px 4px 8px rgba(0,0,0,0.3), inset -4px -4px 8px rgba(255,255,255,0.02)';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('Products');
    const [activeCategory, setActiveCategory] = useState('ALL');
    const [searchQuery, setSearchQuery] = useState('');
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [formData, setFormData] = useState(emptyProduct);
    const [stats, setStats] = useState({ users: 0, orders: 0, products: 0 });
    const [ordersList, setOrdersList] = useState([]);
    const [activeOrderFilter, setActiveOrderFilter] = useState('All');
    const [notification, setNotification] = useState({ message: '', type: '' });

    const showNotification = (message, type = 'success') => {
        setNotification({ message, type });
    };

    const fetchProducts = async () => {
        setLoading(true);
        const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false });
        if (!error) setProducts(data || []);
        setLoading(false);
    };

    const fetchStats = async () => {
        const { count: userCount } = await supabase.from('users').select('*', { count: 'exact', head: true });
        const { count: orderCount } = await supabase.from('orders').select('*', { count: 'exact', head: true });
        const { count: productCount } = await supabase.from('products').select('*', { count: 'exact', head: true });
        setStats({ users: userCount || 0, orders: orderCount || 0, products: productCount || 0 });
    };

    const fetchOrders = async () => {
        const { data, error } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
        if (!error) setOrdersList(data || []);
    };

    const handleUpdateOrderStatus = async (orderId, newStatus) => {
        const { error } = await supabase.from('orders').update({ status: newStatus }).eq('id', orderId);
        if (error) {
            showNotification(`Error updating status: ${error.message}`, 'error');
        } else {
            showNotification('Order status updated successfully', 'success');
            fetchOrders();
        }
    };

    useEffect(() => {
        fetchProducts();
        fetchStats();
        fetchOrders();
    }, []);

    const filteredProducts = products.filter(p => {
        const matchesCategory = activeCategory === 'ALL' || p.category === activeCategory;
        const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                              (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase()));
        return matchesCategory && matchesSearch;
    });

    const filteredOrders = ordersList.filter(order => {
        if (activeOrderFilter === 'All') return true;
        return order.status === activeOrderFilter;
    });

    const openAddModal = () => {
        setEditingProduct(null);
        setFormData(emptyProduct);
        setShowModal(true);
    };

    const openEditModal = (product) => {
        setEditingProduct(product);
        setFormData({
            name: product.name || '',
            description: product.description || '',
            price: product.price || '',
            original_price: product.original_price || '',
            image: product.image || '',
            vendor: product.vendor || '',
            category: product.category || 'MEALS',
            rating: product.rating || '',
            in_stock: product.in_stock !== false,
            stock_quantity: product.stock_quantity || 0,
        });
        setShowModal(true);
    };

    const handleSave = async () => {
        const productData = {
            name: formData.name,
            description: formData.description,
            price: parseFloat(formData.price) || 0,
            original_price: formData.original_price ? parseFloat(formData.original_price) : null,
            image: formData.image,
            vendor: formData.vendor,
            category: formData.category,
            rating: formData.rating ? parseFloat(formData.rating) : null,
            in_stock: formData.in_stock,
            stock_quantity: parseInt(formData.stock_quantity) || 0,
        };

        if (editingProduct) {
            const { error } = await supabase.from('products').update(productData).eq('id', editingProduct.id);
            if (error) showNotification(`Error updating: ${error?.message || JSON.stringify(error)}`, "error");
            else showNotification("Product updated successfully", "success");
        } else {
            const { error } = await supabase.from('products').insert([productData]);
            if (error) showNotification(`Error adding: ${error?.message || JSON.stringify(error)}`, "error");
            else showNotification("Product added successfully", "success");
        }
        setShowModal(false);
        fetchProducts();
        fetchStats();
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            const { error } = await supabase.from('products').delete().eq('id', id);
            if (error) showNotification("Error deleting product", "error");
            else showNotification("Product deleted successfully", "success");
            fetchProducts();
            fetchStats();
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    // Analytics Computations
    const totalRevenue = ordersList.reduce((sum, o) => sum + (Number(o.total_amount) || 0), 0);
    const revenueFormatted = totalRevenue > 1000 ? `₱${(totalRevenue/1000).toFixed(1)}K` : `₱${totalRevenue.toFixed(2)}`;

    const catCount = { MEALS: 0, DRINKS: 0, SNACKS: 0 };
    products.forEach(p => {
        const cat = p.category?.toUpperCase();
        if (catCount[cat] !== undefined) catCount[cat]++;
    });
    const totalCat = products.length || 1;
    const mealsPct = Math.round((catCount.MEALS / totalCat) * 100);
    const drinksPct = Math.round((catCount.DRINKS / totalCat) * 100);
    const snacksPct = Math.round((catCount.SNACKS / totalCat) * 100);

    const statusCount = { Pending: 0, Preparing: 0, Shipped: 0, Delivered: 0 };
    ordersList.forEach(o => {
        if (statusCount[o.status] !== undefined) statusCount[o.status]++;
        else statusCount['Pending']++;
    });
    const totalStatus = ordersList.length || 1;
    const pendingH = Math.max(10, Math.round((statusCount.Pending / totalStatus) * 100)) + '%';
    const preparingH = Math.max(10, Math.round((statusCount.Preparing / totalStatus) * 100)) + '%';
    const shippedH = Math.max(10, Math.round((statusCount.Shipped / totalStatus) * 100)) + '%';
    const deliveredH = Math.max(10, Math.round((statusCount.Delivered / totalStatus) * 100)) + '%';

    const productSales = {};
    ordersList.forEach(order => {
        if (order.items) {
            const itemsArr = order.items.split(',');
            itemsArr.forEach(itemStr => {
                const match = itemStr.trim().match(/(.+?)\s*\(x(\d+)\)/);
                if (match) {
                    const name = match[1].trim();
                    const qty = parseInt(match[2], 10);
                    if (!productSales[name]) productSales[name] = { units: 0, revenue: 0 };
                    productSales[name].units += qty;
                    const prod = products.find(p => p.name === name);
                    if (prod) productSales[name].revenue += qty * prod.price;
                }
            });
        }
    });
    const topProducts = Object.entries(productSales)
        .map(([name, data]) => ({ name, units: data.units, rev: data.revenue }))
        .sort((a, b) => b.units - a.units)
        .slice(0, 4);
    if (topProducts.length === 0) {
        products.slice(0, 4).forEach(p => topProducts.push({ name: p.name, units: 0, rev: 0 }));
    }

    // ===== STYLES =====
    const tabStyle = (isActive) => ({
        background: isActive ? '#262932' : 'transparent',
        border: isActive ? '1px solid rgba(255,255,255,0.05)' : '1px solid transparent',
        borderRadius: '12px',
        padding: '14px 20px',
        display: 'flex',
        alignItems: 'center',
        gap: '14px',
        fontWeight: isActive ? '600' : '500',
        fontSize: '14px',
        color: isActive ? '#fff' : '#8a92a6',
        cursor: 'pointer',
        boxShadow: isActive ? 'inset 0 0 20px rgba(74,124,255,0.05), 0 4px 10px rgba(0,0,0,0.2)' : 'none',
        transition: 'all 0.3s ease',
        width: '100%',
        textAlign: 'left'
    });

    const modalOverlayStyle = {
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(5px)', display: 'flex',
        alignItems: 'center', justifyContent: 'center', zIndex: 1000,
    };

    const modalStyle = {
        backgroundColor: '#252831', borderRadius: '24px', padding: '32px',
        width: '500px', maxHeight: '90vh', overflowY: 'auto',
        border: '1px solid rgba(255,255,255,0.05)',
        boxShadow: '0 20px 60px rgba(0,0,0,0.5)', color: '#fff'
    };

    const inputGroupStyle = { marginBottom: '20px' };
    const labelStyle = { display: 'block', fontSize: '13px', fontWeight: '500', color: '#8a92a6', marginBottom: '8px' };
    const inputStyle = {
        width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)',
        background: '#1c1e24', color: '#fff', fontSize: '14px', boxSizing: 'border-box', outline: 'none',
        boxShadow: neumorphicInner
    };

    return (
        <div style={{ backgroundColor: '#1c1e24', minHeight: '100vh', fontFamily: 'Inter, sans-serif', display: 'flex', color: '#fff' }}>
            <Notification message={notification.message} type={notification.type} onClose={() => setNotification({ message: '', type: '' })} />
            
            {/* Sidebar */}
            <div style={{ width: '260px', padding: '32px 24px', display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '48px', paddingLeft: '8px' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#2a2d36', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: neumorphicShadow }}>
                        <UserCircle size={20} color="#fff" />
                    </div>
                    <div style={{ fontWeight: '600', fontSize: '15px', lineHeight: '1.2' }}>Admin Page</div>
                </div>

                <nav style={{ display: 'flex', flexDirection: 'column', gap: '12px', flex: 1 }}>
                    {[
                        { name: 'Dashboard', icon: LayoutDashboard },
                        { name: 'Products', icon: Package },
                        { name: 'Orders', icon: ShoppingCart }
                    ].map(tab => (
                        <button key={tab.name} style={tabStyle(activeTab === tab.name)} onClick={() => setActiveTab(tab.name)}>
                            <tab.icon size={20} color={activeTab === tab.name ? '#4a7cff' : '#8a92a6'} />
                            {tab.name}
                        </button>
                    ))}
                </nav>
            </div>

            {/* Main Content Area */}
            <div style={{ flex: 1, padding: '24px 32px 24px 0', display: 'flex', flexDirection: 'column' }}>
                
                {/* Top Action Bar */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '24px' }}>
                     <button onClick={handleLogout} title="Logout" style={{
                         background: '#242730', border: '1px solid rgba(255,255,255,0.05)',
                         borderRadius: '12px', padding: '10px', color: '#8a92a6',
                         cursor: 'pointer', boxShadow: neumorphicShadow
                     }}>
                         <LogOut size={20} />
                     </button>
                </div>

                {/* Main Glass Panel */}
                <div style={{
                    background: '#252831', borderRadius: '24px', flex: 1, padding: '32px',
                    border: '1px solid rgba(255,255,255,0.03)',
                    boxShadow: '10px 10px 30px rgba(0,0,0,0.4), inset 1px 1px 0px rgba(255,255,255,0.05)',
                    overflowY: 'auto'
                }}>

                    {/* ===== DASHBOARD TAB (OVERVIEW & ANALYTICS) ===== */}
                    {activeTab === 'Dashboard' && (
                        <div>
                            <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#fff', marginBottom: '32px', marginTop: 0 }}>Overview</h2>
                            <div style={{ display: 'flex', gap: '24px', marginBottom: '40px' }}>
                                {[
                                    { label: 'Total Users', value: stats.users },
                                    { label: 'Total Orders', value: stats.orders },
                                    { label: 'Total Products', value: stats.products }
                                ].map(stat => (
                                    <div key={stat.label} style={{
                                        flex: 1, background: '#2a2d36', borderRadius: '20px', padding: '24px',
                                        border: '1px solid rgba(255,255,255,0.03)', boxShadow: neumorphicShadow
                                    }}>
                                        <div style={{ color: '#8a92a6', fontSize: '14px', marginBottom: '16px' }}>{stat.label}</div>
                                        <div style={{ color: '#fff', fontSize: '36px', fontWeight: '700' }}>{stat.value}</div>
                                    </div>
                                ))}
                            </div>

                            <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#fff', marginBottom: '24px', marginTop: 0 }}>Analytics</h2>
                            
                            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px', marginBottom: '24px' }}>
                                 <div style={{ background: '#2a2d36', borderRadius: '20px', padding: '24px', border: '1px solid rgba(255,255,255,0.03)', boxShadow: neumorphicShadow }}>
                                     <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
                                         <h3 style={{ margin: 0, fontSize: '16px', color: '#fff', fontWeight: '500' }}>Sales Trends</h3>
                                         <span style={{ color: '#8a92a6', fontSize: '13px' }}>Last 6 months <ChevronDown size={14} style={{verticalAlign: 'middle'}}/></span>
                                     </div>
                                     <div style={{ height: '200px', display: 'flex', alignItems: 'flex-end', gap: '10px', position: 'relative' }}>
                                         <div style={{ position: 'absolute', top: 0, left: 0, color: '#8a92a6', fontSize: '12px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>
                                             <span>₱200</span><span>₱100</span><span>₱50</span><span>0</span>
                                         </div>
                                         <svg width="100%" height="100%" style={{ marginLeft: '40px' }} viewBox="0 0 400 200" preserveAspectRatio="none">
                                             <path d="M0,180 Q50,150 100,50 T200,150 T300,80 T400,160" fill="none" stroke="#4a7cff" strokeWidth="3" />
                                             <path d="M0,180 Q50,150 100,50 T200,150 T300,80 T400,160 L400,200 L0,200 Z" fill="rgba(74,124,255,0.1)" />
                                             <circle cx="100" cy="50" r="4" fill="#fff" stroke="#4a7cff" strokeWidth="2" />
                                             <text x="100" y="35" fill="#fff" fontSize="12" textAnchor="middle" background="#353945">{revenueFormatted}</text>
                                         </svg>
                                     </div>
                                 </div>

                                 <div style={{ background: '#2a2d36', borderRadius: '20px', padding: '24px', border: '1px solid rgba(255,255,255,0.03)', boxShadow: neumorphicShadow }}>
                                     <h3 style={{ margin: 0, fontSize: '16px', color: '#fff', fontWeight: '500', marginBottom: '24px' }}>Products by Category</h3>
                                     <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '140px' }}>
                                         <div style={{ width: '120px', height: '120px', borderRadius: '50%', background: `conic-gradient(#4a7cff 0% ${mealsPct}%, #6b8df2 ${mealsPct}% ${mealsPct + drinksPct}%, #8a92a6 ${mealsPct + drinksPct}% ${mealsPct + drinksPct + snacksPct}%, #353945 ${mealsPct + drinksPct + snacksPct}% 100%)`, boxShadow: 'inset 0 0 20px rgba(0,0,0,0.5)' }}></div>
                                     </div>
                                     <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '16px' }}>
                                         <div style={{ color: '#8a92a6', fontSize: '12px' }}><span style={{ color: '#4a7cff' }}>●</span> Meals {mealsPct}%</div>
                                         <div style={{ color: '#8a92a6', fontSize: '12px' }}><span style={{ color: '#6b8df2' }}>●</span> Drinks {drinksPct}%</div>
                                         <div style={{ color: '#8a92a6', fontSize: '12px' }}><span style={{ color: '#8a92a6' }}>●</span> Snacks {snacksPct}%</div>
                                     </div>
                                 </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 2fr', gap: '24px' }}>
                                 <div style={{ background: '#2a2d36', borderRadius: '20px', padding: '24px', border: '1px solid rgba(255,255,255,0.03)', boxShadow: neumorphicShadow }}>
                                     <h3 style={{ margin: 0, fontSize: '16px', color: '#fff', fontWeight: '500', marginBottom: '24px' }}>Orders by Status</h3>
                                     <div style={{ display: 'flex', alignItems: 'flex-end', gap: '24px', height: '120px', justifyContent: 'center' }}>
                                         <div style={{ width: '24px', height: pendingH, background: '#f59e0b', borderRadius: '6px' }}></div>
                                         <div style={{ width: '24px', height: preparingH, background: '#a855f7', borderRadius: '6px' }}></div>
                                         <div style={{ width: '24px', height: shippedH, background: '#3b82f6', borderRadius: '6px' }}></div>
                                         <div style={{ width: '24px', height: deliveredH, background: '#10b981', borderRadius: '6px', boxShadow: '0 0 10px rgba(16,185,129,0.4)' }}></div>
                                     </div>
                                     <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginTop: '12px', fontSize: '10px', color: '#8a92a6' }}>
                                         <span>Pending</span><span>Prep</span><span>Shipped</span><span>Delivered</span>
                                     </div>
                                 </div>
                                 
                                 <div style={{ background: '#2a2d36', borderRadius: '20px', padding: '24px', border: '1px solid rgba(255,255,255,0.03)', boxShadow: neumorphicShadow }}>
                                     <h3 style={{ margin: 0, fontSize: '16px', color: '#fff', fontWeight: '500', marginBottom: '24px' }}>Conversion Rate</h3>
                                     <div style={{ height: '120px', display: 'flex', alignItems: 'flex-end' }}>
                                         <svg width="100%" height="100%" viewBox="0 0 200 100" preserveAspectRatio="none">
                                             <path d="M0,80 Q50,90 100,20 T200,60" fill="none" stroke="#4a7cff" strokeWidth="3" />
                                             <circle cx="100" cy="20" r="4" fill="#fff" stroke="#4a7cff" strokeWidth="2" />
                                             <text x="100" y="10" fill="#fff" fontSize="12" textAnchor="middle">6.7%</text>
                                         </svg>
                                     </div>
                                 </div>

                                 <div style={{ background: '#2a2d36', borderRadius: '20px', padding: '24px', border: '1px solid rgba(255,255,255,0.03)', boxShadow: neumorphicShadow }}>
                                     <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                                         <h3 style={{ margin: 0, fontSize: '16px', color: '#fff', fontWeight: '500' }}>Top Products</h3>
                                         <span style={{ color: '#8a92a6', fontSize: '13px' }}>Last 30 days <ChevronDown size={14} style={{verticalAlign: 'middle'}}/></span>
                                     </div>
                                     <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                         <thead>
                                             <tr>
                                                 <th style={{ padding: '8px 0', textAlign: 'left', fontSize: '12px', color: '#8a92a6', fontWeight: 'normal' }}>Product name</th>
                                                 <th style={{ padding: '8px 0', textAlign: 'right', fontSize: '12px', color: '#8a92a6', fontWeight: 'normal' }}>Units sold</th>
                                                 <th style={{ padding: '8px 0', textAlign: 'right', fontSize: '12px', color: '#8a92a6', fontWeight: 'normal' }}>Revenue</th>
                                             </tr>
                                         </thead>
                                         <tbody>
                                             {topProducts.map((p, i) => (
                                                 <tr key={i}>
                                                     <td style={{ padding: '8px 0', color: '#d1d5db', fontSize: '13px' }}>{p.name}</td>
                                                     <td style={{ padding: '8px 0', color: '#fff', fontSize: '13px', textAlign: 'right' }}>{p.units}</td>
                                                     <td style={{ padding: '8px 0', color: '#fff', fontSize: '13px', textAlign: 'right' }}>₱{(p.rev || 0).toFixed(2)}</td>
                                                 </tr>
                                             ))}
                                         </tbody>
                                     </table>
                                 </div>
                            </div>
                        </div>
                    )}

                    {/* ===== PRODUCTS TAB ===== */}
                    {activeTab === 'Products' && (
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                                <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                                    <div style={{
                                        display: 'flex', alignItems: 'center', background: '#1c1e24',
                                        borderRadius: '12px', padding: '10px 16px', border: '1px solid rgba(255,255,255,0.05)',
                                        boxShadow: neumorphicInner
                                    }}>
                                        <Search size={16} color="#8a92a6" />
                                        <input type="text" placeholder="Search products..." 
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            style={{
                                                background: 'transparent', border: 'none', outline: 'none',
                                                color: '#fff', fontSize: '14px', marginLeft: '8px', width: '200px'
                                            }} 
                                        />
                                    </div>
                                    
                                    {/* Category Select Dropdown */}
                                    <div style={{ position: 'relative' }}>
                                        <select value={activeCategory} onChange={(e) => setActiveCategory(e.target.value)} style={{
                                            appearance: 'none', background: '#1c1e24', color: '#8a92a6',
                                            border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px',
                                            padding: '10px 36px 10px 16px', fontSize: '14px', outline: 'none', cursor: 'pointer',
                                            boxShadow: neumorphicShadow
                                        }}>
                                            <option value="ALL">All Categories</option>
                                            <option value="MEALS">Meals</option>
                                            <option value="DRINKS">Drinks</option>
                                            <option value="SNACKS">Snacks</option>
                                        </select>
                                        <ChevronDown size={14} color="#8a92a6" style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                                    </div>
                                </div>

                                <button onClick={openAddModal} style={{
                                    background: '#353945', color: '#fff', border: '1px solid rgba(255,255,255,0.1)',
                                    padding: '10px 20px', borderRadius: '12px', fontWeight: '600', fontSize: '14px',
                                    cursor: 'pointer', boxShadow: neumorphicShadow, display: 'flex', alignItems: 'center', gap: '8px'
                                }}>
                                    Add Product
                                </button>
                            </div>

                            <div style={{ border: '1px solid rgba(255,255,255,0.03)', borderRadius: '16px', background: '#2a2d36', padding: '8px 16px' }}>
                                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                    <thead>
                                        <tr>
                                            <th style={{ padding: '16px', textAlign: 'left', fontSize: '13px', fontWeight: '500', color: '#8a92a6', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>Product</th>
                                            <th style={{ padding: '16px', textAlign: 'left', fontSize: '13px', fontWeight: '500', color: '#8a92a6', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>Category</th>
                                            <th style={{ padding: '16px', textAlign: 'left', fontSize: '13px', fontWeight: '500', color: '#8a92a6', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>Price</th>
                                            <th style={{ padding: '16px', textAlign: 'left', fontSize: '13px', fontWeight: '500', color: '#8a92a6', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>Stock</th>
                                            <th style={{ padding: '16px', textAlign: 'left', fontSize: '13px', fontWeight: '500', color: '#8a92a6', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>Status</th>
                                            <th style={{ padding: '16px', textAlign: 'center', fontSize: '13px', fontWeight: '500', color: '#8a92a6', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredProducts.map(product => (
                                            <tr key={product.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                                                <td style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                                                    <div style={{
                                                        width: '48px', height: '48px', borderRadius: '12px', background: '#1c1e24',
                                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                        padding: '4px', boxShadow: neumorphicShadow
                                                    }}>
                                                        <img src={product.image || 'https://via.placeholder.com/40'} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: '8px' }} />
                                                    </div>
                                                    <div>
                                                        <div style={{ color: '#fff', fontWeight: '600', fontSize: '14px', marginBottom: '4px' }}>{product.name}</div>
                                                        <div style={{ color: '#8a92a6', fontSize: '12px' }}>Product - {new Date(product.created_at).getFullYear() || 2023}</div>
                                                    </div>
                                                </td>
                                                <td style={{ padding: '16px', color: '#d1d5db', fontSize: '14px' }}>
                                                    {product.category.charAt(0).toUpperCase() + product.category.slice(1).toLowerCase()}
                                                </td>
                                                <td style={{ padding: '16px', color: '#d1d5db', fontSize: '14px' }}>₱{parseFloat(product.price).toFixed(2)}</td>
                                                <td style={{ padding: '16px', color: '#d1d5db', fontSize: '14px' }}>{product.stock_quantity || 0}</td>
                                                <td style={{ padding: '16px' }}>
                                                    <span style={{
                                                        padding: '6px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: '600',
                                                        backgroundColor: product.stock_quantity > 0 ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                                                        color: product.stock_quantity > 0 ? '#4ade80' : '#f87171',
                                                        border: product.stock_quantity > 0 ? '1px solid rgba(34, 197, 94, 0.2)' : '1px solid rgba(239, 68, 68, 0.2)',
                                                    }}>
                                                        {product.stock_quantity > 0 ? 'In Stock' : 'Low Stock'}
                                                    </span>
                                                </td>
                                                <td style={{ padding: '16px', textAlign: 'center' }}>
                                                    <button onClick={() => openEditModal(product)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', marginRight: '12px', color: '#8a92a6' }}>
                                                        <Pencil size={18} />
                                                    </button>
                                                    <button onClick={() => handleDelete(product.id)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#8a92a6' }}>
                                                        <Trash2 size={18} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* ===== ORDERS TAB ===== */}
                    {activeTab === 'Orders' && (
                        <div>
                            <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#fff', marginBottom: '24px', marginTop: 0 }}>Orders</h2>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
                                 <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                     <span style={{ color: '#8a92a6', fontSize: '14px', marginRight: '8px' }}>Status</span>
                                     {['All', 'Pending', 'Preparing', 'Shipped', 'Delivered'].map(status => (
                                         <button key={status} onClick={() => setActiveOrderFilter(status)} style={{
                                             background: status === activeOrderFilter ? 'rgba(255,255,255,0.05)' : 'transparent',
                                             color: status === activeOrderFilter ? '#fff' : '#8a92a6',
                                             border: status === activeOrderFilter ? '1px solid rgba(255,255,255,0.1)' : 'none',
                                             padding: '6px 16px', borderRadius: '16px', fontSize: '13px', cursor: 'pointer'
                                         }}>{status}</button>
                                     ))}
                                 </div>
                                 <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                                     <span style={{ color: '#8a92a6', fontSize: '14px' }}>Date Range</span>
                                     <button style={{ background: 'transparent', border: 'none', color: '#8a92a6', fontSize: '13px', display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                                         Last 30 Days <ChevronDown size={14} style={{marginLeft: 4}}/>
                                     </button>
                                 </div>
                            </div>

                            <div style={{ background: '#2a2d36', borderRadius: '16px', padding: '8px 16px', border: '1px solid rgba(255,255,255,0.03)' }}>
                                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                    <thead>
                                        <tr>
                                            <th style={{ padding: '16px', textAlign: 'left', fontSize: '13px', fontWeight: '500', color: '#8a92a6', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>Order ID</th>
                                            <th style={{ padding: '16px', textAlign: 'left', fontSize: '13px', fontWeight: '500', color: '#8a92a6', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>Customer</th>
                                            <th style={{ padding: '16px', textAlign: 'left', fontSize: '13px', fontWeight: '500', color: '#8a92a6', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>Product</th>
                                            <th style={{ padding: '16px', textAlign: 'left', fontSize: '13px', fontWeight: '500', color: '#8a92a6', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>Total</th>
                                            <th style={{ padding: '16px', textAlign: 'left', fontSize: '13px', fontWeight: '500', color: '#8a92a6', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>Status</th>
                                            <th style={{ padding: '16px', textAlign: 'left', fontSize: '13px', fontWeight: '500', color: '#8a92a6', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>Date</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredOrders.length === 0 ? (
                                            <tr>
                                                <td colSpan="6" style={{ padding: '24px', textAlign: 'center', color: '#8a92a6' }}>No orders found</td>
                                            </tr>
                                        ) : (
                                            filteredOrders.map(order => (
                                                <tr key={order.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                                                    <td style={{ padding: '16px', color: '#fff', fontSize: '14px' }}>#{String(order.id).padStart(5, '0')}</td>
                                                    <td style={{ padding: '16px', color: '#d1d5db', fontSize: '14px' }}>Guest User</td>
                                                    <td style={{ padding: '16px', color: '#d1d5db', fontSize: '14px' }}>{order.items || '-'}</td>
                                                    <td style={{ padding: '16px', color: '#fff', fontSize: '14px' }}>₱{parseFloat(order.total_amount || 0).toFixed(2)}</td>
                                                    <td style={{ padding: '16px' }}>
                                                        <select
                                                            value={order.status || 'Pending'}
                                                            onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                                                            style={{
                                                                padding: '6px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: '600',
                                                                backgroundColor: order.status === 'Delivered' ? 'rgba(34, 197, 94, 0.1)' : order.status === 'Shipped' ? 'rgba(59, 130, 246, 0.1)' : order.status === 'Preparing' ? 'rgba(168, 85, 247, 0.1)' : 'rgba(245, 158, 11, 0.1)', 
                                                                color: order.status === 'Delivered' ? '#4ade80' : order.status === 'Shipped' ? '#60a5fa' : order.status === 'Preparing' ? '#c084fc' : '#fbbf24', 
                                                                border: `1px solid ${order.status === 'Delivered' ? 'rgba(34, 197, 94, 0.2)' : order.status === 'Shipped' ? 'rgba(59, 130, 246, 0.2)' : order.status === 'Preparing' ? 'rgba(168, 85, 247, 0.2)' : 'rgba(245, 158, 11, 0.2)'}`,
                                                                outline: 'none', cursor: 'pointer', appearance: 'none'
                                                            }}
                                                        >
                                                            <option value="Pending" style={{ color: '#000' }}>Pending</option>
                                                            <option value="Preparing" style={{ color: '#000' }}>Preparing</option>
                                                            <option value="Shipped" style={{ color: '#000' }}>Shipped</option>
                                                            <option value="Delivered" style={{ color: '#000' }}>Delivered</option>
                                                        </select>
                                                    </td>
                                                    <td style={{ padding: '16px', color: '#8a92a6', fontSize: '14px' }}>{new Date(order.created_at).toLocaleDateString()}</td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                </div>
            </div>

            {/* ===== ADD/EDIT PRODUCT MODAL ===== */}
            {showModal && (
                <div style={modalOverlayStyle} onClick={() => setShowModal(false)}>
                    <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                            <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#fff', margin: 0 }}>
                                {editingProduct ? 'Edit Product' : 'Add New Product'}
                            </h2>
                            <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                                <X size={24} color="#8a92a6" />
                            </button>
                        </div>

                        <div style={inputGroupStyle}>
                            <label style={labelStyle}>Product Name *</label>
                            <input style={inputStyle} name="name" value={formData.name} onChange={handleChange} placeholder="e.g. Burger" />
                        </div>

                        <div style={inputGroupStyle}>
                            <label style={labelStyle}>Description</label>
                            <textarea style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }} name="description" value={formData.description} onChange={handleChange} placeholder="Describe the product..." />
                        </div>

                        <div style={{ display: 'flex', gap: '16px', marginBottom: '20px' }}>
                            <div style={{ flex: 1 }}>
                                <label style={labelStyle}>Price *</label>
                                <input style={inputStyle} type="number" step="0.01" name="price" value={formData.price} onChange={handleChange} placeholder="0.00" />
                            </div>
                            <div style={{ flex: 1 }}>
                                <label style={labelStyle}>Original Price</label>
                                <input style={inputStyle} type="number" step="0.01" name="original_price" value={formData.original_price} onChange={handleChange} placeholder="0.00" />
                            </div>
                        </div>

                        <div style={inputGroupStyle}>
                            <label style={labelStyle}>Product Image URL</label>
                            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                                {formData.image && (
                                    <div style={{ width: '60px', height: '60px', borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)', flexShrink: 0 }}>
                                        <img src={formData.image} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    </div>
                                )}
                                <div style={{ flex: 1 }}>
                                    <input style={inputStyle} name="image" value={formData.image} onChange={handleChange} placeholder="e.g. https://example.com/image.png" />
                                </div>
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '16px', marginBottom: '20px' }}>
                            <div style={{ flex: 1 }}>
                                <label style={labelStyle}>Vendor</label>
                                <input style={inputStyle} name="vendor" value={formData.vendor} onChange={handleChange} placeholder="e.g. Burger House" />
                            </div>
                            <div style={{ flex: 1 }}>
                                <label style={labelStyle}>Category *</label>
                                <select style={{...inputStyle, cursor: 'pointer'}} name="category" value={formData.category} onChange={handleChange}>
                                    <option value="MEALS">MEALS</option>
                                    <option value="DRINKS">DRINKS</option>
                                    <option value="SNACKS">SNACKS</option>
                                </select>
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '16px', marginBottom: '32px' }}>
                            <div style={{ flex: 1 }}>
                                <label style={labelStyle}>Rating (0-5)</label>
                                <input style={inputStyle} type="number" step="0.1" min="0" max="5" name="rating" value={formData.rating} onChange={handleChange} placeholder="4.5" />
                            </div>
                            <div style={{ flex: 1 }}>
                                <label style={labelStyle}>Stock Quantity *</label>
                                <input style={inputStyle} type="number" min="0" name="stock_quantity" value={formData.stock_quantity} onChange={handleChange} placeholder="0" />
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '16px' }}>
                            <button onClick={() => setShowModal(false)} style={{
                                flex: 1, padding: '14px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)',
                                background: '#2a2d36', fontWeight: '600', fontSize: '14px', cursor: 'pointer', color: '#8a92a6',
                                boxShadow: neumorphicShadow
                            }}>
                                Cancel
                            </button>
                            <button onClick={handleSave} style={{
                                flex: 1, padding: '14px', borderRadius: '12px', border: 'none',
                                background: '#4a7cff', color: '#fff', fontWeight: '600', fontSize: '14px', cursor: 'pointer',
                                boxShadow: '0 4px 14px rgba(74,124,255,0.3)'
                            }}>
                                {editingProduct ? 'Update Product' : 'Add Product'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
