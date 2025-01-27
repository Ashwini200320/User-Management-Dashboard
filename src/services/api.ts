import axios from 'axios';
import { User } from '../types/user';

const API_BASE_URL = 'https://jsonplaceholder.typicode.com';

export const api = {
  async getUsers(): Promise<User[]> {
    const response = await axios.get(`${API_BASE_URL}/users`);
    return response.data.map((user: any) => ({
      id: user.id,
      firstName: user.name.split(' ')[0],
      lastName: user.name.split(' ')[1] || '',
      email: user.email,
      department: user.company.name
    }));
  },

  async createUser(user: Omit<User, 'id'>): Promise<User> {
    const response = await axios.post(`${API_BASE_URL}/users`, user);
    return response.data;
  },

  async updateUser(user: User): Promise<User> {
    const response = await axios.put(`${API_BASE_URL}/users/${user.id}`, user);
    return response.data;
  },

  async deleteUser(id: number): Promise<void> {
    await axios.delete(`${API_BASE_URL}/users/${id}`);
  }
};