import React from 'react'

import styles from '@/styles/components/recruitments/LikeButton.module.css'

import LikeIcon from './LikeIcon'

import axios from '@/lib/axios'

const LikeButton = ({ liked, recruitment, setLiked }) => {


    const handleLikeClick = async (recruitmentId) => {
        setLiked(prevState => !prevState);

        if (liked) {
            // お気に入りを解除
            try {
                await axios.delete(`/api/recruitments/${recruitmentId}/unfavorite`);
            } catch (error) {
                console.error("お気に入り解除に失敗しました:", error);
                setLiked(true); // エラーが発生した場合は、likeの状態を元に戻す
            }
        } else {
            // お気に入りに追加
            try {
                await axios.post(`/api/recruitments/${recruitmentId}/favorite`);
            } catch (error) {
                console.error("お気に入り追加に失敗しました:", error);
                setLiked(false); // エラーが発生した場合は、likeの状態を元に戻す
            }
        }
    };


    return (
        <button
            className={`${styles.likeButton} ${liked ? styles.liked : ''}`}
            onClick={() => handleLikeClick(recruitment.id)}>
            <LikeIcon isActive={liked} />
        </button>)
}

export default LikeButton