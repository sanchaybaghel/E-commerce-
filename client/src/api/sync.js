import axios from "./axios"
export const syncUser = (token, name, role) => {
  return axios.post(
    '/api/auth/sync-user',
    { name, role }, // <-- send role
    { headers: { Authorization: `Bearer ${token}` } }
  );
};