import React from 'react';

export default function Fitur({ fiturs }) {
    // Jika fiturs undefined atau null, berikan nilai default array kosong
    const dataFitur = fiturs || [];

    return (
        <>
            <section id="fitur" className="features section">
                {/* Section Title */}
                <div className="container section-title" data-aos="fade-up">
                    <h2>Fitur</h2>
                    <p>
                        Solusi Inovatif untuk Kebutuhan Anda
                        <br />
                    </p>
                </div>
                {/* End Section Title */}
                <div className="container mx-auto">
                    {dataFitur.map((fitur, index) => (
                        <div key={fitur.id} className="flex flex-wrap mt-28">
                            {/* Tampilkan gambar di kiri untuk index genap, di kanan untuk index ganjil */}
                            {index % 2 === 0 ? (
                                <>
                                    <img
                                        src={fitur.gambar || "images/homepage/default-image.jpg"}
                                        className="w-96 h-96 md:w-1/2 shadow-lg rounded-lg overflow-hidden"
                                        alt={fitur.nama_fitur}
                                    />
                                    <div className="w-full md:w-1/2 px-16 flex flex-col justify-between">
                                        <div>
                                            <h1 className="text-3xl font-bold mb-4">
                                                {fitur.nama_fitur}
                                            </h1>
                                            <h3 className="text-xl text-gray-700">
                                                {fitur.deskripsi}
                                            </h3>
                                        </div>
                                        <div className="w-60 mt-6">
                                            <div className="text-center rounded bg-blue-600 hover:bg-blue-700 transition duration-300 ease-in-out shadow-lg hover:shadow-xl">
                                                <a
                                                    href="#"
                                                    className="text-white font-semibold py-3 px-6 inline-flex items-center justify-center space-x-2"
                                                >
                                                    <span>Read More</span>
                                                    <i className="bi bi-arrow-right text-lg"></i>
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="w-full md:w-1/2 px-16 flex flex-col justify-between text-end">
                                        <div>
                                            <h1 className="text-3xl font-bold mb-4">
                                                {fitur.nama_fitur}
                                            </h1>
                                            <h3 className="text-xl text-gray-700">
                                                {fitur.deskripsi}
                                            </h3>
                                        </div>
                                        <div className="w-60 mt-6 ml-auto">
                                            <div className="text-center rounded bg-blue-600 hover:bg-blue-700 transition duration-300 ease-in-out shadow-lg hover:shadow-xl">
                                                <a
                                                    href="#"
                                                    className="text-white font-semibold py-3 px-6 inline-flex items-center justify-center space-x-2"
                                                >
                                                    <span>Read More</span>
                                                    <i className="bi bi-arrow-right text-lg"></i>
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                    <img
                                        src={fitur.gambar || "images/homepage/default-image.jpg"}
                                        className="w-96 h-96 md:w-1/2 shadow-lg rounded-lg overflow-hidden"
                                        alt={fitur.nama_fitur}
                                    />
                                </>
                            )}
                        </div>
                    ))}
                </div>
            </section>
        </>
    );
}