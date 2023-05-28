export const Avatar = ({ src, alt, className, props }) => {
  return (
    <img
      className={`rounded-full w-10 h-10 object-cover ${className}`}
      src={src}
      alt={alt}
      {...props}
    />
  );
};
