import React,  { useEffect,useState }from 'react'
import { supabase } from '../../../../supabase';
import DeleteProduct from './DeleteProduct';
import UpdateForm from './UpdateForm';

function ProductList() {
    const [products,setProducts] = useState([]);
    const [loading,setLoding] = useState(true);
    const [error,setError] = useState(null);
     const [selectedProduct, setSelectedProduct] = useState(null);
  const [showUpdateForm, setShowUpdateForm] = useState(false);

    useEffect(() =>{
        fetchProducts();
    },[])
    const fetchProducts = async ()=>{
        try{
            setLoding(true);
            setError(null);
            
            const{data,error} = await supabase.from('Product_tbl').select('*').order('created_at',{ascending:false});

            if (error){
                throw error;
            }
            setProducts(data||[]);
        }catch(error){
            console.error('error fetching product : ',error)
            setError ('failed to load products try again later');   
        }finally{
            setLoding(false);
        }
    };
    const formatPrice = (price) =>{
        return(`Rs ${parseFloat(price|| 0).toFixed(2)}`);
    }
    if (loading) { 
        return(
            <div className='col-span-3 mx-auto mt-72'>
              <div className='w-16 h-16 border-b-2 border-blue-500 rounded-full animate-spin'></div>
            </div>       
        );
    }
    if (error) {
        return(
            <div className="col-span-2 bg-white mt-72">
                <div className='flex items-center justify-center h-full'>
                    <div className='max-w-md px-4 py-3 text-red-700 bg-red-100 border border-red-700 rounded '>
                        <p className='text-center text-md'>Error</p>
                        <p className='text-sm'>{error}</p>
                        <button 
                        onClick={fetchProducts}
                        className='px-4 py-2 mt-3 text-white bg-red-400 rounded-lg hover:bg-red-500'>
                            Retry
                        </button>
                    </div>
                </div>
            </div>
        );
    }
    if (products.lenth === 0){
        return(
        <div className="col-span-2 bg-white ">
            <div className='flex items-center justify-center h-full mt-60'>
                <div className='text-center text-gray-400'>
                    <p className='text-lg'>No Products Found</p>
                    <p className='text-md'>Add some products to see them here.</p>
                </div>  
            </div>
      </div>
        )
    }
    const handleEditProduct = (product) => {
    setSelectedProduct(product);
    setShowUpdateForm(true);
  };

  const handleBackToList = () => {
  setShowUpdateForm(false);
  setSelectedProduct(null);
  fetchProducts();
};

  
   if (showUpdateForm && selectedProduct) {
    return (
        <div className="h-full col-span-2 bg-white ">
        <UpdateForm 
          key={selectedProduct.product_id} 
          productId={selectedProduct.product_id} 
          onBack={handleBackToList}
        />
      </div>
    );
  }
    
    
  return (
       <div className="h-full col-span-2 bg-white ">
        <div className="p-5 text-2xl font-bold ">Product List</div>
        {products.map((product) =>(
             <div 
             key={product.product_id}
             className='p-3 m-3 transition-shadow duration-300 border border-gray-100 rounded-lg bg-gray-50 hover:shadow-md hover:bg-gray-50'
             >
                <div className='flex items-start justify-between'>
                    <div className='flex items-start flex-1 space-x-4'>
                        <div className='flex-shrink-0 w-32 h-24 overflow-hidden bg-gray-200 rounded '>
                            {product.image_url ?(
                                <img 
                                src={product.image_url}
                                alt={product.product || 'Product' } 
                                className='object-cover w-full h-full'
                                onError = {e=>{
                                    e.target.src = 'https://via.placeholder.com/96x96?text=No+Image';
                                }}
                                />
                            ):(
                                <div className='flex items-center justify-center w-full h-full bg-gray-200'>
                                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                </div>
                            )}
                        </div>
                        
                        <div className='flex-1 '>
                            <h3 className='mb-1 text-xl font-semibold text-gray-800 '>
                                {product.product}
                            </h3>
                                
                            <p className='mb-3 text-sm text-gray-600'> 
                                {product.description} 
                            </p>

                            <div className='flex items-center space-x-4 text-sm' >
                                {product.category && (
                                    <span className='inline-block px-3 py-1 text-white bg-blue-600 rounded-full'>
                                        {product.category}
                                    </span>
                                )}
                           
                                <div className='flex items-center'>
                                    <span className='font-semibold text-green-600'>
                                    {formatPrice(product.price)}    
                                    </span>
                                </div>
                                
                                <div className='flex items-center'>
                                    <span className='text-sm font-semibold text-orange-600'>
                                       Discount: {product.discount}
                                    </span>    
                                </div>
                                
                                <div className='flex items-center'>
                                    <span className='text-sm font-semibold text-gray-700'>
                                       Stocks: {product.stocks}
                                    </span>
                                </div>
                            </div>  
                             
                            <div className='mt-1 text-xs text-gray-400'>
                                Created: {new Date(product.created_at).toLocaleDateString("en-GB",{
                                    day:"2-digit",
                                    month:"2-digit",
                                    year:"numeric"
                                })}
                            </div> 
                        </div>                    
                    </div>
                    <div>
                        <button 
                        onClick={() => handleEditProduct(product)}
                        className='flex items-center px-5 py-2 mt-5 ml-4 space-x-2 font-medium text-white transition-colors duration-200 bg-blue-600 border border-blue-600 rounded-md hover:bg-blue-800'>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg> 
                            <span>Edit</span>
                        </button>
                        
                       <DeleteProduct
                       productId = {product.product_id}
                       productName = {product.product}
                       onDeleteSuccess = {(deletedId) =>{
                        setProducts(prev => prev.filter(p => p.product_id !== deletedId));
                        fetchProducts();
                       }}
                       />
                        
                    </div>
                </div>
            
            </div>
        ))}
       
           
      </div>
   
  )
}

export default ProductList;
