export const MOCK_ACCOUNT = {
  account_id: 101,
  username: "alex_gourmet",
  email: "alex@example.com",
  point: 320,
  shipping_info: {
    receiver_name: "Alex Johnson",
    phone_number: "0901234567",
    city: "Ho Chi Minh City",
    district: "District 1",
    address: "123 Le Loi Street, Ben Nghe Ward",
  },
};

export const MOCK_CATEGORIES = [
  {
    category_id: 0,
    category_name: "All Menu",
    description: "Explore all delicious fast foods",
  },
  {
    category_id: 1,
    category_name: "Hot Combos",
    description: "Best value combos for solo & groups",
  },
  {
    category_id: 2,
    category_name: "Burgers",
    description: "100% Angus beef & crispy chicken smash burgers",
  },
  {
    category_id: 3,
    category_name: "Crispy Chicken",
    description: "Golden crispy fried chicken pieces & wings",
  },
  {
    category_id: 4,
    category_name: "Artisan Pizza",
    description: "Fresh dough baked with premium mozzarella",
  },
  {
    category_id: 5,
    category_name: "Sides & Extras",
    description: "Golden fries, onion rings & signature dips",
  },
  {
    category_id: 6,
    category_name: "Beverages",
    description: "Ice-cold sodas, shakes & fresh lemonades",
  },
];

export const MOCK_ADDONS = [
  {
    addon_id: 1,
    addon_name: "Melted Cheddar Cheese",
    price: 1.25,
    tag: "veggie",
  },
  {
    addon_id: 2,
    addon_name: "Crispy Bacon Strips (2pcs)",
    price: 1.8,
    tag: "hot",
  },
  {
    addon_id: 3,
    addon_name: "Spicy Jalapeño Slices",
    price: 0.95,
    tag: "spicy",
  },
  {
    addon_id: 4,
    addon_name: "Smoky Garlic Mayo Dip",
    price: 0.85,
    tag: "veggie",
  },
];

export const MOCK_COMBOS = [
  {
    combo_id: 501,
    combo_name: "Ultimate Crunch Party Box",
    price: 24.99,
    original_price: 32.0,
    image:
      "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80",
    description:
      "2 Crispy Spicy Burgers + 4 Pcs Hot Wings + 1 XL Waffle Fries + 2 Cold Cokes",
    badge: "BEST SELLER",
    tag: "hot",
  },
  {
    combo_id: 502,
    combo_name: "Double Smash Burger & Wings Deal",
    price: 18.5,
    original_price: 23.5,
    image:
      "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=800&q=80",
    description:
      "Double Angus Cheeseburger + 3 Crisp Tender Strips + Seasoned Curly Fries",
    badge: "SAVER COMBO",
    tag: "hot",
  },
  {
    combo_id: 503,
    combo_name: "Family Pepperoni Feast",
    price: 22.0,
    original_price: 28.0,
    image:
      "https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?auto=format&fit=crop&w=800&q=80",
    description:
      '12" Pepperoni Passion Pizza + Cheesy Garlic Breadsticks + Dip Trio',
    badge: "FAMILY SIZE",
    tag: "veggie",
  },
];

export const MOCK_PRODUCTS = [
  {
    product_id: 1,
    category_id: 2,
    product_name: "Firecracker Jalapeño Beef Smash",
    description:
      "Double Angus smash patties, pepper jack cheese, crispy onions & spicy firecracker chili mayo.",
    image:
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80",
    status: "AVAILABLE",
    tag: "spicy",
    rating: 4.9,
    review_count: 184,
    sizes: [
      {
        product_size_id: 101,
        size_id: 1,
        size_name: "Single Patty",
        price: 8.99,
      },
      {
        product_size_id: 102,
        size_id: 2,
        size_name: "Double Patty",
        price: 11.49,
      },
      {
        product_size_id: 103,
        size_id: 3,
        size_name: "Monster Triple",
        price: 13.99,
      },
    ],
  },
  {
    product_id: 2,
    category_id: 2,
    product_name: "Smoky Bacon & Cheddar Supreme",
    description:
      "Charbroiled beef patty, melted sharp cheddar, applewood smoked bacon & BBQ drizzle.",
    image:
      "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=800&q=80",
    status: "AVAILABLE",
    tag: "hot",
    rating: 4.8,
    review_count: 142,
    sizes: [
      {
        product_size_id: 104,
        size_id: 1,
        size_name: "Regular Size",
        price: 9.49,
      },
      {
        product_size_id: 105,
        size_id: 2,
        size_name: "Hungry Large",
        price: 12.2,
      },
    ],
  },
  {
    product_id: 3,
    category_id: 3,
    product_name: "Nashville Hot Crispy Chicken Bucket",
    description:
      "Extra crunchy fresh chicken marinated in spiced buttermilk and dipped in fiery cayenne glare oil.",
    image:
      "https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?auto=format&fit=crop&w=800&q=80",
    status: "AVAILABLE",
    tag: "spicy",
    rating: 5.0,
    review_count: 310,
    sizes: [
      {
        product_size_id: 106,
        size_id: 1,
        size_name: "3 Pcs Bucket",
        price: 7.99,
      },
      {
        product_size_id: 107,
        size_id: 2,
        size_name: "6 Pcs Family",
        price: 14.5,
      },
      {
        product_size_id: 108,
        size_id: 3,
        size_name: "10 Pcs Party",
        price: 22.99,
      },
    ],
  },
  {
    product_id: 4,
    category_id: 4,
    product_name: "Signature Pepperoni & Basil Pizza",
    description:
      "Hand-tossed dough, slow-simmered tomato passata, double layered pepperoni & basil leaves.",
    image:
      "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?auto=format&fit=crop&w=800&q=80",
    status: "AVAILABLE",
    tag: "hot",
    rating: 4.9,
    review_count: 220,
    sizes: [
      {
        product_size_id: 109,
        size_id: 1,
        size_name: 'Personal 9"',
        price: 10.99,
      },
      {
        product_size_id: 110,
        size_id: 2,
        size_name: 'Medium 12"',
        price: 15.99,
      },
      {
        product_size_id: 111,
        size_id: 3,
        size_name: 'Large 15"',
        price: 19.99,
      },
    ],
  },
  {
    product_id: 5,
    category_id: 5,
    product_name: "Loaded Cheesy Bacon Waffle Fries",
    description:
      "Crispy lattice cut potatoes drenched in warm cheddar cheese sauce & real bacon crumbles.",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTKTaQObuWNE7TB8NuoOjMnxuCG2_WNxdeFTP4tpwlyL5R7cnSzq6SB5mQl&s=10",
    status: "AVAILABLE",
    tag: "veggie",
    rating: 4.7,
    review_count: 98,
    sizes: [
      {
        product_size_id: 112,
        size_id: 1,
        size_name: "Standard Box",
        price: 4.99,
      },
      {
        product_size_id: 113,
        size_id: 2,
        size_name: "Jumbo Share",
        price: 6.99,
      },
    ],
  },
  {
    product_id: 6,
    category_id: 6,
    product_name: "Salted Caramel Vanilla Shake",
    description:
      "Hand-spun whole milk ice cream blend topped with fluffy whipped cream & sea salt caramel drizzle.",
    image:
      "https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=800&q=80",
    status: "AVAILABLE",
    tag: "veggie",
    rating: 4.8,
    review_count: 115,
    sizes: [
      {
        product_size_id: 114,
        size_id: 1,
        size_name: "16 oz Regular",
        price: 3.99,
      },
      {
        product_size_id: 115,
        size_id: 2,
        size_name: "24 oz Large",
        price: 4.99,
      },
    ],
  },
];
