import axios from 'axios';

export const api = axios.create({
  baseURL: 'https://simulationback-end-production.up.railway.app',
});
