import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchProperties } from '../../slices/propertySlice';
import { FaBed, FaBath, FaRuler } from 'react-icons/fa';
import formatCurrency from '../../utils/formatCurrency';

const FeaturedProperties = () => {
  const dispatch = useDispatch();
  const { properties, loading } = useSelector((state) => state.properties);

  useEffect(() => {
    dispatch(fetchProperties());
  }, [dispatch]);

  return (
    <section className="max-w-7xl mx-auto px-4 py-16">
      <div className="flex items-center justify-between mb-12">
        <h2 className="text-3xl font-bold text-gray-900">Featured Properties</h2>
        <Link to="/properties" className="text-red-500 font-medium hover:underline">View All</Link>
      </div>
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.slice(0, 3).map((property) => (
            <Link
              key={property._id}
              to={`/properties/${property._id}`}
              className="relative block rounded-2xl overflow-hidden group shadow hover:shadow-lg transition-shadow duration-300 h-80"
            >
             <img
            src={property.images && property.images.length > 0 ? property.images[0] : '/images/no-image-placeholder.png'}
            onError={(e) => {
              e.currentTarget.src = '/images/no-image-placeholder.png';
              e.currentTarget.alt = 'Image not available';
            }}
            alt={property.name}
            className="h-full w-full object-cover object-center transform group-hover:scale-110 transition-transform duration-500"
          />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">{formatCurrency(property.price)}</div>
              <div className="absolute bottom-4 left-4 text-white">
                <h3 className="text-lg font-semibold line-clamp-1">{property.title}</h3>
                <p className="text-sm line-clamp-1">
                  {property.location && typeof property.location === 'object'
                    ? `${property.location.address}, ${property.location.city}`
                    : property.location}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
};

export default FeaturedProperties;