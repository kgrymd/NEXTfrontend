import Navigation from '@/components/Layouts/Navigation'
import { useAuth } from '@/hooks/auth'

const AppLayout = ({ header, children }) => {
    const { user } = useAuth({ middleware: 'auth' })

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="fixed top-0 left-0 right-0 z-10">
                <Navigation user={user} />
            </div>

            {/* Page Heading */}
            {/* headerがpropsに渡されたら表示。いらないpageはpropsで渡されないので表示しない。 */}
            {header &&
                <header className="bg-white shadow mt-16 fixed top-0 left-0 right-0 z-5">
                    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                        {header}
                    </div>
                </header>
            }

            {/* Page Content */}
            <main className='mt-16'>{children}</main>
        </div>
    )
}

export default AppLayout
