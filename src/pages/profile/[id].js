import { useRouter } from 'next/router';
import useSWR from "swr";
import Head from "next/head";

import axios from "@/lib/axios";

import Image from "@/components/Image";
import FooterTabBar from "@/components/FooterTabBar";
import TagDisplay from "@/components/Tags/TagDisplay";
import Layout from "@/components/Layouts/Layout";
import Header from "@/components/Header";

import { useAuth } from "@/hooks/auth";


const Profile = () => {
    const { user } = useAuth({ middleware: 'auth' })


    // useRouterフックを使用してルーターオブジェクトを取得
    const router = useRouter();
    const { id } = router.query;  // パスからidを取得

    const { data: userData, error } = useSWR(id ? `/api/users/${id}` : null, () =>
        axios
            .get(`/api/users/${id}`)
            .then(res => res.data)
    );

    if (error) return <div>エラーが発生しました</div>;


    return (
        <Layout>
            <Header />
            <Head>
                <title>Recruitments Page</title>
            </Head>
            {/* ヘッダー分の余白（仮） */}
            <div className='mt-16'></div>

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
            <FooterTabBar user={user} />
        </ Layout >
    )
}

export default Profile