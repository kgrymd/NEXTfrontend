import { useState, useEffect } from 'react';
import Head from 'next/head';
import useSWR from 'swr';

// Styles
import styles from '@/styles/profileEdit.module.css';

// Libs
import axios from '@/lib/axios';

// Components
import Layout from '@/components/Layouts/Layout';
import Header from '@/components/Header';
import Image from '@/components/Image';
import PrefectureSelect from '@/components/PrefectureSelect';
import TagDisplay from '@/components/TagDisplay';
import Button from '@/components/Button';
import TagEditor from '@/components/TagEditor';

// Hooks
import { useAuth } from '@/hooks/auth';


const Edit = () => {
    const { user } = useAuth({ middleware: 'auth' })

    const [selectedPrefecture, setSelectedPrefecture] = useState(user?.prefecture_id || null);
    // モーダル表示のためのState
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        iconFile: '',
        age: '',
        name: '',
        email: '',
        introduction: '',
        tags: [],
    })


    const fetcher = url => axios.get(url).then(res => res.data).catch(error => {
        throw error.response.data;
    });


    // const { data: userData = { tags: [] }, mutate, error: userError } = useSWR('/api/me', fetcher);　← = { tags: [] }いらんよな？たぶん何かしらの理由で一時的に必要だったのだろうが忘れた
    const { data: userData, error: userError } = useSWR('/api/me', fetcher);
    const { data: prefectures, error: prefectureError } = useSWR('/api/prefectures', fetcher);

    if (userError) console.error('ユーザーデータの取得に失敗しました。:', userError);
    if (prefectureError) console.error('prefecturesの取得に失敗しました。:', prefectureError);


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

    // Todo: タグ編集をコンポーネント化してモーダルで編集できるようにしたから、disabledの設定をやめるか何とか別の方法でするか
    const isSaveButtonDisabled = (formData) => {
        return (
            Object.values(formData).every(
                value => value === '',
            ) && (selectedPrefecture === user?.prefecture_id || !selectedPrefecture)
                ? true
                : false
        )
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

    console.log(formData)
    // console.log(selectedPrefecture)

    return (
        <Layout>
            <Header backRoute={'/profile'}>
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

                            <PrefectureSelect
                                selectedPrefecture={selectedPrefecture}
                                setSelectedPrefecture={setSelectedPrefecture}
                                prefectures={prefectures}
                            />

                            <div>
                                <h3 className="font-bold">自分のタグ:</h3>
                                <TagDisplay tags={formData.tags} tagColor="lime" message="タグを追加してください" />
                            </div>
                            <div className="flex justify-center">
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

                            <button
                                className={styles.submitButton}
                                disabled={isSaveButtonDisabled(formData)}
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

export default Edit
