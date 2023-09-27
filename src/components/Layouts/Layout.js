import React from 'react'

const Layout = ({ children, bgc = 'rgba(243, 244, 246, 1)' }) => {
    return (
        // <div className="min-h-screen bg-gray-100 h-full">
        <div style={{
            minHeight: '100vh',
            // backgroundColor: '#c9cad4',
            backgroundColor: bgc,
            height: '100%'
        }}>
            {/* Page Content */}
            <main> {children}</main >
        </div >
    )
}

export default Layout
