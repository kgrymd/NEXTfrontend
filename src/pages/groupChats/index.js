import useSWR from 'swr';
import Link from 'next/link';
import Head from 'next/head';

import FooterTabBar from '@/components/FooterTabBar';
import Header from '@/components/Header';
import Layout from '@/components/Layouts/Layout';

import axios from '@/lib/axios';


function GroupChats() {

    const fetcher = url => axios.get(url).then(res => res.data).catch(error => {
        throw error.response.data;
    });

    const { data: chat_groups, error: chatError } = useSWR('/api/my/chat-groups', fetcher);
    const { data: userData, error: userError } = useSWR('/api/me', fetcher);

    if (chatError || userError) console.error("Error fetching the data:", chatError || userError);


    return (
        <Layout>
            <Header headerTitle={'GroupChats'} />
            <Head>
                <title>GroupChats</title>
            </Head>
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 mt-8">

                    <ul>
                        {chat_groups && chat_groups.map((chat_group) => (
                            <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg" key={chat_group.id}>
                                {/* ダイナミックルートへのリンクを設定 */}
                                <Link href={`/groupChats/${chat_group.uuid}`}>
                                    <li className="p-6 bg-white border-b border-gray-200">
                                        {chat_group.name}
                                    </li>
                                </Link>
                            </div>
                        ))}
                    </ul>

                </div>
            </div>
            <FooterTabBar user={userData} />
        </Layout>
    );
}



export default GroupChats;
