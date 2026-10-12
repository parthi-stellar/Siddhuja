import { useEffect, useMemo, useState } from 'react'

type Product = {
  id: string
  name: string
  category: string
  tag: string
  image: string
  imageAlt: string
  detail: string
}

const products: Product[] = [
  {
    id: 'sj306',
    name: 'SJ306b-W 6-Row Rice Transplanter',
    category: 'Paddy planting',
    tag: 'SIDDHUJA FEATURED',
    image: 'https://images.livemint.com/rf/Image-621x414/LiveMint/Period2/2016/06/02/Photos/Processed/paddy-kd7F--621x414%40LiveMint.jpg',
    imageAlt: 'Rice transplanter working in a lush paddy field',
    detail: 'Precision planting · Built for paddy fields',
  },
  {
    id: 'walk-transplanter',
    name: 'Hydraulic Walk Paddy Transplanter',
    category: 'Paddy planting',
    tag: 'FARM FAVOURITE',
    image: 'https://www.kubota.com.mm/en/products/transplanter/spv6cmd/images/img_hero.png',
    imageAlt: 'Agricultural rice transplanter machine',
    detail: 'Diesel engine · 5-row capacity',
  },
  {
    id: 'sprayer',
    name: 'Battery Crop Sprayer',
    category: 'Crop care',
    tag: 'CROP CARE',
    image: 'https://pre-live-admin.balwaan.com/uploads/media/2025/5.webp',
    imageAlt: 'Portable battery-powered agricultural sprayer',
    detail: 'Comfortable carry · Reliable field coverage',
  },
  {
    id: 'drip-pipe',
    name: '16 mm Drip Irrigation Pipe',
    category: 'Irrigation',
    tag: 'WATER SMART',
    image: 'https://5.imimg.com/data5/RW/NY/YC/SELLER-2104660/drip-irrigation-pipes-500x500.jpg',
    imageAlt: 'Coil of black drip irrigation pipe',
    detail: 'Flexible LDPE · Efficient water delivery',
  },
  {
    id: 'plough',
    name: 'Tractor Agriculture Plough',
    category: 'Soil preparation',
    tag: 'FIELD READY',
    image: 'https://www.fieldkingusa.com/images/products/whole-goods/tiller/regular-series-single-speed-tiller/regular-series-single-speed-tiller.png',
    imageAlt: 'Heavy-duty tractor-mounted soil preparation implement',
    detail: 'Durable steel build · For tough soil',
  },
]

const categories = [
  { name: 'All equipment', symbol: '✳', count: 'Explore all' },
  { name: 'Paddy planting', symbol: '⌁', count: 'Transplanters' },
  { name: 'Soil preparation', symbol: '▤', count: 'Ploughs & tillers' },
  { name: 'Crop care', symbol: '♧', count: 'Sprayers & more' },
  { name: 'Irrigation', symbol: '◉', count: 'Pipes & fittings' },
]

const slides = [
  {
    eyebrow: 'MADE FOR THE PADDY FIELD',
    title: <>Plant with<br />precision.<br /><em>Grow with confidence.</em></>,
    copy: 'Meet the Siddhuja SJ306b-W 6-row rice transplanter. Less time in the field, more time for what matters.',
    button: 'Explore transplanters',
    image: 'https://images.livemint.com/rf/Image-621x414/LiveMint/Period2/2016/06/02/Photos/Processed/paddy-kd7F--621x414%40LiveMint.jpg',
    alt: 'Mechanized rice transplanting in a green paddy field',
    badge: 'SIDDHUJA SIGNATURE',
  },
  {
    eyebrow: 'THE RIGHT TOOL FOR EVERY ACRE',
    title: <>Work smarter.<br /><em>Farm stronger.</em></>,
    copy: 'From soil preparation to crop care, find dependable equipment selected for real farm conditions.',
    button: 'Browse all equipment',
    image: 'https://www.fieldkingusa.com/images/products/whole-goods/tiller/regular-series-single-speed-tiller/regular-series-single-speed-tiller.png',
    alt: 'Heavy-duty rotary tiller ready for field work',
    badge: 'BUILT FOR THE FIELD',
  },
  {
    eyebrow: 'A BETTER WAY TO WATER',
    title: <>Every drop<br /><em>goes further.</em></>,
    copy: 'Explore practical irrigation essentials designed to bring water closer to the roots that need it.',
    button: 'Explore irrigation',
    image: 'https://5.imimg.com/data5/RW/NY/YC/SELLER-2104660/drip-irrigation-pipes-500x500.jpg',
    alt: 'Drip irrigation pipe coil for efficient farm watering',
    badge: 'GROW WITH CARE',
  },
]

function App() {
  const [signedIn, setSignedIn] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const [activeSlide, setActiveSlide] = useState(0)
  const [activeCategory, setActiveCategory] = useState('All equipment')
  const [search, setSearch] = useState('')
  const [enquiryList, setEnquiryList] = useState<string[]>([])
  const [favorites, setFavorites] = useState<string[]>([])

  useEffect(() => {
    if (!signedIn) return
    const timer = window.setInterval(() => setActiveSlide((slide) => (slide + 1) % slides.length), 6500)
    return () => window.clearInterval(timer)
  }, [signedIn])

  const filteredProducts = useMemo(() => products.filter((product) => {
    const matchesCategory = activeCategory === 'All equipment' || product.category === activeCategory
    const matchesSearch = `${product.name} ${product.category} ${product.detail}`.toLowerCase().includes(search.trim().toLowerCase())
    return matchesCategory && matchesSearch
  }), [activeCategory, search])

  async function signIn(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setBusy(true)

    try {
      const apiBase = import.meta.env.VITE_API_BASE_URL ?? ''
      const response = await fetch(`${apiBase}/user-login-controller/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ username, password }),
      })
      if (response.status === 401) throw new Error('Username or password is incorrect.')
      if (!response.ok) throw new Error(`The sign-in service returned an error (${response.status}). Try again.`)
      setSignedIn(true)
      setPassword('')
    } catch (cause) {
      setError(cause instanceof TypeError
        ? 'Could not connect to the sign-in service. Check that the laptop and phone are on the same Wi-Fi and that the backend is running.'
        : cause instanceof Error ? cause.message : 'Sign in failed. Try again.')
    } finally {
      setBusy(false)
    }
  }

  if (!signedIn) {
    return (
      <main className="login-page">
        <section className="login-card">
          <a className="brand login-brand" href="#home"><span className="brand-mark">✳</span><span>siddhuja<span className="brand-period">.</span></span></a>
          <h1>Welcome back</h1>
          <p className="login-subtitle">Sign in to discover dependable equipment for your farm.</p>
          <form className="login-form" onSubmit={signIn}>
            <label htmlFor="username">Username</label>
            <input id="username" name="username" autoComplete="username" value={username} onChange={(event) => setUsername(event.target.value)} required />
            <label htmlFor="password">Password</label>
            <input id="password" name="password" type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} required />
            {error && <p className="login-error" role="alert">{error}</p>}
            <button className="login-submit" type="submit" disabled={busy}>{busy ? 'Signing in…' : 'Sign in'}<span aria-hidden="true">→</span></button>
          </form>
          <p className="login-assist">Need help choosing equipment? <a href="tel:+919943267756">Talk to our team</a></p>
        </section>
      </main>
    )
  }

  const slide = slides[activeSlide]

  function chooseSlide(index: number) {
    setActiveSlide(index)
    if (index === 0) setActiveCategory('Paddy planting')
    else if (index === 1) setActiveCategory('All equipment')
    else setActiveCategory('Irrigation')
    document.getElementById('equipment')?.scrollIntoView({ behavior: 'smooth' })
  }

  function toggleEnquiry(id: string) {
    setEnquiryList((items) => items.includes(id) ? items.filter((item) => item !== id) : [...items, id])
  }

  function toggleFavorite(id: string) {
    setFavorites((items) => items.includes(id) ? items.filter((item) => item !== id) : [...items, id])
  }

  return (
    <main className="storefront" id="home">
      <div className="announcement"><span className="announcement-spark">✳</span> Equipment that works as hard as you do <span className="announcement-divider">·</span> <a href="tel:+919943267756">Speak to a farm specialist <span>↗</span></a></div>
      <header className="site-header">
        <a className="brand" href="#home" aria-label="Siddhuja home"><span className="brand-mark">✳</span><span>siddhuja<span className="brand-period">.</span></span></a>
        <label className="site-search"><span aria-hidden="true">⌕</span><input value={search} onChange={(event) => { setSearch(event.target.value); document.getElementById('equipment')?.scrollIntoView({ behavior: 'smooth' }) }} placeholder="Search transplanters, sprayers, irrigation…" aria-label="Search farm equipment" /><kbd>⌘ K</kbd></label>
        <div className="header-actions"><a className="support-link" href="tel:+919943267756"><span className="support-icon">◌</span><span><small>Need help?</small><strong>Talk to an expert</strong></span></a><button className="enquiry-button" onClick={() => document.getElementById('equipment')?.scrollIntoView({ behavior: 'smooth' })} aria-label={`Enquiry list, ${enquiryList.length} items`}><span className="bag-icon">▱</span><span className="enquiry-label">Enquiry list</span><b>{enquiryList.length}</b></button></div>
      </header>

      <nav className="category-nav" aria-label="Product categories"><div className="category-nav-inner"><span className="nav-caption">SHOP BY</span>{categories.map((category) => <button key={category.name} className={activeCategory === category.name ? 'nav-category active' : 'nav-category'} onClick={() => { setActiveCategory(category.name); document.getElementById('equipment')?.scrollIntoView({ behavior: 'smooth' }) }}>{category.name}</button>)}<a className="nav-special" href="tel:+919943267756">Subsidy assistance <span>↗</span></a></div></nav>

      <div className="store-content">
        <section className="hero" aria-label="Featured equipment">
          <div className="hero-copy"><div className="hero-eyebrow"><span className="eyebrow-line"/>{slide.eyebrow}</div><h1>{slide.title}</h1><p>{slide.copy}</p><button className="hero-cta" onClick={() => chooseSlide(activeSlide)}>{slide.button}<span>↗</span></button><div className="hero-controls"><div className="hero-dots" aria-label="Choose featured slide">{slides.map((item, index) => <button key={item.eyebrow} onClick={() => setActiveSlide(index)} className={activeSlide === index ? 'hero-dot active' : 'hero-dot'} aria-label={`Show slide ${index + 1}`} />)}</div><span className="hero-count">0{activeSlide + 1}<i/>0{slides.length}</span><div className="hero-arrows"><button aria-label="Previous slide" onClick={() => setActiveSlide((activeSlide + slides.length - 1) % slides.length)}>←</button><button aria-label="Next slide" onClick={() => setActiveSlide((activeSlide + 1) % slides.length)}>→</button></div></div></div>
          <div className="hero-visual"><img key={slide.image} src={slide.image} alt={slide.alt} /><div className="hero-image-shade"/><div className="hero-image-tag"><span>✳</span>{slide.badge}</div><div className="hero-product-note"><span className="note-kicker">FEATURED EQUIPMENT</span><strong>{activeSlide === 0 ? 'SJ306b-W' : activeSlide === 1 ? 'Field-ready tools' : 'Smart irrigation'}</strong><span>{activeSlide === 0 ? '6-row rice transplanter' : activeSlide === 1 ? 'Reliable machinery for every acre' : 'Make water work harder'}</span></div><div className="hero-visual-index">SIDDHUJA&nbsp; / &nbsp;SINCE 2020</div></div>
          <div className="hero-side-label">GROWING WITH YOU SINCE 2020</div>
        </section>

        <section className="trust-strip" aria-label="Why shop Siddhuja"><div><span className="trust-icon">✳</span><span><strong>Field-tested equipment</strong><small>Selected for Indian farms</small></span></div><i/><div><span className="trust-icon">↗</span><span><strong>Guidance that helps</strong><small>Talk to a real specialist</small></span></div><i/><div><span className="trust-icon">⌂</span><span><strong>Support after purchase</strong><small>Genuine spares & assistance</small></span></div><i/><div><span className="trust-icon">◎</span><span><strong>Subsidy guidance</strong><small>Know your options</small></span></div></section>

        <section className="category-section" aria-labelledby="category-title"><div className="section-heading compact-heading"><div><span className="section-kicker">FIND YOUR FIT</span><h2 id="category-title">What does your farm need?</h2></div><button className="text-link" onClick={() => { setActiveCategory('All equipment'); document.getElementById('equipment')?.scrollIntoView({ behavior: 'smooth' }) }}>View all equipment <span>→</span></button></div><div className="category-cards">{categories.slice(1).map((category, index) => <button key={category.name} className={`category-card category-card-${index}`} onClick={() => { setActiveCategory(category.name); document.getElementById('equipment')?.scrollIntoView({ behavior: 'smooth' }) }}><span className="category-symbol">{category.symbol}</span><span className="category-card-copy"><strong>{category.name}</strong><small>{category.count}</small></span><span className="category-arrow">↗</span></button>)}</div></section>

        <section className="products-section" id="equipment" aria-labelledby="products-title"><div className="section-heading product-heading"><div><span className="section-kicker">CURATED FOR YOUR FIELDS</span><h2 id="products-title">Equipment worth knowing</h2><p>Practical machines. Thoughtful support. Better days in the field.</p></div><div className="product-tools"><label className="mobile-search"><span>⌕</span><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search equipment" /></label><button className="filter-button" onClick={() => setActiveCategory('All equipment')}>All equipment <span>⌄</span></button></div></div><div className="active-filters">{activeCategory !== 'All equipment' && <button onClick={() => setActiveCategory('All equipment')}>{activeCategory}<span> ×</span></button>}{search && <button onClick={() => setSearch('')}>“{search}”<span> ×</span></button>}{filteredProducts.length > 0 && <span>{filteredProducts.length} thoughtfully selected {filteredProducts.length === 1 ? 'product' : 'products'}</span>}</div>
          {filteredProducts.length ? <div className="product-grid">{filteredProducts.map((product, index) => <article className="product-card" key={product.id}><div className={`product-image product-image-${index}`}><img src={product.image} alt={product.imageAlt} loading="lazy"/><span className="product-tag">{product.tag}</span><button className={favorites.includes(product.id) ? 'favorite-button favorited' : 'favorite-button'} aria-label={favorites.includes(product.id) ? 'Remove from saved items' : 'Save item'} onClick={() => toggleFavorite(product.id)}>{favorites.includes(product.id) ? '♥' : '♡'}</button><button className="quick-view" onClick={() => toggleEnquiry(product.id)}>Quick add <span>+</span></button></div><div className="product-info"><span className="product-category">{product.category}</span><h3>{product.name}</h3><p>{product.detail}</p><div className="product-bottom"><span className="price-request">Price on request</span><button onClick={() => toggleEnquiry(product.id)} className={enquiryList.includes(product.id) ? 'add-enquiry added' : 'add-enquiry'} aria-label={enquiryList.includes(product.id) ? 'Remove from enquiry list' : 'Add to enquiry list'}>{enquiryList.includes(product.id) ? '✓' : '+'}</button></div></div></article>)}</div> : <div className="no-results"><span>⌕</span><strong>No equipment found</strong><p>Try another search or browse all equipment.</p><button onClick={() => { setSearch(''); setActiveCategory('All equipment') }}>Show all equipment</button></div>}
          <div className="catalog-note"><span>✳</span><p>Looking for something specific? <a href="tel:+919943267756">Our team can help you find it.</a></p></div>
        </section>

        <section className="help-banner"><div className="help-mark">✳</div><div><span className="section-kicker">A GOOD CHOICE STARTS WITH A CONVERSATION</span><h2>Not sure what your farm needs?</h2><p>Tell us about your crops and acreage. We’ll help you find the right fit.</p></div><a href="tel:+919943267756">Talk to Siddhuja <span>↗</span></a></section>
        <footer className="store-footer"><a className="brand footer-brand" href="#home"><span className="brand-mark">✳</span><span>siddhuja<span className="brand-period">.</span></span></a><span>Thoughtful equipment for the people who grow our world.</span><a href="tel:+919943267756">+91 99432 67756</a><small>© {new Date().getFullYear()} Siddhuja Agri Industries · Ranipet, Tamil Nadu</small></footer>
      </div>
      {enquiryList.length > 0 && <button className="enquiry-float" onClick={() => document.getElementById('equipment')?.scrollIntoView({ behavior: 'smooth' })}><span>▱</span><span>{enquiryList.length} {enquiryList.length === 1 ? 'item' : 'items'} in your enquiry list</span><strong>Review list →</strong></button>}
    </main>
  )
}

export default App
