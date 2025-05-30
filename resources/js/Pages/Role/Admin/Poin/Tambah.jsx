import { useForm } from "@inertiajs/react";
import Swal from "sweetalert2";
import { Link } from "@inertiajs/react";
import MainLayout2 from "@/Components/Lembaga/MainLayout2";

export default function FormPoin({ poin = null }) {
    const { data, setData, post, put, processing } = useForm({
        nama: poin?.nama || "",
        jumlah_poin: poin?.jumlah_poin || "",
        harga: poin?.harga || "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setData(name, value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const action = poin ? put : post;
        action(poin ? `/admin/poin/${poin.id}` : "/admin/poin", {
            data,
            onSuccess: () => {
                Swal.fire(
                    "Berhasil!",
                    `Poin berhasil ${poin ? "diedit" : "ditambahkan"}.`,
                    "success"
                );
            },
            onError: () => {
                Swal.fire("Gagal!", "Terjadi kesalahan.", "error");
            },
        });
    };

    return (
        <MainLayout2 maxWidth="max-w-2xl" judul="TAMBAH POIN">
            <form onSubmit={handleSubmit}>
                <div className="border-y p-3 px-6 grid grid-cols-1 gap-4">
                    <div className="mb-4">
                        <label className="block text-gray-700">Nama</label>
                        <input
                            type="text"
                            name="nama"
                            value={data.nama}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                            placeholder="Masukan Nama Paket Poin"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">
                            Jumlah Poin
                        </label>
                        <input
                            type="number"
                            name="jumlah_poin"
                            value={data.jumlah_poin}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                            placeholder="Masukan Jumlah Poin"
                            required
                        />
                        <p className="text-xs italic text-gray-500 mt-1">
                            *isi jumlah poin tanpa titik
                        </p>
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">Harga</label>
                        <input
                            type="number"
                            name="harga"
                            value={data.harga}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                            placeholder="Masukan Jumlah Harga Paket Poin"
                            required
                        />
                        <p className="text-xs italic text-gray-500 mt-1">
                            *isi harga tanpa titik
                        </p>
                    </div>
                </div>
                <div className="p-3 px-6 flex justify-between">
                    <Link
                        href="/admin/poin"
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
