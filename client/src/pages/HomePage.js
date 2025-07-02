import { useEffect, useState } from 'react';
import { useProduct } from '../context/ProductContext';
import { Link, useSearchParams } from 'react-router-dom';
import { addToCart } from '../api/cart';
import { toast } from 'react-toastify';

function HomePage() {
  const {
    products, loading, fetchProducts, search,
    filters, applyFilters, page, goToPage
  } = useProduct();

  const [searchParams] = useSearchParams();
  const [keyword, setKeyword] = useState('');
  const [category, setCategory] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // grid or list

  useEffect(() => {
    fetchProducts();
    // Handle search from URL params (from navbar search)
    const searchQuery = searchParams.get('search');
    if (searchQuery) {
      setKeyword(searchQuery);
      search(searchQuery);
    }
  }, [searchParams]);

  const handleSearch = (e) => {
    e.preventDefault();
    search(keyword);
  };

  const handleFilter = (e) => {
    e.preventDefault();
    applyFilters({
      category,
      minPrice: minPrice || undefined,
      maxPrice: maxPrice || undefined,
      sortBy: sortBy || undefined,
    });
  };

  const handleAddToCart = async (productId, e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await addToCart(productId, 1);
      toast.success('Added to cart!');
    } catch (error) {
      toast.error('Failed to add to cart. Please login.');
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <svg key={i} className="w-4 h-4 text-warning-400 fill-current" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      );
    }

    if (hasHalfStar) {
      stars.push(
        <svg key="half" className="w-4 h-4 text-warning-400 fill-current" viewBox="0 0 20 20">
          <defs>
            <linearGradient id="half">
              <stop offset="50%" stopColor="currentColor" />
              <stop offset="50%" stopColor="#e5e7eb" />
            </linearGradient>
          </defs>
          <path fill="url(#half)" d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      );
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <svg key={`empty-${i}`} className="w-4 h-4 text-secondary-300 fill-current" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      );
    }

    return stars;
  };

  return (
    <div className="container-custom section-padding">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl lg:text-6xl font-display font-bold text-secondary-900 mb-4">
          Discover Amazing <span className="text-gradient">Products</span>
        </h1>
        <p className="text-xl text-secondary-600 max-w-2xl mx-auto">
          Shop from thousands of products with fast delivery and great prices
        </p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-2xl shadow-soft p-6 mb-8">
        {/* Search */}
        <form onSubmit={handleSearch} className="mb-6">
          <div className="relative max-w-2xl mx-auto">
            <input
              type="text"
              placeholder="Search for products, brands, categories..."
              value={keyword}
              onChange={e => setKeyword(e.target.value)}
              className="form-input pl-12 pr-4 text-lg h-14"
            />
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg className="h-6 w-6 text-secondary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <button
              type="submit"
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              <span className="btn-primary btn-md">Search</span>
            </button>
          </div>
        </form>

        {/* Filters */}
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
          <form onSubmit={handleFilter} className="flex flex-wrap gap-3 items-center">
            <select
              value={category}
              onChange={e => setCategory(e.target.value)}
              className="form-input min-w-[150px]"
            >
              <option value="">All Categories</option>
              <option value="electronics">Electronics</option>
              <option value="clothing">Clothing</option>
              <option value="books">Books</option>
              <option value="home">Home & Garden</option>
              <option value="sports">Sports</option>
            </select>

            <div className="flex gap-2">
              <input
                type="number"
                placeholder="Min ₹"
                value={minPrice}
                onChange={e => setMinPrice(e.target.value)}
                className="form-input w-24"
              />
              <input
                type="number"
                placeholder="Max ₹"
                value={maxPrice}
                onChange={e => setMaxPrice(e.target.value)}
                className="form-input w-24"
              />
            </div>

            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className="form-input min-w-[150px]"
            >
              <option value="">Sort By</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="name_asc">Name: A to Z</option>
              <option value="name_desc">Name: Z to A</option>
              <option value="rating">Highest Rated</option>
            </select>

            <button type="submit" className="btn-primary btn-md">
              Apply Filters
            </button>
          </form>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-secondary-600">View:</span>
            <div className="flex bg-secondary-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-white shadow-sm text-primary-600'
                    : 'text-secondary-600 hover:text-secondary-900'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'list'
                    ? 'bg-white shadow-sm text-primary-600'
                    : 'text-secondary-600 hover:text-secondary-900'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Products Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-display font-semibold text-secondary-900">
            {products.length} Products Found
          </h2>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="card animate-pulse">
                <div className="loading-skeleton h-48 mb-4"></div>
                <div className="card-body">
                  <div className="loading-skeleton h-4 mb-2"></div>
                  <div className="loading-skeleton h-4 w-3/4 mb-2"></div>
                  <div className="loading-skeleton h-6 w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-secondary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-secondary-900">No products found</h3>
            <p className="mt-1 text-sm text-secondary-500">Try adjusting your search or filter criteria.</p>
          </div>
        ) : (
          <div className={`grid gap-6 ${
            viewMode === 'grid'
              ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
              : 'grid-cols-1'
          }`}>
            {products.map(product => (
              <div key={product._id} className={`card-hover group ${viewMode === 'list' ? 'flex' : ''}`}>
                <Link to={`/product/${product._id}`} className="block">
                  <div className={`relative overflow-hidden ${viewMode === 'list' ? 'w-48 h-32 flex-shrink-0' : 'h-48'}`}>
                    <img
                      src={product.images?.[0] || product.image || '/placeholder-image.jpg'}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300"></div>

                    {/* Quick Add to Cart Button */}
                    <button
                      onClick={(e) => handleAddToCart(product._id, e)}
                      className="absolute bottom-2 right-2 btn-primary btn-sm opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5 6m0 0h9m-9 0V9a2 2 0 012-2h2m5 0V7a2 2 0 012-2h2m0 0V5a2 2 0 012-2h2" />
                      </svg>
                    </button>

                    {/* Badge for new/sale items */}
                    {product.isNew && (
                      <span className="absolute top-2 left-2 badge-success">New</span>
                    )}
                    {product.discount && (
                      <span className="absolute top-2 right-2 badge-accent">-{product.discount}%</span>
                    )}
                  </div>
                </Link>

                <div className={`card-body ${viewMode === 'list' ? 'flex-1' : ''}`}>
                  <Link to={`/product/${product._id}`}>
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-secondary-900 group-hover:text-primary-600 transition-colors line-clamp-2">
                        {product.name}
                      </h3>
                    </div>

                    <div className="flex items-center mb-2">
                      <div className="flex items-center">
                        {renderStars(product.averageRating || 4.5)}
                      </div>
                      <span className="text-sm text-secondary-500 ml-2">
                        ({product.reviewCount || 0})
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-xl font-bold text-secondary-900">
                          ₹{product.price?.toLocaleString()}
                        </span>
                        {product.originalPrice && product.originalPrice > product.price && (
                          <span className="text-sm text-secondary-500 line-through">
                            ₹{product.originalPrice.toLocaleString()}
                          </span>
                        )}
                      </div>
                      <span className="badge-secondary text-xs">
                        {product.category}
                      </span>
                    </div>

                    {product.description && viewMode === 'list' && (
                      <p className="text-sm text-secondary-600 mt-2 line-clamp-2">
                        {product.description}
                      </p>
                    )}

                    <div className="flex items-center justify-between mt-3">
                      <span className={`text-xs ${product.stock > 0 ? 'text-success-600' : 'text-accent-600'}`}>
                        {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                      </span>
                      {product.freeShipping && (
                        <span className="text-xs text-primary-600 font-medium">Free Shipping</span>
                      )}
                    </div>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      {products.length > 0 && (
        <div className="flex items-center justify-center space-x-2">
          <button
            onClick={() => goToPage(page - 1)}
            disabled={page <= 1}
            className="btn-secondary btn-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Previous
          </button>

          <div className="flex items-center space-x-1">
            {[...Array(5)].map((_, i) => {
              const pageNum = page - 2 + i;
              if (pageNum < 1) return null;

              return (
                <button
                  key={pageNum}
                  onClick={() => goToPage(pageNum)}
                  className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                    pageNum === page
                      ? 'bg-primary-600 text-white'
                      : 'text-secondary-600 hover:bg-secondary-100'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => goToPage(page + 1)}
            className="btn-secondary btn-md"
          >
            Next
            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}

export default HomePage;