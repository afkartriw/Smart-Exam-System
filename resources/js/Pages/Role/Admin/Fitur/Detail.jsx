import React from "react";
import { usePage, Link } from "@inertiajs/react";
import MainLayout2 from "@/Components/Lembaga/MainLayout2";
 
export default function DetailFitur() {
    const { fitur } = usePage().props;

    return (
        <MainLayout2 maxWidth="max-w-3xl" judul="DETAIL FITUR">

                    <div className="border-y p-3 px-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="mb-4">
                            <label className="block text-gray-700 font-bold">
                                Nama Fitur
                            </label>
                            <p className="mt-2 text-gray-900">
                                {fitur.nama_fitur}
                            </p>
                        </div>
                        <div>
                            <label className="block text-gray-700 font-semibold">
                                Gambar
                            </label>
                            {fitur.gambar && (
                                <img
                                    src={fitur.gambar}
                                    alt="Gambar Fitur"
                                    className="mt-2 h-52 rounded shadow-lg"
                                />
                            )}
                        </div>
                        <div className="col-span-2">
                            <label className="block text-gray-700 font-semibold">
                                Deskripsi
                            </label>
                            <p className="text-gray-600">{fitur.deskripsi}</p>
                        </div>
                    </div>
                    <div className="p-3 px-6 flex justify-between border-t">
                        <Link
                            href="/admin/fitur"
                            className="flex items-center px-4 py-2 gap-2 bg-gray-500 hover:bg-gray-700 text-white rounded"
                        >
                            Kembali
                        </Link>
                    </div>
                    </MainLayout2>
    );
}