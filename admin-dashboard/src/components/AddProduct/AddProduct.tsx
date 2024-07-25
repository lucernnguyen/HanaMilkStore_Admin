import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import productService from '../api/productService';
import { Brand, MilkType } from '../../types/Product';
import './AddProduct.css';
import { storage } from '../../firebaseConfig';

const AddProduct: React.FC = () => {
  const navigate = useNavigate();
  const [milkName, setMilkName] = useState('');
  const [brandId, setBrandId] = useState<number | null>(null);
  const [capacity, setCapacity] = useState('');
  const [milkTypeId, setMilkTypeId] = useState<number | null>(null);
  const [appropriateAge, setAppropriateAge] = useState('');
  const [storageInstructions, setStorageInstructions] = useState('');
  const [price, setPrice] = useState<number>(0);
  const [discount, setDiscount] = useState<number>(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [milkTypes, setMilkTypes] = useState<MilkType[]>([]);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const data = await productService.getAllBrands();
        setBrands(data);
      } catch (error) {
        console.error('Error fetching brands:', error);
      }
    };

    const fetchMilkTypes = async () => {
      try {
        const data = await productService.getAllMilkTypes();
        setMilkTypes(data);
      } catch (error) {
        console.error('Error fetching milk types:', error);
      }
    };

    fetchBrands();
    fetchMilkTypes();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!milkName) newErrors.milkName = 'Milk name is required';
    if (!brandId) newErrors.brandId = 'Brand is required';
    if (!capacity) newErrors.capacity = 'Capacity is required';
    if (!milkTypeId) newErrors.milkTypeId = 'Milk type is required';
    if (!appropriateAge) newErrors.appropriateAge = 'Appropriate age is required';
    if (!storageInstructions) newErrors.storageInstructions = 'Storage instructions are required';
    if (price <= 0 || price > 10000000 ) newErrors.price = 'Price must be greater than zero or less than 10,000,000';
    if (discount < 0 || discount > 100) newErrors.discount = 'Discount must be between 0 and 100';
    if (!selectedFile) newErrors.selectedFile = 'Image is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    if (brandId && milkTypeId && selectedFile) {
      try {
        const newProduct = {
          milkName,
          brandId,
          capacity,
          milkTypeId,
          appropriateAge,
          storageInstructions,
          price,
          discount,
        };

        // Add the new product and get its ID
        const addedProduct = await productService.addProduct(newProduct);

        // Upload the image to Firebase Storage
        const storageRef = ref(storage, `milk-pictures/${selectedFile.name}`);
        await uploadBytes(storageRef, selectedFile);
        const downloadURL = await getDownloadURL(storageRef);

        // Save the download URL in the database
        try {
          await productService.uploadProductImage(addedProduct.milkId, downloadURL);
          console.log('Image URL saved successfully');
        } catch (error) {
          console.error('Failed to save image URL:', error);
        }

        navigate('/products');
      } catch (error) {
        console.error('Error adding product:', error);
      }
    } else {
      console.log('Please fill out all required fields and select an image.');
    }
  };

  return (
    <div className="add-product-container">
      <h2>Thêm sản phẩm</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-column">
            <label>
              Tên sản phẩm:
              <input
                type="text"
                value={milkName}
                onChange={(e) => setMilkName(e.target.value)}
                required
              />
              {errors.milkName && <p className="error">{errors.milkName}</p>}
            </label>
            <label>
              Nhãn hiệu:
              <select
                value={brandId ?? ''}
                onChange={(e) => setBrandId(Number(e.target.value))}
                required
              >
                <option value="" disabled>Chọn Nhãn hiệu</option>
                {brands.map(brand => (
                  <option key={brand.brandId} value={brand.brandId}>
                    {brand.brandName}
                  </option>
                ))}
              </select>
              {errors.brandId && <p className="error">{errors.brandId}</p>}
            </label>
            <label>
              Dung Tích:
              <input
                type="text"
                value={capacity}
                onChange={(e) => setCapacity(e.target.value)}
                required
              />
              {errors.capacity && <p className="error">{errors.capacity}</p>}
            </label>
            <label>
              Loại Sữa:
              <select
                value={milkTypeId ?? ''}
                onChange={(e) => setMilkTypeId(Number(e.target.value))}
                required
              >
                <option value="" disabled>Chọn Loại Sữa</option>
                {milkTypes.map(type => (
                  <option key={type.milkTypeId} value={type.milkTypeId}>
                    {type.typeName}
                  </option>
                ))}
              </select>
              {errors.milkTypeId && <p className="error">{errors.milkTypeId}</p>}
            </label>
          </div>
          <div className="form-column">
            <label>
              Độ tuổi phù hợp:
              <input
                type="text"
                value={appropriateAge}
                onChange={(e) => setAppropriateAge(e.target.value)}
                required
              />
              {errors.appropriateAge && <p className="error">{errors.appropriateAge}</p>}
            </label>
            <label>
              Hướng dẫn bảo quản:
              <input
                type="text"
                value={storageInstructions}
                onChange={(e) => setStorageInstructions(e.target.value)}
                required
              />
              {errors.storageInstructions && <p className="error">{errors.storageInstructions}</p>}
            </label>
            <label>
              Giá:
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                required
              />
              {errors.price && <p className="error">{errors.price}</p>}
            </label>
            <label>
              Chiết khấu:
              <input
                type="number"
                value={discount}
                onChange={(e) => setDiscount(Number(e.target.value))}
              />
              {errors.discount && <p className="error">{errors.discount}</p>}
            </label>
            <label>
              Ảnh sản phẩm:
              <input
                type="file"
                onChange={handleFileChange}
                required
              />
              {errors.selectedFile && <p className="error">{errors.selectedFile}</p>}
            </label>
          </div>
        </div>
        <button type="submit">Thêm sản phẩm</button>
      </form>
    </div>
  );
};

export default AddProduct;
