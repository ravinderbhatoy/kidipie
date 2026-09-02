import axios from "axios";
import type { AxiosInstance } from "axios";
import type { SignUpFormData } from "../pages/SignUpPage";

const api: AxiosInstance = axios.create({
  baseURL: "http://localhost:8000/api/v1/",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${localStorage.getItem("access_token")}`,
  },
});

api.interceptors.request.use((config) => {
  const storedTokens = localStorage.getItem("tokens");
  if (storedTokens) {
    const tokens = JSON.parse(storedTokens);
    config.headers.Authorization = `Bearer ${tokens.access_token}`;
  }
  return config;
})

type Tokens = {
  access_token: string;
  refresh_token: string;
  user_id: string;
};

export interface UserCredentials {
  email: string;
  password: string;
}


export interface PostData {
  content: string;
  image_url?: string;
}

// this is not safe but for now storing credentials in local storage
export const loginUser = async (credentials: UserCredentials) => {
  try {
    const response = await api.post<Tokens>("auth/login", credentials);
    localStorage.setItem("tokens", JSON.stringify(response.data));
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const signUpUser = async (credentials: SignUpFormData) => {
  try {
    const response = await api.post("auth/signup", credentials);
    localStorage.setItem("tokens", JSON.stringify(response.data));
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createPost = async (postData: PostData) => {
  console.log(localStorage.getItem('access_token'))
  const response = await api.post("posts/create", postData);
  return response.data;
}

export const fetchPosts = async () => {
  try {
    const response = await api.get("posts/list")
    return response.data
  } catch (error) {
    throw error
  }
}

export const logoutUser = () => {
  localStorage.removeItem("tokens");
};

// await createPost({
//   content: "Post of frontend",
//   image_url: "https://example.com/image.jpg"
// })

// const tokens: Tokens = await loginUser({
//     email: "bindubhatoy@gmail.com",
//     password: "bhatoy"
// })

// console.log(tokens)
