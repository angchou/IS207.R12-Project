// ============================================================================
// MOCK DATA STRICTLY MATCHING DATABASE.TXT SCHEMA
// ============================================================================

// 1. Table ROLE (role_id, role_name)
export const MOCK_ROLES = [
  { role_id: 1, role_name: "ADMIN" },
  { role_id: 2, role_name: "CUSTOMER" },
  { role_id: 3, role_name: "SHIPPER" },
];

// 2. Table ACCOUNT (account_id, role_id, username, email, password, point, created_at)
export const MOCK_ACCOUNTS = [
  {
    account_id: 101,
    role_id: 2,
    username: "alex_gourmet",
    email: "alex@example.com",
    password: "hashed_password_101",
    point: 320,
    created_at: "2026-01-15 09:30:00",
  },
  {
    account_id: 102,
    role_id: 2,
    username: "sarah_connor",
    email: "sarah.c@example.com",
    password: "hashed_password_102",
    point: 540,
    created_at: "2026-02-10 14:20:00",
  },
  {
    account_id: 103,
    role_id: 2,
    username: "marcus_chen",
    email: "marcus.chen@example.com",
    password: "hashed_password_103",
    point: 180,
    created_at: "2026-03-05 18:45:00",
  },
  {
    account_id: 104,
    role_id: 2,
    username: "emily_watson",
    email: "emily.w@example.com",
    password: "hashed_password_104",
    point: 890,
    created_at: "2026-03-22 11:10:00",
  },
  {
    account_id: 105,
    role_id: 2,
    username: "david_miller",
    email: "david.m@example.com",
    password: "hashed_password_105",
    point: 410,
    created_at: "2026-04-12 20:00:00",
  },
  {
    account_id: 106,
    role_id: 2,
    username: "chloe_nguyen",
    email: "chloe.n@example.com",
    password: "hashed_password_106",
    point: 250,
    created_at: "2026-05-01 16:15:00",
  },
  {
    account_id: 201,
    role_id: 3,
    username: "shipper_john",
    email: "john.shipper@foody.com",
    password: "hashed_password_201",
    point: 450,
    created_at: "2026-01-05 08:00:00",
  },
  {
    account_id: 301,
    role_id: 1,
    username: "admin_super",
    email: "admin@foody.com",
    password: "hashed_password_301",
    point: 0,
    created_at: "2026-01-01 00:00:00",
  },
];

export const MOCK_SHIPPERS = MOCK_ACCOUNTS.filter((acc) => acc.role_id === 3);

export const MOCK_ACCOUNT = MOCK_ACCOUNTS[0];

// 3. Table SHIPPING_INFO (info_id, account_id, receiver_name, phone_number, city, district, address)
export const MOCK_SHIPPING_INFOS = [
  {
    info_id: 1,
    account_id: 101,
    receiver_name: "Alex Johnson",
    phone_number: "0901234567",
    city: "Ho Chi Minh City",
    district: "District 1",
    address: "123 Le Loi Street, Ben Nghe Ward",
  },
  {
    info_id: 2,
    account_id: 102,
    receiver_name: "Sarah Connor",
    phone_number: "0912345678",
    city: "Ho Chi Minh City",
    district: "District 3",
    address: "45B Nguyen Dinh Chieu Street, Ward 6",
  },
  {
    info_id: 3,
    account_id: 103,
    receiver_name: "Marcus Chen",
    phone_number: "0987654321",
    city: "Ho Chi Minh City",
    district: "Thu Duc City",
    address: "Quarter 6, Linh Trung Ward, University Village",
  },
  {
    info_id: 4,
    account_id: 104,
    receiver_name: "Emily Watson",
    phone_number: "0933445566",
    city: "Ho Chi Minh City",
    district: "Binh Thanh District",
    address: "720A Dien Bien Phu Street, Vinhomes Central Park",
  },
  {
    info_id: 5,
    account_id: 105,
    receiver_name: "David Miller",
    phone_number: "0977889900",
    city: "Ho Chi Minh City",
    district: "District 7",
    address: "105 Nguyen Duc Canh Street, Phu My Hung",
  },
  {
    info_id: 6,
    account_id: 106,
    receiver_name: "Chloe Nguyen",
    phone_number: "0944556677",
    city: "Ho Chi Minh City",
    district: "District 10",
    address: "285 Cach Mang Thang Tam Street, Ward 12",
  },
];

// 4. Table PRODUCT_CATEGORY (category_id, category_name)
export const MOCK_CATEGORIES = [
  { category_id: 0, category_name: "All Menu" },
  { category_id: 1, category_name: "Hot Combos" },
  { category_id: 2, category_name: "Burgers" },
  { category_id: 3, category_name: "Crispy Chicken" },
  { category_id: 4, category_name: "Artisan Pizza" },
  { category_id: 5, category_name: "Sides & Extras" },
  { category_id: 6, category_name: "Beverages" },
];

// 5. Table ADDON_CATEGORY (category_id, category_name)
export const MOCK_ADDON_CATEGORIES = [
  { category_id: 1, category_name: "Extra Cheese & Dairy" },
  { category_id: 2, category_name: "Premium Meats" },
  { category_id: 3, category_name: "Toppings & Pickles" },
  { category_id: 4, category_name: "Signature Dipping Sauces" },
];

// 6. Table ADD_ON (addon_id, category_id, addon_name, price, image, description)
export const MOCK_ADDONS = [
  {
    addon_id: 1,
    category_id: 1,
    addon_name: "Melted Cheddar Cheese",
    price: 1.25,
    image:
      "https://images.unsplash.com/photo-1618164435735-413d3b066c9a?auto=format&fit=crop&w=400&q=80",
    description: "Rich aged sharp cheddar melted over hot patties",
  },
  {
    addon_id: 2,
    category_id: 2,
    addon_name: "Crispy Bacon Strips (2pcs)",
    price: 1.8,
    image:
      "https://images.unsplash.com/photo-1528607929212-2636ec44253e?auto=format&fit=crop&w=400&q=80",
    description: "Applewood smoked crispy streaky bacon",
  },
  {
    addon_id: 3,
    category_id: 3,
    addon_name: "Spicy Jalapeño Slices",
    price: 0.95,
    image:
      "https://images.unsplash.com/photo-1583119022894-919a68a3d0e3?auto=format&fit=crop&w=400&q=80",
    description: "Pickled fiery green jalapeño pepper rings",
  },
  {
    addon_id: 4,
    category_id: 4,
    addon_name: "Smoky Garlic Mayo Dip",
    price: 0.85,
    image:
      "https://images.unsplash.com/photo-1472476443507-c7a5948772fc?auto=format&fit=crop&w=400&q=80",
    description: "House-made roasted garlic & smoky paprika aioli",
  },
  {
    addon_id: 5,
    category_id: 1,
    addon_name: "Mozzarella Cheese Pull",
    price: 1.5,
    image:
      "https://images.unsplash.com/photo-1552767059-ce182ead6c1b?auto=format&fit=crop&w=400&q=80",
    description: "Extra stretchy premium whole-milk mozzarella",
  },
  {
    addon_id: 6,
    category_id: 4,
    addon_name: "Nashville Fiery Chili Oil Dip",
    price: 1.1,
    image:
      "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?auto=format&fit=crop&w=400&q=80",
    description: "Extra hot cayenne & brown sugar dipping glaze",
  },
];

// 7. Table SIZE (size_id, size_name)
export const MOCK_SIZES = [
  { size_id: 1, size_name: "Small" },
  { size_id: 2, size_name: "Medium" },
  { size_id: 3, size_name: "Large" },
];

// 8. Table PRODUCT_SIZE (product_size_id, size_id, product_id, price)
export const MOCK_PRODUCT_SIZES = [
  { product_size_id: 101, size_id: 1, product_id: 1, price: 8.99 },
  { product_size_id: 102, size_id: 2, product_id: 1, price: 11.49 },
  { product_size_id: 103, size_id: 3, product_id: 1, price: 13.99 },
  { product_size_id: 104, size_id: 1, product_id: 2, price: 9.49 },
  { product_size_id: 105, size_id: 2, product_id: 2, price: 12.2 },
  { product_size_id: 106, size_id: 1, product_id: 3, price: 7.99 },
  { product_size_id: 107, size_id: 2, product_id: 3, price: 14.5 },
  { product_size_id: 108, size_id: 3, product_id: 3, price: 22.99 },
  { product_size_id: 109, size_id: 1, product_id: 4, price: 10.99 },
  { product_size_id: 110, size_id: 2, product_id: 4, price: 15.99 },
  { product_size_id: 111, size_id: 3, product_id: 4, price: 19.99 },
  { product_size_id: 112, size_id: 1, product_id: 5, price: 4.99 },
  { product_size_id: 113, size_id: 2, product_id: 5, price: 6.99 },
  { product_size_id: 114, size_id: 1, product_id: 6, price: 3.99 },
  { product_size_id: 115, size_id: 2, product_id: 6, price: 4.99 },
  { product_size_id: 116, size_id: 1, product_id: 7, price: 8.5 },
  { product_size_id: 117, size_id: 2, product_id: 7, price: 15.8 },
  { product_size_id: 118, size_id: 1, product_id: 8, price: 11.49 },
  { product_size_id: 119, size_id: 2, product_id: 8, price: 16.49 },
];

// 9. Table PRODUCT (product_id, image, category_id, product_name, description, created_at, status, tag, review_count, total_rating)
const RAW_PRODUCTS = [
  {
    product_id: 1,
    category_id: 2,
    product_name: "Firecracker Jalapeño Beef Smash",
    description:
      "Double Angus smash patties, pepper jack cheese, crispy onions & spicy firecracker chili mayo.",
    image:
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80",
    created_at: "2026-01-10 08:00:00",
    status: "AVAILABLE",
    tag: "spicy",
    review_count: 184,
    total_rating: 902,
  },
  {
    product_id: 2,
    category_id: 2,
    product_name: "Smoky Bacon & Cheddar Supreme",
    description:
      "Charbroiled beef patty, melted sharp cheddar, applewood smoked bacon & BBQ drizzle.",
    image:
      "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=800&q=80",
    created_at: "2026-01-12 08:30:00",
    status: "AVAILABLE",
    tag: "hot",
    review_count: 142,
    total_rating: 682,
  },
  {
    product_id: 3,
    category_id: 3,
    product_name: "Nashville Hot Crispy Chicken Bucket",
    description:
      "Extra crunchy fresh chicken marinated in spiced buttermilk and dipped in fiery cayenne glare oil.",
    image:
      "https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?auto=format&fit=crop&w=800&q=80",
    created_at: "2026-01-14 09:00:00",
    status: "AVAILABLE",
    tag: "spicy",
    review_count: 310,
    total_rating: 1550,
  },
  {
    product_id: 4,
    category_id: 4,
    product_name: "Signature Pepperoni & Basil Pizza",
    description:
      "Hand-tossed dough, slow-simmered tomato passata, double layered pepperoni & basil leaves.",
    image:
      "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?auto=format&fit=crop&w=800&q=80",
    created_at: "2026-01-18 10:15:00",
    status: "AVAILABLE",
    tag: "hot",
    review_count: 220,
    total_rating: 1078,
  },
  {
    product_id: 5,
    category_id: 5,
    product_name: "Loaded Cheesy Bacon Waffle Fries",
    description:
      "Crispy lattice cut potatoes drenched in warm cheddar cheese sauce & real bacon crumbles.",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTKTaQObuWNE7TB8NuoOjMnxuCG2_WNxdeFTP4tpwlyL5R7cnSzq6SB5mQl&s=10",
    created_at: "2026-01-20 11:00:00",
    status: "AVAILABLE",
    tag: "veggie",
    review_count: 98,
    total_rating: 461,
  },
  {
    product_id: 6,
    category_id: 6,
    product_name: "Salted Caramel Vanilla Shake",
    description:
      "Hand-spun whole milk ice cream blend topped with fluffy whipped cream & sea salt caramel drizzle.",
    image:
      "https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=800&q=80",
    created_at: "2026-01-22 12:00:00",
    status: "AVAILABLE",
    tag: "veggie",
    review_count: 115,
    total_rating: 552,
  },
  {
    product_id: 7,
    category_id: 3,
    product_name: "Korean Honey Garlic Glazed Wings",
    description:
      "Double-fried chicken wings coated in sticky sweet soy, roasted garlic & toasted sesame seeds.",
    image:
      "https://images.unsplash.com/photo-1567620832903-9fc6debc209f?auto=format&fit=crop&w=800&q=80",
    created_at: "2026-02-01 09:30:00",
    status: "AVAILABLE",
    tag: "hot",
    review_count: 176,
    total_rating: 862,
  },
  {
    product_id: 8,
    category_id: 4,
    product_name: "BBQ Grilled Chicken & Corn Pizza",
    description:
      "Smoky hickory BBQ sauce base, tender grilled chicken breast, sweet corn, red onions & mozzarella.",
    image:
      "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=800&q=80",
    created_at: "2026-02-05 15:00:00",
    status: "AVAILABLE",
    tag: "hot",
    review_count: 134,
    total_rating: 643,
  },
];

// Join PRODUCT with PRODUCT_SIZE and SIZE so Customer pages also work seamlessly
export const MOCK_PRODUCTS = RAW_PRODUCTS.map((prod) => ({
  ...prod,
  sizes: MOCK_PRODUCT_SIZES.filter((ps) => ps.product_id === prod.product_id).map(
    (ps) => ({
      ...ps,
      size_name:
        MOCK_SIZES.find((s) => s.size_id === ps.size_id)?.size_name || null,
    })
  ),
}));

// 10. Table PRODUCT_ADDON (product_addon_id, product_id, addon_id)
export const MOCK_PRODUCT_ADDONS = [
  { product_addon_id: 1, product_id: 1, addon_id: 1 },
  { product_addon_id: 2, product_id: 1, addon_id: 2 },
  { product_addon_id: 3, product_id: 1, addon_id: 3 },
  { product_addon_id: 4, product_id: 2, addon_id: 1 },
  { product_addon_id: 5, product_id: 2, addon_id: 2 },
  { product_addon_id: 6, product_id: 3, addon_id: 4 },
  { product_addon_id: 7, product_id: 3, addon_id: 6 },
  { product_addon_id: 8, product_id: 4, addon_id: 3 },
  { product_addon_id: 9, product_id: 4, addon_id: 5 },
];

// 11. Table COMBO (combo_id, combo_name, price, original_price, image, description, badge, tag, created_at, status, review_count, total_rating)
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
    created_at: "2026-01-10 08:00:00",
    status: "AVAILABLE",
    review_count: 245,
    total_rating: 1200,
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
    created_at: "2026-01-15 10:00:00",
    status: "AVAILABLE",
    review_count: 189,
    total_rating: 910,
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
    created_at: "2026-01-20 11:30:00",
    status: "AVAILABLE",
    review_count: 162,
    total_rating: 785,
  },
  {
    combo_id: 504,
    combo_name: "Late Night Gamer Fuel Box",
    price: 16.99,
    original_price: 21.5,
    image:
      "https://images.unsplash.com/photo-1561758033-d89a9ad46330?auto=format&fit=crop&w=800&q=80",
    description:
      "1 Firecracker Smash Burger + 6 Pcs Korean Honey Wings + 1 Salted Caramel Shake",
    badge: "NIGHT DEAL",
    tag: "spicy",
    created_at: "2026-02-10 18:00:00",
    status: "AVAILABLE",
    review_count: 118,
    total_rating: 578,
  },
];

// 12. Table COMBO_DETAIL (combo_detail_id, combo_id, product_size_id)
export const MOCK_COMBO_DETAILS = [
  { combo_detail_id: 1, combo_id: 501, product_size_id: 102 },
  { combo_detail_id: 2, combo_id: 501, product_size_id: 106 },
  { combo_detail_id: 3, combo_id: 501, product_size_id: 113 },
  { combo_detail_id: 4, combo_id: 502, product_size_id: 105 },
  { combo_detail_id: 5, combo_id: 502, product_size_id: 106 },
  { combo_detail_id: 6, combo_id: 502, product_size_id: 112 },
  { combo_detail_id: 7, combo_id: 503, product_size_id: 110 },
  { combo_detail_id: 8, combo_id: 503, product_size_id: 112 },
  { combo_detail_id: 9, combo_id: 504, product_size_id: 101 },
  { combo_detail_id: 10, combo_id: 504, product_size_id: 116 },
  { combo_detail_id: 11, combo_id: 504, product_size_id: 114 },
];

// 13. Table PAYMENT_METHOD (payment_id, payment_name)
export const MOCK_PAYMENT_METHODS = [
  { payment_id: 1, payment_name: "Cash on Delivery (COD)" },
  { payment_id: 2, payment_name: "MoMo E-Wallet" },
  { payment_id: 3, payment_name: "VNPay QR" },
  { payment_id: 4, payment_name: "Credit / Debit Card" },
];

// 14. Table STATUS (status_id, status_name)
export const MOCK_STATUSES = [
  { status_id: 1, status_name: "PENDING" },
  { status_id: 2, status_name: "ACCEPTED" },
  { status_id: 3, status_name: "DELIVERING" },
  { status_id: 4, status_name: "COMPLETED" },
  { status_id: 5, status_name: "CANCELLED" },
];

// 15. Table ORDER (order_id, payment_id, account_id, delivery_id, total, earned_point, used_point, customer_note, receiver_name, phone_number, full_address, cancel_reason, rating)
export const MOCK_ORDERS = [
  // PENDING ORDERS (delivery_id: null)
  {
    order_id: 1001,
    payment_id: 1,
    account_id: 101,
    delivery_id: null,
    total: 32.73,
    earned_point: 320,
    used_point: 0,
    customer_note:
      "Call 5 mins before lobby arrival. Extra hot chili sauce packets please!",
    receiver_name: "Alex Johnson",
    phone_number: "0901234567",
    full_address: "123 Le Loi St, Ben Nghe Ward, District 1, HCMC",
    cancel_reason: null,
    rating: 0,
  },
  {
    order_id: 1002,
    payment_id: 2,
    account_id: 102,
    delivery_id: null,
    total: 29.99,
    earned_point: 290,
    used_point: 50,
    customer_note:
      "Leave at reception desk if I am in a meeting. Pre-paid via MoMo.",
    receiver_name: "Sarah Connor",
    phone_number: "0912345678",
    full_address: "45B Nguyen Dinh Chieu St, Ward 6, District 3, HCMC",
    cancel_reason: null,
    rating: 0,
  },
  {
    order_id: 1003,
    payment_id: 1,
    account_id: 103,
    delivery_id: null,
    total: 26.44,
    earned_point: 260,
    used_point: 0,
    customer_note: null,
    receiver_name: "Marcus Chen",
    phone_number: "0987654321",
    full_address: "Quarter 6, Linh Trung Ward, Thu Duc City, HCMC",
    cancel_reason: null,
    rating: 0,
  },
  {
    order_id: 1004,
    payment_id: 3,
    account_id: 104,
    delivery_id: null,
    total: 41.48,
    earned_point: 410,
    used_point: 100,
    customer_note:
      "Floor 12, Landmark 2 Tower. Please bring extra napkins and cheese dip.",
    receiver_name: "Emily Watson",
    phone_number: "0933445566",
    full_address:
      "720A Dien Bien Phu St, Vinhomes Central Park, Binh Thanh Dist, HCMC",
    cancel_reason: null,
    rating: 0,
  },
  {
    order_id: 1005,
    payment_id: 1,
    account_id: 105,
    delivery_id: null,
    total: 21.98,
    earned_point: 210,
    used_point: 0,
    customer_note: "No raw onions in burger. Please bring change for $50.",
    receiver_name: "David Miller",
    phone_number: "0977889900",
    full_address: "105 Nguyen Duc Canh St, Phu My Hung, District 7, HCMC",
    cancel_reason: null,
    rating: 0,
  },

  // ACCEPTED ORDERS FOR SHIPPER (delivery_id: 201)
  {
    order_id: 1006,
    payment_id: 1,
    account_id: 106,
    delivery_id: 201,
    total: 35.48,
    earned_point: 350,
    used_point: 0,
    customer_note: "Alley opposite supermarket, 30m inside, white gate house.",
    receiver_name: "Chloe Nguyen",
    phone_number: "0944556677",
    full_address: "285 Cach Mang Thang Tam St, Ward 12, District 10, HCMC",
    cancel_reason: null,
    rating: 0,
  },
  {
    order_id: 1007,
    payment_id: 4,
    account_id: 101,
    delivery_id: 201,
    total: 27.28,
    earned_point: 270,
    used_point: 20,
    customer_note: "Office lunch break! Please deliver before 12:30 PM.",
    receiver_name: "Alex Johnson",
    phone_number: "0901234567",
    full_address: "Bitexco Tower, 2 Hai Trieu St, Ben Nghe Ward, District 1",
    cancel_reason: null,
    rating: 0,
  },
  {
    order_id: 1008,
    payment_id: 2,
    account_id: 104,
    delivery_id: 201,
    total: 38.97,
    earned_point: 380,
    used_point: 0,
    customer_note: "Keep cold drinks separate from the hot pizza box.",
    receiver_name: "Emily Watson",
    phone_number: "0933445566",
    full_address: "180 Hai Ba Trung St, Da Kao Ward, District 1, HCMC",
    cancel_reason: null,
    rating: 0,
  },
  {
    order_id: 1010,
    payment_id: 3,
    account_id: 105,
    delivery_id: 201,
    total: 44.98,
    earned_point: 440,
    used_point: 50,
    customer_note: null,
    receiver_name: "David Miller",
    phone_number: "0977889900",
    full_address: "105 Nguyen Duc Canh St, Phu My Hung, District 7, HCMC",
    cancel_reason: null,
    rating: 5,
  },
  {
    order_id: 1012,
    payment_id: 1,
    account_id: 106,
    delivery_id: 201,
    total: 28.48,
    earned_point: 0,
    used_point: 0,
    customer_note: "Urgent delivery in 15 minutes.",
    receiver_name: "Chloe Nguyen",
    phone_number: "0944556677",
    full_address: "92 Nguyen Hue Blvd, Ben Nghe Ward, District 1, HCMC",
    cancel_reason: "Customer unreachable after 3 phone calls at location",
    rating: 0,
  },

  // COMPLETED ORDERS FOR CUSTOMER account_id: 101 (FOR CUSTOMER RATING PAGE)
  {
    order_id: 1011,
    payment_id: 1,
    account_id: 101,
    delivery_id: 201,
    total: 24.99,
    earned_point: 240,
    used_point: 0,
    customer_note: null,
    receiver_name: "Alex Johnson",
    phone_number: "0901234567",
    full_address: "123 Le Loi St, Ben Nghe Ward, District 1, HCMC",
    cancel_reason: null,
    rating: 0,
  },
  {
    order_id: 1013,
    payment_id: 2,
    account_id: 101,
    delivery_id: 201,
    total: 20.98,
    earned_point: 200,
    used_point: 0,
    customer_note: null,
    receiver_name: "Alex Johnson",
    phone_number: "0901234567",
    full_address: "123 Le Loi St, Ben Nghe Ward, District 1, HCMC",
    cancel_reason: null,
    rating: 0,
  },
  {
    order_id: 1014,
    payment_id: 3,
    account_id: 101,
    delivery_id: 201,
    total: 30.49,
    earned_point: 300,
    used_point: 0,
    customer_note: null,
    receiver_name: "Alex Johnson",
    phone_number: "0901234567",
    full_address: "123 Le Loi St, Ben Nghe Ward, District 1, HCMC",
    cancel_reason: null,
    rating: 0,
  },
  {
    order_id: 1015,
    payment_id: 1,
    account_id: 101,
    delivery_id: 201,
    total: 18.5,
    earned_point: 180,
    used_point: 0,
    customer_note: null,
    receiver_name: "Alex Johnson",
    phone_number: "0901234567",
    full_address: "123 Le Loi St, Ben Nghe Ward, District 1, HCMC",
    cancel_reason: null,
    rating: 5,
  },
];

// 16. Table ORDER_DETAIL (order_detail_id, order_id, product_size_id, combo_id, quantity, unit_price, total)
export const MOCK_ORDER_DETAILS = [
  // Order 1001
  {
    order_detail_id: 5001,
    order_id: 1001,
    product_size_id: 102,
    combo_id: null,
    quantity: 2,
    unit_price: 11.49,
    total: 26.03,
  },
  {
    order_detail_id: 5002,
    order_id: 1001,
    product_size_id: 112,
    combo_id: null,
    quantity: 1,
    unit_price: 4.99,
    total: 6.7,
  },
  // Order 1002
  {
    order_detail_id: 5003,
    order_id: 1002,
    product_size_id: null,
    combo_id: 501,
    quantity: 1,
    unit_price: 24.99,
    total: 24.99,
  },
  {
    order_detail_id: 5004,
    order_id: 1002,
    product_size_id: 115,
    combo_id: null,
    quantity: 1,
    unit_price: 4.99,
    total: 5.0,
  },
  // Order 1003
  {
    order_detail_id: 5005,
    order_id: 1003,
    product_size_id: 107,
    combo_id: null,
    quantity: 1,
    unit_price: 14.5,
    total: 16.45,
  },
  {
    order_detail_id: 5006,
    order_id: 1003,
    product_size_id: 104,
    combo_id: null,
    quantity: 1,
    unit_price: 9.49,
    total: 9.99,
  },
  // Order 1004
  {
    order_detail_id: 5007,
    order_id: 1004,
    product_size_id: null,
    combo_id: 503,
    quantity: 1,
    unit_price: 22.0,
    total: 22.0,
  },
  {
    order_detail_id: 5008,
    order_id: 1004,
    product_size_id: 117,
    combo_id: null,
    quantity: 1,
    unit_price: 15.8,
    total: 19.48,
  },
  // Order 1005
  {
    order_detail_id: 5009,
    order_id: 1005,
    product_size_id: 103,
    combo_id: null,
    quantity: 1,
    unit_price: 13.99,
    total: 13.99,
  },
  {
    order_detail_id: 5010,
    order_id: 1005,
    product_size_id: 106,
    combo_id: null,
    quantity: 1,
    unit_price: 7.99,
    total: 7.99,
  },
  // Order 1006
  {
    order_detail_id: 5011,
    order_id: 1006,
    product_size_id: null,
    combo_id: 502,
    quantity: 1,
    unit_price: 18.5,
    total: 18.5,
  },
  {
    order_detail_id: 5012,
    order_id: 1006,
    product_size_id: 110,
    combo_id: null,
    quantity: 1,
    unit_price: 15.99,
    total: 16.98,
  },
  // Order 1007
  {
    order_detail_id: 5013,
    order_id: 1007,
    product_size_id: null,
    combo_id: 504,
    quantity: 1,
    unit_price: 16.99,
    total: 16.99,
  },
  {
    order_detail_id: 5014,
    order_id: 1007,
    product_size_id: 116,
    combo_id: null,
    quantity: 1,
    unit_price: 8.5,
    total: 10.29,
  },
  // Order 1008
  {
    order_detail_id: 5015,
    order_id: 1008,
    product_size_id: 111,
    combo_id: null,
    quantity: 1,
    unit_price: 19.99,
    total: 21.49,
  },
  {
    order_detail_id: 5016,
    order_id: 1008,
    product_size_id: 105,
    combo_id: null,
    quantity: 1,
    unit_price: 12.2,
    total: 12.49,
  },
  {
    order_detail_id: 5017,
    order_id: 1008,
    product_size_id: 115,
    combo_id: null,
    quantity: 1,
    unit_price: 4.99,
    total: 4.99,
  },
  // Order 1010
  {
    order_detail_id: 5020,
    order_id: 1010,
    product_size_id: null,
    combo_id: 501,
    quantity: 1,
    unit_price: 24.99,
    total: 24.99,
  },
  {
    order_detail_id: 5021,
    order_id: 1010,
    product_size_id: 111,
    combo_id: null,
    quantity: 1,
    unit_price: 19.99,
    total: 19.99,
  },
  // Order 1012
  {
    order_detail_id: 5024,
    order_id: 1012,
    product_size_id: 108,
    combo_id: null,
    quantity: 1,
    unit_price: 22.99,
    total: 22.99,
  },
  {
    order_detail_id: 5025,
    order_id: 1012,
    product_size_id: 112,
    combo_id: null,
    quantity: 1,
    unit_price: 4.99,
    total: 5.49,
  },
  // Order 1011
  {
    order_detail_id: 5026,
    order_id: 1011,
    product_size_id: null,
    combo_id: 501,
    quantity: 1,
    unit_price: 24.99,
    total: 24.99,
  },
  // Order 1013
  {
    order_detail_id: 5027,
    order_id: 1013,
    product_size_id: 110,
    combo_id: null,
    quantity: 1,
    unit_price: 15.99,
    total: 15.99,
  },
  {
    order_detail_id: 5028,
    order_id: 1013,
    product_size_id: 115,
    combo_id: null,
    quantity: 1,
    unit_price: 4.99,
    total: 4.99,
  },
  // Order 1014
  {
    order_detail_id: 5029,
    order_id: 1014,
    product_size_id: null,
    combo_id: 503,
    quantity: 1,
    unit_price: 22.0,
    total: 22.0,
  },
  {
    order_detail_id: 5030,
    order_id: 1014,
    product_size_id: 116,
    combo_id: null,
    quantity: 1,
    unit_price: 8.5,
    total: 8.49,
  },
  // Order 1015
  {
    order_detail_id: 5031,
    order_id: 1015,
    product_size_id: null,
    combo_id: 502,
    quantity: 1,
    unit_price: 18.5,
    total: 18.5,
  },
];

// 17. Table ADDON_ORDER_DETAIL (addon_order_detail_id, order_detail_id, addon_id, price)
export const MOCK_ADDON_ORDER_DETAILS = [
  { addon_order_detail_id: 1, order_detail_id: 5001, addon_id: 1, price: 1.25 },
  { addon_order_detail_id: 2, order_detail_id: 5001, addon_id: 2, price: 1.8 },
  { addon_order_detail_id: 3, order_detail_id: 5002, addon_id: 4, price: 0.85 },
  { addon_order_detail_id: 4, order_detail_id: 5005, addon_id: 6, price: 1.1 },
  { addon_order_detail_id: 5, order_detail_id: 5005, addon_id: 4, price: 0.85 },
  { addon_order_detail_id: 6, order_detail_id: 5008, addon_id: 2, price: 1.8 },
  { addon_order_detail_id: 7, order_detail_id: 5012, addon_id: 3, price: 0.95 },
  { addon_order_detail_id: 8, order_detail_id: 5014, addon_id: 6, price: 1.1 },
  { addon_order_detail_id: 9, order_detail_id: 5015, addon_id: 5, price: 1.5 },
];

// 18. Table ORDER_STATUS (order_status_id, status_id, order_id, created_at)
export const MOCK_ORDER_STATUSES = [
  // Order 1001..1005: PENDING
  { order_status_id: 1, order_id: 1001, status_id: 1, created_at: "19/11/2026 11:42" },
  { order_status_id: 2, order_id: 1002, status_id: 1, created_at: "19/11/2026 11:45" },
  { order_status_id: 3, order_id: 1003, status_id: 1, created_at: "19/11/2026 11:48" },
  { order_status_id: 4, order_id: 1004, status_id: 1, created_at: "19/11/2026 11:51" },
  { order_status_id: 5, order_id: 1005, status_id: 1, created_at: "19/11/2026 11:54" },

  // Order 1006: PENDING -> ACCEPTED
  { order_status_id: 6, order_id: 1006, status_id: 1, created_at: "19/11/2026 11:10" },
  { order_status_id: 7, order_id: 1006, status_id: 2, created_at: "19/11/2026 11:14" },

  // Order 1007: PENDING -> ACCEPTED
  { order_status_id: 8, order_id: 1007, status_id: 1, created_at: "19/11/2026 11:15" },
  { order_status_id: 9, order_id: 1007, status_id: 2, created_at: "19/11/2026 11:18" },

  // Order 1008: PENDING -> ACCEPTED -> DELIVERING
  { order_status_id: 10, order_id: 1008, status_id: 1, created_at: "19/11/2026 10:40" },
  { order_status_id: 11, order_id: 1008, status_id: 2, created_at: "19/11/2026 10:44" },
  { order_status_id: 12, order_id: 1008, status_id: 3, created_at: "19/11/2026 10:55" },

  // Order 1010: PENDING -> ACCEPTED -> DELIVERING -> COMPLETED
  { order_status_id: 16, order_id: 1010, status_id: 1, created_at: "19/11/2026 09:15" },
  { order_status_id: 17, order_id: 1010, status_id: 2, created_at: "19/11/2026 09:18" },
  { order_status_id: 18, order_id: 1010, status_id: 3, created_at: "19/11/2026 09:28" },
  { order_status_id: 19, order_id: 1010, status_id: 4, created_at: "19/11/2026 09:47" },

  // Order 1012: PENDING -> ACCEPTED -> DELIVERING -> CANCELLED
  { order_status_id: 24, order_id: 1012, status_id: 1, created_at: "19/11/2026 09:50" },
  { order_status_id: 25, order_id: 1012, status_id: 2, created_at: "19/11/2026 09:53" },
  { order_status_id: 26, order_id: 1012, status_id: 3, created_at: "19/11/2026 10:05" },
  { order_status_id: 27, order_id: 1012, status_id: 5, created_at: "19/11/2026 10:25" },

  // Order 1011: PENDING -> ACCEPTED -> DELIVERING -> COMPLETED
  { order_status_id: 28, order_id: 1011, status_id: 1, created_at: "18/11/2026 18:10" },
  { order_status_id: 29, order_id: 1011, status_id: 2, created_at: "18/11/2026 18:14" },
  { order_status_id: 30, order_id: 1011, status_id: 3, created_at: "18/11/2026 18:25" },
  { order_status_id: 31, order_id: 1011, status_id: 4, created_at: "18/11/2026 18:45" },

  // Order 1013: PENDING -> ACCEPTED -> DELIVERING -> COMPLETED
  { order_status_id: 32, order_id: 1013, status_id: 1, created_at: "18/11/2026 12:00" },
  { order_status_id: 33, order_id: 1013, status_id: 2, created_at: "18/11/2026 12:03" },
  { order_status_id: 34, order_id: 1013, status_id: 3, created_at: "18/11/2026 12:15" },
  { order_status_id: 35, order_id: 1013, status_id: 4, created_at: "18/11/2026 12:36" },

  // Order 1014: PENDING -> ACCEPTED -> DELIVERING -> COMPLETED
  { order_status_id: 36, order_id: 1014, status_id: 1, created_at: "17/11/2026 19:20" },
  { order_status_id: 37, order_id: 1014, status_id: 2, created_at: "17/11/2026 19:24" },
  { order_status_id: 38, order_id: 1014, status_id: 3, created_at: "17/11/2026 19:35" },
  { order_status_id: 39, order_id: 1014, status_id: 4, created_at: "17/11/2026 19:58" },

  // Order 1015: PENDING -> ACCEPTED -> DELIVERING -> COMPLETED
  { order_status_id: 40, order_id: 1015, status_id: 1, created_at: "16/11/2026 11:30" },
  { order_status_id: 41, order_id: 1015, status_id: 2, created_at: "16/11/2026 11:33" },
  { order_status_id: 42, order_id: 1015, status_id: 3, created_at: "16/11/2026 11:45" },
  { order_status_id: 43, order_id: 1015, status_id: 4, created_at: "16/11/2026 12:05" },
];

// ============================================================================
// RELATIONAL JOIN HELPER (NO SYNTHETIC FALLBACK DATA)
// ============================================================================
export function hydrateOrderData(
  order,
  orderStatuses = MOCK_ORDER_STATUSES,
  orderDetails = MOCK_ORDER_DETAILS,
  addonOrderDetails = MOCK_ADDON_ORDER_DETAILS
) {
  const paymentMethod =
    MOCK_PAYMENT_METHODS.find((pm) => pm.payment_id === order.payment_id) ||
    null;
  const customerAccount =
    MOCK_ACCOUNTS.find((acc) => acc.account_id === order.account_id) || null;
  const shipperAccount = order.delivery_id
    ? MOCK_ACCOUNTS.find((acc) => acc.account_id === order.delivery_id) || null
    : null;

  // ORDER_STATUS JOIN STATUS
  const statusHistory = orderStatuses
    .filter((os) => os.order_id === order.order_id)
    .map((os) => {
      const statusObj =
        MOCK_STATUSES.find((s) => s.status_id === os.status_id) || null;
      return {
        ...os,
        status_name: statusObj ? statusObj.status_name : null,
      };
    });

  const latestStatusObj =
    statusHistory.length > 0 ? statusHistory[statusHistory.length - 1] : null;

  // ORDER_DETAIL JOIN PRODUCT_SIZE/PRODUCT/SIZE/COMBO & ADDON_ORDER_DETAIL/ADD_ON
  const items = orderDetails
    .filter((od) => od.order_id === order.order_id)
    .map((od) => {
      const itemAddons = addonOrderDetails
        .filter((aod) => aod.order_detail_id === od.order_detail_id)
        .map((aod) => {
          const addonInfo =
            MOCK_ADDONS.find((a) => a.addon_id === aod.addon_id) || null;
          return {
            ...aod,
            addon_name: addonInfo ? addonInfo.addon_name : null,
          };
        });

      if (od.combo_id !== null && od.combo_id !== undefined) {
        const comboInfo =
          MOCK_COMBOS.find((c) => c.combo_id === od.combo_id) || null;
        return {
          ...od,
          combo_name: comboInfo ? comboInfo.combo_name : null,
          product_name: null,
          size_name: null,
          image: comboInfo ? comboInfo.image : null,
          description: comboInfo ? comboInfo.description : null,
          addons: itemAddons,
        };
      }

      const productSizeInfo =
        MOCK_PRODUCT_SIZES.find(
          (ps) => ps.product_size_id === od.product_size_id
        ) || null;
      const productInfo = productSizeInfo
        ? RAW_PRODUCTS.find(
            (p) => p.product_id === productSizeInfo.product_id
          ) || null
        : null;
      const sizeInfo = productSizeInfo
        ? MOCK_SIZES.find((s) => s.size_id === productSizeInfo.size_id) || null
        : null;

      return {
        ...od,
        combo_name: null,
        product_name: productInfo ? productInfo.product_name : null,
        size_name: sizeInfo ? sizeInfo.size_name : null,
        image: productInfo ? productInfo.image : null,
        description: productInfo ? productInfo.description : null,
        addons: itemAddons,
      };
    });

  return {
    ...order,
    payment_name: paymentMethod ? paymentMethod.payment_name : null,
    customer_username: customerAccount ? customerAccount.username : null,
    customer_email: customerAccount ? customerAccount.email : null,
    shipper_username: shipperAccount ? shipperAccount.username : null,
    status_history: statusHistory,
    current_status: latestStatusObj ? latestStatusObj.status_name : null,
    current_status_id: latestStatusObj ? latestStatusObj.status_id : null,
    created_at: statusHistory[0] ? statusHistory[0].created_at : null,
    updated_at: latestStatusObj ? latestStatusObj.created_at : null,
    items,
  };
}
