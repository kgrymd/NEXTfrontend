import React from 'react'
import styles from '@/styles/components/recruitments/JoinButton.module.css'
import axios from '@/lib/axios'


const JoinButton = ({ userData, recruitment, setSelectedRecruitment, toast }) => {

    // 募集に参加するための関数
    const joinRecruitment = async (recruitment) => {

        setSelectedRecruitment(recruitment);
        try {
            const response = await axios.post('/api/participants', {
                user_id: userData.id,
                recruitment_id: recruitment.id,
                is_approved: 0
            });
            if (response.status === 201) {
                // console.log('募集に参加しました！');
                toast.success('参加申請をしました！承諾をお待ちください！');
            } else {
                console.log('参加に失敗しました。もう一度試してください。');
            }
        } catch (error) {
            console.error("Failed to join the recruitment:", error);
            // toast.error('参加に失敗しました。もう一度試してください。');
            toast.error('すでに参加申請をしています！承諾をお待ちください！');
        }
    }



    return (
        <button className={styles.joinButton} onClick={() => joinRecruitment(recruitment)}>
            <img
                src="/join_icon.png"
                alt="join_icon"
            />
            <span>join!</span>
        </button>
    )
}

export default JoinButton