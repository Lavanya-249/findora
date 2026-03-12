import { useState } from "react";

export default function Filters({
  categories,
  category,
  onCategoryChange,
  minPrice,
  maxPrice,
  onMinPriceChange,
  onMaxPriceChange,
  minRating,
  onRatingChange,
}) {
  const [hovered, setHovered] = useState(null);

  return (
    <div>
      <h3>Category</h3>
      <button onClick={() => onCategoryChange("all")}>All</button>
      {categories.map((cat) => (
        <button key={cat} onClick={() => onCategoryChange(cat)}>
          {cat}
        </button>
      ))}

      <h3>Price</h3>
      <input
        type="number"
        placeholder="Min"
        value={minPrice}
        onChange={(e) =>
          onMinPriceChange(e.target.value === "" ? "" : Number(e.target.value))
        }
      />
      <input
        type="number"
        placeholder="Max"
        value={maxPrice}
        onChange={(e) =>
          onMaxPriceChange(e.target.value === "" ? "" : Number(e.target.value))
        }
      />

      <h3>Rating</h3>
      {[1, 2, 3, 4, 5].map((star) => (
        <button key={star} onClick={() => onRatingChange(star)}>
          {star}★
        </button>
      ))}
    </div>
  );
}