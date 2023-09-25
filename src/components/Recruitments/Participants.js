import React from 'react'
import Link from 'next/link'

import styles from '@/styles/components/recruitments/Participants.module.css'

import Image from '../Image'

const Participants = ({ userData, recruitment }) => {
    return (
        <div className={styles.iconContainer}>
            <p>参加者:</p>
            {userData?.id === recruitment.user.id ?
                <Link href={'/profile'} key={recruitment.user.id}>
                    <Image
                        src={recruitment.user.icon_path}
                        alt={recruitment.user.name}
                        style={styles.icon}
                    />
                    {/* <span className='text-xs'>{recruitment.user.name}</span> */}
                    <span className='text-xs'>作成者</span>
                </Link >
                :
                <Link href={`/profile/${recruitment.user.id}`} key={recruitment.user.id}>
                    <Image
                        src={recruitment.user.icon_path}
                        alt={recruitment.user.name}
                        style={styles.icon}
                    />
                    {/* <span className='text-xs'>{recruitment.user.name}</span> */}
                    <span className='text-xs'>作成者</span>
                </Link>
            }
            {recruitment.approvedUsers.map((user) => (
                //募集作成者以外の募集参加者を表示
                recruitment.user.id !== user.id ? (
                    userData?.id === user.id ?
                        <Link href={'/profile'} key={user.id}>
                            <Image
                                src={user.icon_path}
                                alt={user.name}
                                style={styles.icon}
                            />
                        </Link>
                        :
                        <Link href={`/profile/${user.id}`} key={user.id}>
                            <Image
                                src={user.icon_path}
                                alt={user.name}
                                style={styles.icon}
                            />
                        </Link>
                ) : null
            ))}
        </div>
    )
}

export default Participants