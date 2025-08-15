import React, { useState, useEffect } from 'react';
import ProductCards from './ProductCards';
import ShopFiltering from './ShopFiltering';
import { useFetchAllProductsQuery } from '../../redux/features/products/productsApi';
import imge from "../../assets/Untitled-2-with-text (1).png";

const filters = {
    categories: ['الكل', 'حناء بودر', 'سدر بودر', 'أعشاب تكثيف وتطويل الشعر', 'مشاط', 'خزامى', 'كركديه', 'إكليل الجبل'],
    sizes: ['1 كيلو', '500 جرام']
};

const ShopPage = () => {
    const [filtersState, setFiltersState] = useState({
        category: 'الكل',
        size: ''
    });

    const [currentPage, setCurrentPage] = useState(1);
    const [ProductsPerPage] = useState(8);
    const [showFilters, setShowFilters] = useState(false);

    const { category, size } = filtersState;

    useEffect(() => {
        setCurrentPage(1);
    }, [filtersState]);

    const { data: { products = [], totalPages, totalProducts } = {}, error, isLoading } = useFetchAllProductsQuery({
        category: category !== 'الكل' ? category : undefined,
        size: category === 'حناء بودر' ? size : undefined,
        page: currentPage,
        limit: ProductsPerPage,
    });

    const clearFilters = () => {
        setFiltersState({ category: 'الكل', size: '' });
    };

    const handlePageChange = (pageNumber) => {
        if (pageNumber > 0 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
        }
    };

    if (isLoading) return <div className="text-center py-8">جاري تحميل المنتجات...</div>;
    if (error) return <div className="text-center py-8 text-red-500">حدث خطأ أثناء تحميل المنتجات.</div>;

    const startProduct = (currentPage - 1) * ProductsPerPage + 1;
    const endProduct = Math.min(startProduct + ProductsPerPage - 1, totalProducts);

    return (
        <>
            {/* Hero Section with Image */}


            {/* Products Section */}
            <section className=' py-8'>
                <div className='flex flex-col md:flex-row md:gap-8 gap-6'>
                    {/* Filters Section */}
                    <div className='md:w-1/4'>
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className='md:hidden w-full bg-[#9B2D1F] text-white py-2 px-4 rounded-md mb-4 flex items-center justify-between'
                        >
                            <span>{showFilters ? 'إخفاء الفلاتر' : 'تصفية المنتجات'}</span>
                            <svg 
                                className={`w-5 h-5 transition-transform ${showFilters ? 'rotate-180' : ''}`} 
                                fill="none" 
                                stroke="currentColor" 
                                viewBox="0 0 24 24" 
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>

                        <div className={`${showFilters ? 'block' : 'hidden'} md:block bg-white p-4 rounded-lg shadow-sm`}>
                            <ShopFiltering
                                filters={filters}
                                filtersState={filtersState}
                                setFiltersState={setFiltersState}
                                clearFilters={clearFilters}
                            />
                        </div>
                    </div>

                    {/* Products List */}
                    <div className='md:w-3/4'>
                        <div className='flex justify-between items-center mb-6'>
                            <h3 className='text-lg font-medium text-gray-700'>
                                عرض {startProduct}-{endProduct} من {totalProducts} منتج
                            </h3>
                        </div>

                        {products.length > 0 ? (
                            <>
                                <ProductCards products={products} />
                                
                                {/* Pagination */}
                                {totalPages > 1 && (
                                    <div className='mt-8 flex flex-col sm:flex-row items-center justify-between gap-4'>
                                        <div className="text-sm text-gray-600">
                                            الصفحة {currentPage} من {totalPages}
                                        </div>
                                        <div className='flex gap-2'>
                                            <button
                                                onClick={() => handlePageChange(currentPage - 1)}
                                                disabled={currentPage === 1}
                                                className={`px-4 py-2 rounded-md ${currentPage === 1 ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-[#9B2D1F] text-white hover:bg-[#7a241a]'}`}
                                            >
                                                السابق
                                            </button>
                                            
                                            <div className="flex gap-1">
                                                {[...Array(totalPages)].map((_, index) => (
                                                    <button
                                                        key={index}
                                                        onClick={() => handlePageChange(index + 1)}
                                                        className={`w-10 h-10 flex items-center justify-center rounded-md ${currentPage === index + 1 ? 'bg-[#9B2D1F] text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                                                    >
                                                        {index + 1}
                                                    </button>
                                                ))}
                                            </div>
                                            
                                            <button
                                                onClick={() => handlePageChange(currentPage + 1)}
                                                disabled={currentPage === totalPages}
                                                className={`px-4 py-2 rounded-md ${currentPage === totalPages ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-[#9B2D1F] text-white hover:bg-[#7a241a]'}`}
                                            >
                                                التالي
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="text-center py-12 bg-white rounded-lg shadow-sm">
                                <p className="text-lg text-gray-600">لا توجد منتجات متاحة حسب الفلتر المحدد</p>
                                <button 
                                    onClick={clearFilters}
                                    className="mt-4 px-4 py-2 bg-[#9B2D1F] text-white rounded-md hover:bg-[#7a241a]"
                                >
                                    عرض جميع المنتجات
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </>
    );
};

export default ShopPage;