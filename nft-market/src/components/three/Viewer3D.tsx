import { Component, Suspense, lazy, useState } from "react";
import type { ErrorInfo, ReactNode } from "react";
import { Box, RotateCcw, X } from "lucide-react";
import Button from "../ui/Button";
import "../../styles/Viewer3D.css";

// three.js, React Three Fiber and Drei are large, so they load only when the
// visitor taps "View in 3D". Until then this is just an image.
const Scene = lazy(() => import("./Scene"));

const hasWebGL = () => {
  try {
    const c = document.createElement("canvas");

    return Boolean(window.WebGLRenderingContext && (c.getContext("webgl2") || c.getContext("webgl")));
  } catch {
    return false;
  }
};

interface BoundaryProps {
  children: ReactNode;
  onFail?: (message: string) => void;
}

interface BoundaryState {
  failed: boolean;
}

class Boundary extends Component<BoundaryProps, BoundaryState> {
  state: BoundaryState = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error: Error, _info: ErrorInfo) {
    console.error("3D viewer failed:", error);
    this.props.onFail?.(String(error?.message || error));
  }

  render() {
    return this.state.failed ? null : this.props.children;
  }
}

// Interactive 3D model with the artwork as fallback.
//   src: .glb url   poster: image shown first and whenever 3D is unavailable
interface Viewer3DProps {
  src: string;
  poster: string;
  alt: string;
  priority?: boolean; // true when the poster is the first thing on the page
}

export default function Viewer3D({ src, poster, alt, priority = false }: Viewer3DProps) {
  const [supported] = useState(hasWebGL);
  const [active, setActive] = useState(false);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const [lite, setLite] = useState(false); // simpler lighting, tried once after a failure
  const [detail, setDetail] = useState("");
  const [view, setView] = useState(0);

  const close = () => {
    setActive(false);
    setReady(false);
  };

  const open = () => {
    setFailed(false);
    setLite(false);
    setDetail("");
    setView((v) => v + 1);
    setActive(true);
  };

  // First failure: try again with simple lighting. Second failure: give up and
  // show the image, with the reason.
  const fail = (message: string) => {
    if (!lite) {
      setLite(true);
      setView((v) => v + 1);
    } else {
      setDetail(String(message || "").slice(0, 160));
      setFailed(true);
    }
  };

  return (
    <div className={`v3${ready ? " ready" : ""}`}>
      <img
        className="v3-poster"
        src={poster}
        alt={alt}
        width="928"
        height="1152"
        decoding="async"
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : undefined}
      />

      {active && !failed && (
        <Boundary key={view} onFail={fail}>
          <Suspense
            fallback={
              <div className="v3-status" role="status">
                Loading 3D viewer…
              </div>
            }
          >
            <Scene src={src} lite={lite} onReady={() => setReady(true)} onLost={() => fail("The graphics context was lost.")} />
          </Suspense>

          <div className="v3-bar">
            <Button size="sm" variant="ghost" icon aria-label="Reset view" onClick={() => setView((v) => v + 1)}>
              <RotateCcw size={15} aria-hidden="true" />
            </Button>
            <Button size="sm" variant="ghost" icon aria-label="Close 3D view" onClick={close}>
              <X size={15} aria-hidden="true" />
            </Button>
          </div>

          {ready && <p className="v3-hint">Drag to rotate · Pinch or scroll to zoom</p>}
        </Boundary>
      )}

      {!active && (
        <div className="v3-start">
          <Button onClick={open} disabled={!supported}>
            <Box size={15} aria-hidden="true" /> View in 3D
          </Button>
          {!supported && <p className="v3-note">3D is not supported on this device.</p>}
        </div>
      )}

      {failed && (
        <p className="v3-note v3-fail" role="alert">
          The 3D view could not be loaded. Showing the image instead.
          {detail && <small>Reason: {detail}</small>}
          <button type="button" className="mt-0 text-acc underline underline-offset-[3px]" onClick={open}>Try again</button>
        </p>
      )}
    </div>
  );
}
