import React from 'react'
import styles from '@/styles/components/recruitments/LikeButton.module.css'
import LikeIcon from './LikeIcon'

const LikeButton = ({ liked, recruitment, setLiked }) => {
    // 各募集のいいね状態をトラックするためのstate
    // const [likedRecruitments, setLikedRecruitments] = useState({});


    const handleLikeClick = (recruitmentId) => {
        setLiked(prevState => !prevState);
        // Todo: ユーザーと募集の中間テーブル(like管理用)にlikedがtrueなら保存、falseなら削除の処理のエンドポイントにPOSTする処理を書く。もしくはバックでlikedによって保存か削除か変える
    };


    return (
        <button
            className={`${styles.likeButton} ${liked ? styles.liked : ''}`}
            onClick={() => handleLikeClick(recruitment.id)}>
            <LikeIcon isActive={liked} />
        </button>)
}

export default LikeButton