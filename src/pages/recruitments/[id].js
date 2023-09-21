import useSWR from "swr";
import Head from "next/head";
import axios from "@/lib/axios";

import FooterTabBar from "@/components/FooterTabBar";

import { useRouter } from 'next/router';



import { useState, useEffect } from 'react'

import styles from '@/styles/recruitmentList.module.css'


import Layout from '@/components/Layouts/Layout'
import CommentModal from '@/components/Recruitments/CommentModal'
import Recruitment from '@/components/Recruitments/Recruitment'
import Header from "@/components/Header";



const RecruitmentShow = () => {

    // useRouterフックを使用してルーターオブジェクトを取得
    const router = useRouter();
    const { id } = router.query;  // パスからidを取得


    // ユーザーが入力する新しいコメントを管理するためのstate
    const [newComment, setNewComment] = useState("");
    // 追加：モーダルの表示状態を管理するためのstate
    const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
    const [selectedRecruitment, setSelectedRecruitment] = useState(null);

    const fetcher = url => axios.get(url).then(res => res.data).catch(error => {
        throw error.response.data;
    });

    const { data: userData, error: userError } = useSWR('/api/me', fetcher);
    const { data: recruitment, error: recruitmentError, mutate } = useSWR(`/api/recruitments/${id}`, fetcher);

    if (userError) console.error('ユーザーデータの取得に失敗しました。:', userError);
    if (recruitmentError) return <div>データの読み込みに失敗しました</div>
    if (!recruitment) return <div>ロード中...</div>



    console.log(recruitment)
    console.log('selectedRecruitment', selectedRecruitment)


    return (
        <Layout>
            <Header />
            <Head>
                <title>Recruitments Page</title>
            </Head>
            {/* ヘッダー分の余白（仮） */}
            <div className='mt-16'></div>
            <div className={styles.container}>

                <Recruitment
                    recruitment={recruitment}
                    userData={userData}
                    isCommentModalOpen={isCommentModalOpen}
                    setIsCommentModalOpen={setIsCommentModalOpen}
                    // selectedRecruitment={selectedRecruitment}
                    selectedRecruitment={selectedRecruitment}
                    setSelectedRecruitment={setSelectedRecruitment}
                />
            </div>
            {/* フッター分の余白（仮） */}
            <div className='mb-16'></div>
            <FooterTabBar user={userData} />

            {/* コメントモーダル */}
            <CommentModal
                isCommentModalOpen={isCommentModalOpen}
                setIsCommentModalOpen={setIsCommentModalOpen}
                // selectedRecruitment={selectedRecruitment}
                selectedRecruitment={recruitment}
                setSelectedRecruitment={setSelectedRecruitment}
                newComment={newComment}
                setNewComment={setNewComment}
                userData={userData}
                mutate={mutate}
            />
        </ Layout >
    )
}

export default RecruitmentShow