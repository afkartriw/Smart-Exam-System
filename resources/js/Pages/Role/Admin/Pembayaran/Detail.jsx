import React from "react";
import { usePage } from "@inertiajs/react";
import { Link } from "@inertiajs/react";
import MainLayout2 from "@/Components/Lembaga/MainLayout2";

export default function OrderDetail() {
    const { order } = usePage().props;

    return (
        <MainLayout2 maxWidth="max-w-3xl" judul="DETAIL PEMBAYARAN">
            <div className="border-y p-3 px-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="font-semibold">Nama:</label>
                    <p>{order.uname}</p>
                </div>
                <div>
                    <label className="font-semibold">Lembaga:</label>
                    <p>{order.lembaga?.nama_lembaga || "-"}</p>
                </div>
                <div>
                    <label className="font-semibold">Email:</label>
                    <p>{order.email}</p>
                </div>
                <div>
                    <label className="font-semibold">Nomor Telepon:</label>
                    <p>{order.number}</p>
                </div>
                <div>
                    <label className="font-semibold">ID Transaksi:</label>
                    <p>{order.transaction_id}</p>
                </div>
                <div>
                    <label className="font-semibold">ID Order:</label>
                    <p>{order.order_id}</p>
                </div>
                <div>
                    <label className="font-semibold">Metode Pembayaran:</label>
                    <p>{order.payment_type}</p>
                </div>
                <div>
                    <label className="font-semibold">Total Pembayaran:</label>
                    <p>Rp {order.gross_amount.toLocaleString()}</p>
                </div>
                <div>
                    <label className="font-semibold">Status:</label>
                    <p
                        className={`p-1.5 px-4 rounded-2xl font-semibold ${
                            order.status === "pending"
                                ? "bg-yellow-400 text-yellow-700"
                                : order.status === "Gagal"
                                ? "bg-red-400 text-red-700"
                                : order.status === "settlement"
                                ? "bg-green-400 text-green-700"
                                : "bg-gray-400 text-gray-700"
                        }`}
                    >
                        {order.status === "pending"
                            ? "Proses"
                            : order.status === "settlement"
                            ? "Berhasil"
                            : order.status}
                    </p>
                </div>
                <div>
                    <label className="font-semibold">Kode Pembayaran:</label>
                    <p>{order.payment_code || "-"}</p>
                </div>
                <div>
                    <label className="font-semibold">URL PDF:</label>
                    <p>{order.pdf_url || "-"}</p>
                </div>
            </div>
            <div className="p-3 px-6 flex justify-between">
                <Link
                    href="/admin/pembayaran"
                    className="px-4 py-2 bg-blue-500 hover:bg-blue-700 text-white rounded"
                >
                    Kembali
                </Link>
            </div>
        </MainLayout2>
    );
}
