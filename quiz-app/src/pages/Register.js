import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Register = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("student");
    const navigate = useNavigate();

    const handleRegister = async () => {
        try {
            const res = await axios.post("http://localhost:5000/register", {
                username,
                password,
                role,
            });
    
            console.log("API Response:", res);
    
            if (res && res.data) {
                alert("Registration Successful. Please login.");
                navigate("/login");
            } else {
                throw new Error("Unexpected response from server");
            }
        } catch (error) {
            console.error("Registration Error:", error);
    
            if (error.response) {
                
                console.error("Backend Error:", error.response.data);
                alert(error.response.data.error || "Registration failed");
            } else if (error.request) {
                
                console.error("No Response from Server:", error.request);
                alert("Server not responding. Check if backend is running.");
            } else {
                
                console.error("Unexpected Error:", error.message);
                alert("Unexpected error occurred.");
            }
        }
    };
    

    return (
        <div>
            <h2>Register</h2>
            <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <select value={role} onChange={(e) => setRole(e.target.value)}>
                <option value="student">Student</option>
                <option value="admin">Admin</option>
            </select>
            <button onClick={handleRegister}>Register</button>
        </div>
    );
};

export default Register;
