import React from 'react';

const Footer = () => {
    return (
        <React.Fragment>
            {/* Blue Divider */}
            <div style={{
                width: '100%',
                height: '8px',
                backgroundColor: '#0084ff'
            }}></div>

            {/* Footer Blue Section */}
            <footer style={{
                width: '100%',
                padding: '24px 0',
                backgroundColor: '#0084ff',
                marginTop: 'auto',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                flexDirection: 'column',
                gap: '10px'
            }}>
                <div style={{ fontSize: '18px', fontWeight: '900', letterSpacing: '1px' }}>SWIFTSERVE</div>
                <div style={{ fontSize: '12px', opacity: 0.8 }}>© {new Date().getFullYear()} All Rights Reserved.</div>
            </footer>
        </React.Fragment>
    );
};

export default Footer;
