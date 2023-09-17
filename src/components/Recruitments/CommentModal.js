import styles from '@/styles/components/recruitments/CommentModal.module.css'
import axios from '@/lib/axios';

const CommentModal = ({ isCommentModalOpen, setIsCommentModalOpen, selectedRecruitment, setSelectedRecruitment, userData, newComment, setNewComment }) => {

    const handleCloseCommentModal = () => {
        setIsCommentModalOpen(false);
        setSelectedRecruitment(null);
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Enter' && (event.metaKey || event.ctrlKey)) {
            handleCommentSubmit();
        }
    }

    const handleCommentSubmit = async () => {
        try {
            const response = await axios.post('/api/comments', {
                user_id: userData.id,
                recruitment_id: selectedRecruitment.id,
                comment_text: newComment
            });

            if (response.status === 201) {
                const newCommentObj = {
                    id: response.data.id,
                    user: userData,
                    comment_text: newComment
                };

                setSelectedRecruitment(prevState => ({
                    ...prevState,
                    comments: [...prevState.comments, newCommentObj]
                }));

                setNewComment("");

            }
        } catch (error) {
            console.error("Failed to post the comment:", error);
        }
    };

    return (
        <>
            {
                isCommentModalOpen && (
                    <div
                        style={{
                            position: 'fixed',
                            top: 0, left: 0, right: 0, bottom: 0,
                            zIndex: 10
                        }}
                    >
                        <div className={styles.modal} >
                            <div className={styles.modalContent}>
                                <h2>コメント</h2>
                                <div className={styles.comments}>
                                    {selectedRecruitment.comments.map((comment) => (
                                        <div
                                            className={`${styles.comment} ${comment.user.id === userData.id ? styles.myComment : styles.otherComment}`}
                                            key={comment.id}
                                        >
                                            <img src={comment.user && comment.user.icon_path ? `${process.env.NEXT_PUBLIC_AWS_URL}${comment.user.icon_path}` : '/user_circle_icon.svg'} alt={comment.user ? comment.user.name : 'Unknown User'} />

                                            <div className={styles.commentContent}>
                                                <p className={styles.commentText}>{comment.comment_text}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className={styles.commentInputContainer}>
                                    <textarea
                                        className={styles.commentInput}
                                        value={newComment}
                                        onChange={e => setNewComment(e.target.value)}
                                        placeholder="コメントを入力..."
                                        onKeyDown={handleKeyDown}
                                    />
                                    <button className={styles.commentSubmitButton} onClick={handleCommentSubmit}>送信</button>
                                </div>

                                <button className={styles.commentCloseButton} onClick={handleCloseCommentModal}>閉じる</button>
                            </div>
                        </div>
                    </div>
                )
            }
        </>
    )

}

export default CommentModal