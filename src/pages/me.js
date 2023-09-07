import { useEffect } from "react";
import AppLayout from "@/components/Layouts/AppLayout";
import Head from "next/head";
import Link from "next/link";
import axios from "@/lib/axios";
import Button from '@/components/Button'
import Image from "@/components/Image";
import React from 'react'

import useSWR from "swr";
import FooterTabBar from "@/components/FooterTabBar";




const Me = () => {

    const { data: userData, error, mutate } = useSWR('/api/me', () =>
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
    return (
        <AppLayout
        // header={
        //     <h2 className="font-semibold text-xl text-gray-800 leading-tight">
        //         Profile
        //     </h2>
        // }
        >
            <Head>
                <title>Profile</title>
            </Head>

            {userData ? (
                <>
                    {/* <img src={userData.icon_url} alt="icon" /> */}
                    <div className="flex justify-center items-center">
                        <Image
                            src={userData.icon_path}
                            alt="icon"
                            style="h-32 w-32 rounded-full border border-gray-400"
                        />
                    </div>

                    <div className="flex justify-evenly">
                        <div>{userData.name}</div>
                        <div>{userData.age ? userData.age : "???"}歳</div>
                        <div>{userData.prefecture_id ? userData.prefecture_id : "???"}</div>
                    </div>
                    <h3 className="font-bold">自己紹介:</h3>
                    <p>{userData.introduction}</p>
                </>
            ) : (
                <p>Loading...</p>
            )}



            <div className="flex justify-center">
                <Link href={'/'}>
                    <Button type="button">プロフィールを編集</Button>
                </Link>
            </div>

            <FooterTabBar user={userData} />
        </AppLayout>
    )
}

export default Me