import axios from 'axios';

export const baseServerURL = 'http://localhost:8000';

export const apiClient = axios.create({
    baseURL: baseServerURL,
});
