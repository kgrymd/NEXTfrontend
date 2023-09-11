import React, { useState, useEffect } from 'react';

import styles from '@/styles/tagEdit.module.css'

import axios from "@/lib/axios";

import useSWR from "swr";
import FooterTabBar from '@/components/FooterTabBar';
import Head from 'next/head';
import Layout from '@/components/Layouts/Layout';
import Header from '@/components/Header';

function EditTagsWithSearchAndSave() {


    const { data: userData = { tags: [] }, error, mutate } = useSWR('/api/me', () =>
        axios
            .get('/api/me')
            .then(res => res.data)
            .catch(error => {
                if (error.response.status !== 409) throw error

                router.push('/verify-email')
            }),
    );


    // loading状態を管理するための状態変数とsetter関数(あとで使うかも)
    // const [loading, setLoading] = useState(false);

    const [tags, setTags] = useState([]); // すべてのタグ
    const [userTags, setUserTags] = useState([]); // ユーザーが選んだタグ
    const [searchInput, setSearchInput] = useState(''); // 検索フィールドの値
    const [isModified, setIsModified] = useState(false); // タグが編集されたかどうか


    // userDataが変更された時だけuserTagsを更新
    useEffect(() => {
        if (userData) {
            setUserTags(userData.tags);
        }
    }, [userData]);

    // コンポーネントマウント時に一度だけ全タグをフェッチ
    useEffect(() => {
        async function fetchTags() {
            const response = await axios.get('/api/tags');
            setTags(response.data.data);
        }
        fetchTags();
    }, []);


    // ユーザーがタグを削除したときの処理
    const handleTagRemoval = (tagId) => {
        const updatedTags = userTags.filter((tag) => tag.id !== tagId);
        setUserTags(updatedTags);
        setIsModified(true);
    };

    // タグを追加したときの処理
    const handleTagAddition = (tag) => {
        setUserTags([...userTags, tag]);
        setIsModified(true);
    };

    // 新しいタグを作成して保存する関数
    const createAndAddNewTag = async () => {
        try {
            // 新しいタグを作成するAPIを叩く
            const response = await axios.post('/api/tags', { name: searchInput });

            // 新しいタグをユーザーのタグに追加
            handleTagAddition(response.data);
        } catch (error) {
            console.log("Failed to create new tag", error);
        }
    };

    // タグの保存
    const handleSave = async () => {
        try {
            // ローディング状態の設定
            // setLoading(true);

            // データが変更された場合のみAPIを叩く
            if (isModified) {
                const response = await axios.put(`/api/my/${userData.id}/tags`, {
                    tags: userTags.map((tag) => tag.id),
                });

                // 成功した場合の処理
                if (response.status === 200) {
                    setIsModified(false);

                    window.location.href = '/profile/me'
                } else {
                    setMessage('エラーが発生しました。')
                }
            }
        } catch (error) {
            console.log(
                `エラーが発生しました。ステータスコード: ${error.response.status}`,
            )
        }
        // finally {
        //     // ローディング状態の解除
        //     setLoading(false);
        // }
    };

    // 入力されたタグ名が既存のタグに存在するかを確認
    const tagExists = tags.some(tag => tag.name === searchInput);


    // タグの検索フィルタリング
    const userTagIds = new Set(userTags.map(tag => tag.id));
    const filteredTags = (Array.isArray(tags) ? tags : [])
        .filter(tag => !userTagIds.has(tag.id))
        .filter(tag => tag.name.includes(searchInput));

    return (
        <Layout>
            <Header>
                <Head>
                    <title>Edit Tags</title>
                </Head>
                <div className={styles.container}>
                    <div className={styles.content}>
                        <h1 className={styles.title}>タグを編集</h1>

                        {/* 検索バー */}
                        <div className={styles.searchBar}>
                            <input
                                type="text"
                                value={searchInput}
                                onChange={(e) => setSearchInput(e.target.value)}
                                placeholder="Search tags..."
                            />
                            {/* 新しいタグを作成するボタンを表示 */}
                            {!tagExists && searchInput !== '' && (
                                <button onClick={createAndAddNewTag} className={styles.tagCreateButton}>作成して追加</button>
                            )}
                        </div>

                        <div className=''>
                            <h3 className="font-bold">自分のタグ:</h3>
                            {userTags.map((tag) => (
                                <span key={tag.id} onClick={() => handleTagRemoval(tag.id)} className="inline-block bg-blue-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 cursor-pointer">
                                    {tag.name} ×

                                </span>
                            )) ?? <p className="text-gray-500">No tags available</p>}
                        </div>

                        {/* 保存ボタン */}
                        <button onClick={handleSave} className={styles.saveButton}>保存</button>

                        <div className={`${styles.flexContainer} ${styles.gap}`}>
                            <h3 className="font-bold">タグを選択:</h3>
                            {filteredTags.map((tag) => (
                                <span key={tag.id} onClick={() => handleTagAddition(tag)} className="inline-block bg-red-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 cursor-pointer">
                                    {tag.name}
                                </span>
                            )) ?? <p className="text-gray-500">No tags available</p>}
                        </div>

                    </div>
                </div>
                <FooterTabBar user={userData} />
            </Header>
        </ Layout>
    );
}

export default EditTagsWithSearchAndSave;
