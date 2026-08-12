import { createContext, useContext, useMemo } from "react";
import { reviews } from "../data/reviews";
import { orders } from "../data/orders";

const ReviewsAnalyticsContext = createContext();

export const ReviewsAnalyticsProvider = ({ children }) => {
  const getAllReviews = () => {
    return reviews;
  };

  const getAllOrders = () => {
    return orders;
  };

  const reviewsAnalyticsValue = useMemo(() => {
    // Get all reviews using productId.
    const getAllReviewsByProductId = (productId) => {
      return getAllReviews().filter(
        (review) => review.orderInfo?.productId === productId,
      );
    };

    // Get all reviews of a variant using a list of reviews by product.
    const getVariantReviewsInAProductReviews = (variantId, productReviews) => {
      return productReviews.filter(
        (review) => review.orderInfo?.variantId === variantId,
      );
    };

    // Get average rating by product.
    const getAverageRating = (productReviews) => {
      const totalRating = productReviews.reduce(
        (sum, review) => sum + (review.rating || 0),
        0,
      );
      return (totalRating / productReviews.length).toFixed(1);
    };

    // Get average rating by product.
    const getVariantRatingAverage = (variantId, productReviews) => {
      const variantReviews = productReviews.filter(
        (review) => review.orderInfo?.variantId === variantId,
      );
      if (variantReviews.length === 0) return 0;
      const totalRating = variantReviews.reduce(
        (sum, review) => sum + (review.rating || 0),
        0,
      );
      return Number((totalRating / variantReviews.length).toFixed(1));
    };

    // Get average reveiw by average object.
    const getAverageReview = (reviews) => {
      // console.log("reviews", reviews);
      const totalReviews = reviews.length;

      if (totalReviews === 0) return 0;
      const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
      return sum / totalReviews;
    };
    // Get reviews breakdown
    const getReviewsBreakdown = (reviews) => {
      const totalReviews = reviews.length;

      if (totalReviews === 0) {
        return { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
      }

      const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
      reviews.forEach((review) => {
        const star = Math.floor(review.rating);
        if (star >= 1 && star <= 5) counts[star]++;
      });

      return counts;
    };

    return {
      getAllReviewsByProductId,
      getVariantReviewsInAProductReviews,
      getAverageRating,
      getVariantRatingAverage,
      getAverageReview,
      getReviewsBreakdown,
    };
  }, []);

  const getOrdersOfReviewedItems = (productReviews) => {
    return productReviews.map((item) => {
      return getAllOrders().find(
        (order) => order._id === item.orderInfo.orderId,
      );
    });
  };

  return (
    <ReviewsAnalyticsContext.Provider
      value={{
        reviewsAnalyticsValue,
        getAllReviews,
        getAllOrders,
        getOrdersOfReviewedItems,
      }}
    >
      {children}
    </ReviewsAnalyticsContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useReviewsAnalytics = () => useContext(ReviewsAnalyticsContext);
