import { useState } from 'react';

const SearchBar = ({ onSearch, initialValue = '' }) => {
    const [query, setQuery] = useState(initialValue);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSearch(query.trim());
    };

    return (
        <form className="search-bar" onSubmit={handleSubmit}>
            <div className="search-input-wrapper">
                <span className="search-icon">🔍</span>
                <input
                    type="text"
                    className="search-input"
                    placeholder="Search posts..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
                {query && (
                    <button
                        type="button"
                        className="search-clear"
                        onClick={() => {
                            setQuery('');
                            onSearch('');
                        }}
                    >
                        ✕
                    </button>
                )}
            </div>
            <button type="submit" className="search-btn">
                Search
            </button>
        </form>
    );
};

export default SearchBar;
