import axios from "axios";

const API_URL = "http://3.142.36.11:5000";

export const registerUser = async (userData) => {
    return axios.post(`${API_URL}/register`, userData);
};

export const loginUser = async (userData) => {
    return axios.post(`${API_URL}/login`, userData);
};
