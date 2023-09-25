import React, { useState } from 'react'
import Link from 'next/link'

import styles from '@/styles/components/recruitments/Recruitment.module.css'

import LikeButton from '@/components/Recruitments/LikeButton'
import JoinButton from '@/components/Recruitments/JoinButton'
import CommentButton from '@/components/Recruitments/CommentButton'
import TagDisplay from '@/components/Tags/TagDisplay'
import ReferenceURL from '@/components/Recruitments/ReferenceURL'
import DetailBadge from '@/components/Recruitments/DetailBadge'
import Participants from '@/components/Recruitments/Participants'

import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import YouTube from 'react-youtube';

const Recruitment = ({ userData, recruitment, setIsCommentModalOpen, setSelectedRecruitment, toast, mutate }) => {

    // 各募集のいいね状態をトラックするためのstate
    const [liked, setLiked] = useState(recruitment.is_liked);

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

            {/* タイトルをタッチすると詳細ページに遷移 */}
            <Link href={`/recruitments/${recruitment.id}`}>
                <div className={styles.info}>
                    <h2>{recruitment.title}</h2>
                </div>

            </Link>

            {recruitment && (
                <Slider {...sliderSettings} className={styles.slider}>
                    {recruitment.youtube_url && (
                        <YouTube
                            videoId={getYouTubeID(recruitment.youtube_url)}
                            opts={{ width: '100%', height: 'auto' }}
                        />
                    )}
                    {recruitment.images.map((image, index) => (
                        <div key={index}>
                            {/* Todo: デフォルト画像ちゃんと設定する */}
                            <img src={image.image_path ? `${process.env.NEXT_PUBLIC_AWS_URL}${image.image_path}` : '/bakachinga.jpg'} alt={`Image ${index + 1}`} className={styles.image} />
                        </div>
                    ))}
                </Slider>

            )}

            <div className={styles.info}>
                <p>{recruitment.description}</p>

                <ReferenceURL recruitment={recruitment} />

                <p>場所: {recruitment.prefecture?.name}</p>

                <DetailBadge from={recruitment.age_from} to={recruitment.age_to} label={"年齢"} unit={"歳"} />
                <DetailBadge from={recruitment.min_people} to={recruitment.max_people} label={"人数"} unit={"人"} />

                <div className="flex flex-wrap gap-2">
                    <TagDisplay tags={recruitment?.tags} tagColor="lime" message="タグ未設定" />
                </div>

                <Participants userData={userData} recruitment={recruitment} />
                <DetailBadge from={recruitment.start_date} to={recruitment.end_date} label={"期間"} unit={""} />

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
                    mutate={mutate}
                />

            </div>
        </div>

    )
}

export default Recruitment
