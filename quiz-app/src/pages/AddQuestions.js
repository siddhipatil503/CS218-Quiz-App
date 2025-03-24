import { useState, useContext } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import AuthContext from "../context/AuthContext";

const AddQuestions = () => {
    const { token } = useContext(AuthContext);
    const { quizId } = useParams();
    const [questionText, setQuestionText] = useState("");
    const [options, setOptions] = useState(["", "", "", ""]);
    const [answer, setAnswer] = useState("");

    const handleAddQuestion = async () => {
        try {
            await axios.post(`http://3.142.36.11:5000/quizzes/${quizId}/questions`, {
                question_text: questionText,
                options,
                answer,
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            alert("Question added successfully!");
            setQuestionText("");
            setOptions(["", "", "", ""]);
            setAnswer("");  
        } catch (error) {
            alert(error.response?.data?.error || "Error adding question");
        }
    };

    return (
        <div>
            <h2>Add Questions</h2>
            <input
                type="text"
                placeholder="Question Text"
                value={questionText}
                onChange={(e) => setQuestionText(e.target.value)}
            />
            
            
            {options.map((opt, index) => (
                <input
                    key={index}
                    type="text"
                    placeholder={`Option ${index + 1}`}
                    value={opt}
                    onChange={(e) => {
                        const newOptions = [...options];
                        newOptions[index] = e.target.value;
                        setOptions(newOptions);
                    }}
                />
            ))}

            
            <select value={answer} onChange={(e) => setAnswer(e.target.value)}>
                <option value="">Select Correct Answer</option>
                {options.filter(opt => opt.trim() !== "").map((opt, index) => (
                    <option key={index} value={opt}>
                        {opt}
                    </option>
                ))}
            </select>

            <button onClick={handleAddQuestion}>Add Question</button>
        </div>
    );
};

export default AddQuestions;
