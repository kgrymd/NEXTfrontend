import React from 'react'

const Image = ({ src, alt, style }) => {
    return (
        <img
            src={src ? `${process.env.NEXT_PUBLIC_AWS_URL}${src}` : '/bakachinga.jpg'}
            alt={alt}
            className={style}
        />
    )
}

export default Image