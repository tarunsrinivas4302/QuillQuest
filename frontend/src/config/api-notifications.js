export const API_NOTIFICATION_MESSAGES = {
  loading: {
    title: "Loading...",
    message: "Data is Being Loaded  , Please Wait...",
  },
  success: {
    title: "Success",
    message: "Data Loaded Successfully",
  },
  error: {
    title: "Error",
    message: "Something Went Wrong!",
  },
  requestFailure: {
    title: "Request Failed",
    message: "Request Failed! Please Try Again",
  },
  notFound: {
    title: "Not Found",
    message: "Requested Resource Not Found",
  },
  unauthorized: {
    title: "Unauthorized",
    message: "You are not authorized to access this resource",
  },
  forbidden: {
    title: "Forbidden",
    message: "You do not have permission to access this resource",
  },
  serverError: {
    title: "Server Error",
    message: "Internal Server Error",
  },
  validationError: {
    title: "Validation Error",
    message: "Validation Error! Please Check Your Input",
  },
  networkError: {
    title: "Network Error",
    message: "Network Error! Please Check Your Connection",
  }
};




// Helper to get predefined notification message
export const getNotificationMessage = (codeOrStatus) => {
  switch (codeOrStatus) {
    case 400:
      return API_NOTIFICATION_MESSAGES.validationError;
    case 401:
      return API_NOTIFICATION_MESSAGES.unauthorized;
    case 403:
      return API_NOTIFICATION_MESSAGES.forbidden;
    case 404:
      return API_NOTIFICATION_MESSAGES.notFound;
    case 500:
      return API_NOTIFICATION_MESSAGES.serverError;
    case "NETWORK_ERROR":
      return API_NOTIFICATION_MESSAGES.networkError;
    default:
      return API_NOTIFICATION_MESSAGES.error;
  }
};
