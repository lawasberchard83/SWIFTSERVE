import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, UserCircle, Bug, Bell, Plus, Pencil, Trash2, X } from 'lucide-react';
import { supabase } from '../../supabaseClient';

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
};

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('Dashboard');
    const [activeCategory, setActiveCategory] = useState('ALL');
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [formData, setFormData] = useState(emptyProduct);
    const [stats, setStats] = useState({ users: 0, orders: 0, products: 0 });

    // Fetch products
    const fetchProducts = async () => {
        setLoading(true);
        const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false });
        if (!error) setProducts(data || []);
        setLoading(false);
    };

    // Fetch stats
    const fetchStats = async () => {
        const { count: userCount } = await supabase.from('users').select('*', { count: 'exact', head: true });
        const { count: orderCount } = await supabase.from('orders').select('*', { count: 'exact', head: true });
        const { count: productCount } = await supabase.from('products').select('*', { count: 'exact', head: true });
        setStats({ users: userCount || 0, orders: orderCount || 0, products: productCount || 0 });
    };

    useEffect(() => {
        fetchProducts();
        fetchStats();
    }, []);

    // Filter products by category
    const filteredProducts = activeCategory === 'ALL'
        ? products
        : products.filter(p => p.category === activeCategory);

    // Open modal for add/edit
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
        });
        setShowModal(true);
    };

    // Save product (add or update)
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
        };

        if (editingProduct) {
            await supabase.from('products').update(productData).eq('id', editingProduct.id);
        } else {
            await supabase.from('products').insert([productData]);
        }
        setShowModal(false);
        fetchProducts();
        fetchStats();
    };

    // Delete product
    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            await supabase.from('products').delete().eq('id', id);
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

    // ===== STYLES =====
    const tabStyle = (isActive) => ({
        background: isActive ? '#e8e6f9' : 'transparent',
        border: isActive ? '1px solid #d1cbf3' : '1px solid #ccc',
        borderRadius: '24px',
        padding: '8px 16px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        fontWeight: isActive ? '600' : '500',
        fontSize: '14px',
        color: isActive ? '#4b3f8f' : '#333',
        cursor: 'pointer',
    });

    const catBtnStyle = (isActive) => ({
        background: isActive ? '#4a7cff' : '#e8efff',
        color: isActive ? '#fff' : '#4a7cff',
        border: 'none',
        borderRadius: '8px',
        padding: '10px 24px',
        fontWeight: '700',
        fontSize: '14px',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
    });

    const modalOverlayStyle = {
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex',
        alignItems: 'center', justifyContent: 'center', zIndex: 1000,
    };

    const modalStyle = {
        backgroundColor: '#fff', borderRadius: '16px', padding: '32px',
        width: '500px', maxHeight: '90vh', overflowY: 'auto',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
    };

    const inputGroupStyle = { marginBottom: '16px' };
    const labelStyle = { display: 'block', fontSize: '13px', fontWeight: '600', color: '#333', marginBottom: '4px' };
    const inputStyle = {
        width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #ddd',
        fontSize: '14px', boxSizing: 'border-box', outline: 'none',
    };

    // ===== RENDER =====
    return (
        <div style={{ backgroundColor: '#fff', minHeight: '100vh', fontFamily: 'Inter, sans-serif' }}>
            {/* Header */}
            <header style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '24px 40px', backgroundColor: '#f1f1f1', margin: '16px', borderRadius: '16px',
            }}>
                <h1 style={{ fontSize: '28px', fontWeight: '800', color: '#000', margin: 0 }}>
                    Admin Dashboard
                    <div style={{ height: '4px', backgroundColor: '#0084ff', marginTop: '4px', width: '100%' }}></div>
                </h1>
                <div style={{ display: 'flex', gap: '16px' }}>
                    <button onClick={() => navigate('/dashboard')}
                        style={{ background: '#111', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}>
                        Customer View
                    </button>
                    <button onClick={handleLogout}
                        style={{ background: '#0084ff', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}>
                        Logout
                    </button>
                </div>
            </header>

            {/* Navigation Tabs */}
            <div style={{
                margin: '0 16px 32px 16px', padding: '12px 24px', backgroundColor: '#f1f1f1',
                borderRadius: '16px', display: 'flex', gap: '8px',
            }}>
                {['Dashboard', 'Products', 'Orders', 'Users'].map(tab => (
                    <button key={tab} style={tabStyle(activeTab === tab)} onClick={() => setActiveTab(tab)}>
                        {activeTab === tab && <Check size={16} color="#4b3f8f" />} {tab}
                    </button>
                ))}
            </div>

            {/* ===== DASHBOARD TAB ===== */}
            {activeTab === 'Dashboard' && (
                <div style={{ display: 'flex', padding: '0 32px', gap: '32px' }}>
                    <div style={{ flex: 1 }}>
                        <h2 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '24px', color: '#111' }}>Overview</h2>
                        <div style={{ display: 'flex', gap: '24px', marginBottom: '32px' }}>
                            <div style={{ flex: 1, backgroundColor: '#f0f3ff', borderRadius: '16px', padding: '24px' }}>
                                <div style={{ fontSize: '14px', color: '#555', marginBottom: '16px', fontWeight: '500' }}>Total Users</div>
                                <span style={{ fontSize: '32px', fontWeight: '800', color: '#111' }}>{stats.users}</span>
                            </div>
                            <div style={{ flex: 1, backgroundColor: '#eef5ff', borderRadius: '16px', padding: '24px' }}>
                                <div style={{ fontSize: '14px', color: '#555', marginBottom: '16px', fontWeight: '500' }}>Total Orders</div>
                                <span style={{ fontSize: '32px', fontWeight: '800', color: '#111' }}>{stats.orders}</span>
                            </div>
                            <div style={{ flex: 1, backgroundColor: '#eef5ff', borderRadius: '16px', padding: '24px' }}>
                                <div style={{ fontSize: '14px', color: '#555', marginBottom: '16px', fontWeight: '500' }}>Total Products</div>
                                <span style={{ fontSize: '32px', fontWeight: '800', color: '#111' }}>{stats.products}</span>
                            </div>
                        </div>
                    </div>

                    {/* Notifications Sidebar */}
                    <div style={{ width: '280px' }}>
                        <h3 style={{ fontSize: '14px', fontWeight: '700', color: '#111', marginBottom: '24px' }}>Notifications</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <div style={{ display: 'flex', gap: '12px' }}>
                                <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Bug size={16} color="#666" />
                                </div>
                                <div>
                                    <div style={{ fontSize: '13px', fontWeight: '600', color: '#111', marginBottom: '2px' }}>System running smoothly.</div>
                                    <div style={{ fontSize: '11px', color: '#888' }}>Just now</div>
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '12px' }}>
                                <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <UserCircle size={16} color="#666" />
                                </div>
                                <div>
                                    <div style={{ fontSize: '13px', fontWeight: '600', color: '#111', marginBottom: '2px' }}>New user registered.</div>
                                    <div style={{ fontSize: '11px', color: '#888' }}>59 minutes ago</div>
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '12px' }}>
                                <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Bell size={16} color="#666" />
                                </div>
                                <div>
                                    <div style={{ fontSize: '13px', fontWeight: '600', color: '#111', marginBottom: '2px' }}>New order received.</div>
                                    <div style={{ fontSize: '11px', color: '#888' }}>Today, 11:59 AM</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ===== PRODUCTS TAB ===== */}
            {activeTab === 'Products' && (
                <div style={{ padding: '0 32px' }}>
                    {/* Top Row: Title + Add Button */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                        <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#111', margin: 0 }}>Manage Products</h2>
                        <button onClick={openAddModal} style={{
                            display: 'flex', alignItems: 'center', gap: '8px',
                            background: '#4a7cff', color: '#fff', border: 'none', padding: '12px 24px',
                            borderRadius: '10px', fontWeight: '700', fontSize: '14px', cursor: 'pointer',
                            boxShadow: '0 4px 14px rgba(74,124,255,0.3)',
                        }}>
                            <Plus size={18} /> Add Product
                        </button>
                    </div>

                    {/* Category Tabs */}
                    <div style={{ display: 'flex', gap: '12px', marginBottom: '28px' }}>
                        {CATEGORIES.map(cat => (
                            <button key={cat} style={catBtnStyle(activeCategory === cat)} onClick={() => setActiveCategory(cat)}>
                                {cat}
                            </button>
                        ))}
                    </div>

                    {/* Products Table */}
                    {loading ? (
                        <div style={{ textAlign: 'center', padding: '40px', color: '#888' }}>Loading products...</div>
                    ) : filteredProducts.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '40px', color: '#888', fontSize: '16px' }}>
                            No products found in this category. Click "Add Product" to add one!
                        </div>
                    ) : (
                        <div style={{ borderRadius: '12px', overflow: 'hidden', border: '1px solid #e5e7eb' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr style={{ backgroundColor: '#f8f9fb' }}>
                                        <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#555' }}>Image</th>
                                        <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#555' }}>Name</th>
                                        <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#555' }}>Category</th>
                                        <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#555' }}>Price</th>
                                        <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#555' }}>Vendor</th>
                                        <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#555' }}>In Stock</th>
                                        <th style={{ padding: '14px 16px', textAlign: 'center', fontSize: '13px', fontWeight: '600', color: '#555' }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredProducts.map((product, idx) => (
                                        <tr key={product.id} style={{ borderTop: '1px solid #f0f0f0', backgroundColor: idx % 2 === 0 ? '#fff' : '#fafbfc' }}>
                                            <td style={{ padding: '12px 16px' }}>
                                                <img src={product.image} alt={product.name} style={{ width: '50px', height: '50px', borderRadius: '8px', objectFit: 'cover' }} />
                                            </td>
                                            <td style={{ padding: '12px 16px', fontWeight: '600', color: '#111', fontSize: '14px' }}>{product.name}</td>
                                            <td style={{ padding: '12px 16px' }}>
                                                <span style={{
                                                    padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '600',
                                                    backgroundColor: product.category === 'MEALS' ? '#dcfce7' : product.category === 'DRINKS' ? '#dbeafe' : '#fef3c7',
                                                    color: product.category === 'MEALS' ? '#166534' : product.category === 'DRINKS' ? '#1e40af' : '#92400e',
                                                }}>
                                                    {product.category}
                                                </span>
                                            </td>
                                            <td style={{ padding: '12px 16px', fontWeight: '600', color: '#111', fontSize: '14px' }}>₱{parseFloat(product.price).toFixed(2)}</td>
                                            <td style={{ padding: '12px 16px', fontSize: '13px', color: '#555' }}>{product.vendor}</td>
                                            <td style={{ padding: '12px 16px' }}>
                                                <span style={{
                                                    padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '600',
                                                    backgroundColor: product.in_stock ? '#dcfce7' : '#fee2e2',
                                                    color: product.in_stock ? '#166534' : '#991b1b',
                                                }}>
                                                    {product.in_stock ? 'Yes' : 'No'}
                                                </span>
                                            </td>
                                            <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                                                <button onClick={() => openEditModal(product)} style={{
                                                    background: '#eef2ff', border: 'none', borderRadius: '8px', padding: '8px',
                                                    cursor: 'pointer', marginRight: '8px',
                                                }}>
                                                    <Pencil size={16} color="#4a7cff" />
                                                </button>
                                                <button onClick={() => handleDelete(product.id)} style={{
                                                    background: '#fee2e2', border: 'none', borderRadius: '8px', padding: '8px', cursor: 'pointer',
                                                }}>
                                                    <Trash2 size={16} color="#dc2626" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}

            {/* ===== ORDERS TAB ===== */}
            {activeTab === 'Orders' && (
                <div style={{ padding: '0 32px' }}>
                    <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#111' }}>Orders</h2>
                    <p style={{ color: '#888' }}>Order management coming soon.</p>
                </div>
            )}

            {/* ===== USERS TAB ===== */}
            {activeTab === 'Users' && (
                <div style={{ padding: '0 32px' }}>
                    <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#111' }}>Users</h2>
                    <p style={{ color: '#888' }}>User management coming soon.</p>
                </div>
            )}

            {/* ===== ADD/EDIT PRODUCT MODAL ===== */}
            {showModal && (
                <div style={modalOverlayStyle} onClick={() => setShowModal(false)}>
                    <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                            <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#111', margin: 0 }}>
                                {editingProduct ? 'Edit Product' : 'Add New Product'}
                            </h2>
                            <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                                <X size={24} color="#888" />
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

                        <div style={{ display: 'flex', gap: '16px' }}>
                            <div style={{ ...inputGroupStyle, flex: 1 }}>
                                <label style={labelStyle}>Price *</label>
                                <input style={inputStyle} type="number" step="0.01" name="price" value={formData.price} onChange={handleChange} placeholder="0.00" />
                            </div>
                            <div style={{ ...inputGroupStyle, flex: 1 }}>
                                <label style={labelStyle}>Original Price</label>
                                <input style={inputStyle} type="number" step="0.01" name="original_price" value={formData.original_price} onChange={handleChange} placeholder="0.00" />
                            </div>
                        </div>

                        <div style={inputGroupStyle}>
                            <label style={labelStyle}>Image URL</label>
                            <input style={inputStyle} name="image" value={formData.image} onChange={handleChange} placeholder="https://..." />
                        </div>

                        <div style={{ display: 'flex', gap: '16px' }}>
                            <div style={{ ...inputGroupStyle, flex: 1 }}>
                                <label style={labelStyle}>Vendor</label>
                                <input style={inputStyle} name="vendor" value={formData.vendor} onChange={handleChange} placeholder="e.g. Burger House" />
                            </div>
                            <div style={{ ...inputGroupStyle, flex: 1 }}>
                                <label style={labelStyle}>Category *</label>
                                <select style={inputStyle} name="category" value={formData.category} onChange={handleChange}>
                                    <option value="MEALS">MEALS</option>
                                    <option value="DRINKS">DRINKS</option>
                                    <option value="SNACKS">SNACKS</option>
                                </select>
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '16px' }}>
                            <div style={{ ...inputGroupStyle, flex: 1 }}>
                                <label style={labelStyle}>Rating (0-5)</label>
                                <input style={inputStyle} type="number" step="0.1" min="0" max="5" name="rating" value={formData.rating} onChange={handleChange} placeholder="4.5" />
                            </div>
                            <div style={{ ...inputGroupStyle, flex: 1, display: 'flex', alignItems: 'center', gap: '8px', paddingTop: '20px' }}>
                                <input type="checkbox" name="in_stock" checked={formData.in_stock} onChange={handleChange} style={{ width: '18px', height: '18px' }} />
                                <label style={{ fontSize: '14px', fontWeight: '600', color: '#333' }}>In Stock</label>
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                            <button onClick={() => setShowModal(false)} style={{
                                flex: 1, padding: '12px', borderRadius: '10px', border: '1px solid #ddd',
                                background: '#fff', fontWeight: '600', fontSize: '14px', cursor: 'pointer', color: '#555',
                            }}>
                                Cancel
                            </button>
                            <button onClick={handleSave} style={{
                                flex: 1, padding: '12px', borderRadius: '10px', border: 'none',
                                background: '#4a7cff', color: '#fff', fontWeight: '700', fontSize: '14px', cursor: 'pointer',
                                boxShadow: '0 4px 14px rgba(74,124,255,0.3)',
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
