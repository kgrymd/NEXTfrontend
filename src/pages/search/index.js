import { useState } from 'react'
import Head from 'next/head'
import useSWR from 'swr'

import styles from '@/styles/search.module.css'

import Layout from '@/components/Layouts/Layout'
import FooterTabBar from '@/components/FooterTabBar'
import CommentModal from '@/components/Recruitments/CommentModal'
import Recruitment from '@/components/Recruitments/Recruitment'
import Header from '@/components/Header'

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import axios from '@/lib/axios'


export default function RecruitmentList() {

    const [searchKeyword, setSearchKeyword] = useState("");
    const [recruitments, setRecruitments] = useState([]);

    // ユーザーが入力する新しいコメントを管理するためのstate
    const [newComment, setNewComment] = useState("");
    // 追加：モーダルの表示状態を管理するためのstate
    const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
    const [selectedRecruitment, setSelectedRecruitment] = useState(null);

    const fetcher = url => axios.get(url).then(res => res.data).catch(error => {
        throw error.response.data;
    });

    const { data: userData, error: userError } = useSWR('/api/me', fetcher);

    const handleSearch = async () => {
        try {
            const response = await axios.get(`/api/recruitments/search/keyword?keyword=${searchKeyword}`);
            setRecruitments(response.data);
        } catch (error) {
            console.error('検索に失敗しました。:', error);
        }
    }

    if (userError) console.error('ユーザーデータの取得に失敗しました。:', userError);


    return (
        <Layout>
            <Header headerTitle={'募集検索'} />
            <Head>
                <title>Search Page</title>
            </Head>
            {/* ヘッダー分の余白（仮） */}
            <div className='mt-16'></div>
            <div className={styles.container}>

                {/* 検索フォーム */}
                <div className={styles.searchContainer}>
                    <input
                        type="text"
                        value={searchKeyword}
                        onChange={(e) => setSearchKeyword(e.target.value)}
                        placeholder="キーワードを入力..."
                        className={styles.searchInput}
                    />
                    <button onClick={handleSearch} className={styles.searchButton}>検索</button>
                </div>

                {recruitments && recruitments.map((recruitment) => (
                    <Recruitment
                        key={recruitment.id}
                        userData={userData}
                        recruitment={recruitment}
                        isCommentModalOpen={isCommentModalOpen}
                        setIsCommentModalOpen={setIsCommentModalOpen}
                        selectedRecruitment={selectedRecruitment}
                        setSelectedRecruitment={setSelectedRecruitment}
                        toast={toast}
                    // mutate={mutate}
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
            // mutate={mutate}
            />
            <ToastContainer />
        </ Layout >

    );
}