
import React,  {useState }from 'react'
import { supabase } from '../../../../supabase';

const DeleteProduct = ({productId,productName,onDeleteSuccess}) => {
    const [isDeleting,setIsDeleting] = useState(false);
    
    const handleDelete = async ()=> {
        const isConfirmed = window.confirm(
            `Are you sure you wont to delete "${productName}"?\n\n This action can not be undone.`
        );
        if(!isConfirmed){
            return
        }
        setIsDeleting(true);
        try{
           const{ error } = await supabase
            .from('Product_tbl')
            .delete()
            .eq('product_id',productId);

            if(error){
                throw(error)
            };
            
            if(onDeleteSuccess){
                onDeleteSuccess(productId)
            };
            
            alert('Product deleted successfully!');
        }catch(error){
            console.error('Error deleting product:',error);
            alert('failed to delete product. please try again!');
        }finally{
            setIsDeleting(false);
        }
            
        
            
        
    };

  return (
    <div>
       <button 
       onClick={handleDelete}
       disabled={isDeleting}
       className='flex items-center px-3 py-2 mt-5 ml-4 space-x-2 font-medium text-white transition-colors duration-200 bg-red-600 border border-red-600 rounded-md hover:bg-red-800 disabled:opacity-50 disabled:cursor-not-allowed'
       >
        {isDeleting ? (
        <>
            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25"></circle>
                <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" className="opacity-75"></path>
            </svg>
            <span>Deleting...</span>
        </>
        
       ):(
        <>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>                
            <span>Delete</span>
        </>
       )}
       </button>
    </div>
  )
}

export default DeleteProduct
