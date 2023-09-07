// import styles from '@/styles/profile.module.css'
import React from 'react'
import AppLayout from '@/components/Layouts/AppLayout'
// import FooterTabBar from '@/components/FooterTabBar'
import Head from 'next/head'
import { useAuth } from '@/hooks/auth'
import axios from '@/lib/axios'
import useSWR from 'swr'
import { useEffect } from 'react'
import Button from '@/components/Button'
import Link from 'next/link'
// import ProfileItem from '@/components/ProfileItem'

const profile = () => {
    useAuth({ middleware: 'auth' })

    // CSRで最新の情報を取得
    const fetcher = async url => {
        return await axios(url).then(response => response.data)
    }
    const apiUrl = `/api/me`
    const { data, mutate } = useSWR(apiUrl, fetcher, {
        fallbackData: null,
    })
    useEffect(() => {
        console.log(data)
        mutate()
    }, [])

    // if (data === null) {
    //     return (
    //         <div className={styles.flexContainer}>
    //             <img src="loading.gif" alt="loading" />
    //         </div>
    //     )
    // }

    return (
        <>
            <AppLayout user={data}>
                <Head>
                    <title>Profile</title>
                </Head>
                <div>
                    {/* ページコンテンツ */}
                    <div>
                        {/* <p>アイコン2: {data.icon_url}</p> */}

                        {/* <div className={styles.follow}>
                            <Link href={`/follows/${data.id}`}>
                                <div className={styles.box}>
                                    <h2 className={styles.bold}>
                                        {data.follower_count}
                                    </h2>
                                    <p>フォロワー</p>
                                </div>
                            </Link>
                            <Link href={`/follows/${data.id}`}>
                                <div className={styles.box}>
                                    <h2 className={styles.bold}>
                                        {data.following_count}
                                    </h2>
                                    <p>フォロー中</p>
                                </div>
                            </Link>
                        </div> */}
                    </div>

                    {/* <div >
                        <div>
                            <h2>{data.name}</h2>
                            <p>性別: {userData.gender}</p>
                            <p>位置: {userData.prefecture_id}</p>
                            {/* {data.instagram_id ? (
                                <a
                                    href={`https://www.instagram.com/${data.instagram_id}`}
                                    rel="noreferrer noopener"
                                    target="_blank">
                                    <img
                                        src="/Instagram_Glyph_Gradient_RGB.svg"
                                        alt="instagram icon"
                                        className="w-7 h-7 ml-4"
                                    />
                                </a>
                            ) : null} */}
                    {/* </div>
                <p>{data.description}</p> */}
                    {/* </div>  */}

                    <Link href={'/'}>
                        <Button type="button">プロフィールを編集</Button>
                    </Link>


                </div>
            </AppLayout >
        </>
    )
}

export default profile
