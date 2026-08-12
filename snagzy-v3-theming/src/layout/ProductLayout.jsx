import { NavLink, Outlet, useParams } from "react-router-dom";
import { useData } from "../context/DataContext";
import { useOrdersAnalytics } from "../context/OrdersAnalyticsContext";
import { useReviewsAnalytics } from "../context/ReviewsAnalyticsContext";
import {
  AttributeOptionsBadge,
  CategoryItemBadge,
  ItemStatusBadge,
  ProductIdBadge,
  SalesBadge,
  StoreDetailBadge,
} from "../components/Badges";
import { Rating } from "../components/Rating";
import { AmountFormat, AmountFormatSmall } from "../components/AmountFormat";
import { TitleNormal } from "../components/Title";
import { TextNormal } from "../components/Text";
import { ImageExtraLarge } from "../components/Image";
import { IoIosArrowDown } from "../components/SVG";
import { useState } from "react";
import { PageHeader } from "../components/PageHeader";

export const ProductLayout = () => {
  const [productSummaryOpen, setProductSummaryOpen] = useState(true);
  const { productId } = useParams();

  const {
    getProductByProductId,
    getProductLayoutNavLinks,
    getProductPriceRange,
    getProductDefaultVariant,
    getProductStock,
    getStoreById,
    getAllAttributes,
    getCategoryById,
    getStatusCount,
    getAllOrdersByProductId,
    getAllProductStatus,
    getUsersWhoReviewed,
    createProductVariantsObjectWithReviews,
  } = useData();

  // Order analaytics context.
  const ordersAnalytics = useOrdersAnalytics();
  const {
    getTotalSoldItemsOfAProduct,
    getTotalSalesOfAProduct,
    getSuccessfullOrdersOfAProduct,
    getPendingOrdersOfAProduct,
    getUnsuccessfulOrdersOfAProduct,
  } = ordersAnalytics.ordersAnalyticsValue;

  // Review analytics
  const reviewsAnalytics = useReviewsAnalytics();
  const { getAllReviewsByProductId, getAverageRating, getReviewsBreakdown } =
    reviewsAnalytics.reviewsAnalyticsValue;

  const productStatus = getAllProductStatus();

  // Current product
  const thisProduct = getProductByProductId(productId);

  // Current product default variant
  const defaultVariant = getProductDefaultVariant(thisProduct);

  // Nav links
  const productLayoutNavLinks = getProductLayoutNavLinks();

  // Successful orders of this product
  const successfullOrdersOfThisProduct = getSuccessfullOrdersOfAProduct(
    thisProduct._id,
  );

  // Pending orders of this product
  const pendingOrdersOfThisProduct = getPendingOrdersOfAProduct(
    thisProduct._id,
  );

  // Unsuccessful orders of this product
  const unsuccessfulOrdersOfThisProduct = getUnsuccessfulOrdersOfAProduct(
    thisProduct._id,
  );

  // Sales of this product
  const totalSoldItems = getTotalSoldItemsOfAProduct(
    thisProduct?._id,
    successfullOrdersOfThisProduct,
  );
  const totalSales = getTotalSalesOfAProduct(
    thisProduct?._id,
    successfullOrdersOfThisProduct,
  );

  // Price range
  const priceRange = getProductPriceRange(thisProduct?.variants);

  // Product stock
  const productStock = getProductStock(thisProduct?.variants);

  // Reviews
  const thisProductReviews = getAllReviewsByProductId(thisProduct?._id);
  // console.log("thisProductReviews", thisProductReviews);

  // Average rating
  const averageRating = getAverageRating(thisProductReviews);

  // Store details
  const store = getStoreById(thisProduct.storeOwnerInfo?.storeId);

  // Attributes
  const attributes = getAllAttributes();

  // Hide/show Product summary area
  const toggleSidebar = () => setProductSummaryOpen(!productSummaryOpen);

  // Orders by this product.
  const ordersByThisProduct = getAllOrdersByProductId(thisProduct._id);
  // console.log("ordersByThisProduct", ordersByThisProduct);

  //////////////////////////////
  // For ProductReviews.jsx
  const buyersWhoReviewed = getUsersWhoReviewed(thisProductReviews);
  const thisProductVariantsWithReviews = createProductVariantsObjectWithReviews(
    thisProduct.variants,
    thisProductReviews,
    buyersWhoReviewed,
    ordersByThisProduct,
  );
  // console.log("thisProductVariantsWithReviews", thisProductVariantsWithReviews);

  // Instead of mapping over each variant separately, aggregate all reviews first
  const allProductReviews = thisProductVariantsWithReviews.flatMap(
    (variant) => variant.reviews,
  );

  // Get a single breakdown for the entire product
  const productRatingBreakdown = getReviewsBreakdown(allProductReviews);
  const totalProductReviews = allProductReviews.length;

  return (
    <div className="flex flex-col w-full bg-white border border-gray-300 rounded-md overflow-hidden">
      <div className="flex w-full z-50">
        <div className="w-full flex flex-1 flex-col p-2">
          {/* Header  */}
          <div className="flex gap-2 justify-between pb-2">
            <PageHeader
              defaultPage="Variants"
              type="product-level"
              prefix="Product"
            />
            <div className="flex items-center gap-1">
              {/* Horizontal navlink  */}
              <div className="flex">
                {productLayoutNavLinks.map((productLayoutNavLink, index) => {
                  return (
                    <NavLink
                      key={index}
                      to={productLayoutNavLink.link}
                      end
                      className={({ isActive }) =>
                        `w-full flex items-center gap-2 py-1 px-2 text-[12px] rounded-md transition-all ${
                          isActive
                            ? "bg-blue-50 text-blue-600"
                            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                        }`
                      }
                    >
                      <productLayoutNavLink.icon height={"18"} width={"18"} />

                      <span
                        className={`truncate transition-opacity duration-200 ease-in-out `}
                      >
                        {productLayoutNavLink.label}
                      </span>
                    </NavLink>
                  );
                })}
              </div>
              {/* Horizontal navlink ends */}
              {/* Collapse button  */}
              <button
                onClick={toggleSidebar}
                className={`flex ${productSummaryOpen ? "bg-gray-200" : "bg-gray-100"} rounded px-1 py-1 hover:bg-gray-200 cursor-pointer`}
              >
                <IoIosArrowDown
                  height={16}
                  width={16}
                  className={`${productSummaryOpen ? "rotate-180" : ""} transition-all duration-300 ease-in-out`}
                />
              </button>
              {/* Collapse button ends */}
            </div>
          </div>
          {/* Header ends  */}
          {/* Summary  */}
          <div
            className={`grid grid-cols-[2fr_.7fr_1fr_1.4fr_.8fr_1fr_1.4fr] gap-2 w-full overflow-hidden`}
          >
            {/* Product detail box */}
            <div
              className={`flex border border-blue-100 bg-blue-50 gap-2 p-2 ${productSummaryOpen ? "h-full" : "h-0"} transition-all duration-300 ease-in-out overflow-hidden`}
            >
              <div className="flex flex-col items-start gap-2">
                <div className="flex gap-2">
                  <ProductIdBadge id={thisProduct._id} />
                  <ItemStatusBadge statusId={thisProduct.status} />
                </div>
                <div className="flex items-center gap-1 text-xs">
                  <StoreDetailBadge
                    type="store-name"
                    content={store?.storeName}
                  />
                  <StoreDetailBadge
                    type="store-owner"
                    content={store?.ownerName}
                  />
                </div>
                <div className="flex gap-2">
                  <ImageExtraLarge
                    image={defaultVariant.primaryImage}
                    alt={thisProduct.name}
                    type="square"
                  />
                  <div className="flex flex-col items-start">
                    <TitleNormal title={thisProduct.name} />
                    <TextNormal text={thisProduct.description} />
                  </div>
                </div>
              </div>
            </div>
            {/* Inventory box */}
            <div
              className={`flex border border-blue-100 bg-blue-50 gap-2 p-2 ${productSummaryOpen ? "h-full" : "h-0"} transition-all duration-300 ease-in-out overflow-hidden`}
            >
              <div className="flex flex-col gap-2">
                <div className="flex flex-col gap-1">
                  <p className="text-sm text-gray-400 leading-tight">
                    Inventory:
                  </p>
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <p className="text-sm text-gray-400 leading-tight">
                      Variants:
                    </p>
                    <p>{thisProduct.variants.length}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm text-gray-400 leading-tight">
                      Stock:
                    </p>
                    <p>{productStock === 0 ? "Out of stock" : productStock}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm text-gray-400 leading-tight">
                      Active:
                    </p>
                    {getStatusCount(
                      thisProduct.variants,
                      productStatus,
                      "active",
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm text-gray-400 leading-tight">
                      Inactive:
                    </p>
                    {getStatusCount(
                      thisProduct.variants,
                      productStatus,
                      "inactive",
                    )}
                  </div>
                </div>
              </div>
            </div>
            {/* Categories box */}
            <div
              className={`flex border border-blue-100 bg-blue-50 gap-2 p-2 ${productSummaryOpen ? "h-full" : "h-0"} transition-all duration-300 ease-in-out overflow-hidden`}
            >
              <div className="flex flex-col gap-2">
                <p className="text-sm text-gray-400 leading-tight">
                  Categories:
                </p>
                <div className="items items-start">
                  <div className="flex flex-wrap gap-1">
                    {thisProduct.categories.map((category, index) => {
                      const categoryName = getCategoryById(category).name;
                      return (
                        <div key={index} className="flex">
                          <CategoryItemBadge category={categoryName} />
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
            {/* Attributes box */}
            <div
              className={`flex border border-blue-100 bg-blue-50 gap-2 p-2 ${productSummaryOpen ? "h-full" : "h-0"} transition-all duration-300 ease-in-out overflow-hidden`}
            >
              <div className="flex flex-col gap-2">
                <p className="text-sm text-gray-400">Attribute Options:</p>
                {thisProduct.attributes.length === 0 ? (
                  <p className="text-gray-400 leading-tight">NA</p>
                ) : (
                  <AttributeOptionsBadge product={thisProduct} />
                )}
              </div>
            </div>
            {/* Price range box */}
            <div
              className={`flex border border-blue-100 bg-blue-50 gap-2 p-2 ${productSummaryOpen ? "h-full" : "h-0"} transition-all duration-300 ease-in-out overflow-hidden`}
            >
              <div className="flex flex-col gap-2">
                <div className="flex flex-col gap-1">
                  <p className="text-sm text-gray-400 leading-tight ">
                    Price Range:
                  </p>
                  {priceRange ? (
                    <div className="flex flex-col">
                      <div className="flex">
                        <span className="text-gray-400 text-sm pr-2">Min:</span>
                        <AmountFormat amount={priceRange.min} />
                      </div>
                      <div className="flex">
                        <span className="text-gray-400 text-sm pr-2">Max:</span>
                        <AmountFormat amount={priceRange.max} />
                      </div>
                    </div>
                  ) : (
                    "NA"
                  )}
                </div>
              </div>
            </div>
            {/* Sales box */}
            <div
              className={`flex border border-blue-100 bg-blue-50 gap-2 p-2 ${productSummaryOpen ? "h-full" : "h-0"} transition-all duration-300 ease-in-out overflow-hidden`}
            >
              <div className="flex flex-col gap-2">
                <div className="flex flex-col items-start">
                  <p className="text-sm text-gray-400 leading-tight">Sales:</p>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex items-center gap-2">
                      {totalSales < 1 ? (
                        <div className="flex items-center gap-2">
                          <h1 className="leading-tight text-gray-400">
                            No data yet
                          </h1>
                        </div>
                      ) : (
                        <div className="flex flex-col">
                          <div className="flex items-center gap-2">
                            <div className="flex items-start">
                              <SalesBadge amount={totalSales} />
                            </div>
                            <p className="leading-tight text-[14px]">
                              {totalSoldItems} Sold
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
                </div>
              </div>
            </div>
            {/* Reviews box */}
            <div
              className={`flex border border-blue-100 bg-blue-50 gap-2 p-2 ${productSummaryOpen ? "h-full" : "h-0"} transition-all duration-300 ease-in-out overflow-hidden`}
            >
              <div className="flex flex-col w-full">
                <div className="flex flex-col">
                  <p className="text-sm text-gray-400 leading-tight">Rating:</p>
                </div>
                {thisProductReviews.length !== 0 ? (
                  <div className="flex items-center gap-2">
                    <div className="flex flex-col items-center mt-2 h-full">
                      <h1 className="font-semibold leading-tight">
                        {thisProductReviews.length}{" "}
                        {thisProductReviews.length <= 1 ? "Review" : "Reviews"}
                      </h1>
                    </div>
                    <div className="flex flex-col">
                      <div className="font-semibold leading-tight">
                        <Rating value={averageRating} />
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="leading-tight">No ratings yet</p>
                )}
                <div className="flex border border-gray-300 mt-2 p-2">
                  <div className="flex-1">
                    {[5, 4, 3, 2, 1].map((star) => {
                      const count = productRatingBreakdown[star] || 0;
                      const pct =
                        totalProductReviews > 0
                          ? (count / totalProductReviews) * 100
                          : 0;

                      return (
                        <div key={star} className="flex items-center gap-2">
                          <span className="text-xs text-gray-500 text-right">
                            {star}
                          </span>
                          <div className="flex-1 bg-gray-300 rounded-full h-2 overflow-hidden">
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
          </div>
          {/* Summary ends  */}
        </div>
      </div>
      <Outlet
        context={{
          thisProduct,
          attributes,
          thisProductReviews,
          ordersByThisProduct,
          thisProductVariantsWithReviews,
          successfullOrdersOfThisProduct,
          pendingOrdersOfThisProduct,
          unsuccessfulOrdersOfThisProduct,
        }}
      />
    </div>
  );
};
