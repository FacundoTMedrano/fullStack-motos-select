import axios from "axios";

export const axiosPrivate = axios.create({
    baseURL: "http://localhost:5173/",
    headers: { "Content-Type": "application/json" },
    withCredentials: true,
});

export const axiosPublic = axios.create({
    baseURL: "http://localhost:5173/",
    headers: { "Content-Type": "application/json" },
});
