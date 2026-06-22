import { io } from "socket.io-client";

const BACKEND = import.meta.env.VITE_API_URL ?? 'http://localhost:7000';
export const socket = io(BACKEND, { withCredentials: true });