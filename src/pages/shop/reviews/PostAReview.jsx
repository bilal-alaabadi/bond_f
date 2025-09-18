import React, { useState } from 'react'
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { useFetchProductByIdQuery } from '../../../redux/features/products/productsApi';
import { usePostReviewMutation } from '../../../redux/features/reviews/reviewsApi';

const PostAReview = ({ isModalOpen, handleClose }) => {
  const { id } = useParams();
  const { user } = useSelector((state) => state.auth);
  const lang = useSelector((s) => s.locale.lang); // 👈 اللغة من Redux
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  const { refetch } = useFetchProductByIdQuery(id, { skip: !id });
  const [postReview] = usePostReviewMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newComment = {
      comment,
      rating,
      userId: user?._id,
      productId: id,
    };
    try {
      await postReview(newComment).unwrap();
      alert(lang === "en" ? "Comment posted successfully!" : "تم إضافة المراجعة بنجاح!");
      setComment('');
      setRating(0);
      refetch();
    } catch (error) {
      alert(error.message);
    }
    handleClose();
  };

  return (
    <div className={`fixed inset-0 bg-black/90 flex items-center justify-center z-40 px-2 ${isModalOpen ? 'block' : 'hidden'}`}>
      <div className='bg-white p-6 rounded-md shadow-lg w-96 z-50'>
        <h2 className='text-lg font-medium mb-4'>
          {lang === "en" ? "Post a Review" : "أضف مراجعة"}
        </h2>

        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows="4"
          placeholder={lang === "en" ? "Write your comment..." : "اكتب تعليقك..."}
          className='w-full border border-gray-300 p-2 rounded-md mb-4 focus:outline-none'
        ></textarea>

        <div className='flex justify-end gap-2'>
          <button
            onClick={handleClose}
            className='px-4 py-2 bg-gray-300 rounded-md'
          >
            {lang === "en" ? "Cancel" : "إلغاء"}
          </button>
          <button
            onClick={handleSubmit}
            className='px-4 py-2 bg-primary text-white rounded-md'
          >
            {lang === "en" ? "Submit" : "إرسال"}
          </button>
        </div>
      </div>
    </div>
  )
}

export default PostAReview
