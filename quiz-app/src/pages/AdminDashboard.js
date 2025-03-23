import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AdminDashboard = () => {
    const [quizzes, setQuizzes] = useState([]);
    const [newQuizTitle, setNewQuizTitle] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        fetchQuizzes();
    }, []);

    const fetchQuizzes = async () => {
        try {
            const res = await axios.get("http://localhost:5000/quizzes");
            setQuizzes(res.data);
        } catch (error) {
            console.error("Failed to load quizzes", error);
        }
    };

    const createQuiz = async () => {
        try {
            const token = localStorage.getItem("token");
            await axios.post("http://localhost:5000/quizzes", { title: newQuizTitle }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setNewQuizTitle("");  
            fetchQuizzes(); 
        } catch (error) {
            console.error("Quiz creation failed", error);
        }
    };

    return (
        <div className="p-10">
            <h2 className="text-3xl font-bold mb-6">Admin Dashboard</h2>

           
            <div className="bg-gray-200 p-6 rounded-lg mb-6">
                <h3 className="text-xl font-semibold mb-3">Create a New Quiz</h3>
                <input
                    type="text"
                    placeholder="Enter Quiz Title"
                    value={newQuizTitle}
                    onChange={(e) => setNewQuizTitle(e.target.value)}
                    className="p-2 border rounded w-full mb-3"
                />
                <button
                    onClick={createQuiz}
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                    Create Quiz
                </button>
            </div>

            
            <div className="bg-gray-200 p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-3">Existing Quizzes</h3>
                {quizzes.length === 0 ? (
                    <p>No quizzes available.</p>
                ) : (
                    quizzes.map((quiz) => (
                        <div key={quiz.id} className="p-4 bg-white rounded mb-3 flex justify-between">
                            <span>{quiz.title}</span>
                            <div>
                                <button
                                    className="bg-green-500 text-white px-3 py-1 rounded mr-2"
                                    onClick={() => navigate(`/modify-quiz/${quiz.id}`)}
                                >
                                    Modify
                                </button>
                                <button
                                    className="bg-red-500 text-white px-3 py-1 rounded"
                                    onClick={() => navigate(`/view-quiz/${quiz.id}`)}
                                >
                                    View
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
