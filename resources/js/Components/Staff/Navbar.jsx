// import React, { useState } from "react";
// import { usePage, useForm } from "@inertiajs/react";
// import { HiOutlineChevronDown } from "react-icons/hi2";
// import { HiOutlineLogout, HiOutlineUser } from "react-icons/hi";
// import { router } from "@inertiajs/react";

// export default function Navbar({ toggleSidebar }) {
//     const { auth } = usePage().props;
//     const user = auth.user;
//     const [isDropdownOpen, setIsDropdownOpen] = useState(false);
//     const { post } = useForm();
//     const { abouts } = usePage().props;

//     const aboutData = abouts.length > 0 ? abouts[0] : null;
//     const logo2 = aboutData ? `${aboutData.logo2}` : null;
//     const appName = aboutData ? aboutData.nama : "Smart Exam System";

//     const handleLogout = () => {
//         post(route("logout"));
//     };

//     const handleProfile = () => {
//         const profileRoute = user?.role === "lembaga" ? "/lembaga/profile" : "/staff/profile";
//         router.visit(profileRoute);
//     };

//     return (
//         <header className="fixed top-0 left-0 right-0 flex justify-between items-center bg-blue-500 text-white p-3 shadow-md z-30 pl-16 pr-8 h-[75px]">
//             <div>
//                 {logo2 ? (
//                     <img src={logo2} alt="LOGO" className="h-10" />
//                 ) : (
//                     <span>Loading...</span>
//                 )}
//             </div>
//             <div className="text-lg font-semibold">
//                 {appName} | {user?.lembaga?.nama_lembaga ?? "Memuat..."}
//             </div>
//             <div className="flex items-center space-x-4 relative">
//                 <div>
//                     {user?.role === "lembaga" ? (
//                         <img
//                             src={
//                                 user?.lembaga?.logo
//                                     ? `/storage/${user.lembaga.logo}`
//                                     : "https://via.placeholder.com/40"
//                             }
//                             alt="LOGO"
//                             className="w-10 h-10 rounded-full bg-cover object-cover"
//                         />
//                     ) : (
//                         <img
//                             src={
//                                 user?.staff?.photo
//                                     ? `/storage/${user.staff.photo}`
//                                     : "https://via.placeholder.com/40"
//                             }
//                             alt="Profile"
//                             className="w-10 h-10 rounded-full bg-cover object-cover"
//                         />
//                     )}
//                 </div>
//                 <span
//                     className="cursor-pointer flex items-center space-x-2"
//                     onClick={() => setIsDropdownOpen(!isDropdownOpen)}
//                 >
//                     <div className="flex flex-col items-start">
//                         <div className="flex items-center space-x-2">
//                             <span className="text-base">
//                                 {user?.role === "lembaga"
//                                     ? user?.lembaga?.nama_lengkap ?? "Nama"
//                                     : user?.staff?.nama_staff ?? "Nama"}
//                             </span>

//                             <HiOutlineChevronDown
//                                 className={`w-5 h-5 transition-transform duration-200 ${
//                                     isDropdownOpen ? "transform rotate-180" : ""
//                                 }`}
//                             />
//                         </div>
//                         <span className="text-sm">({user?.role})</span>
//                     </div>
//                 </span>

//                 {isDropdownOpen && (
//                     <div className="absolute top-12 right-0 bg-white text-gray-800 rounded-lg shadow-lg w-48 overflow-hidden">
//                         <button
//                             className="flex items-center w-full px-4 py-3 text-sm hover:bg-gray-100 transition-colors duration-200"
//                             onClick={handleProfile}
//                         >
//                             <HiOutlineUser className="w-5 h-5 mr-2" />
//                             Profil
//                         </button>
//                         <button
//                             className="flex items-center w-full px-4 py-3 text-sm hover:bg-gray-100 transition-colors duration-200"
//                             onClick={handleLogout}
//                         >
//                             <HiOutlineLogout className="w-5 h-5 mr-2" />
//                             Logout
//                         </button>
//                     </div>
//                 )}
//             </div>
//         </header>
//     );
// }
