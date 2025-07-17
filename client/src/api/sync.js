import axios from "./axios"
export const syncUser = () => {
  return axios.post('/api/auth/sync-user', {token:localStorage.getItem("token")}, { withCredentials: true });
};
