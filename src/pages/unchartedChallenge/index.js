import Header from '@/components/Header';
import Layout from '@/components/Layouts/Layout';
import useSWR from "swr";

import styles from '@/styles/unchartedChallenge.module.css';

import FooterTabBar from '@/components/FooterTabBar'

import axios from '@/lib/axios';

const UnchartedChallenge = () => {

    const fetcher = url => axios.get(url).then(res => res.data).catch(error => {
        throw error.response.data;
    });

    const { data: userData, error: userError, mutate } = useSWR('/api/me', fetcher);

    if (userError) console.error('ユーザーデータの取得に失敗しました。:', userError);



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
                    <h2>今月のチャレンジのグループチャット</h2>
                    <p>ここにグループチャットのリンクが入る</p>
                </div>
            </div>
            <FooterTabBar user={userData} />
        </Layout>
    )
}

export default UnchartedChallenge
