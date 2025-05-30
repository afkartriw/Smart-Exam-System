import React, { useState } from "react";
import Swal from "sweetalert2"; // Import SweetAlert2
import { router } from "@inertiajs/react";
import { usePage } from "@inertiajs/react";
import MainLayout from "@/Components/Lembaga/MainLayout";

export default function Page() {
    const { poins } = usePage().props; // Ambil data poins dari backend

    const handlePilihPaket = (poin) => {
        Swal.fire({
            title: "Pembelian Poin",
            html: `
                <p>Anda akan membeli poin <b>${poin.nama}</b>.</p>
                <p>Poin yang didapatkan: <b>${poin.jumlah_poin}</b></p>
                <p>Harga: <b>Rp. ${poin.harga.toLocaleString()}</b></p>
            `,
            icon: "info",
            showCancelButton: true,
            confirmButtonText: "Checkout",
            cancelButtonText: "Batalkan",
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
        }).then((result) => {
            if (result.isConfirmed) {
                // Arahkan ke halaman pembayaran dengan id_poin
                router.get(`/lembaga/belipoin/${poin.id}`);
            }
        });
    };

    // Urutkan poins berdasarkan jumlah_poin dari yang terkecil
    const sortedPoins = poins.sort((a, b) => a.jumlah_poin - b.jumlah_poin);

    return (
        <MainLayout>
            <div className="border-b p-3 px-6">
                <h1 className="text-2xl text-blue-900 font-bold">BELI POIN</h1>
            </div>
            <div className="px-6 p-3">
                <h1 className="text-xl font-bold">Pilih Paket Poin *</h1>
            </div>
            <div className="grid grid-cols-3 gap-4 p-4 px-6">
                {sortedPoins.map((poin, index) => (
                    <div
                        key={index}
                        className="border rounded-lg p-4 text-center shadow-sm"
                    >
                        <h2 className="text-lg font-semibold">{poin.nama}</h2>
                        <p className="text-2xl font-bold mt-2">
                            {poin.jumlah_poin}{" "}
                            <span className="text-sm">POIN</span>
                        </p>
                        <p className="text-lg font-semibold text-gray-600">
                            Rp. {poin.harga.toLocaleString()}
                        </p>
                        <button
                            onClick={() => handlePilihPaket(poin)}
                            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-800"
                        >
                            Pilih
                        </button>
                    </div>
                ))}
            </div>
            <p className="py-4 text-sm text-gray-500 px-6">
                * Harga dapat berubah sewaktu-waktu
            </p>
        </MainLayout>
    );
}
