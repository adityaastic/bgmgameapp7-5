// import axios from "axios";

// const apiClient = axios.create({
//   // baseURL: "http://192.168.1.18:8000/club",
//   // player-update/1020304050/
//   baseURL: 'https://api.thebgmgame.com/club'
// });

// export const adminApiClient = axios.create({
//   // baseURL: "http://192.168.1.18:8000/dashboard",
//   baseURL: 'https://api.thebgmgame.com/dashboard'
// });

// export const BaseURLCLUB = 'https://api.thebgmgame.com/club'
// export const BaseURLDASHBOARD = 'https://api.thebgmgame.com/dashboard'

// export const imageApiClient = 'https://api.thebgmgame.com/'
// // 'https://api.thebgmgame.com'
// // 'http://192.168.1.4:8000'

// export default apiClient;



import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';
 
// === API BASE URLs ===
export const BaseURLCLUB = 'https://api.thebgmgame.com/club';
export const BaseURLDASHBOARD = 'https://api.thebgmgame.com/dashboard';
export const imageApiClient = 'https://api.thebgmgame.com/';
export const BaseURLCLUBNode = 'https://bgmbackend.com/nodejs/club'
 
// === Axios Instances ===
export const apiClient = axios.create({
  baseURL: 'https://bgmbackend.com/club',
});
 
export const adminApiClient = axios.create({
  baseURL: 'https://bgmbackend.com/dashboard',
});
 
export const apiClientNode = axios.create({
  baseURL: 'https://bgmbackend.com/nodejs/club',
});
 
export const apiClientScrapper = axios.create({
  baseURL: 'https://server.bgmbackend.com/api',
});
 
 
 
// === Set Auth Header for Each Request ===
const setAuthHeader = async (config) => {
  try {
    const token = await AsyncStorage.getItem("token");
 
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
      config.headers["User-Type"] = "Player";
 
      if (config.data instanceof FormData) {
        config.headers["Content-Type"] = "multipart/form-data";
      } else {
        config.headers["Content-Type"] = "application/json";
      }
    }
    console.log("---------->",config)
 
    return config;
  } catch (err) {
    console.log("Error in setAuthHeader:", err);
    return config;
  }
};
 
// === Handle Unauthorized (401) Errors ===
const handle401Error = async (error) => {
  if (error.response && error.response.status === 401) {
    Alert.alert("Session Expired", "Please log in again.");
    await logout();
  }
  return Promise.reject(error);
};
 
// === Logout Function ===
const logout = async () => {
  try {
    const token = await AsyncStorage.getItem("token");
    if (!token) return;
 
    apiClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    // await apiClient.post("admin-logout/");
  } catch (err) {
    console.log("Logout error:", err);
  } finally {
    await AsyncStorage.removeItem("authToken");
    await AsyncStorage.removeItem("user");
    delete apiClient.defaults.headers.common["Authorization"];
    // optionally: navigate to login screen
  }
};
 
// === Attach Interceptors ===
const clients = [apiClient, adminApiClient, apiClientNode, apiClientScrapper];
 
clients.forEach(client => {
  client.interceptors.request.use(setAuthHeader);
  client.interceptors.response.use(
    response => response,
    // handle401Error
  );
});
 
// === Export Default Client ===
export default apiClient;
 