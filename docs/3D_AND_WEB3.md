# 3D viewer and Web3

## 3D viewer
- `components/three/Viewer3D.tsx` shows an image first. Tapping **View in 3D** loads three.js, React Three Fiber 9 and Drei 10 (a separate chunk, about 1 MB) and the `.glb`.
- Fallbacks: no WebGL, a load error or a lost GPU context all leave the image in place with a message.
- Mobile: pixel ratio capped at 1.5, antialiasing off on touch screens, rendering paused while scrolled out of view, auto-rotate off with reduced motion.
- Lighting is procedural (Lightformers), so no HDR file is downloaded. The Draco decoder is not used because the model uses meshopt.
- Model: `src/assets/models/cubbie-main.glb` (about 744 KB). The model and its texture payload are packaged in this GLB. To shrink the file (run once, needs network):
  `npx @gltf-transform/cli webp src/assets/models/cubbie-main.glb src/assets/models/cubbie-main.glb --quality 90`
  Then open The Drop and check the 3D view still looks right.
- A still render for the fallback: save it as `src/assets/models/cubbie-main-poster.webp` (4:5).
- Per-character models: set `glb` on a character in `data/cubbie.ts`. Its page then shows the viewer instead of the plain image.

## Web3
- Optional. No wallet is needed to browse, wishlist or save a local collection.
- Any injected EVM wallet works (`window.ethereum`): MetaMask, Rabby, Coinbase Wallet and others.
- `hooks/useWallet.ts`: account, network, balance, `wrongChain`. `utils/web3.ts`: error messages, network switching, read-only `ownerOf`, `sendContractTx` (with stages confirm, pending, confirmed). `ethers` is loaded only when one of these runs.
- On-chain mode turns on only when both `VITE_CUBBIE_CONTRACT` and `VITE_CUBBIE_CHAIN_ID` are set (see `.env.example`). Add the real mint or purchase function to `CONTRACT_ABI` in `data/web3.ts`.
- Collection actions on the site are stored in this browser. They are never shown as on-chain transactions.
