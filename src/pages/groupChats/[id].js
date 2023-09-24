import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import Head from 'next/head';
import Link from 'next/link';

import styles from '@/styles/groupChat.module.css'

import Layout from '@/components/Layouts/Layout';
import Header from '@/components/Header';

import axios from '@/lib/axios';


const GroupChat = () => {

    const router = useRouter();
    const { id } = router.query;  // パスからuuidを取

    const messagesContainerRef = useRef(null);

    const fetcher = url => axios.get(url).then(res => res.data).catch(error => {
        throw error.response.data;
    });

    const { data: userData, error: userError } = useSWR('/api/me', fetcher);

    const { data: groupChat, error: groupChatError } = useSWR(`/api/chat-groups/${id}`, fetcher);

    if (userError || groupChatError) console.error("Error fetching the data:", userError || groupChatError);

    const [lastTimestamp, setLastTimestamp] = useState(null);


    const { data: messages, mutate } = useSWR(
        lastTimestamp ? `/api/chat-groups/${id}/messages/polling?ts=${lastTimestamp}` : `/api/chat-groups/${id}/messages`,

        fetcher,
        {
            refreshInterval: 5000
        }
    );


    const [allMessages, setAllMessages] = useState([]); // 追加


    const [newMessage, setNewMessage] = useState("")




    const handleKeyDown = (event) => {
        if (event.key === 'Enter' && (event.metaKey || event.ctrlKey)) {
            handleMessageSubmit();
        }
    }

    const handleMessageSubmit = async () => {
        try {
            const response = await axios.post(`/api/chat-groups/${id}/messages`, {
                user_id: userData.id,
                message_text: newMessage
            });

            if (response.status === 201) {
                setNewMessage("");
                mutate()

            }
        } catch (error) {
            console.error("Failed to post the message:", error);
        }
    };



    // 最下部にスクロールする関数
    const scrollToBottom = () => {
        const element = messagesContainerRef.current;
        if (element) {
            element.scrollTop = element.scrollHeight;
        }
    }

    // メッセージが更新されたとき、または初めてロードされたときに最下部にスクロール
    useEffect(() => {
        scrollToBottom();
    }, [messages]);


    useEffect(() => {
        if (messages && messages.length) {
            setLastTimestamp(messages[messages.length - 1].ts);
        }
    }, [messages]);

    useEffect(() => {
        if (messages) {
            setAllMessages(prevMessages => [...prevMessages, ...messages]);
        }
    }, [messages]);


    return (
        <Layout>
            <Header headerTitle={groupChat?.name ? groupChat.name : null} chat={true}>
                <Head>
                    <title>Group Chat</title>
                </Head>
                <div className={styles.chat} >
                    <div className={styles.chatContent}>
                        {/* {groupChat && <h2>{groupChat.name}</h2>} */}
                        <div className={styles.messages} ref={messagesContainerRef}>
                            {allMessages && allMessages.map((message) => (

                                message.user.id === userData.id ?
                                    <div
                                        className={`${styles.message} ${styles.myMessage}`}
                                        key={message.id}
                                    >
                                        <div className={styles.messageContent}>
                                            <p className={styles.messageText}>{message.message_text}</p>
                                        </div>
                                    </div>
                                    :
                                    <div
                                        className={`${styles.message} ${styles.otherMessage}`}
                                        key={message.id}
                                    >
                                        <Link href={`/profile/${message.user.id}`} key={message.user.id}>
                                            <img src={message.user && message.user.icon_path ? `${process.env.NEXT_PUBLIC_AWS_URL}${message.user.icon_path}` : '/user_circle_icon.svg'} alt={message.user ? message.user.name : 'Unknown User'} />
                                        </Link>
                                        <div className={styles.messageContent}>
                                            <p className={styles.messageText}>{message.message_text}</p>
                                        </div>
                                    </div>


                            ))}
                        </div>
                        <div className={styles.messageInputContainer}>
                            <textarea
                                className={styles.messageInput}
                                value={newMessage}
                                onChange={e => setNewMessage(e.target.value)}
                                placeholder="メッセージを入力..."
                                onKeyDown={handleKeyDown}
                            />
                            <button className={styles.messageSubmitButton} onClick={handleMessageSubmit}>送信</button>
                        </div>
                    </div>
                </div>
            </Header>
        </Layout>
    )

}

export default GroupChat