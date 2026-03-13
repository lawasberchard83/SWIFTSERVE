import React, { useState } from 'react';
import { X, Star, Minus, Plus } from 'lucide-react';

const ProductModal = ({ isOpen, onClose, product, onAddToCart }) => {
    const [quantity, setQuantity] = useState(1);

    if (!isOpen || !product) return null;

    const handleBackdropClick = (e) => {
        if (e.target.classList.contains('modal-backdrop')) {
            onClose();
        }
    };

    const handleIncrement = () => {
        if (quantity < (product.stock_quantity || 1)) {
            setQuantity(prev => prev + 1);
        }
    };

    const handleDecrement = () => {
        if (quantity > 1) {
            setQuantity(prev => prev - 1);
        }
    };

    const handleAddToCart = () => {
        onAddToCart({ ...product, quantity });
        onClose();
    };

    const totalPrice = (product.price * quantity).toFixed(2);

    return (
        <div
            className="modal-backdrop"
            onClick={handleBackdropClick}
            style={{
                position: 'fixed',
                top: 0, left: 0, right: 0, bottom: 0,
                backgroundColor: 'rgba(0,0,0,0.5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1000,
                padding: '20px'
            }}
        >
            <div
                className="modal-content"
                style={{
                    background: '#fff',
                    borderRadius: '16px',
                    width: '100%',
                    maxWidth: '480px',
                    overflow: 'hidden',
                    position: 'relative',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
                }}
            >
                {/* Close button */}
                <button
                    onClick={onClose}
                    style={{
                        position: 'absolute',
                        top: '16px',
                        right: '16px',
                        background: 'rgba(255,255,255,0.8)',
                        border: 'none',
                        borderRadius: '50%',
                        width: '32px',
                        height: '32px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        zIndex: 10,
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                    }}
                >
                    <X size={20} color="#333" />
                </button>

                {/* Product Image */}
                <div
                    style={{
                        height: '240px',
                        backgroundColor: '#f5f5f5',
                        backgroundImage: `url(${product.image || 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                    }}
                ></div>

                {/* Product Details */}
                <div style={{ padding: '24px' }}>
                    <div style={{ color: '#0084ff', fontSize: '13px', fontWeight: '600', marginBottom: '8px' }}>
                        {product.vendor || 'Campus Vendor'}
                    </div>

                    <h2 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '8px', color: '#111' }}>
                        {product.name}
                    </h2>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '16px' }}>
                        <Star size={16} color="#FFC107" fill="#FFC107" />
                        <span style={{ fontSize: '14px', fontWeight: '500', color: '#555' }}>
                            {product.rating || '4.6'} rating
                        </span>
                    </div>

                    <p style={{ fontSize: '14px', color: '#666', lineHeight: '1.5', marginBottom: '24px' }}>
                        {product.description || 'A refreshing blend of strawberries, banana, and yogurt. Perfect pick-me-up between classes.'}
                    </p>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
                        <div style={{ fontSize: '24px', fontWeight: '800', color: '#111' }}>
                            ${product.price.toFixed(2)}
                        </div>

                        {/* Quantity Selector */}
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            border: '1px solid #e0e0e0',
                            borderRadius: '24px',
                            padding: '4px'
                        }}>
                            <button
                                onClick={handleDecrement}
                                style={{
                                    border: 'none',
                                    background: 'transparent',
                                    width: '32px',
                                    height: '32px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    cursor: 'pointer',
                                    color: quantity > 1 ? '#333' : '#ccc'
                                }}
                            >
                                <Minus size={16} />
                            </button>
                            <span style={{ fontSize: '15px', fontWeight: '600', width: '24px', textAlign: 'center' }}>
                                {quantity}
                            </span>
                            <button
                                onClick={handleIncrement}
                                style={{
                                    border: 'none',
                                    background: 'transparent',
                                    width: '32px',
                                    height: '32px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    cursor: quantity >= (product.stock_quantity || 1) ? 'not-allowed' : 'pointer',
                                    color: quantity >= (product.stock_quantity || 1) ? '#ccc' : '#333'
                                }}
                                disabled={quantity >= (product.stock_quantity || 1)}
                            >
                                <Plus size={16} />
                            </button>
                        </div>
                    </div>

                    <button
                        onClick={handleAddToCart}
                        className="btn btn-primary w-full"
                        style={{ padding: '16px', fontSize: '16px', fontWeight: '700' }}
                    >
                        Add to Cart — ${totalPrice}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductModal;
