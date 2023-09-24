import { useState } from 'react'
import Head from 'next/head'
import useSWR from 'swr'

import styles from '@/styles/recruitmentList.module.css'

import axios from '@/lib/axios'

import Layout from '@/components/Layouts/Layout'
import FooterTabBar from '@/components/FooterTabBar'
import CommentModal from '@/components/Recruitments/CommentModal'
import Recruitment from '@/components/Recruitments/Recruitment'

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Link from 'next/link'



export default function RecruitmentList() {

    // おすすめと新着どちらで表示するかのstate
    const [rule, setRule] = useState(true)
    // ユーザーが入力する新しいコメントを管理するためのstate
    const [newComment, setNewComment] = useState("");
    // モーダルの表示状態を管理するためのstate
    const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
    const [selectedRecruitment, setSelectedRecruitment] = useState(null);


    const fetcher = url => axios.get(url).then(res => res.data).catch(error => {
        throw error.response.data;
    });

    const { data: userData, error: userError } = useSWR('/api/me', fetcher);

    const endpoint = rule ? '/api/recruitments/suggestions/suggest' : '/api/recruitments';
    const { data: recruitments, error: recruitmentsError, mutate } = useSWR(endpoint, fetcher);


    if (userError) console.error('ユーザーデータの取得に失敗しました。:', userError);
    if (recruitmentsError) return <div>データの読み込みに失敗しました</div>
    if (!recruitments) return <div>ロード中...</div>


    console.log(recruitments);


    return (
        <Layout>
            <Head>
                <title>Recruitments Page</title>
            </Head>
            {/* ヘッダー分の余白（仮） */}
            <div className='mt-10'></div>
            <div className={styles.container}>
                <div className={styles.header}>
                    <button
                        disabled={rule ? true : false}
                        onClick={() => setRule(true)}>
                        おすすめ
                    </button>
                    <button
                        disabled={rule ? false : true}
                        onClick={() => setRule(false)}>
                        新着
                    </button>
                </div>
                <Link href={'/search'}>
                    <div className={styles.search}>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="green"
                            className="w-12 h-12"
                        >
                            <path fillRule="evenodd" d="M10.5 3.75a6.75 6.75 0 100 13.5 6.75 6.75 0 000-13.5zM2.25 10.5a8.25 8.25 0 1114.59 5.28l4.69 4.69a.75.75 0 11-1.06 1.06l-4.69-4.69A8.25 8.25 0 012.25 10.5z" clipRule="evenodd" />
                        </svg>
                    </div>
                </Link>

                {recruitments.map((recruitment) => (
                    <Recruitment
                        key={recruitment.id}
                        userData={userData}
                        recruitment={recruitment}
                        isCommentModalOpen={isCommentModalOpen}
                        setIsCommentModalOpen={setIsCommentModalOpen}
                        selectedRecruitment={selectedRecruitment}
                        setSelectedRecruitment={setSelectedRecruitment}
                        toast={toast}
                        mutate={mutate}
                    />
                ))
                }
            </div>
            {/* フッター分の余白（仮） */}
            <div className='mb-16'></div>
            <FooterTabBar user={userData} />

            {/* コメントモーダル */}
            <CommentModal
                isCommentModalOpen={isCommentModalOpen}
                setIsCommentModalOpen={setIsCommentModalOpen}
                selectedRecruitment={selectedRecruitment}
                setSelectedRecruitment={setSelectedRecruitment}
                newComment={newComment}
                setNewComment={setNewComment}
                userData={userData}
                mutate={mutate}
            />
            <ToastContainer />
        </ Layout >

    );
}