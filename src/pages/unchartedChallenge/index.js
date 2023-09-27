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

    const { data: userData, error: userError } = useSWR('/api/me', fetcher);

    if (userError) console.error('ユーザーデータの取得に失敗しました。:', userError);



    const handleJoin = async () => {
        try {
            // リクエストを送信します。このリクエストにはユーザーIDは含まれません。
            const response = await axios.post('/api/my/unchartedChallenge');

            if (response.data.success) {
                console.log("参加成功!");
            }
        } catch (error) {
            console.error("参加失敗:", error);
        }
    }




    return (

        <Layout>
            <Header headerTitle={'UnchartedChallenge'} />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 mt-8">
                    <h2>毎月1日に4人1組のチャットグループが作られます。</h2>
                    <h2>4人ともやったことのないことに1ヶ月間チャレンジしてみましょう！</h2>

                    <div className={styles.buttonBox}>

                        {/* <p className={styles.errorText}>{message}</p> */}
                        <button
                            className={styles.createButton}
                            onClick={handleJoin}
                        >
                            来月チャレンジに参加する！
                        </button>
                    </div>
                    <h2>今月のチャレンジ</h2>
                </div>
            </div>



            <FooterTabBar user={userData} />
        </Layout>
    )
}

export default UnchartedChallenge
