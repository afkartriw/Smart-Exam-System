import { useEffect, useState } from "react";
import Checkbox from "@/Components/Checkbox";
import GuestLayout from "@/Layouts/GuestLayout";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import { Head, Link, useForm } from "@inertiajs/react";
import { FaRegEyeSlash, FaRegEye } from "react-icons/fa";
import Navbar from "@/Components/Layout/NavbarAuth";
import { IoArrowBackOutline } from "react-icons/io5";
import { usePage } from "@inertiajs/react";

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: "",
        password: "",
        remember: false,
    });

    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    useEffect(() => {
        return () => {
            reset("password");
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();
        post(route("login"));
    };

    const { abouts } = usePage().props;
    const dataAbout = abouts || [];

    const logo = dataAbout.length > 0 ? dataAbout[0].logo1 : null;

    return (
        <div className="min-h-screen bg-1 flex flex-col items-center justify-center">
            {/* <Navbar /> */}
            {/* Login Form */}
            <main className="container mx-auto px-4 my-4"> <div>
                <img src={logo} alt="LOGO" className="h-10 mx-auto" /> </div>

                <div className="bg-white shadow-md rounded-lg p-6 max-w-md mx-auto mt-6">
                    {/* <div className="relative flex items-center justify-center">
                        <a
                            href="/konfirmasi"
                            className="absolute left-0 text-xl text-gray-400 hover:text-gray-700"
                        >
                            <IoArrowBackOutline />
                        </a>
                        <h2 className="text-lg font-semibold text-blue-600">
                            Login
                        </h2>
                    </div> */}
                    <form onSubmit={submit}>
                        <div className="mb-4">
                            <InputLabel htmlFor="email" value="Email" />

                            <TextInput
                                id="email"
                                type="email"
                                name="email"
                                value={data.email}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                autoComplete="username"
                                isFocused={true}
                                onChange={(e) =>
                                    setData("email", e.target.value)
                                }
                            />

                            <InputError
                                message={errors.email}
                                className="mt-2"
                            />
                        </div>

                        <div className="mb-4 relative">
                            <InputLabel htmlFor="password" value="Password" />

                            <div className="relative">
                                <TextInput
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    value={data.password}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm pr-10"
                                    autoComplete="current-password"
                                    onChange={(e) =>
                                        setData("password", e.target.value)
                                    }
                                />
                                <button
                                    type="button"
                                    onClick={togglePasswordVisibility}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-blue-600"
                                >
                                    {showPassword ? (
                                        <FaRegEye className="h-5 w-5" />
                                    ) : (
                                        <FaRegEyeSlash className="h-5 w-5" />
                                    )}
                                </button>
                            </div>

                            <InputError
                                message={errors.password}
                                className="mt-2"
                            />

                            {canResetPassword && (
                                <Link
                                    href={route("password.request")}
                                    className="text-sm flex justify-end text-blue-600 hover:underline mt-2"
                                >
                                    Forgot your password?
                                </Link>
                            )}
                        </div>

                        <div className="block mt-4">
                            <label className="flex items-center">
                                <Checkbox
                                    name="remember"
                                    checked={data.remember}
                                    onChange={(e) =>
                                        setData("remember", e.target.checked)
                                    }
                                />
                                <span className="ms-2 text-sm text-gray-600">
                                    Remember me
                                </span>
                            </label>
                        </div>

                        <div className="flex items-center justify-center mt-4">
                        <PrimaryButton disabled={processing}>
    <i className="mr-2 fab fa-google"></i> Log in
</PrimaryButton>

                        </div>



                        




                    </form>

                    <div className="relative my-3">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-white text-gray-500">
                                OR
                            </span>
                        </div>
                    </div>

                    {/* Login dengan Google */}
                    <button
                        type="button"
                        className="w-full bg-red-500 text-white px-6 py-2 rounded-md hover:bg-red-600 flex items-center justify-center"
                        onClick={() =>
                            (window.location.href = route("auth.google"))
                        }
                    >
                        <i className="mr-2 fab fa-google"></i> Log in with Google
                    </button>
                </div>
            </main>
        </div>
    );
}
