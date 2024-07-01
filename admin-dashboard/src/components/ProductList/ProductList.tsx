import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import productService from '../api/productService';
import { Product } from '../../types/Product';
import './ProductList.css';
import { Tabs, Tab, Box } from '@mui/material';

const ProductList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [displayedProducts, setDisplayedProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(1);
  const [selectedTab, setSelectedTab] = useState<number | null>(null);
  const pageSize = 5;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await productService.getAllProductsWithouFilter();
        setProducts(data || []);
        setFilteredProducts(data || []); // Initially show all products
        updateDisplayedProducts(data || [], 1); // Initially show the first page
      } catch (error) {
        console.error('Error fetching products:', error);
        setProducts([]);
        setFilteredProducts([]);
        setDisplayedProducts([]);
      }
    };
    fetchProducts();
  }, []);

  const updateDisplayedProducts = (products: Product[], page: number) => {
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    setDisplayedProducts(products.slice(startIndex, endIndex));
  };

  const handleEdit = (id: number) => {
    navigate(`/edit-product/${id}`);
  };

  const handleNextPage = () => {
    setPage(prevPage => {
      const nextPage = prevPage + 1;
      updateDisplayedProducts(filteredProducts, nextPage);
      return nextPage;
    });
  };

  const handlePreviousPage = () => {
    if (page > 1) {
      setPage(prevPage => {
        const previousPage = prevPage - 1;
        updateDisplayedProducts(filteredProducts, previousPage);
        return previousPage;
      });
    }
  };

  const handleFilterMilkType = (type: number | null) => {
    setSelectedTab(type);
    if (type === null) {
      setFilteredProducts(products);
      updateDisplayedProducts(products, 1);
    } else {
      const filtered = products.filter(product => product.milkTypeId === type);
      setFilteredProducts(filtered);
      updateDisplayedProducts(filtered, 1);
    }
    setPage(1); // Reset to the first page
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
        const updatedProducts = products.filter(product => product.milkId !== productId);
        setProducts(updatedProducts);
        setFilteredProducts(updatedProducts);
        updateDisplayedProducts(updatedProducts, page);
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
          {displayedProducts.length > 0 ? (
            displayedProducts.map(product => (
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
        <button onClick={handleNextPage} disabled={page * pageSize >= filteredProducts.length}>Trang tiếp</button>
      </div>
    </div>
  );
};

export default ProductList;
