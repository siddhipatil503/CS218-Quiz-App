import { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import AuthContext from "../context/AuthContext";

const QuizDetails = () => {
    const { token } = useContext(AuthContext);
    const { quizId } = useParams();
    const [questions, setQuestions] = useState([]);
    const [totalScore, setTotalScore] = useState(0);

    useEffect(() => {
        if (!token) return;

        axios.get(`http://localhost:5000/quizzes/${quizId}/questions`, {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then((res) => {
            setQuestions(res.data.questions || []);
            setTotalScore(res.data.questions.length); 
        })
        .catch(err => console.error("Error fetching quiz details:", err));
    }, [quizId, token]);

    return (
        <div>
            <h2>Quiz Details</h2>
            <p><strong>Total Questions:</strong> {questions.length}</p>
            <p><strong>Total Possible Score:</strong> {totalScore}</p>

            {questions.length === 0 ? <p>No questions available.</p> : (
                <ul>
                    {questions.map(q => (
                        <li key={q.id}>
                            <p><strong>Q:</strong> {q.question_text}</p>
                            <p><strong>Options:</strong> {q.options.join(", ")}</p>
                            <p><strong>Correct Answer:</strong> {q.answer}</p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default QuizDetails;
