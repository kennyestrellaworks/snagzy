import { createContext, useContext } from "react";
import { orders } from "../data/orders.js";
import { users } from "../data/users.js";
import { products } from "../data/products.js";
import { stores } from "../data/stores.js";
import { categories } from "../data/categories.js";
import { attributes } from "../data/attributes.js";
import { sidebarNavLinks } from "../data/navLinks.js";
import { empty } from "../data/empty.js";
import { productStatus } from "../data/productStatus.js";

const DataContext = createContext();

export const DataProvider = ({ children }) => {
  // Test empty array /////////////////////
  const getEmpty = () => {
    return empty;
  };

  // Attributes /////////////////////////
  // Get all attributes.
  const getAllAttributes = () => {
    return attributes;
  };

  // Categories ////////////////////////
  // Get all categories.
  const getAllCategories = () => {
    return categories;
  };
  // Get category names by id
  const getCategoryNames = (categoryId) => {
    if (!Array.isArray(categoryId) || categoryId.length === 0) return [];
    return categoryId
      .map((catId) => getAllCategories().find((cat) => cat._id === catId)?.name)
      .filter((name) => name); // remove undefined
  };
  // Get category by category id.
  const getCategoryById = (categoryId) => {
    return getAllCategories().find((category) => category._id === categoryId);
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
  // Get categorys with type parent.
  const getAllParentCategories = () => {
    return getAllCategories().filter(
      (categoryType) => categoryType.type === "parent",
    );
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

  // Products ////////////////////////
  // Get all products
  const getAllProducts = () => {
    return products;
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
    if (!Array.isArray(variants)) return 0;
    return (variants || [])
      .filter((v) => v.isActive === true)
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
  // Get all products by passing product stats property.
  const getAllProductsByStatusId = (productStatusId) => {
    return getAllProducts().filter((item) => item.status === productStatusId);
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

  // Navlinks //////////////////////
  // Get sidebar nav links.
  const getSidebarNavLinks = () => {
    return sidebarNavLinks;
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
  // Get all orders by product id.
  const getAllOrdersByProductId = (productId) => {
    let ordersByThisProduct = [];

    const allOrders = getAllOrders();
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
        getAllProductStatus,
        getProductStatusById,
        getAllProductsByStatusId,
        getAllAttributes,
        getAllCategories,
        getCategoryNames,
        getCategoryById,
        getAllProductsOfCategoryId,
        getAllParentCategories,
        getAllStores,
        getStoreById,
        getAllProducts,
        getProductPriceRange,
        getProductStock,
        getAllProductsOfStoreId,
        getSidebarNavLinks,
        getAllUsers,
        getUserById,
        getAllOrders,
        getOrderById,
        getOrdersByBuyerId,
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
