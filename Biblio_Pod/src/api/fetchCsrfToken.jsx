import axios from "axios";

const fetchCsrfToken = async () => {
  try {
    const response = await axios.get("http://127.0.0.1:8000/api/csrf-token");
    return response.data.csrf_token;
  } catch (error) {
    console.error("Error fetching CSRF token:", error);
    return null;
  }
};

export default fetchCsrfToken;
