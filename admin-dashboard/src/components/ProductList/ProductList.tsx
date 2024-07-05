import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import productService from '../api/productService';
import { Product } from '../../types/Product';
import './ProductList.css';
import { Tabs, Tab, Box } from '@mui/material';

const ProductList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(1);
  const [selectedTab, setSelectedTab] = useState<number | null>(null);
  const pageSize = 5;
  const navigate = useNavigate();

  useEffect(() => {
    if (selectedTab === null) {
      fetchProductsWithoutFilter(page, pageSize);
    } else {
      fetchProducts(page, pageSize, selectedTab);
    }
  }, [page, selectedTab]);

  const fetchProducts = async (page: number, pageSize: number, milkTypeId: number) => {
    try {
      const data = await productService.getAllProducts(page, pageSize, milkTypeId);
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
      setProducts([]);
    }
  };

  const fetchProductsWithoutFilter = async (page: number, pageSize: number) => {
    try {
      const data = await productService.getAllProductsWithoutMilkType(page, pageSize);
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
      setProducts([]);
    }
  };

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

  const handleFilterMilkType = (type: number | null) => {
    setSelectedTab(type);
    setPage(1); // Reset to the first page when filtering
  };

  const handleDelete = async (productId: number) => {
    const productToDelete = products.find(product => product.milkId === productId);
    if (productToDelete) {
      try {
        // Delete all images associated with the product
        for (const picture of productToDelete.milkPictures || []) {
          await productService.deleteProductImage(picture.milkPictureId);
        }

        // Delete the product itself
        await productService.deleteProduct(productId);

        // Update the product list after deletion
        if (selectedTab === null) {
          fetchProductsWithoutFilter(page, pageSize);
        } else {
          fetchProducts(page, pageSize, selectedTab);
        }
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    } else {
      console.error('Product not found');
    }
  };

  return (
    <div className="product-list-container">
      <h2>Danh sách sản phẩm</h2>
      <Box className="product-list-tabs">
        <Tabs
          value={selectedTab}
          onChange={(event, newValue) => handleFilterMilkType(newValue)}
          aria-label="product filter tabs"
        >
          <Tab label="Tất cả sản phẩm" value={null} className="all-products-tab" />
          <Tab label="Sữa Bột" value={1} className="milk-powder-tab" />
          <Tab label="Sữa Tươi" value={2} className="fresh-milk-tab" />
          <Tab label="Sữa Chua" value={3} className="yogurt-tab" />
        </Tabs>
      </Box>
      <table className="product-list-table">
        <thead>
          <tr>
            <th>Tên sản phẩm</th>
            <th>Giá</th>
            <th>Chiết khấu</th>
            <th>Hình ảnh</th>
            <th>Thao tác</th>
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
                  <button onClick={() => handleEdit(product.milkId)}>Sửa</button>
                  <button onClick={() => handleDelete(product.milkId)}>Xóa</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5}>Không có sản phẩm nào</td>
            </tr>
          )}
        </tbody>
      </table>
      <div className="pagination">
        <button onClick={handlePreviousPage} disabled={page === 1}>Trang trước</button>
        <button onClick={handleNextPage} disabled={products.length < pageSize}>Trang tiếp</button>
      </div>
    </div>
  );
};

export default ProductList;
