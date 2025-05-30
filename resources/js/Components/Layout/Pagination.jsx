import React from "react";

const Pagination = ({
    currentPage = 1,
    totalPages = 1,
    handlePageChange,
    startIndex = 0,
    entries = 5,
    filtered = [],
}) => {
    const filteredLength = filtered?.length || 0; // Jika undefined, default ke 0

    // Fungsi untuk menangani perubahan input halaman
    const handlePageInputChange = (e) => {
        const page = parseInt(e.target.value, 10);
        if (!isNaN(page) && page >= 1 && page <= totalPages) {
            handlePageChange(page);
        }
    };

    return (
        <div className="flex justify-between items-center mt-4 bg-white rounded-lg">
            <p className="text-gray-600 text-sm">
                Showing {filteredLength > 0 ? startIndex + 1 : 0} to{" "}
                {Math.min(startIndex + entries, filteredLength)} of{" "}
                {filteredLength} entries
            </p>
            <div className="flex gap-4 items-center">
                {/* Tombol Prev */}
                <button
                    className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-200 disabled:opacity-50 transition duration-300"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage <= 1}
                >
                    Prev
                </button>

                {/* Tampilan halaman */}
                <div className="flex items-center">
                    <span className="text-sm text-gray-500">Page</span>
                    <input
                        type="number"
                        value={currentPage}
                        min={1}
                        max={totalPages}
                        onChange={handlePageInputChange}
                        className="w-12 text-center mx-2 p-2 border rounded-lg text-gray-700"
                    />
                    <span className="text-sm text-gray-500">
                        of {totalPages}
                    </span>
                </div>

                {/* Tombol Next */}
                <button
                    className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-200 disabled:opacity-50 transition duration-300"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage >= totalPages}
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default Pagination;
