import { useSelector, useDispatch } from 'react-redux';
import { useState } from 'react';
import { updateProfile } from '../slices/userSlice';

function UserDashboardPage() {
  const { userInfo } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(userInfo?.name || '');
  const [email, setEmail] = useState(userInfo?.email || '');
  const [password, setPassword] = useState('');
  const [orders] = useState([
    { id: 1, product: 'Smartphone', date: '2025-04-20', status: 'Delivered' },
    { id: 2, product: 'Office Chair', date: '2025-04-18', status: 'Shipped' },
  ]);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    dispatch(updateProfile({ name, email, password }));
    setEditing(false);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">User Dashboard</h1>

      {/* Profile Section */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">Profile</h2>
        {editing ? (
          <form onSubmit={handleProfileUpdate} className="space-y-4">
            <div>
              <label className="block text-sm font-medium">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2 border rounded"
              />
            </div>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Save Changes
            </button>
            <button
              type="button"
              onClick={() => setEditing(false)}
              className="ml-2 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              Cancel
            </button>
          </form>
        ) : (
          <div className="p-4 border rounded">
            <p><strong>Name:</strong> {userInfo.name}</p>
            <p><strong>Email:</strong> {userInfo.email}</p>
            <button
              onClick={() => setEditing(true)}
              className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Edit Profile
            </button>
          </div>
        )}
      </section>

      {/* Order History Section */}
      <section>
        <h2 className="text-2xl font-semibold mb-2">Order History</h2>
        {orders.length > 0 ? (
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr>
                <th className="border border-gray-300 p-2">Order ID</th>
                <th className="border border-gray-300 p-2">Product</th>
                <th className="border border-gray-300 p-2">Date</th>
                <th className="border border-gray-300 p-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td className="border border-gray-300 p-2 text-center">{order.id}</td>
                  <td className="border border-gray-300 p-2 text-center">{order.product}</td>
                  <td className="border border-gray-300 p-2 text-center">{order.date}</td>
                  <td className="border border-gray-300 p-2 text-center">{order.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No orders found.</p>
        )}
      </section>
    </div>
  );
}

export default UserDashboardPage;