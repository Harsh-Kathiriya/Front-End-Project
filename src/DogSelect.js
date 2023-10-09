import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import ImageBar from './ImageBar';

const DogSelect = () => {
    //State Variables
  const [breeds, setBreeds] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [imagesData, setImagesData] = useState({});
  const [selectedImageCount, setSelectedImageCount] = useState(10);

  useEffect(() => {
    //Fetch a list of all breeds and sub breeds
    fetch('https://dog.ceo/api/breeds/list/all')
      .then((response) => response.json())
      .then((data) => {
        const breedList = [];

        for (const breed in data.message) {
          if (data.message[breed].length > 0) {
            // If there are sub-breeds, process them
            data.message[breed].forEach((subBreed) => {
              breedList.push({
                label: `${breed} (${subBreed})`,
                value: `${breed} (${subBreed})`,
              });
            });
          } else {
            // If no sub-breeds, just add the breed
            breedList.push({
              label: breed,
              value: breed,
            });
          }
        }

        setBreeds(breedList);
      })
      .catch((error) => console.error(error));
  }, []);

  useEffect(() => {
    //Fetch Images for all the selected breeds
    const fetchData = async () => {
      const newImagesData = {};
      for (const option of selectedOptions) {
        const breed = option.value;
        const parts = breed.split(" (");
        if (parts.length === 2) {
          const firstPart = parts[0].toLowerCase();
          const secondPart = parts[1].slice(0, -1).toLowerCase();
          const response = await fetch(
            `https://dog.ceo/api/breed/${firstPart}/${secondPart}/images/random/${selectedImageCount}`
          );
          const data = await response.json();
          newImagesData[breed] = data.message;
        } else {
          const response = await fetch(
            `https://dog.ceo/api/breed/${breed}/images/random/${selectedImageCount}`
          );
          const data = await response.json();
          newImagesData[breed] = data.message;
        }
      }

      setImagesData(newImagesData);
    };

    fetchData();
  }, [selectedOptions, selectedImageCount]);

  const handleSelectChange = (selectedOptions) => {
    setSelectedOptions(selectedOptions);
  };
  const handleImageCountChange = (selectedValue) => {
    setSelectedImageCount(selectedValue.value);
  };

  const imageCountOptions = [
    { value: 10, label: '10' },
    { value: 20, label: '20' },
    { value: 30, label: '30' },
    { value: 50, label: '50' },
  ];
  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-3xl font-semibold mb-4 text-center text-blue-700">Dog Lovers Gallery!</h1>
      <div className="mb-4">
        <label className="block text-gray-700">Select Breeds and Sub-Breeds</label>
        <Select
          isMulti
          options={breeds}
          value={selectedOptions}
          onChange={handleSelectChange}
          className="text-gray-700"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">Select Number of Images</label>
        <Select
          options={[
            ...imageCountOptions,
            { value: 'custom', label: 'Custom' },
          ]}
          value={
            selectedImageCount === 'custom'
              ? { value: 'custom', label: 'Custom' }
              : { value: selectedImageCount, label: selectedImageCount.toString() }
          }
          onChange={(selectedValue) => {
            if (selectedValue.value === 'custom') {
              const customValue = prompt('Enter the number of images:');
              if (customValue !== null && !isNaN(customValue)) {
                handleImageCountChange({ value: parseInt(customValue, 10) });
              }
            } else {
              handleImageCountChange(selectedValue);
            }
          }}
          className="text-gray-700"
        />
      </div>
      {selectedOptions.map((option, index) => (
        <div key={option.value} className="mb-6">
          <h2 className="text-xl font-semibold mb-2">
            {option.label} Images:
          </h2>
          <ImageBar images={imagesData[option.value] || []} />
        </div>
      ))}
    </div>
  );
};

export default DogSelect;
