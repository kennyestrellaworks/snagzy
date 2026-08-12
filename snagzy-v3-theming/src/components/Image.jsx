// Image components using only Tailwind classes for sizing
const getRounded = (type) =>
  type === "square" ? "rounded-md" : type === "circle" ? "rounded-full" : "";

export const ImageDoubleExtraSmall = ({ image, alt, type }) => (
  <div className="flex mb-2 w-10 h-10 shrink-0">
    <img
      src={image}
      alt={alt}
      className={`w-full h-full object-cover ${getRounded(type)}`}
    />
  </div>
);

export const ImageExtraSmall = ({ image, alt, type }) => (
  <div className="flex mb-2 w-12 h-12 shrink-0">
    <img
      src={image}
      alt={alt}
      className={`w-full h-full object-cover ${getRounded(type)}`}
    />
  </div>
);

export const ImageSmall = ({ image, alt, type }) => (
  <div className="flex mb-2 w-14 h-14 shrink-0">
    <img
      src={image}
      alt={alt}
      className={`w-full h-full object-cover ${getRounded(type)}`}
    />
  </div>
);

export const ImageMedium = ({ image, alt, type }) => (
  <div className="flex mb-2 w-16 h-16 shrink-0">
    <img
      src={image}
      alt={alt}
      className={`w-full h-full object-cover ${getRounded(type)}`}
    />
  </div>
);

export const ImageLarge = ({ image, alt, type }) => (
  <div className="flex mb-2 w-18 h-18 shrink-0">
    <img
      src={image}
      alt={alt}
      className={`w-full h-full object-cover ${getRounded(type)} border border-gray-300`}
    />
  </div>
);

export const ImageExtraLarge = ({ image, alt, type }) => (
  <div className="flex mb-2 w-20 h-20 shrink-0">
    <img
      src={image}
      alt={alt}
      className={`w-full h-full object-cover ${getRounded(type)}`}
    />
  </div>
);

export const ImageDoubleExtraLarge = ({ image, alt, type }) => (
  <div className="flex mb-2 w-22 h-22 shrink-0">
    <img
      src={image}
      alt={alt}
      className={`w-full h-full object-cover ${getRounded(type)}`}
    />
  </div>
);
