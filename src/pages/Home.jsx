import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../api/axios';
import PostCard from '../components/PostCard';
import SearchBar from '../components/SearchBar';
import TagFilter from '../components/TagFilter';
import Pagination from '../components/Pagination';
import Loading from '../components/Loading';

const Home = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [posts, setPosts] = useState([]);
    const [tags, setTags] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(parseInt(searchParams.get('page')) || 1);
    const [totalPages, setTotalPages] = useState(1);
    const [search, setSearch] = useState(searchParams.get('search') || '');
    const [selectedTag, setSelectedTag] = useState(
        searchParams.get('tag') || ''
    );

    const fetchPosts = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            params.set('page', page);
            params.set('limit', '9');
            if (search) params.set('search', search);
            if (selectedTag) params.set('tag', selectedTag);

            const { data } = await api.get(`/posts?${params.toString()}`);
            setPosts(data.posts);
            setTotalPages(data.totalPages);
        } catch (err) {
            console.error('Failed to fetch posts:', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchTags = async () => {
        try {
            const { data } = await api.get('/posts/tags/all');
            setTags(data.tags);
        } catch (err) {
            console.error('Failed to fetch tags:', err);
        }
    };

    useEffect(() => {
        fetchTags();
    }, []);

    useEffect(() => {
        fetchPosts();
        const params = {};
        if (page > 1) params.page = page;
        if (search) params.search = search;
        if (selectedTag) params.tag = selectedTag;
        setSearchParams(params);
    }, [page, search, selectedTag]);

    const handleSearch = (query) => {
        setSearch(query);
        setPage(1);
    };

    const handleTagSelect = (tag) => {
        setSelectedTag(tag);
        setPage(1);
    };

    return (
        <div className="home-page">
            <section className="hero-section">
                <div className="hero-content">
                    <h1 className="hero-title">
                        Discover Stories That
                        <span className="hero-highlight"> Inspire</span>
                    </h1>
                    <p className="hero-subtitle">
                        Explore ideas, insights, and stories from writers around the world
                    </p>
                    <SearchBar onSearch={handleSearch} initialValue={search} />
                </div>
            </section>

            {tags.length > 0 && (
                <TagFilter
                    tags={tags}
                    selectedTag={selectedTag}
                    onSelectTag={handleTagSelect}
                />
            )}

            {loading ? (
                <Loading />
            ) : posts.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-state-icon">📝</div>
                    <h2>No posts found</h2>
                    <p>
                        {search || selectedTag
                            ? 'Try adjusting your search or filter'
                            : 'Be the first to create a post!'}
                    </p>
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
                        onPageChange={setPage}
                    />
                </>
            )}
        </div>
    );
};

export default Home;
