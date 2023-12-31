import { useState } from 'react'
import useSWR from "swr";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from 'next/router';

import styles from '@/styles/recruitmentList.module.css'

import FooterTabBar from "@/components/FooterTabBar";
import Layout from '@/components/Layouts/Layout'
import CommentModal from '@/components/Recruitments/CommentModal'
import Recruitment from '@/components/Recruitments/Recruitment'
import Header from "@/components/Header";
import Button from "@/components/Button";

import axios from "@/lib/axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const RecruitmentShow = () => {

    const router = useRouter();
    const { id } = router.query;


    // ユーザーが入力する新しいコメントを管理するためのstate
    const [newComment, setNewComment] = useState("");
    // モーダルの表示状態を管理するためのstate
    const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
    const [selectedRecruitment, setSelectedRecruitment] = useState(null);

    const fetcher = url => axios.get(url).then(res => res.data).catch(error => {
        throw error.response.data;
    });

    const { data: userData, error: userError } = useSWR('/api/me', fetcher);
    const { data: recruitment, error: recruitmentError, mutate } = useSWR(`/api/recruitments/${id}`, fetcher);

    if (userError) console.error('ユーザーデータの取得に失敗しました。:', userError);
    if (recruitmentError) return <div>データの読み込みに失敗しました</div>
    if (!recruitment) return (
        <div className={styles.loadingOverlay}>
            <img src="/loading.gif" alt="Loading..." />
        </div>
    )



    // console.log(recruitment)
    // console.log('selectedRecruitment', selectedRecruitment)


    return (
        <Layout>
            <Header user={userData} />
            <Head>
                <title>Created recruitment</title>
            </Head>
            {/* ヘッダー分の余白（仮） */}
            <div className='mt-16'></div>
            <div className={styles.container}>
                <Recruitment
                    recruitment={recruitment}
                    userData={userData}
                    isCommentModalOpen={isCommentModalOpen}
                    setIsCommentModalOpen={setIsCommentModalOpen}
                    selectedRecruitment={selectedRecruitment}
                    setSelectedRecruitment={setSelectedRecruitment}
                    mutate={mutate}
                    toast={toast}
                />
            </div>
            <div className="flex justify-center mt-4">
                <Link href={`/recruitmentEdit/${recruitment.id}`}>
                    <Button type="button">募集を編集する</Button>
                </Link>
            </div>


            {/* フッター分の余白（仮） */}
            <div className='mb-16'></div>
            <FooterTabBar user={userData} />

            {/* コメントモーダル */}
            <CommentModal
                isCommentModalOpen={isCommentModalOpen}
                setIsCommentModalOpen={setIsCommentModalOpen}
                selectedRecruitment={recruitment}
                setSelectedRecruitment={setSelectedRecruitment}
                newComment={newComment}
                setNewComment={setNewComment}
                userData={userData}
                mutate={mutate}
            />
            <ToastContainer />
        </ Layout >
    )
}

export default RecruitmentShow