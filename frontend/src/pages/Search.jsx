import React, { useState, useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getCategories, searchProducts } from '../redux/productSlice';
import Layout from '../components/Layout';
import { ShoppingCart, SlidersHorizontal, ChevronDown, ChevronLeft, ChevronRight, X, Search as SearchIcon } from 'lucide-react';

const SORT_OPTIONS = [
  { label: 'Relevancy', value: '' },
  { label: 'Price: Low to High', value: 'price_asc' },
  { label: 'Price: High to Low', value: 'price_desc' },
  { label: 'Best Selling', value: 'best_selling' },
  { label: 'Most Viewed', value: 'most_viewed' },
  { label: 'Newest', value: 'newest' },
];

const Search = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const { searchResults, searchPagination, categories, isLoading } = useSelector((state) => state.products);

  const queryParams = new URLSearchParams(location.search);
  const initialKeyword = queryParams.get('keyword') || '';
  const initialCategory = queryParams.get('category') || '';

  const [filters, setFilters] = useState({
    keyword: initialKeyword,
    categories: initialCategory ? [initialCategory] : [],
    minPrice: '',
    maxPrice: '',
    sort: ''
  });
  const [searchInput, setSearchInput] = useState(initialKeyword);
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 8;

  const categoryOptions = useMemo(
    () => (categories || []).map((cat) => ({ label: cat.name, slug: cat.slug })),
    [categories]
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [filters.keyword, filters.categories, filters.minPrice, filters.maxPrice, filters.sort]);

  useEffect(() => {
    dispatch(getCategories());
  }, [dispatch]);

  useEffect(() => {
    const query = new URLSearchParams();
    if (filters.keyword) query.append('keyword', filters.keyword);
    if (filters.categories.length > 0) query.append('category', filters.categories.join(','));
    if (filters.minPrice) query.append('minPrice', filters.minPrice);
    if (filters.maxPrice) query.append('maxPrice', filters.maxPrice);
    if (filters.sort) query.append('sortBy', filters.sort);
    query.append('page', currentPage.toString());
    query.append('limit', ITEMS_PER_PAGE.toString());
    dispatch(searchProducts({ queryParams: query.toString(), append: currentPage > 1 }));
  }, [filters.keyword, filters.categories, filters.minPrice, filters.maxPrice, filters.sort, currentPage, dispatch]);

  const toggleCategory = (cat) => {
    setFilters(prev => ({
      ...prev,
      categories: prev.categories.includes(cat)
        ? prev.categories.filter(c => c !== cat)
        : [...prev.categories, cat]
    }));
    setCurrentPage(1);
  };

  const clearAll = () => {
    setFilters({ keyword: '', categories: [], minPrice: '', maxPrice: '', sort: '' });
    setSearchInput('');
    navigate('/search');
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setFilters(prev => ({ ...prev, keyword: searchInput }));
  };

  const displayProducts = searchResults || [];
  const totalPages = searchPagination?.pages || 1;
  const activeSortLabel = SORT_OPTIONS.find(o => o.value === filters.sort)?.label || 'Relevancy';
  const categoryLabel = (slug) => categoryOptions.find(c => c.slug === slug)?.label || slug;


  return (
    <Layout>
      <div style={{ backgroundColor: '#fafafa', minHeight: '100vh' }}>
        <div className="container-xl py-4 px-3 px-md-4">

          {/* Top Header Bar */}
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4 gap-3">
            <div>
              <p className="text-uppercase text-muted fw-bold mb-1" style={{ fontSize: '10px', letterSpacing: '1.5px' }}>
                SHOP / COLLECTIONS
              </p>
              <h1 className="fw-bold text-dark mb-0" style={{ fontSize: '24px', fontFamily: 'Georgia, serif' }}>
                {filters.keyword ? `Results for "${filters.keyword}"` : 'All Products'}
              </h1>
              <p className="text-muted mt-1 mb-0" style={{ fontSize: '13px' }}>
                {searchPagination?.total ?? displayProducts.length} items found
                {filters.categories.length > 0 && ` in ${filters.categories.map(categoryLabel).join(', ')}`}
              </p>
            </div>

            {/* Search bar + Sort */}
            <div className="d-flex gap-2 align-items-center w-100 w-md-auto" style={{ maxWidth: '500px' }}>
              <form onSubmit={handleSearchSubmit} className="d-flex flex-grow-1 border rounded-2 overflow-hidden bg-white" style={{ height: '40px' }}>
                <input
                  type="text"
                  className="form-control border-0 shadow-none"
                  placeholder="Search fashion items..."
                  value={searchInput}
                  onChange={e => setSearchInput(e.target.value)}
                  style={{ fontSize: '14px' }}
                />
                <button type="submit" className="btn btn-dark px-3 rounded-0" style={{ borderRadius: 0 }}>
                  <SearchIcon size={15} />
                </button>
              </form>

              {/* Sort Dropdown */}
              <div className="position-relative">
                <button
                  className="btn btn-white border rounded-2 d-flex align-items-center gap-2 bg-white"
                  style={{ fontSize: '13px', height: '40px', whiteSpace: 'nowrap' }}
                  onClick={() => setShowSortMenu(!showSortMenu)}
                >
                  {activeSortLabel} <ChevronDown size={14} />
                </button>
                {showSortMenu && (
                  <div className="position-absolute end-0 top-100 mt-1 bg-white border rounded-2 shadow-sm z-3" style={{ minWidth: '180px' }}>
                    {SORT_OPTIONS.map(opt => (
                      <button
                        key={opt.value}
                        className={`d-block w-100 text-start px-3 py-2 border-0 bg-transparent text-dark ${filters.sort === opt.value ? 'fw-bold' : ''}`}
                        style={{ fontSize: '13px' }}
                        onClick={() => { setFilters(prev => ({ ...prev, sort: opt.value })); setShowSortMenu(false); }}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Active filters chips */}
          {(filters.categories.length > 0 || filters.minPrice || filters.maxPrice) && (
            <div className="d-flex gap-2 flex-wrap mb-3">
              {filters.categories.map(cat => (
                <span key={cat} className="badge rounded-pill border text-dark fw-normal px-3 py-2 d-flex align-items-center gap-1"
                  style={{ fontSize: '12px', backgroundColor: '#f0f0f0', cursor: 'pointer' }}
                  onClick={() => toggleCategory(cat)}>
                  {categoryLabel(cat)} <X size={12} />
                </span>
              ))}
              {(filters.minPrice || filters.maxPrice) && (
                <span className="badge rounded-pill border text-dark fw-normal px-3 py-2 d-flex align-items-center gap-1"
                  style={{ fontSize: '12px', backgroundColor: '#f0f0f0', cursor: 'pointer' }}
                  onClick={() => setFilters(prev => ({ ...prev, minPrice: '', maxPrice: '' }))}>
                  ${filters.minPrice || '0'} – ${filters.maxPrice || '∞'} <X size={12} />
                </span>
              )}
              <button className="btn btn-link text-danger p-0 text-decoration-none" style={{ fontSize: '12px' }} onClick={clearAll}>
                Clear all
              </button>
            </div>
          )}

          <div className="row g-4">
            {/* Sidebar */}
            <div className="col-lg-2 d-none d-lg-block">
              <div className="bg-white rounded-3 border p-3" style={{ position: 'sticky', top: '20px' }}>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <span className="fw-bold text-dark d-flex align-items-center gap-1" style={{ fontSize: '14px' }}>
                    <SlidersHorizontal size={15} /> Filters
                  </span>
                  <button className="btn btn-link text-muted p-0 text-decoration-none" style={{ fontSize: '12px' }} onClick={clearAll}>
                    Reset
                  </button>
                </div>

                <hr className="my-2" />

                {/* Categories */}
                <div className="mb-3">
                  <p className="text-uppercase text-muted fw-bold mb-2" style={{ fontSize: '10px', letterSpacing: '1px' }}>CATEGORY</p>
                  {categoryOptions.map(cat => (
                    <div key={cat.slug} className="d-flex justify-content-between align-items-center mb-1">
                      <div className="form-check mb-0">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id={`cat-${cat.slug}`}
                          checked={filters.categories.includes(cat.slug)}
                          onChange={() => toggleCategory(cat.slug)}
                        />
                        <label className="form-check-label text-dark" style={{ fontSize: '13px' }} htmlFor={`cat-${cat.slug}`}>
                          {cat.label}
                        </label>
                      </div>
                    </div>
                  ))}
                </div>

                <hr className="my-2" />

                {/* Price Range */}
                <div className="mb-3">
                  <p className="text-uppercase text-muted fw-bold mb-2" style={{ fontSize: '10px', letterSpacing: '1px' }}>PRICE RANGE</p>
                  <div className="d-flex gap-2">
                    <input
                      type="number"
                      className="form-control form-control-sm"
                      placeholder="Min $"
                      value={filters.minPrice}
                      onChange={e => setFilters({ ...filters, minPrice: e.target.value })}
                      style={{ fontSize: '12px' }}
                    />
                    <input
                      type="number"
                      className="form-control form-control-sm"
                      placeholder="Max $"
                      value={filters.maxPrice}
                      onChange={e => setFilters({ ...filters, maxPrice: e.target.value })}
                      style={{ fontSize: '12px' }}
                    />
                  </div>
                </div>

                <hr className="my-2" />

                {/* Availability / Rating / Brands removed for server-driven pagination */}
              </div>
            </div>

            {/* Product Grid */}
            <div className="col-lg-10">
              {isLoading ? (
                <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
                  <div className="spinner-border text-dark" role="status"><span className="visually-hidden">Loading...</span></div>
                </div>
              ) : displayProducts.length === 0 ? (
                <div className="text-center py-5">
                  <p className="text-muted mb-3" style={{ fontSize: '16px' }}>No items found in this category.</p>
                  <button className="btn btn-outline-dark rounded-2 px-4" onClick={clearAll}>Clear Filters</button>
                </div>
              ) : (
                <>
                  <div className="row row-cols-2 row-cols-md-3 row-cols-xl-4 g-3">
                    {displayProducts.map(product => (
                      <div key={product._id} className="col">
                        <div
                          className="bg-white rounded-3 border overflow-hidden h-100"
                          style={{ cursor: 'pointer', transition: 'box-shadow 0.2s' }}
                          onClick={() => navigate(`/product/${product._id}`)}
                          onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.1)'}
                          onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
                        >
                          <div className="position-relative overflow-hidden" style={{ aspectRatio: '1/1', backgroundColor: '#f5f5f5' }}>
                            <img
                              src={product.media?.[0]?.media_url || 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=500&q=80'}
                              className="w-100 h-100"
                              style={{ objectFit: 'cover', transition: 'transform 0.4s ease' }}
                              alt={product.name}
                              onMouseEnter={e => e.target.style.transform = 'scale(1.05)'}
                              onMouseLeave={e => e.target.style.transform = 'scale(1)'}
                            />
                            <span className="position-absolute top-0 start-0 m-2 badge text-white fw-bold"
                              style={{ fontSize: '9px', letterSpacing: '0.5px', backgroundColor: '#111' }}>
                              {product.category?.name?.toUpperCase()}
                            </span>
                          </div>
                          <div className="p-3">
                            <p className="fw-medium text-dark mb-1" style={{ fontSize: '13px', lineHeight: '1.4', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                              {product.name}
                            </p>
                            <div className="d-flex text-warning mb-2" style={{ fontSize: '10px' }}>
                              {[...Array(5)].map((_, i) => (
                                <i key={i} className={`fa-solid fa-star ${i < Math.floor(product.average_rating || 4.5) ? '' : 'opacity-25'}`}></i>
                              ))}
                              <span className="text-muted ms-1" style={{ fontSize: '10px' }}>({product.sold_quantity || 120})</span>
                            </div>
                            <div className="d-flex justify-content-between align-items-center">
                              <div>
                                <span className="fw-bold text-dark" style={{ fontSize: '15px' }}>${product.base_price?.toFixed(2)}</span>
                                <span className="text-muted text-decoration-line-through ms-2" style={{ fontSize: '12px' }}>
                                  ${(product.base_price * 1.25).toFixed(2)}
                                </span>
                              </div>
                              <button
                                className="btn btn-dark btn-sm rounded-2 px-2"
                                style={{ fontSize: '11px' }}
                                onClick={e => { e.stopPropagation(); }}
                              >
                                <ShoppingCart size={13} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="d-flex justify-content-center align-items-center gap-2 mt-5">
                      <button
                        className="btn btn-outline-secondary btn-sm rounded-2"
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                      >
                        <ChevronLeft size={15} />
                      </button>
                      {[...Array(totalPages)].map((_, i) => (
                        <button
                          key={i}
                          className={`btn btn-sm rounded-2 px-3 ${currentPage === i + 1 ? 'btn-dark' : 'btn-outline-secondary'}`}
                          onClick={() => setCurrentPage(i + 1)}
                        >
                          {i + 1}
                        </button>
                      ))}
                      <button
                        className="btn btn-outline-secondary btn-sm rounded-2"
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                      >
                        <ChevronRight size={15} />
                      </button>
                    </div>
                  )}

                  {/* Suggestion Tags */}
                  <div className="rounded-3 border p-4 text-center mt-5 mb-3" style={{ backgroundColor: '#f9f9f9' }}>
                    <p className="text-dark fw-medium mb-3" style={{ fontFamily: 'Georgia, serif', fontSize: '16px' }}>
                      Explore more styles
                    </p>
                    <div className="d-flex flex-wrap justify-content-center gap-2">
                                {['Đồng phục mới', 'Giáo trình học kỳ', 'Bút bi', 'Quà tặng UTE', 'Phụ kiện học tập', 'Thiết bị điện tử'].map(tag => (
                        <button
                          key={tag}
                          className="btn btn-outline-secondary btn-sm rounded-pill px-3"
                          style={{ fontSize: '12px' }}
                          onClick={() => { setSearchInput(tag); setFilters(prev => ({ ...prev, keyword: tag })); }}
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Search;
