import React from 'react';
import './tailwind.css'


const ImageBar = ({ images }) => {
  return (
    <div className="overflow-x-scroll border border-gray-300 p-4 mb-4">
      <div className="flex space-x-4">
        {images.map((imageUrl, index) => (
          <img
            key={index}
            src={imageUrl}
            alt={`Dog ${index}`}
            className="h-32 w-32 object-cover rounded"
          />
        ))}
      </div>
    </div>
  );
};

export default ImageBar;
