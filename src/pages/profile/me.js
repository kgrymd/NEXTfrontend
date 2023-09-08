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
        // ↓スペースががも゛ったいだいっ!!!!ので一旦コメントアウト
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
                        <div>{userData.prefecture_name ? userData.prefecture_name : "???"}</div>
                    </div>
                    <h3 className="font-bold">自己紹介:</h3>
                    <p>{userData.introduction}</p>

                    <div className="flex flex-wrap gap-2">
                        <h3 className="font-bold">タグ:</h3>
                        {userData?.tags?.map((tag) => (
                            <span key={tag.id} className="inline-block bg-blue-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2">
                                {tag.name}
                            </span>
                        )) ?? <p className="text-gray-500">タグを設定していません</p>}
                    </div>
                </>
            ) : (
                <p>Loading...</p>
            )}



            <div className="flex justify-center">
                <Link href={'/profile/tagEdit'}>
                    <Button type="button">タグを編集</Button>
                </Link>
            </div>
            <div className="flex justify-center">
                <Link href={'/profile/edit'}>
                    <Button type="button">プロフィールを編集</Button>
                </Link>
            </div>

            <FooterTabBar user={userData} />
        </AppLayout>
    )
}

export default Me