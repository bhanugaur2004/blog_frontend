import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import Loading from '../components/Loading';

const Admin = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [tab, setTab] = useState('users');

    useEffect(() => {
        if (!user || user.role !== 'admin') {
            navigate('/');
            return;
        }
        fetchUsers();
    }, [user]);

    const fetchUsers = async () => {
        try {
            const { data } = await api.get('/users?limit=50');
            setUsers(data.users);
        } catch (err) {
            console.error('Failed to fetch users:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteUser = async (userId) => {
        if (!window.confirm('Delete this user and all their content?')) return;
        try {
            await api.delete(`/users/${userId}`);
            setUsers(users.filter((u) => u._id !== userId));
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to delete user');
        }
    };

    if (loading) return <Loading />;

    return (
        <div className="admin-page">
            <h1 className="admin-title">Admin Dashboard</h1>

            <div className="admin-tabs">
                <button
                    className={`admin-tab ${tab === 'users' ? 'active' : ''}`}
                    onClick={() => setTab('users')}
                >
                    👥 Users ({users.length})
                </button>
            </div>

            {tab === 'users' && (
                <div className="admin-table-container">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>User</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th>Joined</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((u) => (
                                <tr key={u._id}>
                                    <td>
                                        <div className="admin-user-cell">
                                            <span className="admin-avatar">
                                                {u.username?.charAt(0).toUpperCase()}
                                            </span>
                                            {u.username}
                                        </div>
                                    </td>
                                    <td>{u.email}</td>
                                    <td>
                                        <span className={`role-badge ${u.role}`}>{u.role}</span>
                                    </td>
                                    <td>
                                        {new Date(u.createdAt).toLocaleDateString()}
                                    </td>
                                    <td>
                                        {u.role !== 'admin' && (
                                            <button
                                                className="admin-delete-btn"
                                                onClick={() => handleDeleteUser(u._id)}
                                            >
                                                Delete
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default Admin;
