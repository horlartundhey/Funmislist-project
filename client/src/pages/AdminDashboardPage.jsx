import { useEffect, useState, useCallback, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PropertyForm from '../components/PropertyForm';
import { toast } from 'react-toastify';
import { FaChartBar, FaBox, FaTags, FaListUl, FaPlus, FaTable, FaTachometerAlt, FaArrowLeft, FaArrowRight, FaUser, FaSignOutAlt, FaImage } from 'react-icons/fa';        
import { Line, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { CategoryScale, LinearScale, PointElement, LineElement, Title } from 'chart.js';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../config/api';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  ArcElement,
  Tooltip,
  Legend
);

// Format currency helper
const formatCurrency = (amount) => `₦${amount.toLocaleString()}`;

// Format date helper
const formatDate = (date) => {
  if (!date) return '';
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

function AdminDashboardPage() {
  const [activeSection, setActiveSection] = useState('analytics');
  const [productSubSection, setProductSubSection] = useState('view');
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [properties, setProperties] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [newProduct, setNewProduct] = useState({ 
    name: '', price: '', category: '', subcategory: '', condition: 'new',
    description: '', stock: '', images: [], 
    address: '', city: '', state: '', zipCode: ''
  });
  const [editingProduct, setEditingProduct] = useState(null);
  const [viewingProduct, setViewingProduct] = useState(null);
  const [newCategory, setNewCategory] = useState('');
  const [newCategoryDesc, setNewCategoryDesc] = useState('');
  const [newCategoryImage, setNewCategoryImage] = useState(null);
  const [editingCategory, setEditingCategory] = useState(null);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadingTransactions, setLoadingTransactions] = useState(false);
  const [loadingAddProduct, setLoadingAddProduct] = useState(false);
  const [loadingEditProduct, setLoadingEditProduct] = useState(false);
  const [loadingDeleteProduct, setLoadingDeleteProduct] = useState(null);
  const [loadingPublishToggle, setLoadingPublishToggle] = useState(null);
  const [loadingAddCategory, setLoadingAddCategory] = useState(false);
  const [loadingEditCategory, setLoadingEditCategory] = useState(false);
  const [loadingDeleteCategory, setLoadingDeleteCategory] = useState(null);  const [loadingAddProperty, setLoadingAddProperty] = useState(false);
  const [loadingEditProperty, setLoadingEditProperty] = useState(false);
  const [loadingDeleteProperty, setLoadingDeleteProperty] = useState(null);
  const [errorProducts, setErrorProducts] = useState(null);
  const [errorTransactions, setErrorTransactions] = useState(null);
  const [newProperty, setNewProperty] = useState({
    title: '', description: '', price: '', category: '',
    images: [], location: { address: '', city: '', state: '', zipCode: '' },
    availableTimeSlots: []
  });
  const [editingProperty, setEditingProperty] = useState(null);
  
  // Banner management states
  const [banners, setBanners] = useState([]);
  const [newBanner, setNewBanner] = useState({
    title: '', subtitle: '', description: '', imageUrl: '',
    linkUrl: '', linkText: 'Shop Now', backgroundColor: '#3B82F6',
    textColor: '#FFFFFF', buttonColor: '#FFFFFF', position: 'shop',
    active: true, order: 1, startDate: '', endDate: ''
  });
  const [editingBanner, setEditingBanner] = useState(null);
  const [loadingBanners, setLoadingBanners] = useState(true);
  const [loadingAddBanner, setLoadingAddBanner] = useState(false);
  const [loadingEditBanner, setLoadingEditBanner] = useState(false);
  const [loadingDeleteBanner, setLoadingDeleteBanner] = useState(null);
  const [bannerSubSection, setBannerSubSection] = useState('view'); // 'view' or 'add'
  const [viewingProperty, setViewingProperty] = useState(null);

  const { token, userInfo } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const fetchProducts = useCallback(async () => {
    setLoadingProducts(true);
    setErrorProducts(null);
    try {
      console.log('Fetching products from:', `${API_BASE_URL}/products`);
      const response = await fetch(`${API_BASE_URL}/products`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log('Products response status:', response.status);
      const data = await response.json();
      console.log('Products data received:', data);
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch products');
      }
      // Extract products array from response object
      const productsArray = data.products || data;
      // Ensure data is an array
      setProducts(Array.isArray(productsArray) ? productsArray : []);
      console.log('Products set to state:', Array.isArray(productsArray) ? productsArray : []);
    } catch (error) {
      console.error('Error fetching products:', error);
      setErrorProducts('Failed to fetch products');
      setProducts([]); // Set empty array on error
    } finally {
      setLoadingProducts(false);
    }
  }, [token]);

  const fetchCategories = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/categories`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      // Ensure data is an array
      setCategories(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setCategories([]); // Set empty array on error
    }
  }, [token]);
  const fetchProperties = useCallback(async () => {
    try {
      console.log('Fetching properties with token:', token);
      const res = await fetch(`${API_BASE_URL}/properties`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to fetch properties');
      console.log('Properties fetched:', data);
      // Extract properties array from response object
      const propertiesArray = data.properties || data;
      // Ensure data is an array
      setProperties(Array.isArray(propertiesArray) ? propertiesArray : []);
    } catch (err) {
      console.error('Error fetching properties:', err);
      toast.error('Error fetching properties');
      setProperties([]); // Set empty array on error
    }
  }, [token]);

  const fetchTransactions = useCallback(async () => {
    setLoadingTransactions(true);
    setErrorTransactions(null);
    try {
      const res = await fetch(`${API_BASE_URL}/payments/transactions`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to load transactions');
      // Ensure data is an array
      setTransactions(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error loading transactions:', err);
      setErrorTransactions(err.message);
      setTransactions([]); // Set empty array on error
    } finally {
      setLoadingTransactions(false);
    }
  }, [token]);

  // Memoize pagination computation
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return Array.isArray(products) ? products.slice(startIndex, endIndex) : [];
  }, [currentPage, itemsPerPage, products]);

  // Calculate total pages
  const pageCount = Math.ceil((Array.isArray(products) ? products.length : 0) / itemsPerPage);

  // Analytics computations
  const transactionAnalytics = useMemo(() => {
    if (!Array.isArray(transactions) || transactions.length === 0) return null;

    // Calculate total revenue from successful transactions
    const totalRevenue = transactions.reduce((sum, t) => 
      t.status === 'success' ? sum + t.amount : sum, 0);

    // Calculate transaction status breakdown
    const statusBreakdown = transactions.reduce((acc, t) => {
      acc[t.status] = (acc[t.status] || 0) + 1;
      return acc;
    }, {});

    // Get recent transactions sorted by date
    const recentTransactions = Array.isArray(transactions) 
      ? [...transactions]
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 5)
      : [];

    // Calculate monthly revenue data for line chart
    const monthlyRevenue = Array.isArray(transactions) 
      ? transactions
          .filter(t => t.status === 'success')
          .reduce((acc, t) => {
            const date = new Date(t.createdAt);
            const monthYear = date.toLocaleString('default', { month: 'short', year: 'numeric' });
            acc[monthYear] = (acc[monthYear] || 0) + t.amount;
            return acc;
          }, {})
      : {};

    // Prepare chart data
    const chartData = {
      labels: Object.keys(monthlyRevenue),
      datasets: [{
        label: 'Monthly Revenue',
        data: Object.values(monthlyRevenue),
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      }]
    };

    // Prepare pie chart data
    const pieData = {
      labels: Object.keys(statusBreakdown),
      datasets: [{
        data: Object.values(statusBreakdown),
        backgroundColor: [
          'rgb(75, 192, 192)',  // success
          'rgb(255, 205, 86)', // pending
          'rgb(255, 99, 132)'  // failed
        ],
      }]
    };

    return {
      totalRevenue,
      statusBreakdown,
      recentTransactions,
      chartData,
      pieData
    };
  }, [transactions]);  const handleAddProduct = useCallback(async (e) => {
    e.preventDefault();
    setLoadingAddProduct(true);
    const formData = new FormData();
    formData.append('name', newProduct.name);
    formData.append('price', newProduct.price);
    formData.append('category', newProduct.category);
    
    // Only add subcategory if it has a value
    if (newProduct.subcategory) {
      formData.append('subcategory', newProduct.subcategory);
      console.log('Adding subcategory to form data:', newProduct.subcategory);
    } else {
      console.log('No subcategory value to add');
    }
    
    formData.append('condition', newProduct.condition);
    formData.append('description', newProduct.description);
    formData.append('stock', newProduct.stock);
    formData.append('published', 'true'); // Add published field
    formData.append('address', newProduct.address);
    formData.append('city', newProduct.city);
    formData.append('state', newProduct.state);
    formData.append('zipCode', newProduct.zipCode);
    
    Array.from(newProduct.images).forEach(image => {
      formData.append('images', image);
    });

    try {
      const response = await fetch(`${API_BASE_URL}/products`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
      if (response.status === 403) {
        toast.error('Forbidden: admin access required to add products');
        return;
      }
      if (response.ok) {
        fetchProducts();
        setNewProduct({ 
          name: '', price: '', category: '', subcategory: '', condition: 'new',
          description: '', stock: '', images: [], 
          address: '', city: '', state: '', zipCode: ''
        });
        toast.success('Product added successfully');
      } else {
        toast.error('Error adding product');
      }
    } catch (error) {
      toast.error('Error adding product');
      console.error('Error adding product:', error);
    } finally {
      setLoadingAddProduct(false);
    }
  }, [token, newProduct, fetchProducts]);  const handleEditProduct = useCallback(async (e) => {
    e.preventDefault();
    setLoadingEditProduct(true);
    const formData = new FormData();
    formData.append('name', editingProduct.name);
    formData.append('price', editingProduct.price);
    formData.append('category', editingProduct.category);
    
    // Only add subcategory if it has a value
    if (editingProduct.subcategory) {
      formData.append('subcategory', editingProduct.subcategory);
      console.log('Adding subcategory to form data for edit:', editingProduct.subcategory);
    } else {
      console.log('No subcategory value to add for edit');
    }
    
    formData.append('condition', editingProduct.condition);
    formData.append('description', editingProduct.description);
    formData.append('stock', editingProduct.stock);
    formData.append('address', editingProduct.address);
    formData.append('city', editingProduct.city);
    formData.append('state', editingProduct.state);
    formData.append('zipCode', editingProduct.zipCode);
    
    if (editingProduct.newImages?.length > 0) {
      Array.from(editingProduct.newImages).forEach(image => {
        formData.append('newImages', image);
      });
    }

    try {
      const response = await fetch(`${API_BASE_URL}/products/${editingProduct._id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
      if (response.ok) {
        fetchProducts();
        setEditingProduct(null);
        toast.success('Product updated successfully');
      } else {
        toast.error('Error updating product');
      }
    } catch (error) {
      console.error('Error updating product:', error);
      toast.error('Error updating product');
    } finally {
      setLoadingEditProduct(false);
    }
  }, [token, editingProduct, fetchProducts]);

  const handleDeleteProduct = useCallback(async (id) => {
    setLoadingDeleteProduct(id);
    try {
      const response = await fetch(`${API_BASE_URL}/products/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setProducts(prevProducts => prevProducts.filter(product => product._id !== id));
        toast.success('Product deleted successfully');
      } else {
        toast.error('Error deleting product');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Error deleting product');
    } finally {
      setLoadingDeleteProduct(null);
    }
  }, [token, setProducts]);
  const handleViewProduct = useCallback((product) => {
    console.log('Viewing product with subcategory:', product.subcategory);
    setViewingProduct(product);
  }, []);

  const handleAddCategory = useCallback(async (e) => {
    e.preventDefault();
    setLoadingAddCategory(true);
    try {
      const formData = new FormData();
      formData.append('name', newCategory);
      formData.append('description', newCategoryDesc);
      if (newCategoryImage) {
        formData.append('image', newCategoryImage);
      }

      const response = await fetch(`${API_BASE_URL}/categories`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
      
      if (response.ok) {
        fetchCategories();
        setNewCategory('');
        setNewCategoryDesc('');
        setNewCategoryImage(null);
        toast.success('Category added successfully');
      } else {
        toast.error('Error adding category');
      }
    } catch (error) {
      console.error('Error adding category:', error);
      toast.error('Error adding category');
    } finally {
      setLoadingAddCategory(false);
    }
  }, [token, newCategory, newCategoryDesc, newCategoryImage, fetchCategories]);

  const handleEditCategory = useCallback(async (e) => {
    e.preventDefault();
    setLoadingEditCategory(true);
    try {
      const formData = new FormData();
      formData.append('name', editingCategory.name);
      formData.append('description', editingCategory.description || '');
      if (editingCategory.newImage) {
        formData.append('image', editingCategory.newImage);
      }

      const response = await fetch(`${API_BASE_URL}/categories/${editingCategory._id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        fetchCategories();
        setEditingCategory(null);
        toast.success('Category updated successfully');
      } else {
        toast.error('Error updating category');
      }
    } catch (error) {
      console.error('Error updating category:', error);
      toast.error('Error updating category');
    } finally {
      setLoadingEditCategory(false);
    }
  }, [token, editingCategory, fetchCategories]);

  const handleDeleteCategory = useCallback(async (id) => {
    setLoadingDeleteCategory(id);
    try {
      const response = await fetch(`${API_BASE_URL}/categories/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        fetchCategories();
        toast.success('Category deleted successfully');
      } else {
        toast.error('Error deleting category');
      }
    } catch (error) {
      console.error('Error deleting category:', error);
      toast.error('Error deleting category');
    } finally {
      setLoadingDeleteCategory(null);
    }
  }, [token, fetchCategories]);
  // Toggle publish/unpublish for a product
  const handleTogglePublish = useCallback(async (product) => {
    setLoadingPublishToggle(product._id);
    try {
      const response = await fetch(`${API_BASE_URL}/products/${product._id}/publish`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ published: !product.published })
      });      if (response.ok) {
        fetchProducts();
        toast.success(`Product ${product.published ? 'unpublished' : 'published'} successfully`);
      } else {
        toast.error('Error toggling product status');
      }
    } catch (error) {
      console.error('Error toggling product status:', error);
      toast.error('Error toggling product status');
    } finally {
      setLoadingPublishToggle(null);
    }
  }, [token, fetchProducts]);
  // Toggle publish/draft for property
  const handleTogglePropertyPublish = async (property) => {
    try {
      setLoadingPublishToggle(property._id);
      const response = await fetch(`${API_BASE_URL}/properties/${property._id}/publish`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error('Failed to toggle publish status');
      toast.success(`Property ${property.published ? 'unpublished' : 'published'} successfully`);
      fetchProperties();
  } catch {
    toast.error('Failed to update property status');
  } finally {
      setLoadingPublishToggle(null);
    }
  };
  const handleAddProperty = useCallback(async (formOrEvent) => {
    let formValues;
    if (formOrEvent && formOrEvent.preventDefault) {
      // Called from form submit event (legacy)
      formOrEvent.preventDefault();
      formValues = newProperty;
    } else {
      // Called from PropertyForm (preferred)
      formValues = formOrEvent;
    }    setLoadingAddProperty(true);
    try {
      const formData = new FormData();
      formData.append('title', formValues.title);
      formData.append('description', formValues.description);
      formData.append('price', formValues.price);
      formData.append('category', formValues.category);
      
      // Add subcategory if provided
      if (formValues.subcategory) {
        formData.append('subcategory', formValues.subcategory);
      }
      
      formData.append('location', JSON.stringify({
        address: formValues.address,
        city: formValues.city,
        state: formValues.state,
        zipCode: formValues.zipCode
      }));
      formData.append('availableTimeSlots', JSON.stringify(formValues.availableTimeSlots || []));
      if (formValues.images?.length > 0) {
        Array.from(formValues.images).forEach(image => {
          formData.append('images', image);
        });
      }
      const response = await fetch(`${API_BASE_URL}/properties`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
      if (response.ok) {
        await fetchProperties();
        setNewProperty({
          title: '', description: '', price: '', category: '',
          images: [], location: { address: '', city: '', state: '', zipCode: '' },
          availableTimeSlots: []
        });
        toast.success('Property added successfully');
      } else {
        toast.error('Error adding property');
      }
    } catch (error) {
      console.error('Error adding property:', error);
      toast.error('Error adding property');
    } finally {
      setLoadingAddProperty(false);
    }
  }, [token, newProperty, fetchProperties]);  const handleEditProperty = useCallback(async (formOrEvent) => {
    let formValues;
    if (formOrEvent && formOrEvent.preventDefault) {
      // Called from form submit event (legacy)
      formOrEvent.preventDefault();
      formValues = editingProperty;
    } else {
      // Called from PropertyForm (preferred)
      formValues = formOrEvent;
    }
    
    setLoadingEditProperty(true);
    try {      
      const formData = new FormData();      // Basic validation
      if (!formValues.title || !formValues.description || !formValues.price || !formValues.category) {
        toast.error('Please fill in all required fields');
        return;
      }

      formData.append('title', formValues.title);
      formData.append('description', formValues.description);
      formData.append('price', formValues.price);
      formData.append('category', formValues.category);
      
      // Handle subcategory
      if (formValues.subcategory) {
        // Verify subcategory is valid for the category
        const categoryObj = categories.find(cat => cat._id === formValues.category);
        if (!categoryObj?.subcategories?.some(sub => sub.name === formValues.subcategory)) {
          toast.error('Invalid subcategory for selected category');
          return;
        }
        formData.append('subcategory', formValues.subcategory);
      }
      
      formData.append('location', JSON.stringify(formValues.location));
      
      // Handle availableTimeSlots based on the format we receive
      const timeSlots = typeof formValues.availableTimeSlots === 'string'
        ? JSON.parse(formValues.availableTimeSlots)
        : formValues.availableTimeSlots;

      if (!Array.isArray(timeSlots) || timeSlots.length === 0) {
        toast.error('Please add at least one time slot');
        return;
      }

      formData.append('availableTimeSlots', JSON.stringify(timeSlots));
      
      if (formValues.images?.length > 0) {
        Array.from(formValues.images).forEach(image => {
          formData.append('images', image);
        });
      }

      const response = await fetch(`${API_BASE_URL}/properties/${editingProperty._id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        await fetchProperties();
        setEditingProperty(null);
        toast.success('Property updated successfully');
      } else {
        toast.error('Error updating property');
      }
    } catch (error) {
      console.error('Error updating property:', error);
      toast.error('Error updating property');
    } finally {
      setLoadingEditProperty(false);
    }
  }, [token, editingProperty, fetchProperties]);

  const handleDeleteProperty = useCallback(async (id) => {
    setLoadingDeleteProperty(id);
    try {
      const response = await fetch(`${API_BASE_URL}/properties/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setProperties(prevProperties => prevProperties.filter(property => property._id !== id));
        toast.success('Property deleted successfully');
      } else {
        toast.error('Error deleting property');
      }
    } catch (error) {
      console.error('Error deleting property:', error);
      toast.error('Error deleting property');
    } finally {
      setLoadingDeleteProperty(null);
    }
  }, [token]);

  const handleViewProperty = useCallback((property) => {
    setViewingProperty(property);
  }, []);
    // Handle add/edit property modal
  const handlePropertyModal = useCallback((property = null) => {
    if (property) {
      // For editing, pre-fill the form
      setEditingProperty({
        ...property,
        subcategory: property.subcategory || '',
        availableTimeSlots: JSON.stringify(property.availableTimeSlots || [], null, 2)
      });
    } else {
      // For adding new property, reset the form
      setEditingProperty(null);
      setNewProperty({
        title: '', description: '', price: '', category: '', subcategory: '',
        images: [], location: { address: '', city: '', state: '', zipCode: '' },
        availableTimeSlots: JSON.stringify([])
      });
    }
  }, []);

  // Subcategory handlers
  const handleAddSubcategory = useCallback(async (categoryId, name) => {
    if (!name) return;
    try {
      const response = await fetch(`${API_BASE_URL}/categories/${categoryId}/subcategories`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ name })
      });
      if (response.ok) {
        fetchCategories();
        toast.success('Subcategory added successfully');
      } else {
        toast.error('Error adding subcategory');
      }
    } catch (error) {
      console.error('Error adding subcategory:', error);
      toast.error('Error adding subcategory');
    }
  }, [token, fetchCategories]);

  const handleEditSubcategory = useCallback(async (categoryId, subId, name) => {
    if (!name) return;
    try {
      const response = await fetch(`${API_BASE_URL}/categories/${categoryId}/subcategories/${subId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ name })
      });
      if (response.ok) {
        fetchCategories();
        toast.success('Subcategory updated successfully');
      } else {
        toast.error('Error updating subcategory');
      }
    } catch (error) {
      console.error('Error updating subcategory:', error);
      toast.error('Error updating subcategory');
    }
  }, [token, fetchCategories]);

  const handleDeleteSubcategory = useCallback(async (categoryId, subId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/categories/${categoryId}/subcategories/${subId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        fetchCategories();
        toast.success('Subcategory deleted successfully');
      } else {
        toast.error('Error deleting subcategory');
      }
    } catch (error) {
      console.error('Error deleting subcategory:', error);
      toast.error('Error deleting subcategory');
    }
  }, [token, fetchCategories]);

  // Banner handlers
  const fetchBanners = useCallback(async () => {
    setLoadingBanners(true);
    try {
      const response = await fetch(`${API_BASE_URL}/banners`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        console.log('Banners data received:', data);
        // Extract banners array from response object
        const bannersArray = data.banners || data;
        // Ensure data is an array
        setBanners(Array.isArray(bannersArray) ? bannersArray : []);
      } else {
        toast.error('Error fetching banners');
        setBanners([]); // Set empty array on error
      }
    } catch (error) {
      console.error('Error fetching banners:', error);
      toast.error('Error fetching banners');
      setBanners([]); // Set empty array on error
    } finally {
      setLoadingBanners(false);
    }
  }, [token]);

  const handleAddBanner = useCallback(async (e) => {
    e.preventDefault();
    setLoadingAddBanner(true);
    try {
      const response = await fetch(`${API_BASE_URL}/banners`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newBanner),
      });

      if (response.ok) {
        const data = await response.json();
        setBanners(prev => [...prev, data]);
        setNewBanner({
          title: '', subtitle: '', description: '', imageUrl: '',
          linkUrl: '', linkText: 'Shop Now', backgroundColor: '#3B82F6',
          textColor: '#FFFFFF', buttonColor: '#FFFFFF', position: 'shop',
          active: true, order: 1, startDate: '', endDate: ''
        });
        setBannerSubSection('view');
        toast.success('Banner added successfully');
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || 'Error adding banner');
      }
    } catch (error) {
      console.error('Error adding banner:', error);
      toast.error('Error adding banner');
    } finally {
      setLoadingAddBanner(false);
    }
  }, [token, newBanner]);

  const handleEditBannerClick = useCallback((banner) => {
    setEditingBanner(banner);
    setBannerSubSection('add'); // Switch to add/edit form
  }, []);

  const handleEditBanner = useCallback(async (e) => {
    e.preventDefault();
    if (!editingBanner?._id) return;
    
    setLoadingEditBanner(editingBanner._id);
    try {
      const response = await fetch(`${API_BASE_URL}/banners/${editingBanner._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editingBanner),
      });

      if (response.ok) {
        const data = await response.json();
        setBanners(prev => prev.map(banner => 
          banner._id === editingBanner._id ? data : banner
        ));
        setEditingBanner(null);
        setBannerSubSection('view');
        setNewBanner({
          title: '', subtitle: '', description: '', imageUrl: '',
          linkUrl: '', linkText: 'Shop Now', backgroundColor: '#3B82F6',
          textColor: '#FFFFFF', buttonColor: '#FFFFFF', position: 'shop',
          active: true, order: 1, startDate: '', endDate: ''
        });
        toast.success('Banner updated successfully');
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || 'Error updating banner');
      }
    } catch (error) {
      console.error('Error updating banner:', error);
      toast.error('Error updating banner');
    } finally {
      setLoadingEditBanner(null);
    }
  }, [token, editingBanner]);

  const handleDeleteBanner = useCallback(async (id) => {
    setLoadingDeleteBanner(id);
    try {
      const response = await fetch(`${API_BASE_URL}/banners/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setBanners(prev => prev.filter(banner => banner._id !== id));
        toast.success('Banner deleted successfully');
      } else {
        toast.error('Error deleting banner');
      }
    } catch (error) {
      console.error('Error deleting banner:', error);
      toast.error('Error deleting banner');
    } finally {
      setLoadingDeleteBanner(null);
    }
  }, [token]);

  // Initialize data and setup section-specific data fetching
  useEffect(() => {
    // Initial data fetch
    Promise.all([fetchProperties(), fetchCategories()]);
    
    // Section-specific data fetching
    if (activeSection === 'products') {
      fetchProducts();
    } else if (activeSection === 'analytics') {
      fetchTransactions();
      fetchProducts();
    } else if (activeSection === 'banners') {
      fetchBanners();
    }
  }, [activeSection, fetchProducts, fetchCategories, fetchProperties, fetchTransactions, fetchBanners]);

  const handleLogout = () => {
    dispatch({ type: 'user/logout' });
    // Remove user info from localStorage (in case slice logic changes)
    localStorage.removeItem('userInfo');
    localStorage.removeItem('token');
    navigate('/login');
    toast.success('Logout successful');
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar Navigation */}
      <div className={`${sidebarExpanded ? 'w-64' : 'w-20'} bg-gradient-to-b from-gray-900 to-gray-800 text-white transition-all duration-300 ease-in-out flex flex-col h-screen fixed`}>  
        <div className="p-4 flex items-center justify-between">
          {sidebarExpanded && <h1 className="text-xl font-bold">Admin Panel</h1>}
          <button 
            onClick={() => setSidebarExpanded(!sidebarExpanded)} 
            className="p-2 rounded-full hover:bg-gray-700 transition-colors"
          >
            {sidebarExpanded ? <FaArrowLeft /> : <FaArrowRight />}
          </button>
        </div>
        {userInfo && (
          <div className="p-4 border-b border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <FaUser className="text-xl text-gray-300 mr-2" />
                {sidebarExpanded && (
                  <div>
                    <p className="text-sm font-medium text-gray-100">{userInfo.name}</p>
                    <p className="text-xs text-gray-400">Administrator</p>
                  </div>
                )}
              </div>
              <button onClick={handleLogout} className="p-1 hover:text-white text-gray-400">
                <FaSignOutAlt />
              </button>
            </div>
          </div>
        )}
         
         <nav className="flex-1 overflow-y-auto">
          <ul className="mt-6 space-y-2">
            <li>
              <button
                onClick={() => setActiveSection('analytics')}
                className={`flex items-center w-full p-3 ${sidebarExpanded ? 'justify-start' : 'justify-center'} 
                ${activeSection === 'analytics' ? 'bg-blue-700 border-l-4 border-white' : 'hover:bg-blue-700'} transition-all duration-200`}
              >
                <FaChartBar className={`${sidebarExpanded ? 'mr-3' : 'mx-auto'} text-xl`} />
                {sidebarExpanded && <span>Analytics</span>}
              </button>
            </li>
            
            <li>
              <button
                onClick={() => {
                  setActiveSection('products');
                  setProductSubSection('view');
                }}
                className={`flex items-center w-full p-3 ${sidebarExpanded ? 'justify-start' : 'justify-center'} 
                ${activeSection === 'products' && productSubSection === 'view' ? 'bg-blue-700 border-l-4 border-white' : 'hover:bg-blue-700'} transition-all duration-200`}
              >
                <FaTable className={`${sidebarExpanded ? 'mr-3' : 'mx-auto'} text-xl`} />
                {sidebarExpanded && <span>View Products</span>}
              </button>
            </li>

            <li>
              <button
                onClick={() => {
                  setActiveSection('products');
                  setProductSubSection('add');
                }}
                className={`flex items-center w-full p-3 ${sidebarExpanded ? 'justify-start' : 'justify-center'} 
                ${activeSection === 'products' && productSubSection === 'add' ? 'bg-blue-700 border-l-4 border-white' : 'hover:bg-blue-700'} transition-all duration-200`}
              >
                <FaPlus className={`${sidebarExpanded ? 'mr-3' : 'mx-auto'} text-xl`} />
                {sidebarExpanded && <span>Add Product</span>}
              </button>
            </li>
            
            <li>
              <button
                onClick={() => setActiveSection('categories')}
                className={`flex items-center w-full p-3 ${sidebarExpanded ? 'justify-start' : 'justify-center'} 
                ${activeSection === 'categories' ? 'bg-blue-700 border-l-4 border-white' : 'hover:bg-blue-700'} transition-all duration-200`}
              >
                <FaTags className={`${sidebarExpanded ? 'mr-3' : 'mx-auto'} text-xl`} />
                {sidebarExpanded && <span>Categories</span>}
              </button>
            </li>
            
            <li>
              <button
                onClick={() => setActiveSection('properties')}
                className={`flex items-center w-full p-3 ${sidebarExpanded ? 'justify-start' : 'justify-center'} 
                ${activeSection === 'properties' ? 'bg-blue-700 border-l-4 border-white' : 'hover:bg-blue-700'} transition-all duration-200`}
              >
                <FaListUl className={`${sidebarExpanded ? 'mr-3' : 'mx-auto'} text-xl`} />
                {sidebarExpanded && <span>Properties</span>}
              </button>
            </li>
            
            <li>
              <button
                onClick={() => setActiveSection('banners')}
                className={`flex items-center w-full p-3 ${sidebarExpanded ? 'justify-start' : 'justify-center'} 
                ${activeSection === 'banners' ? 'bg-blue-700 border-l-4 border-white' : 'hover:bg-blue-700'} transition-all duration-200`}
              >
                <FaImage className={`${sidebarExpanded ? 'mr-3' : 'mx-auto'} text-xl`} />
                {sidebarExpanded && <span>Banners</span>}
              </button>
            </li>
          </ul>
        </nav>
      </div>      {/* Main Content */}
      <div className={`flex-1 ${sidebarExpanded ? 'ml-64' : 'ml-20'} transition-all duration-300 ease-in-out`}>
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-6 flex items-center">
            {activeSection === 'analytics' && <FaTachometerAlt className="mr-3 text-blue-600" />}
            {activeSection === 'products' && (productSubSection === 'view' ? <FaTable className="mr-3 text-blue-600" /> : <FaPlus className="mr-3 text-blue-600" />)}
            {activeSection === 'categories' && <FaTags className="mr-3 text-blue-600" />}
            {activeSection === 'properties' && <FaListUl className="mr-3 text-blue-600" />}
            {activeSection === 'banners' && <FaImage className="mr-3 text-blue-600" />}
            {activeSection === 'analytics' && 'Dashboard Analytics'}
            {activeSection === 'products' && (productSubSection === 'view' ? 'View Products' : 'Add New Product')}
            {activeSection === 'categories' && 'Manage Categories'}
            {activeSection === 'properties' && 'Manage Properties'}
            {activeSection === 'banners' && 'Manage Banners'}
          </h1>

          {/* Analytics Section */}
          {activeSection === 'analytics' && (
            <section className="space-y-6">
              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                  <h3 className="text-gray-500 text-sm font-medium">Products Overview</h3>
                  <p className="text-3xl font-bold text-gray-800">{Array.isArray(products) ? products.length : 0}</p>
                  <div className="mt-2 text-xs text-blue-600">
                    {Array.isArray(products) ? products.filter(p => p.published).length : 0} Published Products
                  </div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                  <h3 className="text-gray-500 text-sm font-medium">Properties Listed</h3>
                  <p className="text-3xl font-bold text-gray-800">{Array.isArray(properties) ? properties.length : 0}</p>
                  <div className="mt-2 text-xs text-blue-600">
                    {Array.isArray(categories) ? categories.length : 0} Active Categories
                  </div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                  <h3 className="text-gray-500 text-sm font-medium">Total Revenue</h3>
                  <p className="text-3xl font-bold text-gray-800">
                    {formatCurrency(transactionAnalytics?.totalRevenue || 0)}
                  </p>
                  <div className="mt-2 text-xs text-blue-600">
                    {Array.isArray(transactions) ? transactions.length : 0} Total Transactions
                  </div>
                </div>
              </div>

              {/* Payment Status Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                  <h3 className="text-gray-500 text-sm font-medium">Completed Payments</h3>
                  <p className="text-3xl font-bold text-green-600">{transactionAnalytics?.statusBreakdown?.success || 0}</p>
                  <div className="mt-2 text-xs text-green-600">
                    {Array.isArray(transactions) && transactions.length > 0 ? 
                      `${((transactionAnalytics?.statusBreakdown?.success || 0) / transactions.length * 100).toFixed(1)}% Success Rate` 
                      : 'No transactions yet'}
                  </div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                  <h3 className="text-gray-500 text-sm font-medium">Pending Payments</h3>
                  <p className="text-3xl font-bold text-yellow-600">{transactionAnalytics?.statusBreakdown?.pending || 0}</p>
                  <div className="mt-2 text-xs text-gray-600">Awaiting Completion</div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                  <h3 className="text-gray-500 text-sm font-medium">Failed Payments</h3>
                  <p className="text-3xl font-bold text-red-600">{transactionAnalytics?.statusBreakdown?.failed || 0}</p>
                  <div className="mt-2 text-xs text-gray-600">Unsuccessful Attempts</div>
                </div>
              </div>

              {/* Charts Section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Payment Status Distribution Chart */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                  <h3 className="text-lg font-semibold mb-4">Payment Status Distribution</h3>
                  <div className="h-[300px] flex items-center justify-center">
                    {transactionAnalytics?.pieData ? (
                      <div className="w-full max-w-[300px]">
                        <Pie data={transactionAnalytics.pieData} options={{ responsive: true }} />
                      </div>
                    ) : (
                      <p className="text-gray-500">No transaction data available</p>
                    )}
                  </div>
                </div>

                {/* Monthly Revenue Chart */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                  <h3 className="text-lg font-semibold mb-4">Monthly Revenue</h3>
                  <div className="h-[300px] flex items-center justify-center">
                    {transactionAnalytics?.chartData ? (
                      <Line data={transactionAnalytics.chartData} options={{ 
                        responsive: true,
                        scales: {
                          y: {
                            beginAtZero: true,
                            ticks: {
                              callback: value => formatCurrency(value)
                            }
                          }
                        },
                        plugins: {
                          tooltip: {
                            callbacks: {
                              label: (context) => formatCurrency(context.raw)
                            }
                          }
                        }
                      }} />
                    ) : (
                      <p className="text-gray-500">No revenue data available</p>
                    )}
                  </div>
                </div>

                {/* Recent Transactions Table */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 col-span-2">
                  <h3 className="text-lg font-semibold mb-4">Recent Transactions</h3>
                  {loadingTransactions ? (
                    <div className="flex justify-center p-6">
                      <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
                    </div>
                  ) : errorTransactions ? (
                    <div className="p-4 text-red-500">{errorTransactions}</div>
                  ) : Array.isArray(transactions) && transactions.length === 0 ? (
                    <p className="text-center text-gray-500 p-4">No transactions found</p>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-3 border-b">Order Number</th>
                            <th className="px-4 py-3 border-b">User</th>
                            <th className="px-4 py-3 border-b">Property</th>
                            <th className="px-4 py-3 border-b">Amount</th>
                            <th className="px-4 py-3 border-b">Date</th>
                            <th className="px-4 py-3 border-b">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {transactionAnalytics?.recentTransactions.map(tx => (
                            <tr key={tx.reference} className="hover:bg-gray-50">
                              <td className="px-4 py-3 border-b">
                                <span className="font-mono font-semibold text-blue-600">
                                  {tx.orderNumber || tx.reference}
                                </span>
                              </td>
                              <td className="px-4 py-3 border-b">{tx.user?.email || tx.user?.name || 'Unknown'}</td>
                              <td className="px-4 py-3 border-b">{tx.property?.title || 'Unknown'}</td>
                              <td className="px-4 py-3 border-b">{formatCurrency(tx.amount)}</td>
                              <td className="px-4 py-3 border-b">{formatDate(tx.createdAt)}</td>
                              <td className="px-4 py-3 border-b">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                                  ${tx.status === 'success' ? 'bg-green-100 text-green-800' : 
                                    tx.status === 'failed' ? 'bg-red-100 text-red-800' : 
                                    'bg-yellow-100 text-yellow-800'}`}>
                                  {tx.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            </section>
          )}
          
          {/* Categories Section */}
          {activeSection === 'categories' && (
            <section className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6">
                {/* Add Category Form */}
                <form onSubmit={handleAddCategory} className="mb-6 space-y-4">
                  <h3 className="text-lg font-semibold mb-4">Add New Category</h3>
                  <input
                    type="text"
                    placeholder="Category Name"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="p-2 border rounded w-full"
                    required
                  />
                  <textarea
                    placeholder="Category Description"
                    value={newCategoryDesc}
                    onChange={(e) => setNewCategoryDesc(e.target.value)}
                    className="p-2 border rounded w-full"
                  />
                  <div>
                    <label className="block text-sm text-gray-600 mb-2">Category Image</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setNewCategoryImage(e.target.files[0])}
                      className="p-2 border rounded w-full"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loadingAddCategory}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50 flex items-center"
                  >
                    {loadingAddCategory ? (
                      <>
                        <div className="animate-spin h-5 w-5 border-b-2 border-white rounded-full mr-2"></div>
                        Adding...
                      </>
                    ) : (
                      <>
                        <FaPlus className="mr-2" />
                        Add Category
                      </>
                    )}
                  </button>
                </form>

                {/* Categories List */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold mb-4">Categories</h3>
                  <div className="grid gap-4">
                    {Array.isArray(categories) && categories.map((category) => (
                      <div key={category._id} className="border rounded-lg p-4 flex justify-between items-start">
                        <div>
                          <div className="flex items-center">
                            {category.image && (
                              <img src={category.image} alt={category.name} className="w-12 h-12 object-cover rounded mr-4" />
                            )}
                            <div>
                              <h4 className="font-semibold">{category.name}</h4>
                              <p className="text-sm text-gray-600">{category.description}</p>
                            </div>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => setEditingCategory(category)}
                            className="px-3 py-1 text-yellow-600 hover:text-yellow-700 border border-yellow-600 rounded-md text-sm"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteCategory(category._id)}
                            disabled={loadingDeleteCategory === category._id}
                            className="px-3 py-1 text-red-500 hover:text-red-600 border border-red-500 rounded-md text-sm"
                          >
                            {loadingDeleteCategory === category._id ? (
                              <div className="animate-spin h-4 w-4 border-b-2 border-red-500 rounded-full"></div>
                            ) : (
                              'Delete'
                            )}
                          </button>
                        </div>

                        {/* Subcategories Management */}
                        <div className="mt-4 border-t pt-4 w-full">
                          <h5 className="font-medium mb-2">Subcategories</h5>
                          {category.subcategories?.map((sub) => (
                            <div key={sub._id} className="flex items-center justify-between mb-1">
                              <span>{sub.name}</span>
                              <div className="space-x-2">
                                <button
                                  onClick={() => {
                                    const newName = prompt('Edit Subcategory', sub.name);
                                    if (newName) handleEditSubcategory(category._id, sub._id, newName);
                                  }}
                                  className="text-sm text-yellow-600 hover:underline"
                                >Edit</button>
                                <button
                                  onClick={() => {
                                    if (confirm('Delete this subcategory?')) handleDeleteSubcategory(category._id, sub._id);
                                  }}
                                  className="text-sm text-red-500 hover:underline"
                                >Delete</button>
                              </div>
                            </div>
                          ))}
                          <button
                            onClick={() => {
                              const name = prompt('New Subcategory');
                              if (name) handleAddSubcategory(category._id, name);
                            }}
                            className="text-sm text-blue-600 hover:underline"
                          >+ Add Subcategory</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Edit Category Modal */}
                {editingCategory && (
                  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full">
                      <h3 className="text-lg font-semibold mb-4">Edit Category</h3>
                      <form onSubmit={handleEditCategory} className="space-y-4">
                        <input
                          type="text"
                          placeholder="Category Name"
                          value={editingCategory.name}
                          onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                          className="p-2 border rounded w-full"
                          required
                        />
                        <textarea
                          placeholder="Description"
                          value={editingCategory.description || ''}
                          onChange={(e) => setEditingCategory({ ...editingCategory, description: e.target.value })}
                          className="p-2 border rounded w-full"
                        />
                        <div>
                          <label className="block text-sm text-gray-600 mb-2">New Image (optional)</label>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setEditingCategory({ ...editingCategory, newImage: e.target.files[0] })}
                            className="p-2 border rounded w-full"
                          />
                        </div>
                        <div className="flex justify-end space-x-4">
                          <button
                            type="button"
                            onClick={() => setEditingCategory(null)}
                            className="px-4 py-2 border rounded hover:bg-gray-50"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            disabled={loadingEditCategory}
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50 flex items-center"
                          >
                            {loadingEditCategory ? (
                              <>
                                <div className="animate-spin h-5 w-5 border-b-2 border-white rounded-full mr-2"></div>
                                Saving...
                              </>
                            ) : (
                              'Save Changes'
                            )}
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* Products Section */}
          {activeSection === 'products' && (
            <section>
              {productSubSection === 'view' ? (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                  <div className="p-4">
                    <div className="flex justify-between mb-4">
                      <div className="flex items-center">
                        <select 
                          value={itemsPerPage} 
                          onChange={(e) => setItemsPerPage(Number(e.target.value))}
                          className="mr-4 p-2 border rounded"
                        >
                          <option value={5}>5 per page</option>
                          <option value={10}>10 per page</option>
                          <option value={20}>20 per page</option>
                        </select>
                      </div>
                      <button
                        onClick={() => setProductSubSection('add')}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors flex items-center"
                      >
                        <FaPlus className="mr-2" />
                        Add New Product
                      </button>
                    </div>

                    {loadingProducts ? (
                      <div className="flex justify-center py-10">
                        <div className="animate-spin h-10 w-10 border-b-2 border-blue-500 rounded-full"></div>
                      </div>
                    ) : errorProducts ? (
                      <p className="text-red-500 text-center py-10">{errorProducts}</p>
                    ) : paginatedProducts.length === 0 ? (
                      <p className="text-center py-10 text-gray-500">No products found</p>
                    ) : (
                      <>
                        <div className="overflow-x-auto">
                          <table className="w-full">
                            <thead className="bg-gray-50">                              <tr>
                                <th className="px-4 py-3 border-b text-left">Product</th>
                                <th className="px-4 py-3 border-b text-left">Category</th>
                                <th className="px-4 py-3 border-b text-left">Subcategory</th>
                                <th className="px-4 py-3 border-b text-left">Price</th>
                                <th className="px-4 py-3 border-b text-left">Stock</th>
                                <th className="px-4 py-3 border-b text-left">Status</th>
                                <th className="px-4 py-3 border-b text-left">Actions</th>
                              </tr>
                            </thead>
                            <tbody>
                              {paginatedProducts.map((product) => (
                                <tr key={product._id} className="hover:bg-gray-50">
                                  <td className="px-4 py-3 border-b">
                                    <div className="flex items-center">
                                      {product.images?.[0] && (
                                        <img 
                                          src={product.images[0]} 
                                          alt={product.name} 
                                          className="w-10 h-10 object-cover rounded mr-3"
                                        />
                                      )}
                                      <div>
                                        <div className="font-medium">{product.name}</div>
                                        <div className="text-sm text-gray-500">ID: {product._id}</div>
                                      </div>
                                    </div>                                  </td>                                  <td className="px-4 py-3 border-b">
                                    {product.category?.name || 'Unknown'}
                                  </td>
                                  <td className="px-4 py-3 border-b">
                                    {product.subcategory || 'None'}
                                  </td>
                                  <td className="px-4 py-3 border-b">{formatCurrency(product.price)}</td>
                                  <td className="px-4 py-3 border-b">{product.stock || 0}</td>                                  <td className="px-4 py-3 border-b">                                    <button
                                      onClick={() => handleTogglePublish(product)}
                                      disabled={loadingPublishToggle === product._id}
                                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                                        ${product.published 
                                          ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                                          : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                                        } transition-colors w-24 justify-center`}
                                    >
                                      {loadingPublishToggle === product._id ? (
                                        <div className="animate-spin h-3 w-3 border-b-2 border-current rounded-full mr-1"></div>
                                      ) : null}
                                      <span>{product.published ? 'Published' : 'Draft'}</span>
                                    </button>
                                  </td>
                                  <td className="px-4 py-3 border-b">                                    <div className="flex items-center space-x-3">
                                      <button
                                        onClick={() => handleViewProduct(product)}
                                        className="px-3 py-1 text-blue-500 hover:text-blue-600 border border-blue-500 rounded-md text-sm"
                                      >
                                        View
                                      </button>
                                      <button                                        onClick={() => {
                                          // Ensure the product data is fully loaded with all fields
                                          const fullProduct = {...product};
                                          console.log('Setting product for edit:', fullProduct);
                                          setEditingProduct(fullProduct);
                                          setProductSubSection('add');
                                        }}
                                        className="px-3 py-1 text-yellow-600 hover:text-yellow-700 border border-yellow-600 rounded-md text-sm"
                                      >
                                        Edit
                                      </button>
                                      <button
                                        onClick={() => handleDeleteProduct(product._id)}
                                        disabled={loadingDeleteProduct === product._id}
                                        className="px-3 py-1 text-red-500 hover:text-red-600 border border-red-500 rounded-md text-sm"
                                      >
                                        {loadingDeleteProduct === product._id ? (
                                          <div className="animate-spin h-4 w-4 border-b-2 border-red-500 rounded-full"></div>
                                        ) : (
                                          'Delete'
                                        )}
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>

                        {/* Pagination */}                        <div className="flex items-center justify-between p-4 border-t">
                          <div className="text-sm text-gray-700">
                            Showing <span className="font-medium">{Math.min((currentPage - 1) * itemsPerPage + 1, Array.isArray(products) ? products.length : 0)}</span> to{' '}
                            <span className="font-medium">{Math.min(currentPage * itemsPerPage, Array.isArray(products) ? products.length : 0)}</span> of{' '}
                            <span className="font-medium">{Array.isArray(products) ? products.length : 0}</span> products
                          </div>
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                              disabled={currentPage === 1}
                              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400"
                            >
                              <FaArrowLeft className="mr-2 h-4 w-4" /> Previous
                            </button>
                            <span className="text-sm text-gray-700">
                              Page <span className="font-medium">{currentPage}</span> of{' '}
                              <span className="font-medium">{pageCount}</span>
                            </span>
                            <button
                              onClick={() => setCurrentPage(p => Math.min(pageCount, p + 1))}
                              disabled={currentPage >= pageCount}
                              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400"
                            >
                              Next <FaArrowRight className="ml-2 h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                  <div className="p-6">
                    <form onSubmit={editingProduct ? handleEditProduct : handleAddProduct} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                          type="text"
                          placeholder="Product Name"
                          value={editingProduct ? editingProduct.name : newProduct.name}
                          onChange={(e) => editingProduct 
                            ? setEditingProduct({ ...editingProduct, name: e.target.value })
                            : setNewProduct({ ...newProduct, name: e.target.value })
                          }
                          className="p-2 border rounded w-full"
                          required
                        />
                        <input
                          type="number"
                          placeholder="Price"
                          value={editingProduct ? editingProduct.price : newProduct.price}
                          onChange={(e) => editingProduct
                            ? setEditingProduct({ ...editingProduct, price: e.target.value })
                            : setNewProduct({ ...newProduct, price: e.target.value })
                          }
                          className="p-2 border rounded w-full"
                          required
                        />
                      </div>

                      <textarea
                        placeholder="Description"
                        value={editingProduct ? editingProduct.description : newProduct.description}
                        onChange={(e) => editingProduct
                          ? setEditingProduct({ ...editingProduct, description: e.target.value })
                          : setNewProduct({ ...newProduct, description: e.target.value })
                        }
                        className="p-2 border rounded w-full h-32"
                        required
                      />                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm text-gray-600 mb-2">Category</label>
                          <select
                            value={editingProduct ? editingProduct.category : newProduct.category}
                            onChange={(e) => editingProduct
                              ? setEditingProduct({ ...editingProduct, category: e.target.value, subcategory: '' })
                              : setNewProduct({ ...newProduct, category: e.target.value, subcategory: '' })
                            }
                            className="p-2 border rounded w-full"
                            required
                          >
                            <option value="">Select Category</option>
                            {Array.isArray(categories) && categories.map(cat => (
                              <option key={cat._id} value={cat._id}>{cat.name}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm text-gray-600 mb-2">Subcategory</label>
                          <select
                            value={editingProduct ? editingProduct.subcategory : newProduct.subcategory}
                            onChange={(e) => editingProduct
                              ? setEditingProduct({ ...editingProduct, subcategory: e.target.value })
                              : setNewProduct({ ...newProduct, subcategory: e.target.value })
                            }                            className="p-2 border rounded w-full"
                          >
                            <option value="">Select Subcategory</option>
                            {categories
                              .find(cat => cat._id === (editingProduct?.category || newProduct.category))
                              ?.subcategories?.map((sub, idx) => (
                                <option key={idx} value={sub.name}>{sub.name}</option>
                            )) || <option disabled>Select a category first</option>}
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <input
                            type="number"
                            placeholder="Stock"
                            value={editingProduct ? editingProduct.stock : newProduct.stock}
                            onChange={(e) => editingProduct
                              ? setEditingProduct({ ...editingProduct, stock: e.target.value })
                              : setNewProduct({ ...newProduct, stock: e.target.value })
                            }
                            className="p-2 border rounded w-full"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-gray-600 mb-2">Condition</label>
                          <select
                            value={editingProduct ? editingProduct.condition : newProduct.condition}
                            onChange={(e) => editingProduct
                              ? setEditingProduct({ ...editingProduct, condition: e.target.value })
                              : setNewProduct({ ...newProduct, condition: e.target.value })
                            }
                            className="p-2 border rounded w-full"
                            required
                          >
                            <option value="new">New</option>
                            <option value="pre-owned">Pre-owned</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <input
                            type="text"
                            placeholder="Address"
                            value={editingProduct ? editingProduct.address : newProduct.address}
                            onChange={(e) => editingProduct
                              ? setEditingProduct({ ...editingProduct, address: e.target.value })
                              : setNewProduct({ ...newProduct, address: e.target.value })
                            }
                            className="p-2 border rounded w-full"
                            required
                          />
                        </div>
                        <div>
                          <input
                            type="text"
                            placeholder="City"
                            value={editingProduct ? editingProduct.city : newProduct.city}
                            onChange={(e) => editingProduct
                              ? setEditingProduct({ ...editingProduct, city: e.target.value })
                              : setNewProduct({ ...newProduct, city: e.target.value })
                            }
                            className="p-2 border rounded w-full"
                            required
                          />
                        </div>
                        <div>
                          <input
                            type="text"
                            placeholder="State"
                            value={editingProduct ? editingProduct.state : newProduct.state}
                            onChange={(e) => editingProduct
                              ? setEditingProduct({ ...editingProduct, state: e.target.value })
                              : setNewProduct({ ...newProduct, state: e.target.value })
                            }
                            className="p-2 border rounded w-full"
                            required
                          />
                        </div>
                        <div>
                          <input
                            type="text"
                            placeholder="Zip Code"
                            value={editingProduct ? editingProduct.zipCode : newProduct.zipCode}
                            onChange={(e) => editingProduct
                              ? setEditingProduct({ ...editingProduct, zipCode: e.target.value })
                              : setNewProduct({ ...newProduct, zipCode: e.target.value })
                            }
                            className="p-2 border rounded w-full"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm text-gray-600 mb-2">
                          {editingProduct ? 'New Images (optional)' : 'Product Images'}
                        </label>
                        <input
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={(e) => editingProduct
                            ? setEditingProduct({ ...editingProduct, newImages: e.target.files })
                            : setNewProduct({ ...newProduct, images: e.target.files })
                          }
                          className="p-2 border rounded w-full"
                          required={!editingProduct}
                        />
                      </div>

                      <div className="flex justify-end space-x-4">
                        <button
                          type="button"
                          onClick={() => {                            setProductSubSection('view');
                            setEditingProduct(null);
                            setNewProduct({
                              name: '', price: '', category: '', subcategory: '', condition: 'new',
                              description: '', stock: '', images: [],
                              address: '', city: '', state: '', zipCode: ''
                            });
                          }}
                          className="px-4 py-2 border rounded hover:bg-gray-50"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={editingProduct ? loadingEditProduct : loadingAddProduct}
                          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50 flex items-center"
                        >
                          {editingProduct ? (
                            loadingEditProduct ? (
                              <>
                                <div className="animate-spin h-5 w-5 border-b-2 border-white rounded-full mr-2"></div>
                                Updating...
                              </>
                            ) : (
                              <>
                                <FaPlus className="mr-2" />
                                Update Product
                              </>
                            )
                          ) : (
                            loadingAddProduct ? (
                              <>
                                <div className="animate-spin h-5 w-5 border-b-2 border-white rounded-full mr-2"></div>
                                Adding...
                              </>
                            ) : (
                              <>
                                <FaPlus className="mr-2" />
                                Add Product
                              </>
                            )
                          )}
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
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-6">
                  <div className="flex justify-between mb-4">
                    <h3 className="text-lg font-semibold">Properties List</h3>
                    <button
                      onClick={() => handlePropertyModal()}
                      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors flex items-center"
                    >
                      <FaPlus className="mr-2" />
                      Add New Property
                    </button>
                  </div>

                  {Array.isArray(properties) && properties.length === 0 ? (
                    <div className="text-center py-10">
                      <p className="text-gray-500">No properties found</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50">                          <tr>
                            <th className="px-4 py-3 border-b text-left">Property</th>
                            <th className="px-4 py-3 border-b text-left">Category</th>
                            <th className="px-4 py-3 border-b text-left">Subcategory</th>
                            <th className="px-4 py-3 border-b text-left">Price</th>
                            <th className="px-4 py-3 border-b text-left">Location</th>
                            <th className="px-4 py-3 border-b text-left">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {Array.isArray(properties) && properties.map((property) => (
                            <tr key={property._id} className="hover:bg-gray-50">
                              <td className="px-4 py-3 border-b">
                                <div className="flex items-center">
                                  {property.images?.[0] && (
                                    <img 
                                      src={property.images[0]} 
                                      alt={property.title} 
                                      className="w-10 h-10 object-cover rounded mr-3"
                                    />
                                  )}
                                  <div>
                                    <div className="font-medium">{property.title}</div>
                                    <div className="text-sm text-gray-500">ID: {property._id}</div>
                                  </div>
                                </div>
                              </td>                              <td className="px-4 py-3 border-b">
                                {property.category?.name || 'Unknown'}
                              </td>
                              <td className="px-4 py-3 border-b">
                                {property.subcategory || 'None'}
                              </td>
                              <td className="px-4 py-3 border-b">{formatCurrency(property.price)}</td>
                              <td className="px-4 py-3 border-b">
                                {property.location.city}, {property.location.state}
                              </td>
                              <td className="px-4 py-3 border-b">
                                <div className="flex items-center space-x-3">
                                  <button
                                    onClick={() => handleViewProperty(property)}
                                    className="px-3 py-1 text-blue-500 hover:text-blue-600 border border-blue-500 rounded-md text-sm"
                                  >
                                    View
                                  </button>
                                  <button
                                    onClick={() => handlePropertyModal(property)}
                                    className="px-3 py-1 text-yellow-600 hover:text-yellow-700 border border-yellow-600 rounded-md text-sm"
                                  >
                                    Edit
                                  </button>
                                  <button
                                    onClick={() => handleDeleteProperty(property._id)}
                                    className="px-3 py-1 text-red-500 hover:text-red-600 border border-red-500 rounded-md text-sm"
                                  >
                                    Delete
                                  </button>
                                  <button
                                    onClick={() => handleTogglePropertyPublish(property)}
                                    className={`px-3 py-1 rounded-md text-sm border ${property.published ? 'bg-green-100 text-green-800 border-green-400 hover:bg-green-200' : 'bg-yellow-100 text-yellow-800 border-yellow-400 hover:bg-yellow-200'}`}
                                  >
                                    {property.published ? 'Published' : 'Draft'}
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            </section>
          )}

          {/* Product Details Dialog */}
          {viewingProduct && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-semibold">{viewingProduct.name}</h3>                  <button
                    onClick={() => setViewingProduct(null)}
                    className="px-3 py-1 text-gray-500 hover:text-gray-600 border border-gray-300 rounded-md text-sm"
                  >
                    Close
                  </button>
                </div>

                <div className="space-y-4">
                  {/* Product Images */}
                  {viewingProduct.images?.length > 0 && (
                    <div className="flex gap-2 overflow-x-auto pb-2">
                      {viewingProduct.images.map((image, index) => (
                        <img
                          key={index}
                          src={image}
                          alt={`${viewingProduct.name} ${index + 1}`}
                          className="w-32 h-32 object-cover rounded"
                        />
                      ))}
                    </div>
                  )}

                  {/* Product Details */}
                  <div className="grid grid-cols-2 gap-4">                    <div>                      <h4 className="font-medium text-gray-600">Category</h4>
                      <p>{viewingProduct.category?.name || 'Unknown'}</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-600">Subcategory</h4>
                      <p>{viewingProduct.subcategory || 'None'}</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-600">Price</h4>
                      <p>{formatCurrency(viewingProduct.price)}</p>                    </div>
                    <div>
                      <h4 className="font-medium text-gray-600">Condition</h4>
                      <p className="capitalize">{viewingProduct.condition}</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-600">Stock</h4>
                      <p>{viewingProduct.stock || 0}</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-600">Description</h4>
                    <p className="mt-1 text-gray-700">{viewingProduct.description}</p>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-600">Location</h4>
                    <p className="mt-1">
                      {[
                        viewingProduct.address,
                        viewingProduct.city,
                        viewingProduct.state,
                        viewingProduct.zipCode
                      ].filter(Boolean).join(', ')}
                    </p>
                  </div>

                  {/* Status and Created At */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium text-gray-600">Status</h4>                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                        ${viewingProduct.published 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {viewingProduct.published ? 'Published' : 'Draft'}
                      </span>
                    </div>              <div>
                      <h4 className="font-medium text-gray-600">Created</h4>
                      <p>{formatDate(viewingProduct.createdAt)}</p>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-4 pt-4 border-t">
                    <button
                      onClick={() => setViewingProduct(null)}
                      className="px-4 py-2 border rounded hover:bg-gray-50"
                    >
                      Close
                    </button>
                    <button                      onClick={() => {
                        console.log('Editing from view with subcategory:', viewingProduct.subcategory);
                        setEditingProduct(viewingProduct);
                        setViewingProduct(null);
                        setProductSubSection('add');
                      }}
                      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex items-center"
                    >                      Edit Product
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Property Details Dialog */}
          {viewingProperty && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-semibold">{viewingProperty.title}</h3>
                  <button
                    onClick={() => setViewingProperty(null)}
                    className="px-3 py-1 text-gray-500 hover:text-gray-600 border border-gray-300 rounded-md text-sm"
                  >
                    Close
                  </button>
                </div>

                <div className="space-y-4">
                  {/* Property Images */}
                  {viewingProperty.images?.length > 0 && (
                    <div className="flex gap-2 overflow-x-auto pb-2">
                      {viewingProperty.images.map((image, index) => (
                        <img
                          key={index}
                          src={image}
                          alt={`${viewingProperty.title} ${index + 1}`}
                          className="w-32 h-32 object-cover rounded"
                        />
                      ))}
                    </div>
                  )}

                  {/* Property Details */}
                  <div className="grid grid-cols-2 gap-4">                    <div>
                      <h4 className="font-medium text-gray-600">Category</h4>
                      <p>{viewingProperty.category?.name || 'Unknown'}</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-600">Subcategory</h4>
                      <p>{viewingProperty.subcategory || 'None'}</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-600">Price</h4>
                      <p>{formatCurrency(viewingProperty.price)}</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-600">Description</h4>
                    <p className="mt-1 text-gray-700">{viewingProperty.description}</p>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-600">Location</h4>
                    <p className="mt-1">
                      {[
                        viewingProperty.location.address,
                        viewingProperty.location.city,
                        viewingProperty.location.state,
                        viewingProperty.location.zipCode
                      ].filter(Boolean).join(', ')}
                    </p>
                  </div>

                  {/* Time Slots */}
                  <div>
                    <h4 className="font-medium text-gray-600">Available Time Slots</h4>
                    <div className="mt-1 space-y-1">
                      {viewingProperty.availableTimeSlots?.map((slot, index) => (
                        <div key={index} className="text-sm">
                          {formatDate(slot.date)} - {slot.isBooked ? 'Booked' : 'Available'}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-end space-x-4 pt-4 border-t">
                    <button
                      onClick={() => setViewingProperty(null)}
                      className="px-4 py-2 border rounded hover:bg-gray-50"
                    >
                      Close
                    </button>
                    <button
                      onClick={() => {
                        handlePropertyModal(viewingProperty);
                        setViewingProperty(null);
                      }}
                      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex items-center"
                    >
                      Edit Property
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Banner Management Section */}
          {activeSection === 'banners' && (
            <section className="space-y-6">
              {/* Banner Management Tabs */}
              <div className="flex space-x-4 border-b">
                <button
                  onClick={() => setBannerSubSection('view')}
                  className={`px-4 py-2 font-medium ${
                    bannerSubSection === 'view'
                      ? 'border-b-2 border-blue-500 text-blue-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  View Banners
                </button>
                <button
                  onClick={() => setBannerSubSection('add')}
                  className={`px-4 py-2 font-medium ${
                    bannerSubSection === 'add'
                      ? 'border-b-2 border-blue-500 text-blue-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Add Banner
                </button>
              </div>

              {/* View Banners */}
              {bannerSubSection === 'view' && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                  <div className="p-6">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold">All Banners</h3>
                      <button
                        onClick={() => setBannerSubSection('add')}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex items-center"
                      >
                        <FaPlus className="mr-2" />
                        Add New Banner
                      </button>
                    </div>

                    {loadingBanners ? (
                      <div className="text-center py-4">Loading banners...</div>
                    ) : banners.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <FaImage className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                        <p>No banners found. Create your first banner!</p>
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Preview
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Title
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Position
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Status
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {Array.isArray(banners) && banners.map((banner) => (
                              <tr key={banner._id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="flex items-center">
                                    {banner.imageUrl ? (
                                      <img
                                        src={banner.imageUrl}
                                        alt={banner.title}
                                        className="h-12 w-20 object-cover rounded"
                                      />
                                    ) : (
                                      <div 
                                        className="h-12 w-20 rounded flex items-center justify-center text-white text-xs"
                                        style={{ backgroundColor: banner.backgroundColor }}
                                      >
                                        {banner.title.substring(0, 3)}
                                      </div>
                                    )}
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="text-sm font-medium text-gray-900">{banner.title}</div>
                                  <div className="text-sm text-gray-500">{banner.subtitle}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                    {banner.position}
                                  </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                    banner.active 
                                      ? 'bg-green-100 text-green-800' 
                                      : 'bg-red-100 text-red-800'
                                  }`}>
                                    {banner.active ? 'Active' : 'Inactive'}
                                  </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                  <button
                                    onClick={() => handleEditBannerClick(banner)}
                                    className="text-blue-600 hover:text-blue-900 mr-4"
                                  >
                                    Edit
                                  </button>
                                  <button
                                    onClick={() => handleDeleteBanner(banner._id)}
                                    className="text-red-600 hover:text-red-900"
                                    disabled={loadingDeleteBanner === banner._id}
                                  >
                                    {loadingDeleteBanner === banner._id ? 'Deleting...' : 'Delete'}
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Add/Edit Banner Form */}
              {bannerSubSection === 'add' && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                  <div className="p-6">
                    <h3 className="text-lg font-semibold mb-4">
                      {editingBanner ? 'Edit Banner' : 'Add New Banner'}
                    </h3>
                    
                    <form onSubmit={editingBanner ? handleEditBanner : handleAddBanner} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Title */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Title *
                          </label>
                          <input
                            type="text"
                            value={editingBanner ? editingBanner.title : newBanner.title}
                            onChange={(e) => {
                              if (editingBanner) {
                                setEditingBanner({ ...editingBanner, title: e.target.value });
                              } else {
                                setNewBanner({ ...newBanner, title: e.target.value });
                              }
                            }}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter banner title"
                            required
                          />
                        </div>

                        {/* Subtitle */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Subtitle
                          </label>
                          <input
                            type="text"
                            value={editingBanner ? editingBanner.subtitle : newBanner.subtitle}
                            onChange={(e) => {
                              if (editingBanner) {
                                setEditingBanner({ ...editingBanner, subtitle: e.target.value });
                              } else {
                                setNewBanner({ ...newBanner, subtitle: e.target.value });
                              }
                            }}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter banner subtitle"
                          />
                        </div>

                        {/* Position */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Position *
                          </label>
                          <select
                            value={editingBanner ? editingBanner.position : newBanner.position}
                            onChange={(e) => {
                              if (editingBanner) {
                                setEditingBanner({ ...editingBanner, position: e.target.value });
                              } else {
                                setNewBanner({ ...newBanner, position: e.target.value });
                              }
                            }}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                          >
                            <option value="hero">Hero Section</option>
                            <option value="shop">Shop Page</option>
                            <option value="category">Category Page</option>
                            <option value="footer">Footer</option>
                          </select>
                        </div>

                        {/* Link URL */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Link URL
                          </label>
                          <input
                            type="url"
                            value={editingBanner ? editingBanner.linkUrl : newBanner.linkUrl}
                            onChange={(e) => {
                              if (editingBanner) {
                                setEditingBanner({ ...editingBanner, linkUrl: e.target.value });
                              } else {
                                setNewBanner({ ...newBanner, linkUrl: e.target.value });
                              }
                            }}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="https://example.com"
                          />
                        </div>

                        {/* Link Text */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Button Text
                          </label>
                          <input
                            type="text"
                            value={editingBanner ? editingBanner.linkText : newBanner.linkText}
                            onChange={(e) => {
                              if (editingBanner) {
                                setEditingBanner({ ...editingBanner, linkText: e.target.value });
                              } else {
                                setNewBanner({ ...newBanner, linkText: e.target.value });
                              }
                            }}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Shop Now"
                          />
                        </div>

                        {/* Background Color */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Background Color
                          </label>
                          <input
                            type="color"
                            value={editingBanner ? editingBanner.backgroundColor : newBanner.backgroundColor}
                            onChange={(e) => {
                              if (editingBanner) {
                                setEditingBanner({ ...editingBanner, backgroundColor: e.target.value });
                              } else {
                                setNewBanner({ ...newBanner, backgroundColor: e.target.value });
                              }
                            }}
                            className="w-full h-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>

                        {/* Text Color */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Text Color
                          </label>
                          <input
                            type="color"
                            value={editingBanner ? editingBanner.textColor : newBanner.textColor}
                            onChange={(e) => {
                              if (editingBanner) {
                                setEditingBanner({ ...editingBanner, textColor: e.target.value });
                              } else {
                                setNewBanner({ ...newBanner, textColor: e.target.value });
                              }
                            }}
                            className="w-full h-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>

                        {/* Button Color */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Button Color
                          </label>
                          <input
                            type="color"
                            value={editingBanner ? editingBanner.buttonColor : newBanner.buttonColor}
                            onChange={(e) => {
                              if (editingBanner) {
                                setEditingBanner({ ...editingBanner, buttonColor: e.target.value });
                              } else {
                                setNewBanner({ ...newBanner, buttonColor: e.target.value });
                              }
                            }}
                            className="w-full h-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>

                        {/* Order */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Display Order
                          </label>
                          <input
                            type="number"
                            value={editingBanner ? editingBanner.order : newBanner.order}
                            onChange={(e) => {
                              if (editingBanner) {
                                setEditingBanner({ ...editingBanner, order: parseInt(e.target.value) });
                              } else {
                                setNewBanner({ ...newBanner, order: parseInt(e.target.value) });
                              }
                            }}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            min="1"
                          />
                        </div>
                      </div>

                      {/* Description */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Description
                        </label>
                        <textarea
                          value={editingBanner ? editingBanner.description : newBanner.description}
                          onChange={(e) => {
                            if (editingBanner) {
                              setEditingBanner({ ...editingBanner, description: e.target.value });
                            } else {
                              setNewBanner({ ...newBanner, description: e.target.value });
                            }
                          }}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          rows="3"
                          placeholder="Enter banner description"
                        />
                      </div>

                      {/* Image URL */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Image URL
                        </label>
                        <input
                          type="url"
                          value={editingBanner ? editingBanner.imageUrl : newBanner.imageUrl}
                          onChange={(e) => {
                            if (editingBanner) {
                              setEditingBanner({ ...editingBanner, imageUrl: e.target.value });
                            } else {
                              setNewBanner({ ...newBanner, imageUrl: e.target.value });
                            }
                          }}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="https://example.com/image.jpg"
                        />
                      </div>

                      {/* Active Status */}
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={editingBanner ? editingBanner.active : newBanner.active}
                          onChange={(e) => {
                            if (editingBanner) {
                              setEditingBanner({ ...editingBanner, active: e.target.checked });
                            } else {
                              setNewBanner({ ...newBanner, active: e.target.checked });
                            }
                          }}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label className="ml-2 block text-sm text-gray-900">
                          Banner is active
                        </label>
                      </div>

                      {/* Preview */}
                      {((editingBanner || newBanner).title || (editingBanner || newBanner).imageUrl) && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Preview
                          </label>
                          <div 
                            className="p-4 rounded-lg min-h-32 flex items-center justify-center"
                            style={{ 
                              backgroundColor: (editingBanner || newBanner).backgroundColor,
                              color: (editingBanner || newBanner).textColor,
                              backgroundImage: (editingBanner || newBanner).imageUrl ? `url(${(editingBanner || newBanner).imageUrl})` : 'none',
                              backgroundSize: 'cover',
                              backgroundPosition: 'center'
                            }}
                          >
                            <div className="text-center">
                              {(editingBanner || newBanner).title && (
                                <h3 className="text-2xl font-bold mb-2">{(editingBanner || newBanner).title}</h3>
                              )}
                              {(editingBanner || newBanner).subtitle && (
                                <p className="text-lg mb-4">{(editingBanner || newBanner).subtitle}</p>
                              )}
                              {(editingBanner || newBanner).linkText && (
                                <button 
                                  className="px-6 py-2 rounded font-medium"
                                  style={{ 
                                    backgroundColor: (editingBanner || newBanner).buttonColor,
                                    color: (editingBanner || newBanner).textColor === '#FFFFFF' ? '#000000' : '#FFFFFF'
                                  }}
                                >
                                  {(editingBanner || newBanner).linkText}
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Form Actions */}
                      <div className="flex justify-end space-x-4 pt-4 border-t">
                        <button
                          type="button"
                          onClick={() => {
                            setBannerSubSection('view');
                            setEditingBanner(null);
                            setNewBanner({
                              title: '', subtitle: '', description: '', imageUrl: '',
                              linkUrl: '', linkText: 'Shop Now', backgroundColor: '#3B82F6',
                              textColor: '#FFFFFF', buttonColor: '#FFFFFF', position: 'shop',
                              active: true, order: 1, startDate: '', endDate: ''
                            });
                          }}
                          className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={loadingAddBanner || loadingEditBanner}
                          className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50"
                        >
                          {(loadingAddBanner || loadingEditBanner) 
                            ? (editingBanner ? 'Updating...' : 'Creating...') 
                            : (editingBanner ? 'Update Banner' : 'Create Banner')
                          }
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </section>
          )}

          {/* Property Add/Edit Form */}
          {(editingProperty || activeSection === 'properties') && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 mt-4">
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-4">
                  {editingProperty ? 'Edit Property' : 'Add New Property'}
                </h3>
                <PropertyForm
                  onSubmit={editingProperty ? handleEditProperty : handleAddProperty}
                  initialData={editingProperty}
                  categories={categories}
                  isEditing={!!editingProperty}
                  isLoading={editingProperty ? loadingEditProperty : loadingAddProperty}
                  onCancel={() => handlePropertyModal(null)}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboardPage;
