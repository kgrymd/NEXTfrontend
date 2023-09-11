import React from 'react'
import styles from '@/styles/recruitmentList.module.css'

import Layout from '@/components/Layouts/Layout'
import Head from 'next/head'
import FooterTabBar from '@/components/FooterTabBar'

import { useAuth } from '@/hooks/auth'
import useSWR from 'swr'
import axios from '@/lib/axios'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import LikeIcon from '@/components/LIkeIcon'

import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import YouTube from 'react-youtube';



export default function RecruitmentList() {
    const [sliderRef, setSliderRef] = useState(null);
    // おすすめと新着どちらで表示するかのstate
    const [rule, setRule] = useState(true)

    const { data: userData, mutate } = useSWR('/api/me', () =>
        axios
            .get('/api/me')
            .then(res => res.data)
            .catch(error => {
                if (error.response.status !== 409) throw error

                router.push('/verify-email')
            }),
    );


    useEffect(() => {
        mutate();
    }, []);

    const fetcher = url => axios.get(url).then(res => res.data);
    const { data: recruitments, error } = useSWR('/api/recruitments', fetcher);
    // 各募集のいいね状態をトラックするためのstate
    const [likedRecruitments, setLikedRecruitments] = useState({});

    // 追加：モーダルの表示状態を管理するためのstate
    const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
    const [selectedRecruitment, setSelectedRecruitment] = useState(null);

    recruitments ? console.log(recruitments) : console.log("recruitmentsはないよ")

    if (error) return <div>データの読み込みに失敗しました</div>
    if (!recruitments) return <div>ロード中...</div>


    const sliderSettings = {
        dots: false,  // スライダーの下にドットを表示するかどうか
        infinite: true,  // 無限ループスライド
        speed: 500,  // スライド/フェードアニメーションの速さ（ミリ秒）
        slidesToShow: 1,  // 一度に表示するスライド数
        slidesToScroll: 1,  // 一度のスクロールで動かすスライド数
    };

    // YouTubeのURLから動画IDを取得する関数
    function getYouTubeID(url) {
        var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        var match = url.match(regExp);
        return (match && match[2].length == 11) ? match[2] : null;
    }



    const handleLikeClick = (recruitmentId) => {
        setLikedRecruitments(prevState => ({
            ...prevState,
            [recruitmentId]: !prevState[recruitmentId]
        }));
    };



    // コメントモーダルを開く関数
    const handleOpenCommentModal = (recruitment) => {
        setIsCommentModalOpen(true);
        setSelectedRecruitment(recruitment);
    };

    // コメントモーダルを閉じる関数
    const handleCloseCommentModal = () => {
        setIsCommentModalOpen(false);
        setSelectedRecruitment(null);
    };


    console.log(recruitments);


    return (
        <Layout>
            <Head>
                <title>Recruitments Page</title>
            </Head>
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
                    <div key={recruitment.id} className={styles.card}>
                        <div className={styles.info}>
                            <h2>{recruitment.title}</h2>
                        </div>
                        {recruitments && (
                            <Slider {...sliderSettings} ref={setSliderRef} className={styles.slider}>
                                {recruitment.youtube_url && (
                                    <YouTube videoId={getYouTubeID(recruitment.youtube_url)} opts={{ width: '100%', height: 'auto' }} />
                                )}
                                {recruitment.images.map((image, index) => (
                                    <div key={index}>
                                        <img src={image.image_path || '/default-image.png'} alt={`Image ${index + 1}`} className={styles.image} />
                                    </div>
                                ))}
                            </Slider>

                        )}
                        <div className={styles.info}>
                            <p>{recruitment.description}</p>
                            <div className='flex'><span className='text-sm'>参考URL:</span>
                                <a
                                    href={recruitment.reference_url}
                                    rel="noreferrer noopener"
                                >
                                    {/* target="_blank" */}
                                    <img
                                        src="/Instagram_Glyph_Gradient_RGB.svg"
                                        alt="instagram icon"
                                        className="w-7 h-7 ml-4"
                                    />
                                </a>
                            </div>
                            {/* <p>参考URL: <a href={recruitment.reference_url}>{recruitment.reference_url}</a></p> */}
                            <p>場所: {recruitment.prefecture.name}</p>
                            <p>年齢: {recruitment.age_from} ~ {recruitment.age_to}歳</p>
                            <p>募集人数: {recruitment.min_people} ~ {recruitment.max_people}人</p>
                            <p>期間: {recruitment.start_date} ~ {recruitment.end_date}</p>

                            <div className="flex flex-wrap gap-2">
                                {recruitment?.tags?.map((tag) => (
                                    <span key={tag.id} className="inline-block bg-blue-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2">
                                        {tag.name}
                                    </span>
                                )) ?? <p className="text-gray-500">タグを設定していません</p>}
                            </div>
                            <div className={styles.iconContainer}>
                                <p>参加者:</p>
                                <Link href={'/profile/me'}>
                                    <div key={recruitment.user.id}>
                                        <img src={recruitment.user.icon_path || '/default-icon.png'} alt={recruitment.user.name} className={styles.icon} />
                                        <span className='text-xs'>{recruitment.user.name}</span>
                                    </div>
                                </Link>
                                {recruitment.approvedUsers.map((user) => (
                                    <div key={user.id}>
                                        <img src={user.icon_path || '/default-icon.png'} alt={user.name} className={styles.icon} />
                                    </div>
                                ))}
                            </div>

                            <button
                                className={`${styles.likeButton} ${likedRecruitments[recruitment.id] ? styles.liked : ''}`}
                                onClick={() => handleLikeClick(recruitment.id)}>
                                <LikeIcon isActive={likedRecruitments[recruitment.id]} />
                            </button>


                            {/* 追加：コメントボタン */}
                            <button
                                onClick={() => handleOpenCommentModal(recruitment)}
                                className={styles.commentButton}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
                                </svg>

                            </button>

                            <button className={styles.joinButton}>
                                <img
                                    src="/join_icon.png"
                                    alt="join_icon"
                                />
                                <span>join!</span>
                            </button>

                        </div>
                    </div>
                ))}
            </div>
            {/* 追加：コメントモーダル */}
            <div className='mb-16'></div>
            <FooterTabBar user={userData} />
            {isCommentModalOpen && (
                <div
                    onClick={handleCloseCommentModal}
                    style={{
                        position: 'fixed',
                        top: 0, left: 0, right: 0, bottom: 0,
                        // backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        zIndex: 10
                    }}
                >
                    <div className={styles.modal} >
                        <div className={styles.modalContent}>
                            <h2>コメント</h2>
                            <div className={styles.comments}>
                                {selectedRecruitment.comments.map((comment) => (
                                    <div className={styles.comment} key={comment.id}>
                                        <img src={comment.user.icon_path} alt={comment.user.name} />
                                        <div className={styles.commentContent}>
                                            {/* <span className={styles.userName}>{comment.user.name}</span> */}
                                            <p className={styles.commentText}>{comment.comment_text}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <button onClick={handleCloseCommentModal}>閉じる</button>
                        </div>
                    </div>
                </div>
            )}
        </ Layout>
    );
}