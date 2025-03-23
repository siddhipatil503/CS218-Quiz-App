import { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import AuthContext from "../context/AuthContext";

const ModifyQuestions = () => {
    const { token } = useContext(AuthContext);
    const { quizId } = useParams();
    const [questions, setQuestions] = useState([]);
    const [editedQuestions, setEditedQuestions] = useState({}); 

    useEffect(() => {
        if (!token) return;

        axios.get(`http://localhost:5000/quizzes/${quizId}/questions`, {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then((res) => setQuestions(res.data.questions || []))
        .catch(err => console.error("Error fetching questions:", err));
    }, [quizId, token]);

    const handleInputChange = (questionId, newText) => {
        setEditedQuestions({ ...editedQuestions, [questionId]: newText }); 
    };

    const handleUpdateQuestion = async (questionId) => {
        try {
            const updatedText = editedQuestions[questionId] || ""; 

            await axios.put(`http://localhost:5000/quizzes/${quizId}/questions/${questionId}`, {
                question_text: updatedText
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            alert("Question updated successfully!");
            setQuestions(questions.map(q => q.id === questionId ? { ...q, question_text: updatedText } : q));
        } catch (error) {
            alert("Error updating question");
        }
    };

    return (
        <div>
            <h2>Modify Questions</h2>
            {questions.length === 0 ? <p>No questions available.</p> : (
                questions.map(q => (
                    <div key={q.id}>
                        <input
                            type="text"
                            value={editedQuestions[q.id] ?? q.question_text} 
                            onChange={(e) => handleInputChange(q.id, e.target.value)} 
                        />
                        <button onClick={() => handleUpdateQuestion(q.id)}>Update</button> 
                    </div>
                ))
            )}
        </div>
    );
};

export default ModifyQuestions;
