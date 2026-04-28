import {cart} from '../../data/cart-class.js';
import {getProduct} from '../../data/products.js';
import {deliveryOptions, getDeliveryOption, calculateDeliveryDate} from '../../data/deliveryoptions.js';
import {formatCurrency} from '../utils/money.js';
import {orders, addOrder, generateOrderId} from '../../data/order.js';
import dayjs from 'https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js';
export function renderPaymentSummary() {
  let productPriceCents = 0;
  let shippingPriceCents = 0;
  cart.cartItems.forEach((cartItem) => {
    const product = getProduct(cartItem.productId);
    productPriceCents += product.priceCents * cartItem.quantity;
    const deliveryOption = getDeliveryOption(cartItem.deliveryOptionId);
    shippingPriceCents += deliveryOption.priceCents;
  });
  const totalBeforeTaxCents = productPriceCents + shippingPriceCents;
  const taxCents = totalBeforeTaxCents * 0.1;
  const totalCents = totalBeforeTaxCents + taxCents;
  let cartQuantity = 0;
  cart.cartItems.forEach((cartItem) => {
    cartQuantity += cartItem.quantity;
  });
  const paymentSummaryHTML = `
    <div class="payment-summary-title">
      Order Summary
    </div>
    <div class="payment-summary-row">
      <div class="js-cart-item-count">Items (${cartQuantity}):</div>
      <div class="payment-summary-money">$${formatCurrency(productPriceCents)}</div>
    </div>
    <div class="payment-summary-row">
      <div>Shipping &amp; handling:</div>
      <div class="payment-summary-money js-payment-summary-shipping">$${formatCurrency(shippingPriceCents)}</div>
    </div>
    <div class="payment-summary-row subtotal-row">
      <div>Total before tax:</div>
      <div class="payment-summary-money">$${formatCurrency(totalBeforeTaxCents)}</div>
    </div>
    <div class="payment-summary-row">
      <div>Estimated tax (10%):</div>
      <div class="payment-summary-money">$${formatCurrency(taxCents)}</div>
    </div>
    <div class="payment-summary-row total-row">
      <div>Order total:</div>
      <div class="payment-summary-money js-payment-summary-total">$${formatCurrency(totalCents)}</div>
    </div>
    <button class="place-order-button button-primary js-place-order">
      Place your order
    </button>
  `;
  document.querySelector('.js-payment-summary').innerHTML = paymentSummaryHTML;
  document.querySelector('.js-place-order').addEventListener('click', () => {
    let order;
    const id = generateOrderId();
    const today = dayjs().toISOString();
    const products = [];
    cart.cartItems.forEach((cartItem) => {
      const totalBeforeTaxCents = productPriceCents + shippingPriceCents;
      const taxCents = totalBeforeTaxCents * 0.1;
      const totalCents = totalBeforeTaxCents + taxCents;
      const productId = cartItem.productId;
      const quantity = cartItem.quantity;
      const deliveryOptionId = cartItem.deliveryOptionId;
      const deliveryOption = getDeliveryOption(cartItem.deliveryOptionId);
      const estimatedDeliveryTime = calculateDeliveryDate(deliveryOption).toISOString();
      products.push({
        productId: productId,
        quantity: quantity,
        deliveryOptionId: deliveryOptionId,
        estimatedDeliveryTime: estimatedDeliveryTime
      });
    });
    order = {
      id: id,
      orderTime: today,
      totalCostCents: totalCents,
      products: products
    };
    addOrder(order);
    cart.resetCart();
    window.location.href = 'orders.html';
  });
}