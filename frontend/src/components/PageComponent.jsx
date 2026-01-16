import './PageComponent.css'

const PageComponent = ({ currentPage, totalPages, onPageChange, maxButtons = 2 }) => {
    const pageNumbers = [];

    // Always show first page
    pageNumbers.push(1);

    // Ellipsis after first page
    if (currentPage > 1 + maxButtons + 1) {
        pageNumbers.push("start-ellipsis");
    }

    // Pages around current page
    const startPage = Math.max(2, currentPage - maxButtons);
    const endPage = Math.min(totalPages - 1, currentPage + maxButtons);
    for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
    }

    // Ellipsis before last page
    if (currentPage + maxButtons < totalPages - 1) {
        pageNumbers.push("end-ellipsis");
    }

    // Always show last page if more than 1
    if (totalPages > 1) pageNumbers.push(totalPages);

    // Deduplicate in case ranges overlap
    const uniquePages = Array.from(new Set(pageNumbers));

    return (
        <div className="page-buttons">
            <button
                onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
            >
                Prev
            </button>

            {uniquePages.map((page, idx) => {
                if (page === "start-ellipsis" || page === "end-ellipsis") {
                    return <span key={page + idx} className='ellipsis'>…</span>;
                }
                return (
                    <button
                        key={page}
                        onClick={() => onPageChange(page)}
                        className={page === currentPage ? "active-page" : ""}
                    >
                        {page}
                    </button>
                );
            })}

            <button
                onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
            >
                Next
            </button>
        </div>
    );
};

export default PageComponent;
