import React, { useEffect, useState } from 'react';
import { getBaseUrl } from '../utils/baseURL';
import TimelineStep from './Timeline';

const PaymentSuccess = () => {
  const [order, setOrder] = useState(null);
  const [error, setError] = useState(null);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const client_reference_id = query.get('client_reference_id');

    if (client_reference_id) {
      fetch(`${getBaseUrl()}/api/orders/confirm-payment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ client_reference_id }),
      })
        .then((res) => (res.ok ? res.json() : Promise.reject(`HTTP error! status: ${res.status}`)))
        .then(async (data) => {
          if (data.error) throw new Error(data.error);
          if (!data.order) throw new Error('No order data received.');

          setOrder(data.order);

          const productsDetails = await Promise.all(
            data.order.products.map(async (item) => {
              const response = await fetch(`${getBaseUrl()}/api/products/${item.productId}`);
              const productData = await response.json();
              return {
                ...productData.product,
                quantity: item.quantity,
                selectedSize: item.selectedSize,
              };
            })
          );
          setProducts(productsDetails);
        })
        .catch((err) => {
          console.error('Error confirming payment', err);
          setError(err.message);
        });
    } else {
      setError('No session ID found in the URL');
    }
  }, []);

  const currency = order?.country === 'الإمارات' ? 'AED' : 'OMR';
  const exchangeRate = order?.country === 'الإمارات' ? 9.5 : 1;

  const formatPrice = (price) => (price * exchangeRate).toFixed(2);

  if (error) return <div className="text-red-500">Error: {error}</div>;
  if (!order) return <div>Loading…</div>;

  return (
    <section className="section__container rounded p-6">
      {/* Products */}
      <div className="mt-8 pt-6" dir="ltr">
        <h3 className="text-xl font-bold mb-4">Order Items</h3>
        <div className="space-y-6">
          {products.map((product, index) => (
            <div key={index} className="flex flex-col md:flex-row gap-4 p-4 border rounded-lg">
              <div className="md:w-1/4">
                <img
                  src={Array.isArray(product.image) ? product.image[0] : product.image}
                  alt={product.name}
                  className="w-full h-auto rounded-md"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/150';
                    e.target.alt = 'Image not available';
                  }}
                />
              </div>
              <div className="md:w-3/4">
                <h4 className="text-lg font-semibold">{product.name}</h4>
                <p className="text-gray-600 mt-2">{product.description}</p>
                <div className="mt-2">
                  <span className="font-medium">Quantity: </span>
                  <span>{product.quantity}</span>
                </div>
                {product.category === 'حناء بودر' && product.selectedSize && (
                  <div className="mt-2">
                    <span className="font-medium">Size: </span>
                    <span>{product.selectedSize}</span>
                  </div>
                )}
                <div className="mt-2">
                  <span className="font-medium">Category: </span>
                  <span>{product.category}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Order Summary */}
      <div className="mt-8 border-t pt-6" dir="ltr">
        <h3 className="text-xl font-bold mb-4">Order Summary</h3>
        <div className="bg-gray-50 p-4 rounded-lg space-y-3">
          <div className="flex justify-between py-2">
            <span>Subtotal:</span>
            <span className="font-semibold">
              {formatPrice(order.amount - order.shippingFee)} {currency}
            </span>
          </div>

          <div className="flex justify-between py-2">
            <span>Shipping:</span>
            <span className="font-semibold">{formatPrice(order.shippingFee)} {currency}</span>
          </div>

          <div className="flex justify-between py-2 border-t pt-3">
            <span className="font-medium">Total:</span>
            <span className="font-bold text-lg">{formatPrice(order.amount)} {currency}</span>
          </div>

          <div className="flex justify-between py-2 border-t pt-3">
            <span>Order Status:</span>
            <span className="font-semibold">{order.status}</span>
          </div>

          <div className="flex justify-between py-2">
            <span>Customer Name:</span>
            <span className="font-semibold">{order.customerName}</span>
          </div>

          <div className="flex justify-between py-2">
            <span>Phone:</span>
            <span className="font-semibold">{order.customerPhone}</span>
          </div>

          <div className="flex justify-between py-2">
            <span>Country:</span>
            <span className="font-semibold">{order.country}</span>
          </div>

          <div className="flex justify-between py-2">
            <span>Wilayat/State:</span>
            <span className="font-semibold">{order.wilayat}</span>
          </div>

          <div className="flex justify-between py-2 border-t pt-3">
            <span>Order Date:</span>
            <span className="font-semibold">
              {new Date(order.createdAt).toLocaleDateString('en-GB')}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PaymentSuccess;
