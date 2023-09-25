import React from 'react'

import styles from '@/styles/components/recruitments/JoinButton.module.css'

import axios from '@/lib/axios'


const JoinButton = ({ userData, recruitment, setSelectedRecruitment, toast, mutate }) => {

    const joinRecruitment = async (recruitment) => {

        setSelectedRecruitment(recruitment);
        try {
            const response = await axios.post('/api/participants', {
                user_id: userData.id,
                recruitment_id: recruitment.id,
                is_approved: 1 //承認制にする場合は0(一旦なしで)
            });
            if (response.status === 201) {
                // console.log('募集に参加しました！');
                toast.success('募集に参加しました！');
            } else {
                console.log('参加に失敗しました。もう一度試してください。');
            }
        } catch (error) {
            console.error("Failed to join the recruitment:", error);
            // toast.error('参加に失敗しました。もう一度試してください。');
            toast.error('すでに参加しています！');
        }

        mutate && mutate()
    }



    return (
        <button className={styles.joinButton} onClick={() => joinRecruitment(recruitment)}>
            <img
                src="/join3.png"
                alt="join_icon"
                width={80}
                height={80}
            />
            {/* <span>join!</span> */}
        </button>
    )
}

export default JoinButton