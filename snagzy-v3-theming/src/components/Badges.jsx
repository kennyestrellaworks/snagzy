import { useData } from "../context/DataContext";
import { amountToDecimal } from "../utils/helpers";
import {
  ShoppingBag,
  Store,
  ChartColumnStacked,
  TrendingUp,
  Star,
  Package,
  IoPerson,
  CgGenderMale,
  CgGenderFemale,
  IoChatboxEllipsesOutline,
} from "./SVG";

export const ProductIdBadge = ({ id }) => {
  return (
    <div className="flex text-sm items-center bg-amber-100 border border-amber-300 px-2 rounded-sm gap-1">
      <ShoppingBag height={12} width={12} className="text-amber-700" />
      <p className="text-amber-700">{id}</p>
    </div>
  );
};

export const ChatBadge = ({ id }) => {
  return (
    <div className="flex text-sm items-center bg-orange-100 border border-orange-300 px-2 rounded-sm gap-1">
      <IoChatboxEllipsesOutline
        height={12}
        width={12}
        className="text-orange-700"
      />
      <p className="text-orange-700">{id}</p>
    </div>
  );
};

export const GenderBadge = ({ gender }) => {
  return (
    <div
      className={`flex items-center rounded-full text-xs py-0.5 px-2 leading-tight capitalize ${
        gender === "male"
          ? "bg-blue-100 text-blue-900"
          : "bg-pink-100 text-pink-900"
      }`}
    >
      {gender === "male" ? (
        <CgGenderMale height={16} width={16} />
      ) : (
        <CgGenderFemale height={16} width={16} />
      )}
      {gender}
    </div>
  );
};

export const CategoryItemBadge = ({ category }) => {
  return (
    <div className="text-xs text-blue-500 bg-blue-100 border border-blue-200 px-2 py-0.5 rounded">
      {category}
    </div>
  );
};

export const StoreDetailBadge = ({ content, type }) => {
  return (
    <div
      className={`flex items-center gap-1 ${
        type === "store-name" ? "bg-amber-500" : "bg-amber-500/70"
      } text-white py-0.5 px-2 rounded-full`}
    >
      {type === "store-name" ? (
        <Store height={12} width={12} className="shrink-0" />
      ) : (
        <IoPerson height={12} width={12} className="shrink-0" />
      )}
      {content}
    </div>
  );
};

export const StoreDetailBadgeSmall = ({ content, type }) => {
  return (
    <div
      className={`flex items-center gap-1 text-xs ${
        type === "store-name" ? "bg-amber-500" : "bg-amber-500/70"
      } text-white py-0.5 px-2 rounded-full`}
    >
      {type === "store-name" ? (
        <Store height={12} width={12} className="shrink-0" />
      ) : (
        <IoPerson height={12} width={12} className="shrink-0" />
      )}
      {content}
    </div>
  );
};

export const VariantBadge = ({ id }) => {
  return (
    <div className="flex items-start">
      <div className="flex items-center bg-cyan-100 border border-cyan-300 px-2 rounded-sm gap-1">
        <ChartColumnStacked height={12} width={12} className="text-cyan-700" />
        <p className="text-cyan-700">{id}</p>
      </div>
    </div>
  );
};

export const ReviewsBadge = ({ id }) => {
  return (
    <div className="flex items-start">
      <div className="flex items-center bg-yellow-100 border border-yellow-300 px-2 rounded-sm gap-1">
        <Star height={12} width={12} className="text-yellow-700" />
        <p className="text-yellow-700">{id}</p>
      </div>
    </div>
  );
};

export const AttributeItemBadge = ({ label, className }) => {
  return (
    <div className={`${className} bg-purple-100 text-purple-500 leading-tight`}>
      {label}
    </div>
  );
};

export const OrderVariantAttributeBadege = ({ option, index, attributes }) => {
  const getColors = (attribute, value) => {
    const colorAttribute = attributes.find((item) => item.name === attribute);
    const optionItem = colorAttribute.options.find(
      (item) => item.label === value,
    );
    return optionItem;
  };
  return (
    <div className="flex items-center gap-1" key={index}>
      {option.attribute === "Color" ? (
        <>
          <div
            className={`text-gray-700 whitespace-nowrap leading-tight text-sm`}
          >
            {option.attribute}:
          </div>
          <div
            className={`px-2 py-0.5 rounded-sm text-[12px]`}
            style={{
              backgroundColor: getColors(option.attribute, option.value).hex,
              color: getColors(option.attribute, option.value).textColor,
            }}
          >
            {option.value}
          </div>
        </>
      ) : (
        <>
          <div
            className={`text-gray-700 whitespace-nowrap leading-tight text-sm`}
          >
            {option.attribute}:
          </div>
          <AttributeItemBadge
            className={"px-2 py-0.5 rounded-sm text-[12px]"}
            label={option.value}
          />
        </>
      )}
    </div>
  );
};

export const ItemStatusBadge = ({ statusId }) => {
  const { getAllItemStatus } = useData();
  const statusItem = getAllItemStatus().find((item) => item._id === statusId);

  const badgeStyle = {
    active: {
      bg: "bg-green-100",
      text: "text-green-700",
      border: "border border-green-300",
    },
    inactive: {
      bg: "bg-red-100",
      text: "text-red-700",
      border: "border border-red-300",
    },
  };

  const badge = badgeStyle[statusItem?.slug] || {
    bg: "bg-gray-100",
    text: "text-gray-800",
    border: "border-gray-300",
  };

  return (
    <div className="flex items-center">
      <div
        className={`px-2 rounded-sm text-xs font-medium ${badge.bg} ${badge.text} ${badge.border}`}
      >
        {statusItem?.name}
      </div>
    </div>
  );
};

export const OrderIdBadge = ({ id }) => {
  return (
    <div className="flex items-center bg-yellow-100 border border-yellow-300 px-2 rounded-sm gap-1">
      <Package height={12} width={12} className="text-yellow-700" />
      <p className="text-yellow-700">{id}</p>
    </div>
  );
};

export const PersonIdBadge = ({ id }) => {
  return (
    <div className="flex items-center bg-purple-100 border border-purple-300 px-2 rounded-sm gap-1">
      <IoPerson height={12} width={12} className="text-purple-700" />
      <p className="text-purple-700">{id}</p>
    </div>
  );
};

export const AttributeOptionsBadge = ({ product }) => {
  const { getAllAttributes } = useData();
  const attributes = getAllAttributes();

  return (
    Array.isArray(product.attributes) &&
    product.attributes.length > 0 && (
      <div className="flex flex-col flex-wrap gap-2">
        {product.attributes.map((attrGroup, idx) => {
          const attrDef = attributes.find((a) => a._id === attrGroup._id);
          // console.log("attrDef", attrDef);
          const optionData = (attrGroup.options || [])
            .map((optId) => {
              if (!attrDef) return { label: optId, hex: null };

              const found = Array.isArray(attrDef.options)
                ? attrDef.options.find((o) =>
                    typeof o === "string" ? o === optId : o._id === optId,
                  )
                : null;

              if (!found) return { label: optId, hex: null };
              const label =
                typeof found === "string"
                  ? found
                  : found.display || found.label || found._id;
              const hex = typeof found === "object" ? found.hex : null;
              const textColor =
                typeof found === "object" ? found.textColor : null;
              const slug = typeof found === "object" ? found.slug : null;
              return { label, hex, textColor, slug };
            })
            .filter(Boolean);

          return (
            <div key={idx} className="flex flex-col items-start">
              {attrDef && (
                <div className="text-gray-700 whitespace-nowrap leading-tight text-sm">
                  {attrDef.name}:
                </div>
              )}
              <div className="flex flex-wrap gap-1">
                {optionData.map((data, i) => (
                  <div key={i} className="flex">
                    {attrDef.slug === "color" ? (
                      <div
                        className="text-xs px-2 py-1 rounded"
                        style={
                          attrDef && attrDef.slug === "color" && data.hex
                            ? {
                                backgroundColor: data.hex,
                                color: data.textColor,
                                ...(data.slug === "color-white"
                                  ? { border: "1px solid #888" }
                                  : {}),
                              }
                            : {}
                        }
                      >
                        {data.label}
                      </div>
                    ) : (
                      <AttributeItemBadge
                        className={"px-2 py-0.5"}
                        label={data.label}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    )
  );
};

export const SalesBadge = ({ amount }) => {
  return (
    <div className="flex items-start">
      <div className="flex gap-2 items-center font-semibold bg-green-700 text-lg text-white px-2 py-1 rounded-md w-full leading-tight">
        <div className="flex gap-1">
          <span className="text-[13px]">$</span>
          <span className="font-semibold text-[17px] leading-tight">
            {amountToDecimal(amount)}
          </span>
        </div>
        <TrendingUp height={16} width={16} />
      </div>
    </div>
  );
};

export const SalesBadgeMedium = ({ amount }) => {
  return (
    <div className="flex items-start">
      <div className="flex gap-2 items-center font-semibold bg-green-700/70 text-lg text-white px-2 py-1 rounded-md w-full leading-tight">
        <div className="flex gap-1">
          <span className="text-[13px]">$</span>
          <span className="font-semibold text-[17px] leading-tight">
            {amountToDecimal(amount)}
          </span>
        </div>
        <TrendingUp height={16} width={16} />
      </div>
    </div>
  );
};

export const SalesBadgeMediumPending = ({ amount }) => {
  return (
    <div className="flex items-start">
      <div className="flex gap-2 items-center font-semibold bg-amber-400/70 text-lg text-amber-700 px-2 py-1 rounded-md w-full leading-tight bg-">
        <div className="flex gap-1">
          <span className="text-[13px]">$</span>
          <span className="font-semibold text-[17px] leading-tight">
            {amountToDecimal(amount)}
          </span>
        </div>
        {/* <TrendingUp height={16} width={16} /> */}
      </div>
    </div>
  );
};

export const SalesBadgeMediumUnsuccessful = ({ amount }) => {
  return (
    <div className="flex items-start">
      <div className="flex gap-2 items-center font-semibold bg-red-400/70 text-lg text-red-700 px-2 py-1 rounded-md w-full leading-tight bg-">
        <div className="flex gap-1">
          <span className="text-[13px]">$</span>
          <span className="font-semibold text-[17px] leading-tight">
            {amountToDecimal(amount)}
          </span>
        </div>
        {/* <TrendingUp height={16} width={16} /> */}
      </div>
    </div>
  );
};

export const SalesBadgeSmall = ({ amount }) => {
  return (
    <div className="flex items-start">
      <div className="flex gap-2 items-center font-semibold bg-green-600 text-lg text-white px-2 py-1 rounded-md w-full leading-tight">
        <div className="flex gap-1">
          <span className="text-[11px] mt-px">$</span>
          <span className="font-semibold text-[14px] leading-tight">
            {amountToDecimal(amount)}
          </span>
        </div>
      </div>
    </div>
  );
};

export const ProductVariantAttributeBadge = ({ variant, attributes }) => {
  const _entries = Object.entries(variant.attributes || []);

  return _entries.map(([attributeId, optionId], index) => {
    const attrDef = attributes.find((item) => item._id === attributeId);
    const data = attrDef.options.find((item) => item._id === optionId);
    return (
      <div key={index} className="flex items-center">
        <p className="text-gray-700 whitespace-nowrap leading-tight text-sm">
          {attrDef.name}:&nbsp;
        </p>
        {attrDef.name !== "Color" ? (
          <AttributeItemBadge
            label={data.display}
            className={"px-2 py-0.5 rounded-sm text-[12px]"}
          />
        ) : (
          <span
            className="text-xs px-2 py-1 rounded"
            style={
              attrDef && attrDef.slug === "color" && data.hex
                ? {
                    backgroundColor: data.hex,
                    color: data.textColor,
                    ...(data.slug === "color-white"
                      ? { border: "1px solid #888" }
                      : {}),
                  }
                : {}
            }
          >
            {data.display}
          </span>
        )}
      </div>
    );
  });
};
