import React, { useState } from 'react'
import Link from 'next/link'

import styles from '@/styles/components/recruitments/Recruitment.module.css'

import LikeButton from '@/components/Recruitments/LikeButton'
import JoinButton from '@/components/Recruitments/JoinButton'
import CommentButton from '@/components/Recruitments/CommentButton'
import Image from '@/components/Image'

import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import YouTube from 'react-youtube';
import TagDisplay from '../TagDisplay'

const Recruitment = ({ userData, recruitment, setIsCommentModalOpen, setSelectedRecruitment, toast }) => {

    // 各募集のいいね状態をトラックするためのstate
    const [liked, setLiked] = useState(false);

    const sliderSettings = {
        dots: false,  // スライダーの下にドットを表示するかどうか
        infinite: true,  // 無限ループスライド
        speed: 300,  // スライド/フェードアニメーションの速さ（ミリ秒）
        slidesToShow: 1,  // 一度に表示するスライド数
        slidesToScroll: 1,  // 一度のスクロールで動かすスライド数
    };


    // YouTubeのURLから動画IDを取得する関数
    function getYouTubeID(url) {
        var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        var match = url.match(regExp);
        return (match && match[2].length == 11) ? match[2] : null;
    }

    return (


        <div key={recruitment.id} className={styles.card}>
            <div className={styles.info}>
                <h2>{recruitment.title}</h2>
            </div>
            {/* {recruitments && ( */}
            {recruitment && (
                <Slider {...sliderSettings} className={styles.slider}>
                    {recruitment.youtube_url && (
                        <YouTube
                            videoId={getYouTubeID(recruitment.youtube_url)}
                            opts={{ width: '100%', height: 'auto' }}
                        // onReady={(event) => event.target.pauseVideo()}
                        />
                    )}
                    {recruitment.images.map((image, index) => (
                        <div key={index}>
                            <img src={image.image_path ? `${process.env.NEXT_PUBLIC_AWS_URL}${image.image_path}` : '/bakachinga.jpg'} alt={`Image ${index + 1}`} className={styles.image} />
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
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
                        </svg>

                    </a>
                </div>
                <p>場所: {recruitment.prefecture?.name}</p>
                <p>年齢: {recruitment.age_from} ~ {recruitment.age_to}歳</p>
                <p>募集人数: {recruitment.min_people} ~ {recruitment.max_people}人</p>
                <p>期間: {recruitment.start_date} ~ {recruitment.end_date}</p>

                <div className="flex flex-wrap gap-2">
                    <TagDisplay tags={recruitment?.tags} tagColor="lime" message="タグ未設定" />
                </div>
                <div className={styles.iconContainer}>
                    <p>参加者:</p>
                    {userData?.id === recruitment.user.id ?
                        <Link href={'/profile'}>
                            <div key={recruitment.user.id}>
                                <Image
                                    src={recruitment.user.icon_path}
                                    alt={recruitment.user.name}
                                    style={styles.icon}
                                />
                                <span className='text-xs'>{recruitment.user.name}</span>
                            </div>
                        </Link>
                        :
                        <Link href={`/profile/${recruitment.user.id}`}>
                            <div key={recruitment.user.id}>
                                <Image
                                    src={recruitment.user.icon_path}
                                    alt={recruitment.user.name}
                                    style={styles.icon}
                                />
                                <span className='text-xs'>{recruitment.user.name}</span>
                            </div>
                        </Link>
                    }
                    {recruitment.approvedUsers.map((user) => (
                        //募集作成者以外の募集参加者を表示
                        recruitment.user.id !== user.id ? (
                            userData.id === user.id ?
                                <Link href={'/profile'}>
                                    <div key={user.id}>
                                        <Image //Todo: ProfileImageコンポーネントを作成し、クリックしたらそのユーザーのプロフィール画面に行くようにする
                                            src={user.icon_path}
                                            alt={user.name}
                                            style={styles.icon}
                                        />
                                    </div>
                                </Link>
                                :
                                <Link href={`/profile/${user.id}`}>
                                    <div key={user.id}>
                                        <Image //Todo: ProfileImageコンポーネントを作成し、クリックしたらそのユーザーのプロフィール画面に行くようにする
                                            src={user.icon_path}
                                            alt={user.name}
                                            style={styles.icon}
                                        />
                                    </div>
                                </Link>
                        ) : null
                    ))}
                </div>

                <LikeButton
                    liked={liked}
                    recruitment={recruitment}
                    setLiked={setLiked}
                />

                <CommentButton
                    recruitment={recruitment}
                    setIsCommentModalOpen={setIsCommentModalOpen}
                    setSelectedRecruitment={setSelectedRecruitment}
                />

                <JoinButton
                    userData={userData}
                    recruitment={recruitment}

                    setSelectedRecruitment={setSelectedRecruitment}
                    toast={toast}
                />

            </div>
        </div>

    )
}

export default Recruitment
