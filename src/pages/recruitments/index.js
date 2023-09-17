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



export default function RecruitmentList() {

    // おすすめと新着どちらで表示するかのstate
    const [rule, setRule] = useState(false)
    // ユーザーが入力する新しいコメントを管理するためのstate
    const [newComment, setNewComment] = useState("");
    // 追加：モーダルの表示状態を管理するためのstate
    const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
    const [selectedRecruitment, setSelectedRecruitment] = useState(null);


    const fetcher = url => axios.get(url).then(res => res.data).catch(error => {
        throw error.response.data;
    });

    const { data: userData, error: userError } = useSWR('/api/me', fetcher);
    const { data: recruitments, error: recruitmentsError } = useSWR('/api/recruitments', fetcher);

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

                {recruitments.map((recruitment) => (
                    <Recruitment
                        userData={userData}
                        recruitment={recruitment}
                        isCommentModalOpen={isCommentModalOpen}
                        setIsCommentModalOpen={setIsCommentModalOpen}
                        selectedRecruitment={selectedRecruitment}
                        setSelectedRecruitment={setSelectedRecruitment}
                        toast={toast}
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
            />
            <ToastContainer />
        </ Layout >

    );
}