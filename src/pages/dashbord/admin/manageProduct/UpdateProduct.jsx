// ========================= UpdateProduct.jsx =========================
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  useFetchProductByIdQuery,
  useUpdateProductMutation,
} from '../../../../redux/features/products/productsApi';
import { useSelector } from 'react-redux';
import TextInput from '../addProduct/TextInput';
import SelectInput from '../addProduct/SelectInput';

// ⚠️ عدّل هذا الاستيراد حسب اسم الملف الحقيقي:
// - إذا كان اسم الملف UploadImage.jsx استخدم: '../manageProduct/UploadImage'
// - إذا كان UploadImag.jsx (بدون e) اتركه كما هو:
import UpdateImag from '../manageProduct/UpdateImag';

// ====== نفس فكرة addProduct (تصنيفات + homeIndex) ======
const categories = [
  { label: 'أختر منتج', value: '' },
  { label: 'عطور مستوحاة', value: 'عطور مستوحاة' },
  { label: 'أدوات المصمم', value: 'أدوات المصمم' },
  { label: 'العود و البخور', value: 'العود و البخور' },
  { label: 'Flankers', value: 'Flankers' },
  { label: 'الزيوت العطرية', value: 'الزيوت العطرية' },
  { label: 'المتوسم (عطور حصرية)', value: 'المتوسم (عطور حصرية)' },
];

// دعم التصنيفات EN أيضًا (لو كانت البيانات القديمة بالإنجليزية)
const categoriesEN = [
  { label: 'Men’s Washes', value: 'Men’s Washes' },
  { label: 'Women’s Washes', value: 'Women’s Washes' },
  { label: 'Liquid Bath Soap', value: 'Liquid Bath Soap' },
  { label: 'Deodorant', value: 'Deodorant' },
  { label: 'Body Wet Wipes', value: 'Body Wet Wipes' },
  { label: 'Body Powder', value: 'Body Powder' },
  { label: 'Body Moisturizer', value: 'Body Moisturizer' },
];

const combinedCategories = [
  ...categories,
  ...categoriesEN.map((c) => ({ ...c, label: c.label + ' (EN)' })),
];

const homeIndexOptions = [
  { label: 'بدون موضع في الرئيسية', value: '' },
  { label: '1', value: '1' },
  { label: '2', value: '2' },
  { label: '3', value: '3' },
  { label: '4', value: '4' },
  { label: '5', value: '5' },
  { label: '6', value: '6' },
];

// ====== نفس منطق addProduct للحجم (يدعم AR + EN) ======
const sizeOptionsByCategory = {
  // Arabic categories (اختر ما ينطبق لديك)
  'الزيوت العطرية': [
    { label: 'Choose size', value: '' },
    { label: '130 ml', value: '130 ml' },
    { label: '45 ml', value: '45 ml' },
    { label: '10 ml (Box / All Scents)', value: '10 ml' },
  ],
  Flankers: [
    { label: 'Choose size', value: '' },
    { label: '130 ml', value: '130 ml' },
    { label: '45 ml', value: '45 ml' },
  ],
  'عطور مستوحاة': [
    { label: 'Choose size', value: '' },
    { label: '130 ml', value: '130 ml' },
    { label: '45 ml', value: '45 ml' },
  ],

  // English categories from addProduct
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

const UpdateProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const {
    data: productData,
    isLoading: isFetching,
    error: fetchError,
  } = useFetchProductByIdQuery(id);
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();

  // الحالة تطابق addProduct (ثنائي اللغة + homeIndex + size)
  const [product, setProduct] = useState({
    // الأساسية (للخادم)
    name: '',
    description: '',
    category: '',
    size: '',
    price: '',
    oldPrice: '',
    homeIndex: '',
    inStock: true,

    // ثنائي اللغة
    name_en: '',
    name_ar: '',
    description_en: '',
    description_ar: '',

    // الصور الحالية (روابط)
    image: [],
  });

  // صور جديدة يرفعها الأدمن الآن
  const [newImages, setNewImages] = useState([]); // Files[]
  // روابط نريد إبقاءها من الصور القديمة
  const [keepImages, setKeepImages] = useState([]); // string[]

  const [showSizeField, setShowSizeField] = useState(false);

  // تعبئة أولية من API
  useEffect(() => {
    if (!productData) return;
    const p = productData.product ? productData.product : productData;

    const currentImages = Array.isArray(p?.image)
      ? p.image
      : p?.image
      ? [p.image]
      : [];

    setProduct({
      name: p?.name || '',
      description: p?.description || '',
      category: p?.category || '',
      size: p?.size || '',
      price: p?.price != null ? String(p.price) : '',
      oldPrice: p?.oldPrice != null ? String(p.oldPrice) : '',
      homeIndex:
        p?.homeIndex != null && p?.homeIndex !== '' ? String(p.homeIndex) : '',
      inStock: typeof p?.inStock === 'boolean' ? p.inStock : true,

      // ثنائي اللغة (إن لم توجد حقول EN/AR في الداتابيس، نتركها فاضية)
      name_en: p?.name_en || '',
      name_ar: p?.name_ar || '',
      description_en: p?.description_en || '',
      description_ar: p?.description_ar || '',

      image: currentImages,
    });

    setKeepImages(currentImages);
  }, [productData]);

  // إظهار/إخفاء الحجم حسب التصنيف
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

  const currentSizeOptions =
    sizeOptionsByCategory[product.category] || [{ label: '—', value: '' }];

  const handleSubmit = async (e) => {
    e.preventDefault();

    // نفس تحقق addProduct: نطلب AR + EN (اسم + وصف) والحقول الأساسية
    const requiredFields = {
      'اسم المنتج (EN - name أو name_en)': product.name || product.name_en,
      'اسم المنتج (AR - name_ar)': product.name_ar,
      'الوصف (EN - description أو description_en)':
        product.description || product.description_en,
      'الوصف (AR - description_ar)': product.description_ar,
      'تصنيف المنتج': product.category,
      'السعر': product.price,
      // الصور: في التحديث نسمح إمّا إبقاء صور قديمة أو رفع جديدة
      'الصور (إبقاء أو جديدة)': (keepImages?.length || 0) + (newImages?.length || 0) > 0,
    };

    if (showSizeField && !product.size) {
      return alert('الرجاء اختيار الحجم لهذا التصنيف');
    }

    const missing = Object.entries(requiredFields)
      .filter(([, v]) => !v)
      .map(([k]) => k);

    if (missing.length) {
      return alert(`الرجاء ملء الحقول التالية: ${missing.join('، ')}`);
    }

    try {
      // نضمن تعبئة الحقول الأساسية EN إن تُركت فارغة
      const baseName = product.name || product.name_en;
      const baseDesc = product.description || product.description_en;

      const formData = new FormData();
      // الأساسية (الخادم يعتمد عليها)
      formData.append('name', baseName);
      formData.append('description', baseDesc);
      formData.append('category', product.category);
      formData.append('price', product.price);
      formData.append('oldPrice', product.oldPrice || '');
      formData.append('author', user?._id || '');
      formData.append('inStock', String(product.inStock));

      if (product.size) formData.append('size', product.size);
      if (product.homeIndex !== '') formData.append('homeIndex', product.homeIndex);

      // ثنائي اللغة (تُحفظ مع المنتج)
      formData.append('name_en', product.name_en || baseName);
      formData.append('name_ar', product.name_ar);
      formData.append('description_en', product.description_en || baseDesc);
      formData.append('description_ar', product.description_ar);

      // الصور: إبقاء القديم + رفع الجديد
      formData.append('keepImages', JSON.stringify(keepImages || []));
      (newImages || []).forEach((file) => {
        formData.append('image', file);
      });

      await updateProduct({ id, body: formData }).unwrap();
      alert('تم تحديث المنتج بنجاح');
      navigate('/dashboard/manage-products');
    } catch (error) {
      alert(
        'حدث خطأ أثناء تحديث المنتج: ' +
          (error?.data?.message || error?.message || 'خطأ غير معروف')
      );
    }
  };

  if (isFetching)
    return <div className="text-center py-8">جاري تحميل بيانات المنتج...</div>;
  if (fetchError)
    return (
      <div className="text-center py-8 text-red-500">
        خطأ في تحميل بيانات المنتج
      </div>
    );

  return (
    <div className="container mx-auto mt-8 px-4" dir="rtl">
      <h2 className="text-2xl font-bold mb-6 text-right">تحديث المنتج</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* ==== الاسم (إنجليزي/عربي) ==== */}
        <TextInput
          label="اسم المنتج (EN) — سيُستخدم أيضًا كقيمة أساسية إذا لم تملأ حقل EN الأساسي"
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
          options={combinedCategories}
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

        {/* ==== الصور (قديمة + جديدة) ==== */}
        <UpdateImag
          name="image"
          id="image"
          initialImages={product.image}     // روابط الصور الحالية
          setImages={setNewImages}          // ملفات جديدة
          setKeepImages={setKeepImages}     // تحديث قائمة الإبقاء
        />

        {/* ==== الوصف (إنجليزي/عربي) ==== */}
        <div>
          <label
            htmlFor="description_en"
            className="block text-sm font-medium text-gray-700"
          >
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
          <label
            htmlFor="description_ar"
            className="block text-sm font-medium text-gray-700"
          >
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

        {/* حالة التوفر */}
        <div className="flex items-center gap-6">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="availability"
              value="available"
              checked={product.inStock === true}
              onChange={() =>
                setProduct((prev) => ({ ...prev, inStock: true }))
              }
            />
            <span>المنتج متوفر</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="availability"
              value="ended"
              checked={product.inStock === false}
              onChange={() =>
                setProduct((prev) => ({ ...prev, inStock: false }))
              }
            />
            <span>انتهى المنتج</span>
          </label>
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
