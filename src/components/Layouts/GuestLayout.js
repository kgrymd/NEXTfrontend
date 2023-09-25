import Head from 'next/head'

const GuestLayout = ({ children }) => {
    return (
        <div>
            <Head>
                <title>NEXT(New Experience Together)</title>
            </Head>

            <div className="font-sans text-gray-900 antialiased">
                {children}
            </div>
        </div>
    )
}

export default GuestLayout
