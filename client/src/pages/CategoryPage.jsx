import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../slices/productSlice';
import { fetchCategories } from '../slices/categorySlice';
import ProductCard from '../components/home/ProductCard';
import FeaturedCategories from '../components/home/FeaturedCategories';
import SearchAndFilter from '../components/home/SearchAndFilter';

function CategoryPage() {
  const { name, subcategory } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((state) => state.products);
  const { filteredCategories: categories } = useSelector((state) => state.categories);
  const [categoryName, setCategoryName] = useState('');
  const [subcategoryName, setSubcategoryName] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);
  
  // Enhanced debugging
  console.log('🔍 CategoryPage - Route params:', { 
    categorySlug: name, 
    subcategorySlug: subcategory 
  });
  
  // Don't log full products/categories arrays to avoid console clutter
  console.log('📊 CategoryPage - Stats:', { 
    productsCount: products?.length || 0,
    categoriesCount: categories?.length || 0
  });

  // Fetch categories
  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  // fetch products for specific category and subcategory
  useEffect(() => {
    if (name) {
      // Find the actual category object to get its ID
      const categoryObj = categories.find(c => c.name.toLowerCase().replace(/\s+/g, '-') === name);
      
      if (categoryObj) {
        let subcategoryName = null;
        
        // If subcategory is specified in URL, find its proper name
        if (subcategory && categoryObj.subcategories) {
          const subObj = categoryObj.subcategories.find(s => 
            s.name.toLowerCase().replace(/\s+/g, '-') === subcategory
          );
          
          if (subObj) {
            subcategoryName = subObj.name;
            console.log('Found subcategory in object:', subcategoryName);
          }
        }
        
        console.log('Fetching products for:', { 
          category: categoryObj._id, 
          subcategory: subcategoryName || subcategory 
        });
        
        dispatch(fetchProducts({ 
          category: categoryObj._id,  // Use the actual ID instead of slug
          subcategory: subcategoryName || subcategory
        }));
      } else {
        // Still try with the slug if category object isn't found yet
        console.log('Category object not found yet, fetching with slug:', name);
        dispatch(fetchProducts({ category: name, subcategory }));
      }
    }
  }, [name, subcategory, categories, dispatch]);

  // set category and subcategory names
  useEffect(() => {
    if (categories.length > 0 && name) {
      const cat = categories.find(c => c.name.toLowerCase().replace(/\s+/g, '-') === name);
      console.log('📁 Found category:', cat?.name || 'none');
      setCategoryName(cat?.name || '');
      
      if (subcategory && cat) {
        const sub = cat.subcategories?.find(s => s.name.toLowerCase().replace(/\s+/g, '-') === subcategory);
        console.log('📂 Found subcategory:', sub?.name || 'none');
        setSubcategoryName(sub?.name || '');
      }
    }
  }, [categories, name, subcategory]);

  // filter loaded products by category and subcategory
  useEffect(() => {
    if (!name) {
      setFilteredProducts([]);
      return;
    }

    // First get the category document from categories array
    const category = categories.find(c => c.name.toLowerCase().replace(/\s+/g, '-') === name);
    if (!category) {
      console.log("No matching category found for:", name);
      setFilteredProducts([]);
      return;
    }

    console.log("Found category:", category.name);
    // Filter by category ID
    let filtered = products.filter(p => p.category?._id === category._id);
    console.log(`Found ${filtered.length} products matching category ID:`, category._id);

    // If subcategory is specified, filter by that as well
    if (subcategory) {
      const subcategoryObj = category.subcategories?.find(s => 
        s.name.toLowerCase().replace(/\s+/g, '-') === subcategory
      );
      
      if (subcategoryObj) {
        const subcategoryName = subcategoryObj.name;
        console.log("Found subcategory:", subcategoryName);
        
        // Case-insensitive comparison for subcategory
        filtered = filtered.filter(p => {
          const matches = p.subcategory && 
                          p.subcategory.toLowerCase() === subcategoryName.toLowerCase();
          if (matches) {
            console.log("Product matches subcategory:", p.name, p.subcategory);
          }
          return matches;
        });
        
        console.log(`After subcategory filter, ${filtered.length} products remaining`);
      } else {
        console.log("No matching subcategory found for:", subcategory);
      }
    }

    setFilteredProducts(filtered);
  }, [products, categories, name, subcategory]);  // handle search & price filters
  const handleSearch = ({ searchTerm, category: filterCategory, subcategory: filterSubcategory, priceRange, location, condition }) => {
    if (!products.length) {
      setFilteredProducts([]);
      return;
    }
    console.log('Search with condition:', condition);

    // If a different category is selected, navigate to that category page
    if (filterCategory && categories.length) {
      const selectedCategory = categories.find(c => c._id === filterCategory);
      if (selectedCategory && selectedCategory.name.toLowerCase().replace(/\s+/g, '-') !== name) {
        // We have a new category selected, redirect to that category page
        const categorySlug = selectedCategory.name.toLowerCase().replace(/\s+/g, '-');
        navigate(`/category/${categorySlug}`);
        return; // Exit early since we're changing pages
      }
    }

    // Determine category to filter: either selected in filters or from URL
    const categoryToUse = filterCategory || name;
    const currentCategory = categories.find(c =>
      (filterCategory && c._id === filterCategory) ||
      (!filterCategory && c.name.toLowerCase().replace(/\s+/g, '-') === categoryToUse)
    );

    if (!currentCategory) {
      setFilteredProducts([]);
      return;
    }
    
    console.log('Search with subcategory:', filterSubcategory);
    
    // Filter by the determined category
    let temp = products.filter(p => p.category?._id === currentCategory._id);

    // Apply subcategory filter: preference to selected filter over URL
    const activeSubcategory = filterSubcategory || subcategory;
    if (activeSubcategory) {
      // Check if it's a direct subcategory name match or needs to be converted from a slug
      const subcatSlug = activeSubcategory.toLowerCase().replace(/\s+/g, '-');
      const matchingSubcat = currentCategory.subcategories?.find(s => 
        s.name.toLowerCase() === activeSubcategory.toLowerCase() || 
        s.name.toLowerCase().replace(/\s+/g, '-') === subcatSlug
      );

      if (matchingSubcat) {
        temp = temp.filter(p => p.subcategory === matchingSubcat.name);
      } else {
        // Direct filter by the provided subcategory value
        temp = temp.filter(p => p.subcategory && p.subcategory === activeSubcategory);
      }
    }

    // Apply search term filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      temp = temp.filter(p =>
        p.name?.toLowerCase().includes(term) ||
        p.description?.toLowerCase().includes(term)
      );
    }

    // Apply price range filters
    if (priceRange.min) temp = temp.filter(p => p.price >= Number(priceRange.min));
    if (priceRange.max) temp = temp.filter(p => p.price <= Number(priceRange.max));

    // Apply location filter
    if (location) {
      const loc = location.toLowerCase();
      temp = temp.filter(p =>
        p.city?.toLowerCase().includes(loc) ||
        p.state?.toLowerCase().includes(loc) ||
        p.address?.toLowerCase().includes(loc)
      );
    }
    
    // Apply condition filter
    if (condition) {
      console.log(`Filtering by condition: "${condition}"`);
      temp = temp.filter(p => p.condition === condition);
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
          onClick={() => dispatch(fetchProducts({ category: name }))}
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Category banner */}      <div className="mb-8 bg-red-50 rounded-lg p-6 text-center">
        <h1 className="text-3xl font-bold">{categoryName}</h1>
        <p className="mt-2 text-gray-600">
          {subcategoryName 
            ? `Browse ${subcategoryName} in ${categoryName}`
            : `Browse our ${categoryName} listings`
          }
        </p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar filters */}
        <aside className="lg:col-span-1">
          <SearchAndFilter onSearch={handleSearch} />
        </aside>
        {/* Products grid */}
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