export const ProductNameNAttributes = ({
  productName,
  variant,
  attributes,
}) => {
  // console.log("attributes", attributes);
  const _entries = Object.entries(variant.attributes);
  let textToAppend = [];

  // console.log("_entries", _entries);

  _entries.map(([attributeId, optionId]) => {
    // console.log("attributeId", attributeId);
    const attributeName = attributes.find((item) => item._id === attributeId);
    const optionLabel = attributeName.options.find(
      (item) => item._id === optionId,
    );

    // console.log("attributeName", attributeName.name);
    // console.log("optionLabel", optionLabel.label);
    textToAppend.push(optionLabel.display);
  });

  return [productName, ...textToAppend.map((item) => item)].join(" | ");
};
