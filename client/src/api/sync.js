import axios from "./axios"
export const syncUser = () => {
  const token = localStorage.getItem("token");
  return axios.post(
    '/api/auth/sync-user',
    {token:token}, // No need to send token in body
    {
      withCredentials: true,
      headers: {
        Authorization: `Bearer ${token}`,
      }
    }
  );
};