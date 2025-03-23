import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const AttemptQuiz = () => {
    const { quizId } = useParams();
    const [quizTitle, setQuizTitle] = useState("");
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState({});
    const [score, setScore] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchQuiz();
    }, []);

    const fetchQuiz = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await axios.get(`http://localhost:5000/quizzes/${quizId}/attempt`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setQuizTitle(res.data.quiz_title);
            setQuestions(res.data.questions);
        } catch (error) {
            console.error("Failed to load quiz", error);
        }
    };

    const handleOptionSelect = (questionId, selectedOption) => {
        setAnswers({ ...answers, [questionId]: selectedOption });
    };

    const submitQuiz = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await axios.post(`http://localhost:5000/quizzes/${quizId}/submit`, 
                { answers }, 
                { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
            );
            setScore(res.data.score);
        } catch (error) {
            console.error("Failed to submit quiz", error);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-10">
            <div className="w-full max-w-3xl bg-white p-8 rounded-lg shadow-lg">
                <h2 className="text-4xl font-bold mb-6 text-center text-blue-600">{quizTitle}</h2>

                {score !== null ? (
                    <div className="bg-green-200 p-6 rounded-lg text-center">
                        <h3 className="text-2xl font-semibold">Your Score: {score}/{questions.length}</h3>
                        <button 
                            onClick={() => navigate("/student-dashboard")} 
                            className="mt-6 bg-blue-500 text-white px-6 py-3 rounded hover:bg-blue-700"
                        >
                            Go to Dashboard
                        </button>
                    </div>
                ) : (
                    <div>
                        {questions.map((q) => (
                            <div key={q.id} className="mb-8 p-4 border rounded-lg">
                                <p className="text-lg font-semibold mb-3">{q.text}</p>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {Object.entries(q.options).map(([optionKey, optionValue]) => (
                                        <label key={optionKey} className="flex items-center space-x-2 cursor-pointer bg-gray-200 p-3 rounded-lg hover:bg-gray-300 transition">
                                            <input
                                                type="radio"
                                                name={`question-${q.id}`}
                                                value={optionKey}
                                                checked={answers[q.id] === optionKey}
                                                onChange={() => handleOptionSelect(q.id, optionKey)}
                                                className="form-radio"
                                            />
                                            <span>{optionValue}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        ))}

                        <button 
                            onClick={submitQuiz} 
                            className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-700 w-full mt-6"
                        >
                            Submit Quiz
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AttemptQuiz;
