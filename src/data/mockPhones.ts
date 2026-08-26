import { PhoneItem } from '../types';

export const INITIAL_PHONES: PhoneItem[] = [
  // ==========================================
  // SMARTPHONES
  // ==========================================
  {
    id: "phone-ip14pm-purple-128",
    category: "Phones",
    brand: "Apple",
    model: "iPhone 14 Pro Max",
    storage: "128GB",
    colour: "Deep Purple",
    colorHex: "#593d62",
    condition: "Like New (Flawless)",
    conditionDescription: "Stunning flagship with Dynamic Island and 48MP Pro camera. 100% original Apple OLED 120Hz display with TrueTone active. Stainless steel frame mirror finish. Zero scratches.",
    batteryHealth: 88,
    price: 62999,
    originalMsp: 139900,
    priceDrop: true,
    featured: true,
    status: "Available",
    dateAdded: "2026-08-21",
    stockTag: "CK-IP14PM-881",
    screenSize: "6.7 inch",
    processor: "A16 Bionic",
    images: [
      "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=800&auto=format&fit=crop&q=80"
    ],
    inBox: {
      chargerIncluded: true,
      originalBox: true,
      taxInvoiceProvided: true,
      cableIncluded: true,
    },
    keyFeatures: [
      "Dynamic Island interactive notifications",
      "48MP Quad-Pixel sensor with Photonic Engine",
      "6.7-inch Super Retina XDR 120Hz ProMotion",
      "A16 Bionic 6-core processor",
      "Stainless steel surgical-grade chassis"
    ],
    inspectionPassed: [
      "Original Apple OLED Panel (TrueTone 100% Active)",
      "Face ID Optical & TrueDepth Sensor Passed",
      "Original Factory Battery (Zero BMS reprogramming)",
      "All 3 Stereo Microphones & Speakers Passed",
      "5G Dual SIM (Physical SIM + eSIM) Verified",
      "MagSafe 15W Wireless Fast Charging Passed"
    ]
  },

  {
    id: "phone-ip15pm-nat-256",
    category: "Phones",
    brand: "Apple",
    model: "iPhone 15 Pro Max",
    storage: "256GB",
    colour: "Natural Titanium",
    colorHex: "#94a3b8",
    condition: "Like New (Flawless)",
    conditionDescription: "Grade A+ pristine unit. Titanium aerospace frame with Action button and USB-C. Under remaining Apple Limited Warranty. 5x Optical Telephoto periscope camera.",
    batteryHealth: 96,
    price: 89999,
    originalMsp: 159900,
    priceDrop: true,
    featured: true,
    status: "Available",
    dateAdded: "2026-08-21",
    stockTag: "CK-IP15PM-962",
    screenSize: "6.7 inch",
    processor: "A17 Pro",
    images: [
      "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&auto=format&fit=crop&q=80"
    ],
    inBox: {
      chargerIncluded: false,
      originalBox: true,
      taxInvoiceProvided: true,
      cableIncluded: true,
    },
    keyFeatures: [
      "Grade 5 Titanium lightweight frame with Action Button",
      "A17 Pro console-grade gaming chip (3nm)",
      "5x Telephoto optical zoom lens (120mm focal length)",
      "USB-C port with 10Gbps USB 3 data transfer",
      "Always-On ProMotion 120Hz display"
    ],
    inspectionPassed: [
      "Official Apple Limited Warranty active",
      "Titanium rails clean with zero dents",
      "Dynamic Island & Action button 100% functional",
      "Camera Sensor Shift OIS & 5x Zoom clear",
      "Original Battery Health verified on 3uTools"
    ]
  },

  {
    id: "phone-ip13pm-sierra-128",
    category: "Phones",
    brand: "Apple",
    model: "iPhone 13 Pro Max",
    storage: "128GB",
    colour: "Sierra Blue",
    colorHex: "#93c5fd",
    condition: "Excellent (9.5/10)",
    conditionDescription: "Legendary battery longevity powerhouse. 120Hz ProMotion Super Retina XDR OLED display. Very well maintained with tempered glass and case since day 1.",
    batteryHealth: 87,
    price: 48999,
    originalMsp: 129900,
    priceDrop: true,
    featured: true,
    status: "Available",
    dateAdded: "2026-08-20",
    stockTag: "CK-IP13PM-873",
    screenSize: "6.7 inch",
    processor: "A15 Bionic",
    images: [
      "https://images.unsplash.com/photo-1591337676887-a217a6970a8a?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1616348436168-de43ad0db179?w=800&auto=format&fit=crop&q=80"
    ],
    inBox: {
      chargerIncluded: true,
      originalBox: true,
      taxInvoiceProvided: true,
      cableIncluded: true,
    },
    keyFeatures: [
      "6.7-inch ProMotion 120Hz Super Retina XDR",
      "A15 Bionic 5-core GPU processor",
      "Triple 12MP Pro camera with 3x optical zoom & Macro",
      "Stainless steel body with textured matte glass"
    ],
    inspectionPassed: [
      "Original Factory Display with TrueTone active",
      "Face ID sensor passed optical test",
      "3x Optical Zoom & Macro mode crystal sharp",
      "Original unboosted battery health 87%",
      "Dual speaker balanced acoustic output"
    ]
  },

  {
    id: "phone-s24u-titanium-256",
    category: "Phones",
    brand: "Samsung",
    model: "Galaxy S24 Ultra 5G",
    storage: "256GB",
    colour: "Titanium Gray",
    colorHex: "#64748b",
    condition: "Like New (Flawless)",
    conditionDescription: "Samsung Galaxy AI flagship! Flat Corning Gorilla Armor anti-reflective display, Titanium frame, 200MP Quad-Tele camera system, S-Pen included.",
    batteryHealth: 99,
    price: 79999,
    originalMsp: 129999,
    priceDrop: true,
    featured: true,
    status: "Available",
    dateAdded: "2026-08-21",
    stockTag: "CK-S24U-991",
    screenSize: "6.8 inch",
    processor: "Snapdragon 8 Gen 3 for Galaxy",
    images: [
      "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1580910051074-3eb694886505?w=800&auto=format&fit=crop&q=80"
    ],
    inBox: {
      chargerIncluded: true,
      originalBox: true,
      taxInvoiceProvided: true,
      cableIncluded: true,
    },
    keyFeatures: [
      "Galaxy AI (Circle to Search, Live Translate, Note Assist)",
      "Snapdragon 8 Gen 3 for Galaxy processor",
      "Flat 6.8-inch Dynamic AMOLED 2X 120Hz (2600 nits peak)",
      "200MP Main + 50MP 5x Optical + 10MP 3x Optical + 12MP Ultra-Wide",
      "Embedded Bluetooth S-Pen stylus"
    ],
    inspectionPassed: [
      "Gorilla Armor flat glass 100% scratch free",
      "S-Pen gesture controls & digitizer responsive",
      "200MP sensor and 100x Space Zoom verified",
      "Ultrasonic Fingerprint scanner responsive",
      "Samsung Knox security status untouched (0x0)"
    ]
  },

  {
    id: "phone-op12-emerald-256",
    category: "Phones",
    brand: "OnePlus",
    model: "OnePlus 12 5G",
    storage: "256GB",
    colour: "Flowy Emerald",
    colorHex: "#047857",
    condition: "Like New (Flawless)",
    conditionDescription: "Flagship killer powerhouse! 4th Gen Hasselblad camera with 64MP 3x periscope telephoto, 2K 120Hz ProXDR display, Snapdragon 8 Gen 3, 5400mAh battery.",
    batteryHealth: 99,
    price: 44999,
    originalMsp: 64999,
    priceDrop: true,
    featured: true,
    status: "Available",
    dateAdded: "2026-08-21",
    stockTag: "CK-OP12-991",
    screenSize: "6.82 inch",
    processor: "Snapdragon 8 Gen 3",
    images: [
      "https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1546054454-aa26e2b734c7?w=800&auto=format&fit=crop&q=80"
    ],
    inBox: {
      chargerIncluded: true,
      originalBox: true,
      taxInvoiceProvided: true,
      cableIncluded: true,
    },
    keyFeatures: [
      "Snapdragon 8 Gen 3 with 16GB LPDDR5X RAM",
      "Hasselblad Camera with 64MP Periscope Telephoto",
      "2K 120Hz ProXDR 4500 nits display with Aqua Touch",
      "5400 mAh Battery with 100W SuperVOOC"
    ],
    inspectionPassed: [
      "100W SuperVOOC charging verified",
      "Aqua Touch wet-hand touch functionality passed",
      "Hasselblad color sensor calibrated",
      "Original Battery Health 99%"
    ]
  },

  // ==========================================
  // WATCHES (SMARTWATCHES)
  // ==========================================
  {
    id: "watch-apple-ultra2-titanium",
    category: "Watches",
    brand: "Apple",
    model: "Apple Watch Ultra 2 (GPS + Cellular, 49mm)",
    storage: "64GB",
    colour: "Natural Titanium / Orange Ocean Band",
    colorHex: "#e2e8f0",
    condition: "Like New (Flawless)",
    conditionDescription: "The ultimate rugged outdoor smartwatch. 3000 nits edge-to-edge sapphire crystal display, dual-frequency precision GPS, Depth gauge, Action button.",
    batteryHealth: 98,
    price: 52999,
    originalMsp: 89900,
    priceDrop: true,
    featured: true,
    status: "Available",
    dateAdded: "2026-08-20",
    stockTag: "CK-WT-U2-981",
    screenSize: "49mm Titanium Case",
    processor: "S9 SiP with Double Tap gesture",
    images: [
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=800&auto=format&fit=crop&q=80"
    ],
    inBox: {
      chargerIncluded: true,
      originalBox: true,
      taxInvoiceProvided: true,
      cableIncluded: true,
    },
    keyFeatures: [
      "49mm aerospace-grade titanium case with raised sapphire edge",
      "3000 nits bright Always-On Retina display",
      "S9 SiP chip with Double Tap hand gesture control",
      "Precision dual-frequency GPS (L1 and L5)",
      "Up to 36 hours regular use / 72 hours low power mode"
    ],
    inspectionPassed: [
      "Sapphire front glass flawless without scratches",
      "ECG & Blood Oxygen optical sensors verified",
      "Digital Crown & Action button tactile feedback 100%",
      "Cellular eSIM activation tested",
      "Original Apple Magnetic Fast Charger included"
    ]
  },

  {
    id: "watch-apple-series9-starlight",
    category: "Watches",
    brand: "Apple",
    model: "Apple Watch Series 9 (GPS, 45mm)",
    storage: "64GB",
    colour: "Starlight Aluminum",
    colorHex: "#f5f5f4",
    condition: "Like New (Flawless)",
    conditionDescription: "Pristine condition. S9 chip with Double Tap gesture, 2000 nits display, fast charging. Clean starlight sport band.",
    batteryHealth: 99,
    price: 26999,
    originalMsp: 44900,
    priceDrop: true,
    featured: false,
    status: "Available",
    dateAdded: "2026-08-19",
    stockTag: "CK-WT-S9-991",
    screenSize: "45mm Aluminum",
    processor: "S9 SiP",
    images: [
      "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80"
    ],
    inBox: {
      chargerIncluded: true,
      originalBox: true,
      taxInvoiceProvided: true,
      cableIncluded: true,
    },
    keyFeatures: [
      "Double tap gesture navigation",
      "2000 nits edge-to-edge Retina display",
      "S9 SiP high speed dual-core processor",
      "Crash Detection & Fall Detection sensors"
    ],
    inspectionPassed: [
      "Original Display & Touch Digitizer passed",
      "Heart Rate & Temperature sensor passed",
      "Original unboosted battery health 99%",
      "Magnetic charging verified"
    ]
  },

  {
    id: "watch-galaxy-watch6-classic-47",
    category: "Watches",
    brand: "Samsung",
    model: "Galaxy Watch 6 Classic (Bluetooth + LTE, 47mm)",
    storage: "16GB",
    colour: "Black Stainless Steel",
    colorHex: "#1e293b",
    condition: "Like New (Flawless)",
    conditionDescription: "Iconic rotating mechanical bezel! Stainless steel premium case with sapphire crystal glass. Advanced Sleep Coaching & BioActive Sensor.",
    batteryHealth: 97,
    price: 18999,
    originalMsp: 40999,
    priceDrop: true,
    featured: true,
    status: "Available",
    dateAdded: "2026-08-18",
    stockTag: "CK-WT-GW6C-971",
    screenSize: "47mm Classic (1.5 inch Super AMOLED)",
    processor: "Exynos W930 Dual-Core",
    images: [
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&auto=format&fit=crop&q=80"
    ],
    inBox: {
      chargerIncluded: true,
      originalBox: true,
      taxInvoiceProvided: true,
      cableIncluded: true,
    },
    keyFeatures: [
      "Physical rotating bezel with tactile haptic clicks",
      "Sapphire Crystal 2000 nits Super AMOLED display",
      "3-in-1 Samsung BioActive Sensor (ECG, BIA body composition, Optical HR)",
      "Wireless PowerShare compatible"
    ],
    inspectionPassed: [
      "Mechanical bezel rotation smooth & responsive",
      "BioActive Sensor passed calibration test",
      "LTE calling and Samsung Pay NFC tested",
      "Battery health 97% verified"
    ]
  },

  // ==========================================
  // TABLETS (iPads & Galaxy Tabs)
  // ==========================================
  {
    id: "tablet-ipad-pro-129-m2-256",
    category: "Tablets",
    brand: "Apple",
    model: "iPad Pro 12.9-inch (6th Gen, M2 Chip, Wi-Fi)",
    storage: "256GB",
    colour: "Space Gray",
    colorHex: "#334155",
    condition: "Like New (Flawless)",
    conditionDescription: "Pro computing powerhouse! Liquid Retina XDR Mini-LED display with 1600 nits peak brightness and 120Hz ProMotion. Apple M2 processor with Apple Pencil hover.",
    batteryHealth: 95,
    price: 68999,
    originalMsp: 122900,
    priceDrop: true,
    featured: true,
    status: "Available",
    dateAdded: "2026-08-20",
    stockTag: "CK-TAB-IPM2-951",
    screenSize: "12.9 inch Liquid Retina XDR (Mini-LED)",
    ram: "8GB Unified",
    processor: "Apple M2 (8-core CPU, 10-core GPU)",
    images: [
      "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1561154464-82e9adf32764?w=800&auto=format&fit=crop&q=80"
    ],
    inBox: {
      chargerIncluded: true,
      originalBox: true,
      taxInvoiceProvided: true,
      cableIncluded: true,
    },
    keyFeatures: [
      "12.9-inch Mini-LED Liquid Retina XDR 120Hz ProMotion",
      "Apple M2 8-core CPU / 10-core GPU / 16-core Neural Engine",
      "Apple Pencil 2nd Gen hover support",
      "Thunderbolt / USB 4 port (up to 40Gbps)",
      "Four speaker audio with Studio-quality mics"
    ],
    inspectionPassed: [
      "Mini-LED backlight zones 100% uniform (Zero dead pixels)",
      "Face ID camera array & Center Stage tested",
      "Thunderbolt video output & fast charging passed",
      "Apple Pencil magnetic charging dock verified"
    ]
  },

  {
    id: "tablet-ipad-air5-m1-64",
    category: "Tablets",
    brand: "Apple",
    model: "iPad Air (5th Gen, M1 Chip, Wi-Fi)",
    storage: "64GB",
    colour: "Blue",
    colorHex: "#38bdf8",
    condition: "Excellent (9.5/10)",
    conditionDescription: "Super lightweight with flagship Apple M1 silicon. 10.9-inch Liquid Retina TrueTone display, Touch ID in top button, stereo speakers in landscape.",
    batteryHealth: 93,
    price: 36999,
    originalMsp: 59900,
    priceDrop: true,
    featured: false,
    status: "Available",
    dateAdded: "2026-08-19",
    stockTag: "CK-TAB-AIR5-931",
    screenSize: "10.9 inch Liquid Retina",
    ram: "8GB Unified",
    processor: "Apple M1",
    images: [
      "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1561154464-82e9adf32764?w=800&auto=format&fit=crop&q=80"
    ],
    inBox: {
      chargerIncluded: true,
      originalBox: true,
      taxInvoiceProvided: true,
      cableIncluded: true,
    },
    keyFeatures: [
      "Apple M1 desktop-class chip",
      "10.9-inch Liquid Retina display with True Tone & P3 color",
      "Touch ID embedded in power button",
      "USB-C port with 2x faster transfer speeds"
    ],
    inspectionPassed: [
      "Original Apple Retina display verified",
      "Touch ID sensor instant recognition",
      "Landscape stereo speakers loud and clear",
      "Original battery health 93%"
    ]
  },

  {
    id: "tablet-samsung-tabs9-ultra-256",
    category: "Tablets",
    brand: "Samsung",
    model: "Galaxy Tab S9 Ultra (14.6-inch, Wi-Fi)",
    storage: "256GB",
    colour: "Graphite",
    colorHex: "#18181b",
    condition: "Like New (Flawless)",
    conditionDescription: "Colossal 14.6-inch Dynamic AMOLED 2X 120Hz display with S-Pen included! IP68 water & dust resistance, Snapdragon 8 Gen 2 for Galaxy, Samsung DeX workstation.",
    batteryHealth: 98,
    price: 64999,
    originalMsp: 108999,
    priceDrop: true,
    featured: true,
    status: "Available",
    dateAdded: "2026-08-20",
    stockTag: "CK-TAB-S9U-981",
    screenSize: "14.6 inch Dynamic AMOLED 2X (120Hz)",
    ram: "12GB",
    processor: "Snapdragon 8 Gen 2 for Galaxy",
    images: [
      "https://images.unsplash.com/photo-1561154464-82e9adf32764?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&auto=format&fit=crop&q=80"
    ],
    inBox: {
      chargerIncluded: true,
      originalBox: true,
      taxInvoiceProvided: true,
      cableIncluded: true,
    },
    keyFeatures: [
      "Massive 14.6-inch Dynamic AMOLED 2X 120Hz display",
      "Included IP68 bi-directional charging S-Pen",
      "Samsung Wireless DeX desktop workspace",
      "Quad AKG speakers with Dolby Atmos"
    ],
    inspectionPassed: [
      "14.6-inch AMOLED display zero tint or dead pixels",
      "S-Pen low latency writing tested",
      "Under-display optical fingerprint scanner passed",
      "Dual front 12MP ultrawide cameras verified"
    ]
  },

  // ==========================================
  // LAPTOPS (MacBooks & Ultrabooks)
  // ==========================================
  {
    id: "laptop-macbook-pro-14-m3pro-512",
    category: "Laptops",
    brand: "Apple",
    model: "MacBook Pro 14-inch (M3 Pro, 18GB Unified / 512GB SSD)",
    storage: "512GB",
    colour: "Space Black",
    colorHex: "#0f172a",
    condition: "Like New (Flawless)",
    conditionDescription: "Stunning Space Black finish with anodized seal to reduce fingerprints. Apple M3 Pro 11-core CPU / 14-core GPU. Liquid Retina XDR 120Hz ProMotion screen. Low battery cycle count.",
    batteryHealth: 99,
    price: 139999,
    originalMsp: 199900,
    priceDrop: true,
    featured: true,
    status: "Available",
    dateAdded: "2026-08-21",
    stockTag: "CK-LAP-MBP14M3-991",
    screenSize: "14.2 inch Liquid Retina XDR",
    ram: "18GB Unified RAM",
    processor: "Apple M3 Pro (11-core CPU, 14-core GPU)",
    images: [
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800&auto=format&fit=crop&q=80"
    ],
    inBox: {
      chargerIncluded: true,
      originalBox: true,
      taxInvoiceProvided: true,
      cableIncluded: true,
    },
    keyFeatures: [
      "Apple M3 Pro chip with hardware-accelerated ray tracing",
      "14.2-inch Liquid Retina XDR 120Hz (1000 nits sustained, 1600 peak)",
      "Space Black anodization with fingerprint-resistant coating",
      "MagSafe 3, 3x Thunderbolt 4 ports, HDMI, SDXC card slot",
      "Up to 18 hours battery backup with fast charging"
    ],
    inspectionPassed: [
      "Original Factory Apple Silicon Diagnostic: PASSED",
      "Liquid Retina XDR screen 100% flawless",
      "Magic Keyboard with Touch ID & Force Touch Trackpad verified",
      "Original Apple 70W USB-C Power Adapter + Braided MagSafe cable",
      "Cycle count under 25 cycles with 99% original health"
    ]
  },

  {
    id: "laptop-macbook-air-13-m2-256",
    category: "Laptops",
    brand: "Apple",
    model: "MacBook Air 13.6-inch (M2 Chip, 8GB / 256GB SSD)",
    storage: "256GB",
    colour: "Midnight",
    colorHex: "#1e293b",
    condition: "Like New (Flawless)",
    conditionDescription: "Ultra-slim 11.3mm fanless silent design. 13.6-inch Liquid Retina display with 500 nits brightness, MagSafe 3 charging, 1080p FaceTime HD camera, 18-hour battery.",
    batteryHealth: 96,
    price: 64999,
    originalMsp: 99900,
    priceDrop: true,
    featured: true,
    status: "Available",
    dateAdded: "2026-08-20",
    stockTag: "CK-LAP-MBA13M2-961",
    screenSize: "13.6 inch Liquid Retina",
    ram: "8GB Unified RAM",
    processor: "Apple M2 (8-core CPU, 8-core GPU)",
    images: [
      "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=80"
    ],
    inBox: {
      chargerIncluded: true,
      originalBox: true,
      taxInvoiceProvided: true,
      cableIncluded: true,
    },
    keyFeatures: [
      "Apple M2 next-gen silicon with fanless silent operation",
      "13.6-inch Liquid Retina with 1 billion colors support",
      "Dedicated MagSafe 3 charging port + 2x Thunderbolt ports",
      "Spatial Audio four-speaker sound system"
    ],
    inspectionPassed: [
      "Battery health 96% with low cycle count",
      "Liquid Retina screen crystal clear with TrueTone active",
      "Touch ID instantaneous fingerprint scan passed",
      "Original MagSafe 30W Power Adapter included"
    ]
  },

  {
    id: "laptop-dell-xps-15-9530",
    category: "Laptops",
    brand: "Dell",
    model: "Dell XPS 15 9530 (Core i7-13700H / 32GB RAM / 1TB SSD / RTX 4060)",
    storage: "1TB",
    colour: "Platinum Silver / Black Carbon Fiber",
    colorHex: "#64748b",
    condition: "Excellent (9.5/10)",
    conditionDescription: "Creator & engineering beast! 3.5K OLED InfinityEdge touch screen, CNC machined aluminum chassis with aerospace carbon fiber palm rest. Dedicated NVIDIA RTX 4060 8GB GPU.",
    batteryHealth: 94,
    price: 114999,
    originalMsp: 219000,
    priceDrop: true,
    featured: false,
    status: "Available",
    dateAdded: "2026-08-19",
    stockTag: "CK-LAP-XPS15-941",
    screenSize: "15.6 inch 3.5K (3456x2160) OLED Touch",
    ram: "32GB DDR5 Dual-Channel",
    processor: "Intel Core i7-13700H (14-Core) + RTX 4060 8GB",
    images: [
      "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=80"
    ],
    inBox: {
      chargerIncluded: true,
      originalBox: true,
      taxInvoiceProvided: true,
      cableIncluded: true,
    },
    keyFeatures: [
      "15.6-inch 3.5K OLED InfinityEdge 100% DCI-P3 touch screen",
      "Intel 13th Gen i7-13700H 14 Cores / 20 Threads",
      "NVIDIA GeForce RTX 4060 8GB GDDR6 dedicated graphics",
      "86Wh large battery with 130W Type-C adapter"
    ],
    inspectionPassed: [
      "OLED panel zero burn-in or color tinting",
      "Dual high-speed cooling fans dust cleaned & repasted",
      "Dell Hardware Diagnostics Passed 100%",
      "Windows 11 Pro genuine digital license activated"
    ]
  },

  // ==========================================
  // ACCESSORIES
  // ==========================================
  {
    id: "acc-apple-20w-charger-orig",
    category: "Accessories",
    brand: "Apple",
    model: "Apple 20W USB-C Power Adapter (Original)",
    storage: "N/A",
    colour: "White",
    colorHex: "#f8fafc",
    condition: "Like New (Flawless)",
    conditionDescription: "100% Genuine original Apple 20W Power Delivery adapter. Delivers fast charging up to 50% battery in 30 minutes for iPhone 12/13/14/15/16 and iPads.",
    price: 1299,
    originalMsp: 1900,
    priceDrop: true,
    featured: false,
    status: "Available",
    dateAdded: "2026-08-21",
    stockTag: "CK-ACC-20W-01",
    images: [
      "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=800&auto=format&fit=crop&q=80"
    ],
    inBox: {
      chargerIncluded: true,
      originalBox: true,
      taxInvoiceProvided: true,
      cableIncluded: false,
    },
    keyFeatures: [
      "Genuine Apple OEM internal circuitry with over-voltage safety",
      "20W Power Delivery 3.0 protocol",
      "Universal compatibility with all Type-C fast charging devices"
    ],
    inspectionPassed: [
      "Original Apple serial number verified",
      "Tested on digital multimeter power bench"
    ]
  },

  {
    id: "acc-magsafe-wireless-powerbank",
    category: "Accessories",
    brand: "Cortek Select",
    model: "10,000mAh MagSafe Magnetic Wireless Fast Power Bank",
    storage: "N/A",
    colour: "Titanium Gray",
    colorHex: "#64748b",
    condition: "Like New (Flawless)",
    conditionDescription: "Ultra-strong N52 magnetic snap-on battery pack with LED battery percentage display, 15W wireless output + 22.5W PD Type-C fast input/output.",
    price: 1599,
    originalMsp: 2999,
    priceDrop: true,
    featured: true,
    status: "Available",
    dateAdded: "2026-08-20",
    stockTag: "CK-ACC-PB10K-02",
    images: [
      "https://images.unsplash.com/photo-1622445262464-84b1456045b6?w=800&auto=format&fit=crop&q=80"
    ],
    inBox: {
      chargerIncluded: false,
      originalBox: true,
      taxInvoiceProvided: true,
      cableIncluded: true,
    },
    keyFeatures: [
      "10,000mAh high density Lithium Polymer cell",
      "15W MagSafe magnetic wireless charging",
      "22.5W wired Type-C PD two-way fast charge",
      "LED digital power display"
    ],
    inspectionPassed: [
      "Magnetic hold capacity tested on iPhone 15 Pro",
      "Battery charge/discharge cycle verified"
    ]
  },

  // ==========================================
  // OTHER GADGETS (AirPods, Audio, Gimbals)
  // ==========================================
  {
    id: "gadget-airpods-pro-2-usbc",
    category: "Other Gadgets",
    brand: "Apple",
    model: "AirPods Pro (2nd Generation, USB-C MagSafe Case)",
    storage: "N/A",
    colour: "White",
    colorHex: "#ffffff",
    condition: "Like New (Flawless)",
    conditionDescription: "Pro active noise cancellation (2x more effective), Adaptive Audio, Transparency mode, Personalized Spatial Audio. USB-C charging case with lanyard loop and Precision Finding speaker.",
    batteryHealth: 98,
    price: 15499,
    originalMsp: 24900,
    priceDrop: true,
    featured: true,
    status: "Available",
    dateAdded: "2026-08-21",
    stockTag: "CK-GDT-APP2-981",
    processor: "Apple H2 Headphone Chip",
    images: [
      "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&auto=format&fit=crop&q=80"
    ],
    inBox: {
      chargerIncluded: false,
      originalBox: true,
      taxInvoiceProvided: true,
      cableIncluded: true,
    },
    keyFeatures: [
      "Apple H2 chip with 2x Active Noise Cancellation",
      "USB-C MagSafe case with Precision Finding (U1 chip) & speaker",
      "Adaptive Audio & Conversation Awareness",
      "Touch volume swipe control on stem",
      "IP54 dust, sweat, and water resistance"
    ],
    inspectionPassed: [
      "Original Apple serial number verified in iOS Settings",
      "Active Noise Cancellation & Transparency tested",
      "Left & Right audio drivers clean without distortion",
      "Original ear tips sanitized + replacement sizes included"
    ]
  },

  {
    id: "gadget-dji-osmo-mobile-6",
    category: "Other Gadgets",
    brand: "DJI",
    model: "DJI Osmo Mobile 6 (OM6) 3-Axis Smartphone Gimbal",
    storage: "N/A",
    colour: "Slate Gray",
    colorHex: "#475569",
    condition: "Like New (Flawless)",
    conditionDescription: "Portable 3-axis motorized stabilizer with built-in extension rod for selfies & low angles, ActiveTrack 6.0 subject tracking, magnetic quick-release phone clamp.",
    batteryHealth: 99,
    price: 8499,
    originalMsp: 13990,
    priceDrop: true,
    featured: false,
    status: "Available",
    dateAdded: "2026-08-19",
    stockTag: "CK-GDT-DJIOM6-991",
    images: [
      "https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&auto=format&fit=crop&q=80"
    ],
    inBox: {
      chargerIncluded: false,
      originalBox: true,
      taxInvoiceProvided: true,
      cableIncluded: true,
    },
    keyFeatures: [
      "3-Axis Motorized Stabilization with brushless gimbal motors",
      "Built-in 215mm extension selfie rod",
      "ActiveTrack 6.0 smart subject auto-tracking",
      "Quick Launch & DJI Mimo camera app integration"
    ],
    inspectionPassed: [
      "All 3 motorized axes calibrated & balanced",
      "Magnetic phone clamp grip strength verified",
      "Built-in extension rod smooth sliding",
      "Battery holding full runtime tested"
    ]
  }
];
