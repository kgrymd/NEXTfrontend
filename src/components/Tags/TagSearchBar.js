import styles from '@/styles/components/Tags/TagSearchBar.module.css'


function TagSearchBar({ value, onChange, onAdd, tagExists }) {
    return (
        // <div className={styles.searchBar}>
        <div >
            <input
                type="text"
                value={value}
                onChange={onChange}
                placeholder="Search tags..."
            />
            {!tagExists && value !== '' && (
                <button onClick={onAdd} className={styles.tagCreateButton}>作成して追加</button>
            )}
        </div>
    );
}
export default TagSearchBar