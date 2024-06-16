// src/components/ProductList/ProductList.tsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import productService from '../api/productService';
import { Product } from '../../types/Product';
import './ProductList.css';

const ProductList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await productService.getAllProducts();
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="product-list-container">
      <h2>Product List</h2>
      <table>
        <thead>
          <tr>
            <th>Milk Name</th>
            <th>Price</th>
            <th>Discount</th>
            <th>Pictures</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.milkId}>
              <td>{product.milkName}</td>
              <td>{product.price}</td>
              <td>{product.discount}</td>
              <td>
                {product.pictures && product.pictures.length > 0 ? (
                  product.pictures.map((pic, index) => (
                    <img key={index} src={pic} alt={`Milk ${index}`} width="50" />
                  ))
                ) : (
                  'No pictures'
                )}
              </td>
              <td>
                <Link to={`/edit-product/${product.milkId}`}>
                  <button>Edit</button>
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductList;
