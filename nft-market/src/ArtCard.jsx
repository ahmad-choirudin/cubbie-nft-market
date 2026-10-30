import { Heart } from "lucide-react";
import Avatar from "./Avatar";

export default function ArtCard({ item, onOpen, likes = null, liked = false, time = null, priceLabel = "Current Bid", children }) {
  const { name, img, owner, price } = item;
  const open = onOpen
    ? { onClick: onOpen, onKeyDown: (e) => e.key === "Enter" && onOpen(), role: "button", tabIndex: 0, "aria-label": `Open ${name}` }
    : {};
  return (
    <article className="mk-card">
      <div className="mk-shot" {...open}>
        {img ? <img src={img} alt={name} loading="lazy" decoding="async" /> : <div className="cr-blank" />}
        {likes !== null && <span className="mk-like"><Heart size={11} fill={liked ? "currentColor" : "none"} /> {likes}</span>}
        {time && <span className="mk-time">{time}</span>}
      </div>
      <div className="mk-title">{name}</div>
      <div className="mk-meta">
        <div className="mk-by">{img && <Avatar src={img} size={26} flat={!!item.mine} />}<div><small>Creator</small>{owner}</div></div>
        <div className="mk-price"><small>{priceLabel}</small>{price} ETH</div>
      </div>
      {children && <div className="mk-act">{children}</div>}
    </article>
  );
}
