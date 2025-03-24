import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ViewQuizzes = () => {
    const [quizzes, setQuizzes] = useState([]);
    const [quizScores, setQuizScores] = useState({});
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    useEffect(() => {
        fetchQuizzes();
        fetchQuizScores();
    }, []);

    const fetchQuizzes = async () => {
        try {
            const res = await axios.get("http://3.142.36.11:5000/quizzes", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setQuizzes(res.data);
        } catch (error) {
            console.error("Failed to load quizzes", error);
        }
    };

    const fetchQuizScores = async () => {
        try {
            const res = await axios.get("http://3.142.36.11:5000/quizzes/scores", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setQuizScores(res.data); 
        } catch (error) {
            console.error("Failed to load quiz scores", error);
        }
    };
    

    return (
        <div className="p-10">
            <h2 className="text-3xl font-bold mb-6">Available Quizzes</h2>
            {quizzes.length === 0 ? (
                <p>No quizzes available.</p>
            ) : (
                <table className="w-full border-collapse border border-gray-300">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="border border-gray-300 p-2">Quiz Title</th>
                            <th className="border border-gray-300 p-2">Actions</th>
                            <th className="border border-gray-300 p-2">Student Scores</th>
                        </tr>
                    </thead>
                    <tbody>
                        {quizzes.map((quiz) => (
                            <tr key={quiz.id}>
                                <td className="border border-gray-300 p-2">{quiz.title}</td>
                                <td className="border border-gray-300 p-2">
                                    <button
                                        onClick={() => navigate(`/modify-quiz/${quiz.id}`)}
                                        className="bg-blue-500 text-white px-4 py-2 rounded"
                                    >
                                        Edit Quiz
                                    </button>
                                </td>
                                <td className="border border-gray-300 p-2">
                                    {quizScores[quiz.id] ? (
                                        <ul>
                                            {quizScores[quiz.id].map((score, index) => (
                                                <li key={index} className="p-1">
                                                    {score.student}: <strong>{score.score} / {score.total_questions}</strong>
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p>No attempts yet</p>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default ViewQuizzes;
