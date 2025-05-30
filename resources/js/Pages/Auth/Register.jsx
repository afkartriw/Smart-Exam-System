import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { usePage, router } from "@inertiajs/react";
import Select from "react-select";
import Navbar from "@/Components/Layout/NavbarAuth";
import axios from "axios";
import { IoArrowBackOutline } from "react-icons/io5";

const Konfirmasi = () => {
    const { url } = usePage();

    const [formData, setFormData] = useState({
        nama_lembaga: "",
        alamat: "",
        kabupaten: "",
        jenis: "",
        username: "",
        email: "",
        nama_lengkap: "",
        whatsapp: "",
        captcha: "",
    });

    const [jenisLembaga, setJenisLembaga] = useState([]);
    const [kabupatenList, setKabupatenList] = useState([]);
    const [captcha, setCaptcha] = useState({ image: "", key: "" });
    const [captchaInput, setCaptchaInput] = useState("");

    useEffect(() => {
        axios
            .get("/lembaga/jenis")
            .then((response) =>
                setJenisLembaga(
                    response.data.map((item) => ({
                        value: item.id,
                        label: item.nama,
                    }))
                )
            )
            .catch((error) =>
                console.error("Error fetching jenis lembaga:", error)
            );

        axios
            .get("/kabupaten/kota")
            .then((response) =>
                setKabupatenList(
                    response.data.map((item) => ({
                        value: item.id,
                        label: item.name,
                    }))
                )
            )
            .catch((error) =>
                console.error("Error fetching kabupaten:", error)
            );

        generateCaptcha(); // Load CAPTCHA saat pertama kali
    }, []);

    const generateCaptcha = async () => {
        try {
            const response = await axios.get("/captcha-image");

            let captchaUrl = response.data.captcha.replace(/\\\//g, "/");
            captchaUrl += `&t=${Date.now()}`; // Hindari caching

            setCaptcha({ image: captchaUrl, key: Date.now() });
        } catch (error) {
            console.error("Error fetching CAPTCHA:", error);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleKabupatenChange = (selectedOption) => {
        setFormData({ ...formData, kabupaten: selectedOption.label });
    };

    const handleJenisLembagaChange = (selectedOption) => {
        setFormData({ ...formData, jenis: selectedOption.label });
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();

        try {
            const result = await Swal.fire({
                title: "Apakah Anda yakin?",
                text: "Data yang telah Anda masukkan akan dikirimkan!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Ya, kirimkan!",
                cancelButtonText: "Batal",
            });

            if (result.isConfirmed) {
                const payload = { ...formData, captcha: captchaInput }; // Tambahkan CAPTCHA
                await axios.post("/lembaga/register", payload);

                Swal.fire(
                    "Terkirim!",
                    "Pendaftaran berhasil! Cek email Anda.",
                    "success"
                ).then(() => {
                    window.location.href = "/login";
                });
            }
        } catch (error) {
            Swal.fire(
                "Error!",
                error.response?.data?.message || "Terjadi kesalahan.",
                "error"
            );
            generateCaptcha(); // Refresh CAPTCHA jika terjadi error
        }
    };

    return (
        <div className="min-h-screen bg-1 flex flex-col items-center justify-center">
            {/* <Navbar /> */}
            <div className="bg-white w-full max-w-6xl rounded-lg shadow-lg p-4 my-4 relative flex items-center justify-center">
    <a href="/konfirmasi" className="absolute left-4 text-2xl text-gray-400 hover:text-gray-700">
        <IoArrowBackOutline />
    </a>
    <h1 className="text-2xl font-semibold text-gray-700">PENDAFTARAN LEMBAGA</h1>
</div>


            <div className="bg-white w-full max-w-6xl rounded-lg shadow-lg py-6 px-10 mb-4">
                <form onSubmit={handleFormSubmit}>
                    <div className="grid grid-cols-2 gap-10">
                        <div>
                            <div>
                                <h2 className="text-center text-xl font-semibold text-gray-700 mb-6 border-b-2 border-gray-300">
                                    DATA LEMBAGA
                                </h2>
                            </div>
                            <div className="mb-4">
                                <label
                                    htmlFor="nama-lembaga"
                                    className="block text-sm font-medium text-gray-600"
                                >
                                    Nama Lembaga
                                </label>
                                <input
                                    type="text"
                                    name="nama_lembaga"
                                    value={formData.nama_lembaga}
                                    onChange={handleChange}
                                    placeholder="Ex: SMA Negeri 2 Purworejo"
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label
                                    htmlFor="alamat-lembaga"
                                    className="block text-sm font-medium text-gray-600"
                                >
                                    Alamat Lembaga
                                </label>
                                <input
                                    type="text"
                                    name="alamat"
                                    value={formData.alamat}
                                    onChange={handleChange}
                                    placeholder="Ex: Jl. Tentara Pelajar No. 78"
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                                    required
                                />
                            </div>
                            {/* Dropdown Kabupaten dengan Search */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-600">
                                    Kabupaten/Kota
                                </label>
                                <Select
                                    options={kabupatenList}
                                    onChange={handleKabupatenChange}
                                    placeholder="Pilih Kabupaten"
                                    className="mt-1"
                                />
                            </div>
                            <div className="mb-4">
                                <label
                                    htmlFor="jenis-lembaga"
                                    className="block text-sm font-medium text-gray-600"
                                >
                                    Jenis Lembaga
                                </label>
                                <Select
                                    options={jenisLembaga}
                                    onChange={handleJenisLembagaChange}
                                    placeholder="Pilih Jenis Lembaga"
                                    className="mt-1"
                                />
                            </div>
                            {/* <div className="bg-blue-100 p-4 rounded-md mb-4">
                                <h2 className="text-sm font-semibold text-blue-600 mb-2">
                                    Informasi
                                </h2>
                                <p className="text-sm text-gray-700">
                                    Lembaga Anda akan mendapatkan alamat URL
                                    pribadi dengan format:{" "}
                                    <span className="font-medium">
                                        https://www.e-ujian.com/&#123;username_lembaga&#125;
                                    </span>
                                </p>
                                <p className="text-sm text-gray-700 mt-2">
                                    Silakan tentukan username tersebut di sini
                                    dengan penuh pertimbangan, karena isian
                                    tersebut tidak dapat diubah untuk
                                    seterusnya.
                                </p>
                                <p className="text-sm text-gray-700 mt-2">
                                    <strong>Contoh username:</strong>{" "}
                                    sman2purworejo, smkn1_banyuwangi, dsb.
                                </p>
                            </div> */}
                            <div className="mb-4">
                                <label
                                    htmlFor="username-lembaga"
                                    className="block text-sm font-medium text-gray-600"
                                >
                                    Username Lembaga
                                </label>
                                <input
                                    type="text"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleChange}
                                    placeholder="Hanya huruf, angka, atau _"
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                                    required
                                />
                            </div>
                        </div>
                        <div>
                            <div>
                                <h2 className="text-center text-xl font-semibold text-gray-700 mb-6 border-b-2 border-gray-300">
                                    DATA PRIBADI ANDA
                                </h2>
                            </div>
                            <div className="mb-4">
                                <label
                                    htmlFor="email"
                                    className="block text-sm font-medium text-gray-600"
                                >
                                    Alamat Email
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="Email valid dan aktif"
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label
                                    htmlFor="nama_lengkap"
                                    className="block text-sm font-medium text-gray-600"
                                >
                                    Nama Lengkap
                                </label>
                                <input
                                    type="text"
                                    name="nama_lengkap"
                                    value={formData.nama_lengkap}
                                    onChange={handleChange}
                                    placeholder="Masukkan nama lengkap tanpa gelar"
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label
                                    htmlFor="whatsapp"
                                    className="block text-sm font-medium text-gray-600"
                                >
                                    Nomor WhatsApp
                                </label>
                                <input
                                    type="tel"
                                    name="whatsapp"
                                    value={formData.whatsapp}
                                    onChange={handleChange}
                                    placeholder="Nomor WhatsApp valid"
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                                    required
                                />
                            </div>
                            CAPTCHA Section
                            <div className="mb-4 col-span-2">
                                <label className="block text-sm font-medium text-gray-600 mb-2">
                                    Masukkan CAPTCHA
                                </label>
                                <div className="flex items-center">
                                    {captcha.image && (
                                        <img
                                            src={captcha.image}
                                            alt="CAPTCHA"
                                            className="mr-4 border rounded-md"
                                        />
                                    )}
                                    <button
                                        type="button"
                                        onClick={generateCaptcha}
                                        className="bg-gray-300 px-3 py-1 rounded-md hover:bg-gray-400"
                                    >
                                        Refresh
                                    </button>
                                </div>
                                <input
                                    type="text"
                                    value={captchaInput}
                                    onChange={(e) =>
                                        setCaptchaInput(e.target.value)
                                    }
                                    placeholder="Masukkan CAPTCHA"
                                    className="mt-2 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="mt-4 w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:ring-2 focus:ring-blue-300"
                    >
                        Daftar
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Konfirmasi;
