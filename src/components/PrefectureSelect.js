import React from 'react'

import styles from '@/styles/components/PrefectureSelect.module.css'

const PrefectureSelect = ({ selectedPrefecture, setSelectedPrefecture, prefectures = [] }) => {
    return (
        <div className={styles.prefectureBox}>
            <div className={styles.formName}>
                <label htmlFor="prefecture"><h2>都道府県</h2></label>
            </div>
            <div>
                <select
                    id="prefecture"
                    name="prefecture"
                    value={selectedPrefecture}
                    onChange={e => setSelectedPrefecture(e.target.value)}
                >
                    {/* <option value="">選択してください</option> */}
                    {prefectures.map(pref => (
                        <option key={pref.id} value={pref.id}>
                            {pref.name}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    )
}

export default PrefectureSelect