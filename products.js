const PRODUCTS = [
  {
    id: 1,
    name: "Oversize футболка Classic",
    category: "Футболки",
    price: 18000,
    discount: 0,
    rating: 4.8,
    isNew: true,
    colors: [
      { name: "Белый", hex: "#f3f4f6" },
      { name: "Черный", hex: "#111827" },
      { name: "Бежевый", hex: "#d6c3a5" }
    ],
    sizes: ["S", "M", "L", "XL"],
    description: "Базовая oversize-футболка из мягкого хлопка."
  },
  {
    id: 2,
    name: "Худи Urban Soft",
    category: "Худи",
    price: 32000,
    discount: 10,
    rating: 4.9,
    isNew: false,
    colors: [
      { name: "Черный", hex: "#111827" },
      { name: "Серый", hex: "#9ca3af" },
      { name: "Синий", hex: "#1d4ed8" }
    ],
    sizes: ["S", "M", "L", "XL"],
    description: "Комфортное худи на каждый день."
  },
  {
    id: 3,
    name: "Свитшот Minimal",
    category: "Свитшоты",
    price: 28000,
    discount: 0,
    rating: 4.7,
    isNew: true,
    colors: [
      { name: "Молочный", hex: "#f8f5ef" },
      { name: "Оливковый", hex: "#657153" },
      { name: "Черный", hex: "#111827" }
    ],
    sizes: ["S", "M", "L"],
    description: "Минималистичный свитшот в спокойных оттенках."
  },
  {
    id: 4,
    name: "Джинсы Straight Fit",
    category: "Джинсы",
    price: 36000,
    discount: 15,
    rating: 4.8,
    isNew: false,
    colors: [
      { name: "Синий", hex: "#1e3a8a" },
      { name: "Голубой", hex: "#60a5fa" }
    ],
    sizes: ["S", "M", "L", "XL"],
    description: "Прямой крой и универсальная посадка."
  },
  {
    id: 5,
    name: "Брюки Relaxed",
    category: "Брюки",
    price: 34000,
    discount: 0,
    rating: 4.6,
    isNew: false,
    colors: [
      { name: "Черный", hex: "#111827" },
      { name: "Бежевый", hex: "#d6c3a5" },
      { name: "Серый", hex: "#9ca3af" }
    ],
    sizes: ["S", "M", "L", "XL"],
    description: "Свободные брюки для повседневных образов."
  },
  {
    id: 6,
    name: "Куртка Street Shell",
    category: "Куртки",
    price: 78000,
    discount: 10,
    rating: 5.0,
    isNew: true,
    colors: [
      { name: "Черный", hex: "#111827" },
      { name: "Хаки", hex: "#4d5d53" }
    ],
    sizes: ["M", "L", "XL"],
    description: "Легкая стильная куртка с акцентом на силуэт."
  },
  {
    id: 7,
    name: "Пальто City Line",
    category: "Пальто",
    price: 95000,
    discount: 0,
    rating: 4.9,
    isNew: true,
    colors: [
      { name: "Графит", hex: "#374151" },
      { name: "Карамельный", hex: "#a16207" }
    ],
    sizes: ["S", "M", "L"],
    description: "Элегантное пальто для чистого городского образа."
  },
  {
    id: 8,
    name: "Рубашка Cotton Box",
    category: "Рубашки",
    price: 26000,
    discount: 5,
    rating: 4.7,
    isNew: false,
    colors: [
      { name: "Белый", hex: "#f3f4f6" },
      { name: "Голубой", hex: "#93c5fd" },
      { name: "Черный", hex: "#111827" }
    ],
    sizes: ["S", "M", "L", "XL"],
    description: "Легкая рубашка свободного кроя."
  },
  {
    id: 9,
    name: "Жилет Layer",
    category: "Жилеты",
    price: 29000,
    discount: 0,
    rating: 4.5,
    isNew: true,
    colors: [
      { name: "Черный", hex: "#111827" },
      { name: "Молочный", hex: "#f8f5ef" }
    ],
    sizes: ["S", "M", "L"],
    description: "Стильный жилет для многослойных образов."
  },
  {
    id: 10,
    name: "Шорты Summer Flow",
    category: "Шорты",
    price: 22000,
    discount: 0,
    rating: 4.4,
    isNew: false,
    colors: [
      { name: "Бежевый", hex: "#d6c3a5" },
      { name: "Черный", hex: "#111827" },
      { name: "Оливковый", hex: "#657153" }
    ],
    sizes: ["S", "M", "L", "XL"],
    description: "Легкие шорты для теплой погоды."
  },
  {
    id: 11,
    name: "Лонгслив Mono",
    category: "Лонгсливы",
    price: 21000,
    discount: 0,
    rating: 4.6,
    isNew: true,
    colors: [
      { name: "Белый", hex: "#f3f4f6" },
      { name: "Черный", hex: "#111827" },
      { name: "Серый", hex: "#9ca3af" }
    ],
    sizes: ["S", "M", "L", "XL"],
    description: "Универсальный лонгслив под любой образ."
  },
  {
    id: 12,
    name: "Бомбер Club Edition",
    category: "Куртки",
    price: 68000,
    discount: 12,
    rating: 4.8,
    isNew: false,
    colors: [
      { name: "Черный", hex: "#111827" },
      { name: "Бордовый", hex: "#7f1d1d" }
    ],
    sizes: ["M", "L", "XL"],
    description: "Эффектный бомбер в стиле streetwear."
  }
];
