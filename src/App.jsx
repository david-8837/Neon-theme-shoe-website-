import React, { useState, useEffect, useRef } from 'react';
import { Menu, X, Facebook, Instagram, Linkedin, ShoppingCart, Trash2, Plus, Minus, Search, User, Star, ArrowLeft, MessageCircle, Heart, Check, ChevronDown, Info, Eye, ShieldCheck, Truck, RefreshCw } from 'lucide-react';

// --- Animations & Effects Components ---

const LiquidCursor = () => {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [trail, setTrail] = useState(new Array(20).fill({ x: -100, y: -100 }));
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);

  useEffect(() => {
    const move = (e) => setPos({ x: e.clientX, y: e.clientY });
    
    const handleMouseOver = (e) => {
      const target = e.target;
      if (target.tagName.toLowerCase() === 'a' || target.tagName.toLowerCase() === 'button' || target.closest('button') || target.closest('a') || target.closest('input')) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    window.addEventListener('mousemove', move);
    window.addEventListener('mouseover', handleMouseOver);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseover', handleMouseOver);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  useEffect(() => {
    let animationFrameId;
    const updateTrail = () => {
      setTrail((prevTrail) => {
        const newTrail = [...prevTrail];
        newTrail[0] = pos;
        for (let i = 1; i < newTrail.length; i++) {
          newTrail[i] = {
            x: newTrail[i].x + (newTrail[i - 1].x - newTrail[i].x) * 0.3,
            y: newTrail[i].y + (newTrail[i - 1].y - newTrail[i].y) * 0.3,
          };
        }
        return newTrail;
      });
      animationFrameId = requestAnimationFrame(updateTrail);
    };
    animationFrameId = requestAnimationFrame(updateTrail);
    return () => cancelAnimationFrame(animationFrameId);
  }, [pos]);

  const baseSize = 18; 

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999]">
      {trail.map((point, i) => (
        <div
          key={i}
          className={`fixed top-0 left-0 rounded-full transition-transform duration-75 ease-out
            ${i === 0 ? (isHovering ? 'bg-white scale-[1.8] mix-blend-difference' : 'bg-pink-500 shadow-[0_0_20px_#ec4899]') : 'bg-pink-400/40'}
            ${isClicking && i === 0 ? 'scale-75' : ''}
          `}
          style={{
            transform: `translate(${point.x}px, ${point.y}px) translate(-50%, -50%)`,
            width: i === 0 ? `${baseSize}px` : `${Math.max(2, baseSize - (i * 1.5))}px`,
            height: i === 0 ? `${baseSize}px` : `${Math.max(2, baseSize - (i * 1.5))}px`,
            opacity: 1 - i / trail.length,
            filter: i === 0 ? 'none' : `blur(${i * 0.3}px)`,
          }}
        />
      ))}
    </div>
  );
};

const IntroLoader = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const int = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(int);
          setTimeout(() => setIsVisible(false), 400);
          setTimeout(onComplete, 1200);
          return 100;
        }
        return p + Math.floor(Math.random() * 10) + 2; 
      });
    }, 100);
    return () => clearInterval(int);
  }, [onComplete]);

  if (!isVisible && progress === 100) return null;

  return (
    <div className={`fixed inset-0 z-[10000] bg-[#10061c] flex flex-col items-center justify-center transition-opacity duration-700 ease-in-out ${progress >= 100 ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
      <div className="relative flex items-center justify-center w-32 h-32 mb-8 animate-[pulse_2s_ease-in-out_infinite]">
        <svg viewBox="0 0 100 100" className="w-full h-full text-white fill-current drop-shadow-[0_0_20px_rgba(236,72,153,0.5)]">
           <path d="M 30 70 C 10 70 10 30 30 30 C 50 30 50 50 70 50 C 90 50 90 90 70 90 C 50 90 50 70 30 70 Z" fill="#ffffff" opacity="0.1"/>
           <path d="M 20 60 C 0 60 0 20 20 20 C 40 20 40 40 60 40 C 80 40 80 80 60 80 C 40 80 40 60 20 60 Z" fill="#ffffff" opacity="0.9"/>
        </svg>
      </div>
      <h2 className="font-display text-4xl text-white tracking-widest mb-8 drop-shadow-lg text-center leading-tight uppercase">DEMO</h2>
      <div className="w-64 h-3 bg-[#2b114d] rounded-full overflow-hidden shadow-inner relative">
        <div className="absolute top-0 left-0 h-full bg-gradient-to-r from-pink-600 to-purple-400 transition-all duration-100 ease-out" style={{ width: `${progress}%` }} />
        <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.4)_50%,transparent_100%)] animate-[shine_2s_infinite] -translate-x-full" />
      </div>
      <p className="mt-4 text-pink-300 font-display tracking-widest text-sm">{progress}%</p>
    </div>
  );
};

const TiltWrapper = ({ children, className = "" }) => {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    setTilt({ x: ((y - centerY) / centerY) * -15, y: ((x - centerX) / centerX) * 15 });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => { setIsHovered(false); setTilt({ x: 0, y: 0 }); }}
      className={`relative transition-transform duration-200 ease-out will-change-transform ${className}`}
      style={{
        transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale3d(${isHovered ? 1.02 : 1}, ${isHovered ? 1.02 : 1}, 1)`,
        transformStyle: "preserve-3d"
      }}
    >
      <div 
        className="absolute inset-0 z-50 rounded-[2.5rem] pointer-events-none transition-opacity duration-300"
        style={{
          background: `radial-gradient(circle at ${tilt.y * 10 + 50}% ${tilt.x * -10 + 50}%, rgba(255,255,255,0.15) 0%, transparent 60%)`,
          opacity: isHovered ? 1 : 0
        }}
      />
      <div style={{ transform: isHovered ? "translateZ(20px)" : "translateZ(0)", transition: "transform 0.3s ease-out" }} className="w-full h-full">
        {children}
      </div>
    </div>
  );
};

// --- Mock Data ---

const products = [
  {
    id: 1, name: "Neon Phantom X", price: 250, brand: "DEMO Elite",
    image: "https://images.unsplash.com/photo-1605348532760-6753d2c43329?q=80&w=1000&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1605348532760-6753d2c43329?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1515955656352-a1fa3ffcd111?q=80&w=2070&auto=format&fit=crop"
    ],
    badge: "GRAIL", color: "from-[#1a0b2e] to-black", category: "High-Tops",
    sizes: [7, 8, 9, 10, 11], colors: ["Shadow Red/Black"],
    description: "Forged in the darkest depths. These limited-edition kicks feature premium shadow leather, neon glowing accents, and unparalleled comfort for ruling the streets.",
    highlights: ["Premium shadow leather", "Neon reflective accents", "Anti-slip sole", "Breathable mesh tongue"],
    stockLabel: "Ultra Limited Stock",
    blendMode: ""
  },
  {
    id: 2, name: "Ocean High-Tops", price: 95, brand: "DEMO",
    image: "https://images.unsplash.com/photo-1515955656352-a1fa3ffcd111?q=80&w=2070&auto=format&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1515955656352-a1fa3ffcd111?q=80&w=2070&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=2070&auto=format&fit=crop"
    ],
    badge: "SALE", color: "from-blue-600 to-indigo-800", category: "High-Tops",
    sizes: [8, 9, 10, 11, 12], colors: ["Deep Sea Blue", "Coral White"],
    description: "Classic high-top silhouette with a nautical twist. Canvas construction allows for flexibility when climbing the rigging or hitting the streets.",
    highlights: ["Durable canvas material", "Reinforced ankle support", "Rust-proof eyelets"],
    stockLabel: "Limited Stock remaining"
  },
  {
    id: 3, name: "Captain's Sneaks", price: 150, brand: "DEMO",
    image: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?q=80&w=1974&auto=format&fit=crop",
    images: ["https://images.unsplash.com/photo-1608231387042-66d1773070a5?q=80&w=1974&auto=format&fit=crop"],
    badge: "BESTSELLER", color: "from-orange-500 to-amber-700", category: "Casual",
    sizes: [7, 8, 9, 10], colors: ["Sunset Orange", "Treasure Gold"],
    description: "Premium casual sneakers reserved for the captain of the ship. Hand-stitched detailing and unparalleled comfort for long voyages.",
    highlights: ["Premium synthetic leather", "Memory foam insole", "Hand-stitched accents"],
    stockLabel: "In Stock - Ready to Sail"
  },
  {
    id: 4, name: "Abyssal Walkers", price: 180, brand: "Kraken Kicks",
    image: "https://images.unsplash.com/photo-1550399865-ec7d23b18e8e?q=80&w=2075&auto=format&fit=crop",
    images: ["https://images.unsplash.com/photo-1550399865-ec7d23b18e8e?q=80&w=2075&auto=format&fit=crop"],
    color: "from-purple-600 to-zinc-900", category: "Boots",
    sizes: [9, 10, 11, 12], colors: ["Void Purple"],
    description: "Heavy-duty boots designed for the uncharted depths. Waterproof, crush-resistant, and brutally stylish.",
    highlights: ["100% Waterproof", "Steel-toe protection", "Thermal lining"],
    stockLabel: "In Stock - Ready to Sail"
  },
  {
    id: 5, name: "Golden Doubloons", price: 110, brand: "DEMO",
    image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=1974&auto=format&fit=crop",
    images: ["https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=1974&auto=format&fit=crop"],
    color: "from-yellow-400 to-orange-600", category: "Running",
    sizes: [6, 7, 8, 9], colors: ["Gold/White"],
    description: "Lightweight, aerodynamic, and bright enough to blind your enemies. The Golden Doubloons keep you swift on your feet.",
    highlights: ["Ultra-lightweight", "Aerodynamic profile", "Spring-loaded heel"],
    stockLabel: "In Stock - Ready to Sail"
  },
  {
    id: 6, name: "Kraken Canvas", price: 85, brand: "Kraken Kicks",
    image: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?q=80&w=1998&auto=format&fit=crop",
    images: ["https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?q=80&w=1998&auto=format&fit=crop"],
    badge: "LIMITED", color: "from-emerald-500 to-teal-800", category: "Casual",
    sizes: [8, 9, 10, 11], colors: ["Seaweed Green", "Abyss Black"],
    description: "Everyday canvas sneakers featuring subtle, tentacle-inspired designs. Comfortable, casual, and perfect for shore leave.",
    highlights: ["Eco-friendly canvas", "Vulcanized rubber sole", "Low-profile fit"],
    stockLabel: "Limited Edition"
  }
];

// --- Components ---

const buyViaWhatsApp = (product, size, color) => {
  const text = `Ahoy! I want to order this booty from DEMO.\n\nProduct: ${product.name}\nSize: ${size}\nColor: ${color || 'Standard'}\nPrice: $${product.price}\n\nPlease confirm availability.`;
  window.open(`https://wa.me/1234567890?text=${encodeURIComponent(text)}`, '_blank');
};

const PromoMarquee = () => (
  <div className="bg-[#2b1842] border-y border-pink-500/30 py-5 overflow-hidden relative flex shadow-inner">
    <div className="absolute inset-0 bg-gradient-to-r from-[#1b0b2e] via-transparent to-[#1b0b2e] z-10 pointer-events-none"></div>
    <div className="flex w-max animate-[marquee_20s_linear_infinite] hover:[animation-play-state:paused] will-change-transform">
      {[...Array(2)].map((_, i) => (
        <div key={i} className="flex items-center gap-16 px-8">
          <span className="flex items-center gap-3 font-display text-pink-300 text-xl tracking-widest whitespace-nowrap"><Check size={24}/> ORIGINAL BOOTY 100%</span>
          <span className="flex items-center gap-3 font-display text-pink-300 text-xl tracking-widest whitespace-nowrap"><MessageCircle size={24}/> EASY WHATSAPP ORDER</span>
          <span className="flex items-center gap-3 font-display text-pink-300 text-xl tracking-widest whitespace-nowrap"><Star size={24}/> TRUSTED SELLERS</span>
          <span className="flex items-center gap-3 font-display text-pink-300 text-xl tracking-widest whitespace-nowrap"><Check size={24}/> FAST RESPONSE</span>
        </div>
      ))}
    </div>
  </div>
);

const ParallaxHero = ({ isLoaded, navigateTo }) => {
  const [scrollY, setScrollY] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [mousePx, setMousePx] = useState({ x: -1000, y: -1000 });
  const heroRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleMouseMove = (e) => {
    if (!heroRef.current) return;
    const rect = heroRef.current.getBoundingClientRect();
    setMousePx({ x: e.clientX, y: e.clientY });
    const x = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
    const y = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);
    setMousePos({ x, y });
  };

  return (
    <section 
      ref={heroRef}
      onMouseMove={handleMouseMove}
      className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden bg-[#05010a] z-10"
    >
      <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div 
          className="absolute top-[-10%] left-[-10%] w-[120%] h-[120%] bg-[radial-gradient(circle_at_center,rgba(69,16,107,0.35)_0%,transparent_75%)] blur-[100px] transition-transform duration-[2s] ease-out"
          style={{ transform: `translate3d(${mousePos.x * -20}px, ${mousePos.y * -20}px, 0)` }}
        ></div>

        <div 
          className="absolute top-[15%] -right-[15%] w-[110%] h-[70%] bg-[radial-gradient(ellipse_at_center,rgba(255,10,34,0.22)_0%,transparent_70%)] blur-[90px] rounded-[100%] transition-transform duration-[1.5s] ease-out mix-blend-screen"
          style={{ transform: `translate3d(${mousePos.x * 60}px, ${mousePos.y * 50}px, 0) rotate(-20deg)` }}
        ></div>

        <div 
          className="absolute bottom-[5%] -left-[20%] w-[100%] h-[60%] bg-[radial-gradient(ellipse_at_center,rgba(244,114,182,0.15)_0%,transparent_70%)] blur-[110px] rounded-[100%] transition-transform duration-[2.5s] ease-out"
          style={{ transform: `translate3d(${mousePos.x * -40}px, ${mousePos.y * -40}px, 0) rotate(15deg)` }}
        ></div>

        <div 
          className="absolute top-0 left-0 w-[750px] h-[750px] bg-[radial-gradient(circle,rgba(255,102,204,0.12)_0%,transparent_60%)] rounded-full mix-blend-screen transition-transform duration-100 ease-out"
          style={{ 
            left: `${mousePx.x}px`, 
            top: `${mousePx.y}px`,
            transform: 'translate(-50%, -50%)' 
          }}
        ></div>
      </div>
      
      <div className="absolute bottom-0 inset-x-0 h-1/2 bg-gradient-to-t from-[#1b0b2e] to-transparent z-10 pointer-events-none"></div>

      <div className={`relative z-20 max-w-6xl mx-auto px-6 w-full flex flex-col items-center justify-center text-center mt-12 transition-all duration-1000 delay-300 ${isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
        
        <div className="z-30 relative flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/40 border border-pink-500/40 text-pink-300 text-sm font-bold tracking-widest uppercase mb-10 backdrop-blur-md shadow-2xl">
            <span className="w-2.5 h-2.5 rounded-full bg-pink-500 animate-pulse shadow-[0_0_10px_#ec4899]"></span>
            EXCLUSIVE BOOTY DROP
          </div>
          
          <h1 className="text-[4.5rem] sm:text-[6.5rem] md:text-[8.5rem] lg:text-[11rem] font-display leading-[0.82] tracking-wide mb-10 cursor-pointer relative group" onClick={() => navigateTo('shop')}>
            <span className="block text-white/90 text-5xl md:text-7xl lg:text-9xl mb-2 drop-shadow-xl transition-transform group-hover:-translate-y-2">FORGED</span>
            <span className="block text-white/90 text-5xl md:text-7xl lg:text-9xl mb-4 drop-shadow-xl transition-transform group-hover:-translate-y-2 delay-75">FOR</span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff0a22] via-[#ff66cc] to-[#ff0a22] animate-pulse relative inline-block pb-4 drop-shadow-[0_15px_30px_rgba(255,10,34,0.4)] transition-transform group-hover:scale-105 group-hover:-translate-y-2 delay-150">
              LEGENDS
              <span className="absolute inset-0 bg-pink-600 blur-[60px] opacity-10 -z-10 group-hover:opacity-30 transition-opacity"></span>
            </span>
          </h1>

          <p className="text-lg md:text-2xl text-pink-100/80 font-medium max-w-3xl mx-auto mb-14 drop-shadow-lg leading-relaxed">
            Equip the finest streetwear booty on the seven seas. Unrivaled comfort and bold style crafted for yer next urban voyage.
          </p>
          
          <button onClick={() => navigateTo('shop')} className="btn-pirate bg-[#ff0a22] hover:bg-white hover:text-[#ff0a22] text-white font-display text-3xl tracking-widest px-14 py-6 transition-all duration-300 uppercase shadow-[0_8px_0_#a80010] hover:shadow-[0_2px_0_#a80010] hover:translate-y-[6px] active:translate-y-[8px] active:shadow-none">
            CLAIM YER BOOTY
          </button>
        </div>

      </div>
    </section>
  );
};

const ProductCard = ({ product, navigateTo, wishlist, toggleWishlist, addToCart }) => {
  const [selectedSize, setSelectedSize] = useState(null);
  const [error, setError] = useState(false);
  const isWishlisted = wishlist.includes(product.id);

  return (
    <TiltWrapper>
      <div className="bg-[#e9cbf0] p-3 rounded-[2.5rem] w-full shadow-[0_20px_50px_rgba(0,0,0,0.6)] group relative h-full flex flex-col cursor-pointer" onClick={() => navigateTo('product', product)}>
        <button 
          className="absolute top-4 left-4 z-20 w-10 h-10 bg-white/50 backdrop-blur rounded-full flex items-center justify-center hover:bg-white transition-colors"
          onClick={(e) => { e.stopPropagation(); toggleWishlist(product.id); }}
        >
          <Heart size={20} className={isWishlisted ? "fill-[#ff0a22] text-[#ff0a22]" : "text-[#2b1842]"} />
        </button>

        {product.badge && (
          <div className="absolute -top-4 -right-4 bg-[#ff0a22] text-white font-display px-4 py-2 rounded-xl z-20 shadow-lg transform rotate-12 group-hover:rotate-0 transition-transform tracking-wider border-2 border-[#e9cbf0]">
            {product.badge}
          </div>
        )}

        <div className={`w-full aspect-square bg-gradient-to-br ${product.color} rounded-[2rem] mb-4 flex items-center justify-center shadow-inner relative overflow-hidden`}>
          <img src={product.image} alt={product.name} className={`absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ${product.blendMode || ''}`} />
          <span className="text-6xl absolute opacity-30 animate-float drop-shadow-xl pointer-events-none">✨</span>
        </div>
        
        <div className="px-2 text-center pb-2 flex-grow flex flex-col justify-between" onClick={(e) => e.stopPropagation()}>
          <div>
            <div className="text-[#8a2bba] font-bold text-xs uppercase tracking-widest mb-1">{product.category}</div>
            <h3 className="text-[#2b1842] font-display text-2xl mb-1 leading-tight tracking-wide hover:text-pink-600 transition-colors cursor-pointer" onClick={() => navigateTo('product', product)}>
              {product.name}
            </h3>
            <p className="text-[#8a2bba] font-bold text-xl mb-3">${product.price}</p>
          </div>
          
          <div>
            <div className="mb-4">
              <p className={`text-xs font-bold mb-2 uppercase tracking-wider transition-colors ${error ? 'text-red-600 animate-pulse' : 'text-[#45106b]'}`}>
                {error ? 'Select a size!' : 'Quick Add Size'}
              </p>
              <div className="flex flex-wrap justify-center gap-1">
                {product.sizes.slice(0, 4).map(size => (
                  <button
                    key={size}
                    onClick={() => { setSelectedSize(size); setError(false); }}
                    className={`w-8 h-8 rounded-full font-bold text-sm transition-all duration-200 border-2 
                      ${selectedSize === size ? 'bg-[#8a2bba] text-white border-[#8a2bba] scale-110' : 'bg-white/50 text-[#2b1842] border-transparent hover:border-[#8a2bba]'}`}
                  >
                    {size}
                  </button>
                ))}
                {product.sizes.length > 4 && <span className="w-8 h-8 rounded-full bg-transparent flex items-center justify-center text-xs font-bold text-[#8a2bba]">+</span>}
              </div>
            </div>
            
            <button 
              onClick={() => {
                if(!selectedSize) { setError(true); setTimeout(() => setError(false), 2000); return; }
                addToCart(product, selectedSize, product.colors[0]);
                setSelectedSize(null);
              }}
              className={`w-full btn-pirate font-display text-lg tracking-wider py-3 transition-all duration-300 uppercase flex justify-center items-center gap-2
                ${error ? 'bg-red-600 text-white shadow-[0_4px_0_#990000]' : 'bg-[#2b1842] hover:bg-[#ff0a22] text-white shadow-[0_4px_0_#110a1a] hover:shadow-[0_2px_0_#a80010] hover:translate-y-[2px] active:translate-y-[4px] active:shadow-none'}`}
            >
              <ShoppingCart size={18} /> ADD
            </button>
          </div>
        </div>
      </div>
    </TiltWrapper>
  );
};

const HomeView = ({ isLoaded, navigateTo, wishlist, toggleWishlist, addToCart }) => (
  <>
    <ParallaxHero isLoaded={isLoaded} navigateTo={navigateTo} />
    <div className="wood-bg relative z-40 shadow-[0_-30px_60px_rgba(0,0,0,1)] pt-10 border-t-[12px] border-[#0a0312]">
      <PromoMarquee />

      <section className="py-24 px-6 md:px-16 max-w-7xl mx-auto border-b border-purple-900/40 relative">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div className="space-y-4">
            <h2 className="text-5xl md:text-6xl font-display text-[#e4c4fc] drop-shadow-md text-uppercase">FEATURED LOOT</h2>
            <p className="text-lg text-white/70 font-medium max-w-2xl">The most sought-after sneakers on the seven seas. Grab 'em before they sink.</p>
          </div>
          <button onClick={() => navigateTo('shop')} className="btn-pirate bg-[#2b1842] text-white hover:bg-pink-600 px-6 py-3 tracking-widest font-display text-lg uppercase transition-all shadow-[0_4px_0_#110a1a] hover:translate-y-[-2px]">
            VIEW ALL
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {products.slice(0, 3).map((product) => <ProductCard key={product.id} product={product} navigateTo={navigateTo} wishlist={wishlist} toggleWishlist={toggleWishlist} addToCart={addToCart} />)}
        </div>
      </section>

      <section className="py-16 px-6 max-w-7xl mx-auto">
        <div className="bg-gradient-to-r from-[#ff0a22] to-[#8a2bba] rounded-[3rem] p-10 md:p-16 flex flex-col md:flex-row items-center justify-between gap-10 relative overflow-hidden shadow-2xl border-2 border-pink-400/50">
          <div className="absolute top-0 right-0 w-full h-full bg-[url('https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&q=80')] bg-cover opacity-20 mix-blend-luminosity pointer-events-none"></div>
          <div className="relative z-10 space-y-6 max-w-xl">
            <div className="bg-white text-[#ff0a22] font-black tracking-widest px-4 py-1 rounded w-fit text-sm">WEEKEND STEAL</div>
            <h2 className="text-5xl md:text-7xl font-display text-white leading-[0.9] drop-shadow-lg uppercase">GET 20% OFF<br/>YER FIRST ORDER</h2>
            <p className="text-white/90 text-xl font-medium">Use code <span className="font-black bg-black/40 px-2 rounded text-pink-300">AHOY20</span> at WhatsApp checkout.</p>
            <button onClick={() => navigateTo('shop')} className="btn-pirate bg-black text-white font-display text-xl tracking-wider px-10 py-4 transition-all uppercase shadow-[0_6px_0_rgba(0,0,0,0.5)] hover:bg-white hover:text-black hover:shadow-[0_2px_0_rgba(0,0,0,0.5)] hover:translate-y-[4px]">
              CLAIM BOOTY
            </button>
          </div>
          <div className="relative z-10 flex-shrink-0 animate-float">
            <img src={products[2].image} alt="Promo Shoe" className="w-64 md:w-96 drop-shadow-[0_20px_20px_rgba(0,0,0,0.8)] rounded-3xl -rotate-12 border-4 border-white/20" />
          </div>
        </div>
      </section>

      <section className="py-24 px-6 md:px-16 max-w-7xl mx-auto border-t border-purple-900/40 relative">
        <div className="mb-16 space-y-4 text-center">
          <h2 className="text-5xl md:text-6xl font-display text-[#e4c4fc] drop-shadow-md">FRESH ON DECK</h2>
          <p className="text-lg text-white/70 font-medium max-w-2xl mx-auto">New arrivals and all-time best sellers.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {products.slice(3, 6).map((product) => <ProductCard key={product.id} product={product} navigateTo={navigateTo} wishlist={wishlist} toggleWishlist={toggleWishlist} addToCart={addToCart} />)}
        </div>
      </section>

      <section className="py-12 bg-[#10061c] border-y-8 border-[#251042]">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-display text-white tracking-widest flex items-center justify-center gap-3 uppercase"><Instagram size={28} className="text-pink-500"/> @DEMOSTORE</h2>
          <p className="text-white/50 mt-2 font-medium lowercase">Tag us to be featured on the captain's log.</p>
        </div>
        <div className="flex overflow-x-auto gap-4 px-6 pb-6 snap-x hide-scrollbar">
          {[products[0], products[1], products[3], products[4], products[5]].map((p, i) => (
            <div key={i} className="min-w-[250px] aspect-square rounded-2xl overflow-hidden relative group cursor-pointer snap-center shadow-lg border border-purple-900/50" onClick={() => navigateTo('product', p)}>
              <img src={p.image} className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 ${p.blendMode ? 'bg-[#1a0b2e]' : ''}`} alt="Gallery" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#ff0a22]/80 via-purple-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <Instagram size={40} className="text-white drop-shadow-md transform scale-50 group-hover:scale-100 transition-transform duration-300" />
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="py-24 px-6 md:px-16 max-w-4xl mx-auto relative text-center">
         <h2 className="text-5xl font-display text-[#e4c4fc] mb-12 drop-shadow-md uppercase">PARLEY (FAQ)</h2>
         <div className="space-y-6 text-left">
           <div className="bg-[#2b1842]/50 backdrop-blur border border-purple-500/30 p-6 rounded-2xl">
             <h4 className="font-display text-2xl text-pink-300 mb-2 uppercase">How do I place an order?</h4>
             <p className="text-white/80 font-medium lowercase">Click the "Buy on WhatsApp" button on any product page. It will pre-fill a message for us. We'll confirm availability and arrange payment securely!</p>
           </div>
           <div className="bg-[#2b1842]/50 backdrop-blur border border-purple-500/30 p-6 rounded-2xl">
             <h4 className="font-display text-2xl text-pink-300 mb-2 uppercase">Do you ship across the seven seas?</h4>
             <p className="text-white/80 font-medium lowercase">Aye! We ship worldwide. Shipping costs are calculated during our WhatsApp parley with DEMO staff.</p>
           </div>
           <div className="bg-[#2b1842]/50 backdrop-blur border border-purple-500/30 p-6 rounded-2xl">
             <h4 className="font-display text-2xl text-pink-300 mb-2 uppercase">What if the boots don't fit?</h4>
             <p className="text-white/80 font-medium lowercase">We offer a 14-day return policy for unworn items. Just hail us on WhatsApp.</p>
           </div>
         </div>
      </section>
    </div>
  </>
);

const ShopView = ({ searchQuery, setSearchQuery, navigateTo, wishlist, toggleWishlist, addToCart }) => {
  const [priceRange, setPriceRange] = useState(250);
  const [sortBy, setSortBy] = useState('newest');
  const categories = ['All', 'Running', 'High-Tops', 'Boots', 'Casual'];
  const sizes = [7, 8, 9, 10, 11, 12];
  const brands = ['All', 'DEMO', 'Kraken Kicks'];
  
  const [activeCat, setActiveCat] = useState('All');
  const [activeSize, setActiveSize] = useState(null);
  const [activeBrand, setActiveBrand] = useState('All');

  let filtered = products.filter(p => {
    const matchCat = activeCat === 'All' || p.category === activeCat;
    const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchPrice = p.price <= priceRange;
    const matchSize = !activeSize || p.sizes.includes(activeSize);
    const matchBrand = activeBrand === 'All' || p.brand === activeBrand;
    return matchCat && matchSearch && matchPrice && matchSize && matchBrand;
  });

  if(sortBy === 'priceAsc') filtered.sort((a,b) => a.price - b.price);
  if(sortBy === 'priceDesc') filtered.sort((a,b) => b.price - a.price);
  if(sortBy === 'popular') filtered.sort((a,b) => b.id - a.id);

  return (
    <div className="wood-bg min-h-screen pt-40 pb-24 relative z-40">
      <div className="max-w-7xl mx-auto px-6 mb-12 text-center">
         <h1 className="text-6xl md:text-8xl font-display text-white drop-shadow-[0_10px_10px_rgba(0,0,0,0.8)] mb-4 uppercase">THE SHOP</h1>
         <p className="text-xl text-pink-200 font-medium lowercase">Filter yer loot to find the perfect pair from DEMO.</p>
      </div>

      <div className="max-w-7xl mx-auto px-6 flex flex-col lg:flex-row gap-12">
        
        <div className="w-full lg:w-1/4 space-y-8 bg-[#16062b]/80 p-8 rounded-3xl border border-purple-900/50 h-fit sticky top-32 shadow-xl">
          <div>
            <h3 className="font-display text-xl text-pink-300 mb-4 tracking-wider uppercase">SEARCH</h3>
            <div className="relative">
              <input type="text" value={searchQuery} onChange={e=>setSearchQuery(e.target.value)} placeholder="Search..." className="w-full bg-black/40 border border-purple-500/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-pink-500" />
              <Search className="absolute right-3 top-3 text-white/50" size={20}/>
            </div>
          </div>

          <div>
            <h3 className="font-display text-xl text-pink-300 mb-4 tracking-wider uppercase">CATEGORY</h3>
            <div className="flex flex-col gap-2">
              {categories.map(c => (
                <button key={c} onClick={() => setActiveCat(c)} className={`text-left font-bold text-sm tracking-wide transition-colors ${activeCat === c ? 'text-[#ff0a22]' : 'text-white/70 hover:text-white uppercase'}`}>{c}</button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-display text-xl text-pink-300 mb-4 tracking-wider uppercase">BRAND</h3>
            <select value={activeBrand} onChange={e=>setActiveBrand(e.target.value)} className="w-full bg-black/40 border border-purple-500/50 rounded-xl px-4 py-3 text-white focus:outline-none font-bold appearance-none uppercase">
              {brands.map(b => <option key={b} value={b} className="bg-[#1b0b2e] uppercase">{b}</option>)}
            </select>
          </div>

          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-display text-xl text-pink-300 tracking-wider uppercase">MAX PRICE</h3>
              <span className="font-bold text-white uppercase">${priceRange}</span>
            </div>
            <input type="range" min="50" max="300" value={priceRange} onChange={e=>setPriceRange(e.target.value)} className="w-full accent-[#ff0a22]" />
          </div>

          <div>
            <h3 className="font-display text-xl text-pink-300 mb-4 tracking-wider uppercase">SIZE</h3>
            <div className="flex flex-wrap gap-2">
              {sizes.map(s => (
                <button key={s} onClick={() => setActiveSize(activeSize === s ? null : s)} className={`w-10 h-10 rounded-xl font-bold border-2 transition-all ${activeSize === s ? 'bg-[#ff0a22] border-[#ff0a22] text-white' : 'border-purple-500/50 text-white/70 hover:border-white uppercase'}`}>{s}</button>
              ))}
            </div>
          </div>
          
          <button onClick={() => { setActiveCat('All'); setActiveSize(null); setPriceRange(300); setActiveBrand('All'); setSearchQuery(''); }} className="w-full py-3 text-sm font-bold text-white/50 hover:text-white tracking-widest uppercase border border-white/20 rounded-xl hover:bg-white/10 transition-colors">
            Clear Filters
          </button>
        </div>

        <div className="w-full lg:w-3/4">
          <div className="flex justify-between items-center mb-8 bg-[#16062b]/80 p-4 rounded-2xl border border-purple-900/50 backdrop-blur">
            <span className="font-bold text-white/70 lowercase">{filtered.length} Booties Found</span>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-pink-300 uppercase">SORT BY:</span>
              <select value={sortBy} onChange={e=>setSortBy(e.target.value)} className="bg-transparent border-none text-white font-bold focus:outline-none appearance-none cursor-pointer uppercase">
                <option value="newest" className="bg-[#1b0b2e] uppercase">Newest Arrivals</option>
                <option value="popular" className="bg-[#1b0b2e] uppercase">Most Popular</option>
                <option value="priceAsc" className="bg-[#1b0b2e] uppercase">Price: Low to High</option>
                <option value="priceDesc" className="bg-[#1b0b2e] uppercase">Price: High to Low</option>
              </select>
              <ChevronDown size={16} className="text-white pointer-events-none" />
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="text-center py-32 bg-[#16062b]/50 rounded-3xl border border-purple-900/50">
              <span className="text-6xl mb-4 block opacity-50">🧭</span>
              <h3 className="text-3xl font-display text-pink-300 uppercase">No booty matches yer filters!</h3>
              <button onClick={() => {setActiveCat('All'); setSearchQuery('')}} className="mt-6 text-white font-bold underline hover:text-pink-400 lowercase">View all items</button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-8">
              {filtered.map((product) => <ProductCard key={product.id} product={product} navigateTo={navigateTo} wishlist={wishlist} toggleWishlist={toggleWishlist} addToCart={addToCart} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const ProductView = ({ currentProduct, navigateTo, wishlist, toggleWishlist, addToCart, setIsSizeGuideOpen }) => {
  if (!currentProduct) return null;
  const [mainImg, setMainImg] = useState(currentProduct.images[0]);
  const [selSize, setSelSize] = useState(null);
  const [selColor, setSelColor] = useState(currentProduct.colors[0]);
  const [err, setErr] = useState(false);
  const [zoomStyle, setZoomStyle] = useState({});

  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.target.getBoundingClientRect();
    const x = (e.clientX - left) / width * 100;
    const y = (e.clientY - top) / height * 100;
    setZoomStyle({ transformOrigin: `${x}% ${y}%`, transform: 'scale(1.5)' });
  };

  const handleWhatsAppClick = () => {
    if (!selSize) {
      setErr(true); setTimeout(() => setErr(false), 2000); return;
    }
    buyViaWhatsApp(currentProduct, selSize, selColor);
  };

  return (
    <div className="wood-bg min-h-screen pt-40 pb-24 relative z-40">
      <div className="max-w-7xl mx-auto px-6 relative">
        
        <div className="sticky top-28 z-[55] w-fit mb-8 pointer-events-none">
          <button 
            type="button"
            onClick={() => navigateTo('shop')} 
            className="inline-flex items-center gap-2 text-white/90 hover:text-pink-400 font-bold transition-all px-5 py-2.5 bg-[#16062b]/80 backdrop-blur-md border border-pink-500/30 rounded-full shadow-[0_5px_15px_rgba(0,0,0,0.5)] w-fit cursor-pointer pointer-events-auto hover:bg-[#251042] hover:scale-105 uppercase"
          >
            <ArrowLeft size={20} /> BACK TO SHOP
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-16">
          <div className="w-full lg:w-1/2 flex flex-col-reverse md:flex-row gap-4">
             <div className="flex md:flex-col gap-4 overflow-x-auto md:overflow-visible">
               {currentProduct.images.map((img, i) => (
                 <button key={i} onClick={() => setMainImg(img)} className={`w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all flex-shrink-0 ${mainImg === img ? 'border-pink-500 scale-105 shadow-lg' : 'border-transparent opacity-60 hover:opacity-100'}`}>
                   <img src={img} className={`w-full h-full object-cover ${img.includes('image_626df0') ? 'bg-[#1a0b2e]' : ''}`} alt="thumb" />
                 </button>
               ))}
             </div>
             
             <div className={`flex-1 aspect-square bg-gradient-to-br ${currentProduct.color} rounded-[3rem] p-4 shadow-2xl relative overflow-hidden group border-4 border-purple-900/30`}>
               <div className="absolute top-6 left-6 z-20">
                  {currentProduct.badge && <span className="bg-[#ff0a22] text-white font-display px-4 py-2 rounded-xl shadow-lg tracking-wider text-sm uppercase">{currentProduct.badge}</span>}
               </div>
               <button onClick={() => toggleWishlist(currentProduct.id)} className="absolute top-6 right-6 z-20 w-12 h-12 bg-white/50 backdrop-blur rounded-full flex items-center justify-center hover:bg-white transition-colors shadow-lg">
                 <Heart size={24} className={wishlist.includes(currentProduct.id) ? "fill-[#ff0a22] text-[#ff0a22]" : "text-[#2b1842]"} />
               </button>
               
               <div className="w-full h-full relative overflow-hidden rounded-[2rem]" onMouseMove={handleMouseMove} onMouseLeave={() => setZoomStyle({ transform: 'scale(1)' })}>
                  <img 
                    src={mainImg} 
                    alt={currentProduct.name} 
                    className={`absolute inset-0 w-full h-full object-cover transition-transform duration-200 ease-out cursor-crosshair ${mainImg.includes('image_626df0') ? 'mix-blend-screen' : ''}`}
                    style={zoomStyle}
                  />
               </div>
             </div>
          </div>

          <div className="w-full lg:w-1/2 space-y-8">
            <div>
              <p className="text-[#ff0a22] font-display tracking-widest text-lg mb-2 uppercase">{currentProduct.brand}</p>
              <h1 className="text-5xl md:text-6xl font-display text-white drop-shadow-md leading-tight mb-4 uppercase">{currentProduct.name}</h1>
              <div className="flex items-center gap-4">
                <span className="text-3xl text-pink-300 font-bold uppercase">${currentProduct.price}</span>
                <span className="flex items-center gap-1 text-sm bg-black/40 px-3 py-1 rounded-full text-green-400 border border-green-500/30 lowercase">
                  <Check size={14}/> {currentProduct.stockLabel}
                </span>
              </div>
            </div>

            <div className="bg-[#16062b]/80 p-6 rounded-3xl border border-purple-900/50 backdrop-blur shadow-xl space-y-6">
              <div>
                <div className="flex justify-between items-end mb-3">
                  <h3 className="font-display text-xl text-pink-300 tracking-wider uppercase">COLOR</h3>
                  <span className="text-white/70 font-bold text-sm lowercase">{selColor}</span>
                </div>
                <div className="flex gap-3">
                  {currentProduct.colors.map(c => (
                    <button 
                      key={c} onClick={() => setSelColor(c)}
                      className={`px-4 py-2 rounded-xl font-bold text-sm transition-all border-2 ${selColor === c ? 'bg-white text-black border-white shadow-md' : 'bg-transparent text-white border-white/20 hover:border-white/50 uppercase'}`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex justify-between items-end mb-3">
                  <h3 className="font-display text-xl text-pink-300 tracking-wider uppercase">SIZE <span className="text-sm font-sans text-white/50 lowercase">(US)</span></h3>
                  <button onClick={() => setIsSizeGuideOpen(true)} className="flex items-center gap-1 text-white/50 hover:text-white font-bold text-sm underline transition-colors lowercase"><Info size={14}/> Size Guide</button>
                </div>
                <div className="flex flex-wrap gap-3">
                  {currentProduct.sizes.map(s => (
                    <button 
                      key={s} onClick={() => { setSelSize(s); setErr(false); }}
                      className={`w-12 h-12 rounded-xl font-bold text-lg transition-all border-2 ${selSize === s ? 'bg-[#ff0a22] text-white border-[#ff0a22] shadow-[0_0_15px_rgba(255,10,34,0.5)] scale-110' : 'bg-transparent text-white border-purple-500/50 hover:border-white hover:bg-white/10 uppercase'}`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
                {err && <p className="text-[#ff0a22] font-bold mt-3 animate-pulse lowercase">Ahoy! Ye must select a size first!</p>}
              </div>

              <div className="pt-4 flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={handleWhatsAppClick}
                  className="flex-1 btn-pirate bg-[#25D366] hover:bg-[#128C7E] text-white font-display text-xl tracking-wider py-4 transition-all duration-300 uppercase shadow-[0_6px_0_#075E54] hover:shadow-[0_2px_0_#075E54] hover:translate-y-[4px] active:translate-y-[6px] active:shadow-none flex justify-center items-center gap-3"
                >
                  <MessageCircle size={24} /> BUY ON WHATSAPP
                </button>
                <button 
                  onClick={() => {
                    if(!selSize) { setErr(true); setTimeout(() => setErr(false), 2000); return; }
                    addToCart(currentProduct, selSize, selColor);
                  }}
                  className="sm:w-16 sm:h-auto h-16 btn-pirate bg-[#2b1842] hover:bg-pink-600 text-white font-display py-4 transition-all uppercase shadow-[0_6px_0_#110a1a] hover:translate-y-[4px] flex justify-center items-center"
                  title="Add to Cart"
                >
                  <ShoppingCart size={24} />
                </button>
              </div>
            </div>

            <div className="space-y-6 pt-6">
              <div>
                <h3 className="font-display text-2xl text-white mb-3 tracking-wider uppercase">THE LORE</h3>
                <p className="text-white/80 leading-relaxed font-medium text-lg lowercase">{currentProduct.description}</p>
              </div>
              <div>
                <h3 className="font-display text-2xl text-white mb-3 tracking-wider uppercase">FEATURES</h3>
                <ul className="space-y-2">
                  {currentProduct.highlights.map((h, i) => (
                    <li key={i} className="flex items-center gap-3 text-white/80 font-medium lowercase">
                      <span className="w-2 h-2 rounded-full bg-pink-500"></span> {h}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-32 border-t border-purple-900/40 pt-16">
          <h2 className="text-4xl font-display text-white mb-10 text-center drop-shadow-md uppercase">YOU MAY ALSO LIKE</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {products.filter(p => p.id !== currentProduct.id).slice(0, 3).map(p => <ProductCard key={p.id} product={p} navigateTo={navigateTo} wishlist={wishlist} toggleWishlist={toggleWishlist} addToCart={addToCart} />)}
          </div>
        </div>
      </div>
    </div>
  );
};

const AboutView = ({ navigateTo }) => (
  <div className="wood-bg min-h-screen pt-40 pb-24 relative z-40">
    <div className="max-w-7xl mx-auto px-6">
      
      <div className="text-center mb-16">
        <h1 className="text-6xl md:text-8xl font-display text-white drop-shadow-[0_10px_10px_rgba(0,0,0,0.8)] mb-4 uppercase">OUR TALE</h1>
        <p className="text-xl text-pink-200 font-medium lowercase">The legends behind DEMO.</p>
      </div>
      
      <section className="py-16 flex flex-col md:flex-row items-center gap-16 relative">
        <div className="md:w-1/2 space-y-6 relative z-10">
           <h2 className="text-5xl font-display text-[#e4c4fc] drop-shadow-md uppercase">FORGED IN THE DEPTHS</h2>
           <p className="text-lg text-white/90 leading-relaxed font-medium lowercase">
             Ahoy! DEMO isn't just a store; it's a crew of passionate designers charting new territories in footwear. We forge shoes that withstand any storm while keeping you looking sharp on the deck or the streets.
           </p>
           <p className="text-lg text-white/90 leading-relaxed font-medium lowercase">
             Founded by a crew of rogue cobblers who grew tired of fragile, uninspired landlubber shoes, our mission is to combine the durability of pirate gear with cutting-edge streetwear aesthetics. Every shoe is a treasure waiting to be discovered.
           </p>
        </div>
        <div className="md:w-1/2 relative z-10">
           <TiltWrapper>
             <div className="bg-[#e9cbf0] p-3 rounded-[2.5rem] w-full shadow-[0_20px_50px_rgba(0,0,0,0.6)]">
               <div className="w-full aspect-video bg-gradient-to-br from-[#8a2bba] to-[#45106b] rounded-[2rem] flex items-center justify-center shadow-inner relative overflow-hidden uppercase">
                 <img src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80" className="w-full h-full object-cover mix-blend-overlay opacity-60" alt="Story" />
                 <span className="text-[6rem] absolute animate-float drop-shadow-xl">🏴‍☠️</span>
               </div>
             </div>
           </TiltWrapper>
        </div>
      </section>

      <section className="py-24 border-t border-purple-900/40 relative">
        <div className="text-center mb-24 space-y-6">
          <h2 className="text-5xl md:text-6xl font-display text-[#e4c4fc] drop-shadow-[0_0_15px_rgba(228,196,252,0.3)] uppercase">THE MISSION</h2>
          <p className="text-lg md:text-xl text-white/95 font-medium max-w-3xl mx-auto leading-relaxed lowercase">
            We bring together people of different cultures, nationalities, and ages through shared streetwear stories and vibrant, durable footwear experiences.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-center">
          <div className="space-y-6">
            <h3 className="text-4xl md:text-5xl font-display text-[#e4c4fc] drop-shadow-md leading-tight uppercase">OUR<br/>VALUES</h3>
            <p className="text-lg text-white/95 leading-relaxed font-medium lowercase">
              In our work, we rely on the crew's values: unbreakable loyalty, professionalism, openness, and adapting to the tides of fashion.
            </p>
            <div className="pt-4">
              <button onClick={() => navigateTo('shop')} className="btn-pirate bg-[#ff0a22] hover:bg-[#ff3347] text-white font-display text-xl tracking-wider px-8 py-3 transition-all duration-300 uppercase shadow-[0_6px_0_#a80010] hover:shadow-[0_2px_0_#a80010] hover:translate-y-[4px] active:translate-y-[6px] active:shadow-none">
                SHOP THE LORE
              </button>
            </div>
          </div>

          <div className="flex justify-center relative my-16 md:my-0 group perspective-[1000px]">
             <div className="w-56 h-56 md:w-64 md:h-64 bg-gradient-to-br from-yellow-500 via-amber-700 to-yellow-900 rounded-[3rem] flex items-center justify-center text-[7rem] shadow-[0_20px_60px_rgba(217,119,6,0.6)] border-4 border-yellow-400/30 transform transition-transform duration-500 group-hover:rotate-y-12 group-hover:-rotate-x-12 animate-float uppercase">
               <span className="drop-shadow-[0_25px_20px_rgba(0,0,0,0.8)] group-hover:scale-110 transition-transform duration-300">🧰</span>
               <div className="absolute inset-0 bg-white/10 rounded-[2.5rem] opacity-0 group-hover:opacity-100 transition-opacity duration-300 uppercase"></div>
             </div>
          </div>

          <div className="flex justify-center md:justify-end">
             <TiltWrapper>
               <div className="bg-[#e9cbf0] p-3 rounded-[2.5rem] w-72 sm:w-80 shadow-[0_20px_50px_rgba(0,0,0,0.6)]">
                 <div className="w-full aspect-square bg-gradient-to-br from-[#d946ef] to-[#86198f] rounded-[2rem] mb-5 flex items-center justify-center text-8xl shadow-inner relative overflow-hidden group uppercase">
                   <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1518063319789-7217e6706b04?auto=format&fit=crop&q=80')] bg-cover bg-center mix-blend-overlay opacity-40 group-hover:scale-110 transition-transform duration-700 uppercase"></div>
                   <span className="drop-shadow-[0_15px_15px_rgba(0,0,0,0.8)] z-10 animate-float-fast">☠️</span>
                 </div>
                 <h3 className="text-[#2b1842] font-display text-center text-2xl mb-4 leading-tight tracking-wide uppercase">
                   UNITING<br/>THE CREW
                 </h3>
               </div>
             </TiltWrapper>
          </div>
        </div>
      </section>
    </div>
  </div>
);

// --- New Policy View Component ---

const PolicyView = ({ type, navigateTo }) => {
  const content = {
    returns: {
      title: "RETURNS & EXCHANGES",
      icon: <RefreshCw size={48} className="text-pink-400" />,
      text: "Every treasure has a 14-day grace period. If yer boots don't fit or the wind changes yer mind, we offer full exchanges or returns for unworn gear. Just hail our crew on WhatsApp to start a parley."
    },
    shipping: {
      title: "SHIPPING POLICY",
      icon: <Truck size={48} className="text-pink-400" />,
      text: "Transporting booty across the seven seas requires precise navigation. YOU HAVE TO TALK WITH THE COMPANY directly via WhatsApp to arrange yer delivery, calculate costs, and confirm yer port of call."
    },
    privacy: {
      title: "PRIVACY POLICY",
      icon: <ShieldCheck size={48} className="text-pink-400" />,
      text: "At DEMO, we guard yer secrets like buried gold. Yer data is never traded to rogue factions. We only keep what's needed to ensure yer loot reaches yer deck safely. Secure, private, and loyal to the crew."
    }
  }[type];

  return (
    <div className="wood-bg min-h-screen pt-40 pb-24 relative z-40">
      <div className="max-w-4xl mx-auto px-6">
        <div className="sticky top-28 z-[55] w-fit mb-12 pointer-events-none">
          <button 
            type="button"
            onClick={() => navigateTo('home')} 
            className="inline-flex items-center gap-2 text-white/90 hover:text-pink-400 font-bold transition-all px-5 py-2.5 bg-[#16062b]/80 backdrop-blur-md border border-pink-500/30 rounded-full shadow-[0_5px_15px_rgba(0,0,0,0.5)] cursor-pointer pointer-events-auto hover:bg-[#251042] hover:scale-105 uppercase"
          >
            <ArrowLeft size={20} /> BACK TO PORT
          </button>
        </div>

        <TiltWrapper>
          <div className="bg-[#1a0b2e]/90 backdrop-blur-xl border border-pink-500/20 p-10 md:p-16 rounded-[3rem] shadow-2xl text-center space-y-8">
             <div className="flex justify-center">{content.icon}</div>
             <h1 className="text-5xl md:text-7xl font-display text-white uppercase drop-shadow-lg">{content.title}</h1>
             <p className="text-xl md:text-2xl text-white/80 leading-relaxed font-medium">
               {content.text}
             </p>
             <div className="pt-8">
               <button 
                onClick={() => window.open(`https://wa.me/1234567890?text=Ahoy!%20I%20have%20a%20question%20about%20${content.title}.`, '_blank')}
                className="btn-pirate bg-[#ff0a22] text-white font-display text-2xl tracking-widest px-12 py-5 transition-all duration-300 uppercase shadow-[0_6px_0_#a80010] hover:shadow-[0_2px_0_#a80010] hover:translate-y-[4px]"
               >
                 HAIL THE CREW
               </button>
             </div>
          </div>
        </TiltWrapper>
      </div>
    </div>
  );
};

// --- Main App ---

const App = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);

  // Initialize cart and wishlist from localStorage
  const [cart, setCart] = useState(() => {
    try {
      const savedCart = localStorage.getItem('neon-shoe-cart');
      return savedCart ? JSON.parse(savedCart) : [];
    } catch (error) {
      console.error('Error loading cart from localStorage:', error);
      return [];
    }
  });

  const [wishlist, setWishlist] = useState(() => {
    try {
      const savedWishlist = localStorage.getItem('neon-shoe-wishlist');
      return savedWishlist ? JSON.parse(savedWishlist) : [];
    } catch (error) {
      console.error('Error loading wishlist from localStorage:', error);
      return [];
    }
  });
  
  const [view, setView] = useState('home'); // 'home', 'shop', 'product', 'about', 'returns', 'shipping', 'privacy'
  const [currentProduct, setCurrentProduct] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);

  // Persist cart to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('neon-shoe-cart', JSON.stringify(cart));
    } catch (error) {
      console.error('Error saving cart to localStorage:', error);
    }
  }, [cart]);

  // Persist wishlist to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('neon-shoe-wishlist', JSON.stringify(wishlist));
    } catch (error) {
      console.error('Error saving wishlist to localStorage:', error);
    }
  }, [wishlist]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const addToCart = (product, selectedSize, selectedColor) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id && item.selectedSize === selectedSize && item.selectedColor === selectedColor);
      if (existing) {
        return prev.map(item => 
          (item.id === product.id && item.selectedSize === selectedSize && item.selectedColor === selectedColor) 
            ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, selectedSize, selectedColor, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const updateQuantity = (id, size, color, change) => {
    setCart(prev => prev.map(item => {
      if (item.id === id && item.selectedSize === size && item.selectedColor === color) {
        return { ...item, quantity: Math.max(0, item.quantity + change) };
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const toggleWishlist = (id) => {
    setWishlist(prev => prev.includes(id) ? prev.filter(wId => wId !== id) : [...prev, id]);
  };

  const cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  const cartItemCount = cart.reduce((count, item) => count + item.quantity, 0);
  
  const wishlistedProducts = products.filter(p => wishlist.includes(p.id));

  const navigateTo = (page, product = null) => {
    setCurrentProduct(product);
    setView(page);
    setMobileMenuOpen(false);
    setIsWishlistOpen(false);
    setIsCartOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' }); 
  };

  const handleSearch = (e) => {
    if (e.key === 'Enter') {
      navigateTo('shop');
      setIsSearchOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#1b0b2e] text-zinc-50 font-sans selection:bg-pink-600 selection:text-white overflow-x-hidden cursor-none scroll-smooth">
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Lilita+One&display=swap');
          .font-display { font-family: 'Lilita One', sans-serif; }
          * { cursor: none !important; }
          .btn-pirate { clip-path: polygon(12px 0, calc(100% - 12px) 0, 100% 8px, 100% calc(100% - 12px), calc(100% - 12px) 100%, 12px 100%, 0 calc(100% - 8px), 0 12px); }
          .wood-bg { background-color: #1b0b2e; background-image: linear-gradient(90deg, transparent 95%, rgba(0,0,0,0.2) 100%), linear-gradient(0deg, #1b0b2e 0%, #2b114d 50%, #1b0b2e 100%); background-size: 120px 100%, 100% 100%; }
          .hide-scrollbar::-webkit-scrollbar { display: none; }
          .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
          @keyframes float { 0%, 100% { transform: translateY(0px) rotate(0deg); } 50% { transform: translateY(-15px) rotate(3deg); } }
          @keyframes float-reverse { 0%, 100% { transform: translateY(0px) rotate(0deg); } 50% { transform: translateY(15px) rotate(-3deg); } }
          @keyframes shine { 100% { transform: translateX(100%); } }
          @keyframes marquee { 0% { transform: translateX(0%); } 100% { transform: translateX(-50%); } }
          .animate-float { animation: float 6s ease-in-out infinite; }
          .animate-float-delayed { animation: float-reverse 7s ease-in-out infinite 1s; }
          .animate-float-fast { animation: float 4s ease-in-out infinite; }
        `}
      </style>
      
      {!isLoaded && <IntroLoader onComplete={() => setIsLoaded(true)} />}
      <LiquidCursor />
      
      <nav className={`fixed w-full z-[60] transition-all duration-500 ${isScrolled ? 'bg-[#120524]/80 backdrop-blur-2xl py-3 shadow-[0_10px_30px_rgba(0,0,0,0.8)] border-b border-pink-500/30 translate-y-0' : 'bg-transparent py-6'} ${!isLoaded ? '-translate-y-full' : 'translate-y-0'}`}>
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center font-display text-lg tracking-wider">
          
          <div className="hidden md:flex items-center gap-8 w-1/3">
            <button onClick={() => navigateTo('home')} className={`relative font-display tracking-widest text-lg transition-all duration-300 group ${view==='home'?'text-pink-400 drop-shadow-[0_0_8px_rgba(244,114,182,0.6)]':'text-white hover:text-pink-300 uppercase'}`}>
              HOME
              <span className={`absolute -bottom-1 left-0 w-full h-[2px] bg-gradient-to-r from-[#ff0a22] to-[#ff66cc] transform origin-left transition-transform duration-300 ease-out ${view==='home' ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`}></span>
            </button>
            <button onClick={() => navigateTo('shop')} className={`relative font-display tracking-widest text-lg transition-all duration-300 group ${view==='shop'?'text-pink-400 drop-shadow-[0_0_8px_rgba(244,114,182,0.6)]':'text-white hover:text-pink-300 uppercase'}`}>
              SHOP
              <span className={`absolute -bottom-1 left-0 w-full h-[2px] bg-gradient-to-r from-[#ff0a22] to-[#ff66cc] transform origin-left transition-transform duration-300 ease-out ${view==='shop' ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`}></span>
            </button>
            <button onClick={() => navigateTo('about')} className={`relative font-display tracking-widest text-lg transition-all duration-300 group ${view==='about'?'text-pink-400 drop-shadow-[0_0_8px_rgba(244,114,182,0.6)]':'text-white hover:text-pink-300 uppercase'}`}>
              ABOUT
              <span className={`absolute -bottom-1 left-0 w-full h-[2px] bg-gradient-to-r from-[#ff0a22] to-[#ff66cc] transform origin-left transition-transform duration-300 ease-out ${view==='about' ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`}></span>
            </button>
          </div>

          <div className="flex flex-col items-center cursor-pointer relative z-10 group mt-2 w-1/3" onClick={() => navigateTo('home')}>
            <div className="relative flex items-center justify-center w-16 h-16 mb-1">
              <div className="absolute inset-0 bg-pink-500/20 rounded-full blur-xl scale-0 group-hover:scale-150 transition-transform duration-500"></div>
              <svg viewBox="0 0 100 100" className="w-full h-full text-white fill-current drop-shadow-[0_0_10px_rgba(255,255,255,0.2)] group-hover:drop-shadow-[0_0_20px_rgba(236,72,153,0.8)] group-hover:scale-110 transition-all duration-300 relative z-10">
                <path d="M 30 70 C 10 70 10 30 30 30 C 50 30 50 50 70 50 C 90 50 90 90 70 90 C 50 90 50 70 30 70 Z" fill="#ffffff" opacity="0.1"/>
                <path d="M 20 60 C 0 60 0 20 20 20 C 40 20 40 40 60 40 C 80 40 80 80 60 80 C 40 80 40 60 20 60 Z" fill="#ffffff" opacity="0.9"/>
              </svg>
            </div>
            <span className="text-2xl font-display leading-none tracking-normal drop-shadow-md text-white group-hover:text-pink-300 transition-colors uppercase">DEMO</span>
            <span className="text-[0.6rem] font-sans tracking-[0.2em] text-pink-200 font-bold mt-1 uppercase group-hover:text-pink-100 transition-colors">Boots & Kicks</span>
          </div>

          <div className="hidden md:flex items-center justify-end gap-6 w-1/3">
            <div className="relative flex items-center group">
              <div className={`absolute right-0 w-8 h-8 rounded-full bg-pink-500/20 blur-md transition-all duration-500 ${isSearchOpen ? 'opacity-100 scale-150' : 'opacity-0'}`}></div>
              <input 
                type="text" placeholder="Search booty..." 
                value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} onKeyDown={handleSearch}
                className={`relative font-sans text-sm bg-[#16062b]/80 backdrop-blur border border-pink-500/50 rounded-full py-2 text-white placeholder-white/50 focus:outline-none focus:border-pink-400 focus:shadow-[0_0_15px_rgba(236,72,153,0.3)] transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${isSearchOpen ? 'w-56 px-5 opacity-100 mr-2' : 'w-0 px-0 opacity-0 border-transparent'}`}
              />
              <button onClick={() => setIsSearchOpen(!isSearchOpen)} className="relative z-10 hover:text-pink-300 transition-all hover:scale-110 drop-shadow-md text-white">
                <Search size={22} className={isSearchOpen ? "text-pink-400" : ""} />
              </button>
            </div>
            <button onClick={() => setIsWishlistOpen(true)} className="relative hover:text-pink-300 transition-all hover:scale-110 drop-shadow-md text-white">
              <Heart size={24} />
              {wishlist.length > 0 && <span className="absolute -top-2 -right-3 bg-[#ff0a22] text-white text-xs font-sans rounded-full w-5 h-5 flex items-center justify-center shadow-md animate-bounce">{wishlist.length}</span>}
            </button>
            <button className="hover:text-pink-300 transition-all hover:scale-110 drop-shadow-md text-white"><User size={24} /></button>
            <button onClick={() => setIsCartOpen(true)} className="relative hover:text-pink-300 transition-all hover:scale-110 drop-shadow-md flex items-center gap-2 text-white">
              <ShoppingCart size={24} />
              {cartItemCount > 0 && <span className="absolute -top-2 -right-3 bg-pink-600 text-white text-xs font-sans rounded-full w-5 h-5 flex items-center justify-center animate-bounce">{cartItemCount}</span>}
            </button>
          </div>

          <div className="md:hidden flex items-center gap-4 w-1/3 justify-end">
            <button onClick={() => setIsWishlistOpen(true)} className="relative text-white hover:text-pink-300 drop-shadow-md">
              <Heart size={24} />
              {wishlist.length > 0 && <span className="absolute -top-2 -right-3 bg-[#ff0a22] text-white text-xs font-sans rounded-full w-5 h-5 flex items-center justify-center shadow-md animate-bounce">{wishlist.length}</span>}
            </button>
            <button onClick={() => setIsCartOpen(true)} className="relative text-white hover:text-pink-300 drop-shadow-md">
              <ShoppingCart size={24} />
              {cartItemCount > 0 && <span className="absolute -top-2 -right-3 bg-pink-600 text-white text-xs font-sans rounded-full w-5 h-5 flex items-center justify-center animate-bounce">{cartItemCount}</span>}
            </button>
            <button className="text-white hover:text-pink-300 drop-shadow-md transition-transform hover:rotate-90" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </nav>

      {/* DRAWERS */}
      <div className={`fixed inset-0 z-[70] bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${isWishlistOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} onClick={() => setIsWishlistOpen(false)}></div>
      <div className={`fixed top-0 right-0 h-full w-full md:w-[450px] z-[80] bg-[#1a0b2e] border-l-8 border-[#0a0312] transform transition-transform duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] flex flex-col ${isWishlistOpen ? 'translate-x-0' : 'translate-x-full'}`}>
         <div className="absolute inset-0 wood-bg opacity-50 pointer-events-none"></div>
         <div className="relative z-10 p-6 border-b border-purple-900/50 flex justify-between items-center bg-[#251042]/80 backdrop-blur">
           <h2 className="text-3xl font-display tracking-wider text-pink-200 drop-shadow-md uppercase">YER WISHES</h2>
           <button onClick={() => setIsWishlistOpen(false)} className="text-white hover:text-pink-400 transition-transform hover:rotate-90"><X size={28} /></button>
         </div>
         <div className="relative z-10 flex-1 overflow-y-auto p-6 space-y-6">
           {wishlistedProducts.length === 0 ? (
             <div className="h-full flex flex-col items-center justify-center text-center opacity-50 space-y-4">
               <span className="text-6xl animate-float">💔</span>
               <p className="font-display text-xl tracking-wide uppercase">NO TREASURE DESIRED YET!</p>
               <button onClick={() => {setIsWishlistOpen(false); navigateTo('shop');}} className="mt-4 text-pink-300 underline font-bold lowercase">Explore the Shop</button>
             </div>
           ) : (
             wishlistedProducts.map(item => (
               <div key={item.id} className="flex gap-4 bg-[#2b114d]/60 p-3 rounded-xl border border-purple-800/30 shadow-lg relative group">
                 <div className="w-24 h-24 rounded-lg bg-black/40 overflow-hidden relative border border-white/10 cursor-pointer" onClick={() => navigateTo('product', item)}>
                   <img src={item.image} alt={item.name} className={`w-full h-full object-cover transition-all ${item.blendMode || ''}`} />
                 </div>
                 <div className="flex-1 flex flex-col justify-between py-1">
                   <div className="flex justify-between items-start">
                     <h3 className="font-display text-lg leading-tight tracking-wide cursor-pointer hover:text-pink-400 transition-colors lowercase" onClick={() => navigateTo('product', item)}>{item.name}</h3>
                     <button onClick={() => toggleWishlist(item.id)} className="text-pink-400 hover:text-pink-200 p-1" title="Remove"><Trash2 size={16} /></button>
                   </div>
                   <div className="flex justify-between items-end mt-2">
                     <p className="text-white font-bold">${item.price}</p>
                     <button 
                       onClick={() => navigateTo('product', item)} 
                       className="flex items-center gap-1 text-xs font-bold bg-[#ff0a22] text-white px-3 py-1.5 rounded-lg hover:bg-white hover:text-[#ff0a22] transition-colors uppercase"
                     >
                       <Eye size={14}/> VIEW BOOTY
                     </button>
                   </div>
                 </div>
               </div>
             ))
           )}
         </div>
      </div>

      <div className={`fixed inset-0 z-[70] bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${isCartOpen && !isWishlistOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} onClick={() => setIsCartOpen(false)}></div>
      <div className={`fixed top-0 right-0 h-full w-full md:w-[450px] z-[80] bg-[#1a0b2e] border-l-8 border-[#0a0312] transform transition-transform duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] flex flex-col ${isCartOpen && !isWishlistOpen ? 'translate-x-0' : 'translate-x-full'}`}>
         <div className="absolute inset-0 wood-bg opacity-50 pointer-events-none"></div>
         <div className="relative z-10 p-6 border-b border-purple-900/50 flex justify-between items-center bg-[#251042]/80 backdrop-blur">
           <h2 className="text-3xl font-display tracking-wider text-pink-200 drop-shadow-md uppercase">YOUR BOOTY</h2>
           <button onClick={() => setIsCartOpen(false)} className="text-white hover:text-pink-400 transition-transform hover:rotate-90"><X size={28} /></button>
         </div>
         <div className="relative z-10 flex-1 overflow-y-auto p-6 space-y-6">
           {cart.length === 0 ? (
             <div className="h-full flex flex-col items-center justify-center text-center opacity-50 space-y-4">
               <span className="text-6xl animate-float">🏴‍☠️</span>
               <p className="font-display text-xl tracking-wide uppercase">YER CART IS EMPTY,<br/>MATEY!</p>
             </div>
           ) : (
             cart.map(item => (
               <div key={`${item.id}-${item.selectedSize}-${item.selectedColor}`} className="flex gap-4 bg-[#2b114d]/60 p-3 rounded-xl border border-purple-800/30 shadow-lg relative group">
                 <div className="w-24 h-24 rounded-lg bg-black/40 overflow-hidden relative border border-white/10 cursor-pointer" onClick={() => navigateTo('product', item)}>
                   <img src={item.image} alt={item.name} className={`w-full h-full object-cover transition-all ${item.blendMode || ''}`} />
                 </div>
                 <div className="flex-1 flex flex-col justify-between py-1">
                   <div className="flex justify-between items-start">
                     <div>
                       <h3 className="font-display text-lg leading-tight tracking-wide cursor-pointer hover:text-pink-400 transition-colors lowercase" onClick={() => navigateTo('product', item)}>{item.name}</h3>
                       <p className="text-xs text-pink-300 font-sans tracking-widest mt-1 uppercase">SIZE: {item.selectedSize} | {item.selectedColor}</p>
                     </div>
                     <button onClick={() => updateQuantity(item.id, item.selectedSize, item.selectedColor, -item.quantity)} className="text-pink-400 hover:text-pink-200 p-1"><Trash2 size={16} /></button>
                   </div>
                   <div className="flex justify-between items-end mt-2">
                     <p className="text-white font-bold">${item.price}</p>
                     <div className="flex items-center gap-3 bg-black/30 rounded-full w-fit px-2 py-1 border border-purple-900/50">
                       <button onClick={() => updateQuantity(item.id, item.selectedSize, item.selectedColor, -1)} className="hover:text-pink-400"><Minus size={14} /></button>
                       <span className="text-sm font-bold w-4 text-center">{item.quantity}</span>
                       <button onClick={() => updateQuantity(item.id, item.selectedSize, item.selectedColor, 1)} className="hover:text-pink-400"><Plus size={14} /></button>
                     </div>
                   </div>
                 </div>
               </div>
             ))
           )}
         </div>
         {cart.length > 0 && (
           <div className="relative z-10 p-6 bg-[#251042]/90 backdrop-blur border-t border-purple-900/50">
             <div className="flex justify-between items-center mb-6 font-display text-2xl uppercase">
               <span>TOTAL:</span>
               <span className="text-pink-300 drop-shadow-[0_0_10px_rgba(244,114,182,0.5)]">${cartTotal}</span>
             </div>
             <button className="w-full btn-pirate bg-[#ff0a22] hover:bg-[#ff3347] text-white font-display text-xl tracking-wider py-4 transition-all duration-300 uppercase shadow-[0_6px_0_#a80010] hover:shadow-[0_2px_0_#a80010] hover:translate-y-[4px] active:translate-y-[6px] active:shadow-none">
               CHECKOUT NOW
             </button>
           </div>
         )}
      </div>

      <div className={`fixed inset-0 z-[50] bg-[#180a26]/95 backdrop-blur-xl flex flex-col items-center justify-center gap-8 text-3xl font-display md:hidden transition-all duration-500 ${mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        <button onClick={() => navigateTo('home')} className="hover:text-pink-400 hover:scale-110 transition-all uppercase">HOME</button>
        <button onClick={() => navigateTo('shop')} className="hover:text-pink-400 hover:scale-110 transition-all uppercase">SHOP</button>
        <button onClick={() => navigateTo('about')} className="hover:text-pink-400 hover:scale-110 transition-all uppercase">ABOUT</button>
        <div className="relative flex items-center mt-8 w-3/4">
          <input type="text" placeholder="Search booty..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} onKeyDown={handleSearch} className="w-full font-sans text-lg bg-black/40 border-2 border-purple-500/50 rounded-full px-6 py-3 text-white placeholder-white/50 focus:outline-none focus:border-pink-500" />
        </div>
      </div>

      <div className={`fixed inset-0 z-[100] flex items-center justify-center transition-opacity duration-300 ${isSizeGuideOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsSizeGuideOpen(false)}></div>
        <div className="relative bg-[#1a0b2e] w-full max-w-lg rounded-3xl border border-pink-500/30 p-8 m-4 shadow-2xl wood-bg">
           <button onClick={() => setIsSizeGuideOpen(false)} className="absolute top-4 right-4 text-white hover:text-pink-400"><X size={24}/></button>
           <h2 className="text-3xl font-display text-pink-300 mb-6 tracking-widest text-center uppercase">SIZE GUIDE</h2>
           <table className="w-full text-center font-bold text-sm">
             <thead><tr className="border-b border-white/20 text-white/50"><th className="pb-2 uppercase">US</th><th className="pb-2 uppercase">UK</th><th className="pb-2 uppercase">EU</th><th className="pb-2 uppercase">CM</th></tr></thead>
             <tbody className="text-white">
               {[
                 {us: 7, uk: 6, eu: 40, cm: 25},
                 {us: 8, uk: 7, eu: 41, cm: 26},
                 {us: 9, uk: 8, eu: 42.5, cm: 27},
                 {us: 10, uk: 9, eu: 44, cm: 28},
                 {us: 11, uk: 10, eu: 45, cm: 29},
                 {us: 12, uk: 11, eu: 46, cm: 30},
               ].map((r, i) => (
                 <tr key={i} className="border-b border-white/10 hover:bg-white/5 transition-colors"><td className="py-3">{r.us}</td><td>{r.uk}</td><td>{r.eu}</td><td>{r.cm}</td></tr>
               ))}
             </tbody>
           </table>
        </div>
      </div>

      {/* RENDER CURRENT VIEW */}
      {view === 'home' && <HomeView isLoaded={isLoaded} navigateTo={navigateTo} wishlist={wishlist} toggleWishlist={toggleWishlist} addToCart={addToCart} />}
      {view === 'shop' && <ShopView searchQuery={searchQuery} setSearchQuery={setSearchQuery} navigateTo={navigateTo} wishlist={wishlist} toggleWishlist={toggleWishlist} addToCart={addToCart} />}
      {view === 'product' && <ProductView currentProduct={currentProduct} navigateTo={navigateTo} wishlist={wishlist} toggleWishlist={toggleWishlist} addToCart={addToCart} setIsSizeGuideOpen={setIsSizeGuideOpen} />}
      {view === 'about' && <AboutView navigateTo={navigateTo} />}
      {view === 'returns' && <PolicyView type="returns" navigateTo={navigateTo} />}
      {view === 'shipping' && <PolicyView type="shipping" navigateTo={navigateTo} />}
      {view === 'privacy' && <PolicyView type="privacy" navigateTo={navigateTo} />}

      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-4">
        <a href="https://instagram.com" target="_blank" rel="noreferrer" className="w-14 h-14 bg-gradient-to-tr from-[#f09433] via-[#e6683c] to-[#bc1888] rounded-full flex items-center justify-center text-white shadow-lg hover:scale-110 hover:-translate-y-2 transition-transform relative group">
          <Instagram size={28} />
          <span className="absolute right-16 bg-white text-black font-bold text-sm px-4 py-2 rounded-xl whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity shadow-lg pointer-events-none lowercase">Follow DEMO!</span>
        </a>
        <button onClick={() => window.open(`https://wa.me/1234567890?text=Ahoy!%20I%20have%20a%20question%20about%20yer%20booty.`, '_blank')} className="w-14 h-14 bg-[#25D366] rounded-full flex items-center justify-center text-white shadow-lg hover:scale-110 hover:-translate-y-2 transition-transform relative group">
          <MessageCircle size={28} />
          <span className="absolute right-16 bg-white text-black font-bold text-sm px-4 py-2 rounded-xl whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity shadow-lg pointer-events-none lowercase">Chat with DEMO!</span>
        </button>
      </div>

      <footer className="relative pt-20 pb-12 px-6 md:px-16 bg-[#16062b] border-t-8 border-[#251042] overflow-hidden z-40">
        <div className="absolute inset-0 opacity-10 bg-[url('https://images.unsplash.com/photo-1510148199876-8a856ce41f44?auto=format&fit=crop&q=80')] bg-cover bg-center"></div>
        <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-[#0f041d] to-transparent"></div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 relative z-10">
          
          <div className="space-y-8 md:col-span-2">
            <div className="flex items-center gap-4 group cursor-pointer" onClick={() => navigateTo('home')}>
                <div className="w-14 h-14 transition-transform duration-500 group-hover:rotate-[360deg]">
                  <svg viewBox="0 0 100 100" className="w-full h-full text-white fill-current">
                    <path d="M 30 70 C 10 70 10 30 30 30 C 50 30 50 50 70 50 C 90 50 90 90 70 90 C 50 90 50 70 30 70 Z" fill="#ffffff" opacity="0.1"/>
                    <path d="M 20 60 C 0 60 0 20 20 20 C 40 20 40 40 60 40 C 80 40 80 80 60 80 C 40 80 40 60 20 60 Z" fill="#ffffff" opacity="0.9"/>
                </svg>
                </div>
                <div className="leading-tight">
                  <span className="text-4xl font-display text-white tracking-wide uppercase">DEMO</span><br/>
                  <span className="text-[0.6rem] font-sans tracking-[0.2em] text-pink-100 font-bold uppercase">Boots & Kicks</span>
                </div>
            </div>
            <p className="text-white/70 font-medium max-w-sm lowercase">Charting new territories in streetwear footwear. We forge shoes that withstand any storm while keeping you looking sharp.</p>
            <div className="flex gap-4">
                <a href="#" className="w-10 h-10 rounded-full bg-[#351b54] flex items-center justify-center text-white hover:bg-pink-600 hover:scale-110 transition-all duration-300"><Facebook size={18} /></a>
                <a href="#" className="w-10 h-10 rounded-full bg-[#351b54] flex items-center justify-center text-white hover:bg-pink-600 hover:scale-110 transition-all duration-300"><Instagram size={18} /></a>
                <a href="#" className="w-10 h-10 rounded-full bg-[#351b54] flex items-center justify-center text-white hover:bg-pink-600 hover:scale-110 transition-all duration-300"><Linkedin size={18} /></a>
            </div>
          </div>
          
          <div className="space-y-6">
            <h4 className="font-display text-2xl text-pink-300 tracking-wider uppercase">NAVIGATE</h4>
            <ul className="space-y-3 font-bold text-white/70 lowercase">
              <li><button onClick={() => navigateTo('home')} className="hover:text-white transition-colors">Home Port</button></li>
              <li><button onClick={() => navigateTo('shop')} className="hover:text-white transition-colors">Shop All Loot</button></li>
              <li><button onClick={() => setIsSizeGuideOpen(true)} className="hover:text-white transition-colors">Size Guide</button></li>
              <li><button onClick={() => navigateTo('about')} className="hover:text-white transition-colors">Our Story</button></li>
            </ul>
          </div>

          <div className="space-y-6">
            <h4 className="font-display text-2xl text-pink-300 tracking-wider uppercase">CUSTOMER FLEET</h4>
            <ul className="space-y-3 font-bold text-white/70 lowercase">
              <li><button onClick={() => window.open(`https://wa.me/1234567890?text=Ahoy!%20I%20have%20a%20question.`, '_blank')} className="hover:text-white transition-colors flex items-center gap-2 uppercase"><MessageCircle size={16}/> WhatsApp Us</button></li>
              <li><button onClick={() => navigateTo('returns')} className="hover:text-white transition-colors">Returns & Exchanges</button></li>
              <li><button onClick={() => navigateTo('shipping')} className="hover:text-white transition-colors">Shipping Policy</button></li>
              <li><button onClick={() => navigateTo('privacy')} className="hover:text-white transition-colors">Privacy Policy</button></li>
            </ul>
          </div>

        </div>
        <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-purple-900/50 flex flex-col md:flex-row justify-between items-center gap-4 text-white/40 text-sm font-bold">
          <p className="lowercase">&copy; 2026 DEMO | Built for the brave.</p>
          <div className="flex gap-4 opacity-50">
            <span className="text-2xl">💳</span>
            <span className="text-2xl">🏦</span>
            <span className="text-2xl">💰</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
