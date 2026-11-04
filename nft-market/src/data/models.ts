import cubbieModel from "../assets/models/cubbie-main.glb?url";
import pedestal from "../assets/environments/collectible-pedestal.webp";

// A render of the model makes the best still image. Drop it in as
// assets/models/cubbie-main-poster.webp and it is picked up automatically;
// until then the pedestal image is shown before the 3D view is opened.
const posters = import.meta.glob<string>("../assets/models/*-poster.webp", { eager: true, import: "default" });

export const CUBBIE_MODEL = {
  url: cubbieModel,
  poster: Object.values(posters)[0] || pedestal,
};
