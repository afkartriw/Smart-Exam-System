import React from "react";
import { Head } from "@inertiajs/react";

const Streaming = ({ streaming }) => {
    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <Head title="Streaming Peserta" />

            <h1 className="text-2xl font-bold mb-6">Streaming Peserta Ujian</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {streaming.length > 0 ? (
                    streaming.map((stream) => (
                        <div
                            key={stream.id}
                            className="bg-white shadow-md rounded-lg p-4"
                        >
                            <h2 className="text-lg font-semibold mb-2">
                                {stream.sesi_peserta.peserta.nama_peserta}
                            </h2>
                            <div className="border rounded overflow-hidden">
                                <iframe
                                    src={stream.stream_url}
                                    width="100%"
                                    height="200"
                                    allowFullScreen
                                    className="rounded"
                                ></iframe>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-500 col-span-full">
                        Tidak ada peserta yang sedang melakukan streaming.
                    </p>
                )}
            </div>
        </div>
    );
};

export default Streaming;
