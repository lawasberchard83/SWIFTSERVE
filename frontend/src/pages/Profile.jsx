import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NavigationBar from '../components/NavigationBar';

const Profile = () => {
    const navigate = useNavigate();
    
    // In a real app, this would be fetched from an API
    const [user, setUser] = useState({
        firstName: 'james',
        lastName: 'gab',
        email: 'lawasberchard83@gmail.com',
        phone: '09190000000',
        address: 'cebu city',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80'
    });

    const [isEditingPersonal, setIsEditingPersonal] = useState(false);
    const [isEditingContact, setIsEditingContact] = useState(false);
    
    // For handling form changes during edit
    const [editData, setEditData] = useState({ ...user });

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // In a real app, you would upload this file to a server
            // For now, we'll create a local object URL to preview it immediately
            const imageUrl = URL.createObjectURL(file);
            const updatedUser = { ...user, avatar: imageUrl };
            setUser(updatedUser);
            setEditData(updatedUser);
        }
    };

    const handleSavePersonal = () => {
        setUser({ ...user, firstName: editData.firstName, lastName: editData.lastName });
        setIsEditingPersonal(false);
    };

    const handleSaveContact = () => {
        setUser({ ...user, phone: editData.phone, address: editData.address });
        setIsEditingContact(false);
    };

    // Check if user is authenticated
    useEffect(() => {
        const isAuth = localStorage.getItem('isAuthenticated');
        if (!isAuth) {
            navigate('/login');
        }
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('isAuthenticated');
        // Clear any other user data here
        navigate('/');
    };

    return (
        <div className="profile-page min-h-screen bg-gradient-to-br from-sky-50 to-blue-100">
            <NavigationBar />
            
            <div className="profile-container max-w-5xl mx-auto mt-10 p-6 bg-white/95 backdrop-blur-sm rounded-xl shadow-xl border border-white/50 relative z-10">
                <div className="profile-header flex items-center justify-between border-b pb-6 mb-8">
                    <div className="flex items-center gap-6">
                        <div className="avatar-wrapper relative group">
                            <img 
                                src={user.avatar} 
                                alt="User Avatar" 
                                className="w-32 h-32 rounded-full object-cover border-4 border-sky-100 shadow-md transition duration-300 group-hover:opacity-80"
                            />
                            <label className="absolute bottom-0 right-0 bg-sky-500 rounded-full p-2 cursor-pointer shadow-lg hover:bg-sky-600 transition" title="Change Avatar">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                </svg>
                                <input 
                                    type="file" 
                                    className="hidden" 
                                    accept="image/*"
                                    onChange={handleAvatarChange}
                                />
                            </label>
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-800">{user.firstName.toUpperCase()} {user.lastName.toUpperCase()}</h1>
                            <p className="text-gray-500 mt-1">{user.email}</p>
                            <span className="inline-block mt-2 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold">Active Member</span>
                        </div>
                    </div>
                    <div>
                        <button 
                            onClick={handleLogout}
                            className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-6 rounded-lg shadow transition duration-200 flex items-center gap-2"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
                            </svg>
                            Log Out
                        </button>
                    </div>
                </div>

                <div className="profile-details grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="detail-group bg-gray-50 p-6 rounded-lg border border-sky-100 shadow-sm transition hover:shadow-md">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold text-gray-800 border-b-2 border-sky-500 pb-1 inline-block">Personal Information</h2>
                            {isEditingPersonal ? (
                                <button onClick={handleSavePersonal} className="bg-sky-500 hover:bg-sky-600 text-white font-medium text-sm py-1 px-4 rounded transition">Save</button>
                            ) : (
                                <button onClick={() => setIsEditingPersonal(true)} className="text-sky-500 hover:text-sky-700 font-medium text-sm transition">Edit</button>
                            )}
                        </div>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-500 mb-1">First Name</label>
                                <input 
                                    type="text" 
                                    readOnly={!isEditingPersonal} 
                                    value={isEditingPersonal ? editData.firstName : user.firstName} 
                                    onChange={(e) => setEditData({...editData, firstName: e.target.value})}
                                    className={`w-full border rounded-md py-2 px-3 text-gray-700 focus:outline-none transition ${isEditingPersonal ? 'bg-white border-sky-300 focus:border-sky-500 focus:ring-1 focus:ring-sky-500' : 'bg-gray-50 border-gray-200'}`} 
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-500 mb-1">Last Name</label>
                                <input 
                                    type="text" 
                                    readOnly={!isEditingPersonal} 
                                    value={isEditingPersonal ? editData.lastName : user.lastName} 
                                    onChange={(e) => setEditData({...editData, lastName: e.target.value})}
                                    className={`w-full border rounded-md py-2 px-3 text-gray-700 focus:outline-none transition ${isEditingPersonal ? 'bg-white border-sky-300 focus:border-sky-500 focus:ring-1 focus:ring-sky-500' : 'bg-gray-50 border-gray-200'}`} 
                                />
                            </div>
                        </div>
                    </div>

                    <div className="detail-group bg-gray-50 p-6 rounded-lg border border-sky-100 shadow-sm transition hover:shadow-md">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold text-gray-800 border-b-2 border-sky-500 pb-1 inline-block">Contact Details</h2>
                            {isEditingContact ? (
                                <button onClick={handleSaveContact} className="bg-sky-500 hover:bg-sky-600 text-white font-medium text-sm py-1 px-4 rounded transition">Save</button>
                            ) : (
                                <button onClick={() => setIsEditingContact(true)} className="text-sky-500 hover:text-sky-700 font-medium text-sm transition">Edit</button>
                            )}
                        </div>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-500 mb-1">Phone Number</label>
                                <input 
                                    type="text" 
                                    readOnly={!isEditingContact} 
                                    value={isEditingContact ? editData.phone : user.phone} 
                                    onChange={(e) => setEditData({...editData, phone: e.target.value})}
                                    className={`w-full border rounded-md py-2 px-3 text-gray-700 focus:outline-none transition ${isEditingContact ? 'bg-white border-sky-300 focus:border-sky-500 focus:ring-1 focus:ring-sky-500' : 'bg-gray-50 border-gray-200'}`} 
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-500 mb-1">Address</label>
                                <input 
                                    type="text" 
                                    readOnly={!isEditingContact} 
                                    value={isEditingContact ? editData.address : user.address} 
                                    onChange={(e) => setEditData({...editData, address: e.target.value})}
                                    className={`w-full border rounded-md py-2 px-3 text-gray-700 focus:outline-none transition ${isEditingContact ? 'bg-white border-sky-300 focus:border-sky-500 focus:ring-1 focus:ring-sky-500' : 'bg-gray-50 border-gray-200'}`} 
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Inline styles for Tailwind-like classes if Tailwind isn't installed. Since project has generic CSS, let's inject a quick style tag to ensure it looks beautiful even without Tailwind */}
            <style dangerouslySetInnerHTML={{__html: `
                .bg-gradient-to-br { background-image: linear-gradient(to bottom right, var(--tw-gradient-stops)); }
                .from-sky-50 { --tw-gradient-from: #f0f9ff var(--tw-gradient-from-position); --tw-gradient-to: rgb(240 249 255 / 0) var(--tw-gradient-to-position); --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to); }
                .to-blue-100 { --tw-gradient-to: #dbeafe var(--tw-gradient-to-position); }
                .bg-gray-50 { background-color: #f9fafb; }
                .min-h-screen { min-height: 100vh; }
                .max-w-5xl { max-width: 64rem; }
                .mx-auto { margin-left: auto; margin-right: auto; }
                .mt-10 { margin-top: 2.5rem; }
                .p-6 { padding: 1.5rem; }
                .bg-white { background-color: #ffffff; }
                .bg-white\\/95 { background-color: rgb(255 255 255 / 0.95); }
                .backdrop-blur-sm { backdrop-filter: blur(4px); }
                .border-white\\/50 { border-color: rgb(255 255 255 / 0.5); }
                .z-10 { z-index: 10; }
                .rounded-xl { border-radius: 0.75rem; }
                .shadow-lg { box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05); }
                .shadow-xl { box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04); }
                .flex { display: flex; }
                .items-center { align-items: center; }
                .justify-between { justify-content: space-between; }
                .border-b { border-bottom-width: 1px; }
                .pb-6 { padding-bottom: 1.5rem; }
                .mb-8 { margin-bottom: 2rem; }
                .gap-6 { gap: 1.5rem; }
                .relative { position: relative; }
                .w-32 { width: 8rem; }
                .h-32 { height: 8rem; }
                .rounded-full { border-radius: 9999px; }
                .object-cover { object-fit: cover; }
                .border-4 { border-width: 4px; }
                .border-sky-100 { border-color: #e0f2fe; }
                .shadow-md { box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); }
                .absolute { position: absolute; }
                .bottom-0 { bottom: 0; }
                .right-0 { right: 0; }
                .bg-sky-500 { background-color: #0ea5e9; }
                .bg-sky-600 { background-color: #0284c7; }
                .p-2 { padding: 0.5rem; }
                .cursor-pointer { cursor: pointer; }
                .hover\\:bg-sky-600:hover { background-color: #0284c7; }
                .transition { transition-property: all; transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1); transition-duration: 300ms; }
                .hidden { display: none; }
                .group:hover .group-hover\\:opacity-80 { opacity: 0.8; }
                .shadow-sm { box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05); }
                .hover\\:shadow-md:hover { box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); }
                .px-4 { padding-left: 1rem; padding-right: 1rem; }
                .rounded { border-radius: 0.25rem; }
                .text-white { color: #ffffff; }
                .h-5 { height: 1.25rem; }
                .w-5 { width: 1.25rem; }
                .text-3xl { font-size: 1.875rem; line-height: 2.25rem; }
                .font-bold { font-weight: 700; }
                .text-gray-800 { color: #1f2937; }
                .text-gray-500 { color: #6b7280; }
                .mt-1 { margin-top: 0.25rem; }
                .inline-block { display: inline-block; }
                .mt-2 { margin-top: 0.5rem; }
                .px-3 { padding-left: 0.75rem; padding-right: 0.75rem; }
                .py-1 { padding-top: 0.25rem; padding-bottom: 0.25rem; }
                .bg-green-100 { background-color: #d1fae5; }
                .text-green-800 { color: #065f46; }
                .text-sm { font-size: 0.875rem; line-height: 1.25rem; }
                .font-semibold { font-weight: 600; }
                .bg-red-500 { background-color: #ef4444; }
                .hover\\:bg-red-600:hover { background-color: #dc2626; }
                .py-2 { padding-top: 0.5rem; padding-bottom: 0.5rem; }
                .px-6 { padding-left: 1.5rem; padding-right: 1.5rem; }
                .rounded-lg { border-radius: 0.5rem; }
                .shadow { box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06); }
                .duration-200 { transition-duration: 200ms; }
                .gap-2 { gap: 0.5rem; }
                .grid { display: grid; }
                .grid-cols-1 { grid-template-columns: repeat(1, minmax(0, 1fr)); }
                @media (min-width: 768px) { .md\\:grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
                .gap-8 { gap: 2rem; }
                .border-gray-100 { border-color: #f3f4f6; }
                .mb-4 { margin-bottom: 1rem; }
                .text-xl { font-size: 1.25rem; line-height: 1.75rem; }
                .border-sky-500 { border-color: #0ea5e9; }
                .text-sky-500 { color: #0ea5e9; }
                .hover\\:text-sky-700:hover { color: #0369a1; }
                .font-medium { font-weight: 500; }
                .space-y-4 > :not([hidden]) ~ :not([hidden]) { margin-top: 1rem; }
                .block { display: block; }
                .mb-1 { margin-bottom: 0.25rem; }
                .w-full { width: 100%; }
                .border { border-width: 1px; }
                .border-gray-200 { border-color: #e5e7eb; }
                .border-sky-300 { border-color: #7dd3fc; }
                .focus\\:border-sky-500:focus { border-color: #0ea5e9; }
                .focus\\:ring-1:focus { box-shadow: var(--tw-ring-inset) 0 0 0 calc(1px + var(--tw-ring-offset-width)) var(--tw-ring-color); }
                .focus\\:ring-sky-500:focus { --tw-ring-color: #0ea5e9; }
                .rounded-md { border-radius: 0.375rem; }
                .py-2 { padding-top: 0.5rem; padding-bottom: 0.5rem; }
                .px-3 { padding-left: 0.75rem; padding-right: 0.75rem; }
                .text-gray-700 { color: #374151; }
                .focus\\:outline-none:focus { outline: 2px solid transparent; outline-offset: 2px; }
            `}} />
        </div>
    );
};

export default Profile;
