import {formatCurrency} from '../scripts/utils/money.js';
export function getProduct(productId) {
  let matchingProduct;
  products.forEach((product) => {
    if (product.id === productId) {
      matchingProduct = product;
    }
  });
  return matchingProduct;
}
class Product {
  id;
  image;
  name;
  rating;
  priceCents;
  keyword;
  constructor(productDetails) {
    this.id = productDetails.id;
    this.image = productDetails.image;
    this.name = productDetails.name;
    this.rating = productDetails.rating;
    this.priceCents = productDetails.priceCents;
    this.keywords = productDetails.keywords;
  }
  getStarsURL() {
    return `images/ratings/rating-${this.rating.stars * 10}.png`;
  }
  getPrice() {
    return `$${formatCurrency(this.priceCents)}`;
  }
  extraInfoHTML() {
    return '';
  }
}
class Clothing extends Product {
  sizeChartLink;
  constructor(productDetails) {
    super(productDetails);
    this.sizeChartLink = productDetails.sizeChartLink;
  }
  extraInfoHTML() {
    return `
      <a href="${this.sizeChartLink}" target="_black">
        Size chart
      </a>
    `;
  }
}
class Appliance extends Product {
  instructionsLink;
  warrantyLink;
  constructor(productDetails) {
    super(productDetails);
    this.instructionsLink = productDetails.instructionsLink;
    this.warrantyLink = productDetails.warrantyLink;
  }
  extraInfoHTML() {
    return `
      <a href="${this.instructionsLink}" target="_black">
        Instructions
      </a>
      <a href="${this.warrantyLink}" target="_black">
        Warranty
      </a>
    `;
  }
}
export let products = [];
export function loadProductsFetch() {
  const promise = fetch('https://raw.githubusercontent.com/joelmathews5775/my-youtube-learnings/refs/heads/main/products.js').then((response) => {
    return response.json();
  }).then((productsData) => {
    products = productsData.map((productDetails) => {
      if (productDetails.type === 'clothing') {
        return new Clothing(productDetails);
      } else if (productDetails.type === 'appliance') {
          return new Appliance(productDetails);
      } else{
        return new Product(productDetails);
      }
    });
  }).catch((error) => {
    console.log('Unexpected error. Please try again later.');  
  });
  return promise;
}