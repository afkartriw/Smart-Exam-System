import { useState } from "react";
import { useForm } from "@inertiajs/react";
import Swal from "sweetalert2";
import Sidebar from "@/Components/Staff/Sidebar";
import Navbar from "@/Components/admin/Navbar";
import { FaPencilAlt } from "react-icons/fa";

const EditProfile = ({ staff }) => {
    const { data, setData, post, processing, errors } = useForm({
        nama_staff: staff.nama_staff || "",
        email: staff.email || "",
        lembaga_id: staff.lembaga_id || "",
        photo: null,
    });

    const [logoPreview, setLogoPreview] = useState(staff.photo_url || null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setData(name, value);
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData("photo", file);
            setLogoPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("staff.update_profile"), {
            onSuccess: () => {
                Swal.fire({
                    icon: "success",
                    title: "Success",
                    text: "Profil berhasil diperbarui!",
                    confirmButtonText: "OK",
                });
            },
        });
    };

    return (
        <div className="relative flex">
            <Sidebar
                isSidebarOpen={isSidebarOpen}
                toggleSidebar={toggleSidebar}
            />
            <div
                className={`flex-1 flex flex-col ${
                    isSidebarOpen ? "ml-56" : "ml-16"
                } transition-all duration-300`}
            >
                <Navbar toggleSidebar={toggleSidebar} />
                <main className="pt-24 p-6 bg-gray-200 min-h-screen flex justify-center items-center">
                    <div className="bg-white shadow-lg rounded-xl w-8/12">
                        <h1 className="text-3xl text-blue-900 p-3 px-6 font-bold">
                            PROFILE STAFF
                        </h1>
                        <form onSubmit={handleSubmit}>
                            <div className="border-y border-gray-300 p-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="row-span-3 relative">
                                        <label className="text-gray-700">
                                            Photo :
                                        </label>
                                        <div className="flex justify-center mt-4 relative">
                                            <img
                                                src={
                                                    logoPreview ||
                                                    "/path/to/default-logo.png"
                                                }
                                                alt="Profile"
                                                className="h-52 w-52 object-cover border border-black rounded-lg"
                                            />
                                            <label className="absolute -bottom-2 right-12 bg-blue-600 text-white p-3 rounded-full cursor-pointer hover:bg-blue-800">
                                                <FaPencilAlt size={20} />
                                                <input
                                                    type="file"
                                                    name="photo"
                                                    onChange={handleFileChange}
                                                    className="hidden"
                                                />
                                            </label>
                                        </div>
                                        {errors.photo && (
                                            <p className="text-red-500 text-sm mt-2">
                                                {errors.photo}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-gray-700">
                                            Lembaga:
                                        </label>
                                        <input
                                            type="text"
                                            name="lembaga_id"
                                            value={staff.lembaga ? staff.lembaga.nama_lembaga : "N/A"}
                                            className="w-full px-4 py-2 border rounded-md bg-gray-100"
                                            readOnly
                                        />
                                        {errors.lembaga_id && (
                                            <p className="text-red-500 text-sm">
                                                {errors.lembaga_id}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-gray-700">
                                            Nama Lengkap:
                                        </label>
                                        <input
                                            type="text"
                                            name="nama_staff"
                                            value={data.nama_staff}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-2 border rounded-md focus:ring focus:ring-blue-500"
                                        />
                                        {errors.nama_staff && (
                                            <p className="text-red-500 text-sm">
                                                {errors.nama_staff}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-gray-700">
                                            Email:
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={data.email}
                                            className="w-full px-4 py-2 border rounded-md bg-gray-100"
                                            readOnly
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="col-span-2 flex justify-between p-6 gap-x-4">
                                <button
                                    type="button"
                                    onClick={() => window.history.back()}
                                    className="w-full px-6 py-2 border text-white bg-gray-600 shadow rounded-md hover:bg-gray-900"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="w-full px-6 py-2 bg-blue-600 text-white shadow rounded-md hover:bg-blue-700"
                                    disabled={processing}
                                >
                                    {processing ? "Updating..." : "Update"}
                                </button>
                            </div>
                        </form>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default EditProfile;