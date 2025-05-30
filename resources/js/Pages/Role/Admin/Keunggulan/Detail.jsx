import React from "react";
import { usePage, Link } from "@inertiajs/react";
import MainLayout2 from "@/Components/Lembaga/MainLayout2";

export default function DetailKeunggulan() {
    const { keunggulan } = usePage().props;

    return (
        <MainLayout2 maxWidth="max-w-3xl" judul="DETAIL KEUNGGULAN">

                    <div className="border-y p-3 px-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="mb-4">
                            <label className="block text-gray-700 font-bold">
                                Nama Keunggulan
                            </label>
                            <p className="mt-2 text-gray-900">
                                {keunggulan.nama_keunggulan}
                            </p>
                        </div>
                        <div className="mb-4 row-span-2">
                            <label className="block text-gray-700 font-bold">
                                Deskripsi
                            </label>
                            <p className="mt-2 text-gray-900">
                                {keunggulan.deskripsi}
                            </p>
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 font-bold">
                                Gambar
                            </label>
                            {keunggulan.gambar && (
                                <img
                                    src={keunggulan.gambar}
                                    alt="Gambar Keunggulan"
                                    className="mt-2 rounded-lg shadow-sm w-full max-w-md"
                                />
                            )}
                        </div>
                    </div>
                    <div className="p-3 px-6 flex justify-end">
                        <Link
                            href="/admin/keunggulan"
                            className="flex items-center px-4 py-2 gap-2 bg-gray-500 hover:bg-gray-700 text-white rounded"
                        >
                            Kembali
                        </Link>
                    </div>
                    </MainLayout2>
    );
}
