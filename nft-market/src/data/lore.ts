import theBeginning from "../assets/lore/the-beginning.webp";
import loreVisual from "../assets/lore/lore-visual.webp";
import ancientArtifact from "../assets/lore/ancient-artifact.webp";
import alienPlanet from "../assets/backgrounds/alien-planet.webp";
import cubbieWorld from "../assets/backgrounds/cubbie-world.webp";

// STORY. Chapter 01 is the official story, the same text as Cubbie Story on Cubbie World.
// Chapters marked `draft` were written from the artwork to give the Lore page a first
// version. Replace each one with the official chapter and remove its `draft` flag.

// The introduction reuses the wording already used on the Home page.
export const UNIVERSE = {
  title: "One universe. Infinite identities.",
  lede: "The Cubbie Universe is a world of characters, stories, and digital collectibles. Each Cubbie is a different way to be someone in the same universe.",
};

export const CHAPTERS: {
  id: string;
  title: string;
  image: string;
  alt: string;
  quote?: string;
  text: string;
  draft?: boolean;
}[] = [
  {
    id: "01",
    title: "The Beginning",
    image: theBeginning,
    alt: "A small Cubbie in a long coat stands in a corridor of black monoliths lit by green light",
    quote: "Every universe starts somewhere.",
    text: "Cubbie did not wake up knowing where it came from. It simply opened its eyes in a world that had forgotten its name. Somewhere beyond the darkness, a strange light was calling.",
  },
  {
    id: "02",
    title: "The Void",
    image: loreVisual,
    alt: "A dark monolith rising among floating shards",
    text: "Before the Gate, there was only the void: drifting shards, silent and unnamed. Nothing had a face yet.",
    draft: true,
  },
  {
    id: "03",
    title: "The Artifact",
    image: ancientArtifact,
    alt: "An ancient artifact glowing green on a pedestal",
    text: "Something ancient waited on its pedestal, humming with green light. It did not belong to any one world.",
    draft: true,
  },
  {
    id: "04",
    title: "The Planet",
    image: alienPlanet,
    alt: "A dark alien landscape cut by veins of green light",
    text: "Beyond the Gate lay a dark world cut by veins of green light. It was a place that asked to be explored.",
    draft: true,
  },
  {
    id: "05",
    title: "The City",
    image: cubbieWorld,
    alt: "A dark futuristic city with glowing green lines",
    text: "Cubbie World grew from that ground: towers, roads and signals, a city built to hold every identity.",
    draft: true,
  },
];
