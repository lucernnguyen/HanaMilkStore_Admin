import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import productService from '../api/productService';
import { Product } from '../../types/Product';
import './ProductList.css';

const ProductList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(1);
  const pageSize = 5;
  const navigate = useNavigate();
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await productService.getAllProducts(page, pageSize);
        setProducts(data || []);
      } catch (error) {
        console.error('Error fetching products:', error);
        setProducts([]); // ensure products is always an array
      }
    };
    fetchProducts();
  }, [page]);

  const handleEdit = (id: number) => {
    navigate(`/edit-product/${id}`);
  };

  const handleNextPage = () => {
    setPage(prevPage => prevPage + 1);
  };

  const handlePreviousPage = () => {
    if (page > 1) {
      setPage(prevPage => prevPage - 1);
    }
  };

  return (
    <div className="product-list-container">
      <h2>Product List</h2>
      <table className="product-list-table">
        <thead>
          <tr>
            <th>Milk Name</th>
            <th>Price</th>
            <th>Discount</th>
            <th>Pictures</th>
            <th>Edit</th>
          </tr>
        </thead>
        <tbody>
          {products.length > 0 ? (
            products.map(product => (
              <tr key={product.milkId}>
                <td>{product.milkName}</td>
                <td>{product.price}</td>
                <td>{product.discount}</td>
                <td className="product-images">
                  {(product.milkPictures || []).map(picture => (
                    <img key={picture.milkPictureId} src={picture.picture} alt={product.milkName} className="product-image" />
                  ))}
                </td>
                <td>
                  <button onClick={() => handleEdit(product.milkId)}>Edit</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5}>No products available</td>
            </tr>
          )}
        </tbody>
      </table>
      <div className="pagination">
        <button onClick={handlePreviousPage} disabled={page === 1}>Previous</button>
        <button onClick={handleNextPage}>Next</button>
      </div>
    </div>
  );
};

export default ProductList;
