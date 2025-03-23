import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import ViewQuizzes from "./pages/ViewQuizzes";
import ModifyQuiz from "./pages/ModifyQuiz";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import StudentDashboard from "./pages/StudentDashboard";
import AttemptQuiz from "./pages/AttemptQuiz"; 

function App() {
    return (
        <Router>
            <Navbar />
            <div className="p-6">
                <Routes>
                    <Route path="/register" element={<Register />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/student-dashboard" element={<StudentDashboard />} />
                    <Route path="/view-quizzes" element={<ViewQuizzes />} />
                    <Route path="/modify-quiz/:quizId" element={<ModifyQuiz />} />
                    <Route path="/attempt-quiz/:quizId" element={<AttemptQuiz />} /> 
                </Routes>
            </div>
        </Router>
    );
}

export default App;
