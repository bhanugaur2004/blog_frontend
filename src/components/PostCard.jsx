import { Link } from 'react-router-dom';

const PostCard = ({ post }) => {
    const getExcerpt = (html) => {
        if (!html) return '';
        const doc = new DOMParser().parseFromString(html, 'text/html');
        return doc.body.textContent.substring(0, 150) + '...';
    };

    const excerpt = getExcerpt(post.content);

    return (
        <article className="post-card">
            {post.coverImage && (
                <div className="post-card-image">
                    <img src={post.coverImage} alt={post.title} />
                </div>
            )}
            <div className="post-card-body">
                <div className="post-card-tags">
                    {post.tags?.map((tag) => (
                        <Link key={tag} to={`/?tag=${tag}`} className="post-tag">
                            #{tag}
                        </Link>
                    ))}
                </div>
                <Link to={`/post/${post._id}`} className="post-card-title-link">
                    <h2 className="post-card-title">{post.title}</h2>
                </Link>
                <p className="post-card-excerpt">{excerpt}</p>
                <div className="post-card-footer">
                    <Link
                        to={`/profile/${post.author?._id}`}
                        className="post-card-author"
                    >
                        <span className="author-avatar">
                            {post.author?.username?.charAt(0).toUpperCase()}
                        </span>
                        <span className="author-name">{post.author?.username}</span>
                    </Link>
                    <div className="post-card-meta">
                        <span className="post-date">
                            {new Date(post.createdAt).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                            })}
                        </span>
                        <span className="post-likes">♥ {post.likes?.length || 0}</span>
                    </div>
                </div>
            </div>
        </article>
    );
};

export default PostCard;
