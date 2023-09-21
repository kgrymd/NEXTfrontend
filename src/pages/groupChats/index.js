import Link from 'next/link';
import axios from '@/lib/axios';
import { useState, useEffect } from 'react';
import useSWR from 'swr';
import AppLayout from '@/components/Layouts/AppLayout';
import FooterTabBar from '@/components/FooterTabBar';
import Head from 'next/head';

function GroupChats() {
    const [chat_groups, setChatGroups] = useState([]);

    const fetcher = url => axios.get(url).then(res => res.data).catch(error => {
        throw error.response.data;
    });

    const { data: userData, error: userError } = useSWR('/api/me', fetcher);

    useEffect(() => {
        // APIからユーザーが参加している募集一覧を取得
        async function fetchChatGroups() {
            try {
                const response = await axios.get('/api/my/chat-groups'); //Todo: エンドポイントを承認済み募集に変える
                setChatGroups(response.data);
            } catch (error) {
                console.error("Error fetching the chat_groups data:", error); //Todo:
            }
        }

        fetchChatGroups();
    }, []);

    return (
        <AppLayout
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    GroupChats
                </h2>
            }
        >
            <Head>
                <title>GroupChats</title>
            </Head>
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">


                    <ul>
                        {chat_groups.map((chat_group) => (
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
        </AppLayout>
    );
}



export default GroupChats;
