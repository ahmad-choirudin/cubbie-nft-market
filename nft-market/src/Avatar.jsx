export default function Avatar({ src, size = 28 }) {
  return (
    <span className="face" style={{ "--s": `${size}px` }} aria-hidden="true">
      <img src={src} alt="" loading="lazy" decoding="async" />
    </span>
  );
}
