import axios from "axios";

const url = "https://numble-backend-production.up.railway.app";

export const getAllUser = () => {
  return axios.get(`${url}/users/all`);
};

export const register = (user) => {
  const newUser = { ...user, score: 0 };
  return axios.post(`${url}/users/create`, newUser);
};

export const login = (user) => {
  return axios.post(`${url}/users/login`, user);
};

export const getLeaderBoard = () => {
  return axios.get(`${url}/users/board`);
};
