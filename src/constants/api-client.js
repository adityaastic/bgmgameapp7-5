import axios from "axios";

const apiClient = axios.create({
  // baseURL: "http://192.168.1.18:8000/club",
  // player-update/1020304050/
  baseURL: 'https://api.thebgmgame.com/club'
});

export const adminApiClient = axios.create({
  // baseURL: "http://192.168.1.18:8000/dashboard",
  baseURL: 'https://api.thebgmgame.com/dashboard'
});

export const BaseURLCLUB = 'https://api.thebgmgame.com/club'
export const BaseURLDASHBOARD = 'https://api.thebgmgame.com/dashboard'

export const imageApiClient = 'https://api.thebgmgame.com/'
// 'https://api.thebgmgame.com'
// 'http://192.168.1.4:8000'

export default apiClient;

