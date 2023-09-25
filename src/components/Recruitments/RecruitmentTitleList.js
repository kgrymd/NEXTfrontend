import React from 'react'
import Link from 'next/link'


const RecruitmentTitleList = ({ recruitments, link }) => {
    return (
        <div className="py-12">
            <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 mt-8">

                <ul>
                    {recruitments && recruitments.map((recruitment) => (
                        <div key={recruitment.id} className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                            {/* ダイナミックルートへのリンクを設定 */}
                            <Link href={`${link}${recruitment.id}`}>
                                <li key={recruitment.id} className="p-6 bg-white border-b border-gray-200">
                                    {recruitment.title}
                                </li>
                            </Link>
                        </div>
                    ))}
                </ul>
            </div>
        </div>
    )
}

export default RecruitmentTitleList