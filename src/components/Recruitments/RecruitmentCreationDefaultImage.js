import React from 'react'
import styles from '@/styles/components/recruitments/RecruitmentCreationImage.module.css'

const RecruitmentCreationDefaultImage = ({ index, src }) => {
    return (
        <div className={styles.imageBox}>
            {/* 画像index */}
            <div className={styles.index}>{index + 1}</div>
            {/* 画像 */}
            <img src={src} className={styles.img} />
        </div>
    )
}

export default RecruitmentCreationDefaultImage