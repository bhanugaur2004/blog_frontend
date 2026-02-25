import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

const CommentSection = ({ postId }) => {
    const { user } = useAuth();
    const [comments, setComments] = useState([]);
    const [text, setText] = useState('');
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const fetchComments = async (p = 1) => {
        try {
            const { data } = await api.get(`/comments/${postId}?page=${p}&limit=10`);
            setComments(data.comments);
            setTotalPages(data.totalPages);
            setPage(data.page);
        } catch (err) {
            console.error('Failed to load comments:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchComments();
    }, [postId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!text.trim()) return;

        setSubmitting(true);
        try {
            const { data } = await api.post(`/comments/${postId}`, {
                text: text.trim(),
            });
            setComments([data.comment, ...comments]);
            setText('');
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to post comment');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (commentId) => {
        if (!window.confirm('Delete this comment?')) return;
        try {
            await api.delete(`/comments/${commentId}`);
            setComments(comments.filter((c) => c._id !== commentId));
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to delete comment');
        }
    };

    return (
        <div className="comment-section">
            <h3 className="comment-section-title">
                Comments ({comments.length})
            </h3>

            {user && (
                <form className="comment-form" onSubmit={handleSubmit}>
                    <div className="comment-form-avatar">
                        {user.username?.charAt(0).toUpperCase()}
                    </div>
                    <div className="comment-form-body">
                        <textarea
                            className="comment-input"
                            placeholder="Write a comment..."
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            rows={3}
                            maxLength={1000}
                        />
                        <button
                            type="submit"
                            className="comment-submit-btn"
                            disabled={submitting || !text.trim()}
                        >
                            {submitting ? 'Posting...' : 'Post Comment'}
                        </button>
                    </div>
                </form>
            )}

            {!user && (
                <p className="comment-login-prompt">
                    Please <a href="/login">log in</a> to leave a comment.
                </p>
            )}

            {loading ? (
                <p className="comment-loading">Loading comments...</p>
            ) : comments.length === 0 ? (
                <p className="comment-empty">
                    No comments yet. Be the first to share your thoughts!
                </p>
            ) : (
                <div className="comment-list">
                    {comments.map((comment) => (
                        <div key={comment._id} className="comment-item">
                            <div className="comment-avatar">
                                {comment.author?.username?.charAt(0).toUpperCase()}
                            </div>
                            <div className="comment-content">
                                <div className="comment-header">
                                    <span className="comment-author">
                                        {comment.author?.username}
                                    </span>
                                    <span className="comment-date">
                                        {new Date(comment.createdAt).toLocaleDateString('en-US', {
                                            month: 'short',
                                            day: 'numeric',
                                            year: 'numeric',
                                        })}
                                    </span>
                                </div>
                                <p className="comment-text">{comment.text}</p>
                                {user &&
                                    (user._id === comment.author?._id ||
                                        user.role === 'admin') && (
                                        <button
                                            className="comment-delete-btn"
                                            onClick={() => handleDelete(comment._id)}
                                        >
                                            Delete
                                        </button>
                                    )}
                            </div>
                        </div>
                    ))}

                    {totalPages > 1 && (
                        <div className="comment-pagination">
                            {page > 1 && (
                                <button
                                    className="comment-page-btn"
                                    onClick={() => fetchComments(page - 1)}
                                >
                                    ← Newer
                                </button>
                            )}
                            {page < totalPages && (
                                <button
                                    className="comment-page-btn"
                                    onClick={() => fetchComments(page + 1)}
                                >
                                    Older →
                                </button>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default CommentSection;
