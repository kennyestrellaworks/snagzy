import { AmountFormatSmallThin } from "../../components/AmountFormat";
import { LengthIsZeroError } from "../../components/LengthIsZeroError";
import { PageHeader } from "../../components/PageHeader";
import { TextNormal } from "../../components/Text";
import { useData } from "../../context/DataContext";
import {
  ItemStatusBadge,
  StoreDetailBadgeSmall,
} from "../../components/Badges";
import { IconedEmail, IconedPhone } from "../../components/IconedValue";
import { UserDetail } from "../../components/UserDetail";
import { ImageLarge } from "../../components/Image";
import { TitleNormal } from "../../components/Title";

export const Stores = () => {
  const {
    getAllStores,
    getUserById,
    getAllProductsOfStoreId,
    getAllOrdersByProductId,
    getAllReviewsByProductId,
  } = useData();

  const stores = getAllStores();

  return (
    <div className="flex flex-col w-full bg-white border border-gray-300 rounded-md overflow-hidden">
      <div className="sticky w-full top-0 z-50">
        <div className="w-full flex flex-1 flex-col p-2">
          <div className="flex gap-2">
            <PageHeader defaultPage="Analytics" type="sidebar-level" />
          </div>
        </div>
      </div>

      <div className="sticky w-full top-0 z-30 bg-blue-100 border-t border-b border-gray-300">
        <div className="flex w-full justify-between">
          <div className="grid grid-cols-[2.6fr_2fr_1fr_1fr_1fr_1fr_1fr] w-full text-sm">
            <div className="flex border-r border-gray-300 p-1">
              Store details
            </div>
            <div className="flex border-r border-gray-300 p-1">Owner info</div>
            <div className="flex border-r border-gray-300 p-1">Products</div>
            <div className="flex border-r border-gray-300 p-1">Variants</div>
            <div className="flex border-r border-gray-300 p-1">Stocks</div>
            <div className="flex border-r border-gray-300 p-1">Sales</div>
            <div className="flex border-r border-gray-300 p-1">Reviews</div>
          </div>
          <div className="flex w-2 bg-blue-100"></div>
        </div>
      </div>

      <div className="flex w-full overflow-y-auto bg-white custom-scrollbar">
        <div className="flex flex-col w-full">
          {stores.length === 0 ? (
            <LengthIsZeroError
              title="No stores found"
              message="There are no stores available right now."
            />
          ) : (
            stores.map((store, index) => {
              const owner = getUserById(store.ownerId);
              const products = getAllProductsOfStoreId(store._id) || [];
              const variantsCount = products.reduce(
                (sum, product) => sum + (product.variants?.length || 0),
                0,
              );
              const storeOrders = products.flatMap((product) =>
                getAllOrdersByProductId(product._id),
              );
              const salesTotal = storeOrders.reduce(
                (sum, orderItem) =>
                  sum + (orderItem?.orderedItem?.variant?.subTotal || 0),
                0,
              );
              const reviewsCount = products.reduce(
                (sum, product) =>
                  sum + getAllReviewsByProductId(product._id).length,
                0,
              );
              const statusLabel =
                store.status || (store.isActive ? "active" : "inactive");
              const ownerEmail = owner?.contact?.email || store.email;
              const ownerPhone = owner?.contact?.phone || store.phone;

              return (
                <div key={index} className="flex flex-col w-full">
                  <div className="grid grid-cols-[2.6fr_2fr_1fr_1fr_1fr_1fr_1fr] border-b border-gray-300 bg-white hover:bg-blue-50/30 transition-all duration-300 ease-in-out">
                    {/* Store details box  */}
                    <div className="flex p-2 border-r border-gray-300 h-full">
                      <div className="flex flex-col gap-2">
                        <div className="flex gap-2">
                          <ImageLarge
                            image={store.logoUrl}
                            alt={store.slug}
                            type="square"
                          />
                          <div className="flex flex-col items-start">
                            <TitleNormal title={store.storeName} />
                            <TextNormal text={store.description} />
                            <div className="flex mt-2">
                              <ItemStatusBadge statusId={store.status} />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* Store details box ends */}
                    <div className="flex p-2 border-r border-gray-300 h-full">
                      <div className="flex flex-col gap-2 text-[14px]">
                        <UserDetail object={owner} />
                      </div>
                    </div>

                    <div className="flex p-2 border-r border-gray-300 h-full">
                      <TextNormal text={products.length || "NA"} />
                    </div>

                    <div className="flex p-2 border-r border-gray-300 h-full">
                      THIS
                    </div>

                    <div className="flex p-2 border-r border-gray-300 h-full">
                      <TextNormal text={variantsCount || "NA"} />
                    </div>

                    <div className="flex p-2 border-r border-gray-300 h-full">
                      {salesTotal > 0 ? (
                        <AmountFormatSmallThin amount={salesTotal} />
                      ) : (
                        <TextNormal text="No sales" />
                      )}
                    </div>

                    <div className="flex p-2 h-full">
                      <TextNormal text={reviewsCount || "NA"} />
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
