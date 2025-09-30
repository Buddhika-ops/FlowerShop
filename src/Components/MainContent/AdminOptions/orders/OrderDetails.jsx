import React, { useEffect, useState } from 'react';
import { supabase } from '../../../../supabase';

function OrderDetails({ orderId, onBack }) {
  const [orderItems, setOrderItems] = useState([]);
  const [orderInfo, setOrderInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (orderId) {
      fetchOrderDetails();
    }
  }, [orderId]);

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      setError(null);

    
      const { data: orderData, error: orderError } = await supabase
        .from('order_tbl')
        .select(`
          *,
          customer:customer_id (
            customer_name,
            email,
            phone_number
          )
        `)
        .eq('order_id', orderId)
        .single();

      if (orderError) {
        throw orderError;
      }

      setOrderInfo(orderData);

      // Then, get the order items with product details
      const { data: itemsData, error: itemsError } = await supabase
        .from('order_item_tbl')
        .select(`
          *,
          product:product_id (
            product,
            description,
            category,
            price,
            discount,
            stocks,
            image_url
          )
        `)
        .eq('order_id', orderId);

      if (itemsError) {
        throw itemsError;
      }

      setOrderItems(itemsData || []);
    } catch (error) {
      console.error('Error fetching order details:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };
  const handleCompleteOrder = async () => {
    try {
    
      if (!window.confirm('Are you sure you want to mark this order as completed?')) {
        return;
      }

      const { data, error } = await supabase
        .from('order_tbl')
        .update({ status: 'completed' })
        .eq('order_id', orderId);

      if (error) {
        throw error;
      }

      console.log('Order status updated to completed:', data);
      alert('Order marked as completed successfully!');
      fetchOrderDetails();
      
      
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('Failed to update order status. Please try again.');
    }
  };
  
  const subTotal = (price, quantity) => {
  return (price ?? 0) * (quantity ?? 0);
};

const totalAmount = (price, quantity, discount) => {
  const subtotal = subTotal(price, quantity);
  const discountPercent = Number(discount) || 0;
  return subtotal - (subtotal * discountPercent / 100);
};

const grandTotal = (items) => {
  return items.reduce((sum, item) => {
    const price = item.product?.price ?? 0;
    const qty = item.quantity ?? 0;
    const discount = Number(item.product?.discount) || 0;

    const subtotal = price * qty;
    const totalAfterDiscount = subtotal - (subtotal * discount / 100);

    return sum + totalAfterDiscount;
  }, 0);
};

  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-16 h-16 border-b-2 border-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-5">
        <div className="max-w-md px-4 py-3 text-red-700 bg-red-100 border border-red-700 rounded">
          <p className="text-center text-md">Error loading order details</p>
          <p className="text-sm">{error}</p>
          <button
            onClick={fetchOrderDetails}
            className="px-4 py-2 mt-3 text-white bg-red-400 rounded-lg hover:bg-red-500"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-white">
      <div className="p-5">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Order Details</h2>
          <div>
           {orderInfo?.status === 'pending' && (
              <button
                onClick={handleCompleteOrder}
                className="px-6 py-2 font-medium text-white transition-colors bg-green-600 rounded-lg hover:bg-green-700"
              >
                Mark as Complete
              </button>
            )}
           <button
            onClick={onBack}
            className="px-4 py-2 m-5 text-gray-600 bg-gray-200 rounded-lg hover:bg-gray-300"
          >
            ← Back
          </button>
          </div>
          
        </div>

        {orderInfo && (
          <div className="p-4 mb-6 rounded-lg bg-gray-50">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <h3 className="font-semibold text-gray-700">Order Information</h3>
                <p className="text-sm"><span className="font-medium">Order ID:</span> {orderInfo.order_id}</p>
                <p className="text-sm"><span className="font-medium">Date:</span> {new Date(orderInfo.order_date).toLocaleDateString()}</p>
                <p className="text-sm"><span className="font-medium">Status:</span> 
                  <span className={`px-2 py-1 ml-2 text-xs text-white bg-green-500 rounded-full
                    ${orderInfo.status==='completed'
                      ? 'bg-yellow-500'
                      : ' bg-green-500'
                    }`}>
                    {orderInfo.status}
                  </span>
                
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-700">Customer Information</h3>
                <p className="text-sm"><span className="font-medium">Name:</span> {orderInfo.customer?.customer_name || 'N/A'}</p>
                <p className="text-sm"><span className="font-medium">Email:</span> {orderInfo.customer?.email || 'N/A'}</p>
                <p className="text-sm"><span className="font-medium">Phone:</span> {orderInfo.customer?.phone_number || 'N/A'}</p>
              </div>
            </div>
          </div>
        )}

<div className="p-4 font-semibold text-right rounded-lg bg-blue-50">
                <p className="text-lg ">
                 Order Total:  <span className='text-red-600'>Rs {orderInfo ? parseFloat(grandTotal(orderItems) || 0).toFixed(2) : '0.00'}</span> 
                </p>
              </div>
        <div>
          <h3 className="mb-4 text-lg font-semibold">Ordered Products</h3>
          
          {orderItems.length === 0 ? (
            <p className="text-gray-500">No products found for this order.</p>
          ) : (
            <div className="space-y-4">
              {orderItems.map((item) => (
                <div
                  key={item.order_item_id}
                  className="p-4 border border-gray-200 rounded-lg bg-gray-50"
                >
                  <div className="flex items-start space-x-4">
                    {item.product?.image_url && (
                      <img
                        src={item.product.image_url}
                        alt={item.product?.product || 'Product'}
                        className="object-cover w-16 h-16 rounded-md"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    )}
                    
                    <div className="flex-1">
                      <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                        <div>
                          <h4 className="font-semibold text-gray-800">
                            {item.product?.product || 'Unknown Product'}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {item.product?.description || 'No description available'}
                          </p>
                          <p className="text-sm text-gray-500">
                            <span className="font-medium">Category:</span> {item.product?.category || 'N/A'}
                          </p>
                        </div>
                        
                        <div className="text-sm">
                          <p><span className="font-medium">Quantity:</span> {item.quantity}</p>
                          <p><span className="font-medium">Price Each:</span> Rs {parseFloat(item.product?.price || 0).toFixed(2)}</p>
                          <p><span className="font-medium">Subtotal:</span>  Rs {parseFloat( subTotal(item.product?.price,item.quantity) || 0).toFixed(2)}</p>
                          {item.product?.discount ? (
  <>
    <p>
      <span className="font-medium">Discount:</span> {item.product.discount}
    </p>
    <p className="text-green-600">
      <span className="font-medium">Total after Discount:</span> Rs {totalAmount(item.product?.price, item.quantity, item.product?.discount).toFixed(2)}
    </p>
  </>
) : null}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default OrderDetails;