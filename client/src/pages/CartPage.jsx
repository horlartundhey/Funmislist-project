import { useSelector, useDispatch } from 'react-redux';
import { removeFromCart, updateCartItem } from '../slices/cartSlice';
import { useNavigate } from 'react-router-dom';

function CartPage() {
  const dispatch = useDispatch();
  const { cartItems } = useSelector((state) => state.cart);
  const navigate = useNavigate();

  const handleRemove = (id) => {
    dispatch(removeFromCart(id));
  };

  const handleQuantityChange = (id, quantity) => {
    if (quantity > 0) {
      dispatch(updateCartItem({ id, quantity }));
    }
  };

  const totalPrice = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Your Cart</h1>
      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {cartItems.map((item) => (
              <div key={item.id} className="p-4 border rounded">
                <img src={item.image} alt={item.name} className="w-full h-48 object-cover mb-2" />
                <h2 className="text-xl font-bold">{item.name}</h2>
                <p className="text-gray-700">${item.price}</p>
                <div className="flex items-center mt-2">
                  <button
                    onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                    className="px-2 py-1 bg-gray-300 rounded hover:bg-gray-400"
                  >
                    -
                  </button>
                  <span className="px-4">{item.quantity}</span>
                  <button
                    onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                    className="px-2 py-1 bg-gray-300 rounded hover:bg-gray-400"
                  >
                    +
                  </button>
                </div>
                <button
                  onClick={() => handleRemove(item.id)}
                  className="mt-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
          <div className="mt-4 text-right">
            <h2 className="text-2xl font-bold">Total: ${totalPrice.toFixed(2)}</h2>
            <button
              className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              onClick={() => navigate('/checkout')}
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default CartPage;