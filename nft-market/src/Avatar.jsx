export default function Avatar({ src, size = 28, flat = false }) {
  return (
    <span className={flat ? "face flat" : "face"} style={{ "--s": `${size}px` }} aria-hidden="true">
      <img src={src} alt="" loading="lazy" decoding="async" />
    </span>
  );
}
