import React from 'react';
import ImageField from './ImageField';
import { useState } from 'react';
import {supabase} from '../../../../supabase.js';


function InsertForm() {
const [formData, setFormData] = useState({
  product: '',
  description: '',
  category: '',
  price: '',
  discount: '',
  stocks: ''  
});
 const [imageFile, setImageFile] = useState(null);
 const [uploading, setUploading] = useState(false);

 const handleInputChange = (e) => {
  setFormData({...formData,[e.target.name]: e.target.value});
 };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if(!formData.product || !formData.description || !formData.category || !formData.price || !formData.discount || !formData.stocks){
      alert('please fill the all the fields');
      return;
  }
  
  if (! imageFile){
    alert('please upload the product image');
    return;
  }
  
  setUploading(true);

  try {
    const fileName = `${Date.now()}-${imageFile.name}`;
    const {data:uploadingData,error:storageError} = await supabase
    .storage
    .from('productImages')
    .upload(fileName,imageFile);
    
    if(storageError){
      console.error("Storage error:",storageError);
      throw storageError;
    }else{
      console.log('File uploaded successfully:',uploadingData);
    }

    const {data} = supabase.storage.from('productImages').getPublicUrl(fileName);
    const imageUrl = data.publicUrl;

    const {data:insertData,error:dbError } = await supabase.from('Product_tbl').insert([{
      product: formData.product,
      description: formData.description,
      category: formData.category,
      price: formData.price,
      discount: formData.discount,
      stocks: formData.stocks,
      image_url: imageUrl
    }]);
    
    if(dbError){
      console.error("Database error:",dbError);
      throw dbError;
    }
    
    alert('Product added successfully!');
    console.log('Inserted data:',insertData);
    setFormData({
      product: '',
      description: '',
      category: '',
      price: '',
      discount: '',
      stocks: ''
    });
    setImageFile(null);
  
  }catch (error) {
    console.error("error:",error);
    alert('Error adding product. Please try again.');
  }finally{
    setUploading(false);
  }
}
  
  return (
    <div className="h-full col-span-2 bg-white ">
      
      <div className="p-5 text-2xl font-bold ">Add New Product</div>
      
      <div className="grid grid-cols-2 gap-5">
        <div className="ml-5">
          
          <label htmlFor="product" className="grid grid-cols-2 gap-5">
            Product Name
          </label>
          <input
            type="text"
            name='product'
            value={formData.product}
            onChange={handleInputChange}
            className="flex w-full p-2 mt-2 mb-8 border rounded"
            placeholder="Enter Product Name Here.."
          />

          <label htmlFor="discription" className="">
            Discription
          </label>
          <textarea
            value={formData.description}
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
            value={formData.category}
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
                value={formData.price}
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
                className="flex w-full p-2 mt-2 mb-4 border rounded appearance-none"
                value={formData.discount}
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
            value={formData.stocks}
            onChange={handleInputChange}
            className="flex w-full p-2 mt-2 mb-4 border rounded"
            placeholder="Enter Product Stocks Here.."
          />
          
        </div>
        <div>
          <ImageField onImageSelect={setImageFile} />
        </div>

        <div className="col-span-2 mx-auto">
          <button
            type="submit"
            className={` h-10 text-white bg-green-400 border rounded-lg w-60 hover:bg-green-600 ${uploading ? 'cursor-not-allowed bg-green-200 hover:bg-green-200' : ''}`}
            onClick={handleSubmit}
            disabled={uploading}
          >
            {uploading ? "uploding..." : "+ Add Product"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default InsertForm;
