import { useSearchParams } from "react-router-dom";
import { AmountFormatSmall } from "../../components/AmountFormat";
import {
  ItemStatusBadge,
  ProductIdBadge,
  ProductVariantAttributeBadge,
  SalesBadge,
  SalesBadgeMedium,
  StoreDetailBadge,
  VariantBadge,
} from "../../components/Badges";
import { ImageDoubleExtraSmall, ImageExtraLarge } from "../../components/Image";
import { LengthIsZeroError } from "../../components/LengthIsZeroError";
import { NoSomethingSmall } from "../../components/NoSomething";
import { PricingDetailBox } from "../../components/PricingDetailBox";
import { ProductNameNAttributes } from "../../components/ProductNameNAttributes";
import { Rating } from "../../components/Rating";
import { TextNormal } from "../../components/Text";
import { TitleNormal } from "../../components/Title";
import { useData } from "../../context/DataContext";
import { useOrdersAnalytics } from "../../context/OrdersAnalyticsContext";
import { useReviewsAnalytics } from "../../context/ReviewsAnalyticsContext";
import { useEffect, useMemo, useState } from "react";
import { PageHeader } from "../../components/PageHeader";

import { LoadMoreVariant } from "../../components/Button";
import { LoadMoreProduct } from "../../components/Button";

const INITIAL_VARIANT_LIMIT = 3;
const VARIANT_INCREMENT = 3;

export const Inventory = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const {
    getAllProducts,
    getStoreById,
    getUserById,
    getAllProductStatus,
    getAllAttributes,
    getVariantReviewsInAProductReviews,
    getAllReviewsByProductId,
    getAllVariantStatus,
    getProductStock,
    getAllItemStatus,
  } = useData();

  // OrdersAnalyticsContext.jsx
  const ordersAnalytics = useOrdersAnalytics();
  const {
    getOrderSubTotalCountOfAVariant,
    getOrderSubTotalOfAVariant,
    getTotalSoldItemsOfAProduct,
    getTotalSalesOfAProduct,
  } = ordersAnalytics.ordersAnalyticsValue;

  // ReviewAnalyticsContext.jsx
  const reviewsAnalytics = useReviewsAnalytics();
  const { getVariantRatingAverage } = reviewsAnalytics.reviewsAnalyticsValue;

  const products = getAllProducts();
  const attributes = getAllAttributes();
  const variantStatus = getAllVariantStatus();

  const count = 4;
  const initialInventoryItemsParams = parseInt(
    searchParams.get("inventory_items") || 0,
  );
  const [inventoryItemsParams, setInventoryItemsParams] = useState(
    initialInventoryItemsParams,
  );

  // Get variant show counts from URL (JSON string)
  const getVariantCountsFromURL = () => {
    const countsParam = searchParams.get("variant_counts");
    if (!countsParam) return {};
    try {
      return JSON.parse(countsParam);
    } catch (e) {
      console.error("Failed to parse variant_counts", e);
      return {};
    }
  };

  const [variantShowCounts, setVariantShowCounts] = useState(
    getVariantCountsFromURL,
  );

  // Sync state when URL changes (e.g., back/forward)
  useEffect(() => {
    setVariantShowCounts(getVariantCountsFromURL());
  }, [searchParams]);

  useEffect(() => {
    const urlInventoryItems =
      parseInt(searchParams.get("inventory_items")) || count;
    setInventoryItemsParams(urlInventoryItems);
  }, [searchParams]);

  // Filtered products structured as inventory.
  const filteredInventories = useMemo(() => {
    let result = products || [];
    return result;
  }, [products]);

  const displayedInventories = useMemo(() => {
    return (filteredInventories || []).slice(0, inventoryItemsParams);
  }, [filteredInventories, inventoryItemsParams]);

  // Load more products (main list)
  const loadMore = () => {
    const updateUrlParams = (newCount) => {
      const params = {};
      params.inventory_items = newCount;
      // Preserve existing variant_counts
      const currentCounts = searchParams.get("variant_counts");
      if (currentCounts) params.variant_counts = currentCounts;
      setSearchParams(params);
    };

    const totalItems =
      filteredInventories && filteredInventories.length > 0
        ? filteredInventories.length
        : products.length;
    const newCount = Math.min(inventoryItemsParams + count, totalItems);

    if (newCount > inventoryItemsParams) {
      setInventoryItemsParams(newCount);
      updateUrlParams(newCount);
    }
  };

  // Increase variant count for a product
  const loadMoreVariants = (productId, totalVariants) => {
    const currentCount = variantShowCounts[productId] || INITIAL_VARIANT_LIMIT;
    const newCount = Math.min(currentCount + VARIANT_INCREMENT, totalVariants);
    updateVariantCount(productId, newCount);
  };

  // Reset variant count to initial limit
  const resetVariants = (productId) => {
    updateVariantCount(productId, INITIAL_VARIANT_LIMIT);
  };

  // Helper to update URL and state
  const updateVariantCount = (productId, newCount) => {
    const newCounts = { ...variantShowCounts };
    if (newCount === INITIAL_VARIANT_LIMIT) {
      // Remove from object if it's the default value (clean up URL)
      delete newCounts[productId];
    } else {
      newCounts[productId] = newCount;
    }

    // Update URL
    const newParams = {};
    const inventoryItems = searchParams.get("inventory_items");
    if (inventoryItems) newParams.inventory_items = inventoryItems;
    if (Object.keys(newCounts).length > 0) {
      newParams.variant_counts = JSON.stringify(newCounts);
    }
    setSearchParams(newParams);

    // Update state
    setVariantShowCounts(newCounts);
  };

  // Get current visible count for a product
  const getVisibleVariantCount = (productId, totalVariants) => {
    const stored = variantShowCounts[productId];
    if (stored !== undefined) return Math.min(stored, totalVariants);
    return Math.min(INITIAL_VARIANT_LIMIT, totalVariants);
  };

  return (
    <div className="flex flex-col w-full bg-white border border-gray-300 rounded-md overflow-hidden">
      {/* Header  */}
      <div className="w-full top-0 z-50">
        <div className="w-full flex flex-1 flex-col p-2">
          <div className="flex gap-2">
            <PageHeader defaultPage="Analytics" type="sidebar-level" />
          </div>
        </div>
      </div>
      {/* Header ends */}
      {/* Table header  */}
      <div className="sticky w-full top-0 z-30 bg-blue-100 border-t border-b border-gray-300">
        <div className="flex w-full justify-between">
          <div className="grid grid-cols-[2fr_7fr] w-full text-sm">
            <div className="flex border-r border-gray-300 p-1">
              Product Details
            </div>
            <div className="grid grid-cols-[4fr_1.8fr_.6fr_3fr_3fr_.5fr] w-full text-sm">
              <div className="flex border-r border-gray-300 p-1">Variants</div>
              <div className="flex border-r border-gray-300 p-1">
                Pricing Details
              </div>
              <div className="flex border-r border-gray-300 p-1">Stock</div>
              <div className="flex border-r border-gray-300 p-1">Sales</div>
              <div className="flex border-r border-gray-300 p-1">
                Review & Rating
              </div>
              <div className="flex border-r border-gray-300 p-1"></div>
            </div>
          </div>
          <div className="flex w-2 bg-blue-100"></div>
        </div>
      </div>
      {/* Table header ends */}
      {/* List area */}
      <div className="flex w-full overflow-y-auto bg-white scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 hover:scrollbar-thumb-gray-400">
        <div className="flex flex-col w-full">
          {displayedInventories.length === 0 ? (
            <LengthIsZeroError
              title="Something went wrong"
              message="There was an error in fetching the products!"
            />
          ) : (
            displayedInventories.map((product, index) => {
              // Product image
              const primaryImage = product.variants.find(
                (item) => item._id === product.defaultVariant,
              )?.primaryImage;

              // Store
              const store = getStoreById(product.storeOwnerInfo.storeId);

              // Store owner
              const storeOwner =
                (getUserById(product.storeOwnerInfo.ownerId)?.firstName || "") +
                " " +
                (getUserById(product.storeOwnerInfo.ownerId)?.lastName || "");

              // Product status
              const itemStatus = getAllItemStatus();

              // Product stock
              const productStock = getProductStock(product.variants);

              // Product Sales
              const totalSoldItems = getTotalSoldItemsOfAProduct(product._id);
              const totalSales = getTotalSalesOfAProduct(product._id);

              // Variant pagination
              const totalVariants = product.variants.length;
              const visibleCount = getVisibleVariantCount(
                product._id,
                totalVariants,
              );
              const visibleVariants = product.variants.slice(0, visibleCount);
              const hasMoreVariants = visibleCount < totalVariants;
              const isShowingAll = visibleCount === totalVariants;
              const showLoadMoreButton = totalVariants > INITIAL_VARIANT_LIMIT;
              const remainingVariants = totalVariants - visibleCount;
              const buttonLabel = isShowingAll
                ? "Less"
                : `More +${remainingVariants}`;

              return (
                <div key={index} className="flex flex-col w-full">
                  <div
                    className={`grid grid-cols-[2fr_7fr] bg-white text-sm ${itemStatus.slug === "inactive" ? "opacity-50" : itemStatus.slug === "active" ? "" : ""}`}
                  >
                    {/* Grid 1  */}
                    <div className="flex items-start p-2 border-b border-r border-gray-300 h-full">
                      {/* Product detail box  */}
                      <div className="flex flex-col gap-2">
                        <div className="flex gap-2">
                          <ProductIdBadge id={product._id} />
                          <ItemStatusBadge statusId={product.status} />
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
                            alt={product.name}
                            type="square"
                          />
                          <div className="flex flex-col items-start">
                            <TitleNormal title={product.name} />
                            <TextNormal text={product.description} />
                          </div>
                        </div>
                        {product.variants.length > 1 && (
                          <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-2">
                              <p>Stock: </p>
                              {productStock === 0 ? (
                                <TextNormal text="Out of stock" />
                              ) : productStock === 1 ? (
                                <TextNormal text={`${productStock} Item`} />
                              ) : (
                                <TextNormal text={`${productStock} Items`} />
                              )}
                            </div>
                            <div className="flex">
                              <div className="flex flex-col items-start">
                                {totalSales < 1 ? null : (
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
                        )}
                      </div>
                    </div>
                    {/* Grid 2  */}
                    <div className="flex flex-col w-full">
                      {product.variants.length === 0 ? (
                        <div className="flex h-full items-center justify-center">
                          <NoSomethingSmall text="No data found" />
                        </div>
                      ) : (
                        <>
                          {visibleVariants.map((variant, variantIndex) => {
                            // Variant sales
                            const totalSalesVariant =
                              getOrderSubTotalOfAVariant(variant?._id);
                            const totalSoldItemsVariant =
                              getOrderSubTotalCountOfAVariant(variant?._id);

                            const thisProductReviews = getAllReviewsByProductId(
                              product._id,
                            );

                            const variantReviewsInProductReviews =
                              getVariantReviewsInAProductReviews(
                                variant._id,
                                thisProductReviews,
                              );

                            // Variant status
                            const variantStatusItem = variantStatus.find(
                              (item) => item._id === variant.status,
                            );

                            return (
                              <div key={variantIndex} className="h-full">
                                <div
                                  className={`grid grid-cols-[4fr_1.8fr_.6fr_3fr_3fr_.5fr] text-sm ${variantStatusItem?.slug === "inactive" ? "opacity-50" : ""} border-b border-gray-300 h-full`}
                                >
                                  {/* Variant details box  */}
                                  <div className="flex items-start p-2 border-r border-gray-300">
                                    <div className="flex flex-col">
                                      <div className="flex gap-2">
                                        <VariantBadge id={variant._id} />
                                        <ItemStatusBadge
                                          statusId={variant.status}
                                        />
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
                                              productName={product.name}
                                              variant={variant}
                                              attributes={attributes}
                                            />
                                          </h1>
                                          <p className="leading-tight">
                                            SKU: {variant.sku}
                                          </p>
                                          <div className="flex gap-2 mt-2">
                                            <ProductVariantAttributeBadge
                                              variant={variant}
                                              attributes={attributes}
                                            />
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  {/* Pricing details box */}
                                  <div className="flex items-start p-2 border-r border-gray-300 h-full">
                                    <div className="flex flex-col">
                                      <PricingDetailBox variantItem={variant} />
                                    </div>
                                  </div>
                                  {/* Stock box */}
                                  <div className="flex items-start p-2 border-r border-gray-300 h-full">
                                    <div className="flex flex-col">
                                      {variant.stock}
                                    </div>
                                  </div>
                                  {/* Sales box  */}
                                  <div className="flex items-start p-2 border-r border-gray-300 h-full">
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
                                              <SalesBadgeMedium
                                                amount={totalSalesVariant}
                                              />
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
                                                <AmountFormatSmall
                                                  amount={200.25}
                                                />
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
                                                <AmountFormatSmall
                                                  amount={200.25}
                                                />
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
                                  {/* Reviews box  */}
                                  <div className="flex items-start p-2 border-r border-gray-300 h-full">
                                    <div className="flex items-start flex-col">
                                      <div
                                        className={`flex items-start ${
                                          variantReviewsInProductReviews.length ===
                                          0
                                            ? "text-gray-300"
                                            : ""
                                        }`}
                                      >
                                        {variantReviewsInProductReviews.length ===
                                        0 ? (
                                          <NoSomethingSmall text="No reviews yet" />
                                        ) : (
                                          `${variantReviewsInProductReviews.length} ${
                                            variantReviewsInProductReviews.length ===
                                            1
                                              ? "Review"
                                              : "Reviews"
                                          }`
                                        )}
                                      </div>
                                      <div className="flex items-start">
                                        {variantReviewsInProductReviews.length ===
                                        0 ? (
                                          ""
                                        ) : (
                                          <div className="flex flex-col gap-1">
                                            <Rating
                                              value={getVariantRatingAverage(
                                                variant._id,
                                                thisProductReviews,
                                              )}
                                            />
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                          {/* Load more / Show fewer variants button */}
                          {showLoadMoreButton && (
                            <div className="flex items-center justify-center p-2 border-b border-gray-300 bg-gray-50">
                              <LoadMoreVariant
                                onClick={() => {
                                  if (isShowingAll) {
                                    resetVariants(product._id);
                                  } else {
                                    loadMoreVariants(
                                      product._id,
                                      totalVariants,
                                    );
                                  }
                                }}
                              >
                                {buttonLabel}
                              </LoadMoreVariant>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
          {filteredInventories.length > 0 &&
            products.length > 0 &&
            inventoryItemsParams <
              (filteredInventories.length || products.length) && (
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
    </div>
  );
};
