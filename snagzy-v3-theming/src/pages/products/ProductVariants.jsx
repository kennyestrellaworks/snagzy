import { useOutletContext, useSearchParams } from "react-router-dom";
import { LengthIsZeroError } from "../../components/LengthIsZeroError";
import {
  ItemStatusBadge,
  SalesBadge,
  SalesBadgeMedium,
  VariantBadge,
} from "../../components/Badges";
import { ProductVariantAttributeBadge } from "../../components/Badges";
import { ProductNameNAttributes } from "../../components/ProductNameNAttributes";
import { AmountFormat, AmountFormatSmall } from "../../components/AmountFormat";
import { DiscountFormatSmall } from "../../components/DiscountFormat";
import { useOrdersAnalytics } from "../../context/OrdersAnalyticsContext";
import { useReviewsAnalytics } from "../../context/ReviewsAnalyticsContext";
import { ImageDoubleExtraSmall } from "../../components/Image";
import { Rating, RatingV2 } from "../../components/Rating";
import { useData } from "../../context/DataContext";
import { NoSomethingSmall } from "../../components/NoSomething";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  sortItem,
  sortItemsWithoutDropdown,
  sortItemWithDropdownButton,
  sortItemWithDropdownItem,
  sortItemWithDropdownLabel,
  sortItemWithDropdownLabelWrapper,
  sortItemWithDropdownList,
  sortItemWithDropdownListItem,
} from "./products-css";
import {
  IoArrowDownOutline,
  IoArrowUpOutline,
  TbArrowsSort,
} from "../../components/SVG";
import { useClickOutside } from "../../hooks/useClickOutside";
import { Loader } from "../../components/Loader";
import { CreatedUpdated } from "../../components/DateBoxed";
import { LoadMoreProduct } from "../../components/Button";
// import {
//   reviewsSortingOptions,
//   salesSortOptions,
// } from "../../data/sortOptions";

export const ProductVariants = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [isLoading, setIsLoading] = useState(true);

  const {
    getAllVariantStatus,
    getReviewsSortingOptions,
    getSalesSortingOptions,
    getVariantWithReviews,
  } = useData();

  const reviewsSortingOptions = getReviewsSortingOptions();
  const salesSortOptions = getSalesSortingOptions();

  // OrdersAnalyticsContext.jsx
  const ordersAnalytics = useOrdersAnalytics();
  const { getOrderSubTotalCountOfAVariant, getOrderSubTotalOfAVariant } =
    ordersAnalytics.ordersAnalyticsValue;

  // ReviewAnalyticsContext.jsx
  const reviewsAnalytics = useReviewsAnalytics();
  const {
    getVariantReviewsInAProductReviews,
    getVariantRatingAverage,
    getAverageReview,
    getReviewsBreakdown,
  } = reviewsAnalytics.reviewsAnalyticsValue;

  const {
    thisProduct,
    successfullOrdersOfThisProduct,
    attributes,
    thisProductReviews,
    thisProductVariantsWithReviews,
  } = useOutletContext();

  // const { attributes, thisProductReviews } = useOutletContext();
  // const thisProduct = [];
  // console.log("thisProduct", thisProduct);
  // console.log("thisProductVariantsWithReviews", thisProductVariantsWithReviews);

  // Effect to handle loading state with timeout
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    // Cleanup timeout on component unmount
    return () => clearTimeout(timer);
  }, []);

  // Sorting
  const initialSortField = searchParams.get("sort_field") || "base-price";
  const [sortField, setSortField] = useState(initialSortField);
  const initialSortDirection = searchParams.get("sort_direction") || "asc";
  const [sortDirection, setSortDirection] = useState(initialSortDirection);

  // Dropdown state.
  const [salesSortDropdownOpen, setSalesSortDropdownOpen] = useState(false);
  const [reviewsSortDropdownOpen, setReviewsSortDropdownOpen] = useState(false);

  // Dropdown refs
  const salesSortDropdownRef = useRef(null);
  const reviewsSortDropdownRef = useRef(null);

  const count = 6;
  // Variant items count params
  const initialVariantItemsParams = parseInt(
    searchParams.get("variant_items") || 0,
  );
  const [variantItemsParams, setVariantItemsParams] = useState(
    initialVariantItemsParams,
  );

  // useEffect mount values.
  useEffect(() => {
    const urlVariantItems =
      parseInt(searchParams.get("variant_items")) || count;

    setVariantItemsParams(urlVariantItems);
  }, [searchParams]);

  // Filter click outside using hook.
  useClickOutside(salesSortDropdownRef, () => setSalesSortDropdownOpen(false));
  useClickOutside(reviewsSortDropdownRef, () =>
    setReviewsSortDropdownOpen(false),
  );

  // Filtering
  const filteredThisProductVariants = useMemo(() => {
    let result = thisProduct.variants || [];

    result = result.slice().sort((a, b) => {
      // Sort by base price.
      if (sortField === "base-price") {
        const aPrice = a.price || 0;
        const bPrice = b.price || 0;
        if (sortDirection === "asc") return aPrice - bPrice;
        return bPrice - aPrice;
      }

      // Sort by price.
      if (sortField === "displayed-price") {
        const aDisplayedPrice = a.displayedPrice || 0;
        const bDisplayedPrice = b.displayedPrice || 0;
        if (sortDirection === "asc") return aDisplayedPrice - bDisplayedPrice;
        return bDisplayedPrice - aDisplayedPrice;
      }

      // Sort by stock.
      if (sortField === "stock") {
        const aStock = a.stock || 0;
        const bStock = b.stock || 0;
        if (sortDirection === "asc") return aStock - bStock;
        return bStock - aStock;
      }

      // Sort by sold items (number of units sold)
      if (sortField === "sold-items") {
        const aSold =
          getOrderSubTotalCountOfAVariant(
            a._id,
            successfullOrdersOfThisProduct,
          ) || 0;
        const bSold =
          getOrderSubTotalCountOfAVariant(
            b._id,
            successfullOrdersOfThisProduct,
          ) || 0;
        if (sortDirection === "asc") return aSold - bSold;
        return bSold - aSold;
      }

      // Sort by sales amount (total sales value)
      if (sortField === "sales-amount") {
        const aSales =
          getOrderSubTotalOfAVariant(a._id, successfullOrdersOfThisProduct) ||
          0;
        const bSales =
          getOrderSubTotalOfAVariant(b._id, successfullOrdersOfThisProduct) ||
          0;
        if (sortDirection === "asc") return aSales - bSales;
        return bSales - aSales;
      }

      // Sort by number of reviews
      if (sortField === "review") {
        const aReviews =
          getVariantReviewsInAProductReviews(a._id, thisProductReviews) || [];
        const bReviews =
          getVariantReviewsInAProductReviews(b._id, thisProductReviews) || [];
        const aCount = Array.isArray(aReviews) ? aReviews.length : 0;
        const bCount = Array.isArray(bReviews) ? bReviews.length : 0;
        if (sortDirection === "asc") return aCount - bCount;
        return bCount - aCount;
      }

      // Sort by average rating
      if (sortField === "rating") {
        let aAvg = getVariantRatingAverage(a._id, thisProductReviews);
        let bAvg = getVariantRatingAverage(b._id, thisProductReviews);
        aAvg = isNaN(Number(aAvg)) ? 0 : Number(aAvg);
        bAvg = isNaN(Number(bAvg)) ? 0 : Number(bAvg);
        if (sortDirection === "asc") return aAvg - bAvg;
        return bAvg - aAvg;
      }
    });

    return result;
  }, [
    thisProduct.variants,
    sortDirection,
    sortField,
    getOrderSubTotalCountOfAVariant,
    getOrderSubTotalOfAVariant,
    getVariantReviewsInAProductReviews,
    getVariantRatingAverage,
    thisProductReviews,
    successfullOrdersOfThisProduct,
  ]);

  const displayedThisProductVariants = useMemo(() => {
    return (filteredThisProductVariants || []).slice(0, variantItemsParams);
  }, [filteredThisProductVariants, variantItemsParams]);

  // console.log("displayedThisProductVariants", displayedThisProductVariants);

  // Load more button
  const loadMore = () => {
    const updateUrlParams = (newCount) => {
      const params = {};
      params.variant_items = newCount;
      // persist sort
      if (sortField) params.sort_field = sortField;
      if (sortDirection) params.sort_direction = sortDirection;

      setSearchParams(params);
    };

    const totalItems =
      filteredThisProductVariants && filteredThisProductVariants.length > 0
        ? filteredThisProductVariants.length
        : thisProduct.variants.length;
    const newCount = Math.min(variantItemsParams + count, totalItems);

    if (newCount > variantItemsParams) {
      setVariantItemsParams(newCount);
      updateUrlParams(newCount);
    }
  };

  const variantStatus = getAllVariantStatus();

  // If data is still loading, show Loader
  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="flex flex-col w-full bg-white overflow-hidden">
      {/* Table header  */}
      <div className="w-full top-0 z-30 bg-blue-100 border-t border-b border-gray-300">
        <div className="flex w-full justify-between">
          <div className="grid grid-cols-[2.2fr_.8fr_.4fr_.8fr_.4fr_1.1fr_1.8fr_.3fr] w-full text-sm">
            <div className="flex border-r border-gray-300 p-1">
              Variant Details
            </div>
            {/* Base price sorting header  */}
            <div className="flex border-r border-gray-300 p-1">
              <span>Base Price</span>
              {displayedThisProductVariants.length === 0 ? (
                ""
              ) : (
                <button
                  onClick={() => {
                    const newDirection =
                      sortField === "base-price"
                        ? sortDirection === "asc"
                          ? "desc"
                          : "asc"
                        : "asc";
                    setSortField("base-price");
                    setSortDirection(newDirection);

                    const params = {};
                    if (variantItemsParams)
                      params.variant_items = variantItemsParams;
                    params.sort_field = "base-price";
                    params.sort_direction = newDirection;

                    setSearchParams(params);
                  }}
                  title={
                    sortField === "base-price" && sortDirection === "asc"
                      ? "Sort Base Price asc"
                      : sortField === "Base Price" && sortDirection === "desc"
                        ? "Sort Base Price desc"
                        : "Sort by Base Price"
                  }
                  className={sortItemsWithoutDropdown}
                >
                  <TbArrowsSort height={16} width={16} />
                </button>
              )}
            </div>
            <div className="flex border-r border-gray-300 p-1">Less</div>
            {/* Displayed price sorting header  */}
            <div className="flex border-r border-gray-300 p-1">
              <span>Displayed Price</span>
              {displayedThisProductVariants.length === 0 ? (
                ""
              ) : (
                <button
                  onClick={() => {
                    const newDirection =
                      sortField === "displayed-price"
                        ? sortDirection === "asc"
                          ? "desc"
                          : "asc"
                        : "asc";
                    setSortField("displayed-price");
                    setSortDirection(newDirection);

                    const params = {};
                    if (variantItemsParams)
                      params.variant_items = variantItemsParams;
                    params.sort_field = "displayed-price";
                    params.sort_direction = newDirection;

                    setSearchParams(params);
                  }}
                  title={
                    sortField === "displayed-price" && sortDirection === "asc"
                      ? "Sort Displayed Price asc"
                      : sortField === "Displayed Price" &&
                          sortDirection === "desc"
                        ? "Sort Displayed Price desc"
                        : "Sort by Displayed Price"
                  }
                  className={sortItemsWithoutDropdown}
                >
                  <TbArrowsSort height={16} width={16} />
                </button>
              )}
            </div>
            {/* Stock sorting header  */}
            <div className="flex border-r border-gray-300 p-1">
              <span>Stock</span>
              {displayedThisProductVariants.length === 0 ? (
                ""
              ) : (
                <button
                  onClick={() => {
                    const newDirection =
                      sortField === "stock"
                        ? sortDirection === "asc"
                          ? "desc"
                          : "asc"
                        : "asc";
                    setSortField("stock");
                    setSortDirection(newDirection);

                    const params = {};
                    if (variantItemsParams)
                      params.variant_items = variantItemsParams;
                    params.sort_field = "stock";
                    params.sort_direction = newDirection;

                    setSearchParams(params);
                  }}
                  title={
                    sortField === "stock" && sortDirection === "asc"
                      ? "Sort Stock asc"
                      : sortField === "Stock" && sortDirection === "desc"
                        ? "Sort Stock desc"
                        : "Sort by Stock"
                  }
                  className={sortItemsWithoutDropdown}
                >
                  <TbArrowsSort height={16} width={16} />
                </button>
              )}
            </div>
            {/* Sales sorting header  */}
            <div className="flex border-r border-gray-300 p-1">
              <div className={sortItem} ref={salesSortDropdownRef}>
                <span>Sales</span>
                {displayedThisProductVariants.length === 0 ? (
                  ""
                ) : (
                  <button
                    onClick={() => setSalesSortDropdownOpen((open) => !open)}
                    className={sortItemWithDropdownButton}
                  >
                    <TbArrowsSort height={16} width={16} />
                  </button>
                )}
                {salesSortDropdownOpen && (
                  <div className={sortItemWithDropdownItem}>
                    <div className={sortItemWithDropdownLabelWrapper}>
                      <div className={sortItemWithDropdownLabel}>Sort by:</div>
                      <div className={sortItemWithDropdownList}>
                        {salesSortOptions.map((item, index) => {
                          return (
                            <div
                              key={index}
                              onMouseDown={() => {
                                const newDirection =
                                  sortField === item.slug
                                    ? sortDirection === "asc"
                                      ? "desc"
                                      : "asc"
                                    : "asc";
                                setSortField(item.slug);
                                setSortDirection(newDirection);
                                // setPriceSortField("");
                                // setPriceSortDirection("asc");

                                const params = {};
                                if (variantItemsParams)
                                  params.variant_items = variantItemsParams;
                                params.sort_field = item.slug;
                                params.sort_direction = newDirection;

                                setSearchParams(params);
                              }}
                              className={`${sortItemWithDropdownListItem} ${sortField === item.slug ? "bg-gray-100" : ""}`}
                            >
                              <div className="flex gap-2 items-center">
                                {item.name}
                                {sortField === item.slug ? (
                                  sortDirection === "asc" ? (
                                    <IoArrowUpOutline height={14} width={14} />
                                  ) : (
                                    <IoArrowDownOutline
                                      height={14}
                                      width={14}
                                    />
                                  )
                                ) : null}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            {/* Reviews sorting header  */}
            <div className="flex border-r border-gray-300 p-1">
              <div className={sortItem} ref={reviewsSortDropdownRef}>
                <span>Review & Rating</span>
                {displayedThisProductVariants.length === 0 ? (
                  ""
                ) : (
                  <button
                    onClick={() => setReviewsSortDropdownOpen((open) => !open)}
                    className={sortItemWithDropdownButton}
                  >
                    <TbArrowsSort height={16} width={16} />
                  </button>
                )}
                {reviewsSortDropdownOpen && (
                  <div className={sortItemWithDropdownItem}>
                    <div className={sortItemWithDropdownLabelWrapper}>
                      <div className={sortItemWithDropdownLabel}>Sort by:</div>
                      <div className={sortItemWithDropdownList}>
                        {reviewsSortingOptions.map((item, index) => {
                          return (
                            <div
                              key={index}
                              onMouseDown={() => {
                                const newDirection =
                                  sortField === item.slug
                                    ? sortDirection === "asc"
                                      ? "desc"
                                      : "asc"
                                    : "asc";
                                setSortField(item.slug);
                                setSortDirection(newDirection);
                                // setPriceSortField("");
                                // setPriceSortDirection("asc");

                                const params = {};

                                params.variant_items = variantItemsParams;
                                params.sort_field = item.slug;
                                params.sort_direction = newDirection;
                                setSearchParams(params);

                                setReviewsSortDropdownOpen(false);
                              }}
                              className={`${sortItemWithDropdownListItem} ${sortField === item.slug ? "bg-gray-100" : ""}`}
                            >
                              <div className="flex gap-2 items-center">
                                {item.name}
                                {sortField === item.slug ? (
                                  sortDirection === "asc" ? (
                                    <IoArrowUpOutline height={14} width={14} />
                                  ) : (
                                    <IoArrowDownOutline
                                      height={14}
                                      width={14}
                                    />
                                  )
                                ) : null}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="flex border-r border-gray-300 p-1"></div>
          </div>
          <div className="flex w-2 bg-blue-100"></div>
        </div>
      </div>
      {/* Table header ends  */}
      {/* List area */}
      <div className="flex w-full overflow-y-auto bg-white scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 hover:scrollbar-thumb-gray-400">
        <div className="flex flex-col w-full">
          {displayedThisProductVariants.length === 0 ? (
            <div className="mt-20">
              <LengthIsZeroError
                title="No data found"
                message="Something went wrong while fetching the data!"
              />
            </div>
          ) : (
            displayedThisProductVariants.map((variant, index) => {
              // Variant sales
              const totalSalesVariant = getOrderSubTotalOfAVariant(
                variant?._id,
                successfullOrdersOfThisProduct,
              );
              const totalSoldItemsVariant = getOrderSubTotalCountOfAVariant(
                variant?._id,
                successfullOrdersOfThisProduct,
              );

              // Variant reviews
              const variantReviewsInProductReviews =
                getVariantReviewsInAProductReviews(
                  variant._id,
                  thisProductReviews,
                );

              // Variant rating
              const variantAverageRating = getVariantRatingAverage(
                variant._id,
                thisProductReviews,
              );

              // Variant status
              const statusItem = variantStatus.find(
                (item) => item._id === variant.status,
              );

              // Creating variant product review and rating breakdown.
              const variantWithReviews = getVariantWithReviews(
                variant._id,
                thisProductVariantsWithReviews,
              );
              console.log("variantWithReviews", variantWithReviews);
              const averageReview = getAverageReview(
                variantWithReviews.reviews,
              );
              const reviewBreakdown = getReviewsBreakdown(
                variantWithReviews.reviews,
              );

              return (
                <div key={index} className="flex flex-col w-full">
                  <div
                    className={`grid grid-cols-[2.2fr_.8fr_.4fr_.8fr_.4fr_1.1fr_1.8fr_.3fr] border-b border-gray-300 bg-white text-sm hover:bg-blue-50/30 transition-all duration-300 ease-in-out ${statusItem.slug === "inactive" ? "opacity-50" : statusItem.slug === "active" ? "" : ""}`}
                  >
                    {/* Variant details box  */}
                    <div className="flex items-start p-2 border-r border-gray-300 h-full">
                      <div className="flex flex-col gap-2">
                        <div className="flex gap-2">
                          <VariantBadge id={variant._id} />
                          <ItemStatusBadge statusId={variant.status} />
                        </div>
                        <div className="flex gap-2 mt-2">
                          <ImageDoubleExtraSmall
                            image={variant.primaryImage}
                            alt={variant.name}
                            type="square"
                          />
                          <div className="flex flex-col">
                            <h1 className="font-semibold text-md leading-tight">
                              <ProductNameNAttributes
                                productName={thisProduct.name}
                                variant={variant}
                                attributes={attributes}
                              />
                            </h1>
                            <p className="leading-tight">SKU: {variant.sku}</p>
                            <div className="flex gap-2 mt-2">
                              <ProductVariantAttributeBadge
                                variant={variant}
                                attributes={attributes}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="flex">
                          <CreatedUpdated
                            createdAt={variant.createdAt}
                            updatedAt={variant.updatedAt}
                          />
                        </div>
                      </div>
                    </div>
                    {/* Base price box  */}
                    <div className="flex items-start p-2 border-r border-gray-300 h-full">
                      <AmountFormatSmall amount={variant.price} />
                    </div>
                    {/* Discount box  */}
                    <div className="flex p-2 border-r border-gray-300 h-full">
                      <DiscountFormatSmall discount={variant.discount} />
                    </div>
                    {/* Price box  */}
                    <div className="flex p-2 border-r border-gray-300 h-full">
                      <AmountFormat amount={variant.displayedPrice} />
                    </div>
                    {/* Stock box  */}
                    <div className="flex p-2 border-r border-gray-300 h-full">
                      {variant.stock}
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
                        {variantWithReviews.reviews.length > 0 && (
                          <div className="flex flex-col border border-gray-200 mt-2 p-2">
                            <h1 className="font-semibold text-md leading-tight">
                              Variant Review Breakdown
                            </h1>
                            <div className="grid grid-cols-[1fr_4fr] mt-4 gap-4">
                              <div className="flex flex-col items-center justify-center">
                                <RatingV2 value={averageReview} />
                                <p className="text-gray-400">
                                  {variantWithReviews.reviews.length}{" "}
                                  {variantWithReviews.reviews.length < 2
                                    ? "review"
                                    : "reviews"}
                                </p>
                              </div>
                              <div className="flex">
                                <div className="flex-1 space-y-1">
                                  {[5, 4, 3, 2, 1].map((star) => {
                                    const count = reviewBreakdown[star] || 0;
                                    const pct =
                                      variantWithReviews.reviews.length > 0
                                        ? (count /
                                            variantWithReviews.reviews.length) *
                                          100
                                        : 0;

                                    return (
                                      <div
                                        key={star}
                                        className="flex items-center gap-3"
                                      >
                                        <span className="text-xs text-gray-500 w-3 text-right">
                                          {star}
                                        </span>
                                        <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
                                          <div
                                            className="h-full rounded-full transition-all duration-700"
                                            style={{
                                              width: `${pct}%`,
                                              background:
                                                star >= 4
                                                  ? "#22c55e"
                                                  : star === 3
                                                    ? "#f59e0b"
                                                    : "#ef4444",
                                            }}
                                          />
                                        </div>
                                        <span className="text-xs text-gray-400 w-6 text-right">
                                          {count}
                                        </span>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* box  */}
                    <div className="flex p-2">
                      <div className="flex items-start">
                        THIS
                        {/* <Link
                          to={`/products/${product.slug}/${product._id}`}
                          onClick={() => setSelectedProductId(product._id)}
                          className="cursor-pointer ou  tline-0 text-gray-400 hover:text-gray-500 transition-all ease-in-out"
                        >
                          <FaEye height={16} width={16} />
                        </Link> */}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
          {filteredThisProductVariants.length > 0 &&
            thisProduct.variants.length > 0 &&
            variantItemsParams <
              (filteredThisProductVariants.length ||
                thisProduct.variants.length) && (
              <div className="flex items-center justify-center">
                <div className="flex p-2">
                  <LoadMoreProduct onClick={loadMore}>
                    Load more
                  </LoadMoreProduct>
                </div>
              </div>
            )}
        </div>
      </div>
      {/* List area ends  */}
    </div>
  );
};
