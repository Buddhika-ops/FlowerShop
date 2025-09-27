import React, { useState, useEffect } from 'react';

function ImageField({ onImageSelect, initialImageUrl = null }) {
  const [image, setImage] = useState(null);
  const [currentImageUrl, setCurrentImageUrl] = useState(initialImageUrl);
  
  // Update the current image when initialImageUrl changes
  useEffect(() => {
    setCurrentImageUrl(initialImageUrl);
    // Clear any uploaded image when we get a new initial image
    if (initialImageUrl) {
      setImage(null);
    }
  }, [initialImageUrl]);
  
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageObj = {
        file,
        preview: URL.createObjectURL(file),
      };
      setImage(imageObj);
      setCurrentImageUrl(null); // Hide the current image when new one is uploaded
      onImageSelect(file);
    }
  };
  
  const removeImage = () => {
    setImage(null);
    onImageSelect(null);
    // Don't reset currentImageUrl here - let the parent component handle it
  };

  const removeCurrentImage = () => {
    setCurrentImageUrl(null);
    onImageSelect(null);
  };
  
  // Determine what to display
  const showUploadArea = !image && !currentImageUrl;
  const showNewImage = image && !currentImageUrl;
  const showCurrentImage = currentImageUrl && !image;
  
  return (
    <div>
      <label htmlFor="productImage" className="block mb-2 ml-20">
        Product Image
      </label>
      
      <div className="flex gap-4">
        {showUploadArea && (
          <label className="flex items-center justify-center mx-auto transition border-2 border-gray-300 border-dashed rounded-lg cursor-pointer h-96 w-96 hover:bg-blue-50 hover:border-blue-400">
            <span className="text-sm text-center text-gray-400">
              Click to Upload
            </span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
            />
          </label>
        )}
        
        {showNewImage && (
          <div className="relative mx-auto bg-green-100 w-96 h-96">
            <img
              src={image.preview}
              alt="New image preview"
              className="object-cover w-full h-full border rounded"
            />
            <button
              type="button"
              className="absolute inset-0 flex items-center justify-center text-sm text-white transition bg-black rounded-lg opacity-0 bg-opacity-40 hover:opacity-100"
              onClick={removeImage}
            >
              Remove New Image
            </button>
          </div>
        )}
        
        {showCurrentImage && (
          <div className="mx-auto w-96 h-96">
            <div className="relative w-full h-full bg-blue-100">
              <img
                src={currentImageUrl}
                alt="Current product image"
                className="object-cover w-full h-full border rounded"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/400x400?text=Image+Not+Found';
                }}
              />
         <button
              type="button"
              className="absolute inset-0 flex items-center justify-center text-sm text-white transition bg-black rounded-lg opacity-0 bg-opacity-40 hover:opacity-100"
              onClick={removeCurrentImage}
            >
              Remove Image
            </button>
            </div>
           
          </div>
        )}
      </div>
      
      
      
    </div>
  );
}

export default ImageField;