import { useForm } from "@inertiajs/react";
import Swal from "sweetalert2";
import { Link } from "@inertiajs/react";
import MainLayout2 from "@/Components/Lembaga/MainLayout2";

export default function FormFitur({ fitur = null }) {
    const { data, setData, post, put, processing } = useForm({
        nama_fitur: fitur?.nama_fitur || "",
        deskripsi: fitur?.deskripsi || "",
        gambar: null,
    });

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        setData(name, files ? files[0] : value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const action = fitur ? put : post;
        action(fitur ? `/admin/fitur/${fitur.id}` : "/admin/fitur", {
            data,
            onSuccess: () => {
                Swal.fire(
                    "Berhasil!",
                    `Fitur berhasil ${fitur ? "diedit" : "ditambahkan"}.`,
                    "success"
                );
            },
            onError: () => {
                Swal.fire("Gagal!", "Terjadi kesalahan.", "error");
            },
        });
    };

    return (
        <MainLayout2 maxWidth="max-w-3xl" judul="TAMBAH FITUR">
            <form onSubmit={handleSubmit}>
                {" "}
                <div className="border-y p-3 px-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="mb-4">
                        <label className="block text-gray-700">
                            Nama Fitur
                        </label>
                        <input
                            type="text"
                            name="nama_fitur"
                            value={data.nama_fitur}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">Gambar</label>
                        <input
                            type="file"
                            name="gambar"
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                            accept="image/*"
                        />
                    </div>

                    <div className="mb-4 col-span-2">
                        <label className="block text-gray-700">Deskripsi</label>
                        <textarea
                            name="deskripsi"
                            value={data.deskripsi}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                            required
                        ></textarea>
                    </div>
                </div>
                <div className="p-3 px-6 flex justify-between">
                    <Link
                        href="/admin/fitur"
                        className="flex items-center px-4 py-2 gap-2 bg-gray-500 hover:bg-gray-700 text-white rounded"
                    >
                        Kembali
                    </Link>
                    <button
                        type="submit"
                        className="flex items-center px-4 py-2 gap-2 bg-green-500 hover:bg-green-700 text-white rounded"
                        disabled={processing}
                    >
                        {processing ? "Menyimpan..." : "Simpan"}
                    </button>{" "}
                </div>
            </form>
        </MainLayout2>
    );
}
