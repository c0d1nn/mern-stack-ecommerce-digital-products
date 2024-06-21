import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductCard from '../components/ProductCard';

const Shop = () => {

  const [filteredProducts, setFilteredProducts] = useState([]);
  const [category, setCategory] = useState('');
  const [product, setProduct] = useState([]);

  useEffect(() => {
    axios
        .get(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/product`)
        .then((response) => {
            setProduct(response.data.data);
            setFilteredProducts(response.data.data);
        })
        .catch((error) => {
          console.log(error);
      });
  }, []);


  const filterProducts = () => {
    if (!Array.isArray(product)) {
      console.error("Products is not an array:", product);
      return;
    }

    let filtered = [...product];

    if (category !== '') {
      filtered = filtered.filter((product) => product.category === category);
    }

    setFilteredProducts(filtered);
  };

  useEffect(() => {
    filterProducts();
  }, [product, category]);


  return (
    <div className="p-4 max-w-[1300px] mx-auto mt-16">
      
      <div className="filters flex justify-between mb-6">
        <div className="form-control">
          <label className="label">
            <span className="label-text">Category</span>
          </label>

          <select value={category} onChange={(e) => setCategory(e.target.value)}
                                   className="select select-bordered w-full max-w-xs">
            <option value="">All</option>
            <option value="course">Courses</option>
            <option value="template">Templates</option>
          </select>

        </div>
      </div>

        <ProductCard product={filteredProducts} />

    </div>
  )
}

export default Shop