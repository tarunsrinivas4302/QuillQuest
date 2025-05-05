import axios from "axios";
import { API_ENDPOINTS } from "@/config/end-points";
import { getAccessToken, getType } from "@/utils/token-handler";
import { API_NOTIFICATION_MESSAGES } from "@/config/api-notifications";
import toast from "react-hot-toast";
import { getNotificationMessage } from "@/config/api-notifications";
let isRefreshing = false;
let failedQueue = [];

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
  withCredentials: true, // Important to send cookies!
  headers: {
    Accept: "application/json",
  },
});

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

axiosInstance.interceptors.request.use(
  function (config) {
    if (config.TYPE?.params) {
      config.params = {
        ...config.params,
        ...config.TYPE.params,
      };
    } else if (config.TYPE?.query) {
      config.url = config.url + "/" + config.TYPE.query;
    }

    // * Optionally attach access token from storage
    const accessToken = getAccessToken();
    if (accessToken) {
      config.headers["Authorization"] = `Bearer ${accessToken}`;
    }

    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => processResponse(response),
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers["Authorization"] = "Bearer " + token;
            return axiosInstance(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/auth/refresh`,
          {
            withCredentials: true,
          }
        );

        const newAccessToken = response.data.accessToken;
        localStorage.setItem("accessToken", newAccessToken);

        axiosInstance.defaults.headers.common["Authorization"] =
          "Bearer " + newAccessToken;
        originalRequest.headers["Authorization"] = "Bearer " + newAccessToken;

        processQueue(null, newAccessToken);

        return axiosInstance(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        localStorage.removeItem("accessToken"); // Optionally clear token
        window.location.href = "/login"; // Redirect to login
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }
    return Promise.reject(processError(error?.response || {}));
  }
);
const processResponse = (response) => {
  const { status, code, message, data } = response || {};
  const isSuccess = status >= 200 && status < 300;

  if (isSuccess) {
    return { isSuccess: true, data };
  }
  const notification = getNotificationMessage(status || code);
  toast.error(notification.message);

  return {
    isSuccess: false,
    status,
    code,
    message: message || notification.message,
  };
};

const processError = (error = {}) => {
  const { status, code, message } = error;

  const notification = getNotificationMessage(status || code);
  toast.error(message || notification.message);

  return {
    isError: true,
    status,
    code,
    message: message || notification.message,
  };
};

const API = {};

for (const [key, value] of Object.entries(API_ENDPOINTS)) {
  API[key] = (body, showUploadProgress, showDownloadProgress) => {
    return axiosInstance({
      method: value.method,
      url: value.url,
      data: value.method === "DELETE" ? "" : body,
      responseType: value.responseType,
      TYPE: getType(value, body),
      onUploadProgress: function (progressEvent) {
        if (showUploadProgress) {
          let percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          showUploadProgress(percentCompleted);
        }
      },
      onDownloadProgress: function (progressEvent) {
        if (showDownloadProgress) {
          let percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          showDownloadProgress(percentCompleted);
        }
      },
    });
  };
}

export default API;
