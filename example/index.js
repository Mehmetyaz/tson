const { stringify, parse } = require("tson-js").TSON;

const obj = {
  name: "John",
  age: 30,
  city: "New York",
};

const jsonObjects = [
  {
    product_catalog: {
      catalogId: "cat001",
      name: "Summer Products 2023",
      publishedAt: "2023-05-01T00:00:00Z",
      categories: ["outdoor", "sports", "summer", "beachwear"],
    },
  },
  {
    product: {
      id: "prod001",
      catalogId: "cat001",
      sku: "BW-001",
      inStock: true,
      attributes: {
        color: "blue",
        size: "M",
        material: "cotton",
        washable: true,
      },
    },
  },
  {
    product_name: {
      productId: "prod001",
      language: "en",
      name: "Men's Beach Shorts",
    },
  },
  {
    product_name: {
      productId: "prod001",
      language: "es",
      name: "Pantalones cortos de playa para hombres",
    },
  },
  {
    product_description: {
      productId: "prod001",
      language: "en",
      description:
        "Comfortable beach shorts perfect for summer activities. Quick-drying fabric with UV protection.",
    },
  },
  {
    product_price: {
      productId: "prod001",
      currencyCode: "USD",
      amount: 29.99,
      isDiscounted: true,
      originalAmount: 39.99,
    },
  },
  {
    product_image: {
      productId: "prod001",
      url: "https://example.com/images/bw001_front.jpg",
      type: "front",
      width: 800,
      height: 1200,
    },
  },
  {
    product_image: {
      productId: "prod001",
      url: "https://example.com/images/bw001_back.jpg",
      type: "back",
      width: 800,
      height: 1200,
    },
  },
  {
    product_review: {
      productId: "prod001",
      userId: "u2001",
      rating: 4.5,
      reviewDate: "2023-06-15T09:20:00Z",
      verified: true,
    },
  },
  {
    review_text: {
      productId: "prod001",
      reviewId: "r3001",
      language: "en",
      title: "Great quality shorts",
      content:
        'Really comfortable and perfect fit.\nMaterial feels "premium" and they dry quickly after swimming.',
    },
  },
  {
    product_recommendation: {
      productId: "prod001",
      recommendedProducts: ["prod002", "prod005", "prod008"],
      recommendationType: "frequently_bought_together",
    },
  },
  {
    product_availability: {
      productId: "prod001",
      storeId: "store001",
      quantity: 45,
      locationName: "Main Warehouse",
      lastUpdated: "2023-06-20T14:30:00Z",
    },
  },
  {
    product_availability: {
      productId: "prod001",
      storeId: "store002",
      quantity: 12,
      locationName: "Downtown Store",
      lastUpdated: "2023-06-20T15:45:00Z",
    },
  },
];

function equal(a, b) {
  return JSON.stringify(a) === JSON.stringify(b);
}

for (const jsonObject of jsonObjects) {
  const tson = stringify(jsonObject, false);
  //console.log(tson);
  const parsed = parse(tson);
  //console.log(parsed);
  const eq = equal(jsonObject, parsed);
  console.log(eq);
  if (!eq) {
    console.log(tson);
    console.log(jsonObject);
    console.log(JSON.stringify(jsonObject));
    console.log(parsed);
  }
}

const ts = `


observations(general(add["User skipped basic questions ('What is your name?', 'Tell us about yourself').", "User skipped a pronunciation task ('Please repeat after me...').", "User seems hesitant to interact or provide input."]))



`;

const parsed = parse(ts);
console.log(JSON.stringify(parsed, null, 2));
