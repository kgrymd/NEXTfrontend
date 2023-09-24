import Link from 'next/link';
import Head from 'next/head';
import useSWR from 'swr';

import AppLayout from '@/components/Layouts/AppLayout';
import FooterTabBar from '@/components/FooterTabBar';

import axios from '@/lib/axios';

function JoinedRecruitmentList() {

    const fetcher = url => axios.get(url).then(res => res.data).catch(error => {
        throw error.response.data;
    });


    const { data: recruitments, error: recruitmentsError } = useSWR('/api/my/participations', fetcher);
    const { data: userData, error: userError } = useSWR('/api/me', fetcher);

    if (recruitmentsError || userError) console.error("Error fetching the data:", recruitmentsError || userError);


    return (
        <AppLayout
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    参加した募集一覧
                </h2>
            }
        >
            <Head>
                <title>MyRecruitments</title>
            </Head>
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 mt-8">

                    <ul>
                        {recruitments && recruitments.map((recruitment) => (
                            recruitment.is_approved === 1 ?
                                <div key={recruitment.recruitment_id} className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                                    {/* ダイナミックルートへのリンクを設定 */}
                                    <Link href={`/recruitments/${recruitment.recruitment_id}`}>
                                        <li key={recruitment.recruitment_id} className="p-6 bg-white border-b border-gray-200">
                                            {recruitment.recruitment_title}
                                        </li>
                                    </Link>
                                </div>
                                : null
                        ))}
                    </ul>
                </div>
            </div>
            <FooterTabBar user={userData} />
        </AppLayout>
    );
}


export default JoinedRecruitmentList;
