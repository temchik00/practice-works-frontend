import axios from 'axios';

const baseURL = process.env.NX_API_URL
  ? 'http://' + process.env.NX_API_URL
  : 'http://localhost:8002';

export default axios.create({
  baseURL: baseURL,
  withCredentials: true,
});

export const axiosPrivate = axios.create({
  baseURL: baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});
