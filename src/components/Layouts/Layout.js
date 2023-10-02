import React from 'react'

const Layout = ({ children, bgc = 'rgba(243, 244, 246, 1)' }) => {
    return (
        <div style={{
            minHeight: '100vh',
            backgroundColor: bgc,
            height: '100%'
        }}>
            {/* Page Content */}
            <main> {children}</main >
        </div >
    )
}

export default Layout
