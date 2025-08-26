// src/pages/dashboard/products/updateProduct/UpdateProduct.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useFetchProductByIdQuery, useUpdateProductMutation } from '../../../../redux/features/products/productsApi';
import { useSelector } from 'react-redux';
import TextInput from '../addProduct/TextInput';
import SelectInput from '../addProduct/SelectInput';
import UploadImage from '../addProduct/UploadImage';

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

const UpdateProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { data: productData, isLoading: isFetching, error: fetchError } = useFetchProductByIdQuery(id);
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();

  const [product, setProduct] = useState({
    name: '',
    category: '',
    size: '',
    price: '',
    oldPrice: '',
    description: '',
    image: [],
    homeIndex: '',
  });

  const [showSizeField, setShowSizeField] = useState(false);
  const [newImages, setNewImages] = useState([]);

  useEffect(() => {
    if (productData) {
      setProduct({
        name: productData.name || '',
        category: productData.category || '',
        size: productData.size || '',
        price: productData.price?.toString() || '',
        oldPrice: productData.oldPrice?.toString() || '',
        description: productData.description || '',
        image: productData.image || [],
        homeIndex: productData.homeIndex ? String(productData.homeIndex) : '',
      });
      setShowSizeField(Boolean(sizeOptionsByCategory[productData.category]));
    }
  }, [productData]);

  useEffect(() => {
    setShowSizeField(Boolean(sizeOptionsByCategory[product.category]));
    if (!sizeOptionsByCategory[product.category] && product.size) {
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
      'أسم المنتج': product.name,
      'صنف المنتج': product.category,
      'السعر': product.price,
      'الوصف': product.description,
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
      const formData = new FormData();
      formData.append('name', product.name);
      formData.append('category', product.category);
      formData.append('price', product.price);
      formData.append('oldPrice', product.oldPrice || '');
      formData.append('description', product.description);
      formData.append('size', product.size || '');
      formData.append('author', user._id);

      // homeIndex
      if (product.homeIndex !== '') formData.append('homeIndex', product.homeIndex);

      if (newImages.length > 0) {
        newImages.forEach((img) => formData.append('image', img));
      } else {
        formData.append('existingImages', JSON.stringify(product.image || []));
      }

      await updateProduct({ id, body: formData }).unwrap();
      alert('تم تحديث المنتج بنجاح');
      navigate('/dashboard/manage-products');
    } catch (error) {
      console.error('فشل تحديث المنتج:', error);
      alert('حدث خطأ أثناء تحديث المنتج: ' + (error.data?.message || error.message));
    }
  };

  if (isFetching) return <div className="text-center py-8">جاري تحميل بيانات المنتج...</div>;
  if (fetchError) return <div className="text-center py-8 text-red-500">خطأ في تحميل بيانات المنتج</div>;

  const currentSizeOptions = sizeOptionsByCategory[product.category];

  return (
    <div className="container mx-auto mt-8 px-4">
      <h2 className="text-2xl font-bold mb-6 text-right">تحديث المنتج</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <TextInput label="اسم المنتج" name="name" placeholder="أكتب اسم المنتج" value={product.name} onChange={handleChange} required />

        <SelectInput label="صنف المنتج" name="category" value={product.category} onChange={handleChange} options={categories} required />

        {showSizeField && (
          <SelectInput label="الحجم" name="size" value={product.size} onChange={handleChange} options={currentSizeOptions} required />
        )}

        <SelectInput
          label="موضع الصفحة الرئيسية (1–6)"
          name="homeIndex"
          value={product.homeIndex}
          onChange={handleChange}
          options={homeIndexOptions}
        />

        <TextInput label="السعر الحالي" name="price" type="number" placeholder="50" value={product.price} onChange={handleChange} required />

        <TextInput label="السعر القديم (اختياري)" name="oldPrice" type="number" placeholder="100" value={product.oldPrice} onChange={handleChange} />

        <UploadImage name="image" id="image" initialImages={product.image} setImages={setNewImages} />

        <div className="text-right">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">وصف المنتج</label>
          <textarea
            name="description"
            id="description"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-right"
            value={product.description}
            placeholder="أكتب وصف المنتج"
            onChange={handleChange}
            required
            rows={4}
          />
        </div>

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
            disabled={isUpdating}
          >
            {isUpdating ? 'جاري التحديث...' : 'حفظ التغييرات'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateProduct;
