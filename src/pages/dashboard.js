import FooterTabBar from '@/components/FooterTabBar'
import AppLayout from '@/components/Layouts/AppLayout'
import Head from 'next/head'
import useSWR from "swr";

const Dashboard = () => {
    const { data: userData, error, mutate } = useSWR('/api/me', () =>
        axios
            .get('/api/me')
            .then(res => res.data)
            .catch(error => {
                if (error.response.status !== 409) throw error

                router.push('/verify-email')
            }),
    );
    return (
        <AppLayout
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Dashboard
                </h2>
            }
        >
            <Head>
                <title>NEXT - Dashboard</title>
            </Head>

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            You're logged in! Yeah!!!
                        </div>
                        <div className="p-6 bg-white border-b border-gray-200">
                            Profile page is ready! Yeah!!!
                        </div>
                        <div className="p-6 bg-white border-b border-gray-200">
                            Recruitment page being implemented...
                        </div>
                    </div>
                </div>
            </div>
            <FooterTabBar user={userData} />
        </AppLayout>
    )
}

export default Dashboard
