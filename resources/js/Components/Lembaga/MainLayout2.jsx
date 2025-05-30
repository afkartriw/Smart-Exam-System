import Navbar from "../Admin/Navbar";

const MainLayout2 = ({ children, maxWidth, judul }) => {
    return (
        <div className="min-h-screen bg-1">
            <Navbar />
            <main className={`mx-auto min-h-screen flex flex-col justify-center pt-24 ${maxWidth}`}>
                <div className="bg-white rounded-2xl shadow-md border-2"> 
                {judul && (
                        <div className="px-6 py-3">
                            <h1 className="text-2xl font-bold text-blue-900">
                                {judul}
                            </h1>
                        </div>
                    )}
                    {children}
                </div>
            </main>
        </div>
    );
};

export default MainLayout2;

