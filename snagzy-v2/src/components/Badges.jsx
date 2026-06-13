import { useData } from "../context/DataContext";
import { ShoppingBag, Store, User, ChartColumnStacked } from "./SVG";

export const ProductIdBadge = ({ id }) => {
  return (
    <div className="flex items-center bg-amber-100 border border-amber-300 px-2 rounded-sm gap-1">
      <ShoppingBag height={12} width={12} className="text-amber-700" />
      <p className="text-amber-700">{id}</p>
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
        <User height={12} width={12} className="shrink-0" />
      )}
      {content}
    </div>
  );
};

export const VariantBadge = ({ id }) => {
  return (
    <div className="flex items-center bg-cyan-100 border border-cyan-300 px-2 rounded-sm gap-1">
      <ChartColumnStacked height={12} width={12} className="text-cyan-700" />
      <p className="text-cyan-700">{id}</p>
    </div>
  );
};

export const AttributeItemBadge = ({ label, className }) => {
  return (
    <div
      className={`${className} rounded-sm bg-purple-100 border border-purple-200 text-purple-500`}
    >
      {label}
    </div>
  );
};

export const ProductStatusBadge = ({ productStatusId }) => {
  const { getAllProductStatus } = useData();
  const statusItem = getAllProductStatus().find(
    (item) => item._id === productStatusId,
  );

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

  const badge = badgeStyle[statusItem.slug] || {
    bg: "bg-gray-100",
    text: "text-gray-800",
    border: "border-gray-300",
  };

  return (
    <div className="flex">
      <div
        className={`px-2 rounded-sm text-xs font-medium ${badge.bg} ${badge.text} ${badge.border}`}
      >
        {statusItem.name}
      </div>
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
                <div className="text-gray-700 whitespace-nowrap">
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
