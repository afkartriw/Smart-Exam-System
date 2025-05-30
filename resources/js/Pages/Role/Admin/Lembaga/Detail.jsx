import React from "react";
import { usePage } from "@inertiajs/react";
import { Link } from "@inertiajs/react";
import MainLayout2 from "@/Components/Lembaga/MainLayout2";

export default function DetailLembaga() {
    const { lembaga } = usePage().props;

    return (
        <MainLayout2 maxWidth="max-w-4xl" judul="DETAIL LEMBAGA">
            <div className="border-y p-3 px-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                    <label className="font-semibold">Nama Lembaga:</label>
                    <p>{lembaga.nama_lembaga}</p>
                </div>
                <div>
                    <label className="font-semibold">Nama Lengkap:</label>
                    <p>{lembaga.nama_lengkap}</p>
                </div>
                <div>
                    <label className="font-semibold">Kabupaten:</label>
                    <p>{lembaga.kabupaten}</p>
                </div>
                <div>
                    <label className="font-semibold">Jenis:</label>
                    <p>{lembaga.jenis}</p>
                </div>
                <div>
                    <label className="font-semibold">Username:</label>
                    <p>{lembaga.username}</p>
                </div>
                <div className="row-span-3">
                    <label className="font-semibold ">Logo Lembaga :</label>
                    <img
                        src={lembaga.logo}
                        alt="Logo Lembaga"
                        className="mt-2 rounded-lg shadow-sm w-full max-w-md"
                    />
                </div>
                <div>
                    <label className="font-semibold">Email:</label>
                    <p>{lembaga.email}</p>
                </div>                
                <div>
                    <label className="font-semibold">Alamat:</label>
                    <p>{lembaga.alamat}</p>
                </div>               
                <div>
                    <label className="font-semibold">WhatsApp:</label>
                    <p>{lembaga.whatsapp}</p>
                </div>                                          
                <div>
                    <label className="font-semibold">Jumlah Staff:</label>
                    <p>{lembaga.jumlah_staff}</p>
                </div>
                <div>
                    <label className="font-semibold">Jumlah Peserta:</label>
                    <p>{lembaga.jumlah_peserta}</p>
                </div>
                <div>
                    <label className="font-semibold">Poin:</label>
                    <p>{lembaga.poin}</p>
                </div>
            </div>
            <div className="p-3 px-6 flex justify-between">
                <Link
                    href="/admin/lembaga"
                    className="px-4 py-2 bg-blue-500 hover:bg-blue-700 text-white rounded"
                >
                    Kembali
                </Link>
            </div>
        </MainLayout2>
    );
}
