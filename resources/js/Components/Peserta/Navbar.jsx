// import React, { useState } from "react";
// import { usePage, useForm } from "@inertiajs/react";

// export default function Navbar({ toggleSidebar }) {
//   const { auth } = usePage().props; // Ambil data user dari Inertia
//   const user = auth.user; // Data user yang sedang login
//   const [isDropdownOpen, setIsDropdownOpen] = useState(false);
//   const { post } = useForm();

//   const handleLogout = () => {
//     post(route("logout"));
//   };

//   return (
//     <header className="fixed top-0 left-0 right-0 flex justify-between items-center bg-blue-500 text-white p-3 shadow-md z-30 px-16">
//       <div>
//       <img src="/images/logo.png" alt="LOGO" className="h-8 w-auto" />

//       </div>
//       <div className="text-lg font-semibold">
//       Smart Exam System | {user?.lembaga?.nama_lembaga ?? "Memuat..."}
//       </div>
//       <div className="flex items-center space-x-4 relative">
//         <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
//         <span
//           className="cursor-pointer flex items-center space-x-2"
//           onClick={() => setIsDropdownOpen(!isDropdownOpen)}
//         ><div className="flex">
//           <span>{user ? user.nama_lengkap : "Nama"} <br />({user?.role})</span></div>
//           <svg
//             className={`w-4 h-4 transition-transform duration-200 ${
//               isDropdownOpen ? "transform rotate-180" : ""
//             }`}
//             fill="none"
//             stroke="currentColor"
//             viewBox="0 0 24 24"
//             xmlns="http://www.w3.org/2000/svg"
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               strokeWidth={2}
//               d="M19 9l-7 7-7-7"
//             />
//           </svg>
//         </span>

//         {isDropdownOpen && (
//           <div className="absolute top-12 right-0 bg-white text-gray-800 rounded-lg shadow-lg w-48 overflow-hidden">
//             <button
//               className="flex items-center w-full px-4 py-3 text-sm hover:bg-gray-100 transition-colors duration-200"
//               onClick={handleLogout}
//             >
//               <svg
//                 className="w-5 h-5 mr-2 text-gray-600"
//                 fill="none"
//                 stroke="currentColor"
//                 viewBox="0 0 24 24"
//                 xmlns="http://www.w3.org/2000/svg"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={2}
//                   d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
//                 />
//               </svg>
//               Logout
//             </button>
//           </div>
//         )}
//       </div>
//     </header>
//   );
// }
