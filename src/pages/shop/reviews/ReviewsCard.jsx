import React, { useState } from 'react'
import { useSelector } from 'react-redux';
import commentorIcon from "../../../assets/avatar.png"
import { formatDate } from '../../../utils/formateDate'
import RatingStars from '../../../components/RatingStars'
import PostAReview from './PostAReview'

const ReviewsCard = ({ productReviews }) => {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const lang = useSelector((s) => s.locale.lang); // 👈 اللغة
    const reviews = productReviews || []

    return (
        <div className='my-6 bg-white p-8'>
            <div>
                {reviews.length > 0 ? (
                    <div>
                        <h3 className='text-lg font-medium'>
                          {lang === "en" ? "All Reviews" : "كل المراجعات"}
                        </h3>
                        <div>
                            {reviews.map((review, index) => (
                                <div key={index} className='mt-4'>
                                    <div className='flex gap-4 items-center'>
                                        <img src={commentorIcon} alt="" className='size-14' />
                                        <div className='space-y-1'>
                                            <p className='text-lg font-medium underline capitalize underline-offset-4 text-blue-400'>
                                                {review?.userId?.username}
                                            </p>
                                            <p className='text-[12px] italic'>
                                                {formatDate(review?.updatedAt)}
                                            </p>
                                            <RatingStars rating={review?.rating} />
                                        </div>
                                    </div>
                                    <div className='text-gray-600 mt-5 border p-8'>
                                        <p className='md:w-4/5'>{review?.comment}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <p>{lang === "en" ? "No reviews yet" : "لا توجد مراجعات بعد"}</p>
                )}
            </div>

            {/* زر إضافة مراجعة */}
            <div className='mt-12'>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className='px-6 py-3 bg-[#7A2432] text-white rounded-md'>
                    {lang === "en" ? "Add Review" : "أضف مراجعة"}
                </button>
            </div>

            {/* المودال */}
            <PostAReview isModalOpen={isModalOpen} handleClose={() => setIsModalOpen(false)}/>
        </div>
    )
}

export default ReviewsCard
