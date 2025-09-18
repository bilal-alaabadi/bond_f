// src/pages/dashbord/admin/addProduct/AddProduct.jsx
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
    // الأساسية (للخادم)
    name: '',
    description: '',
    category: '',
    size: '',
    price: '',
    oldPrice: '',
    homeIndex: '',

    // ثنائي اللغة
    name_en: '',
    name_ar: '',
    description_en: '',
    description_ar: '',
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

    // نطلب العربية والإنجليزية للاسم والوصف + الحقول الأساسية
    const requiredFields = {
      'اسم المنتج (EN - name أو name_en)': product.name || product.name_en,
      'اسم المنتج (AR - name_ar)': product.name_ar,
      'الوصف (EN - description أو description_en)': product.description || product.description_en,
      'الوصف (AR - description_ar)': product.description_ar,
      'تصنيف المنتج': product.category,
      'السعر': product.price,
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
      // نضمن تعبئة الحقول الأساسية EN إن تُركت فارغة
      const baseName = product.name || product.name_en;
      const baseDesc = product.description || product.description_en;

      const payload = {
        name: baseName,
        description: baseDesc,
        category: product.category,
        size: product.size || undefined,
        oldPrice: product.oldPrice || undefined,
        price: Number(product.price),
        image,
        author: user?._id,
        // حقول ثنائية اللغة
        name_en: product.name_en || baseName,
        name_ar: product.name_ar,
        description_en: product.description_en || baseDesc,
        description_ar: product.description_ar,
      };

      if (product.homeIndex !== '') {
        payload.homeIndex = Number(product.homeIndex);
      }

      await addProduct(payload).unwrap();

      alert('تمت إضافة المنتج بنجاح');
      setProduct({
        name: '',
        description: '',
        category: '',
        size: '',
        price: '',
        oldPrice: '',
        homeIndex: '',
        name_en: '',
        name_ar: '',
        description_en: '',
        description_ar: '',
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
    <div className="container mx-auto mt-8" dir="rtl">
      <h2 className="text-2xl font-bold mb-6">إضافة منتج جديد</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* ==== الاسم (إنجليزي/عربي) ==== */}
        <TextInput
          label="اسم المنتج (EN) — سيُستخدم أيضًا  أساسية"
          name="name_en"
          placeholder="مثال: ARIES / LOVESHOT / BLINDFOLD"
          value={product.name_en}
          onChange={handleChange}
        />
        <TextInput
          label="اسم المنتج (AR)"
          name="name_ar"
          placeholder="مثال: برج الحمل / لوف شوت / بليندفولد"
          value={product.name_ar}
          onChange={handleChange}
        />



        {/* ==== التصنيف والحجم ==== */}
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

        {/* ==== موضع الرئيسية ==== */}
        <SelectInput
          label="موضع الصفحة الرئيسية (1–6)"
          name="homeIndex"
          value={product.homeIndex}
          onChange={handleChange}
          options={homeIndexOptions}
        />

        {/* ==== الأسعار ==== */}
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

        {/* ==== الصور ==== */}
{/* ==== الصور ==== */}
<UploadImage name="image" id="image" uploaded={image} setImage={setImage} />

        {/* ==== الوصف (إنجليزي/عربي) ==== */}
        <div>
          <label htmlFor="description_en" className="block text-sm font-medium text-gray-700">
            وصف المنتج (EN)
          </label>
          <textarea
            name="description_en"
            id="description_en"
            className="add-product-InputCSS"
            value={product.description_en}
            placeholder="Ingredients / scent / how to use…"
            onChange={handleChange}
            rows={4}
          />
        </div>

        <div>
          <label htmlFor="description_ar" className="block text-sm font-medium text-gray-700">
            وصف المنتج (AR)
          </label>
          <textarea
            name="description_ar"
            id="description_ar"
            className="add-product-InputCSS"
            value={product.description_ar}
            placeholder="المكونات / الرائحة / طريقة الاستخدام…"
            onChange={handleChange}
            rows={4}
          />
        </div>

        {/* (اختياري) حقل التوافق — يملأ تلقائيًا من (وصف EN) إن تركته فارغًا */}


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
