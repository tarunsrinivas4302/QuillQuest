let memoryToken = null;

const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
};

export const setAccessToken = (token) => {
  memoryToken = token;
  localStorage.setItem("accessToken", token); // or secure cookie
};

export const getAccessToken = () => {
  if (memoryToken) return memoryToken;
  const stored =
    getCookie("accessToken") ?? localStorage.getItem("accessToken");
  memoryToken = stored;
  return stored;
};

export const clearAccessToken = () => {
  memoryToken = null;
  localStorage.removeItem("accessToken");
  document.cookie =
    "accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
};

export const getType = (value, body) => {
  if (value.params) {
      return { params: body }
  } else if (value.query) {
      if (typeof body === 'object') {
          return { query: body._id }
      } else {
          return { query: body }
      }
  }
  return {};
}