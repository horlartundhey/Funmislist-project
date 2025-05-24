import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchProperties } from '../slices/propertySlice';
import { fetchCategories } from '../slices/categorySlice';
import formatCurrency from '../utils/formatCurrency';
import PropertySearchAndFilter from '../components/home/PropertySearchAndFilter';

function PropertyPage() {
  const dispatch = useDispatch();
  const { properties, loading, error } = useSelector((state) => state.properties);
  const [filteredProps, setFilteredProps] = useState([]);
  const { categories } = useSelector((state) => state.categories);

  useEffect(() => {
    dispatch(fetchProperties());
    dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => {
    // When properties load, filter to only show real estate category initially
    if (properties.length && categories.length) {
      const realEstateCat = categories.find(cat => cat.name.toLowerCase() === 'real estate');
      if (realEstateCat) {
        const realEstateProps = properties.filter(p => p.category?._id === realEstateCat._id);
        setFilteredProps(realEstateProps);
      } else {
        setFilteredProps(properties);
      }
    }
  }, [properties, categories]);

  const handleSearch = ({ searchTerm, category, subcategory, priceRange, location }) => {
    let temp = properties;
    
    // Filter by category (Real Estate)
    if (category) {
      temp = temp.filter(p => p.category?._id === category);
    }

    // Filter by subcategory (property type)
    if (subcategory) {
      temp = temp.filter(p => p.subcategory === subcategory);
    }

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      temp = temp.filter(p => 
        p.title.toLowerCase().includes(term) ||
        p.description.toLowerCase().includes(term)
      );
    }

    // Filter by price range
    if (priceRange.min) temp = temp.filter(p => p.price >= +priceRange.min);
    if (priceRange.max) temp = temp.filter(p => p.price <= +priceRange.max);

    // Filter by location
    if (location) {
      const loc = location.toLowerCase();
      temp = temp.filter(p =>
        p.location?.city?.toLowerCase().includes(loc) ||
        p.location?.state?.toLowerCase().includes(loc) ||
        p.location?.address?.toLowerCase().includes(loc)
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
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">        {/* Sidebar filters */}
        <aside>
          <PropertySearchAndFilter onSearch={handleSearch} />
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
