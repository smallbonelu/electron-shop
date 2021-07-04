import axios from "axios";
import store from "../store";

const fetchClient = () => {
  const defaultOptions = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  let instance = axios.create(defaultOptions);
  instance.interceptors.request.use(
    (config) => {
      const token = store.getState().userLogin?.userInfo?.token || "";
      config.headers.Authorization = `Bearer ${token}`;
      return config;
    },
    (error) => {
      Promise.reject(error);
    }
  );

  return instance;
};

export default fetchClient();
