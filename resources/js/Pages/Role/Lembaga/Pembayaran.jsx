import React, { useEffect, useState } from "react";
import { usePage, router } from "@inertiajs/react";
import Sidebar from "@/Components/Lembaga/Sidebar";
import Navbar from "@/Components/Admin/Navbar";
import { IoMdArrowRoundBack } from "react-icons/io";

const Pembayaran = () => {
    const {
        snap_token,
        csrf_token,
        nama,
        jumlah_poin,
        harga,
        nama_lembaga,
        nama_lengkap,
    } = usePage().props;
    const [isSnapLoaded, setIsSnapLoaded] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [formattedPrice, setFormattedPrice] = useState("");

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const handleBackClick = () => {
        router.visit("/lembaga/belipoin"); // Ganti dengan route yang sesuai
    };

    useEffect(() => {
        const scriptSnap = document.createElement("script");
        scriptSnap.src = "https://app.sandbox.midtrans.com/snap/snap.js";
        scriptSnap.async = true;
        scriptSnap.setAttribute(
            "data-client-key",
            "SB-Mid-client-Z8DXDZKPkQcL8ZCz"
        );
        scriptSnap.onload = () => setIsSnapLoaded(true);
        document.body.appendChild(scriptSnap);

        return () => {
            document.body.removeChild(scriptSnap);
        };
    }, []);

    useEffect(() => {
        if (harga) {
            setFormattedPrice(
                new Intl.NumberFormat("id-ID", {
                    style: "currency",
                    currency: "IDR",
                }).format(harga)
            );
        }
    }, [harga]);

    const handlePaymentClick = () => {
        if (!isSnapLoaded || !snap_token) {
            alert("Midtrans belum siap atau token tidak tersedia.");
            return;
        }
    
        window.snap.pay(snap_token, {
            onSuccess: function (result) {
                console.log("Success:", result);
                sendResponseToServer(result);
            },
            onPending: function (result) {
                console.log("Pending:", result);
                sendResponseToServer(result);
            },
            onError: function (result) {
                console.log("Error:", result);
                sendResponseToServer(result);
            },
            onClose: function () {
                alert("Anda menutup popup tanpa menyelesaikan pembayaran.");
            },
        });
    };
    

    const { poin_id } = usePage().props;

const sendResponseToServer = (result) => {
    router.post(
        "/lembaga/pembayaran",
        { 
            json: JSON.stringify(result),
            poin_id: poin_id,
        },
        {
            onSuccess: () => router.visit("/lembaga/riwayat"),
            onError: () => router.visit("/lembaga/riwayat"),
        }
    );
};



    return (
        <div className="relative flex h-screen">
            <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
            <div className={`flex-1 flex flex-col ${isSidebarOpen ? "ml-56" : "ml-16"} transition-all duration-300`}>
                <div className="flex items-center">
                    <Navbar toggleSidebar={toggleSidebar} />
                </div>
                <main className="pt-20 p-6 bg-gray-100 min-h-screen flex flex-col">
                    <div className="bg-white p-6 rounded-lg shadow-md w-8/12 m-auto my-4">
                    <button
                        onClick={handleBackClick}
                        className=" text-gray-600 hover:text-gray-900"
                    >
                        <IoMdArrowRoundBack size={28} />
                    </button>
                        <h1 className="text-3xl font-semibold mb-20 mt-4 text-center text-gray-700 p-4 border-y">Detail Pembayaran</h1>
                        <div className="border-b border-gray-300 pb-4 mb-4 flex-grow">
                            <div className="text-lg flex justify-between w-full">
                                <span className="font-medium">Nama Lengkap</span>
                                <span className="flex-grow border-dotted border-b border-gray-400 mx-2"></span>
                                <span>{nama_lengkap}</span>
                            </div>
                            <div className="text-lg flex justify-between w-full">
                                <span className="font-medium">Lembaga</span>
                                <span className="flex-grow border-dotted border-b border-gray-400 mx-2"></span>
                                <span>{nama_lembaga}</span>
                            </div>
                            <div className="text-lg flex justify-between w-full">
                                <span className="font-medium">Paket Poin</span>
                                <span className="flex-grow border-dotted border-b border-gray-400 mx-2"></span>
                                <span>{nama}</span>
                            </div>
                            <div className="text-lg flex justify-between w-full">
                                <span className="font-medium">Jumlah Poin</span>
                                <span className="flex-grow border-dotted border-b border-gray-400 mx-2"></span>
                                <span>{jumlah_poin} POIN</span>
                            </div>
                        </div>
                        
                        <div className="text-lg font-semibold text-gray-900 flex justify-between w-full mb-4">
                                <span>Total Harga</span>
                                <span className="flex-grow border-dotted border-b border-gray-400 mx-2"></span>
                                <span>{formattedPrice}</span>
                            </div>
                        <div className="mt-auto">
                            <button
                                id="pay-button"
                                onClick={handlePaymentClick}
                                className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-300"
                            >
                                Bayar Sekarang
                            </button>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Pembayaran;