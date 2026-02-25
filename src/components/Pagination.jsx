const Pagination = ({ page, totalPages, onPageChange }) => {
    if (totalPages <= 1) return null;

    const getPages = () => {
        const pages = [];
        const start = Math.max(1, page - 2);
        const end = Math.min(totalPages, page + 2);

        if (start > 1) {
            pages.push(1);
            if (start > 2) pages.push('...');
        }

        for (let i = start; i <= end; i++) {
            pages.push(i);
        }

        if (end < totalPages) {
            if (end < totalPages - 1) pages.push('...');
            pages.push(totalPages);
        }

        return pages;
    };

    return (
        <div className="pagination">
            <button
                className="pagination-btn"
                onClick={() => onPageChange(page - 1)}
                disabled={page <= 1}
            >
                ← Prev
            </button>
            <div className="pagination-pages">
                {getPages().map((p, i) =>
                    p === '...' ? (
                        <span key={`ellipsis-${i}`} className="pagination-ellipsis">
                            ...
                        </span>
                    ) : (
                        <button
                            key={p}
                            className={`pagination-page ${p === page ? 'active' : ''}`}
                            onClick={() => onPageChange(p)}
                        >
                            {p}
                        </button>
                    )
                )}
            </div>
            <button
                className="pagination-btn"
                onClick={() => onPageChange(page + 1)}
                disabled={page >= totalPages}
            >
                Next →
            </button>
        </div>
    );
};

export default Pagination;
