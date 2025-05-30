import React from 'react';

export default function Keunggulan({ keunggulans }) {
    return (
        <>
            <section id="keunggulan" className="values section">
                {/* Section Title */}
                <div className="container section-title" data-aos="fade-up">
                    <h2>Keunggulan</h2>
                    <p>
                        Alasan Mengapa Kami Lebih Unggul
                        <br />
                    </p>
                </div>
                {/* End Section Title */}
                <div className="container">
                    <div className="row gy-4">
                        {keunggulans.map((keunggulan, index) => (
                            <div
                                key={keunggulan.id}
                                className="col-lg-4"
                                data-aos="fade-up"
                                data-aos-delay={(index + 1) * 100} // Animasi delay dinamis
                            >
                                <div className="card">
                                    <img
                                        src={keunggulan.gambar || "images/values-1.png"} // Gambar default jika tidak ada
                                        className="img-fluid"
                                        alt={keunggulan.nama_keunggulan}
                                    />
                                    <h3>{keunggulan.nama_keunggulan}</h3>
                                    <p>{keunggulan.deskripsi}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
}