import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Dashboard = () => {
    const [quizzes, setQuizzes] = useState([]);  
    const [newQuizTitle, setNewQuizTitle] = useState("");
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    useEffect(() => {
        fetchQuizzes();
    }, []);

    const fetchQuizzes = async () => {
        try {
            if (!token) {
                console.error("No authentication token found. Redirecting to login.");
                return;
            }

            console.log("🟡 Fetching quizzes with token:", token);

            const res = await axios.get("http://localhost:5000/quizzes", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setQuizzes(res.data || []); 
        } catch (error) {
            console.error("Failed to load quizzes", error);
        }
    };

    const createQuiz = async () => {
        try {
            if (!newQuizTitle.trim()) {
                console.error("Quiz title cannot be empty");
                return;
            }
    
            const payload = { title: newQuizTitle.trim() };
    
            console.log("Sending Quiz Data:", JSON.stringify(payload));
    
            const res = await axios.post("http://localhost:5000/quizzes", payload, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });
    
            console.log("✅ Quiz Created:", res.data);
            setNewQuizTitle("");
            setQuizzes((prevQuizzes) => [...prevQuizzes, { id: res.data.id, title: newQuizTitle.trim() }]); // ✅ Append new quiz
        } catch (error) {
            console.error("Quiz creation failed", error);
            if (error.response) {
                console.error(" Backend Error Response:", error.response.data);
            }
        }
    };

    return (
        <div className="p-10 w-full min-h-screen bg-gray-100">
            <h2 className="text-4xl font-bold mb-6 text-center">Admin Dashboard</h2>

            {/* Create Quiz */}
            <div className="bg-white p-6 rounded-lg shadow mb-6 w-3/4 mx-auto">
                <h3 className="text-2xl font-semibold mb-3">Create a New Quiz</h3>
                <input
                    type="text"
                    placeholder="Enter Quiz Title"
                    value={newQuizTitle}
                    onChange={(e) => setNewQuizTitle(e.target.value)}
                    className="p-2 border rounded w-full mb-3"
                />
                <button
                    onClick={createQuiz}
                    className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-700"
                >
                    Create Quiz
                </button>
            </div>

            {/* List Quizzes */}
            <div className="bg-white p-6 rounded-lg shadow w-3/4 mx-auto">
                <h3 className="text-2xl font-semibold mb-3">Existing Quizzes</h3>
                {quizzes.length === 0 ? (
                    <p className="text-center">No quizzes available.</p>
                ) : (
                    <table className="w-full border-collapse border border-gray-300">
                        <thead>
                            <tr className="bg-gray-200">
                                <th className="border border-gray-300 p-2">Quiz Title</th>
                                <th className="border border-gray-300 p-2">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {quizzes.map((quiz) => (
                                <tr key={quiz.id}>
                                    <td className="border border-gray-300 p-2">{quiz.title}</td>
                                    <td className="border border-gray-300 p-2 text-center">
                                        <button
                                            onClick={() => navigate(`/modify-quiz/${quiz.id}`)}
                                            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700"
                                        >
                                            Edit Quiz
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
