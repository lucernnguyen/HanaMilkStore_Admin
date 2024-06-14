import React from 'react';
import './ProductList.css';

const ProductsSection: React.FC = () => {
  return (
    <div id="products-section" className="section">
      <div className="section-header">
        <h2>Quản lý sản phẩm</h2>
        <button id="add-product-btn" className="add-product-btn" data-product-id="new">
          Thêm sản phẩm mới
        </button>
      </div>
      <table>
        <thead>
          <tr>
            <th>Tên sản phẩm</th>
            <th>Hình ảnh sản phẩm</th>
            <th>Giá</th>
            <th>Giảm giá</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {/* Thêm dữ liệu sản phẩm tại đây */}
          <tr>
            <td>Product 1</td>
            <td><img src="path/to/product1.jpg" alt="Product 1" className="product-image" /></td>
            <td>$100</td>
            <td>10%</td>
            <td>
              <button className="edit-btn" data-product-id="1">Chỉnh sửa</button>
              <button className="disable-btn" data-product-id="1">Disable</button>
            </td>
          </tr>
          <tr>
            <td>Product 2</td>
            <td><img src="path/to/product2.jpg" alt="Product 2" className="product-image" /></td>
            <td>$200</td>
            <td>20%</td>
            <td>
              <button className="edit-btn" data-product-id="2">Chỉnh sửa</button>
              <button className="disable-btn" data-product-id="2">Disable</button>
            </td>
          </tr>
          <tr>
            <td>Product 3</td>
            <td><img src="path/to/product3.jpg" alt="Product 3" className="product-image" /></td>
            <td>$300</td>
            <td>30%</td>
            <td>
              <button className="edit-btn" data-product-id="3">Chỉnh sửa</button>
              <button className="disable-btn" data-product-id="3">Disable</button>
            </td>
          </tr>
          <tr>
            <td>Product 4</td>
            <td><img src="path/to/product4.jpg" alt="Product 4" className="product-image" /></td>
            <td>$400</td>
            <td>40%</td>
            <td>
              <button className="edit-btn" data-product-id="4">Chỉnh sửa</button>
              <button className="disable-btn" data-product-id="4">Disable</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default ProductsSection;
