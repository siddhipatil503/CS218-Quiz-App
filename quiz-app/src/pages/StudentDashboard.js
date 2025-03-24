import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const StudentDashboard = () => {
    const [quizzes, setQuizzes] = useState([]);
    const [scores, setScores] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        fetchQuizzes();
        fetchScores();
    }, []);

    const fetchQuizzes = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await axios.get("http://3.142.36.11:5000/quizzes", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setQuizzes(res.data);
            console.log("Quizzes Loaded:", res.data);
        } catch (error) {
            console.error("Failed to load quizzes", error);
        }
    };

    const fetchScores = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await axios.get("http://3.142.36.11:5000/student/scores", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setScores(res.data);
            console.log("Scores Loaded:", res.data);
        } catch (error) {
            console.error("Failed to load scores", error);
        }
    };

    return (
        <div className="p-10 min-h-screen">
            <h2 className="text-3xl font-bold mb-6">Student Dashboard</h2>

            <div className="bg-gray-200 p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-3">Available Quizzes</h3>
                {quizzes.length === 0 ? (
                    <p>No quizzes available.</p>
                ) : (
                    quizzes.map((quiz) => (
                        <div key={quiz.id} className="p-4 bg-white rounded mb-3 flex justify-between items-center">
                            <span className="font-semibold">{quiz.title}</span>
                            {scores[quiz.id] ? (
                                <span className="text-green-600 font-bold">
                                    Score: {scores[quiz.id].score} / {scores[quiz.id].total_questions}
                                </span>
                            ) : (
                                <button
                                    className="bg-blue-500 text-white px-3 py-1 rounded"
                                    onClick={() => navigate(`/attempt-quiz/${quiz.id}`)}
                                >
                                    Attempt Quiz
                                </button>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default StudentDashboard;
