const TagFilter = ({ tags, selectedTag, onSelectTag }) => {
    return (
        <div className="tag-filter">
            <button
                className={`tag-filter-btn ${!selectedTag ? 'active' : ''}`}
                onClick={() => onSelectTag('')}
            >
                All
            </button>
            {tags.map((tag) => (
                <button
                    key={tag.name}
                    className={`tag-filter-btn ${selectedTag === tag.name ? 'active' : ''}`}
                    onClick={() => onSelectTag(tag.name)}
                >
                    #{tag.name}
                    <span className="tag-count">{tag.count}</span>
                </button>
            ))}
        </div>
    );
};

export default TagFilter;
