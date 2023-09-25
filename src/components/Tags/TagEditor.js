import React, { useState, useEffect } from 'react';

import styles from '@/styles/components/Tags/TagEditor.module.css'

import axios from "@/lib/axios";

import TagSearchBar from '@/components/Tags/TagSearchBar'
import TagDisplay from '@/components/Tags/TagDisplay'

function TagEditor(props) {

    // console.log('props', props)


    const [tags, setTags] = useState([]); // すべてのタグ
    const [selectedTags, setSelectedTags] = useState(props.selectedTags); // ユーザーが選んだタグ →設定しているタグ＆設定するタグ
    const [searchInput, setSearchInput] = useState(''); // 検索フィールドの値
    const [isModified, setIsModified] = useState(false); // タグが編集されたかどうか



    // コンポーネントマウント時に一度だけ全タグをフェッチ
    useEffect(() => {
        async function fetchTags() {
            const response = await axios.get('/api/tags');
            setTags(response.data.data); //all()にするか、無限スクロールにするかで変わってくる。とりあえずcursorPagenate(20)にしてる
        }
        fetchTags();
    }, []);


    // ユーザーがタグを削除したときの処理
    const handleTagRemoval = (tagId) => {
        const updatedTags = selectedTags.filter((tag) => tag.id !== tagId);
        setSelectedTags(updatedTags);
        setIsModified(true);
    };

    // タグを追加したときの処理
    const handleTagAddition = (tag) => {
        setSelectedTags([...selectedTags, tag]);
        setIsModified(true);
    };

    // 新しいタグを作成して保存する関数
    const createAndAddNewTag = async (e) => {
        e.preventDefault()
        try {
            // 新しいタグを作成するAPIを叩く
            const response = await axios.post('/api/tags', { name: searchInput });

            // 新しいタグをユーザーのタグに追加
            handleTagAddition(response.data);
            // console.log(response.data);
        } catch (error) {
            console.log("タグの作成に失敗しました。", error);
        }

    };

    // タグの保存
    const handleSave = async () => {

        props.setFormData(prev => ({ ...prev, tags: selectedTags }));

        props.closeModal()
    };

    // 入力されたタグ名が既存のタグに存在するかを確認
    const tagExists = tags.some(tag => tag.name === searchInput);


    // タグの検索フィルタリング
    // const selectedTagIds = new Set(selectedTags.map(tag => tag.id));　もともとユニークなのでSetじゃなくてよい。
    const selectedTagIds = selectedTags.map(tag => tag.id);
    const filteredTags = (Array.isArray(tags) ? tags : [])
        // .filter(tag => !selectedTagIds.has(tag.id)) hasはSetオブジェクトのメソッドなのでarrayでは使えぬ。ただ、hasは一般的にincludesよりも高速らしい...
        .filter(tag => !selectedTagIds.includes(tag.id))
        .filter(tag => tag.name.includes(searchInput));

    return (
        <>

            <div className={styles.container}>
                <div className={styles.content}>
                    <h1 className={styles.title}>タグを編集</h1>

                    <TagSearchBar
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        onAdd={createAndAddNewTag}
                        tagExists={tagExists}
                    />
                    <div>
                        <h3 className="font-bold">保存するタグ:</h3>
                        <TagDisplay tags={selectedTags} onTagClick={(tag) => handleTagRemoval(tag.id)} tagColor="blue" message="タグを追加してください" />
                    </div>
                    <button onClick={handleSave} className={styles.saveButton}>保存</button>

                    <div className={`${styles.flexContainer} ${styles.gap}`}>
                        <h3 className="font-bold">タグを選択:</h3>
                        <TagDisplay tags={filteredTags} onTagClick={handleTagAddition} tagColor="red" message="検索に一致するタグはまだありません" />
                    </div>

                </div>
            </div>
        </>

    );
}

export default TagEditor;
