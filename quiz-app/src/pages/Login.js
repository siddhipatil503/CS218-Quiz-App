import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");

        try {
            console.log("Sending Login Request...");
            const response = await fetch("http://3.142.36.11:5000/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password })
            });

            const data = await response.json();
            console.log("API Response:", data);

            if (!response.ok) {
                throw new Error(data.error || "Login failed");
            }

            
            localStorage.setItem("token", data.access_token);
            localStorage.setItem("role", data.role);

            console.log("🔹 Stored Role:", localStorage.getItem("role"));
            console.log("🔹 Stored Token:", localStorage.getItem("token"));

            
            setTimeout(() => {
                if (data.role === "admin") {
                    navigate("/dashboard", { replace: true });
                } else if (data.role === "student") {
                    navigate("/student-dashboard", { replace: true });
                } else {
                    console.error("Invalid role received:", data.role);
                }
            }, 1000);  
        } catch (err) {
            console.error("Login Error:", err);
            setError(err.message);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <form className="bg-white p-10 rounded-lg shadow-lg" onSubmit={handleLogin}>
                <h2 className="text-3xl font-bold mb-6">Login</h2>
                {error && <p className="text-red-500">{error}</p>}
                <input type="text" placeholder="Username" className="mb-4 p-3 border rounded w-full"
                    value={username} onChange={(e) => setUsername(e.target.value)} required />
                <input type="password" placeholder="Password" className="mb-4 p-3 border rounded w-full"
                    value={password} onChange={(e) => setPassword(e.target.value)} required />
                <button type="submit" className="w-full bg-blue-500 text-white py-3 rounded hover:bg-blue-700 transition">
                    Login
                </button>
            </form>
        </div>
    );
};

export default Login;
