import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getCategories, getHomeProducts, getTopProducts } from '../redux/productSlice';
import Layout from '../components/Layout';
import { ArrowRight, ShieldCheck, Truck, RotateCcw } from 'lucide-react';

const StarRating = ({ rating = 4.5, count }) => (
  <div className="d-flex align-items-center gap-1">
    <div className="d-flex text-warning" style={{ fontSize: '11px' }}>
      {[...Array(5)].map((_, i) => (
        <i key={i} className={`fa-solid ${i < Math.floor(rating) ? 'fa-star' : i < rating ? 'fa-star-half-stroke' : 'fa-star opacity-25'}`}></i>
      ))}
    </div>
    {count && <span className="text-muted" style={{ fontSize: '11px' }}>({count})</span>}
  </div>
);

const ProductCard = ({ name, category, price, oldPrice, badge, badgeColor, img, id, sold, navigate }) => (
  <div className="col-6 col-md-3 mb-0">
    <div
      className="h-100"
      style={{ cursor: 'pointer' }}
      onClick={() => navigate(`/product/${id}`)}
    >
      {/* Image */}
      <div className="position-relative rounded-3 overflow-hidden mb-2" style={{ aspectRatio: '3/4', backgroundColor: '#f3f3f3' }}>
        <img
          src={img || 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=500&q=80'}
          className="w-100 h-100"
          style={{ objectFit: 'cover', transition: 'transform 0.4s ease' }}
          alt={name}
          onMouseEnter={e => e.target.style.transform = 'scale(1.04)'}
          onMouseLeave={e => e.target.style.transform = 'scale(1)'}
        />
        {badge && (
          <span
            className="position-absolute top-0 start-0 m-2 text-white fw-bold rounded-1 px-2 py-1"
            style={{ fontSize: '10px', letterSpacing: '0.3px', backgroundColor: badgeColor || '#e11d48' }}
          >
            {badge}
          </span>
        )}
      </div>
      {/* Info */}
      <div>
        <p className="text-uppercase text-muted mb-1" style={{ fontSize: '9px', letterSpacing: '0.8px' }}>{category || 'FASHION'}</p>
        <p className="fw-medium text-dark mb-1" style={{ fontSize: '13px', lineHeight: '1.4', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {name}
        </p>
        <StarRating count={sold || Math.floor(Math.random() * 500 + 50)} />
        <div className="d-flex align-items-center gap-2 mt-1">
          <span className="fw-bold text-dark" style={{ fontSize: '14px' }}>${price?.toFixed(2)}</span>
          {oldPrice && <span className="text-muted text-decoration-line-through" style={{ fontSize: '12px' }}>${oldPrice?.toFixed(2)}</span>}
        </div>
      </div>
    </div>
  </div>
);

const SectionHeader = ({ title, icon, linkTo }) => (
  <div className="d-flex justify-content-between align-items-center mb-3">
    <div className="d-flex align-items-center gap-2">
      {icon && <span style={{ width: '3px', height: '20px', backgroundColor: '#111', borderRadius: '2px', display: 'inline-block' }}></span>}
      <h2 className="fw-bold text-dark mb-0" style={{ fontSize: '18px' }}>{title}</h2>
    </div>
    <Link to={linkTo} className="text-dark text-decoration-none d-flex align-items-center gap-1 fw-medium" style={{ fontSize: '13px' }}>
      View All <ArrowRight size={14} />
    </Link>
  </div>
);

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { homeProducts, topProducts, categories, isLoading } = useSelector((state) => state.products);
  const [bestPage, setBestPage] = useState(0);
  const [viewPage, setViewPage] = useState(0);
  const TOP_PER_PAGE = 4;
  const bestRef = React.useRef(null);
  const viewRef = React.useRef(null);

  useEffect(() => {
    dispatch(getHomeProducts());
    dispatch(getTopProducts({ type: 'best_selling' }));
    dispatch(getTopProducts({ type: 'most_viewed' }));
    dispatch(getCategories());
  }, [dispatch]);

  const promoItems = homeProducts?.promotional?.slice(0, 4) || [];
  const newItems = homeProducts?.newProducts?.slice(0, 4) || [];
  const bestItems = homeProducts?.bestSelling?.slice(0, 4) || [];

  const bestSellingItems = topProducts?.bestSelling || [];
  const mostViewedItems = topProducts?.mostViewed || [];
  const bestTotalPages = Math.ceil(bestSellingItems.length / TOP_PER_PAGE) || 1;
  const viewTotalPages = Math.ceil(mostViewedItems.length / TOP_PER_PAGE) || 1;
  const pagedBest = bestSellingItems.slice(bestPage * TOP_PER_PAGE, bestPage * TOP_PER_PAGE + TOP_PER_PAGE);
  const pagedViewed = mostViewedItems.slice(viewPage * TOP_PER_PAGE, viewPage * TOP_PER_PAGE + TOP_PER_PAGE);
  const categoryCards = (categories || []).slice(0, 6);

  const scrollCarousel = (ref, direction = 1) => {
    if (!ref?.current) return;
    ref.current.scrollBy({ left: direction * 320, behavior: 'smooth' });
  };

  return (
    <Layout>
      <div style={{ backgroundColor: '#fff' }}>

        {/* ── Hero Banner ── */}
        <div
          style={{
            backgroundImage: 'linear-gradient(to right, rgba(0,0,0,0.7) 40%, rgba(0,0,0,0.2)), url(https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1600&q=80)',
            backgroundSize: 'cover',
            backgroundPosition: 'center top',
            minHeight: '480px',
          }}
          className="d-flex align-items-center"
        >
          <div className="container-xl px-4 py-5">
            <div style={{ maxWidth: '520px' }}>
              <span className="text-white opacity-75 text-uppercase fw-bold mb-3 d-block" style={{ fontSize: '11px', letterSpacing: '3px' }}>
                NEW SEASON — SS 2025
              </span>
              <h1 className="text-white fw-bold mb-4" style={{ fontSize: 'clamp(32px, 5vw, 52px)', lineHeight: '1.1', fontFamily: 'Georgia, serif' }}>
                Elevate Your<br />Style Standard
              </h1>
              <p className="text-white opacity-75 mb-4" style={{ fontSize: '15px', lineHeight: '1.7', maxWidth: '400px' }}>
                Discover the Modern Elegance collection — curated fashion pieces designed for the modern individual, engineered for premium comfort and style.
              </p>
              <div className="d-flex gap-3 flex-wrap">
                <Link to="/search" className="btn text-white fw-semibold px-4 py-2 rounded-2 d-flex align-items-center gap-2"
                  style={{ backgroundColor: '#111', fontSize: '14px' }}>
                  Shop Now <ArrowRight size={16} />
                </Link>
                <Link to="/search?sort=newest" className="btn fw-semibold px-4 py-2 rounded-2"
                  style={{ backgroundColor: 'rgba(255,255,255,0.15)', color: '#fff', border: '1px solid rgba(255,255,255,0.4)', fontSize: '14px', backdropFilter: 'blur(4px)' }}>
                  New Arrivals
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* ── Features strip ── */}
        <div style={{ backgroundColor: '#111' }}>
          <div className="container-xl px-4">
            <div className="row g-0">
              {[
                { icon: <Truck size={18} />, title: 'Free Shipping', sub: 'On orders over $100' },
                { icon: <RotateCcw size={18} />, title: '30-Day Returns', sub: 'Hassle-free guarantee' },
                { icon: <ShieldCheck size={18} />, title: 'Authenticity', sub: 'All items verified' },
              ].map((f, i) => (
                <div key={i} className="col-md-4 d-flex align-items-center gap-3 py-3 px-4 border-end border-secondary" style={{ borderColor: '#333 !important' }}>
                  <span className="text-white opacity-50">{f.icon}</span>
                  <div>
                    <p className="text-white fw-bold mb-0" style={{ fontSize: '13px' }}>{f.title}</p>
                    <p className="text-white opacity-50 mb-0" style={{ fontSize: '11px' }}>{f.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Main content ── */}
        <div className="container-xl px-4 py-5">

          {/* Hot Promotions */}
          <div className="mb-5">
            <SectionHeader title="Hot Promotions" icon linkTo="/search?promo=true" />
            {isLoading ? (
              <div className="text-center py-5"><div className="spinner-border" role="status"></div></div>
            ) : (
              <div className="row g-3">
                {promoItems.map((p, i) => (
                  <ProductCard
                    key={p._id || i}
                    id={p._id}
                    name={p.name}
                    category={p.category?.name}
                    price={p.base_price || p.price}
                    oldPrice={p.base_price ? p.base_price * 1.35 : p.oldPrice}
                    badge={p.badge || ['35% OFF','30% OFF','SALE','HOT'][i % 4]}
                    badgeColor={['#e11d48','#e11d48','#f59e0b','#7c3aed'][i % 4]}
                    img={p.media?.[0]?.media_url}
                    sold={p.sold_quantity || p.sold}
                    navigate={navigate}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Category Quick Links */}
          <div className="mb-5 py-4 rounded-3" style={{ backgroundColor: '#f9f9f9' }}>
            <h2 className="fw-bold text-dark text-center mb-4" style={{ fontSize: '18px' }}>Shop by Category</h2>
            <div className="row g-3 px-3">
              {categoryCards.map(cat => (
                <div key={cat._id} className="col-4 col-md-2">
                  <Link to={`/search?category=${cat.slug}`} className="text-decoration-none">
                    <div className="rounded-3 overflow-hidden mb-2" style={{ aspectRatio: '1/1', backgroundColor: '#eee' }}>
                      <img src="https://placehold.co/400x400?text=UTE" className="w-100 h-100" style={{ objectFit: 'cover' }} alt={cat.name} />
                    </div>
                    <p className="text-dark fw-medium text-center mb-0" style={{ fontSize: '12px' }}>{cat.name}</p>
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* New Arrivals */}
          <div className="mb-5">
            <SectionHeader title="New Arrivals" icon linkTo="/search?sort=newest" />
            <div className="row g-3">
              {newItems.map((p, i) => (
                <ProductCard
                  key={p._id || i}
                  id={p._id}
                  name={p.name}
                  category={p.category?.name}
                  price={p.base_price || p.price}
                  img={p.media?.[0]?.media_url}
                  sold={p.sold_quantity || p.sold}
                  navigate={navigate}
                />
              ))}
            </div>
          </div>

          {/* Banner mid-page */}
          <div
            className="rounded-4 overflow-hidden mb-5 d-flex align-items-center"
            style={{
              backgroundImage: 'linear-gradient(to right, rgba(0,0,0,0.65) 50%, rgba(0,0,0,0.1)), url(https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1400&q=80)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              minHeight: '280px',
            }}
          >
            <div className="p-5">
              <p className="text-white opacity-75 text-uppercase fw-bold mb-2" style={{ fontSize: '10px', letterSpacing: '2px' }}>LIMITED OFFER</p>
              <h2 className="text-white fw-bold mb-3" style={{ fontSize: '28px', fontFamily: 'Georgia, serif' }}>
                Up to 40% off<br />Selected Styles
              </h2>
              <Link to="/search?promo=true" className="btn text-dark fw-semibold px-4 py-2 rounded-2"
                style={{ backgroundColor: '#fff', fontSize: '13px' }}>
                Shop the Sale
              </Link>
            </div>
          </div>

          {/* Best Sellers */}
          <div className="mb-5">
            <SectionHeader title="Best Sellers" icon linkTo="/search?sort=best_selling" />
            <div className="row g-3">
              {bestItems.map((p, i) => (
                <ProductCard
                  key={p._id || i}
                  id={p._id}
                  name={p.name}
                  category={p.category?.name}
                  price={p.base_price || p.price}
                  img={p.media?.[0]?.media_url}
                  sold={p.sold_quantity || p.sold}
                  navigate={navigate}
                />
              ))}
            </div>
          </div>

          {/* Top 10 Best Selling */}
          <div className="mb-5">
            <SectionHeader title="Top 10 Best Selling" icon linkTo="/search?sort=best_selling" />
            <div className="d-flex justify-content-between align-items-center mb-3">
              <span className="text-muted" style={{ fontSize: '12px' }}>Page {bestPage + 1} / {bestTotalPages}</span>
              <div className="d-flex gap-2">
                <button
                  className="btn btn-outline-secondary btn-sm rounded-2"
                  disabled={bestPage === 0}
                  onClick={() => { setBestPage(p => Math.max(p - 1, 0)); scrollCarousel(bestRef, -1); }}
                >
                  Prev
                </button>
                <button
                  className="btn btn-outline-secondary btn-sm rounded-2"
                  disabled={bestPage >= bestTotalPages - 1}
                  onClick={() => { setBestPage(p => Math.min(p + 1, bestTotalPages - 1)); scrollCarousel(bestRef, 1); }}
                >
                  Next
                </button>
              </div>
            </div>
            <div
              ref={bestRef}
              className="d-flex gap-3 overflow-auto pb-2"
              style={{ scrollSnapType: 'x mandatory' }}
            >
              {pagedBest.map((p, i) => (
                <div key={p._id || i} style={{ minWidth: '260px', scrollSnapAlign: 'start' }}>
                  <ProductCard
                    id={p._id}
                    name={p.name}
                    category={p.category?.name}
                    price={p.base_price}
                    img={p.media?.[0]?.media_url}
                    sold={p.sold_quantity}
                    navigate={navigate}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Top 10 Most Viewed */}
          <div className="mb-5">
            <SectionHeader title="Top 10 Most Viewed" icon linkTo="/search?sort=most_viewed" />
            <div className="d-flex justify-content-between align-items-center mb-3">
              <span className="text-muted" style={{ fontSize: '12px' }}>Page {viewPage + 1} / {viewTotalPages}</span>
              <div className="d-flex gap-2">
                <button
                  className="btn btn-outline-secondary btn-sm rounded-2"
                  disabled={viewPage === 0}
                  onClick={() => { setViewPage(p => Math.max(p - 1, 0)); scrollCarousel(viewRef, -1); }}
                >
                  Prev
                </button>
                <button
                  className="btn btn-outline-secondary btn-sm rounded-2"
                  disabled={viewPage >= viewTotalPages - 1}
                  onClick={() => { setViewPage(p => Math.min(p + 1, viewTotalPages - 1)); scrollCarousel(viewRef, 1); }}
                >
                  Next
                </button>
              </div>
            </div>
            <div
              ref={viewRef}
              className="d-flex gap-3 overflow-auto pb-2"
              style={{ scrollSnapType: 'x mandatory' }}
            >
              {pagedViewed.map((p, i) => (
                <div key={p._id || i} style={{ minWidth: '260px', scrollSnapAlign: 'start' }}>
                  <ProductCard
                    id={p._id}
                    name={p.name}
                    category={p.category?.name}
                    price={p.base_price}
                    img={p.media?.[0]?.media_url}
                    sold={p.sold_quantity}
                    navigate={navigate}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Newsletter */}
          <div className="rounded-4 text-center py-5 px-4" style={{ backgroundColor: '#111' }}>
            <p className="text-white opacity-50 text-uppercase fw-bold mb-2" style={{ fontSize: '10px', letterSpacing: '2px' }}>EXCLUSIVE MEMBER ACCESS</p>
            <h2 className="text-white fw-bold mb-2" style={{ fontSize: '26px', fontFamily: 'Georgia, serif' }}>Stay ahead of the curve.</h2>
            <p className="opacity-50 mb-4 mx-auto" style={{ color: '#fff', fontSize: '14px', maxWidth: '400px' }}>
              Join 50,000+ fashion enthusiasts. Get first access to drops, styling tips, and VIP pricing.
            </p>
            <div className="d-flex justify-content-center gap-2 mx-auto" style={{ maxWidth: '380px' }}>
              <input
                type="email"
                className="form-control rounded-2 border-0"
                placeholder="Your email address"
                style={{ backgroundColor: 'rgba(255,255,255,0.1)', color: '#fff', fontSize: '14px' }}
              />
              <button className="btn fw-bold rounded-2 px-4 text-dark" style={{ backgroundColor: '#fff', fontSize: '13px', whiteSpace: 'nowrap' }}>
                Subscribe
              </button>
            </div>
            <p className="opacity-25 mt-3 mb-0 text-white" style={{ fontSize: '10px', letterSpacing: '1px' }}>NO SPAM. UNSUBSCRIBE ANYTIME.</p>
          </div>

        </div>
      </div>
    </Layout>
  );
};

export default Home;
