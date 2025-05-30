import { useState } from "react";
import Navbar from "../Admin/Navbar";
import { usePage } from "@inertiajs/react";
import SidebarAdmin from "@/Components/Admin/Sidebar";
import SidebarLembaga from "@/Components/Lembaga/Sidebar";
import SidebarStaff from "@/Components/Staff/Sidebar";

const MainLayout = ({ children }) => {
    const { auth } = usePage().props;
    const user = auth?.user;
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    // Pilih Sidebar berdasarkan role
    const renderSidebar = () => {
        switch (user?.role) {
            case "admin":
                return <SidebarAdmin isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />;
            case "lembaga":
                return <SidebarLembaga isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />;
            case "staff":
                return <SidebarStaff isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />;
            default:
                return null;
        }
    };

    return (
        <div className="relative flex h-screen">
            {renderSidebar()}
            <div
                className={`flex-1 flex flex-col ${
                    isSidebarOpen ? "ml-56" : "ml-16"
                } transition-all duration-300`}
            >
                <Navbar toggleSidebar={toggleSidebar} />
                <main className="pt-20 p-6 bg-color-accent min-h-screen h-full bg-1">
                    <div className="bg-white rounded-2xl my-4 border-2">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default MainLayout;
