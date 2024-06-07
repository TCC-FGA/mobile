import axios from 'axios';

export const api = axios.create({
  baseURL: 'https://simulafin.up.railway.app',
});
