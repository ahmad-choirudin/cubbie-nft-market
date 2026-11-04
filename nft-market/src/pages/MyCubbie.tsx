import { useState } from "react";
import { Eye, Heart, PackageCheck, Plus, Trash2, Wallet } from "lucide-react";
import ArtCard from "../components/marketplace/ArtCard";
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import EmptyState from "../components/ui/EmptyState";
import Input from "../components/ui/Input";
import useAction from "../hooks/useAction";
import { CHAIN_ID_HEX, CONTRACT_ADDRESS, ONCHAIN_ENABLED } from "../data/web3";
import { chainName } from "../utils/chains";
import { switchChain } from "../utils/web3";
import { DEMO_OWNERSHIP, ONCHAIN_NONE } from "../utils/ownership";
import { shortAddress } from "../utils/format";
import type { KeyboardEvent } from "react";
import type { Collectible, HistoryEvent, HistoryEventType, Profile, WalletState } from "../types";

const TABS = [
  ["collection", "My collectibles"],
  ["wishlist", "Wishlist"],
  ["archive", "Archive"],
] as const;
type CollectorTab = (typeof TABS)[number][0];

const EVENT: Record<HistoryEventType, { icon: typeof PackageCheck; text: (name: string) => string }> = {
  collect: { icon: PackageCheck, text: (n) => `Collected ${n} (demo)` },
  wishlist: { icon: Heart, text: (n) => `Added ${n} to your wishlist` },
  unwishlist: { icon: Heart, text: (n) => `Removed ${n} from your wishlist` },
  create: { icon: Plus, text: (n) => `Created ${n} (demo)` },
  remove: { icon: Trash2, text: (n) => `Removed ${n}` },
};

const when = (iso: string) => {
  const d = new Date(iso);

  return Number.isNaN(d.getTime()) ? "" : d.toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });
};

// My Cubbie: the collector dashboard. Everything here is stored in this
// browser. Ownership is simulated; nothing is verified on a blockchain.
interface MyCubbieProps {
  items: Collectible[];
  owned: number[];
  liked: number[];
  history: HistoryEvent[];
  profile: Profile;
  wallet: WalletState;
  onSaveName: (name: string) => void;
  onOpen: (item: Collectible) => void;
  onToggleLike: (id: number) => void;
  onConnect: () => void;
  onDisconnect: () => void;
  onClearHistory: () => void;
}

export default function MyCubbie({
  items,
  owned,
  liked,
  history,
  profile,
  wallet,
  onSaveName,
  onOpen,
  onToggleLike,
  onConnect,
  onDisconnect,
  onClearHistory,
}: MyCubbieProps) {
  const [tab, setTab] = useState<CollectorTab>("collection");
  const [draft, setDraft] = useState(profile.name);
  const [sw, runSwitch] = useAction();

  const mine = items.filter((i) => owned.includes(i.id) || i.mine === true);
  const saved = items.filter((i) => liked.includes(i.id));
  const createdCount = mine.filter((i) => i.mine).length;
  const collectedCount = mine.length - createdCount;

  const cover = mine[0];
  const name = profile.name.trim() || (wallet.acc ? shortAddress(wallet.acc) : "Collector");
  const sinceDate = new Date(profile.since);
  const since = Number.isNaN(sinceDate.getTime()) ? "today" : sinceDate.toLocaleDateString(undefined, { dateStyle: "long" });
  const catalogCount = items.filter((i) => !i.mine).length;
  const progress = catalogCount ? Math.min(100, Math.round((collectedCount / catalogCount) * 100)) : 0;

  const onTabKey = (e: KeyboardEvent<HTMLDivElement>) => {
    const i = TABS.findIndex(([k]) => k === tab);
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    e.preventDefault();
    const n = (i + (e.key === "ArrowRight" ? 1 : TABS.length - 1)) % TABS.length;
    setTab(TABS[n][0]);
    document.getElementById(`mc-tab-${TABS[n][0]}`)?.focus();
  };

  const counts: Record<CollectorTab, number> = { collection: mine.length, wishlist: saved.length, archive: history.length };

  return (
    <main className="mx-auto w-full max-w-[1320px] px-[clamp(16px,3vw,32px)] pb-24 pt-6 text-ink sm:pt-[clamp(24px,5vw,56px)]">
      <header className="mb-6">
        <p className="font-m text-t-xs font-medium uppercase tracking-[var(--tracking-wide)] text-dim">My Cubbie</p>
        <h1 className="display break-words text-t-4xl [text-wrap:balance]">{name}</h1>
      </header>

      <div className="grid gap-4 md:grid-cols-2 md:gap-5">
        {/* COLLECTOR PROFILE */}
        <section className="grid content-start gap-4 rounded-[var(--radius-md)] border border-edge bg-card p-4 text-ink shadow-[inset_0_1px_0_color-mix(in_srgb,var(--color-text)_4%,transparent)] sm:p-6" aria-labelledby="mc-profile">
          <h2 id="mc-profile" className="font-m text-t-xs font-medium uppercase tracking-[var(--tracking-wide)] text-dim">Collector profile</h2>

          <div className="flex items-center gap-4">
            <span className="grid size-16 shrink-0 place-items-center overflow-hidden rounded-full border border-strong bg-surface font-d text-t-xl font-bold text-acc [&_img]:h-full [&_img]:w-full [&_img]:scale-[1.4] [&_img]:object-cover [&_img]:[object-position:50%_12%]" aria-hidden="true">
              {cover ? <img src={cover.thumb || cover.img || ""} alt="" /> : name.slice(0, 1).toUpperCase()}
            </span>
            <div>
              <b className="block [overflow-wrap:anywhere] font-d text-t-lg font-semibold">{name}</b>
              <small className="mt-0.5 block text-t-xs text-dim">Collector since {since}</small>
            </div>
          </div>

          <form
            className="grid justify-items-start gap-3"
            onSubmit={(e) => {
              e.preventDefault();
              onSaveName(draft.trim().slice(0, 24));
            }}
          >
            <Input className="w-full" label="Display name" value={draft} onChange={(e) => setDraft(e.target.value)} maxLength={24} placeholder="Your name" hint="Shown only in this browser." />
            <Button type="submit" size="sm" variant="ghost" disabled={draft.trim() === profile.name}>Save name</Button>
          </form>

          <dl className="m-0 grid grid-cols-2 gap-2 border-t border-edge pt-4 sm:grid-cols-4">
            <div><dt className="text-t-xs text-dim">Collected (demo)</dt><dd className="mt-1 font-d text-t-xl font-semibold tabular-nums">{collectedCount}</dd></div>
            <div><dt className="text-t-xs text-dim">Created</dt><dd className="mt-1 font-d text-t-xl font-semibold tabular-nums">{createdCount}</dd></div>
            <div><dt className="text-t-xs text-dim">Wishlist</dt><dd className="mt-1 font-d text-t-xl font-semibold tabular-nums">{saved.length}</dd></div>
            <div><dt className="text-t-xs text-dim">Events</dt><dd className="mt-1 font-d text-t-xl font-semibold tabular-nums">{history.length}</dd></div>
          </dl>

          {catalogCount > 0 && (
            <div className="mt-4 grid gap-2" role="img" aria-label={`${collectedCount} of ${catalogCount} characters collected (demo)`}>
              <div className="h-1 overflow-hidden rounded-full bg-edge"><span className="block h-full bg-acc transition-[width] duration-[var(--dur-slow)] ease-[var(--ease)]" style={{ width: `${progress}%` }} /></div>
              <small className="font-m text-t-xs font-medium uppercase tracking-[var(--tracking-wide)] text-dim">{collectedCount} of {catalogCount} collected (demo)</small>
            </div>
          )}
        </section>

        {/* WALLET STATUS */}
        <section className="grid content-start justify-items-start gap-4 rounded-[var(--radius-md)] border border-edge bg-card p-4 text-ink shadow-[inset_0_1px_0_color-mix(in_srgb,var(--color-text)_4%,transparent)] sm:p-6" aria-labelledby="mc-wallet">
          <h2 id="mc-wallet" className="font-m text-t-xs font-medium uppercase tracking-[var(--tracking-wide)] text-dim">Wallet status</h2>

          <p className="m-0 flex items-center gap-2 font-d text-base font-semibold">
            <Wallet size={16} aria-hidden="true" />
            {wallet.acc ? "Connected" : "Not connected"}
            <Badge tone={wallet.acc ? "accent" : "neutral"} className="ml-2">{wallet.acc ? "EVM wallet" : "Optional"}</Badge>
          </p>

          {wallet.acc ? (
            <dl className="m-0 w-full border-t border-edge">
              <div className="flex justify-between gap-4 border-b border-edge py-3 text-sm"><dt className="text-dim">Address</dt><dd className="m-0 break-all text-right font-m text-t-xs">{wallet.acc}</dd></div>
              {chainName(wallet.chain) && <div className="flex justify-between gap-4 border-b border-edge py-3 text-sm"><dt className="text-dim">Network</dt><dd className="m-0 text-right font-medium">{chainName(wallet.chain)}</dd></div>}
              {wallet.ethBalance && <div className="flex justify-between gap-4 border-b border-edge py-3 text-sm"><dt className="text-dim">Balance</dt><dd className="m-0 text-right font-medium">{wallet.bal} ETH</dd></div>}
            </dl>
          ) : (
            <p className="text-sm leading-[1.5] text-dim">Connect only if you want to see your address and balance. Nothing here requires a wallet.</p>
          )}

          {wallet.balanceError && <p className="text-t-xs text-[var(--color-danger-text)]" role="status">{wallet.balanceError}</p>}

          {wallet.wrongChain && (
            <div className="grid justify-items-start gap-3 rounded-[var(--radius-sm)] border border-danger bg-[var(--color-danger-soft)] p-4 text-sm text-[var(--color-danger-text)]" role="alert">
              <p className="m-0">Your wallet is on the wrong network. This site expects {chainName(CHAIN_ID_HEX)}.</p>
              <Button className="justify-self-start" size="sm" loading={sw.status === "pending"} onClick={() => runSwitch(() => switchChain())}>
                Switch network
              </Button>
              {sw.error && <p className="text-t-xs text-[var(--color-danger-text)]">{sw.error}</p>}
            </div>
          )}

          <div className="grid gap-3 rounded-[var(--radius-sm)] border border-dashed border-strong p-4 text-sm leading-relaxed text-dim">
            <p className="m-0"><Badge className="mr-2">Simulated</Badge>{DEMO_OWNERSHIP}</p>
            <p className="m-0">
              <Badge className="mr-2">On-chain: 0</Badge>
              {ONCHAIN_ENABLED && CONTRACT_ADDRESS
                ? `Contract ${shortAddress(CONTRACT_ADDRESS)} on ${chainName(CHAIN_ID_HEX)}. Collecting on this site is still simulated: no transaction is sent.`
                : ONCHAIN_NONE}
            </p>
          </div>

          {wallet.acc ? (
            <Button className="justify-self-start" size="sm" variant="ghost" onClick={onDisconnect}>Disconnect</Button>
          ) : (
            <Button className="justify-self-start" size="sm" onClick={onConnect}>Connect Wallet</Button>
          )}
        </section>
      </div>

      {/* TABS */}
      <div className="mt-8 flex gap-5 overflow-x-auto border-b border-edge [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" role="tablist" aria-label="My Cubbie sections" onKeyDown={onTabKey}>
        {TABS.map(([k, label]) => (
          <button
            key={k}
            id={`mc-tab-${k}`}
            type="button"
            role="tab"
            aria-selected={tab === k}
            aria-controls={`mc-panel-${k}`}
            tabIndex={tab === k ? 0 : -1}
            className={`-mb-px min-h-[var(--tap)] flex-none border-b-2 px-0.5 font-b text-base transition-colors ${tab === k ? "border-acc text-ink" : "border-transparent text-dim hover:text-ink"}`}
            onClick={() => setTab(k)}
          >
            {label}
            <small className="ml-2 font-m text-t-xs">{counts[k]}</small>
          </button>
        ))}
      </div>

      <div id={`mc-panel-${tab}`} role="tabpanel" aria-labelledby={`mc-tab-${tab}`} className="mt-6">
        {tab === "collection" &&
          (mine.length === 0 ? (
            <EmptyState title="Your collection is empty." description="Open a character and tap Collect (demo) to add the first Cubbie. This is simulated and saved in this browser.">
              <Button href="#the-collection">Explore the Collection</Button>
              <Button variant="ghost" href="#the-drop">View the Drop</Button>
            </EmptyState>
          ) : (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
              {mine.map((item) => (
                <ArtCard key={item.id} item={item} priceLabel={item.mine ? "Your creation" : "Demo price"} onOpen={() => onOpen(item)}>
                  <Badge tone={item.mine ? "accent" : "neutral"}>{item.mine ? "Your creation" : "Demo ownership"}</Badge>
                  <button type="button" className="inline-flex min-h-[var(--tap)] items-center gap-1.5 bg-transparent px-2 text-sm text-dim transition-colors hover:text-ink" onClick={() => onOpen(item)}>
                    <Eye size={14} aria-hidden="true" /> View
                  </button>
                </ArtCard>
              ))}
            </div>
          ))}

        {tab === "wishlist" &&
          (saved.length === 0 ? (
            <EmptyState title="Your wishlist is empty." description="Tap the heart on any Cubbie to save it here. Your wishlist is saved in this browser.">
              <Button href="#the-collection">Browse the Collection</Button>
            </EmptyState>
          ) : (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
              {saved.map((item) => (
                <ArtCard
                  key={item.id}
                  item={item}
                  hideMeta
                  favorite
                  onToggleFavorite={() => onToggleLike(item.id)}
                  onOpen={() => onOpen(item)}
                />
              ))}
            </div>
          ))}

        {tab === "archive" &&
          (history.length === 0 ? (
            <EmptyState title="Nothing in the archive yet." description="Collecting, wishlisting and creating are recorded here, in this browser only." />
          ) : (
            <>
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <p className="m-0 text-sm leading-[1.5] text-dim">{history.length} events, newest first. Stored in this browser only.</p>
                <Button size="sm" variant="danger" onClick={onClearHistory}>
                  <Trash2 size={13} aria-hidden="true" /> Clear history
                </Button>
              </div>
              <ol className="m-0 grid list-none border-t border-edge p-0 md:[&_li]:grid-cols-[auto_minmax(0,1fr)_auto] md:[&_time]:col-auto">
                {history.map((e, n) => {
                  const kind = EVENT[e.type] || EVENT.collect;
                  const Icon = kind.icon;
                  const target = items.find((i) => i.id === e.itemId);

                  return (
                    <li key={`${e.at}-${n}`} className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-x-3 gap-y-1 border-b border-edge py-3 text-sm">
                      <Icon className="text-acc" size={15} aria-hidden="true" />
                      <span>
                        {target?.slug && !target.mine ? (
                          <a className="underline underline-offset-[3px] hover:text-acc" href={`#character/${target.slug}`}>{kind.text(e.name)}</a>
                        ) : (
                          kind.text(e.name)
                        )}
                      </span>
                      <time className="col-start-2 font-m text-t-xs text-dim md:col-auto" dateTime={e.at}>{when(e.at)}</time>
                    </li>
                  );
                })}
              </ol>
            </>
          ))}
      </div>

      <p className="mt-6 max-w-[62ch] text-sm leading-relaxed text-dim">{DEMO_OWNERSHIP}</p>
    </main>
  );
}
