import useSWR from "swr";
import Head from "next/head";
import Link from "next/link";

import axios from "@/lib/axios";

import AppLayout from "@/components/Layouts/AppLayout";
import Button from '@/components/Button';
import Image from "@/components/Image";
import FooterTabBar from "@/components/FooterTabBar";
import TagDisplay from "@/components/Tags/TagDisplay";




const UserProfile = () => {

    const { data: userData, error } = useSWR('/api/me', () =>
        axios
            .get('/api/me')
            .then(res => res.data)
    );

    if (error) return <div>エラーが発生しました</div>;


    return (
        <AppLayout>
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
                        <TagDisplay tags={userData?.tags} tagColor="lime" message="" />
                    </div>
                </>
            ) : (
                <p>Loading...</p>
            )}

            <div className="flex justify-center">
                <Link href={'/profile/edit'}>
                    <Button type="button">プロフィールを編集</Button>
                </Link>
            </div>

            <FooterTabBar user={userData} />
        </AppLayout>
    )
}

export default UserProfile