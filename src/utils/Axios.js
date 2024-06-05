import axios from 'axios';

const baseUrl = process.env.EXPO_PUBLIC_TEACHERATTENDANCEAPI;

const ApiService = {
  // Function to make a GET request with authorization header
  get: async (endpoint, token) => {
    try {
      const response = await axios.get(`${endpoint}`, {
        headers: {
          'Authorization': `${token}`,
        },
      });
      return response;
    } catch (error) {
      console.log('Error fetching data:', error.response.status);
      return error.response;
    }
  },

  // Function to make a POST request with authorization header
  post: async (endpoint, data, token) => {
    try {
      const response = await axios.post(endpoint, data, {
        headers: {
          'Authorization': `${token}`,
          'Content-Type': 'application/json'
        },
      });
      return response;
    } catch (error) {
      console.error('Error posting data:', error);
      return error.response;
    }
  },

  // Function to make a DELETE request with authorization header
  delete: async (endpoint, token) => {
    try {
      const response = await axios.delete(`${endpoint}`, {
        headers: {
          Authorization: `${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error deleting data:', error);
      throw error;
    }
  },
};

export default ApiService;