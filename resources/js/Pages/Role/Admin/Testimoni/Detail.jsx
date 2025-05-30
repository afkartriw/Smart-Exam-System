import React from "react";
import { usePage, Link } from "@inertiajs/react";
import MainLayout2 from "@/Components/Lembaga/MainLayout2";

export default function DetailTestimoni() {
    const { testimoni } = usePage().props;

    return (
        <MainLayout2 maxWidth="max-w-3xl" judul="DETAIL TESTIMONI">

                    <div className="border-y p-3 px-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="mb-4">
                            <label className="block text-gray-700 font-bold">
                                Nama
                            </label>
                            <p className="mt-2 text-gray-900">
                                {testimoni.nama}
                            </p>
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 font-bold">
                                Role
                            </label>
                            <p className="mt-2 text-gray-900">
                                {testimoni.jabatan}
                            </p>
                        </div>
                        <div>
                            <label className="block text-gray-700 font-semibold">
                                Isi
                            </label>
                            <p className="text-gray-600">{testimoni.isi}</p>
                        </div>
                        <div>
                            <label className="block text-gray-700 font-semibold">
                                Foto
                            </label>
                            {testimoni.foto && (
                                <img
                                    src={testimoni.foto}
                                    alt="Foto Testimoni"
                                    className="mt-2 rounded shadow-lg h-36"
                                />
                            )}
                        </div>
                    </div>
                    <div className="p-3 px-6 flex justify-between border-t">
                        <Link
                            href="/admin/testimoni"
                            className="flex items-center px-4 py-2 gap-2 bg-gray-500 hover:bg-gray-700 text-white rounded"
                        >
                            Kembali
                        </Link>
                    </div>
                    </MainLayout2>
    );
}
