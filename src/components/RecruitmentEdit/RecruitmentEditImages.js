import React from 'react'

import styles from '@/styles/components/recruitmentCreation/recruitmentCreationImages.module.css'

import RecruitmentEditImage from '../RecruitmentEdit/RecruitmentEditImage.js'
import RecruitmentCreationDefaultImage from '../RecruitmentCreation/RecruitmentCreationDefaultImage.js'



const RecruitmentEditImages = ({ recruitmentForm, setRecruitmentForm }) => {


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

    const getImageSrc = (image) => {
        if (image.image_path) {
            // imageがimage_pathプロパティを持つオブジェクトの場合
            return image.image_path;
        } else if (typeof image === "object" && image instanceof File) {
            // 画像がFileオブジェクトの場合
            return URL.createObjectURL(image);
        }
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
                        <RecruitmentEditImage
                            key={index}
                            index={index}
                            src={getImageSrc(image)}
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

export default RecruitmentEditImages