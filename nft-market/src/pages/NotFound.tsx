import Button from "../components/ui/Button";
import EmptyState from "../components/ui/EmptyState";

export default function NotFound() {
  return (
    <main className="mx-auto w-full max-w-[1320px] px-[clamp(16px,3vw,32px)] pb-24 pt-6 text-ink sm:pt-12">
      <EmptyState
        title="This page does not exist."
        description="The link may be old or mistyped. Try one of these instead."
      >
        <Button href="#">Back home</Button>
        <Button variant="ghost" href="#the-collection">Open the Collection</Button>
      </EmptyState>
    </main>
  );
}
