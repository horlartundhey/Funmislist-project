import { useEffect } from 'react';
     import { useDispatch, useSelector } from 'react-redux';
     import { fetchCategories } from '../../slices/categorySlice';
     import { Link } from 'react-router-dom';

     const FeaturedCategories = () => {
       const dispatch = useDispatch();
       const { categories } = useSelector((state) => state.categories);

       useEffect(() => {
         dispatch(fetchCategories());
       }, [dispatch]);

       return (
         <section className="max-w-7xl mx-auto px-4 py-16">
           <h2 className="text-3xl font-bold text-gray-900 text-center mt-10 mb-12">
             Popular Categories
           </h2>
           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
             {categories.map((category) => {
               const slug = category.name.toLowerCase().replace(/\s+/g, '-');
               return (
                 <Link
                   key={category._id}
                   to={`/category/${slug}`}
                   className="relative block h-64 rounded-2xl overflow-hidden group shadow-md hover:shadow-xl transition-shadow duration-300"
                 >
                   <img
                     src={category.image || '/images/no-image-placeholder.png'}
                     onError={(e) => {
                       e.currentTarget.src = '/images/no-image-placeholder.png';
                       e.currentTarget.alt = 'Image not available';
                     }}
                     alt={category.name}
                     className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                   />
                   <div className="absolute inset-0 bg-black bg-opacity-25 group-hover:bg-opacity-40 transition-colors duration-300" />
                   <div className="absolute bottom-4 left-4 text-left">
                     <h3 className="text-xl font-semibold text-white drop-shadow-lg">
                       {category.name}
                     </h3>
                     {category.productCount && (
                       <p className="text-sm text-gray-200 drop-shadow">
                         {category.productCount} items
                       </p>
                     )}
                   </div>
                 </Link>
               );
             })}
           </div>
         </section>
       );
     };

     export default FeaturedCategories;