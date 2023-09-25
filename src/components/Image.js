import React from 'react'

// APIから取得した画像パスをAWSのURLに変換して表示するためのコンポーネント(プロフィールアイコン用)
const Image = ({ src, alt, style }) => {
    return (
        <img
            src={src ? `${process.env.NEXT_PUBLIC_AWS_URL}${src}` : '/user_circle_icon.svg'}
            // src={src}
            alt={alt}
            className={style}
        />
    )
}

export default Image