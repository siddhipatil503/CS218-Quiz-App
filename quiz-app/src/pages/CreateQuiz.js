import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";

const CreateQuiz = () => {
    const { token, user } = useContext(AuthContext);
    const [title, setTitle] = useState("");
    const [quizzes, setQuizzes] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        if (!token) return;

        axios.get("http://localhost:5000/quizzes", {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then((res) => {
            console.log("Fetched quizzes:", res.data);  
            setQuizzes(res.data || []);
        })
        .catch((err) => console.error("Error fetching quizzes:", err));
    }, [token]);

    if (user?.role !== "admin") {
        return <h2>Access Denied</h2>;
    }

    const handleCreateQuiz = async () => {
        try {
            const res = await axios.post("http://localhost:5000/quizzes", { title }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            alert("Quiz created successfully!");
            setQuizzes([...quizzes, { id: res.data.quiz_id, title }]);
        } catch (error) {
            alert(error.response?.data?.error || "Error creating quiz");
        }
    };

    return (
        <div>
            <h2>Create a New Quiz</h2>
            <input type="text" placeholder="Quiz Title" onChange={(e) => setTitle(e.target.value)} />
            <button onClick={handleCreateQuiz}>Create Quiz</button>

            <h2>Available Quizzes</h2>
            {quizzes.length === 0 ? <p>No quizzes available.</p> : (
                <ul>
                    {quizzes.map((quiz) => (
                        <li key={quiz.id}>
                            {quiz.title}
                            <button onClick={() => navigate(`/add-questions/${quiz.id}`)}>
                                Add Questions
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default CreateQuiz;
