import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductById } from '../slices/productSlice';
import { addToCart } from '../slices/cartSlice';
import { toast } from 'react-toastify';
import formatCurrency from '../utils/formatCurrency';

const ProductDetailsPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { currentProduct, loading, error } = useSelector(state => state.products);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    if (id) {
      dispatch(fetchProductById(id));
    }
  }, [dispatch, id]);

  const handleAddToCart = () => {
    if (currentProduct) {
      dispatch(addToCart({
        id: currentProduct._id,
        name: currentProduct.name,
        price: currentProduct.price,
        image: currentProduct.images[0],
        quantity: 1
      }));
      toast.success('Added to cart!');
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center min-h-screen text-red-500">{error}</div>;
  }

  if (!currentProduct) {
    return <div className="flex justify-center items-center min-h-screen">Product not found</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <div className="rounded-lg overflow-hidden mb-4">
            <img 
              src={currentProduct.images[selectedImage]} 
              alt={currentProduct.name}
              className="w-full h-96 object-cover"
            />
          </div>
          {currentProduct.images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {currentProduct.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`rounded-lg overflow-hidden border-2 ${
                    selectedImage === index ? 'border-blue-500' : 'border-transparent'
                  }`}
                >
                  <img 
                    src={image} 
                    alt={`${currentProduct.name} ${index + 1}`}
                    className="w-full h-24 object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="space-y-4">
          <h1 className="text-3xl font-bold">{currentProduct.name}</h1>
          <p className="text-2xl font-semibold text-blue-600">
            {formatCurrency(currentProduct.price)}
          </p>
          <p className="text-gray-600">{currentProduct.description}</p>
          <div className="space-y-1">
            <p><span className="font-semibold">Address:</span> {currentProduct.location?.address}</p>
            <p><span className="font-semibold">City:</span> {currentProduct.location?.city}</p>
            <p><span className="font-semibold">State:</span> {currentProduct.location?.state}</p>
            <p><span className="font-semibold">Zip Code:</span> {currentProduct.location?.zipCode}</p>          </div>
          <div className="space-y-2">
            <p><span className="font-semibold">Category:</span> {currentProduct.category.name}</p>
            <p><span className="font-semibold">Condition:</span> {currentProduct.condition === 'pre-owned' ? 'Pre-owned' : 'New'}</p>
          </div>
          <button
            onClick={handleAddToCart}
            className="w-full py-3 px-6 rounded-lg bg-blue-600 hover:bg-blue-700 text-white"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsPage;