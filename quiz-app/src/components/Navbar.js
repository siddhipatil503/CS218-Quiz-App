import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
    const navigate = useNavigate();
    const role = localStorage.getItem("role");

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        navigate("/login");
    };

    return (
        <nav className="bg-blue-600 text-white p-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold">Quiz App</h1>
            <div className="flex space-x-6">
                {role ? (
                    <>
                        <Link to="/dashboard" className="hover:underline">Dashboard</Link>
                        {role === "admin" && (
                            <Link to="/view-quizzes" className="hover:underline">View Quizzes</Link>
                        )}
                        <button onClick={handleLogout} className="bg-red-500 px-4 py-2 rounded">Logout</button>
                    </>
                ) : (
                    <>
                        <Link to="/register" className="bg-green-500 px-4 py-2 rounded">Register</Link>
                        <Link to="/login" className="bg-blue-500 px-4 py-2 rounded">Login</Link>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
