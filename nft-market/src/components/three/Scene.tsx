
import { Suspense, useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import {
  Environment,
  Html,
  Lightformer,
  OrbitControls,
  useGLTF,
  useProgress,
} from "@react-three/drei";
import FittedModel from "./FittedModel";

// Colors come from the design tokens (styles/tokens.css), so no hex is repeated here.
const token = (name: string, fallback: string) =>
  getComputedStyle(document.documentElement).getPropertyValue(name).trim() || fallback;

const media = (query: string) =>
  window.matchMedia?.(query).matches ?? false;

interface SceneProps {
  src: string;
  lite: boolean;
  onReady?: () => void;
  onLost?: () => void;
}

function Loader() {
  const { progress } = useProgress();

  return (
    <Html center>
      <span className="v3-loader" role="status">
        Loading model {Math.round(progress)}%
      </span>
    </Html>
  );
}

export default function Scene({
  src,
  lite = false,
  onReady,
  onLost,
}: SceneProps) {
  const wrap = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);

  const [spin, setSpin] = useState(
    () => !media("(prefers-reduced-motion: reduce)")
  );

  const phone = media("(pointer: coarse)");

  // Stop rendering while the viewer is outside the viewport.
  useEffect(() => {
    const el = wrap.current;

    if (!el || !("IntersectionObserver" in window)) return;

    const io = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.05 }
    );

    io.observe(el);

    return () => io.disconnect();
  }, []);

  return (
    <div
      className="v3-canvas"
      ref={wrap}
      role="img"
      aria-label="Interactive 3D model. Drag to rotate, pinch or scroll to zoom."
    >
      <Canvas
        frameloop={visible ? "always" : "never"}
        dpr={phone ? [1, 1.5] : [1, 2]}
        camera={{
          position: [0, 0.35, 4.6],
          fov: 36,
        }}
        gl={{
          antialias: !phone,
          powerPreference: "high-performance",
          alpha: true,
        }}
        onCreated={({ gl }) =>
          gl.domElement.addEventListener(
            "webglcontextlost",
            (e) => {
              e.preventDefault();
              onLost?.();
            }
          )
        }
      >
        {/* Procedural lighting: no environment file download. */}
        {lite ? (
          <>
            <hemisphereLight
              args={[token("--color-text", "#ECEFE8"), token("--color-bg", "#090A09"), 1.1]}
            />
            <directionalLight
              position={[3, 4, 5]}
              intensity={2.2}
            />
            <directionalLight
              position={[-4, 2, -3]}
              intensity={1.6}
              color={token("--color-accent", "#C4F56A")}
            />
          </>
        ) : (
          <Environment resolution={256} frames={1}>
            <Lightformer
              form="rect"
              intensity={2.4}
              position={[0, 5, 4]}
              scale={[10, 3, 1]}
            />
            <Lightformer
              form="rect"
              intensity={1.6}
              color={token("--color-accent", "#C4F56A")}
              position={[-5, 1, -3]}
              scale={[6, 3, 1]}
            />
            <Lightformer
              form="rect"
              intensity={1.2}
              position={[5, 0, 2]}
              scale={[4, 4, 1]}
            />
          </Environment>
        )}

        <ambientLight intensity={0.35} />

        <Suspense fallback={<Loader />}>
          <FittedModel
            src={src}
            lite={lite}
            onReady={onReady}
          />
        </Suspense>

        <OrbitControls
          makeDefault
          enablePan={false}
          enableDamping
          minDistance={2.6}
          maxDistance={7}
          minPolarAngle={Math.PI * 0.2}
          maxPolarAngle={Math.PI * 0.62}
          autoRotate={spin}
          autoRotateSpeed={1.1}
          onStart={() => setSpin(false)}
        />
      </Canvas>
    </div>
  );
}

// Preload GLB when the user approaches the 3D viewer.
export const preloadModel = (src: string) =>
  useGLTF.preload(src, false);
