// src/pages/dashboard/products/addProduct/AddProduct.jsx
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import TextInput from './TextInput';
import SelectInput from './SelectInput';
import UploadImage from './UploadImage';
import { useAddProductMutation } from '../../../../redux/features/products/productsApi';
import { useNavigate } from 'react-router-dom';

const categories = [
  { label: 'اختر تصنيف', value: '' },
  { label: 'Men’s Washes', value: 'Men’s Washes' },
  { label: 'Women’s Washes', value: 'Women’s Washes' },
  { label: 'Liquid Bath Soap', value: 'Liquid Bath Soap' },
  { label: 'Deodorant', value: 'Deodorant' },
  { label: 'Body Wet Wipes', value: 'Body Wet Wipes' },
  { label: 'Body Powder', value: 'Body Powder' },
  { label: 'Body Moisturizer', value: 'Body Moisturizer' },
];

const sizeOptionsByCategory = {
  'Men’s Washes': [
    { label: 'Choose size', value: '' },
    { label: '130 ml', value: '130 ml' },
    { label: '45 ml', value: '45 ml' },
    { label: '10 ml (Box / All Scents)', value: '10 ml' },
  ],
  'Women’s Washes': [
    { label: 'Choose size', value: '' },
    { label: '130 ml', value: '130 ml' },
    { label: '45 ml', value: '45 ml' },
  ],
  'Liquid Bath Soap': [
    { label: 'Choose size', value: '' },
    { label: '500 ml', value: '500 ml' },
  ],
};

const homeIndexOptions = [
  { label: 'بدون موضع في الرئيسية', value: '' },
  { label: '1', value: '1' },
  { label: '2', value: '2' },
  { label: '3', value: '3' },
  { label: '4', value: '4' },
  { label: '5', value: '5' },
  { label: '6', value: '6' },
];

const AddProduct = () => {
  const { user } = useSelector((state) => state.auth);

  const [product, setProduct] = useState({
    name: '',
    category: '',
    size: '',
    price: '',
    description: '',
    oldPrice: '',
    homeIndex: '', // تحديد موضع المنتج في الرئيسية
  });

  const [image, setImage] = useState([]);
  const [showSizeField, setShowSizeField] = useState(false);

  const [addProduct, { isLoading }] = useAddProductMutation();
  const navigate = useNavigate();

  useEffect(() => {
    const needsSize = Boolean(sizeOptionsByCategory[product.category]);
    setShowSizeField(needsSize);
    if (!needsSize && product.size) {
      setProduct((prev) => ({ ...prev, size: '' }));
    }
  }, [product.category]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const requiredFields = {
      'اسم المنتج': product.name,
      'تصنيف المنتج': product.category,
      'السعر': product.price,
      'الوصف': product.description,
      'الصور': image.length > 0,
    };

    if (showSizeField && !product.size) {
      alert('الرجاء اختيار الحجم لهذا التصنيف');
      return;
    }

    const missing = Object.entries(requiredFields)
      .filter(([_, v]) => !v)
      .map(([k]) => k);

    if (missing.length > 0) {
      alert(`الرجاء ملء الحقول التالية: ${missing.join('، ')}`);
      return;
    }

    try {
      const payload = {
        ...product,
        image,
        author: user?._id,
      };
      // تحويل homeIndex إلى Number إن تم اختياره
      if (payload.homeIndex !== '') {
        payload.homeIndex = Number(payload.homeIndex);
      } else {
        delete payload.homeIndex;
      }

      await addProduct(payload).unwrap();

      alert('تمت إضافة المنتج بنجاح');
      setProduct({
        name: '',
        category: '',
        size: '',
        oldPrice: '',
        price: '',
        description: '',
        homeIndex: '',
      });
      setImage([]);
      navigate('/shop');
    } catch (err) {
      console.error('Failed to submit product', err);
      alert('حدث خطأ أثناء إضافة المنتج');
    }
  };

  const currentSizeOptions =
    sizeOptionsByCategory[product.category] || [{ label: '—', value: '' }];

  return (
    <div className="container mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-6">إضافة منتج جديد</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <TextInput
          label="اسم المنتج (بالإنجليزي مثل: Aries / Virgo / Loveshot)"
          name="name"
          placeholder="اكتب اسم المنتج"
          value={product.name}
          onChange={handleChange}
        />

        <SelectInput
          label="تصنيف المنتج"
          name="category"
          value={product.category}
          onChange={handleChange}
          options={categories}
        />

        {showSizeField && (
          <SelectInput
            label="الحجم"
            name="size"
            value={product.size}
            onChange={handleChange}
            options={currentSizeOptions}
          />
        )}

        <SelectInput
          label="موضع الصفحة الرئيسية (1–6)"
          name="homeIndex"
          value={product.homeIndex}
          onChange={handleChange}
          options={homeIndexOptions}
        />

        <TextInput
          label="السعر القديم (اختياري)"
          name="oldPrice"
          type="number"
          placeholder="مثال: 7.500"
          value={product.oldPrice}
          onChange={handleChange}
        />

        <TextInput
          label="السعر"
          name="price"
          type="number"
          placeholder="مثال: 5.500"
          value={product.price}
          onChange={handleChange}
        />

        <UploadImage name="image" id="image" setImage={setImage} />

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            وصف المنتج
          </label>
          <textarea
            name="description"
            id="description"
            className="add-product-InputCSS"
            value={product.description}
            placeholder="اكتب وصف المنتج (المكونات/الرائحة/طريقة الاستخدام)"
            onChange={handleChange}
            rows={4}
          />
        </div>

        <div>
          <button type="submit" className="add-product-btn" disabled={isLoading}>
            {isLoading ? 'جاري الإضافة...' : 'أضف منتج'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;
