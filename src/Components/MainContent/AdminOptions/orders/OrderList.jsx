import React, { useEffect, useState } from 'react'
import { supabase } from '../../../../supabase';

function OrderList() {
    const [orders,setOrders] = useState([]);
    const [loading,setLoading] = useState(false);
    const [error,setError] = useState(null);

    useEffect( () => {
        fetchOrders()
    },[]);

    const fetchOrders = async () =>{
        try{
            setLoading(true);
            setError(null);

            const {data,error} = await supabase.from('order_tbl').select(`*,
                customer:customer_id (
                        customer_name,
                        email,
                        phone_number)`)
                        .order('order_date',{ascending:true});

            if(error){
                throw error
            };

            setOrders(data || []);
        }catch(error){
            console.error('data fetching error:',{error})
        }finally{
            setLoading(false)
        }
    };
if (loading) { 
        return(
            <div className='col-span-3 mx-auto mt-72'>
              <div className='w-16 h-16 border-b-2 border-blue-500 rounded-full animate-spin'></div>
            </div>       
        );
    };

    if (error) {
        return(
            <div className="col-span-2 bg-white mt-72">
                <div className='flex items-center justify-center h-full'>
                    <div className='max-w-md px-4 py-3 text-red-700 bg-red-100 border border-red-700 rounded '>
                        <p className='text-center text-md'>Error</p>
                        <p className='text-sm'>{error}</p>
                        <button 
                        onClick={fetchOrders}
                        className='px-4 py-2 mt-3 text-white bg-red-400 rounded-lg hover:bg-red-500'>
                            Retry
                        </button>
                    </div>
                </div>
            </div>
        );
    }

  return (
    <div className="h-full col-span-2 bg-white ">
          <div className="p-5 text-2xl font-bold ">Customers List</div>
          {orders.map((order) =>
          <div 
          key={order.order_id}
          className='p-3 m-3 transition-shadow duration-300 border border-gray-100 rounded-lg bg-gray-50 hover:shadow-sm hover:bg-gray-100'
          >
            <div className='flex items-center '>
                     <div className='flex items-center'>
                        <div className='text-sm font-semibold'>{`${order.order_id} .`}</div>
                    </div>
                    <div className='flex items-center ml-8 w-60'>
                        <div className='text-sm font-semibold'>{order.customer?.customer_name || 'Unknown customer'}</div>
                    </div>
                     <div className='flex items-center w-40 '>
                        <div className='text-sm font-semibold'>{new Date(order.order_date).toLocaleDateString()}</div>
                    </div>
                     <div className='flex items-center w-40 '>
                        <div className='text-sm font-semibold'>{`Rs ${parseFloat(order.total_amount|| 0).toFixed(2)}`}</div>
                    </div>
                    <div className='flex items-center ml-8 w-60'>
                        <div className='px-6 py-1 text-sm font-semibold text-white bg-green-500 rounded-3xl' >{order.status}</div>
                    </div>
            
                    <div className='flex items-center space-x-2'>
                            <button className='flex items-center px-8 py-1 bg-blue-500 rounded-md hover:bg-blue-700'>
                                <span className='text-sm font-semibold text-white'>View More</span>
                            </button>
                    </div>
          </div>
          
          </div>
          
        )}
    </div>
  )
}

export default OrderList
