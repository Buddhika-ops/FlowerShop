import React, { useEffect, useState } from 'react'
import { supabase } from '../../../../supabase';
import ImageField from '../Insert/ImageField';

const UpdateForm = ({productId = 1,onBack}) => {

    
const [product,setProduct]= useState({
    product_id : '',
    product:'',
    description:'',
    category: '',
    price: '',
    discount: '',
    stocks: '',
    image_url: '',
    created_at: ''
});
const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [message, setMessage] = useState('');
  const [imageFile, setImageFile] = useState(null);

useEffect(()=>{
    fetchProduct();
},[productId]);

const fetchProduct = async () => {
    try{
        setLoading(true);

        const {data,error} = await supabase
        .from('Product_tbl')
        .select('*')
        .eq('product_id',productId)
        .single()

        if(error){
            throw error
        };
        if(data){
            setProduct(data)
        };

    }catch(error){
        console.error('Error fetching product:', error);
        setMessage(`Error fetching product: ${error.message}`);
    }finally{
        setLoading(false);
    }
};

    const handleInputChange = (e) =>{
        const{ name, value} = e.target;
        setProduct (prev => ({
            ...prev,
            [name]: value
        }));
    }


const handleSubmit = async (e) =>{
    e.preventDefault();

    if(!product.product || !product.description || !product.category || !product.price || !product.discount || !product.stocks){
    setMessage('Please fill all the fields')
    return;
    }
    setUpdating(true);
    setMessage('');

    try{
        let imageUrl = product.image_url;

        if(imageFile){
            const fileName = `${Date.now()} - ${imageFile.name}`;
            const {data: uploadingData, error: storageError} = await supabase.storage.from('productImages').upload(fileName,imageFile);

            if(storageError){
                console.error('Storage error:',storageError)
                throw storageError
            }else{
                console.log('Image upload successfuly!',uploadingData)
                
            };

            const {data} = supabase.storage.from('productImages').getPublicUrl(fileName);
            imageUrl = data.publicUrl; 
        }

        const{data: updateData , error: dbError} = await supabase.from('Product_tbl').update({
            product: product.product,
            description: product.description,
            category: product.category,
            price: product.price,
            discount: product.discount,
            stocks: product.stocks,
            image_url: imageUrl
        })
        .eq('product_id',productId)
        .select();

        if(dbError){
            console.error('database updating error:',dbError);
            throw dbError;
        }
      setMessage('Product updated successfully!');
        console.log('update data',updateData);
        setImageFile(null);
    }catch(error){
        console.error('Error updating product:',error);
        setMessage(`Error updating product: ${error.message}`);

    }finally{
        setUpdating(false);
    }

};

const handleBack = () => {
    if (onBack) {
      onBack(); // Use the callback from parent component
    } else {
      window.history.back(); // Fallback to browser back
    }
  };
if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto border-b-2 border-blue-600 rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600">Loading product...</p>
        </div>
      </div>
    );
  }
  return (
      <div >
                    <div className="p-5 text-2xl font-bold ">Update Product</div>
                    <div className="grid grid-cols-2 gap-5">
                    <div className="ml-5">
                    
                    <label htmlFor="product" className="grid grid-cols-2 gap-5">
                        Product Name
                    </label>
                    <input
                        type="text"
                        name='product'
                        value={product.product}
                        onChange={handleInputChange}
                        className="flex w-full p-2 mt-2 mb-8 border rounded"
                        placeholder="Enter Product Name Here.."
                    />
                    <label htmlFor="discription" className="">
                        Discription
                    </label>
                    <textarea
                        value={product.description}
                        onChange={handleInputChange}
                        name="description"
                        id="description"
                        placeholder="Enter Product Description Here..."
                        className="flex w-full p-2 mt-2 mb-4 border rounded"
                        rows="4"
                    ></textarea>
                    
                    <label htmlFor="category" className="">
                        Category
                    </label>
                    <select
                        name="category"
                        id="category"
                        className="flex w-full p-2 mt-2 mb-4 border rounded appearance-none"
                        value={product.category}
                        onChange={handleInputChange}
                    >
                        <option value="">Select Category</option>
                        <option value="5%">5%</option>
                        <option value="10%">10%</option>
                        <option value="15%">15%</option>
                        <option value="20%">20%</option>
                        <option value="25%">25%</option>
                    </select>
                    
                    <div className="grid grid-cols-2 gap-1">
                        <div>
                        <label htmlFor="Price" className="">
                            Price
                        </label>

                        <input
                            type="text"
                            name="price"
                            className="flex p-2 mt-2 mb-4 border rounded"
                            placeholder="Rs.0.00"
                            value={product.price}
                            onChange={handleInputChange}
                        />
                        </div>

                        <div>
                        <label htmlFor="discount" className="">
                            Discount
                        </label>

                        <select
                            name="discount"
                            id="discount"
                            className="flex w-full p-2 mt-2 mb-2 border rounded appearance-none"
                            value={product.discount}
                            onChange={handleInputChange}
                        >
                            <option value="">Select Discount</option>
                            <option value="5%">5%</option>
                            <option value="10%">10%</option>
                            <option value="15%">15%</option>
                            <option value="20%">20%</option>
                            <option value="25%">25%</option>
                        </select>
                        </div>
                        
                    </div>
                        <label htmlFor="stocks" className="grid grid-cols-2 gap-5">
                        Product Stocks
                    </label>
                    <input
                        name="stocks"
                        type="text"
                        value={product.stocks}
                        onChange={handleInputChange}
                        className="flex w-full p-2 mt-2 border rounded"
                        placeholder="Enter Product Stocks Here.."
                    />
                    
                    </div>
                    <div>
                    <ImageField onImageSelect={setImageFile} 
                     initialImageUrl={product.image_url}
                    />
                    
                    
                    </div>
                    {message && (<div
                        className={`col-span-2 mx-auto py-2 rounded-md px-52 ${
                            message.includes('Error') || message.includes('Please fill')
                            ? 'bg-red-50 border border-red-200 text-red-700'
                            : 'bg-green-50 border border-green-200 text-green-700'
                        }`}
                        >
                            <span className=' font-md semibold text-'>{message}</span>
                        </div>
)}   
                    <div className="col-span-2 mx-auto">
                        <button
            onClick={handleBack}
            className="h-10 mr-10 text-gray-700 transition-colors bg-gray-200 border rounded-lg w-60 hover:bg-gray-300 "
          >
            Cancel
          </button>
                        
                    <button
                        type="submit"
                        className={`h-10 text-white bg-blue-400 border rounded-lg w-60 hover:bg-blue-600 ${updating ? 'cursor-not-allowed bg-blue-200 hover:bg-blue-200' : ''}`}
                        onClick={handleSubmit}
                        disabled={updating}
                    >
                        {updating ? "Updating..." : "Update Product"}
                    </button>
                    </div>
                </div>
      </div>
   
  )
}

export default UpdateForm
