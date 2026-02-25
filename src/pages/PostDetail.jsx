import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import CommentSection from '../components/CommentSection';
import Loading from '../components/Loading';

const PostDetail = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [liked, setLiked] = useState(false);
    const [likesCount, setLikesCount] = useState(0);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const { data } = await api.get(`/posts/${id}`);
                setPost(data.post);
                setLikesCount(data.post.likes?.length || 0);
                if (user) {
                    setLiked(data.post.likes?.includes(user._id));
                }
            } catch (err) {
                console.error('Failed to fetch post:', err);
                navigate('/');
            } finally {
                setLoading(false);
            }
        };
        fetchPost();
    }, [id, user]);

    const handleLike = async () => {
        if (!user) {
            navigate('/login');
            return;
        }
        try {
            const { data } = await api.put(`/posts/${id}/like`);
            setLiked(!liked);
            setLikesCount(data.likesCount);
        } catch (err) {
            console.error('Failed to toggle like:', err);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm('Are you sure you want to delete this post?')) return;
        try {
            await api.delete(`/posts/${id}`);
            navigate('/');
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to delete post');
        }
    };

    if (loading) return <Loading />;
    if (!post) return null;

    const isAuthor = user && user._id === post.author?._id;
    const isAdmin = user && user.role === 'admin';
    const canEdit = isAuthor || isAdmin;

    return (
        <div className="post-detail-page">
            <article className="post-detail">
                {post.coverImage && (
                    <div className="post-detail-cover">
                        <img src={post.coverImage} alt={post.title} />
                    </div>
                )}

                <header className="post-detail-header">
                    <div className="post-detail-tags">
                        {post.tags?.map((tag) => (
                            <Link key={tag} to={`/?tag=${tag}`} className="post-tag">
                                #{tag}
                            </Link>
                        ))}
                    </div>
                    <h1 className="post-detail-title">{post.title}</h1>
                    <div className="post-detail-meta">
                        <Link
                            to={`/profile/${post.author?._id}`}
                            className="post-detail-author"
                        >
                            <span className="author-avatar-lg">
                                {post.author?.username?.charAt(0).toUpperCase()}
                            </span>
                            <div className="author-info">
                                <span className="author-name">{post.author?.username}</span>
                                <span className="post-date">
                                    {new Date(post.createdAt).toLocaleDateString('en-US', {
                                        month: 'long',
                                        day: 'numeric',
                                        year: 'numeric',
                                    })}
                                </span>
                            </div>
                        </Link>

                        {canEdit && (
                            <div className="post-detail-actions">
                                <Link
                                    to={`/edit/${post._id}`}
                                    className="post-action-btn edit-btn"
                                >
                                    ✏️ Edit
                                </Link>
                                <button
                                    className="post-action-btn delete-btn"
                                    onClick={handleDelete}
                                >
                                    🗑️ Delete
                                </button>
                            </div>
                        )}
                    </div>
                </header>

                <div
                    className="post-detail-content ql-editor"
                    dangerouslySetInnerHTML={{ __html: post.content }}
                />

                <div className="post-detail-footer">
                    <button
                        className={`like-btn ${liked ? 'liked' : ''}`}
                        onClick={handleLike}
                    >
                        <span className="like-icon">{liked ? '♥' : '♡'}</span>
                        <span className="like-count">{likesCount}</span>
                        <span className="like-text">
                            {likesCount === 1 ? 'Like' : 'Likes'}
                        </span>
                    </button>
                </div>

                <CommentSection postId={post._id} />
            </article>
        </div>
    );
};

export default PostDetail;
