import React from "react";
import { usePage } from "@inertiajs/react";
import { Link } from "@inertiajs/react";
import MainLayout2 from "@/Components/Lembaga/MainLayout2";

export default function DetailPoinPage() {
    const { poin } = usePage().props; // Ambil data poin dari backend

    return (
        <MainLayout2 maxWidth="max-w-2xl" judul="DETAL POIN">

                    <div className="border-y p-3 px-6 grid grid-cols-1 gap-4">
                        <div>
                            <label className="block text-gray-700 font-bold">
                                Nama
                            </label>
                            <p className="mt-1 p-2 bg-gray-100 rounded">
                                {poin.nama}
                            </p>
                        </div>
                        <div>
                            <label className="block text-gray-700 font-bold">
                                Jumlah Poin
                            </label>
                            <p className="mt-1 p-2 bg-gray-100 rounded">
                                {poin.jumlah_poin}
                            </p>
                        </div>
                        <div>
                            <label className="block text-gray-700 font-bold">
                                Harga
                            </label>
                            <p className="mt-1 p-2 bg-gray-100 rounded">
                                Rp {poin.harga.toLocaleString()}
                            </p>
                        </div>
                    </div>
                    <div className="p-3 px-6 flex justify-between">
                        <Link
                            href="/admin/poin"
                            className="px-4 py-2 bg-blue-500 hover:bg-blue-700 text-white rounded"
                        >
                            Kembali
                        </Link>
                    </div>
                    </MainLayout2>
    );
}
