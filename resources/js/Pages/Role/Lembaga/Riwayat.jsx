import Pagination from "@/Components/Layout/Pagination";
import React, { useState } from "react";
import { FaEye, FaFilter } from "react-icons/fa";
import { usePage } from "@inertiajs/react";
import MainLayout from "@/Components/Lembaga/MainLayout";

export default function Page() {
    const { orders } = usePage().props;

    const [filter, setFilter] = useState("");
    const [entries, setEntries] = useState(5);
    const [currentPage, setCurrentPage] = useState(1);

    const handleFilterChange = (e) => {
        setFilter(e.target.value);
        setCurrentPage(1);
    };

    const handleEntriesChange = (e) => {
        setEntries(parseInt(e.target.value));
        setCurrentPage(1);
    };

    const filtered = orders.filter((order) => {
        const lowerCaseFilter = filter.toLowerCase();
        return (
            order.uname.toLowerCase().includes(lowerCaseFilter) ||
            order.email.toLowerCase().includes(lowerCaseFilter) ||
            order.number.toLowerCase().includes(lowerCaseFilter) ||
            order.order_id.toLowerCase().includes(lowerCaseFilter) ||
            order.status.toLowerCase().includes(lowerCaseFilter)
        );
    });

    const totalPages = Math.ceil(filtered.length / entries);
    const startIndex = (currentPage - 1) * entries;
    const paginatedOrders = filtered.slice(startIndex, startIndex + entries);

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    return (
        <MainLayout>
                <div className="flex justify-between items-center p-3 px-6 ">
                    <h1 className="text-2xl font-bold text-blue-900">
                        RIWAYAT PEMBELIAN
                    </h1>
                </div>
                <div className="flex justify-between items-center p-3 px-6 border-y">
                    <div>
                        <label className="flex items-center gap-2">
                            Show
                            <select
                                className="p-1 border rounded w-12"
                                value={entries}
                                onChange={handleEntriesChange}
                            >
                                {[5, 10, 15].map((num) => (
                                    <option key={num} value={num}>
                                        {num}
                                    </option>
                                ))}
                            </select>
                            entries
                        </label>
                    </div>
                    <div className="flex items-center">
                        <input
                            type="text"
                            placeholder="Filter..."
                            value={filter}
                            onChange={handleFilterChange}
                            className="h-8 border rounded"
                        />
                        <button className="ml-2 p-2 bg-blue-500 text-white rounded">
                            <FaFilter />
                        </button>
                    </div>
                </div>
                <div className="px-6 py-3 overflow-x-auto">
                    <table className="w-full border rounded">
                        <thead>
                            <tr className="bg-blue-500 text-white">
                                <th className="p-2 border">ID</th>
                                <th className="p-2 border">Lembaga</th>
                                <th className="p-2 border">Nama</th>
                                <th className="p-2 border">Nama Paket</th>
                                <th className="p-2 border">Jumlah Poin</th>
                                <th className="p-2 border">Total</th>
                                <th className="p-2 border">Status</th>
                                <th className="p-2 border">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedOrders.length > 0 ? (
                                paginatedOrders.map((order, index) => (
                                    <tr
                                        key={order.id}
                                        className="hover:bg-gray-100 text-center"
                                    >
                                        <td className="p-2 border">
                                            {index + 1}
                                        </td>
                                        <td className="p-2 border">
                                            {order.lembaga?.nama_lembaga || "-"}
                                        </td>
                                        <td className="p-2 border">
                                            {order.uname}
                                        </td>
                                        <td className="p-2 border">
                                            {order.poin?.nama || "-"}
                                        </td>
                                        <td className="p-2 border">
                                            {order.poin?.jumlah_poin || "-"}
                                        </td>
                                        <td className="p-2 border">
                                            Rp{" "}
                                            {order.gross_amount.toLocaleString()}
                                        </td>
                                        <td className="py-2 border">
                                            <span
                                                className={`p-1.5 px-4 rounded-2xl font-semibold ${
                                                    order.status === "pending"
                                                        ? "bg-red-400 text-red-700"
                                                        : order.status ===
                                                          "Gagal"
                                                        ? "bg-red-400 text-red-700"
                                                        : order.status ===
                                                          "settlement"
                                                        ? "bg-green-400 text-green-700"
                                                        : "bg-gray-400 text-gray-700"
                                                }`}
                                            >
                                                {order.status === "pending"
                                                    ? "Gagal"
                                                    : order.status ===
                                                      "settlement"
                                                    ? "Berhasil"
                                                    : order.status}
                                            </span>
                                        </td>
                                        <td className="p-2 border">
                                            <div className="flex justify-center gap-x-4">
                                                <a
                                                    href={`/lembaga/riwayat/detail/${order.id}`}
                                                    className="border-2 p-2 rounded-xl bg-gray-600 hover:bg-gray-800"
                                                >
                                                    <FaEye
                                                        size={20}
                                                        className="text-white"
                                                    />
                                                </a>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="8" className="p-4 text-center">
                                        Tidak ada riwayat pembelian.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        handlePageChange={handlePageChange}
                        startIndex={startIndex}
                        entries={entries}
                        filtered={filtered}
                    />
                </div>
        </MainLayout>
    );
}
