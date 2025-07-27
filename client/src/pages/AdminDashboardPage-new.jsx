import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaChartBar, FaBox, FaTags, FaListUl, FaUser, FaSignOutAlt, FaArrowLeft, FaArrowRight, FaTachometerAlt, FaPlus, FaTable, FaEdit, FaTrash, FaImage } from 'react-icons/fa';
import PropertyForm from '../components/PropertyForm';
import { fetchCategories } from '../slices/categorySlice';
import { fetchProducts } from '../slices/productSlice';
import { fetchProperties } from '../slices/propertySlice';
import universalCurrency from '../utils/universalCurrency';

function AdminDashboardPage() {
  // State management
  const [activeSection, setActiveSection] = useState('analytics');
  const [productSubSection, setProductSubSection] = useState('view');
  const [categorySubSection, setCategorySubSection] = useState('view');
  const [propertySubSection, setPropertySubSection] = useState('view');
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [newCategory, setNewCategory] = useState({ name: '', description: '' });
  const [editingCategory, setEditingCategory] = useState(null);
  const [editingProperty, setEditingProperty] = useState(null);
  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    images: []
  });
  const [editingProduct, setEditingProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // Redux state
  const { userInfo } = useSelector((state) => state.user);
  const { categories } = useSelector((state) => state.categories);
  const { products } = useSelector((state) => state.products);
  const { properties } = useSelector((state) => state.properties);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Initial data loading
  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(fetchProducts());
    dispatch(fetchProperties());
  }, [dispatch]);
  
  // Update product form when editing
  useEffect(() => {
    if (editingProduct) {
      setProductForm({
        name: editingProduct.name || '',
        description: editingProduct.description || '',
        price: editingProduct.price || '',
        category: editingProduct.category?._id || '',
        images: [] // Cannot prefill images
      });
    }
  }, [editingProduct]);
  
  // Logout function
  const handleLogout = () => {
    dispatch({ type: 'user/logout' });
    navigate('/login');
    toast.success('Logged out successfully');
  };
  
  // Analytics helper functions
  const currencyCode = 'USD'; // Change to desired default or make dynamic
  const calculateTotalRevenue = () => {
    // Simulate revenue based on products
    if (!products || products.length === 0) return universalCurrency(0, currencyCode);
    const soldProducts = products.slice(0, Math.ceil(products.length * 0.3));
    const total = soldProducts.reduce((total, product) => total + (parseFloat(product.price) || 0), 0);
    return universalCurrency(total, currencyCode);
  };
  
  const calculateTotalTransactions = () => {
    if (!products || products.length === 0) return 0;
    return Math.ceil(products.length * 0.4); // 40% of products have transactions
  };
  
  const getPaymentStats = () => {
    const totalTransactions = calculateTotalTransactions();
    if (totalTransactions === 0) {
      return {
        completed: 0, pending: 0, failed: 0,
        completedRate: 0, pendingRate: 0, failureRate: 0
      };
    }
    
    const completed = Math.ceil(totalTransactions * 0.7);
    const pending = Math.ceil(totalTransactions * 0.2);
    const failed = totalTransactions - completed - pending;
    
    return {
      completed, pending, failed,
      completedRate: Math.round((completed / totalTransactions) * 100),
      pendingRate: Math.round((pending / totalTransactions) * 100),
      failureRate: Math.round((failed / totalTransactions) * 100)
    };
  };
  
  // =====================
  // Category Functions
  // =====================
  const handleCategoryChange = (e) => {
    const { name, value } = e.target;
    if (editingCategory) {
      setEditingCategory({ ...editingCategory, [name]: value });
    } else {
      setNewCategory({ ...newCategory, [name]: value });
    }
  };
  
  const handleAddCategory = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await fetch('https://funmislist-project.vercel.app/api/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userInfo.token}`
        },
        body: JSON.stringify(newCategory)
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to add category');
      }
      
      toast.success('Category added successfully');
      setNewCategory({ name: '', description: '' });
      dispatch(fetchCategories());
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleEditCategory = (category) => {
    setEditingCategory(category);
    setCategorySubSection('edit');
  };
  
  const handleUpdateCategory = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await fetch(`https://funmislist-project.vercel.app/api/categories/${editingCategory._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userInfo.token}`
        },
        body: JSON.stringify(editingCategory)
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update category');
      }
      
      toast.success('Category updated successfully');
      setEditingCategory(null);
      setCategorySubSection('view');
      dispatch(fetchCategories());
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleDeleteCategory = async (id) => {
    if (!window.confirm('Are you sure you want to delete this category?')) {
      return;
    }
    
    try {
      const response = await fetch(`https://funmislist-project.vercel.app/api/categories/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${userInfo.token}`
        }
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to delete category');
      }
      
      toast.success('Category deleted successfully');
      dispatch(fetchCategories());
    } catch (error) {
      toast.error(error.message);
    }
  };
  
  // =====================
  // Product Functions
  // =====================
  const handleProductChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'images') {
      setProductForm((prev) => ({ ...prev, images: files }));
    } else {
      setProductForm((prev) => ({ ...prev, [name]: value }));
    }
  };
  
  const handleProductSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const formData = new FormData();
      formData.append('name', productForm.name);
      formData.append('description', productForm.description);
      formData.append('price', productForm.price);
      formData.append('category', productForm.category);
      
      if (productForm.images) {
        for (let i = 0; i < productForm.images.length; i++) {
          formData.append('images', productForm.images[i]);
        }
      }
      
      let url = 'https://funmislist-project.vercel.app/api/products';
      let method = 'POST';
      
      if (editingProduct) {
        url += `/${editingProduct._id}`;
        method = 'PUT';
      }
      
      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${userInfo.token}`
        },
        body: formData
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to save product');
      }
      
      toast.success(editingProduct ? 'Product updated successfully' : 'Product added successfully');
      setProductForm({
        name: '',
        description: '',
        price: '',
        category: '',
        images: []
      });
      setEditingProduct(null);
      setProductSubSection('view');
      dispatch(fetchProducts());
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setProductSubSection('edit');
  };
  
  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) {
      return;
    }
    
    try {
      const response = await fetch(`https://funmislist-project.vercel.app/api/products/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${userInfo.token}`
        }
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to delete product');
      }
      
      toast.success('Product deleted successfully');
      dispatch(fetchProducts());
    } catch (error) {
      toast.error(error.message);
    }
  };
  
  // =====================
  // Property Functions
  // =====================
  const handlePropertySubmit = async (propertyData) => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      
      // Append basic property data
      formData.append('title', propertyData.title);
      formData.append('description', propertyData.description);
      formData.append('price', propertyData.price);
      formData.append('category', propertyData.category);
      
      // Append location data
      formData.append('location[address]', propertyData.location.address);
      formData.append('location[city]', propertyData.location.city);
      formData.append('location[state]', propertyData.location.state);
      formData.append('location[zipCode]', propertyData.location.zipCode);
      
      // Append time slots
      propertyData.availableTimeSlots.forEach((slot, index) => {
        formData.append(`availableTimeSlots[${index}][date]`, slot.date);
        formData.append(`availableTimeSlots[${index}][isBooked]`, slot.isBooked);
      });
      
      // Append images
      if (propertyData.images && propertyData.images.length > 0) {
        for (let i = 0; i < propertyData.images.length; i++) {
          formData.append('images', propertyData.images[i]);
        }
      }
      
      let url = 'https://funmislist-project.vercel.app/api/properties';
      let method = 'POST';
      
      if (editingProperty) {
        url += `/${editingProperty._id}`;
        method = 'PUT';
      }
      
      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${userInfo.token}`
        },
        body: formData
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to save property');
      }
      
      toast.success(editingProperty ? 'Property updated successfully' : 'Property added successfully');
      setPropertySubSection('view');
      setEditingProperty(null);
      dispatch(fetchProperties());
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleEditProperty = (property) => {
    setEditingProperty(property);
    setPropertySubSection('edit');
  };
  
  const handleDeleteProperty = async (id) => {
    if (!window.confirm('Are you sure you want to delete this property?')) {
      return;
    }
    
    try {
      const response = await fetch(`https://funmislist-project.vercel.app/api/properties/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${userInfo.token}`
        }
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to delete property');
      }
      
      toast.success('Property deleted successfully');
      dispatch(fetchProperties());
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar Navigation */}
      <div className={`${sidebarExpanded ? 'w-64' : 'w-20'} bg-gray-900 text-gray-100 transition-all duration-300 ease-in-out flex flex-col h-screen fixed border-r border-gray-800`}>
        <div className="p-4 space-y-4 bg-gray-800">
          <div className="flex items-center justify-between">
            {sidebarExpanded && <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Admin Panel</h1>}
            <button 
              onClick={() => setSidebarExpanded(!sidebarExpanded)} 
              className="p-2 rounded-full hover:bg-blue-700 transition-colors"
            >
              {sidebarExpanded ? <FaArrowLeft className="text-gray-300" /> : <FaArrowRight className="text-gray-300" />}
            </button>
          </div>
          
          {userInfo && (
            <div className="flex items-center space-x-2 py-2 px-3 rounded-lg bg-gray-800/80">
              <div className="flex items-center flex-1">
                <FaUser className="text-blue-400 mr-2" />
                <div className="truncate">
                  <p className="text-sm font-medium text-gray-200">{userInfo.name}</p>
                  <p className="text-xs text-gray-400">Administrator</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="p-1.5 rounded-full bg-gray-700 hover:bg-red-600 transition-colors"
                title="Logout"
              >
                <FaSignOutAlt className="text-gray-300" />
              </button>
            </div>
          )}
        </div>
        
        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-2">
            <li>
              <button
                onClick={() => setActiveSection('analytics')}
                className={`flex items-center w-full p-3 ${sidebarExpanded ? 'justify-start' : 'justify-center'} 
                ${activeSection === 'analytics' ? 'bg-gray-800 border-l-4 border-blue-400' : 'hover:bg-gray-800'} transition-all duration-200 rounded-lg mx-2 my-1`}
              >
                <FaChartBar className={`${sidebarExpanded ? 'mr-3' : 'mx-auto'} text-xl`} />
                {sidebarExpanded && <span>Analytics</span>}
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveSection('products')}
                className={`flex items-center w-full p-3 ${sidebarExpanded ? 'justify-start' : 'justify-center'} 
                ${activeSection === 'products' ? 'bg-gray-800 border-l-4 border-blue-400' : 'hover:bg-gray-800'} transition-all duration-200 rounded-lg mx-2 my-1`}
              >
                <FaBox className={`${sidebarExpanded ? 'mr-3' : 'mx-auto'} text-xl`} />
                {sidebarExpanded && <span>Products</span>}
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveSection('categories')}
                className={`flex items-center w-full p-3 ${sidebarExpanded ? 'justify-start' : 'justify-center'} 
                ${activeSection === 'categories' ? 'bg-gray-800 border-l-4 border-blue-400' : 'hover:bg-gray-800'} transition-all duration-200 rounded-lg mx-2 my-1`}
              >
                <FaTags className={`${sidebarExpanded ? 'mr-3' : 'mx-auto'} text-xl`} />
                {sidebarExpanded && <span>Categories</span>}
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveSection('properties')}
                className={`flex items-center w-full p-3 ${sidebarExpanded ? 'justify-start' : 'justify-center'} 
                ${activeSection === 'properties' ? 'bg-gray-800 border-l-4 border-blue-400' : 'hover:bg-gray-800'} transition-all duration-200 rounded-lg mx-2 my-1`}
              >
                <FaListUl className={`${sidebarExpanded ? 'mr-3' : 'mx-auto'} text-xl`} />
                {sidebarExpanded && <span>Properties</span>}
              </button>
            </li>
            
            {/* Logout Button */}
            <li className="mt-auto">
              <button
                onClick={handleLogout}
                className={`flex items-center w-full p-3 ${sidebarExpanded ? 'justify-start' : 'justify-center'} 
                bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-all duration-200 rounded-lg mx-2 my-1`}
              >
                <FaSignOutAlt className={`${sidebarExpanded ? 'mr-3' : 'mx-auto'} text-xl`} />
                {sidebarExpanded && <span>Logout</span>}
              </button>
            </li>
          </ul>
        </nav>
      </div>
      
      {/* Main Content */}
      <div className={`flex-1 ${sidebarExpanded ? 'ml-64' : 'ml-20'} transition-all duration-300 ease-in-out`}>
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-6 flex items-center">
            {activeSection === 'analytics' && <FaTachometerAlt className="mr-3 text-blue-600" />}
            {activeSection === 'products' && <FaBox className="mr-3 text-blue-600" />}
            {activeSection === 'categories' && <FaTags className="mr-3 text-blue-600" />}
            {activeSection === 'properties' && <FaListUl className="mr-3 text-blue-600" />}
            {activeSection === 'analytics' && 'Dashboard Analytics'}
            {activeSection === 'products' && 'Manage Products'}
            {activeSection === 'categories' && 'Manage Categories'}
            {activeSection === 'properties' && 'Manage Properties'}
          </h1>
          
          {/* Analytics Section */}
          {activeSection === 'analytics' && (
            <section className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                  <h3 className="text-gray-500 text-sm font-medium">Products Overview</h3>
                  <p className="text-3xl font-bold text-gray-800">{products?.length || 0}</p>
                  <div className="mt-2 text-xs text-blue-600">
                    {products?.filter(p => p.status === 'published')?.length || 0} Published Products
                  </div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                  <h3 className="text-gray-500 text-sm font-medium">Properties Listed</h3>
                  <p className="text-3xl font-bold text-gray-800">{properties?.length || 0}</p>
                  <div className="mt-2 text-xs text-blue-600">
                    {categories?.length || 0} Active Categories
                  </div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                  <h3 className="text-gray-500 text-sm font-medium">Total Revenue</h3>
                  <p className="text-3xl font-bold text-gray-800">₦{calculateTotalRevenue()}</p>
                  <div className="mt-2 text-xs text-blue-600">
                    {calculateTotalTransactions()} Total Transactions
                  </div>
                </div>
              </div>

              {/* Payment Status Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                  <h3 className="text-gray-500 text-sm font-medium">Completed Payments</h3>
                  <p className="text-3xl font-bold text-green-600">{getPaymentStats().completed}</p>
                  <div className="mt-2 bg-green-50 text-green-600 text-xs py-1 px-2 rounded inline-block">
                    {getPaymentStats().completedRate}% Success Rate
                  </div>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                  <h3 className="text-gray-500 text-sm font-medium">Pending Payments</h3>
                  <p className="text-3xl font-bold text-yellow-600">{getPaymentStats().pending}</p>
                  <div className="mt-2 bg-yellow-50 text-yellow-600 text-xs py-1 px-2 rounded inline-block">
                    {getPaymentStats().pendingRate}% of All Transactions
                  </div>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                  <h3 className="text-gray-500 text-sm font-medium">Failed Payments</h3>
                  <p className="text-3xl font-bold text-red-600">{getPaymentStats().failed}</p>
                  <div className="mt-2 bg-red-50 text-red-600 text-xs py-1 px-2 rounded inline-block">
                    {getPaymentStats().failureRate}% Failure Rate
                  </div>
                </div>
              </div>
              
              {/* Recent Activity */}
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
                <div className="space-y-4">
                  {products && products.length > 0 ? (
                    products.slice(0, 5).map((product) => (
                      <div key={product._id} className="flex items-center justify-between border-b pb-2">
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                            <FaBox className="text-blue-500" />
                          </div>
                          <div>
                            <p className="font-medium">{product.name}</p>
                            <p className="text-sm text-gray-500">Product added</p>
                          </div>
                        </div>
                        <div className="text-sm text-gray-500">₦{product.price}</div>
                      </div>
                    ))
                  ) : (
                    <p className="text-center py-4 text-gray-500">No recent activity</p>
                  )}
                </div>
              </div>
            </section>
          )}

          {/* Products Section */}
          {activeSection === 'products' && (
            <section>
              {/* Product section buttons */}
              <div className="flex mb-6 space-x-4">
                <button
                  onClick={() => {
                    setProductSubSection('view');
                    setEditingProduct(null);
                  }}
                  className={`px-4 py-2 rounded-lg flex items-center ${
                    productSubSection === 'view' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <FaTable className="mr-2" /> View Products
                </button>
                <button
                  onClick={() => {
                    setProductSubSection('add');
                    setEditingProduct(null);
                  }}
                  className={`px-4 py-2 rounded-lg flex items-center ${
                    productSubSection === 'add' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <FaPlus className="mr-2" /> Add Product
                </button>
              </div>

              {/* Product listing */}
              {productSubSection === 'view' && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                  <div className="p-6">
                    <div className="flex justify-between mb-4">
                      <h3 className="text-lg font-semibold">Product List</h3>
                      <button
                        onClick={() => setProductSubSection('add')}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors flex items-center"
                      >
                        <FaPlus className="mr-2" />
                        Add New Product
                      </button>
                    </div>
                    
                    {products && products.length > 0 ? (
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Name
                              </th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Price
                              </th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Category
                              </th>
                              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {products.map((product) => (
                              <tr key={product._id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="flex items-center">
                                    <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-md overflow-hidden">
                                      {product.images && product.images.length > 0 ? (
                                        <img src={product.images[0]} alt={product.name} className="h-full w-full object-cover" />
                                      ) : (
                                        <div className="flex items-center justify-center h-full w-full">
                                          <FaImage className="text-gray-400" />
                                        </div>
                                      )}
                                    </div>
                                    <div className="ml-4">
                                      <div className="text-sm font-medium text-gray-900">{product.name}</div>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="text-sm text-gray-900">₦{product.price}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                    {product.category?.name || 'Uncategorized'}
                                  </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                  <button
                                    onClick={() => handleEditProduct(product)}
                                    className="text-indigo-600 hover:text-indigo-900 mr-3"
                                  >
                                    <FaEdit className="inline" /> Edit
                                  </button>
                                  <button
                                    onClick={() => handleDeleteProduct(product._id)}
                                    className="text-red-600 hover:text-red-900"
                                  >
                                    <FaTrash className="inline" /> Delete
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <p className="text-center py-10 text-gray-500">No products found</p>
                    )}
                  </div>
                </div>
              )}

              {/* Add/Edit Product Form */}
              {(productSubSection === 'add' || productSubSection === 'edit') && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                  <div className="p-6">
                    <h3 className="text-lg font-semibold mb-4">
                      {editingProduct ? 'Edit Product' : 'Add New Product'}
                    </h3>
                    <form onSubmit={handleProductSubmit} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Product Name
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={productForm.name}
                          onChange={handleProductChange}
                          className="w-full p-2 border border-gray-300 rounded"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Description
                        </label>
                        <textarea
                          name="description"
                          value={productForm.description}
                          onChange={handleProductChange}
                          rows="4"
                          className="w-full p-2 border border-gray-300 rounded"
                          required
                        ></textarea>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Price
                        </label>
                        <input
                          type="number"
                          name="price"
                          value={productForm.price}
                          onChange={handleProductChange}
                          className="w-full p-2 border border-gray-300 rounded"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Category
                        </label>
                        <select
                          name="category"
                          value={productForm.category}
                          onChange={handleProductChange}
                          className="w-full p-2 border border-gray-300 rounded"
                          required
                        >
                          <option value="">Select Category</option>
                          {categories && categories.map(cat => (
                            <option key={cat._id} value={cat._id}>{cat.name}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Product Images
                        </label>
                        <input
                          type="file"
                          name="images"
                          multiple
                          onChange={handleProductChange}
                          className="w-full p-2 border border-gray-300 rounded"
                          accept="image/*"
                        />
                        {editingProduct && editingProduct.images && editingProduct.images.length > 0 && (
                          <div className="mt-2">
                            <p className="text-sm text-gray-500 mb-1">Current Images:</p>
                            <div className="flex flex-wrap gap-2">
                              {editingProduct.images.map((img, idx) => (
                                <div key={idx} className="w-16 h-16 relative">
                                  <img src={img} alt={`Product ${idx}`} className="w-full h-full object-cover rounded" />
                                </div>
                              ))}
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                              *Upload new images to replace existing ones
                            </p>
                          </div>
                        )}
                      </div>
                      <div className="flex justify-end pt-4">
                        <button
                          type="button"
                          onClick={() => {
                            setProductSubSection('view');
                            setEditingProduct(null);
                          }}
                          className="bg-gray-300 text-gray-700 px-4 py-2 rounded mr-2 hover:bg-gray-400"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                          disabled={isLoading}
                        >
                          {isLoading ? (
                            <><span className="animate-spin h-4 w-4 border-b-2 border-white rounded-full inline-block mr-2"></span>
                              {editingProduct ? 'Updating...' : 'Adding...'}
                            </>
                          ) : (
                            editingProduct ? 'Update Product' : 'Add Product'
                          )}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </section>
          )}
          
          {/* Categories Section */}
          {activeSection === 'categories' && (
            <section>
              {/* Category section buttons */}
              <div className="flex mb-6 space-x-4">
                <button
                  onClick={() => setCategorySubSection('view')}
                  className={`px-4 py-2 rounded-lg flex items-center ${
                    categorySubSection === 'view' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <FaTable className="mr-2" /> View Categories
                </button>
                <button
                  onClick={() => setCategorySubSection('add')}
                  className={`px-4 py-2 rounded-lg flex items-center ${
                    categorySubSection === 'add' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <FaPlus className="mr-2" /> Add Category
                </button>
              </div>

              {/* View Categories */}
              {categorySubSection === 'view' && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                  <div className="p-6">
                    <div className="flex justify-between mb-4">
                      <h3 className="text-lg font-semibold">Category List</h3>
                      <button
                        onClick={() => setCategorySubSection('add')}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors flex items-center"
                      >
                        <FaPlus className="mr-2" />
                        Add New Category
                      </button>
                    </div>
                    
                    {categories && categories.length > 0 ? (
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Name
                              </th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Description
                              </th>
                              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {categories.map((category) => (
                              <tr key={category._id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="text-sm font-medium text-gray-900">{category.name}</div>
                                </td>
                                <td className="px-6 py-4">
                                  <div className="text-sm text-gray-500">{category.description}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                  <button
                                    onClick={() => handleEditCategory(category)}
                                    className="text-indigo-600 hover:text-indigo-900 mr-3"
                                  >
                                    <FaEdit className="inline" /> Edit
                                  </button>
                                  <button
                                    onClick={() => handleDeleteCategory(category._id)}
                                    className="text-red-600 hover:text-red-900"
                                  >
                                    <FaTrash className="inline" /> Delete
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <p className="text-center py-10 text-gray-500">No categories found</p>
                    )}
                  </div>
                </div>
              )}

              {/* Add Category Form */}
              {categorySubSection === 'add' && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                  <div className="p-6">
                    <h3 className="text-lg font-semibold mb-4">
                      Add New Category
                    </h3>
                    <form onSubmit={handleAddCategory}>
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Category Name
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={newCategory.name}
                          onChange={handleCategoryChange}
                          className="w-full p-2 border border-gray-300 rounded"
                          required
                        />
                      </div>
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Description
                        </label>
                        <textarea
                          name="description"
                          value={newCategory.description}
                          onChange={handleCategoryChange}
                          className="w-full p-2 border border-gray-300 rounded"
                          rows="3"
                          required
                        ></textarea>
                      </div>
                      <div className="flex justify-end">
                        <button
                          type="button"
                          onClick={() => setCategorySubSection('view')}
                          className="bg-gray-300 text-gray-700 px-4 py-2 rounded mr-2 hover:bg-gray-400"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                          disabled={isLoading}
                        >
                          {isLoading ? 'Adding...' : 'Add Category'}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              {/* Edit Category Form */}
              {categorySubSection === 'edit' && editingCategory && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                  <div className="p-6">
                    <h3 className="text-lg font-semibold mb-4">
                      Edit Category
                    </h3>
                    <form onSubmit={handleUpdateCategory}>
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Category Name
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={editingCategory.name}
                          onChange={handleCategoryChange}
                          className="w-full p-2 border border-gray-300 rounded"
                          required
                        />
                      </div>
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Description
                        </label>
                        <textarea
                          name="description"
                          value={editingCategory.description}
                          onChange={handleCategoryChange}
                          className="w-full p-2 border border-gray-300 rounded"
                          rows="3"
                          required
                        ></textarea>
                      </div>
                      <div className="flex justify-end">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingCategory(null);
                            setCategorySubSection('view');
                          }}
                          className="bg-gray-300 text-gray-700 px-4 py-2 rounded mr-2 hover:bg-gray-400"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                          disabled={isLoading}
                        >
                          {isLoading ? 'Updating...' : 'Update Category'}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </section>
          )}
          
          {/* Properties Section */}
          {activeSection === 'properties' && (
            <section>
              {/* Property section buttons */}
              <div className="flex mb-6 space-x-4">
                <button
                  onClick={() => {
                    setPropertySubSection('view');
                    setEditingProperty(null);
                  }}
                  className={`px-4 py-2 rounded-lg flex items-center ${
                    propertySubSection === 'view' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <FaTable className="mr-2" /> View Properties
                </button>
                <button
                  onClick={() => {
                    setPropertySubSection('add');
                    setEditingProperty(null);
                  }}
                  className={`px-4 py-2 rounded-lg flex items-center ${
                    propertySubSection === 'add' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <FaPlus className="mr-2" /> Add Property
                </button>
              </div>

              {/* View Properties */}
              {propertySubSection === 'view' && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                  <div className="p-6">
                    <div className="flex justify-between mb-4">
                      <h3 className="text-lg font-semibold">Property List</h3>
                      <button
                        onClick={() => setPropertySubSection('add')}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors flex items-center"
                      >
                        <FaPlus className="mr-2" />
                        Add New Property
                      </button>
                    </div>
                    
                    {properties && properties.length > 0 ? (
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Title
                              </th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Price
                              </th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Location
                              </th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Available Slots
                              </th>
                              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {properties.map((property) => (
                              <tr key={property._id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="text-sm font-medium text-gray-900">{property.title}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="text-sm text-gray-900">₦{property.price}</div>
                                </td>
                                <td className="px-6 py-4">
                                  <div className="text-sm text-gray-500">
                                    {property.location?.city}, {property.location?.state}
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="text-sm text-gray-500">
                                    {property.availableTimeSlots?.filter(slot => !slot.isBooked).length || 0} slots
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                  <button
                                    onClick={() => handleEditProperty(property)}
                                    className="text-indigo-600 hover:text-indigo-900 mr-3"
                                  >
                                    <FaEdit className="inline" /> Edit
                                  </button>
                                  <button
                                    onClick={() => handleDeleteProperty(property._id)}
                                    className="text-red-600 hover:text-red-900"
                                  >
                                    <FaTrash className="inline" /> Delete
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <p className="text-center py-10 text-gray-500">No properties found</p>
                    )}
                  </div>
                </div>
              )}

              {/* Add Property Form */}
              {propertySubSection === 'add' && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                  <div className="p-6">
                    <h3 className="text-lg font-semibold mb-4">
                      Add New Property
                    </h3>
                    <PropertyForm
                      onSubmit={handlePropertySubmit}
                      categories={categories || []}
                      isLoading={isLoading}
                      onCancel={() => setPropertySubSection('view')}
                    />
                  </div>
                </div>
              )}

              {/* Edit Property Form */}
              {propertySubSection === 'edit' && editingProperty && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                  <div className="p-6">
                    <h3 className="text-lg font-semibold mb-4">
                      Edit Property
                    </h3>
                    <PropertyForm
                      onSubmit={handlePropertySubmit}
                      initialData={editingProperty}
                      categories={categories || []}
                      isEditing={true}
                      isLoading={isLoading}
                      onCancel={() => {
                        setEditingProperty(null);
                        setPropertySubSection('view');
                      }}
                    />
                  </div>
                </div>
              )}
            </section>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboardPage;
