export default function ProductCard({ product }) {
  return (
    <div className="card">
      <img src={product.image} alt={product.title} />
      <h4>{product.title}</h4>
      <p>₹ {product.price}</p>
      <p>⭐ {product.rating.rate}</p>
    </div>
  );
}