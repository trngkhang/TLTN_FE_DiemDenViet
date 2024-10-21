import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import envVar from "../utils/envVar";
import Review from "./Review";
import { useDispatch, useSelector } from "react-redux";
import { Accordion, Alert, Button } from "flowbite-react";
import { Rating } from "@mui/material";

var totalReviews = 0;

export default function ReviewSession({ destinationId }) {
  const [reviews, setReviews] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const [newReview, setNewReview] = useState({
    rating: 5,
    comment: "",
  });
  const [reviewError, setReviewError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    const fetchReview = async () => {
      const res = await fetch(
        `${envVar.api_url}/review?destinationId=${destinationId}&limit=6&startIndex=${currentIndex}`
      );
      const data = await res.json();
      if (res.ok) {
        totalReviews = data.totalReviews;
        setReviews(data.reviews);
      }
    };
    fetchReview();
  }, [destinationId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newReview.comment.length === 0 || newReview.comment.length > 500) {
      setReviewError("Đánh giá phải ít hơn 500 kí tự.");
      return;
    }

    const reviewData = {
      rating: newReview.rating,
      comment: newReview.comment,
      userId: user._id,
      destinationId: destinationId,
    };

    setIsSubmitting(true);

    try {
      const res = await fetch(`${envVar.api_url}/review`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(reviewData),
        credentials: "include",
      });
      const data = await res.json();
      if (res.ok) {
        setNewReview({ rating: 5, comment: "" });
        setReviewError(null);
        setReviews((prevReviews) => [
          { ...data, userId: { name: user.name, avatar: user.avatar } },
          ...prevReviews,
        ]);
      } else {
        setReviewError(data.message || "Lỗi tạo đánh giá.");
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      setReviewError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const loadMoreReviews = async () => {
    setLoadingMore(true);
    try {
      const res = await fetch(
        `${
          envVar.api_url
        }/review?destinationId=${destinationId}&limit=6&startIndex=${
          currentIndex + 6
        }`
      );
      const data = await res.json();
      if (res.ok) {
        setReviews((prevReviews) => [...prevReviews, ...data.reviews]);
        setCurrentIndex((prevIndex) => prevIndex + 6);
      }
    } catch (error) {
      console.error("Error loading more reviews:", error);
    } finally {
      setLoadingMore(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h3 className="text-xl font-semibold text-center">Đánh giá</h3>
      {user ? (
        <div>
          <div className="text-sm flex flex-row gap-1 items-center">
            <img className="w-6 rounded-full" src={user.avatar} alt="avatar" />
            <Link
              className="text-xs text-cyan-600 hover:underline"
              to="/profile"
            >
              @{user.name}
            </Link>
          </div>
          <div>
            <form
              onSubmit={handleSubmit}
              className="rounded-md border border-teal-500 p-3 mt-4"
            >
              <Rating
                name="simple-controlled"
                value={newReview.rating}
                onChange={(e, newValue) => {
                  setNewReview({ ...newReview, rating: newValue });
                }}
              />
              <textarea
                rows="3"
                maxLength="500"
                value={newReview.comment}
                onChange={(e) =>
                  setNewReview({ ...newReview, comment: e.target.value })
                }
                placeholder="Viết đánh giá của bạn..."
                className="w-full rounded-md border-gray-400 text-sm"
              />
              <div className="flex justify-between items-center mt-2">
                <p className="text-gray-400 text-sm">
                  {500 - newReview.comment.length} kí tự còn lại...
                </p>
                <Button
                  gradientDuoTone="purpleToBlue"
                  className="p-0"
                  type="submit"
                  disabled={!newReview.comment || reviewError || isSubmitting}
                >
                  {isSubmitting ? "Đang gửi..." : "Đánh giá"}
                </Button>
              </div>
              {reviewError && (
                <Alert color="failure" className="mt-5">
                  {reviewError}
                </Alert>
              )}
            </form>
          </div>
        </div>
      ) : (
        <p>
          Đăng nhập đề đánh giá. <Link to="/signin">Đăng nhập</Link>
        </p>
      )}

      <Accordion className="my-3">
        <Accordion.Panel>
          <Accordion.Title>
            <div className="flex flex-row items-center">
              <p>Lượt đánh giá</p>
              <div className="border border-gray-400 px-2 ml-1">
                {totalReviews}
              </div>
            </div>
          </Accordion.Title>
          <Accordion.Content>
            <div>
              {reviews.length === 0 ? (
                <p>Chưa có đánh giá nào.</p>
              ) : (
                reviews.map((review, index) => (
                  <Review key={index} review={review} />
                ))
              )}
            </div>
            {reviews.length < totalReviews && (
              <div className="flex justify-center mt-5">
                <button
                  onClick={loadMoreReviews}
                  disabled={loadingMore}
                  className="hover:text-blue-500"
                >
                  {loadingMore ? "Đang tải..." : "Hiện thêm đánh giá"}
                </button>
              </div>
            )}
          </Accordion.Content>
        </Accordion.Panel>
      </Accordion>
    </div>
  );
}
