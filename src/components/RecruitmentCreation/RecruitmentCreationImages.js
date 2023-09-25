import React from 'react'

import styles from '@/styles/components/recruitmentCreation/RecruitmentCreationImages.module.css'

import RecruitmentCreationImage from './RecruitmentCreationImage'
import RecruitmentCreationDefaultImage from './RecruitmentCreationDefaultImage'



const RecruitmentCreationImages = ({ recruitmentForm, setRecruitmentForm }) => {

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


    return (
        <>

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
                    }).map((_, index) => (
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
        </>
    )
}

export default RecruitmentCreationImages