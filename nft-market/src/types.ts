export type ItemId = number;

export type Trait =
  | string
  | {
      label?: string;
      trait_type?: string;
      name?: string;
      value?: string | number | null;
    };

export interface Edition {
  number: string | number | null;
  supply: string | number | null;
}

export interface BlockchainMetadata {
  enabled: boolean;
  chainId: number | null;
  contractAddress: string | null;
  tokenId: string | null;
}

export interface Collectible {
  id: ItemId;
  name: string;
  code?: string | null;
  slug?: string | null;
  category?: string | null;
  series?: string | null;
  rarity?: string | null;
  description?: string | null;
  lore?: string | null;
  poster?: string | null;
  img?: string | null;
  thumb?: string | null;
  glb?: string | null;
  traits?: Trait[];
  edition?: Edition | null;
  blockchain?: BlockchainMetadata;
  price?: number | string | null;
  likes?: number | null;
  owner?: string | null;
  mine?: boolean;
  soldOut?: boolean;
}

export type CollectibleCardItem = Pick<Collectible, "name"> & Partial<Omit<Collectible, "name">>;

export interface CatalogItem extends Collectible {
  code: string;
  slug: string;
  category: string | null;
  series: string | null;
  rarity: string | null;
  description: string | null;
  lore: string | null;
  poster: string;
  img: string;
  thumb: string | null;
  glb: string | null;
  traits: Trait[];
  edition: Edition;
  blockchain: BlockchainMetadata;
  price: number | null;
  likes: number | null;
  owner: string | null;
}

export interface Profile {
  name: string;
  since: string;
}

export type HistoryEventType =
  | "collect"
  | "wishlist"
  | "unwishlist"
  | "create"
  | "remove";

export interface HistoryEvent {
  type: HistoryEventType;
  itemId: ItemId;
  name: string;
  at: string;
}

export interface ToastState {
  msg: string;
  ok: boolean;
}

export type Page =
  | "home"
  | "discover"
  | "market"
  | "mycubbie"
  | "drop"
  | "lore"
  | "create"
  | "character"
  | "not found";

export interface WalletState {
  acc: string | null;
  bal: string | null;
  chain: string | null;
  balanceError: string | null;
  ethBalance: boolean;
  wrongChain: boolean;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
}

export type TransactionStage = "confirm" | "pending" | "confirmed";

export interface TransactionStatus {
  stage: TransactionStage;
  hash?: string;
}

export interface Eip1193Request {
  method: string;
  params?: unknown[] | Record<string, unknown>;
}

export interface Eip1193Provider {
  request<T = unknown>(args: Eip1193Request): Promise<T>;
  on?(event: "accountsChanged", listener: (accounts: string[]) => void): void;
  on?(event: "chainChanged", listener: (chainId: string) => void): void;
  removeListener?(event: "accountsChanged", listener: (accounts: string[]) => void): void;
  removeListener?(event: "chainChanged", listener: (chainId: string) => void): void;
}

declare global {
  interface Window {
    ethereum?: Eip1193Provider;
  }
}
