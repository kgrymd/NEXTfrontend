import { useState, useEffect } from 'react';
import Head from 'next/head';
import useSWR from 'swr';

import styles from '@/styles/profileEdit.module.css';

import axios from '@/lib/axios';

import Layout from '@/components/Layouts/Layout';
import Header from '@/components/Header';
import Image from '@/components/Image';
import PrefectureSelect from '@/components/PrefectureSelect';
import TagDisplay from '@/components/Tags/TagDisplay';
import Button from '@/components/Button';
import TagEditor from '@/components/Tags/TagEditor';

import { useAuth } from '@/hooks/auth';


const Edit = () => {
    const { user } = useAuth({ middleware: 'auth' })

    const fetcher = url => axios.get(url).then(res => res.data).catch(error => {
        throw error.response.data;
    });


    const { data: prefectures, error: prefectureError } = useSWR('/api/prefectures', fetcher);
    const { data: userData, error: userError } = useSWR('/api/me', fetcher);

    if (prefectureError) console.error('prefecturesの取得に失敗しました。:', prefectureError);
    if (userError) console.error('ユーザーデータの取得に失敗しました。:', userError);

    if (prefectureError || userError) console.error("Error fetching the data:", prefectureError || userError);


    // ユーザーが都道府県を設定していればその都道府県で、設定していなかったら1(未設定)をセット
    const [selectedPrefecture, setSelectedPrefecture] = useState(user?.prefecture_id || 1);
    const [message, setMessage] = useState('')
    // モーダル表示のためのState
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        iconFile: '',
        age: userData?.age || '',
        name: userData?.name || '',
        email: userData?.email || '',
        introduction: '',
        tags: [],
    })


    useEffect(() => {
        // userDataが変更された時に状態を更新
        setFormData({
            iconFile: '',
            age: userData?.age || '',
            name: userData?.name || '',
            email: userData?.email || '',
            introduction: '',
            tags: [],
        })
    }, [userData]);

    // userDataが変更された時だけuserTagsを更新
    useEffect(() => {
        if (userData) {
            setFormData(prev => ({ ...prev, tags: userData.tags }))
        }
    }, [userData]);


    const handleChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const iconClear = e => {
        e.preventDefault()
        setFormData({ ...formData, iconFile: '' })
    }

    // モーダルを開く関数
    const openModal = () => {
        setIsModalOpen(true);
    }

    // モーダルを閉じる関数
    const closeModal = () => {
        setIsModalOpen(false);
    }

    const submit = async e => {
        e.preventDefault()

        // 必須項目のチェック
        if (!validateRequiredFields()) {
            setMessage('必須項目を全て入力してください');
            return; // ここでsubmit関数を終了
        }

        const data = new FormData()
        for (const [key, value] of Object.entries(formData)) {
            if (value !== '') {
                data.append(key, value)
            }
        }

        // selectedPrefecture を FormData に追加
        if (selectedPrefecture) {
            data.append('prefecture_id', selectedPrefecture);
        }

        formData.tags.forEach((tag, index) => {
            data.append(`tags[${index}]`, tag.id);
        });

        try {
            const response = await axios.post('/api/my/data', data, {
                headers: {
                    'content-type': 'multipart/form-data',
                    'X-HTTP-Method-Override': 'PATCH',
                },
            })
            if (response.status === 204) {
                window.location.href = '/profile'
                // alert('保存に成功しました！')
            } else {
                setMessage('エラーが発生しました。')
            }
        } catch (error) {
            console.error('保存に失敗しました。:', error);
        }
    }

    const validateRequiredFields = () => {
        const requiredFields = ["name", "age", "email"];
        for (const field of requiredFields) {
            if (!formData[field]) {
                return false;
            }
        }
        return true;
    };



    console.log(formData)



    return (
        <Layout>
            <Header backRoute={'/profile'} headerTitle="プロフィール編集">
                <Head>
                    <title>Profile Edit</title>
                </Head>
                <div className={styles.container}>
                    <div className={styles.content}>
                        <form className={styles.form}>
                            <div className={styles.iconBox} >
                                <input
                                    id="icon"
                                    type="file"
                                    accept="image/*"
                                    onChange={e =>
                                        setFormData({
                                            ...formData,
                                            iconFile: e.target.files[0],
                                        })
                                    }
                                    hidden
                                />
                                {user ? (
                                    formData.iconFile ? (
                                        <>
                                            <label htmlFor="icon">
                                                <img
                                                    src={URL.createObjectURL(
                                                        formData.iconFile,
                                                    )}
                                                    className={styles.icon}
                                                />
                                            </label>
                                            <button
                                                className={styles.clearButton}
                                                onClick={iconClear}>
                                                取消
                                            </button>
                                        </>
                                    ) : user.icon_path ? (
                                        <label htmlFor="icon" className="cursor-pointer">
                                            <Image
                                                src={user.icon_path}
                                                alt="icon"
                                                style="h-20 w-20 rounded-full border border-gray-400"
                                            />
                                        </label>
                                    ) : (
                                        <label htmlFor="icon" className="cursor-pointer">
                                            <img
                                                src="/user_circle_icon.svg"
                                                alt="icon"
                                                className="h-20 w-20 rounded-full border border-gray-400"
                                            />
                                        </label>
                                    )
                                ) : null}
                            </div>

                            <div className={styles.nameBox}>
                                <div className='flex'>
                                    <label className={styles.label} htmlFor="name">ニックネーム</label>
                                    <p>必須</p>
                                </div>
                                <div>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        defaultValue={user?.name}
                                        required
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <div className={styles.emailBox}>
                                <div className='flex'>
                                    <label className={styles.label} htmlFor="email">メールアドレス</label>
                                    <p>必須</p>
                                </div>
                                <div>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        defaultValue={user?.email}
                                        required
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <div className={styles.ageBox}>
                                <div className='flex'>
                                    <label className={styles.label} htmlFor="age">年齢</label>
                                    <p>必須</p>
                                </div>
                                <div>
                                    <input
                                        type="number"
                                        id="age"
                                        name="age"
                                        required
                                        placeholder="例 20"
                                        defaultValue={user?.age}
                                        onChange={handleChange}
                                    />歳
                                </div>

                            </div>

                            <div className={styles.textBox}>
                                <label className={styles.label} htmlFor="text">自己紹介</label>
                                <div>
                                    <textarea
                                        type="text"
                                        id="introduction"
                                        name="introduction"
                                        defaultValue={user?.introduction}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <PrefectureSelect
                                selectedPrefecture={selectedPrefecture}
                                setSelectedPrefecture={setSelectedPrefecture}
                                prefectures={prefectures}
                            />

                            <div >
                                <h2 style={{ fontWeight: "bold", fontSize: "1.1rem", marginTop: "0.5rem" }}>自分のタグ:</h2>
                                <TagDisplay tags={formData.tags} tagColor="lime" message="タグを追加してください" />
                            </div>
                            <div className="flex justify-center mt-4">
                                <Button type="button" onClick={openModal}>タグを編集</Button>
                            </div>

                            {isModalOpen && (
                                <div className={styles.modal}>
                                    <div className={styles.modalContent}>
                                        <TagEditor setFormData={setFormData} selectedTags={formData.tags} closeModal={closeModal} />
                                        <button onClick={closeModal}>閉じる</button>
                                    </div>
                                </div>
                            )}

                            <div className="flex flex-col justify-center items-center m-y-2">
                                <p className={styles.errorText}>{message}</p>
                                <button
                                    className={styles.submitButton}
                                    onClick={submit}>
                                    保存
                                </button>
                            </div>

                        </form>
                    </div>
                </div>
            </Header>
        </Layout>
    )
}

export default Edit
