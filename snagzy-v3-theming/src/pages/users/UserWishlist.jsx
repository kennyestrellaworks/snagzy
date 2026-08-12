import { useOutletContext, useSearchParams } from "react-router-dom";
import { useData } from "../../context/DataContext";
import { useEffect, useMemo, useState } from "react";
import { LengthIsZeroError } from "../../components/LengthIsZeroError";
import {
  ItemStatusBadge,
  ProductIdBadge,
  ProductVariantAttributeBadge,
  SalesBadgeMedium,
  StoreDetailBadge,
  VariantBadge,
} from "../../components/Badges";
import { ImageDoubleExtraSmall, ImageExtraLarge } from "../../components/Image";
import { ProductNameNAttributes } from "../../components/ProductNameNAttributes";
import { AmountFormat, AmountFormatSmall } from "../../components/AmountFormat";
import { DiscountFormatSmall } from "../../components/DiscountFormat";
import { useOrdersAnalytics } from "../../context/OrdersAnalyticsContext";
import { useReviewsAnalytics } from "../../context/ReviewsAnalyticsContext";
import { NoSomethingSmall } from "../../components/NoSomething";
import { Rating } from "../../components/Rating";
import { TitleNormal } from "../../components/Title";
import { TextNormal } from "../../components/Text";

export const UserWishlist = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const {
    getVariantInAProduct,
    getAllVariantStatus,
    getStoreById,
    getUserById,
  } = useData();

  // OrdersAnalyticsContext.jsx
  const ordersAnalytics = useOrdersAnalytics();
  const { getOrderSubTotalCountOfAVariant, getOrderSubTotalOfAVariant } =
    ordersAnalytics.ordersAnalyticsValue;

  // Review analytics
  const reviewsAnalytics = useReviewsAnalytics();
  const {
    getVariantReviewsInAProductReviews,
    getAllReviewsByProductId,
    getAverageRating,
    getVariantRatingAverage,
  } = reviewsAnalytics.reviewsAnalyticsValue;

  const { currentUser, attributes } = useOutletContext();

  const wishlistData = [];
  currentUser.wishlist.forEach((item) => {
    const variantData = getVariantInAProduct(item.productId, item.variantId);
    wishlistData.push(...variantData);
  });
  // console.log("wishlistData", wishlistData);

  const count = 6;
  // Wishlist count params
  const initialWishlistParams = parseInt(searchParams.get("wishlist") || 0);
  const [wishlistParams, setWishlistParams] = useState(initialWishlistParams);

  // useEffect mount values.
  useEffect(() => {
    const urlWishlist = parseInt(searchParams.get("wishlist")) || count;

    setWishlistParams(urlWishlist);
  }, [searchParams]);

  const filteredWishlist = useMemo(() => {
    let result = wishlistData || [];

    return result;
  }, [wishlistData]);

  const displayeWishlist = useMemo(() => {
    return (filteredWishlist || []).slice(0, wishlistParams);
  }, [filteredWishlist, wishlistParams]);

  console.log("displayeWishlist", displayeWishlist);

  // Load more button
  const loadMore = () => {
    const updateUrlParams = (newCount) => {
      const params = {};

      params.wishlist = newCount;

      setSearchParams(params);
    };

    const totalItems =
      filteredWishlist && filteredWishlist.length > 0
        ? filteredWishlist.length
        : wishlistData.length;
    const newCount = Math.min(wishlistParams + count, totalItems);

    if (newCount > wishlistParams) {
      setWishlistParams(newCount); // Fixed: changed from setordersParams to setOrdersParams
      updateUrlParams(newCount);
    }
  };

  const variantStatus = getAllVariantStatus();

  return (
    <div className="flex flex-col w-full overflow-hidden">
      {/* Table header  */}
      <div className="w-full top-0 z-30 bg-blue-100 border-t border-b border-gray-300">
        <div className="flex w-full justify-between">
          <div className="grid grid-cols-[2.2fr_2.5fr_.8fr_.4fr_1fr_.4fr_1.4fr_1.6fr_.3fr] w-full text-sm">
            <div className="flex border-r border-gray-300 p-1">
              Wishlist Item
            </div>
            <div className="flex border-r border-gray-300 p-1">Product</div>
            <div className="flex border-r border-gray-300 p-1">Base Price</div>
            <div className="flex border-r border-gray-300 p-1">Less</div>
            <div className="flex border-r border-gray-300 p-1">
              Displayed Price
            </div>
            <div className="flex border-r border-gray-300 p-1">Stock</div>
            <div className="flex border-r border-gray-300 p-1">Sales</div>
            <div className="flex border-r border-gray-300 p-1">
              Review & Rating
            </div>
            <div className="flex border-r border-gray-300 p-1"></div>
          </div>
          <div className="flex w-2 bg-blue-100"></div>
        </div>
      </div>
      {/* Table header ends  */}

      {/* List area */}
      <div className="flex w-full overflow-y-auto bg-white custom-scrollbar">
        <div className="flex flex-col w-full">
          {displayeWishlist.length === 0 ? (
            <div className="flex items-center w-full h-screen">
              <LengthIsZeroError
                title="No data found"
                message="Something went wrong while fetching the data!"
              />
            </div>
          ) : (
            displayeWishlist.map((wishlist, index) => {
              // Store
              const store = getStoreById(
                wishlist.product.storeOwnerInfo.storeId,
              );

              // Store owner
              const storeOwner =
                getUserById(wishlist.product.storeOwnerInfo.ownerId)
                  ?.firstName +
                " " +
                getUserById(wishlist.product.storeOwnerInfo.ownerId)?.lastName;

              // Product image
              const primaryImage = wishlist.product.variants.find(
                (item) => item._id === wishlist.product.defaultVariant,
              )?.primaryImage;

              // Variant status
              const statusItem = variantStatus.find(
                (item) => item._id === wishlist.status,
              );

              // Variant sales
              const totalSalesVariant = getOrderSubTotalOfAVariant(
                wishlist?._id,
              );
              const totalSoldItemsVariant = getOrderSubTotalCountOfAVariant(
                wishlist?._id,
              );

              // Variant and its product reviews
              const thisProductReviews = getAllReviewsByProductId(
                wishlist.product._id,
              );

              // Variant reviews
              const variantReviewsInProductReviews =
                getVariantReviewsInAProductReviews(
                  wishlist._id,
                  thisProductReviews,
                );

              // Variant rating
              const variantAverageRating = getVariantRatingAverage(
                wishlist._id,
                thisProductReviews,
              );

              return (
                <div key={index} className="flex flex-col w-full">
                  <div
                    className={`grid grid-cols-[2.2fr_2.5fr_.8fr_.4fr_1fr_.4fr_1.4fr_1.6fr_.3fr] border-b border-gray-300 bg-white text-sm hover:bg-blue-50/30 transition-all duration-300 ease-in-out ${statusItem.slug === "inactive" ? "opacity-50" : statusItem.slug === "active" ? "" : ""}`}
                  >
                    {/* Wishlist Item box  */}
                    <div className="flex items-start p-2 border-r border-gray-300 h-full">
                      <div className="flex-col">
                        <div className="flex gap-2">
                          <VariantBadge id={wishlist._id} />
                          <ItemStatusBadge statusId={wishlist.status} />
                        </div>

                        <div className="flex gap-2 mt-2">
                          <ImageDoubleExtraSmall
                            image={wishlist.primaryImage}
                            alt={wishlist.name}
                            type="square"
                          />
                          <div className="flex flex-col">
                            <h1 className="font-semibold text-md leading-tight">
                              <ProductNameNAttributes
                                productName={wishlist.product.name}
                                variant={wishlist}
                                attributes={attributes}
                              />
                            </h1>
                            <p className="leading-tight">SKU: {wishlist.sku}</p>
                            <div className="flex gap-2 mt-2">
                              <ProductVariantAttributeBadge
                                variant={wishlist}
                                attributes={attributes}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* Product box  */}
                    <div className="flex items-start p-2 border-r border-gray-300 h-full">
                      <div className="flex items-start flex-col gap-2">
                        <div className="flex gap-2">
                          <ProductIdBadge id={wishlist.product._id} />
                          <ItemStatusBadge statusId={wishlist.product.status} />
                        </div>
                        <div className="flex items-start gap-1 text-xs">
                          <StoreDetailBadge
                            type="store-name"
                            content={store.storeName}
                          />
                          <StoreDetailBadge
                            type="store-owner"
                            content={storeOwner}
                          />
                        </div>
                        <div className="flex gap-2">
                          <ImageExtraLarge
                            image={primaryImage}
                            alt={wishlist.product.name}
                            type="square"
                          />
                          <div className="flex flex-col items-start">
                            <TitleNormal title={wishlist.product.name} />
                            <TextNormal text={wishlist.product.description} />
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* Base price box  */}
                    <div className="flex items-start p-2 border-r border-gray-300 h-full">
                      <AmountFormatSmall amount={wishlist.price} />
                    </div>
                    {/* Discount box  */}
                    <div className="flex p-2 border-r border-gray-300 h-full">
                      <DiscountFormatSmall discount={wishlist.discount} />
                    </div>
                    {/* Price box  */}
                    <div className="flex p-2 border-r border-gray-300 h-full">
                      <AmountFormat amount={wishlist.displayedPrice} />
                    </div>
                    {/* Stock box  */}
                    <div className="flex p-2 border-r border-gray-300 h-full">
                      {wishlist.stock}
                    </div>
                    {/* Sales box  */}
                    <div className="flex p-2 border-r border-gray-300 h-full">
                      <div className="flex flex-col items-start">
                        {totalSalesVariant < 1 ? (
                          <div className="flex items-center gap-2">
                            <h1 className="leading-tight text-gray-400">
                              No data yet
                            </h1>
                          </div>
                        ) : (
                          <div className="flex flex-col">
                            <div className="flex items-center gap-2">
                              <div className="flex items-start">
                                <SalesBadgeMedium amount={totalSalesVariant} />
                              </div>
                              <p className="leading-tight text-[14px]">
                                {totalSoldItemsVariant} Sold
                              </p>
                            </div>
                            <div className="flex flex-col mt-2">
                              <div className="flex items-start gap-2 text-sm">
                                <p className="text-[12px] text-gray-500 leading-tight">
                                  Jan 2026
                                </p>{" "}
                                <div className="flex gap-2 items-center">
                                  <AmountFormatSmall amount={200.25} />
                                  <p className="text-[12px] text-gray-500 leading-tight">
                                    23 Sold
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-start gap-2 text-sm">
                                <p className="text-[12px] text-gray-500 leading-tight">
                                  Jan 2026
                                </p>{" "}
                                <div className="flex gap-2 items-center">
                                  <AmountFormatSmall amount={200.25} />
                                  <p className="text-[12px] text-gray-500 leading-tight">
                                    23 Sold
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    {/* Review & rating box  */}
                    <div className="flex p-2 border-r border-gray-300 h-full">
                      <div className="flex items-start flex-col">
                        <div
                          className={`flex items-start ${
                            variantReviewsInProductReviews.length === 0
                              ? "text-gray-300"
                              : ""
                          }`}
                        >
                          {variantReviewsInProductReviews.length === 0 ? (
                            <NoSomethingSmall text="No reviews yet" />
                          ) : (
                            `${variantReviewsInProductReviews.length} ${
                              variantReviewsInProductReviews.length === 1
                                ? "Review"
                                : "Reviews"
                            }`
                          )}
                        </div>
                        <div className="flex items-start">
                          {variantReviewsInProductReviews.length === 0 ? (
                            ""
                          ) : (
                            <div className="flex flex-col gap-1">
                              <Rating value={variantAverageRating} />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
          {filteredWishlist.length > 0 &&
            wishlistData.length > 0 &&
            wishlistParams <
              (filteredWishlist.length || wishlistData.length) && (
              <div className="flex items-center justify-center">
                <div className="flex p-2">
                  <button
                    onClick={loadMore}
                    className="px-3 py-1 border border-gray-400 bg-gray-100 text-sm text-gray-500 rounded cursor-pointer hover:border-gray-600 hover:bg-gray-300 hover:text-gray-900 transition-transform duration-200 ease-out"
                  >
                    Load more
                  </button>
                </div>
              </div>
            )}
        </div>
      </div>
    </div>
  );
};
