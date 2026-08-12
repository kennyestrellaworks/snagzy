import { createContext, useContext } from "react";
import { orders } from "../data/orders.js";
import { users } from "../data/users.js";
import { products } from "../data/products.js";
import { stores } from "../data/stores.js";
import { categories } from "../data/categories.js";
import { attributes } from "../data/attributes.js";
import { messages } from "../data/messages.js";
import { empty } from "../data/empty.js";
import { reviews } from "../data/reviews.js";
import { productStatus } from "../data/productStatus.js";
import { variantStatus } from "../data/variantStatus.js";
import { conversations } from "../data/conversations.js";
import {
  amountDetailSortingOptions,
  buyerDetailSortingOptions,
  orderDetailSortingOptions,
  productSortOptions,
  reviewsSortingOptions,
  salesSortOptions,
} from "../data/sortOptions.js";
import { navLinks } from "../data/navLinks.js";
import { itemStatus } from "../data/itemStatus.js";
import { chatTabs } from "../data/chatTabs.js";
import { shippingMethod } from "../data/shippingMethod.js";

const DataContext = createContext();

export const DataProvider = ({ children }) => {
  // Test empty array /////////////////////
  const getEmpty = () => {
    return empty;
  };

  // Chats / Conversations ////////////////////////////
  // Messages
  const getAllMessages = () => {
    return messages;
  };
  const getAllConversations = () => {
    return conversations;
  };
  // Get conversation by person id.
  const getConversationByPersonId = (personId) => {
    let indexList = [];
    if (!personId) return [];
    getAllConversations().forEach((conversation, index) => {
      // Check if any participant's _id matches the personId
      if (
        conversation.participants.some(
          (participant) => participant._id === personId,
        )
      ) {
        indexList.push(conversations[index]);
      }
    });
    return indexList;
  };
  // Get other person within a conversation (pass the current user's ID)
  const getOtherPerson = (participants, currentUserId) => {
    if (participants.length === 2) {
      const otherPerson = participants.find(
        (person) => person._id !== currentUserId,
      );
      return otherPerson;
    }
    return null;
  };
  // Get messages by conversation id.
  const getMessagesByConversationId = (conversationId) => {
    // console.log("DataContext ", conversationId);
    return messages.filter((item) => item.conversationId === conversationId);
  };
  // Get the last conversation.
  const getConversationLastItem = (conversationId) => {
    const messagesList = getMessagesByConversationId(conversationId).sort(
      (a, b) => new Date(a.timestamp) - new Date(b.timestamp),
    );
    // console.log("messagesList", messagesList[messagesList.length - 1].text);
    return messagesList[messagesList.length - 1].text;
  };
  // Get all chat tabs
  const getAllChatTabs = () => {
    return chatTabs;
  };

  // Sort options //////////////////////////
  const getAllProductSortOptions = () => {
    return productSortOptions;
  };

  // Variants ////////////////////////
  // Get default variant of a product.
  const getProductDefaultVariant = (thisProduct) => {
    return thisProduct.variants.find(
      (item) => item._id === thisProduct.defaultVariant,
    );
  };
  // Get all variant status options
  const getAllVariantStatus = () => {
    return variantStatus;
  };
  // Get variant in a product.
  const getVariantInAProduct = (productId, variantId) => {
    const variantData = [];
    const product = getProductByProductId(productId);
    const variant = product.variants.find((item) => item._id === variantId);

    variantData.push({
      _id: variant._id,
      attributes: variant.attributes,
      discount: variant.discount,
      displayedPrice: variant.displayedPrice,
      gallery: variant.gallery,
      price: variant.price,
      primaryImage: variant.primaryImage,
      sku: variant.sku,
      status: variant.status,
      stock: variant.stock,
      product: {
        ...product,
        // _id: product._id,
        // attributes: product.attributes,
        // categories: product.categories,
        // defaultVariant: product.defaultVariant,
        // description: product.description,
        // gallery: product.gallery,
        // name: product.name,
        // slug: product.slug,
        // status: product.status,
        // storeOwnerInfo: product.storeOwnerInfo,
      },
    });

    return variantData;
  };

  // Attributes /////////////////////////
  // Get all attributes.
  const getAllAttributes = () => {
    return attributes;
  };
  // Sum of all attribute options
  const sumOfAllAttributesOptions = () => {
    return getAllAttributes()
      .map((item) => item.options)
      .reduce((acc, curr) => acc + curr.length, 0);
  };

  // Categories ////////////////////////
  // Get all categories.
  const getAllCategories = () => {
    return categories;
  };
  // Get category by category id.
  const getCategoryById = (categoryId) => {
    return getAllCategories().find((category) => category._id === categoryId);
  };
  // Re-structuring categories to have parent to child relationship.
  const getAllParentCategories = () => {
    // Extract and dedupe parent items
    const uniqueParentItems = [
      ...new Set(
        getAllCategories()
          .filter((c) => Array.isArray(c.parent))
          .flatMap((c) => c.parent),
      ),
    ];

    // Map each parent item to its structure with children
    return uniqueParentItems
      .map((parentId) => {
        const parent = getAllCategories().find((c) => c._id === parentId);

        if (!parent) return null;

        const children = getAllCategories()
          .filter((c) => Array.isArray(c.parent) && c.parent.includes(parentId))
          .map(({ _id, name, slug }) => ({ _id, name, slug }));

        return {
          _id: parent._id,
          name: parent.name,
          slug: parent.slug,
          children,
        };
      })
      .filter(Boolean); // Remove null entries
  };
  // Get products by category id.
  const getAllProductsOfCategoryId = (categoryId) => {
    if (!categoryId) return [];
    return getAllProducts().filter(
      (product) =>
        Array.isArray(product.categories) &&
        product.categories.some((catId) => catId === categoryId),
    );
  };

  // Reviews ///////////////////////////
  // Get all reviews
  const getAllReviews = () => {
    return reviews;
  };
  // Get all reviews using productId.
  const getAllReviewsByProductId = (productId) => {
    return getAllReviews().filter(
      (review) => review.orderInfo?.productId === productId,
    );
  };
  // Get users who reviewed a product.
  const getUsersWhoReviewed = (productReviews) => {
    return productReviews.map((item) => {
      return getAllUsers().find((user) => user._id === item.buyerId);
    });
  };
  // Get orders of reviewed items.
  const getOrdersOfReviewedItems = (productReviews) => {
    return productReviews.map((item) => {
      return getAllOrders().find(
        (order) => order._id === item.orderInfo.orderId,
      );
    });
  };
  // Get all reviews of a variant using a list of reviews by product.
  const getVariantReviewsInAProductReviews = (variantId, productReviews) => {
    return productReviews.filter(
      (review) => review.orderInfo?.variantId === variantId,
    );
  };
  // Get all reviews of a person.
  const getAllReviewsOfPersonId = (personId) => {
    return getAllReviews().filter((item) => item.buyerId === personId);
  };
  // Get variant with reviews by passing variant id and object data.
  const getVariantWithReviews = (id, objectData) => {
    return objectData.find((item) => item._id === id);
  };
  // Get reviews by buyerId.
  const getReviewsByBuyerId = () => {
    const groupedResults = [];
    const allReviewsList = getAllReviews();

    if (!allReviewsList || allReviewsList.length === 0) {
      return groupedResults;
    }

    allReviewsList.forEach((review) => {
      // Skip if review doesn't have required data
      if (!review || !review.buyerId || !review.orderInfo) {
        return;
      }

      const buyerId = review.buyerId;
      const orderId = review.orderInfo.orderId;
      const orderItemId = review.orderInfo.orderedItemId;

      // Skip if missing critical IDs
      if (!orderId || !orderItemId) {
        return;
      }

      const order = getOrderById(orderId);

      // Skip if order not found or missing required structure
      if (!order || !order.buyerInfo || !order.orderedItems) {
        return;
      }

      const orderedItemInfo = order.orderedItems.find(
        (item) => item && item._id === orderItemId,
      );

      // Skip if ordered item not found
      if (!orderedItemInfo) {
        return;
      }

      // Find if we already have this buyer+order combination
      let existingBuyerOrder = groupedResults.find(
        (item) =>
          item.user?.buyerInfo?.buyerId === buyerId && item.orderId === orderId,
      );

      if (!existingBuyerOrder) {
        // Create new buyer-order entry
        existingBuyerOrder = {
          user: {
            buyerInfo: {
              buyerId: order.buyerInfo.buyerId,
              buyerFirstName: order.buyerInfo.buyerFirstName || "Unknown",
              buyerMiddleName: order.buyerInfo.buyerMiddleName || "Unknown",
              buyerLastName: order.buyerInfo.buyerLastName || "Unknown",
              email: order.buyerInfo.email || "Unknown",
              phone: order.buyerInfo.phone || "Unknown",
              image: order.buyerInfo.image || null,
              shippingInfo: order.buyerInfo.shippingInfo?.address || null,
            },
          },
          orderId: order._id,
          placedAt: order.timeline?.[0] || null,
          lastUpdated: order.timeline?.[order.timeline.length - 1] || null,
          orderedItems: [],
        };
        groupedResults.push(existingBuyerOrder);
      }

      // Find or create ordered item
      let orderedItemObj = existingBuyerOrder.orderedItems.find(
        (item) => item && item._id === orderItemId,
      );

      if (!orderedItemObj) {
        orderedItemObj = {
          _id: orderItemId,
          productId: orderedItemInfo.productId || null,
          productName: orderedItemInfo.productName || "Unknown Product",
          description: orderedItemInfo.description || "",
          variant: orderedItemInfo.variant || {},
          reviews: [],
        };
        existingBuyerOrder.orderedItems.push(orderedItemObj);
      }

      const transformedReview = {
        _id: review._id,
        rating: review.rating || 0,
        feedback: review.feedback || "",
        media: review.media || [],
        createdAt: review.createdAt || null,
        updatedAt: review.updatedAt || null,
      };

      orderedItemObj.reviews.push(transformedReview);
    });

    return groupedResults;
  };

  // Creating objects /////////////////////////////
  // Create product variants with reviews object.
  const createProductVariantsObjectWithReviews = (
    thisProductVariants,
    thisProductReviews,
    buyersWhoReviewed,
    ordersByThisProduct,
  ) => {
    const thisProductVariantsWithReviews = []; // The empty array that will be returned
    // console.log("ordersByThisProduct", ordersByThisProduct);

    // Adding reviews[] property to each variant of this current product.
    thisProductVariants.forEach((item) => {
      thisProductVariantsWithReviews.push({
        _id: item._id,
        status: item.status,
        sku: item.sku,
        attributes: item.attributes,
        price: item.price,
        discount: item.discount,
        displayedPrice: item.displayedPrice,
        stock: item.stock,
        primaryImage: item.primaryImage,
        gallery: item.gallery,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
        reviews: [], // Empty reviews property.
      });
    });

    // Adding reviews data to each variants of this current data.
    // Each variant will have none, or one or more than items witin the
    // reviews[] property.
    thisProductReviews.forEach((reviewItem) => {
      thisProductVariants.forEach((variantItem, variantIndex) => {
        if (reviewItem.orderInfo.variantId === variantItem._id) {
          const userWhoReviewed = buyersWhoReviewed.find(
            (item) => item._id === reviewItem.buyerId,
          );

          const shippingInfo = ordersByThisProduct.find(
            (item) => item._id === reviewItem.orderInfo.orderId,
          )?.buyerInfo.shippingInfo.address;

          // console.log("reviewItem", reviewItem);
          // Pushing object to reviews property.
          thisProductVariantsWithReviews[variantIndex].reviews.push({
            buyerInfo: {
              buyerId: reviewItem.buyerId,
              buyerFirstName: userWhoReviewed.firstName,
              buyerMiddleName: userWhoReviewed.middleName,
              buyerLastName: userWhoReviewed.lastName,
              email: userWhoReviewed.contact.email,
              phone: userWhoReviewed.contact.phone,
              image: userWhoReviewed.image,
              shippingInfo: shippingInfo,
            },
            reviewId: reviewItem._id,
            createdAt: reviewItem.createdAt,
            feedback: reviewItem.feedback,
            rating: reviewItem.rating,
            media: reviewItem.media,
            orderInfo: {
              createdAt: reviewItem.orderInfo.createdAt,
              orderId: reviewItem.orderInfo.orderId,
              orderedItemId: reviewItem.orderInfo.orderedItemId,
              productId: reviewItem.orderInfo.productId,
              updatedAt: reviewItem.orderInfo.updatedAt,
            },
          });
        }
      });
    });
    return thisProductVariantsWithReviews;
  };
  // Group reviews by order.
  const groupReviewsByOrder = (reviewsObject) => {
    const groupReviews = reviewsObject.reduce((acc, review) => {
      const orderId = review.orderInfo.orderId;
      const orderItemId = review.orderInfo.orderedItemId;

      const order = getOrderById(orderId);
      const orderedItemInfo = order.orderedItems.find(
        (item) => item._id === orderItemId,
      );
      // console.log("THIS", orderedItemInfo);
      const groupKey = acc;

      if (!groupKey[orderId]) {
        groupKey[orderId] = {
          orderId: order?._id,
          placedAt: order?.timeline[0],
          lastUpdated: order?.timeline[order?.timeline.length - 1],
          orderedItems: {},
        };
      }

      if (!groupKey[orderId].orderedItems[orderItemId]) {
        groupKey[orderId].orderedItems[orderItemId] = {
          _id: orderItemId,
          productId: orderedItemInfo.productId,
          productName: orderedItemInfo.productName,
          description: orderedItemInfo.description,
          variant: orderedItemInfo.variant,
          storeOwnerInfo: orderedItemInfo.variant.storeInfo,
          reviews: [],
        };
      }

      const transformedReview = {
        _id: review._id,
        rating: review.rating,
        feedback: review.feedback,
        media: review.media,
        createdAt: review.createdAt,
        updatedAt: review.updatedAt,
      };

      groupKey[orderId].orderedItems[orderItemId].reviews.push(
        transformedReview,
      );

      return acc;
    }, {});
    return Object.values(groupReviews).map((item) => {
      return {
        orderId: item.orderId,
        placedAt: item.placedAt,
        lastUpdated: item.lastUpdated,
        orderedItems: Object.values(item.orderedItems),
      };
    });
  };

  const addingOrdersToProductVariants = (
    thisProductVariants,
    ordersByThisProduct,
  ) => {
    // Adding orders[] property to each variant of this current product.
    const thisProductVariantsWithItsOrders = [];
    thisProductVariants.forEach((item) => {
      thisProductVariantsWithItsOrders.push({
        _id: item._id,
        status: item.status,
        sku: item.sku,
        attributes: item.attributes,
        price: item.price,
        discount: item.discount,
        displayedPrice: item.displayedPrice,
        stock: item.stock,
        primaryImage: item.primaryImage,
        gallery: item.gallery,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
        orders: [],
      });
    });

    // Adding orders data to each variants of this current data.
    // Each variant will have none, or one or more than items witin the
    // orders[] property.
    thisProductVariants.forEach((variantItem, variantIndex) => {
      ordersByThisProduct.forEach((orderItem) => {
        // console.log("variantItem", variantItem);
        // console.log("orderItem", orderItem);

        if (orderItem.orderedItem.variant._id === variantItem._id) {
          thisProductVariantsWithItsOrders[variantIndex].orders.push({
            buyerInfo: {
              buyerId: orderItem.buyerInfo.buyerId,
              buyerFirstName: orderItem.buyerInfo.buyerFirstName,
              buyerMilddleName: orderItem.buyerInfo.buyerMilddleName,
              buyerLastName: orderItem.buyerInfo.buyerLastName,
              email: orderItem.buyerInfo.email,
              image: orderItem.buyerInfo.image,
              phone: orderItem.buyerInfo.phone,
              shippingInfo: orderItem.buyerInfo.shippingInfo.address,
            },
            createdAt: orderItem.createdAt,
            currentStatus: orderItem.currentStatus,
            orderedItem: {
              description: orderItem.orderedItem.description,
              productId: orderItem.orderedItem.productId,
              productName: orderItem.orderedItem.productName,
              _id: orderItem.orderedItem._id,
              price: orderItem.orderedItem.variant.price,
              quantity: orderItem.orderedItem.variant.quantity,
              sku: orderItem.orderedItem.variant.sku,
              subTotal: orderItem.orderedItem.variant.subTotal,
              variant: orderItem.orderedItem.variant,
            },
            paymentInfo: orderItem.paymentInfo,
            updatedAt: orderItem.updatedAt,
            _id: orderItem._id,
          });
        }
      });
    });
    return thisProductVariantsWithItsOrders;
  };

  // Stores //////////////////////////
  // Get all stores.
  const getAllStores = () => {
    return stores;
  };
  // Get a store.
  const getStoreById = (storeId) => {
    return stores.find((shop) => shop._id === storeId);
  };

  // Status count //////////////////////////////
  const getStatusCount = (object, statusObject, requestedStatus) => {
    const newObject = [];

    object.forEach((item) => {
      newObject.push({
        newObjectId: item._id,
        newObjectStatusId: item.status,
        newObjectStatusSlug: "",
      });
    });

    newObject.forEach((item) => {
      item.newObjectStatusSlug = statusObject.find(
        (statusObjectItem) => statusObjectItem._id === item.newObjectStatusId,
      )?.slug;
    });

    return newObject.filter(
      (item) => item.newObjectStatusSlug === requestedStatus,
    )?.length;
  };

  // Products ////////////////////////
  // Get all products
  const getAllProducts = () => {
    return products || "";
  };
  // Get a product by productId.
  const getProductByProductId = (productId) => {
    return getAllProducts().find((product) => product._id === productId);
  };
  // Get product price ranges from lowest to highest.
  const getProductPriceRange = (variants) => {
    if (!Array.isArray(variants) || variants.length === 0) return null;
    const prices = variants
      .map((v) => v.price)
      .filter((p) => typeof p === "number" && p > 0);
    if (prices.length === 0) return null;
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    return { min, max };
  };
  // Get product stock by passing variants object.
  const getProductStock = (variants) => {
    const activeProductStatus = getAllItemStatus().find(
      (item) => item.slug === "active",
    )?._id;
    if (!Array.isArray(variants)) return 0;
    return (variants || [])
      .filter((v) => v.status === activeProductStatus)
      .reduce((sum, v) => sum + (v.stock || 0), 0);
  };
  // Get all products using store id.
  const getAllProductsOfStoreId = (storeId) => {
    return getAllProducts().filter(
      (product) => product.storeOwnerInfo.storeId === storeId,
    );
  };
  // Get all product status options
  const getAllProductStatus = () => {
    return productStatus;
  };
  // Get a product status option by product status id.
  const getProductStatusById = (productStatusId) => {
    return getAllProductStatus().find((item) => item._id === productStatusId);
  };
  // Get all products by passing product status property.
  const getAllProductsByStatusId = (productStatusId) => {
    return getAllProducts().filter((item) => item.status === productStatusId);
  };

  // Item status /////////////////////////////////
  const getAllItemStatus = () => {
    return itemStatus;
  };

  // Shipping methods /////////////////////////////////
  const getAllShippingMethods = () => {
    return shippingMethod;
  };

  // Users //////////////////////////
  // Get all users.
  const getAllUsers = () => {
    return users;
  };
  // Get a user by id.
  const getUserById = (userId) => {
    return users.find((user) => user._id === userId);
  };
  // Get a user's primary address
  const getUserHomeAddress = (userId) => {
    return users
      .find((user) => user._id === userId)
      ?.address.find((item) => item.isDefault);
  };
  // Get user detail but minimal data
  const getUserDetailMinimal = (userId) => {
    const user = getUserById(userId);
    return {
      firstName: user?.firstName || "",
      middleName: user?.middleName || "",
      lastName: user?.lastName || "",
      jobTitle: user?.jobTitle || "",
      isOnline: user?.isOnline || false,
      gender: user?.gender || "",
      image: user?.image || null,
    };
  };

  // Sort options /////////////////////////
  // Get reviews sorting options
  const getReviewsSortingOptions = () => {
    return reviewsSortingOptions;
  };
  // Get sales sorting options
  const getSalesSortingOptions = () => {
    return salesSortOptions;
  };
  // Get order details sorting options
  const getOrderDetailsSortingOptions = () => {
    return orderDetailSortingOptions;
  };
  // Get buyer details sorting options
  const getBuyerDetailsSortingOptions = () => {
    return buyerDetailSortingOptions;
  };
  // Get buyer details sorting options
  const getAmountDetailSortingOptions = () => {
    return amountDetailSortingOptions;
  };

  // Navlinks //////////////////////
  // Get sidebar nav links.
  const getSidebarNavLinks = () => {
    return navLinks.filter((navlink) => navlink.type === "sidebar-level");
  };
  // Get product layout nav links.
  const getProductLayoutNavLinks = () => {
    return navLinks.filter((navlink) => navlink.type === "products-level");
  };
  // Get user layout nav links.
  const getUserLayoutNavLinks = () => {
    return navLinks.filter((navlink) => navlink.type === "user-level");
  };
  // Get analytics layout nav links.
  const getAnalyticsLayoutNavLinks = () => {
    return navLinks.filter((navlink) => navlink.type === "analytics-level");
  };
  // Get orders layout nav links.
  const getOrdersLayoutNavLinks = () => {
    return navLinks.filter((navlink) => navlink.type === "orders-level");
  };
  // Get orders layout nav links.
  const getRevenueLayoutNavLinks = () => {
    return navLinks.filter((navlink) => navlink.type === "revenue-level");
  };

  // Orders ///////////////////
  // Get all orders.
  const getAllOrders = () => {
    return orders;
  };
  // Get an order by id.
  const getOrderById = (orderId) => {
    return orders.find((order) => order._id === orderId);
  };
  // Get an order by buyer id.
  const getOrdersByBuyerId = (buyerId) => {
    return orders.filter((order) => order?.buyerInfo?.buyerId === buyerId);
  };
  // Sum orderedItems quantity.
  const sumOrderQuantities = (orderedItems) => {
    return orderedItems.reduce((total, item) => {
      return total + (item.variant?.quantity || 0);
    }, 0);
  };
  // Get all orders by product id, can also accept orders array.
  const getAllOrdersByProductId = (productId, ordersArray) => {
    let ordersByThisProduct = [];

    const allOrders = ordersArray ? ordersArray : getAllOrders();
    // console.log("allOrders", allOrders);

    allOrders.forEach((orders, ordersIndex) => {
      orders.orderedItems.forEach((item) => {
        if (item.productId === productId) {
          ordersByThisProduct.push({
            _id: allOrders[ordersIndex]._id,
            buyerInfo: allOrders[ordersIndex].buyerInfo,
            createdAt: allOrders[ordersIndex].createdAt,
            updatedAt: allOrders[ordersIndex].updatedAt,
            paymentInfo: allOrders[ordersIndex].paymentInfo,
            currentStatus: allOrders[ordersIndex].currentStatus,
            orderedItem: {
              _id: item._id,
              description: item.description,
              productId: item.productId,
              productName: item.productName,
              variant: {
                attributeOptions: item.variant.attributeOptions,
                price: item.variant.price,
                primaryImage: item.variant.primaryImage,
                quantity: item.variant.quantity,
                sku: item.variant.sku,
                subTotal: item.variant.subTotal,
                _id: item.variant._id,
              },
            },
            // item: item,
          });
        }
      });
    });
    // console.log("ordersByThisProduct", ordersByThisProduct);
    return ordersByThisProduct;
  };

  return (
    <DataContext.Provider
      value={{
        getAllMessages,
        getAllConversations,
        getConversationByPersonId,
        getOtherPerson,
        getConversationLastItem,
        getMessagesByConversationId,
        getAllProductStatus,
        getProductStatusById,
        getAllProductsByStatusId,
        getAllChatTabs,
        getAllProductSortOptions,
        getProductDefaultVariant,
        getAllAttributes,
        sumOfAllAttributesOptions,
        getAllCategories,
        getCategoryById,
        getAllParentCategories,
        getAllProductsOfCategoryId,
        getAllReviews,
        getAllReviewsByProductId,
        getUsersWhoReviewed,
        getOrdersOfReviewedItems,
        getAllVariantStatus,
        getVariantInAProduct,
        getVariantReviewsInAProductReviews,
        getReviewsByBuyerId,
        getAllReviewsOfPersonId,
        getVariantWithReviews,
        createProductVariantsObjectWithReviews,
        groupReviewsByOrder,
        addingOrdersToProductVariants,
        getAllStores,
        getStoreById,
        getStatusCount,
        getAllProducts,
        getProductByProductId,
        getProductPriceRange,
        getProductStock,
        getAllProductsOfStoreId,
        getSidebarNavLinks,
        getProductLayoutNavLinks,
        getUserLayoutNavLinks,
        getAnalyticsLayoutNavLinks,
        getOrdersLayoutNavLinks,
        getRevenueLayoutNavLinks,
        getAllItemStatus,
        getAllShippingMethods,
        getAllUsers,
        getUserById,
        getUserHomeAddress,
        getUserDetailMinimal,
        getReviewsSortingOptions,
        getSalesSortingOptions,
        getOrderDetailsSortingOptions,
        getBuyerDetailsSortingOptions,
        getAmountDetailSortingOptions,
        getAllOrders,
        getOrderById,
        getOrdersByBuyerId,
        sumOrderQuantities,
        getAllOrdersByProductId,
        getEmpty,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useData = () => useContext(DataContext);
