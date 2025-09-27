import React, { useEffect, useState } from 'react'
import { supabase } from '../../../../supabase';


function CustomersList() {
    const [customers,setCustomers] = useState([]);
    const [loading,setLoading] = useState(true);
    const [error,setError]= useState(null);
    
    
    useEffect(() =>{
        fetchCustomers();
    },[]);

    const fetchCustomers = async () =>{
        try{
            setLoading(true);
            setError(null);

            const {data,error} = await supabase.from('Customer_tbl').select('*').order('created_at',{ascending:true});

            if(error){
                throw error;
            }
            setCustomers(data||[]);
        }catch(error){
            console.error('error fetching customer:',{error});
        }finally{
            setLoading(false);
        }
    };

    const handleToggleStatus = async (customerId) =>{
       
        
        try{
            const currentCustomer = customers.find(c => c.customer_id === customerId);
            const currentStatus = currentCustomer?.status || 'active';
            const newStatus = currentStatus === 'disable'? 'active': 'disable';
            
            const{data,error} = await supabase.from('Customer_tbl').update({status:newStatus}).eq('customer_id',customerId)

            if(error){
                throw error
            }
            console.log('Update successful:', data);
            setCustomers(prevCustomers =>
                prevCustomers.map(customer =>
                    customer.customer_id === customerId
                        ? { ...customer, status: newStatus}
                        : customer
                )
            );
        }catch(error){
            console.error('Error updating status:', error);
        }
    }
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
                        onClick={fetchCustomers}
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
            {customers.map((customer) =>(
                <div
                key={customer.customer_id}
                className='p-3 m-3 transition-shadow duration-300 border border-gray-100 rounded-lg bg-gray-50 hover:shadow-sm hover:bg-gray-100'
                >
                   <div className='flex items-center '>
                     <div className='flex items-center'>
                        <div className='text-sm font-semibold'>{`${customer.customer_id} .`}</div>
                    </div>
                    <div className='flex items-center w-48 ml-10'>
                        <div className='text-sm font-semibold'>{customer.username}</div>
                    </div>
                    <div className='flex items-center ml-28 w-96'>
                        <div className='text-sm font-semibold'>{customer.email}</div>
                    </div>
                    <div className='ml-20'>
                            <button
                        className='flex items-center px-8 py-1 ml-auto bg-green-500 rounded-md hover:bg-green-700'
                        >
                        <span className='text-sm font-semibold text-white'>Info</span> 
                        </button> 
                    </div>
                   <div>
                                        <button
                      onClick={() => handleToggleStatus(customer.customer_id)}
                                
                                className={`flex items-center px-5 py-1 rounded-md text-sm font-semibold transition-colors ml-5 ${
                                     customer.status === 'disable'
                                        ? 'bg-blue-600 text-white cursor-pointer'
                                        : 'bg-red-500 hover:bg-red-700 text-white cursor-pointer'
                                }`}
                            >
                                { customer.status === 'disable' 
                                    ? 'Enable' 
                                    : 'Disable'
                                }
                    </button>
                   </div>

                    </div>
                    
                  
                    
                </div>
        ))}
        
    </div>
      
    
  )
}

export default CustomersList
