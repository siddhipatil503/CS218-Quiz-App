import axios from "axios";

const API_URL = "http://3.142.36.11:5000";

export const createQuiz = async (quizData, token) => {
    return axios.post(`${API_URL}/quizzes`, quizData, {
        headers: { Authorization: `Bearer ${token}` },
    });
};

export const getQuizzes = async () => {
    return axios.get(`${API_URL}/quizzes`);
};

export const getQuizQuestions = async (quizId) => {
    return axios.get(`${API_URL}/quizzes/${quizId}/questions`);
};

export const attemptQuiz = async (quizId, answers, token) => {
    return axios.post(`${API_URL}/quizzes/${quizId}/attempt`, { answers }, {
        headers: { Authorization: `Bearer ${token}` },
    });
};
