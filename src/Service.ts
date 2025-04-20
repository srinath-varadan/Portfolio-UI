import axios from 'axios';

const API_BASE_URL = 'https://mockapi.io/portfolio'; // Replace with your actual backend URL

// Generic GET request
export async function fetchData(endpoint: string) {
  try {
    const response = await axios.get(`${API_BASE_URL}/${endpoint}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching ${endpoint}:`, error);
    return [];
  }
}

// Generic POST (save/create)
export async function saveData(endpoint: string, data: any) {
  try {
    const response = await axios.post(`${API_BASE_URL}/${endpoint}`, data);
    return response.data;
  } catch (error) {
    console.error(`Error saving to ${endpoint}:`, error);
    return null;
  }
}

// Generic DELETE
export async function deleteData(endpoint: string, id: number) {
  try {
    const response = await axios.delete(`${API_BASE_URL}/${endpoint}/${id}`);
    return response.status === 200;
  } catch (error) {
    console.error(`Error deleting from ${endpoint}/${id}:`, error);
    return false;
  }
}