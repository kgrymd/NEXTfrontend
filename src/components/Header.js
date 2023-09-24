import React from 'react'
import { useRouter } from 'next/router'

import styles from '@/styles/components/Header.module.css'

const Header = ({ children, backRoute, headerTitle, chat }) => {

    const router = useRouter()
    return (
        <>
            <div className={styles.header}>
                <div className="flex justify-center h-16 items-center ml-4 w-12">
                    <svg
                        onClick={() => {
                            backRoute ? router.push(backRoute) : router.back()
                        }}
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        // stroke="currentColor"
                        stroke="#84cc16"
                        className={`w-6 h-6 cursor-pointer`}>
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M18.75 19.5l-7.5-7.5 7.5-7.5m-6 15L5.25 12l7.5-7.5"
                        />
                    </svg>
                    <div className={styles.titleContainer}>
                        <h1 className="text-2xl text-white font-bold">
                            {/* もしグループチャットでheaderTitle(募集のタイトル)が10文字より長い場合に、その最初の6文字と「...」を表示する */}
                            {headerTitle && chat && headerTitle.length > 6 ? `${headerTitle.substring(0, 6)}...` : headerTitle}
                        </h1>
                    </div>
                </div>
            </div>
            <main>{children}</main>
        </>
    )
}

export default Header
