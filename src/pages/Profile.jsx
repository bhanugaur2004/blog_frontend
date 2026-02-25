import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import PostCard from '../components/PostCard';
import Loading from '../components/Loading';
import Pagination from '../components/Pagination';

const Profile = () => {
    const { id } = useParams();
    const { user: currentUser, updateUser } = useAuth();
    const [profile, setProfile] = useState(null);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [editing, setEditing] = useState(false);
    const [editForm, setEditForm] = useState({ username: '', bio: '' });
    const [editError, setEditError] = useState('');

    const isOwnProfile = currentUser && currentUser._id === id;

    const fetchProfile = async () => {
        try {
            const { data } = await api.get(`/users/${id}`);
            setProfile(data.user);
            setEditForm({
                username: data.user.username || '',
                bio: data.user.bio || '',
            });
        } catch (err) {
            console.error('Failed to fetch profile:', err);
        }
    };

    const fetchPosts = async (p = 1) => {
        try {
            const { data } = await api.get(`/posts?author=${id}&page=${p}&limit=6`);
            setPosts(data.posts);
            setTotalPages(data.totalPages);
            setPage(data.page);
        } catch (err) {
            console.error('Failed to fetch posts:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setLoading(true);
        fetchProfile();
        fetchPosts(1);
    }, [id]);

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        setEditError('');
        try {
            const { data } = await api.put('/users/profile', {
                username: editForm.username.trim(),
                bio: editForm.bio.trim(),
            });
            setProfile({ ...profile, ...data.user });
            if (isOwnProfile) updateUser(data.user);
            setEditing(false);
        } catch (err) {
            setEditError(err.response?.data?.message || 'Failed to update profile');
        }
    };

    if (loading) return <Loading />;
    if (!profile) return <div className="error-state">User not found</div>;

    return (
        <div className="profile-page">
            <div className="profile-header">
                <div className="profile-avatar-lg">
                    {profile.username?.charAt(0).toUpperCase()}
                </div>

                {editing ? (
                    <form className="profile-edit-form" onSubmit={handleEditSubmit}>
                        {editError && <div className="auth-error">{editError}</div>}
                        <div className="form-group">
                            <input
                                type="text"
                                className="form-input"
                                placeholder="Username"
                                value={editForm.username}
                                onChange={(e) =>
                                    setEditForm({ ...editForm, username: e.target.value })
                                }
                                required
                            />
                        </div>
                        <div className="form-group">
                            <textarea
                                className="form-input"
                                placeholder="Write a short bio..."
                                value={editForm.bio}
                                onChange={(e) =>
                                    setEditForm({ ...editForm, bio: e.target.value })
                                }
                                rows={3}
                                maxLength={500}
                            />
                        </div>
                        <div className="profile-edit-actions">
                            <button type="submit" className="btn-primary btn-sm">
                                Save
                            </button>
                            <button
                                type="button"
                                className="btn-secondary btn-sm"
                                onClick={() => setEditing(false)}
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                ) : (
                    <>
                        <h1 className="profile-username">{profile.username}</h1>
                        {profile.bio && <p className="profile-bio">{profile.bio}</p>}
                        <div className="profile-stats">
                            <div className="profile-stat">
                                <span className="stat-number">{profile.postCount || 0}</span>
                                <span className="stat-label">Posts</span>
                            </div>
                            <div className="profile-stat">
                                <span className="stat-label profile-role">{profile.role}</span>
                            </div>
                            <div className="profile-stat">
                                <span className="stat-label">
                                    Joined{' '}
                                    {new Date(profile.createdAt).toLocaleDateString('en-US', {
                                        month: 'long',
                                        year: 'numeric',
                                    })}
                                </span>
                            </div>
                        </div>
                        {isOwnProfile && (
                            <button
                                className="btn-secondary btn-sm"
                                onClick={() => setEditing(true)}
                            >
                                ✏️ Edit Profile
                            </button>
                        )}
                    </>
                )}
            </div>

            <div className="profile-posts">
                <h2 className="section-title">
                    {isOwnProfile ? 'Your Posts' : `Posts by ${profile.username}`}
                </h2>

                {posts.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-state-icon">📝</div>
                        <h3>No posts yet</h3>
                        {isOwnProfile && (
                            <Link to="/create" className="btn-primary">
                                Write your first post
                            </Link>
                        )}
                    </div>
                ) : (
                    <>
                        <div className="posts-grid">
                            {posts.map((post) => (
                                <PostCard key={post._id} post={post} />
                            ))}
                        </div>
                        <Pagination
                            page={page}
                            totalPages={totalPages}
                            onPageChange={(p) => fetchPosts(p)}
                        />
                    </>
                )}
            </div>
        </div>
    );
};

export default Profile;
