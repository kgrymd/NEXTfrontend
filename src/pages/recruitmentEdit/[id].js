import { useState, useEffect } from 'react'
import Head from 'next/head'
import useSWR from 'swr';
import { useRouter } from 'next/router';

import styles from '@/styles/recruitmentCreation.module.css'

import axios from '@/lib/axios'

import Layout from '@/components/Layouts/Layout'
import FooterTabBar from '@/components/FooterTabBar'
import Textarea from '@/components/Textarea'
import Button from '@/components/Button'
import TagEditor from '@/components/Tags/TagEditor'
import TagDisplay from '@/components/Tags/TagDisplay'
import PrefectureSelect from '@/components/PrefectureSelect'
import RecruitmentEditImages from '@/components/RecruitmentEdit/RecruitmentEditImages';

import { useAuth } from '@/hooks/auth'
import Header from '@/components/Header';

const RecruitmentEdit = () => {
    const { user } = useAuth({ middleware: 'auth' })

    const router = useRouter();
    const { id } = router.query; // URLから募集のIDを取得

    const fetcher = url => axios.get(url).then(res => res.data);

    const { data: recruitmentData, error: recruitmentDataError } = useSWR(`/api/recruitments/${id}`, fetcher);
    const { data: prefectures, prefecturesError } = useSWR('/api/prefectures', fetcher);

    if (recruitmentDataError || prefecturesError) console.error("Error fetching the data:", recruitmentDataError || prefecturesError);

    const [selectedPrefecture, setSelectedPrefecture] = useState(recruitmentData?.prefecture_id || 1);
    const [message, setMessage] = useState('')
    // モーダル表示のためのState
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [recruitmentForm, setRecruitmentForm] = useState({
        title: recruitmentData?.title || '',
        description: recruitmentData?.description || '',
        youtube_url: recruitmentData?.youtube_url || '',
        reference_url: recruitmentData?.reference_url || '',
        age_from: recruitmentData?.age_from || '',
        age_to: recruitmentData?.age_to || '',
        min_people: recruitmentData?.min_people || '',
        max_people: recruitmentData?.max_people || '',
        start_date: recruitmentData?.start_date || '',
        end_date: recruitmentData?.end_date || '',
        images: recruitmentData?.images || [],
        tags: recruitmentData?.tags || [],
    })


    console.log(recruitmentForm)


    useEffect(() => {
        if (recruitmentData) {
            // データがロードされたときに状態を更新
            setRecruitmentForm({
                title: recruitmentData.title,
                description: recruitmentData.description,
                youtube_url: recruitmentData.youtube_url,
                reference_url: recruitmentData.reference_url,
                age_from: recruitmentData.age_from,
                age_to: recruitmentData.age_to,
                min_people: recruitmentData.min_people,
                max_people: recruitmentData.max_people,
                start_date: recruitmentData.start_date,
                end_date: recruitmentData.end_date,
                images: recruitmentData.images,
                tags: recruitmentData.tags,
            });
        }
    }, [recruitmentData]);


    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setRecruitmentForm(prev => ({ ...prev, [name]: value }));
    }

    const openModal = () => {
        setIsModalOpen(true);
    }

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

        data.append('title', recruitmentForm.title)
        recruitmentForm.description && data.append('description', recruitmentForm.description)
        recruitmentForm.youtube_url && data.append('youtube_url', recruitmentForm.youtube_url)
        recruitmentForm.reference_url && data.append('reference_url', recruitmentForm.reference_url)
        selectedPrefecture && data.append('prefecture_id', selectedPrefecture)
        recruitmentForm.age_from && data.append('age_from', recruitmentForm.age_from)
        recruitmentForm.age_to && data.append('age_to', recruitmentForm.age_to)
        recruitmentForm.min_people && data.append('min_people', recruitmentForm.min_people)
        recruitmentForm.max_people && data.append('max_people', recruitmentForm.max_people)
        data.append('start_date', recruitmentForm.start_date)
        data.append('end_date', recruitmentForm.end_date)

        // recruitmentForm.images.forEach((image, index) => {
        //     data.append(`images[${index}]`, image);
        // });

        recruitmentForm.images.forEach((image, index) => {
            if (image instanceof File) {
                // data.append(`images[${index}]`, image);
                data.append(`newImages[${index}]`, image);
            } else {
                // 既存の画像のIDを送信する。このようにIDだけを送信すれば、バックエンド側で画像が変更されていないことを判別できます。
                data.append(`images[${index}]`, image.id);
                // data.append(`images[${index}]`, image.id);
            }
        });

        recruitmentForm.tags.forEach((tag, index) => {
            data.append(`tags[${index}]`, tag.id);
        });

        console.log("Sending Images Data:", recruitmentForm.images);

        try {
            const response = await axios.post(`/api/recruitments/${id}`, data, {
                headers: { 'content-type': 'multipart/form-data' },
            })
            console.log(response.status)
            if (response.status === 200) {
                router.back();
            } else {
                setMessage('エラーが発生しました。')
            }
        } catch (error) {
            if (error.response) {
                if (error.response.status === 422) {
                    setMessage('バリデーションエラーが発生しました。必須項目、画像サイズ、urlが適切か確認してください。')
                } else if (error.response.status === 403) {
                    setMessage(`募集の作成者以外編集はできません。`)
                } else {
                    setMessage(
                        `エラーが発生しました。ステータスコード: ${error.response.status}`,
                    )
                }
            } else if (error.request) {
                setMessage('サーバからレスポンスがありませんでした。')
            } else {
                setMessage('エラーが発生しました。')
            }
        }

    }

    const validateRequiredFields = () => {
        const requiredFields = ["title", "end_date", "start_date"];
        for (const field of requiredFields) {
            if (!recruitmentForm[field]) {
                return false;
            }
        }
        return true;
    };


    return (
        <Layout>
            <Head>
                <title>Recruitment creation page</title>
            </Head>
            <Header headerTitle="募集編集" />

            <div className={styles.container}>
                <div className={styles.content}>
                    <div className={styles.formName}>
                        <h2>タイトル</h2>
                        <p>必須</p>
                    </div>
                    <input
                        type="text"
                        name="title"
                        value={recruitmentForm.title}
                        onChange={handleInputChange}
                        placeholder="タイトル"
                        className={styles.inputTitle}
                    />
                    <div className={styles.formName}>
                        <h2>YouTubeのURL</h2>
                    </div>
                    <input
                        type="text"
                        name="youtube_url"
                        value={recruitmentForm.youtube_url}
                        onChange={handleInputChange}
                        placeholder="URLを貼り付けてください"
                        className={styles.inputURL}
                    />
                    <div className={styles.formName}>
                        <h2>画像を追加</h2>
                        <p>1ファイル2MBまで</p>
                    </div>
                    <RecruitmentEditImages
                        recruitmentForm={recruitmentForm}
                        setRecruitmentForm={setRecruitmentForm}
                    />
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
                        placeholder="URLを貼り付けてください"
                        className={styles.inputURL}
                    />

                    <PrefectureSelect
                        selectedPrefecture={selectedPrefecture}
                        setSelectedPrefecture={setSelectedPrefecture}
                        prefectures={prefectures}
                    />

                    <div className={styles.formName}>
                        <h2>募集年齢</h2>
                    </div>
                    <div className={styles.range}>
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
                    <div className={styles.range}>
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
                        <h2>募集開始日</h2>
                        <p>必須</p>
                    </div>
                    <input
                        type="date"
                        name="start_date"
                        value={recruitmentForm.start_date}
                        onChange={handleInputChange}
                        className={styles.inputDate}
                    />

                    <div className={styles.formName}>
                        <h2>募集終了日</h2>
                        <p>必須</p>
                    </div>
                    <input
                        type="date"
                        name="end_date"
                        value={recruitmentForm.end_date}
                        onChange={handleInputChange}
                        className={styles.inputDate}
                    />

                    <div>
                        <h2 style={{ fontWeight: "bold", fontSize: "1.1rem", marginTop: "0.5rem" }}>募集のタグ:</h2>
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
                            更新！
                        </button>
                    </div>
                </div>
            </div>
            <FooterTabBar user={user} />
        </Layout>
    )
}


export default RecruitmentEdit
