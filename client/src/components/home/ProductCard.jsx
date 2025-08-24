import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../../slices/cartSlice';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { FaShoppingCart } from 'react-icons/fa';
import formatCurrency from '../../utils/formatCurrency';

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const [isAdding, setIsAdding] = useState(false);
  const cartItems = useSelector(state => state.cart.cartItems);

  const handleAddToCart = (e) => {
    e.preventDefault(); // Prevent navigation
    setIsAdding(true);
    dispatch(addToCart({
      id: product._id,
      name: product.name,
      price: product.price,
      image: product.images && product.images.length > 0 ? product.images[0] : '/images/no-image-placeholder.png',
      quantity: 1
    }));
    toast.success('Added to cart!');
    setTimeout(() => setIsAdding(false), 500);
  };

  const isInCart = cartItems.some(item => item.id === product._id);

  return (
    <div className="group relative bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300">
      <Link to={`/product/${product.slug || product._id}`} className="block">        <div className="relative aspect-square overflow-hidden rounded-t-xl">          <img
            src={product.images && product.images.length > 0 ? product.images[0] : '/images/no-image-placeholder.png'}
            onError={(e) => {
              e.currentTarget.src = '/images/no-image-placeholder.png';
              e.currentTarget.alt = 'Image not available';
            }}
            alt={product.name}
            className="h-full w-full object-cover object-center transform group-hover:scale-110 transition-transform duration-500"
          />
          {product.condition && (
            <span className={`absolute top-2 left-2 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm ${
              product.condition === 'pre-owned' 
                ? 'bg-amber-600/90' 
                : 'bg-emerald-600/90'
            }`}>
              {product.condition === 'pre-owned' ? 'Pre-owned' : 'New'}
            </span>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>

        <div className="p-4">
          <div className="mb-2">
            <p className="text-sm text-red-500 font-medium mb-1">
              {product.category.name}
            </p>
            <h3 className="text-gray-900 font-medium text-base line-clamp-1 group-hover:text-red-600 transition-colors">
              {product.name}
            </h3>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-900 font-semibold">
                {formatCurrency(product.price)}
              </p>
              <p className="text-sm text-gray-600">
                {product.stock > 1
                  ? `${product.stock} in stock`
                  : product.stock === 1
                  ? '1 in stock'
                  : 'Out of stock'}
              </p>
            </div>
            <button
              onClick={handleAddToCart}
              disabled={isAdding || isInCart || product.stock < 1}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 transform active:scale-95 ${
                isInCart 
                  ? 'bg-green-100 text-green-700 cursor-not-allowed'
                  : isAdding
                    ? 'bg-red-100 text-red-700 cursor-wait'
                    : product.stock < 1
                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    : 'bg-red-500 text-white hover:bg-red-600'
              }`}
            >
              <FaShoppingCart className={isInCart ? 'text-green-600' : ''} />
              <span>
                {product.stock < 1
                  ? 'Out of stock'
                  : isInCart
                  ? 'In Cart'
                  : isAdding
                  ? 'Adding...'
                  : 'Add'}
              </span>
            </button>
          </div>
        </div>
      </Link>
    </div>
  );
};

ProductCard.propTypes = {
  product: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    slug: PropTypes.string,
    name: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    images: PropTypes.arrayOf(PropTypes.string).isRequired,
    category: PropTypes.shape({
      _id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired
    }).isRequired,
    condition: PropTypes.string,
    stock: PropTypes.number.isRequired,
  }).isRequired,
};

export default ProductCard;