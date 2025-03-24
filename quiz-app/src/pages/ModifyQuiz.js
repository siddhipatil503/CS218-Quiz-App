import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const ModifyQuiz = () => {
    const { quizId } = useParams();
    const [title, setTitle] = useState("");
    const [questions, setQuestions] = useState([]);
    const [newQuestion, setNewQuestion] = useState({
        text: "",
        optionA: "",
        optionB: "",
        optionC: "",
        optionD: "",
        correctOption: "A"
    });
    const token = localStorage.getItem("token");

    useEffect(() => {
        fetchQuiz();
    }, []);

    const fetchQuiz = async () => {
        try {
            const res = await axios.get(`http://3.142.36.11:5000/quizzes/${quizId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setTitle(res.data.title);
            setQuestions(res.data.questions || []);
        } catch (error) {
            console.error("Failed to load quiz details", error);
        }
    };

    const updateTitle = async () => {
        try {
            await axios.put(`http://3.142.36.11:5000/quizzes/${quizId}`, { title }, {
                headers: { Authorization: `Bearer ${token}` },
            });
            alert("✅ Quiz title updated!");
        } catch (error) {
            console.error("Failed to update quiz title", error);
        }
    };

    const addQuestion = async () => {
        try {
            const payload = {
                text: newQuestion.text,
                option_a: newQuestion.optionA,
                option_b: newQuestion.optionB,
                option_c: newQuestion.optionC,
                option_d: newQuestion.optionD,
                correct_option: newQuestion.correctOption,
            };

            const res = await axios.post(`http://3.142.36.11:5000/quizzes/${quizId}/questions`, payload, {
                headers: { Authorization: `Bearer ${token}` },
            });

            setQuestions([...questions, res.data]);
            setNewQuestion({
                text: "",
                optionA: "",
                optionB: "",
                optionC: "",
                optionD: "",
                correctOption: "A"
            });

            alert("Question added successfully!");
        } catch (error) {
            console.error("Failed to add question", error);
        }
    };

    return (
        <div className="p-10 w-full min-h-screen bg-gray-100">
            <h2 className="text-4xl font-bold mb-6 text-center">Modify Quiz</h2>

           
            <div className="bg-white p-6 rounded-lg shadow mb-6 w-3/4 mx-auto">
                <h3 className="text-2xl font-semibold mb-3">Quiz Title</h3>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="p-2 border rounded w-full mb-3"
                />
                <button onClick={updateTitle} className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-700">
                    Update Title
                </button>
            </div>

            
            <div className="bg-white p-6 rounded-lg shadow mb-6 w-3/4 mx-auto">
                <h3 className="text-2xl font-semibold mb-3">Add Question</h3>
                <input
                    type="text"
                    placeholder="Enter Question"
                    value={newQuestion.text}
                    onChange={(e) => setNewQuestion({ ...newQuestion, text: e.target.value })}
                    className="p-2 border rounded w-full mb-3"
                />
                <input
                    type="text"
                    placeholder="Option A"
                    value={newQuestion.optionA}
                    onChange={(e) => setNewQuestion({ ...newQuestion, optionA: e.target.value })}
                    className="p-2 border rounded w-full mb-3"
                />
                <input
                    type="text"
                    placeholder="Option B"
                    value={newQuestion.optionB}
                    onChange={(e) => setNewQuestion({ ...newQuestion, optionB: e.target.value })}
                    className="p-2 border rounded w-full mb-3"
                />
                <input
                    type="text"
                    placeholder="Option C"
                    value={newQuestion.optionC}
                    onChange={(e) => setNewQuestion({ ...newQuestion, optionC: e.target.value })}
                    className="p-2 border rounded w-full mb-3"
                />
                <input
                    type="text"
                    placeholder="Option D"
                    value={newQuestion.optionD}
                    onChange={(e) => setNewQuestion({ ...newQuestion, optionD: e.target.value })}
                    className="p-2 border rounded w-full mb-3"
                />

                <label className="block text-lg font-semibold mb-2">Correct Answer:</label>
                <select
                    value={newQuestion.correctOption}
                    onChange={(e) => setNewQuestion({ ...newQuestion, correctOption: e.target.value })}
                    className="p-2 border rounded w-full mb-3"
                >
                    <option value="A">Option A</option>
                    <option value="B">Option B</option>
                    <option value="C">Option C</option>
                    <option value="D">Option D</option>
                </select>

                <button onClick={addQuestion} className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-700">
                    Add Question
                </button>
            </div>

            
            <div className="bg-white p-6 rounded-lg shadow w-3/4 mx-auto">
                <h3 className="text-2xl font-semibold mb-3">Existing Questions</h3>
                {questions.length === 0 ? (
                    <p className="text-center">No questions added yet.</p>
                ) : (
                    <ul className="list-disc pl-6">
                        {questions.map((q, index) => (
                            <li key={index} className="p-2 border-b">
                                <strong>{q.text}</strong> 
                                <br /> A: {q.option_a} | B: {q.option_b} | C: {q.option_c} | D: {q.option_d}
                                <br /> Correct Answer: {q.correct_option}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default ModifyQuiz;
