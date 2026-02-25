import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import RichTextEditor from '../components/RichTextEditor';

const CreatePost = () => {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        title: '',
        content: '',
        coverImage: '',
        tagsInput: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.title.trim()) {
            setError('Title is required');
            return;
        }
        if (!form.content.trim() || form.content === '<p><br></p>') {
            setError('Content is required');
            return;
        }

        setLoading(true);
        try {
            const tags = form.tagsInput
                .split(',')
                .map((t) => t.trim().toLowerCase())
                .filter(Boolean);

            const { data } = await api.post('/posts', {
                title: form.title.trim(),
                content: form.content,
                coverImage: form.coverImage.trim(),
                tags,
            });

            navigate(`/post/${data.post._id}`);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create post');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="editor-page">
            <div className="editor-container">
                <h1 className="editor-title">Create New Post</h1>

                {error && <div className="auth-error">{error}</div>}

                <form className="editor-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label" htmlFor="title">
                            Title
                        </label>
                        <input
                            id="title"
                            type="text"
                            className="form-input form-input-lg"
                            placeholder="An amazing title for your post..."
                            value={form.title}
                            onChange={(e) =>
                                setForm({ ...form, title: e.target.value })
                            }
                            maxLength={200}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label" htmlFor="coverImage">
                            Cover Image URL (optional)
                        </label>
                        <input
                            id="coverImage"
                            type="url"
                            className="form-input"
                            placeholder="https://example.com/image.jpg"
                            value={form.coverImage}
                            onChange={(e) =>
                                setForm({ ...form, coverImage: e.target.value })
                            }
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label" htmlFor="tags">
                            Tags (comma separated)
                        </label>
                        <input
                            id="tags"
                            type="text"
                            className="form-input"
                            placeholder="javascript, react, webdev"
                            value={form.tagsInput}
                            onChange={(e) =>
                                setForm({ ...form, tagsInput: e.target.value })
                            }
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Content</label>
                        <RichTextEditor
                            value={form.content}
                            onChange={(value) => setForm({ ...form, content: value })}
                            placeholder="Tell your story..."
                        />
                    </div>

                    <div className="editor-actions">
                        <button
                            type="button"
                            className="btn-secondary"
                            onClick={() => navigate(-1)}
                        >
                            Cancel
                        </button>
                        <button type="submit" className="btn-primary" disabled={loading}>
                            {loading ? 'Publishing...' : 'Publish Post'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreatePost;
