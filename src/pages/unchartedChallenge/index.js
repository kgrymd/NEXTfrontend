import Header from '@/components/Header';
import Layout from '@/components/Layouts/Layout';
import useSWR from "swr";

import FooterTabBar from '@/components/FooterTabBar'

const UnchartedChallenge = () => {

    const fetcher = url => axios.get(url).then(res => res.data).catch(error => {
        throw error.response.data;
    });

    const { data: userData, error: userError } = useSWR('/api/me', fetcher);

    if (userError) console.error('ユーザーデータの取得に失敗しました。:', userError);


    return (

        <Layout>
            <Header headerTitle={'UnchartedChallenge'} />


            <FooterTabBar user={userData} />
        </Layout>
    )
}

export default UnchartedChallenge
