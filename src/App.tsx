import React from 'react';
import { UserList } from './components/UserList';
import { UserForm } from './components/UserForm';
import { User } from './types/user';
import { api } from './services/api';
import { Plus } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';

function App() {
  const [users, setUsers] = React.useState<User[]>([]);
  const [selectedUser, setSelectedUser] = React.useState<User | null>(null);
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const data = await api.getUsers();
      setUsers(data);
    } catch (error) {
      toast.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (userData: Omit<User, 'id'>) => {
    try {
      const newUser = await api.createUser(userData);
      setUsers(prev => [...prev, newUser]);
      setIsFormOpen(false);
      toast.success('User created successfully');
    } catch (error) {
      toast.error('Failed to create user');
    }
  };

  const handleUpdateUser = async (userData: Omit<User, 'id'>) => {
    if (!selectedUser) return;
    try {
      const updatedUser = await api.updateUser({ ...userData, id: selectedUser.id });
      setUsers(prev => prev.map(user => 
        user.id === selectedUser.id ? updatedUser : user
      ));
      setSelectedUser(null);
      setIsFormOpen(false);
      toast.success('User updated successfully');
    } catch (error) {
      toast.error('Failed to update user');
    }
  };

  const handleDeleteUser = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await api.deleteUser(id);
      setUsers(prev => prev.filter(user => user.id !== id));
      toast.success('User deleted successfully');
    } catch (error) {
      toast.error('Failed to delete user');
    }
  };

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setSelectedUser(null);
    setIsFormOpen(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow">
          <div className="px-4 py-5 sm:p-6">
            <div className="sm:flex sm:items-center sm:justify-between mb-6">
              <h1 className="text-2xl font-semibold text-gray-900">User Management</h1>
              <button
                onClick={() => setIsFormOpen(true)}
                className="mt-3 sm:mt-0 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Plus className="mr-2" size={16} />
                Add User
              </button>
            </div>
            <UserList
              users={users}
              onEdit={handleEdit}
              onDelete={handleDeleteUser}
            />
          </div>
        </div>
      </div>

      {isFormOpen && (
        <UserForm
          user={selectedUser || undefined}
          onSubmit={selectedUser ? handleUpdateUser : handleCreateUser}
          onClose={handleCloseForm}
        />
      )}
      
      <Toaster position="top-right" />
    </div>
  );
}

export default App;