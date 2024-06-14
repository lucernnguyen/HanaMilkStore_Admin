import React from 'react';
import './AddProduct.css';

const AddProduct: React.FC = () => {
  return (
    <div className="product-form">
      <form action="#" method="POST" encType="multipart/form-data">
        <div className="form-columns">
          <div className="column">
            <div className="form-group">
              <label htmlFor="product-name">Tên Sản Phẩm:</label>
              <input type="text" id="product-name" name="product-name" />
            </div>
            <div className="form-group">
              <label htmlFor="storage-instructions">Hướng Dẫn Bảo Quản:</label>
              <input type="text" id="storage-instructions" name="storage-instructions" />
            </div>
            <div className="form-group">
              <label htmlFor="capacity">Dung Tích:</label>
              <input type="text" id="capacity" name="capacity" />
            </div>
            <div className="form-group">
              <label htmlFor="age-appropriate">Độ Tuổi Phù Hợp:</label>
              <input type="text" id="age-appropriate" name="age-appropriate" />
            </div>
          </div>
          <div className="column">
            <div className="form-group">
              <label htmlFor="brand">Nhãn Hiệu:</label>
              <select id="brand" name="brand">
                <option value="brand1">Nhãn Hiệu 1</option>
                <option value="brand2">Nhãn Hiệu 2</option>
                <option value="brand3">Nhãn Hiệu 3</option>
                <option value="brand4">Nhãn Hiệu 4</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="product-type">Loại Hàng:</label>
              <select id="product-type" name="product-type">
                <option value="type1">Loại Hàng 1</option>
                <option value="type2">Loại Hàng 2</option>
                <option value="type3">Loại Hàng 3</option>
                <option value="type4">Loại Hàng 4</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="price">Giá:</label>
              <input type="text" id="price" name="price" />
            </div>
            <div className="form-group">
              <label htmlFor="discount">Giảm Giá:</label>
              <input type="text" id="discount" name="discount" />
            </div>
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="image">Hình Ảnh:</label>
          <input type="file" id="image" name="image" accept="image/*" />
          <small>Chỉ hình ảnh dọc hoặc hình vuông, chiều cao tối đa 2M và chiều cao tối đa 2000px</small>
          <div id="image-preview"></div>
        </div>
        <button type="submit" className="btn-save">Lưu</button>
      </form>
    </div>
  );
};

export default AddProduct;
