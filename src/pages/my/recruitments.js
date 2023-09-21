// pages/recruitments.js

import Link from 'next/link';
import axios from '@/lib/axios';
import { useState, useEffect } from 'react';
// import { useAuth } from '@/hooks/auth';
import useSWR from 'swr';
import AppLayout from '@/components/Layouts/AppLayout';
import FooterTabBar from '@/components/FooterTabBar';
import Head from 'next/head';

function MyRecruitmentList() {
    const [recruitments, setRecruitments] = useState([]);
    // const { user } = useAuth({ middleware: 'auth' });

    const fetcher = url => axios.get(url).then(res => res.data).catch(error => {
        throw error.response.data;
    });

    const { data: userData, error: userError } = useSWR('/api/me', fetcher);

    useEffect(() => {
        // APIからユーザーが参加している募集一覧を取得
        async function fetchRecruitments() {
            try {
                const response = await axios.get('/api/my/participations');
                setRecruitments(response.data);
            } catch (error) {
                console.error("Error fetching the recruitments data:", error);
            }
        }

        fetchRecruitments();
    }, []);

    return (
        <AppLayout
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    参加済みの募集一覧
                </h2>
            }
        >
            <Head>
                <title>MyRecruitments</title>
            </Head>
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">

                    <ul>
                        {recruitments.map((recruitment) => (
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


export default MyRecruitmentList;
