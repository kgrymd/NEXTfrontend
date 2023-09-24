import Head from 'next/head';
import useSWR from 'swr';
import AppLayout from '@/components/Layouts/AppLayout';
import FooterTabBar from '@/components/FooterTabBar';
import axios from '@/lib/axios';
import RecruitmentTitleList from '@/components/Recruitments/RecruitmentTitleList';

function likedRecruitmentList() {

    const fetcher = url => axios.get(url).then(res => res.data).catch(error => {
        throw error.response.data;
    });

    const { data: recruitments, error: recruitmentsError } = useSWR('/api/my/likedRecruitments', fetcher);
    const { data: userData, error: userError } = useSWR('/api/me', fetcher);

    if (recruitmentsError || userError) console.error("Error fetching the data:", recruitmentsError || userError);


    return (
        <AppLayout
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    お気に入りした募集一覧
                </h2>
            }
        >
            <Head>
                <title>Liked recruitments</title>
            </Head>

            <RecruitmentTitleList recruitments={recruitments} link={'/recruitments/'} />

            <FooterTabBar user={userData} />
        </AppLayout>
    );
}


export default likedRecruitmentList;
