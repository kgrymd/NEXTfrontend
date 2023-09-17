import { useState } from 'react'
import Head from 'next/head'
import useSWR from 'swr';

import styles from '@/styles/recruitmentCreation.module.css'

import axios from '@/lib/axios'

import Layout from '@/components/Layouts/Layout'
import FooterTabBar from '@/components/FooterTabBar'
import RecruitmentCreationImage from '@/components/Recruitments/RecruitmentCreationImage'
import RecruitmentCreationDefaultImage from '@/components/Recruitments/RecruitmentCreationDefaultImage'
import Textarea from '@/components/Textarea'
import Button from '@/components/Button'
import TagEditor from '@/components/TagEditor'
import TagDisplay from '@/components/TagDisplay'
import PrefectureSelect from '@/components/PrefectureSelect'

import { useAuth } from '@/hooks/auth'

const RecruitmentCreation = () => {
    const { user } = useAuth({ middleware: 'auth' })

    const fetcher = url => axios.get(url).then(res => res.data);

    const { data: prefectures, error } = useSWR('/api/prefectures', fetcher);
    if (error) console.error('prefecturesの取得に失敗しました。:', error);


    const [selectedPrefecture, setSelectedPrefecture] = useState(user?.prefecture_id || null);

    const [message, setMessage] = useState('')

    // モーダル表示のためのState
    const [isModalOpen, setIsModalOpen] = useState(false);


    const [recruitmentForm, setRecruitmentForm] = useState({
        title: '',
        description: '',
        youtube_url: '',
        reference_url: '',
        age_from: '',
        age_to: '',
        min_people: '',
        max_people: '',
        start_date: '',
        end_date: '',
        images: [],
        tags: [],
    })


    console.log(recruitmentForm)

    const handleRecruitmentImageChange = e => {
        const files = Array.from(e.target.files);
        if (files.length > 6) {
            setMessage("最大6枚の画像をアップロードできます。");
            return;
        }
        setRecruitmentForm(prev => ({ ...prev, images: [...prev.images, ...files] }));

    }


    const handleDeleteRecruitmentImage = index => {
        const newRecruitmentImages = [...recruitmentForm.images] // 画像配列のコピーを作成
        newRecruitmentImages.splice(index, 1) // 指定されたインデックスの画像を削除
        setRecruitmentForm(prev => ({ ...prev, images: newRecruitmentImages })); // 画像配列を更新

    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setRecruitmentForm(prev => ({ ...prev, [name]: value }));
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

        data.append('title', recruitmentForm.title)
        data.append('description', recruitmentForm.description)
        data.append('youtube_url', recruitmentForm.youtube_url)
        data.append('reference_url', recruitmentForm.reference_url)
        data.append('prefecture_id', selectedPrefecture)
        data.append('age_from', recruitmentForm.age_from)
        data.append('age_to', recruitmentForm.age_to)
        data.append('min_people', recruitmentForm.min_people)
        data.append('max_people', recruitmentForm.max_people)
        data.append('start_date', recruitmentForm.start_date)
        data.append('end_date', recruitmentForm.end_date)

        recruitmentForm.images.forEach((image, index) => {
            data.append(`images[${index}]`, image);
        });

        recruitmentForm.tags.forEach((tag, index) => {
            data.append(`tags[${index}]`, tag.id);
        });

        try {
            const response = await axios.post('/api/recruitments', data, {
                headers: { 'content-type': 'multipart/form-data' },
            })
            console.log(response.status)
            if (response.status === 200) {
                window.location.href = '/recruitments'
            } else {
                setMessage('エラーが発生しました。')
            }
        } catch (error) {
            if (error.response) {
                setMessage(
                    `エラーが発生しました。ステータスコード: ${error.response.status}`,
                )
            } else if (error.request) {
                setMessage('サーバからレスポンスがありませんでした。')
            } else {
                setMessage('エラーが発生しました。')
            }
        }

    }


    return (
        <Layout>
            <Head>
                <title>Recruitment creation page</title>
            </Head>
            <div className={styles.header}>
                <h1>募集作成ページ</h1>
            </div>

            <div className={styles.container}>
                <div className={styles.content}>
                    {/* ページコンテンツ */}
                    <div className={styles.formName}>
                        <h2>タイトル</h2>
                    </div>
                    <input
                        type="text"
                        name="title"
                        value={recruitmentForm.title}
                        onChange={handleInputChange}
                        placeholder="タイトル"
                    />
                    <div className={styles.formName}>
                        <h2>YouTubeのURL</h2>
                    </div>
                    <input
                        type="text"
                        name="youtube_url"
                        value={recruitmentForm.youtube_url}
                        onChange={handleInputChange}
                        placeholder="YoutubeのURLを貼り付けてください"
                    />
                    <div className={styles.formName}>
                        <h2>画像を追加</h2>
                    </div>
                    <input
                        id="recruitmentImageInput"
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleRecruitmentImageChange}
                        hidden
                        required
                    />
                    <div className={styles.recruitmentImagesContainer}>
                        <div className={styles.imageContainer}>
                            {recruitmentForm.images.map((image, index) => (
                                <RecruitmentCreationImage
                                    key={index}
                                    index={index}
                                    src={URL.createObjectURL(image)}
                                    onDelete={() =>
                                        handleDeleteRecruitmentImage(index)
                                    }
                                />
                            ))}
                            {Array.from({
                                length: 6 - recruitmentForm.images.length,
                            }).map((defaultImage, index) => (
                                <label
                                    htmlFor="recruitmentImageInput"
                                    className="cursor-pointer"
                                    key={index + recruitmentForm.images.length}>
                                    <RecruitmentCreationDefaultImage
                                        index={index + recruitmentForm.images.length}
                                        src="gallery.png"
                                    />
                                </label>
                            ))}
                        </div>
                    </div>
                    <div className={styles.textareaBox}>
                        <div className={styles.formName}>
                            <h2>募集文</h2>
                        </div>
                        <Textarea
                            onChange={handleInputChange}
                            placeholder="募集文を入力"

                            type="text"
                            name="description"
                            value={recruitmentForm.description}
                        />
                    </div>

                    <div className={styles.formName}>
                        <h2>参考URL</h2>
                    </div>
                    <input
                        type="text"
                        name="reference_url"
                        value={recruitmentForm.reference_url}
                        onChange={handleInputChange}
                        placeholder="参考URLを貼り付けてください"
                    />

                    <PrefectureSelect
                        selectedPrefecture={selectedPrefecture}
                        setSelectedPrefecture={setSelectedPrefecture}
                        prefectures={prefectures}
                    />

                    <div className={styles.formName}>
                        <h2>募集の年齢範囲</h2>
                    </div>
                    <div className={styles.ageRange}>
                        <input
                            type="number"
                            name="age_from"
                            value={recruitmentForm.age_from}
                            onChange={handleInputChange}
                            placeholder="最小年齢"
                            className={styles.inputAge}
                        />
                        〜
                        <input
                            type="number"
                            name="age_to"
                            value={recruitmentForm.age_to}
                            onChange={handleInputChange}
                            placeholder="最大年齢"
                            className={styles.inputAge}
                        />
                    </div>

                    <div className={styles.formName}>
                        <h2>募集人数</h2>
                    </div>
                    <div className={styles.peopleRange}>
                        <input
                            type="number"
                            name="min_people"
                            value={recruitmentForm.min_people}
                            onChange={handleInputChange}
                            placeholder="最小人数"
                            className={styles.inputPeople}
                        />
                        〜
                        <input
                            type="number"
                            name="max_people"
                            value={recruitmentForm.max_people}
                            onChange={handleInputChange}
                            placeholder="最大人数"
                            className={styles.inputPeople}
                        />
                    </div>

                    <div className={styles.formName}>
                        <h2>開始日</h2>
                    </div>
                    <input
                        type="date"
                        name="start_date"
                        value={recruitmentForm.start_date}
                        onChange={handleInputChange}
                        className={styles.inputDate}
                    />

                    <div className={styles.formName}>
                        <h2>終了日</h2>
                    </div>
                    <input
                        type="date"
                        name="end_date"
                        value={recruitmentForm.end_date}
                        onChange={handleInputChange}
                        className={styles.inputDate}
                    />

                    <div>
                        <h3 className="font-bold">募集のタグ:</h3>
                        <TagDisplay tags={recruitmentForm.tags} tagColor="lime" message="タグを追加してください" />
                    </div>
                    <div className="flex justify-center">
                        <Button type="button" onClick={openModal}>タグを編集</Button>
                    </div>

                    {isModalOpen && (
                        <div className={styles.modal}>
                            <div className={styles.modalContent}>
                                <TagEditor setFormData={setRecruitmentForm} selectedTags={recruitmentForm.tags} closeModal={closeModal} />
                                <button onClick={closeModal}>閉じる</button>
                            </div>
                        </div>
                    )}

                    <div className={styles.buttonBox}>

                        <p className={styles.errorText}>{message}</p>
                        <button
                            className={styles.createButton}
                            onClick={submit}>
                            作成！
                        </button>
                    </div>
                </div>
            </div>
            <FooterTabBar user={user} />
        </Layout>
    )
}


export default RecruitmentCreation
