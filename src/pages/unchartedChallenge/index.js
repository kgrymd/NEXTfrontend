import Header from '@/components/Header';
import Layout from '@/components/Layouts/Layout';
import useSWR from "swr";

import styles from '@/styles/unchartedChallenge.module.css';

import FooterTabBar from '@/components/FooterTabBar'

import axios from '@/lib/axios';
import Link from 'next/link';

const UnchartedChallenge = () => {

    const fetcher = url => axios.get(url).then(res => res.data).catch(error => {
        throw error.response.data;
    });

    const { data: userData, error: userError, mutate } = useSWR('/api/me', fetcher);
    const { data: unchartedChallenge, error: unchartedChallengeError } = useSWR('/api/my/currentUnchartedChallenge', fetcher);

    if (userError || unchartedChallengeError) console.error("Error fetching the data:", userError || unchartedChallengeError);



    const handleJoin = async () => {
        try {
            // リクエストを送信します。このリクエストにはユーザーIDは含まれません。
            const response = await axios.post('/api/my/unchartedChallenge');

            if (response.data.success) {
                console.log("参加成功!");
            }
            mutate()
        } catch (error) {
            console.error("参加失敗:", error);
        }
    }

    console.log(userData)


    return (
        <Layout>
            <Header headerTitle={'UnchartedChallenge'} />
            <div className="py-12">
                <div className={styles.contentContainer}>
                    <h2>やったことのないことに挑戦しよう！</h2>
                    <p>毎月1日に、あなたを含む4人のグループを作成します。</p>
                    <p>4人で話し合い、4人全員やったことのない新しいチャレンジを一緒に始めましょう！</p>
                    <div className={styles.buttonBox}>
                        {userData &&
                            <button
                                className={userData.uncharted_challenge == 0 ? styles.joinButton : styles.leaveButton}
                                onClick={handleJoin}
                            >
                                {userData.uncharted_challenge == 0 ? '来月参加する！' : '来月の参加をやめる'}
                            </button>
                        }
                    </div>
                    <h2 className="mt-8" >今月のチャレンジ</h2>
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg" key={unchartedChallenge?.id}>
                        {/* ダイナミックルートへのリンクを設定 */}
                        <Link href={`/groupChats/${unchartedChallenge?.uuid}`}>
                            <h2 className="p-6 text-2xl bg-white border-b border-gray-200">
                                {unchartedChallenge?.name}
                            </h2>
                        </Link>
                    </div>
                </div>
            </div>
            <FooterTabBar user={userData} />
        </Layout>
    )
}

export default UnchartedChallenge
