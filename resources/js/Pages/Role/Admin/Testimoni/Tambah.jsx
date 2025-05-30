import { useForm } from "@inertiajs/react";
import Swal from "sweetalert2";
import { Link } from "@inertiajs/react";
import MainLayout2 from "@/Components/Lembaga/MainLayout2";

export default function FormTestimoni({ testimoni = null }) {
    const { data, setData, post, put, processing } = useForm({
        nama: testimoni?.nama || "",
        jabatan: testimoni?.jabatan || "",
        isi: testimoni?.isi || "",
        foto: null,
    });

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        setData(name, files ? files[0] : value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const action = testimoni ? put : post;
        action(
            testimoni ? `/admin/testimoni/${testimoni.id}` : "/admin/testimoni",
            {
                data,
                onSuccess: () => {
                    Swal.fire(
                        "Berhasil!",
                        `Testimoni berhasil ${
                            testimoni ? "diedit" : "ditambahkan"
                        }.`,
                        "success"
                    );
                },
                onError: () => {
                    Swal.fire("Gagal!", "Terjadi kesalahan.", "error");
                },
            }
        );
    };

    return (
        <MainLayout2 maxWidth="max-w-3xl" judul="TAMBAH TESTIMONI">
            <form onSubmit={handleSubmit}>
                <div className="border-y p-3 px-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="mb-4">
                        <label className="block text-gray-700">Nama</label>
                        <input
                            type="text"
                            name="nama"
                            value={data.nama}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                            required
                        />
                    </div>

                    <div className="mb-4 row-span-3">
                        <label className="block text-gray-700">Isi</label>
                        <textarea
                            name="isi"
                            value={data.isi}
                            onChange={handleChange}
                            className="w-full p-2 border rounded min-h-36"
                            required
                        ></textarea>
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">Role</label>
                        <input
                            type="text"
                            name="jabatan"
                            value={data.jabatan}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">Foto</label>
                        <input
                            type="file"
                            name="foto"
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                            accept="image/*"
                        />
                    </div>
                </div>
                <div className="p-3 px-6 flex justify-between">
                    <Link
                        href="/admin/testimoni"
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
                    </button>
                </div>
            </form>
        </MainLayout2>
    );
}
