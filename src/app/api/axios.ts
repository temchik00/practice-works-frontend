import axios from 'axios';

export default axios.create({
  baseURL: process.env.NX_API_URL
    ? process.env.NX_API_URL
    : 'http://localhost:8002',
  withCredentials: true,
});

export const axiosPrivate = axios.create({
  baseURL: process.env.NX_API_URL
    ? process.env.NX_API_URL
    : 'http://localhost:8002',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});
