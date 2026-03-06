import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, UserCircle, Bug, Bell } from 'lucide-react';

const AdminDashboard = () => {
    const navigate = useNavigate();

    return (
        <div style={{ backgroundColor: '#fff', minHeight: '100vh', fontFamily: 'Inter, sans-serif' }}>
            {/* Header */}
            <header style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '24px 40px',
                backgroundColor: '#f1f1f1',
                margin: '16px',
                borderRadius: '16px'
            }}>
                <h1 style={{ fontSize: '28px', fontWeight: '800', color: '#000', margin: 0 }}>
                    Admin Dashboard
                    <div style={{ height: '4px', backgroundColor: '#0084ff', marginTop: '4px', width: '100%' }}></div>
                </h1>

                <div style={{ display: 'flex', gap: '16px' }}>
                    <button
                        onClick={() => navigate('/dashboard')}
                        style={{ background: '#111', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}
                    >
                        Customer View
                    </button>
                    <button
                        onClick={() => navigate('/login')}
                        style={{ background: '#0084ff', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}
                    >
                        Logout
                    </button>
                </div>
            </header>

            {/* Navigation Tabs */}
            <div style={{
                margin: '0 16px 32px 16px',
                padding: '12px 24px',
                backgroundColor: '#f1f1f1',
                borderRadius: '16px',
                display: 'flex',
                gap: '8px'
            }}>
                <button style={{
                    background: '#e8e6f9',
                    border: '1px solid #d1cbf3',
                    borderRadius: '24px',
                    padding: '8px 16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontWeight: '600',
                    fontSize: '14px',
                    color: '#4b3f8f',
                    cursor: 'pointer'
                }}>
                    <Check size={16} color="#4b3f8f" /> Dashboard
                </button>
                <button style={{ background: 'transparent', border: '1px solid #ccc', borderRadius: '24px', padding: '8px 16px', fontWeight: '500', fontSize: '14px', color: '#333', cursor: 'pointer' }}>Products</button>
                <button style={{ background: 'transparent', border: '1px solid #ccc', borderRadius: '24px', padding: '8px 16px', fontWeight: '500', fontSize: '14px', color: '#333', cursor: 'pointer' }}>Orders</button>
                <button style={{ background: 'transparent', border: '1px solid #ccc', borderRadius: '24px', padding: '8px 16px', fontWeight: '500', fontSize: '14px', color: '#333', cursor: 'pointer' }}>Users</button>
            </div>

            <div style={{ display: 'flex', padding: '0 32px', gap: '32px' }}>
                {/* Main Content Area */}
                <div style={{ flex: 1 }}>
                    <h2 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '24px', color: '#111' }}>Overview</h2>

                    {/* Stats Cards */}
                    <div style={{ display: 'flex', gap: '24px', marginBottom: '32px' }}>
                        <div style={{ flex: 1, backgroundColor: '#f0f3ff', borderRadius: '16px', padding: '24px' }}>
                            <div style={{ fontSize: '14px', color: '#555', marginBottom: '16px', fontWeight: '500' }}>Total Users</div>
                            <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px' }}>
                                <span style={{ fontSize: '32px', fontWeight: '800', color: '#111' }}>7,265</span>
                                <span style={{ fontSize: '13px', fontWeight: '600', color: '#333' }}>+11.01% ↗</span>
                            </div>
                        </div>
                        <div style={{ flex: 1, backgroundColor: '#eef5ff', borderRadius: '16px', padding: '24px' }}>
                            <div style={{ fontSize: '14px', color: '#555', marginBottom: '16px', fontWeight: '500' }}>Total Orders</div>
                            <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px' }}>
                                <span style={{ fontSize: '32px', fontWeight: '800', color: '#111' }}>3,671</span>
                                <span style={{ fontSize: '13px', fontWeight: '600', color: '#333' }}>-0.03% ↙</span>
                            </div>
                        </div>
                        <div style={{ flex: 1, backgroundColor: '#eef5ff', borderRadius: '16px', padding: '24px' }}>
                            <div style={{ fontSize: '14px', color: '#555', marginBottom: '16px', fontWeight: '500' }}>Total Revenue</div>
                            <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px' }}>
                                <span style={{ fontSize: '32px', fontWeight: '800', color: '#111' }}>2,318</span>
                                <span style={{ fontSize: '13px', fontWeight: '600', color: '#333' }}>+6.08% ↗</span>
                            </div>
                        </div>
                    </div>

                    {/* Charts Area */}
                    <div style={{ display: 'flex', gap: '24px' }}>
                        {/* Revenue Trend (Mock Line Chart) */}
                        <div style={{
                            flex: 2,
                            backgroundColor: '#ecdffd',
                            borderRadius: '16px',
                            padding: '32px',
                            minHeight: '400px',
                            position: 'relative'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '32px', marginBottom: '40px' }}>
                                <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#111', margin: 0 }}>Revenue Trend</h3>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '13px', color: '#555' }}>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#111' }}></div> This year</span>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#8bb4f7' }}></div> Last year</span>
                                </div>
                            </div>

                            {/* Mock line chart SVG */}
                            <svg width="100%" height="250" viewBox="0 0 600 250" preserveAspectRatio="none">
                                {/* Grid lines */}
                                <line x1="0" y1="50" x2="600" y2="50" stroke="#d5c8eb" strokeWidth="1" strokeDasharray="4" />
                                <line x1="0" y1="125" x2="600" y2="125" stroke="#d5c8eb" strokeWidth="1" strokeDasharray="4" />
                                <line x1="0" y1="200" x2="600" y2="200" stroke="#d5c8eb" strokeWidth="1" strokeDasharray="4" />

                                {/* Y-axis Labels */}
                                <text x="0" y="55" fontSize="12" fill="#888">30K</text>
                                <text x="0" y="130" fontSize="12" fill="#888">20K</text>
                                <text x="0" y="205" fontSize="12" fill="#888">10K</text>
                                <text x="0" y="245" fontSize="12" fill="#888">0</text>

                                {/* X-axis Labels */}
                                <text x="60" y="245" fontSize="12" fill="#888">Jan</text>
                                <text x="140" y="245" fontSize="12" fill="#888">Feb</text>
                                <text x="220" y="245" fontSize="12" fill="#888">Mar</text>
                                <text x="300" y="245" fontSize="12" fill="#888">Apr</text>
                                <text x="380" y="245" fontSize="12" fill="#888">May</text>
                                <text x="460" y="245" fontSize="12" fill="#888">Jun</text>
                                <text x="540" y="245" fontSize="12" fill="#888">Jul</text>

                                {/* This year line */}
                                <path d="M 50 180 Q 80 140 100 190 T 180 180 T 260 180 T 320 100 T 380 80 T 440 130 T 500 130 T 580 100" fill="none" stroke="#222" strokeWidth="2" />

                                {/* Last year line */}
                                <path d="M 50 220 Q 80 180 100 210 T 180 210 T 260 140 T 320 220 T 380 220 T 440 160 T 500 150 T 580 120" fill="none" stroke="#8bb4f7" strokeWidth="2" strokeDasharray="4" />
                            </svg>
                        </div>

                        {/* Right Column for smaller charts */}
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '24px' }}>
                            {/* Manage Orders (Bar Chart) */}
                            <div style={{ backgroundColor: '#e8dcff', borderRadius: '16px', padding: '24px', flex: 1 }}>
                                <h3 style={{ fontSize: '14px', fontWeight: '700', color: '#111', marginBottom: '24px' }}>Manage Orders</h3>
                                <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: '140px', paddingBottom: '20px', borderBottom: '1px solid #d5c8eb', position: 'relative' }}>
                                    <div style={{ position: 'absolute', left: 0, bottom: '20px', fontSize: '10px', color: '#888' }}>0</div>
                                    <div style={{ position: 'absolute', left: 0, bottom: '70px', fontSize: '10px', color: '#888' }}>10K</div>
                                    <div style={{ position: 'absolute', left: 0, bottom: '110px', fontSize: '10px', color: '#888' }}>20K</div>
                                    <div style={{ position: 'absolute', left: 0, bottom: '150px', fontSize: '10px', color: '#888' }}>30K</div>

                                    <div style={{ width: '20px', height: '60%', background: '#93c5fd', borderRadius: '4px 4px 0 0', marginLeft: '30px' }}></div>
                                    <div style={{ width: '20px', height: '80%', background: '#6ee7b7', borderRadius: '4px 4px 0 0' }}></div>
                                    <div style={{ width: '20px', height: '70%', background: '#111', borderRadius: '4px 4px 0 0' }}></div>
                                    <div style={{ width: '20px', height: '85%', background: '#60a5fa', borderRadius: '4px 4px 0 0' }}></div>
                                    <div style={{ width: '20px', height: '50%', background: '#a78bfa', borderRadius: '4px 4px 0 0' }}></div>
                                    <div style={{ width: '20px', height: '75%', background: '#4ade80', borderRadius: '4px 4px 0 0' }}></div>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '12px', paddingLeft: '30px', fontSize: '10px', color: '#888' }}>
                                    <span>Tire 1</span><span>Tire 2</span><span>Tire 3</span><span>Tire 4</span><span>Tire 5</span><span>Tire 6</span>
                                </div>
                            </div>

                            {/* Inventory by Category (Donut Chart) */}
                            <div style={{ backgroundColor: '#e8dcff', borderRadius: '16px', padding: '24px', flex: 1 }}>
                                <h3 style={{ fontSize: '14px', fontWeight: '700', color: '#111', marginBottom: '16px' }}>Inventory by Category</h3>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                                    {/* Mock Donut Chart via CSS */}
                                    <div style={{
                                        width: '100px',
                                        height: '100px',
                                        borderRadius: '50%',
                                        background: 'conic-gradient(#111 0% 52%, #a78bfa 52% 75%, #4ade80 75% 89%, #93c5fd 89% 100%)',
                                        position: 'relative',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
                                        <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: '#e8dcff' }}></div>
                                    </div>

                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px', flex: 1 }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#111' }}></div> United States</span>
                                            <span style={{ fontWeight: '600' }}>52.1%</span>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#93c5fd' }}></div> Canada</span>
                                            <span style={{ fontWeight: '600' }}>22.8%</span>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#4ade80' }}></div> Mexico</span>
                                            <span style={{ fontWeight: '600' }}>13.9%</span>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#a78bfa' }}></div> Other</span>
                                            <span style={{ fontWeight: '600' }}>11.2%</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
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
                                <div style={{ fontSize: '13px', fontWeight: '600', color: '#111', marginBottom: '2px' }}>You fixed a bug.</div>
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
                                <Bug size={16} color="#666" />
                            </div>
                            <div>
                                <div style={{ fontSize: '13px', fontWeight: '600', color: '#111', marginBottom: '2px' }}>You fixed a bug.</div>
                                <div style={{ fontSize: '11px', color: '#888' }}>12 hours ago</div>
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '12px' }}>
                            <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Bell size={16} color="#666" />
                            </div>
                            <div>
                                <div style={{ fontSize: '13px', fontWeight: '600', color: '#111', marginBottom: '2px' }}>Andi Lane subscribed to you.</div>
                                <div style={{ fontSize: '11px', color: '#888' }}>Today, 11:59 AM</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
