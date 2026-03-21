export function Price({
  value,
  originalValue,
  discountPercentage,
  large,
  className = "",
}) {
  const fmt = (v) => `$${Number(v).toFixed(2)}`;

  const hasDiscount =
    discountPercentage > 0 && originalValue && originalValue !== value;

  return (
    <span className={`price ${large ? "price--large" : ""} ${className}`}>
      {hasDiscount && (
        <span className="price__original">{fmt(originalValue)}</span>
      )}
      {fmt(value)}
      {hasDiscount && (
        <span className="price__discount">
          -{Math.round(discountPercentage)}%
        </span>
      )}
    </span>
  );
}
