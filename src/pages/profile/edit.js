import React from 'react'
import styles from '@/styles/profileEdit.module.css'

import Layout from '@/components/Layouts/Layout'
import Header from '@/components/Header'
import Head from 'next/head'
import Image from '@/components/Image'

import { useAuth } from '@/hooks/auth'
import { useState } from 'react'
import { useEffect } from 'react'
import axios from '@/lib/axios'

const edit = () => {
    const { user } = useAuth({ middleware: 'auth' })


    // APIから取得した都道府県データを格納するstateを追加
    const [prefectures, setPrefectures] = useState([]);
    const [selectedPrefecture, setSelectedPrefecture] = useState(null);


    const [formData, setFormData] = useState({
        iconFile: '',
        age: '',
        name: '',
        email: '',
        introduction: '',
    })

    const handleChange = e => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const iconClear = e => {
        e.preventDefault()
        setFormData({ ...formData, iconFile: '' })
    }

    const submit = async e => {
        e.preventDefault()
        // 都道府県(selectedPrefectureに初期値を設定されるので意味がなくなる為保存buttonをdisabledで対応のみにする。
        // if (
        //     Object.values(formData).every(value => value === '') &&
        //     !selectedPrefecture
        // ) {
        //     console.log('Please fill out the form');
        //     return;
        // }


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

        try {
            const response = await axios.post('/api/my/data', data, {
                headers: {
                    'content-type': 'multipart/form-data',
                    'X-HTTP-Method-Override': 'PATCH',
                },
            })
            console.log(response.status)
            if (response.status === 204) {
                window.location.href = '/profile/me'
            } else {
                setMessage('エラーが発生しました。')
            }
        } catch (error) {
            if (error.response) {
                console.log(
                    `エラーが発生しました。ステータスコード: ${error.response.status}`,
                )
            }
        }
    }
    // useEffectを使ってAPIから都道府県のデータを取得
    useEffect(() => {
        const fetchPrefectures = async () => {
            try {
                const response = await axios.get('/api/prefectures');
                setPrefectures(response.data);
                setSelectedPrefecture(user?.prefecture_id); // 初期値として設定
            } catch (error) {
                console.error('Failed to fetch prefectures:', error);
            }
        };

        fetchPrefectures();
    }, []);

    console.log(formData)
    console.log(selectedPrefecture)

    return (
        <Layout>
            <Header>
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
                                                clear
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
                                                src="/bakachinga.jpg"
                                                alt="icon"
                                                className="h-20 w-20 rounded-full border border-gray-400"
                                            />
                                        </label>
                                    )
                                ) : null}
                            </div>

                            <div className={styles.nameBox}>
                                <label htmlFor="name">ユーザー名</label>
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
                                <label htmlFor="email">メールアドレス</label>
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
                                <label htmlFor="age">年齢</label>
                                <div>
                                    <input
                                        type="number"
                                        id="age"
                                        name="age"
                                        required
                                        placeholder="例 20"
                                        defaultValue={user?.age}
                                        onChange={handleChange}
                                    />
                                    歳
                                </div>
                            </div>

                            <div className={styles.textBox}>
                                <label htmlFor="text">自己紹介</label>
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

                            <div className={styles.prefectureBox}>
                                <label htmlFor="prefecture">都道府県</label>
                                <div>
                                    <select
                                        id="prefecture"
                                        name="prefecture"
                                        value={selectedPrefecture}
                                        onChange={e => setSelectedPrefecture(e.target.value)}
                                    >
                                        {/* <option value="">選択してください</option> */}
                                        {prefectures.map(pref => (
                                            <option key={pref.id} value={pref.id}>
                                                {pref.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>


                            <button
                                className={styles.submitButton}
                                disabled={
                                    Object.values(formData).every(
                                        value => value === '',
                                    ) && !selectedPrefecture
                                        ? true
                                        : false
                                }
                                onClick={submit}>
                                保存
                            </button>

                        </form>
                    </div>
                </div>
            </Header>
        </Layout>
    )
}

export default edit
