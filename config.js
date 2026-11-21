// ============================================================
//  EDIT THIS FILE to change what the page says.
// ============================================================

window.PARTY = {
  // Set to true to show a strip at the top saying some details are placeholders.
  sample: false,

  host: "Tini",
  age: 24,                      // shown on the life ring
  golden: true,                 // golden birthday: turning 24 on the 24th
  tagline: "Turning 24 on the 24th, so it's my golden birthday. Come celebrate on a boat on Sydney Harbour.",

  facebookEvent: "https://fb.me/e/7AimQstKy",

  // ---- Details tab (plain text, shown exactly as written) ----
  when:  "Saturday 19 December. Arrive by 5pm, boat leaves 5:30pm, back 9:30pm",
  where: "Towns Place, Millers Point NSW 2000 (the boat leaves from here)",
  mapsQuery: "Towns Pl, Millers Point NSW 2000, Australia",   // used for the Directions button
  onBoard: "Food and drinks are all provided, so just bring yourself.",

  // Dietary requirements form (Details tab). Answers are private: only you can read them,
  // in the Firebase console under Firestore Database > Data > dietary.
  dietaryOptions: ["Vegetarian", "Vegan", "Pescatarian", "Gluten-free", "Dairy-free", "Nut allergy", "Halal", "No pork", "No seafood"],
  bring: "Sunnies, sunscreen, and a light layer for when the sun goes down.",
  extraInfo: "Please be there by 5pm. The boat leaves at 5:30pm on the dot and can't wait for anyone.",

  // ---- Dress code tab ----
  dressCode: {
    headline: "Summer vibes",
    // Public Pinterest board shown in the Dress code tab. Remove the line to hide it.
    pinterest: "https://www.pinterest.com.au/chkong9024/24th-bday-inspo-fits/",
    intro: "Dress like it's a long summer evening on the water.",
    tips: [
      { title: "Think",           text: "Linen, sundresses, skirts, light shirts, shorts. Bright colours welcome." },
      { title: "On deck",         text: "Flat shoes or sneakers. Heels and boat decks don't mix." },
      { title: "After sunset",    text: "It gets breezy on the harbour, so bring a light layer." },
      { title: "Golden birthday", text: "A touch of gold is a fun nod to the golden birthday, but totally optional." }
    ]
  },

  // ---- Wishlist tab ----
  wishlistNote: "Honestly just come! But if you want to bring something, here's what I've been eyeing.",

  // Shown at the top of the Wishlist tab.
  sizes: [
    { label: "Tops",    value: "S/M" },
    { label: "Bottoms", value: "S" },
    { label: "Shoes",   value: "39" }
  ],

  // Filter labels. The keys are what each item's `category` / `price` uses.
  categories: {
    clothes:   "Clothes",
    sport:     "Sport & gym",
    beauty:    "Beauty",
    home:      "Home & cooking",
    tech:      "Tech",
    jewellery: "Jewellery"
  },
  priceBands: {
    "under-50": "Under $50",
    "50-150":   "$50 to $150",
    "150-plus": "$150+"
  },

  // Give every item a unique id that never changes.
  //   cost:  the price shown on the item (only for specific products). Leave it out to hide the price.
  //   price: which price filter it belongs to (one of the priceBands keys above).
  //          For items without a cost these are rough guesses. "any" = only shows under "Any price".
  //   open: true  -> an idea anyone can go with; nobody can claim it
  //   otherwise   -> one person taps "I'll get this" (no name needed) so nobody doubles up
  wishlist: [
    { id: "snow-jacket",       category: "clothes",   price: "150-plus",      title: "Hot pink snow jacket", note: "Size S/M. The pinker the better." },
    { id: "papasan-chair",     category: "home",      price: "150-plus",      title: "Shangri-La papasan swivel wicker chair (beige)", link: "https://www.kogan.com/au/buy/shangri-la-papasan-swivel-wicker-chair-beige-shangri-la-c/" },  // add cost: "$___" once you know the Kogan price
    { id: "tennis-bracelet",   category: "jewellery", price: "50-150",      title: "Tennis bracelet" },
    { id: "polaroid-camera",   category: "tech",      price: "150-plus",      title: "Polaroid camera", note: "My old one broke ;-;" },
    { id: "fitbit-air",        category: "tech",      price: "150-plus", cost: "$199", title: "Fitbit Air" },
    { id: "monitor-34",        category: "tech",      price: "150-plus", title: "34-inch monitor with built-in speakers", note: "For work." },
    { id: "dior-glow-palette", category: "beauty",    price: "50-150",   cost: "$97",  title: "Dior Backstage Glow Maximizer palette", note: "In shade 002 Frosted Opal Glow.", link: "https://www.dior.com/en_au/beauty/products/dior-backstage-glow-maximizer-palette-Y0000104.html" },
    { id: "snow-pants",        category: "clothes",   price: "50-150",      title: "Snow pants", note: "Size S. Black and baggy." },
    { id: "keyboard-switches", category: "tech",      price: "50-150",      title: "Keyboard switches for the thock", note: "Silent, thocky linear switches, average gram weight. My keyboard needs fixing :(" },
    { id: "volleyball-shoes",  category: "sport",     price: "150-plus",      title: "Volleyball shoes", note: "Size 39." },
    { id: "mizuno-sleeves",    category: "sport",     price: "under-50",      title: "Mizuno arm sleeves", note: "I keep losing them." },
    { id: "gym-shorts",        category: "sport",     price: "under-50",      title: "High-waisted gym shorts", note: "Size S. Gymshark is great." },
    { id: "gym-leggings",      category: "sport",     price: "50-150",      title: "Gym leggings with a scrunch", note: "Size S." },
    { id: "gym-tops",          category: "sport",     price: "under-50",      title: "Gym tops", note: "Size S/M. Crop tops, sports bras or fitted tees. Gymshark is great." },
    { id: "heatless-curls",    category: "beauty",    price: "under-50",      title: "6-piece heatless curls set" },
    { id: "makeup-brushes",    category: "beauty",    price: "under-50",      title: "Makeup brushes" },
    { id: "rhode-lip",         category: "beauty",    price: "under-50", cost: "$35 to $41", title: "Rhode lip liner or lip gloss", note: "Lip tint is $35, lip shaper is $41 at Mecca." },
    { id: "hanpoom-plates",    category: "home",      price: "50-150",      title: "Hanpoom cooking plates" },
    { id: "basics",            category: "clothes",   price: "under-50",      title: "Some basics, like a plain shirt", note: "Size S/M. Glassons is totally fine." },

    // ---- open ideas (can't be claimed) ----
    { id: "cooking",   open: true, category: "home",      price: "any", title: "Anything cooking related" },
    { id: "house",     open: true, category: "home",      price: "any", title: "Anything nice for the house" },
    { id: "jewellery", open: true, category: "jewellery", price: "any", title: "Any jewellery", note: "Bangles, bracelets, rings or necklaces. Just not earrings." }
  ]
};

// ============================================================
//  FIREBASE (makes wishlist claims shared for everyone)
//  Leave as null to run in demo mode: everything works, but it only
//  saves in your own browser. See README.md for the setup.
//  Paste the firebaseConfig object from the Firebase console here, e.g.:
//
//  window.FIREBASE_CONFIG = {
//    apiKey: "AIza...",
//    authDomain: "my-party.firebaseapp.com",
//    projectId: "my-party",
//    storageBucket: "my-party.appspot.com",
//    messagingSenderId: "1234567890",
//    appId: "1:1234567890:web:abc123"
//  };
// ============================================================
window.FIREBASE_CONFIG = {
  apiKey: "AIzaSyBuKTn1ylg4AzUViVY-HR0KSnciZDDbHzQ",
  authDomain: "tini-bday.firebaseapp.com",
  projectId: "tini-bday",
  storageBucket: "tini-bday.firebasestorage.app",
  messagingSenderId: "138038380954",
  appId: "1:138038380954:web:a2dd08099e080c29eb5223"
};
