import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../slices/productSlice';
import { fetchCategories } from '../slices/categorySlice';
import ProductCard from '../components/home/ProductCard';
import FeaturedCategories from '../components/home/FeaturedCategories';
import SearchAndFilter from '../components/home/SearchAndFilter';

function CategoryPage() {
  const { name, subcategory } = useParams();
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((state) => state.products);
  const { categories } = useSelector((state) => state.categories);
  const [categoryName, setCategoryName] = useState('');
  const [subcategoryName, setSubcategoryName] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);

  // Debugging logs
  useEffect(() => {
    console.log('Route params:', { name, subcategory });
    console.log('Products:', products);
    console.log('Categories:', categories);
  }, [name, subcategory, products, categories]);

  // Fetch categories
  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  // Fetch products when category/subcategory changes
  useEffect(() => {
    if (name) {
      console.log('Fetching products for:', { name, subcategory });
      dispatch(fetchProducts({ 
        category: name,
        subcategory: subcategory
      }));
    }
  }, [name, subcategory, dispatch]);

  // Update names when category/subcategory changes
  useEffect(() => {
    if (categories.length > 0 && name) {
      const cat = categories.find(c => c.name.toLowerCase().replace(/\s+/g, '-') === name);
      console.log('Found category:', cat);
      setCategoryName(cat?.name || '');
      
      if (subcategory && cat) {
        const sub = cat.subcategories?.find(s => 
          s.name.toLowerCase().replace(/\s+/g, '-') === subcategory
        );
        console.log('Found subcategory:', sub);
        setSubcategoryName(sub?.name || '');
      }
    }
  }, [categories, name, subcategory]);

  // Filter products
  useEffect(() => {
    if (!name || !categories.length || !products.length) {
      setFilteredProducts([]);
      return;
    }

    const category = categories.find(c => 
      c.name.toLowerCase().replace(/\s+/g, '-') === name
    );
    
    if (!category) {
      setFilteredProducts([]);
      return;
    }

    let filtered = products.filter(p => 
      p.category?._id === category._id
    );

    if (subcategory && category.subcategories) {
      const subcategoryName = category.subcategories.find(s => 
        s.name.toLowerCase().replace(/\s+/g, '-') === subcategory
      )?.name;

      if (subcategoryName) {
        filtered = filtered.filter(p => p.subcategory === subcategoryName);
      }
    }

    console.log('Filtered products:', filtered);
    setFilteredProducts(filtered);
  }, [products, categories, name, subcategory]);

  const handleSearch = ({ searchTerm, priceRange, location }) => {
    if (!products.length) {
      setFilteredProducts([]);
      return;
    }

    let temp = [...filteredProducts];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      temp = temp.filter(p =>
        p.name?.toLowerCase().includes(term) ||
        p.description?.toLowerCase().includes(term)
      );
    }

    if (priceRange.min) {
      temp = temp.filter(p => p.price >= Number(priceRange.min));
    }

    if (priceRange.max) {
      temp = temp.filter(p => p.price <= Number(priceRange.max));
    }

    if (location) {
      const loc = location.toLowerCase();
      temp = temp.filter(p =>
        p.location?.city?.toLowerCase().includes(loc) ||
        p.location?.state?.toLowerCase().includes(loc) ||
        p.location?.address?.toLowerCase().includes(loc)
      );
    }

    setFilteredProducts(temp);
  };

  if (!name) {
    return <FeaturedCategories />;
  }

  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <div className="flex justify-center items-center min-h-[200px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4 text-center">
        <p className="text-xl text-red-500">Error: {error}</p>
        <button
          onClick={() => dispatch(fetchProducts({ category: name, subcategory }))}
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 bg-red-50 rounded-lg p-6 text-center">
        <h1 className="text-3xl font-bold">{categoryName}</h1>
        <p className="mt-2 text-gray-600">
          {subcategoryName 
            ? `Browse ${subcategoryName} in ${categoryName}`
            : `Browse our ${categoryName} listings`
          }
        </p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <aside className="lg:col-span-1">
          <SearchAndFilter onSearch={handleSearch} />
        </aside>
        <section className="lg:col-span-3">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-xl text-gray-600">No products found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default CategoryPage;
