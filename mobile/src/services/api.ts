import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3333',
})

export default api;

// docker start gostack_postgres redis mongodb  no backend
// adb reverse tcp:3333 tcp:3333   no powershell