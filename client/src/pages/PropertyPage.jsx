import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import SearchAndFilter from '../components/home/SearchAndFilter';
import { fetchProperties } from '../slices/propertySlice';
import formatCurrency from '../utils/formatCurrency';

function PropertyPage() {
  const dispatch = useDispatch();
  const { properties, loading, error } = useSelector((state) => state.properties);
  const [filteredProps, setFilteredProps] = useState([]);

  useEffect(() => {
    dispatch(fetchProperties());
  }, [dispatch]);

  useEffect(() => {
    setFilteredProps(properties);
  }, [properties]);

  const handleSearch = ({ searchTerm, category, priceRange, location }) => {
    let temp = properties;
    if (searchTerm) temp = temp.filter(p => p.title.toLowerCase().includes(searchTerm.toLowerCase()));
    if (priceRange.min) temp = temp.filter(p => p.price >= +priceRange.min);
    if (priceRange.max) temp = temp.filter(p => p.price <= +priceRange.max);
    if (category) temp = temp.filter(p => p.category?._id === category);
    if (location) {
      const loc = location.toLowerCase();
      temp = temp.filter(p =>
        p.location?.city.toLowerCase().includes(loc) ||
        p.location?.address.toLowerCase().includes(loc)
      );
    }
    setFilteredProps(temp);
  };

  if (loading) return <div className="flex justify-center py-20"><div className="animate-spin h-12 w-12 border-b-2 border-red-500 rounded-full"></div></div>;
  if (error) return <p className="text-center text-red-500 p-4">Error: {error}</p>;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Banner */}
      <div className="mb-8 bg-red-50 rounded-lg p-6 text-center">
        <h1 className="text-3xl font-bold">All Properties</h1>
        <p className="mt-2 text-gray-600">Explore our property listings</p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar filters */}
        <aside>
          <SearchAndFilter onSearch={handleSearch} />
        </aside>
        {/* Property cards grid */}
        <section className="lg:col-span-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProps.map((property) => (
              <Link 
                key={property._id} 
                to={`/properties/${property._id}`} 
                className="relative block rounded-2xl overflow-hidden group shadow hover:shadow-lg transition-shadow duration-300 h-80"
              >
                {/* Image */}
                <img 
                  src={property.images?.[0]} 
                  alt={property.title}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                {/* Price badge */}
                <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                  {formatCurrency(property.price)}
                </div>
                {/* Title & location */}
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="text-lg font-semibold line-clamp-1">{property.title}</h3>
                  <p className="text-sm line-clamp-1">{property.location?.city}, {property.location?.state}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

export default PropertyPage;
