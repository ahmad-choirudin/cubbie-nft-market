import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import type { RefObject } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { ContactShadows } from "@react-three/drei";
import type { Group, InstancedMesh, PointLight } from "three";
import { Object3D } from "three";
import FittedModel from "./FittedModel";

interface SceneProfile {
  mobile: boolean;
  tablet: boolean;
  reducedMotion: boolean;
}

interface PointerPosition {
  current: { x: number; y: number };
}

const readProfile = (): SceneProfile => {
  if (typeof window === "undefined") {
    return { mobile: false, tablet: false, reducedMotion: false };
  }

  return {
    mobile: window.matchMedia("(max-width: 560px)").matches,
    tablet: window.matchMedia("(max-width: 820px)").matches,
    reducedMotion: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  };
};

function FloatingIsland({
  position,
  scale,
  phase,
  mobile,
}: {
  position: [number, number, number];
  scale: number;
  phase: number;
  mobile: boolean;
}) {
  const island = useRef<Group>(null);

  useFrame(({ clock }) => {
    if (!island.current) return;
    island.current.position.y =
      position[1] + Math.sin(clock.elapsedTime * 0.32 + phase) * 0.09;
    island.current.rotation.y =
      Math.sin(clock.elapsedTime * 0.16 + phase) * 0.035;
  });

  return (
    <group ref={island} position={position} scale={scale}>
      <mesh position={[0, 0, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[1.18, 0.92, 0.24, 6]} />
        <meshStandardMaterial
          color="#171B18"
          metalness={0.78}
          roughness={0.68}
        />
      </mesh>
      <mesh position={[0, -0.39, 0]} rotation={[Math.PI, 0, 0]} castShadow>
        <coneGeometry args={[0.94, 0.68, 6]} />
        <meshStandardMaterial
          color="#101310"
          metalness={0.58}
          roughness={0.78}
        />
      </mesh>
      <mesh position={[0, 0.13, 0]}>
        <torusGeometry args={[1.08, 0.014, 4, mobile ? 20 : 32]} />
        <meshStandardMaterial
          color="#C4F56A"
          emissive="#C4F56A"
          emissiveIntensity={0.38}
          metalness={0.55}
          roughness={0.42}
        />
      </mesh>
      <mesh position={[0.18, 0.26, 0]}>
        <boxGeometry args={[0.3, 0.28, 0.3]} />
        <meshStandardMaterial
          color="#202521"
          metalness={0.7}
          roughness={0.65}
        />
      </mesh>
      <mesh position={[-0.32, 0.24, -0.12]} scale={[0.18, 0.22, 0.18]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial
          color="#202521"
          metalness={0.7}
          roughness={0.65}
        />
      </mesh>
    </group>
  );
}

function Portal({ mobile }: { mobile: boolean }) {
  const portal = useRef<Group>(null);

  useFrame(({ clock }, delta) => {
    if (!portal.current) return;
    portal.current.rotation.z += delta * 0.045;
    portal.current.rotation.y =
      Math.sin(clock.elapsedTime * 0.18) * 0.05;
  });

  return (
    <group ref={portal} rotation={[0.14, -0.22, 0]}>
      <mesh>
        <torusGeometry args={[0.94, 0.105, mobile ? 6 : 8, mobile ? 36 : 56]} />
        <meshStandardMaterial
          color="#262C27"
          metalness={0.92}
          roughness={0.34}
        />
      </mesh>
      <mesh>
        <torusGeometry args={[0.77, 0.018, 4, mobile ? 32 : 48]} />
        <meshStandardMaterial
          color="#C4F56A"
          emissive="#C4F56A"
          emissiveIntensity={0.32}
          metalness={0.35}
          roughness={0.4}
        />
      </mesh>
      <mesh position={[0, 0, -0.12]}>
        <circleGeometry args={[0.72, mobile ? 24 : 40]} />
        <meshBasicMaterial color="#121713" transparent opacity={0.62} />
      </mesh>
    </group>
  );
}

function EnergyCore({ light }: { light: RefObject<PointLight | null> }) {
  const core = useRef<Group>(null);

  useFrame(({ clock }) => {
    const pulse = 1 + Math.sin(clock.elapsedTime * 0.7) * 0.045;
    core.current?.scale.setScalar(pulse);
    if (light.current) {
      light.current.intensity = 0.8 + (pulse - 1) * 2.2;
    }
  });

  return (
    <group ref={core} position={[-1.55, 0.52, -2.35]} scale={0.48}>
      <mesh>
        <icosahedronGeometry args={[0.34, 0]} />
        <meshStandardMaterial
          color="#C4F56A"
          emissive="#8DB83E"
          emissiveIntensity={0.65}
          metalness={0.5}
          roughness={0.3}
        />
      </mesh>
      <mesh rotation={[0.35, 0.5, 0.2]}>
        <octahedronGeometry args={[0.47, 0]} />
        <meshBasicMaterial
          color="#C4F56A"
          wireframe
          transparent
          opacity={0.38}
        />
      </mesh>
    </group>
  );
}

function Crystal({
  position,
  scale,
  phase,
}: {
  position: [number, number, number];
  scale: number;
  phase: number;
}) {
  const crystal = useRef<Group>(null);

  useFrame(({ clock }) => {
    if (!crystal.current) return;
    crystal.current.position.y =
      position[1] + Math.sin(clock.elapsedTime * 0.46 + phase) * 0.08;
    crystal.current.rotation.y = clock.elapsedTime * 0.1 + phase;
    crystal.current.rotation.x = Math.sin(clock.elapsedTime * 0.2 + phase) * 0.08;
  });

  return (
    <group ref={crystal} position={position} scale={scale}>
      <mesh>
        <octahedronGeometry args={[0.2, 0]} />
        <meshStandardMaterial
          color="#77816F"
          emissive="#A7CB67"
          emissiveIntensity={0.12}
          metalness={0.78}
          roughness={0.24}
        />
      </mesh>
    </group>
  );
}

function AmbientParticles({
  pointer,
  count,
  reducedMotion,
}: {
  pointer: PointerPosition;
  count: number;
  reducedMotion: boolean;
}) {
  const particles = useRef<InstancedMesh>(null);
  const dummy = useMemo(() => new Object3D(), []);
  const seeds = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        x: ((i * 37) % 101) / 10 - 5,
        y: ((i * 53) % 61) / 10 - 3,
        z: -2 - ((i * 17) % 45) / 10,
        phase: i * 0.73,
        size: 0.012 + ((i * 11) % 8) / 1000,
      })),
    [count]
  );

  useFrame(({ clock }) => {
    if (!particles.current) return;
    const time = reducedMotion ? 0 : clock.elapsedTime;
    seeds.forEach((seed, index) => {
      dummy.position.set(
        seed.x + pointer.current.x * 0.06,
        seed.y +
          (reducedMotion
            ? 0
            : Math.sin(time * 0.18 + seed.phase) * 0.12),
        seed.z
      );
      dummy.scale.setScalar(seed.size);
      dummy.updateMatrix();
      particles.current?.setMatrixAt(index, dummy.matrix);
    });
    particles.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={particles} args={[undefined, undefined, count]}>
      <sphereGeometry args={[1, 5, 4]} />
      <meshBasicMaterial color="#C4F56A" transparent opacity={0.48} />
    </instancedMesh>
  );
}

function World({
  profile,
  pointer,
  accent,
  modelSrc,
}: {
  profile: SceneProfile;
  pointer: PointerPosition;
  accent: string;
  modelSrc: string;
}) {
  const cameraRig = useRef<Group>(null);
  const coreLight = useRef<PointLight>(null);
  const islandPositions: [number, number, number][] = profile.mobile
    ? [
        [-2.45, -1.55, -2.1],
      ]
    : profile.tablet
      ? [
          [-2.8, -1.55, -2.2],
          [2.75, -1.7, -2.8],
        ]
      : [
          [-2.85, -1.48, -2.4],
          [2.85, -1.68, -2.8],
          [-1.45, -2.25, -3.4],
        ];
  const crystalPositions: [number, number, number][] = profile.mobile
    ? [
          [2.05, 1.5, -2.6],
      ]
    : [
          [-2.25, 1.65, -2.5],
          [2.25, 1.85, -3],
      ];

  useFrame(({ clock }, delta) => {
    if (profile.reducedMotion || !cameraRig.current) return;
    const time = clock.elapsedTime;
    const factor = Math.min(1, delta * 1.3);
    cameraRig.current.position.x +=
      (pointer.current.x * 0.16 - cameraRig.current.position.x) * factor;
    cameraRig.current.position.y +=
      (Math.sin(time * 0.16) * 0.06 - pointer.current.y * 0.08 -
        cameraRig.current.position.y) *
      factor;
  });

  return (
    <>
      <fog attach="fog" args={["#090A09", 8, 18]} />
      <ambientLight intensity={0.72} color="#AAB3A4" />
      <directionalLight position={[-2, 4, 5]} intensity={1.55} color="#ECEFE8" />
      <pointLight ref={coreLight} position={[-1.55, 0.52, -2.35]} color={accent} intensity={0.7} distance={4} decay={2} />
      <pointLight position={[2.2, 1.5, 0.5]} color={accent} intensity={0.32} distance={4} decay={2} />

      <group ref={cameraRig}>
        <group position={[0, 0, -0.4]}>
          {islandPositions.map((position, index) => (
            <FloatingIsland
              key={position.join(",")}
              position={position}
              scale={profile.mobile ? 0.52 : index > 1 ? 0.52 : 0.62}
              phase={index * 1.7}
              mobile={profile.mobile}
            />
          ))}
          {!profile.mobile && (
            <group position={[1.8, 0.92, -2.7]} scale={0.7}>
              <Portal mobile={profile.tablet} />
            </group>
          )}
          <EnergyCore light={coreLight} />
          {crystalPositions.map((position, index) => (
            <Crystal
              key={position.join(",")}
              position={position}
              scale={index === 0 ? 1 : 0.72}
              phase={index * 1.2}
            />
          ))}
          <AmbientParticles
            pointer={pointer}
            count={profile.mobile ? 12 : profile.tablet ? 18 : 28}
            reducedMotion={profile.reducedMotion}
          />
          <CharacterStage
            modelSrc={modelSrc}
            pointer={pointer}
            reducedMotion={profile.reducedMotion}
            mobile={profile.mobile}
          />
        </group>
      </group>
    </>
  );
}

function CharacterStage({
  modelSrc,
  pointer,
  reducedMotion,
  mobile,
}: {
  modelSrc: string;
  pointer: PointerPosition;
  reducedMotion: boolean;
  mobile: boolean;
}) {
  const stage = useRef<Group>(null);

  useFrame(({ clock }) => {
    if (reducedMotion || !stage.current) return;
    const time = clock.elapsedTime;
    stage.current.position.y = Math.sin(time * 0.54) * 0.035;
    stage.current.rotation.y =
      Math.sin(time * 0.14) * 0.035 + pointer.current.x * 0.028;
    stage.current.rotation.x = pointer.current.y * 0.018;
  });

  return (
    <group ref={stage}>
      <mesh position={[0, -1.24, 0]} receiveShadow>
        <cylinderGeometry args={[0.92, 0.98, 0.14, 8]} />
        <meshStandardMaterial
          color="#171B18"
          metalness={0.78}
          roughness={0.46}
        />
      </mesh>
      <mesh position={[0, -1.16, 0]}>
        <torusGeometry args={[0.89, 0.014, 4, mobile ? 24 : 40]} />
        <meshStandardMaterial
          color="#C4F56A"
          emissive="#C4F56A"
          emissiveIntensity={0.28}
          metalness={0.48}
          roughness={0.38}
        />
      </mesh>
      <ContactShadows
        position={[0, -1.16, 0]}
        scale={2.8}
        opacity={0.32}
        blur={2.2}
        far={2.6}
        resolution={mobile ? 128 : 256}
        frames={1}
      />
      <group position={[0, 0.02, 0.18]} scale={1.12}>
        <Suspense fallback={null}>
          <FittedModel src={modelSrc} />
        </Suspense>
      </group>
    </group>
  );
}

export default function CubbieWorldScene({
  modelSrc,
  poster,
}: {
  modelSrc: string;
  poster: string;
}) {
  const container = useRef<HTMLDivElement>(null);
  const pointer = useRef({ x: 0, y: 0 });
  const [profile, setProfile] = useState(readProfile);
  const [visible, setVisible] = useState(true);
  const accent =
    getComputedStyle(document.documentElement)
      .getPropertyValue("--color-accent")
      .trim() || "#C4F56A";

  useEffect(() => {
    const queries = [
      window.matchMedia("(max-width: 560px)"),
      window.matchMedia("(max-width: 820px)"),
      window.matchMedia("(prefers-reduced-motion: reduce)"),
    ];
    const updateProfile = () => setProfile(readProfile());
    queries.forEach((query) => query.addEventListener("change", updateProfile));
    return () =>
      queries.forEach((query) =>
        query.removeEventListener("change", updateProfile)
      );
  }, []);

  useEffect(() => {
    if (profile.reducedMotion) return;
    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      pointer.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (event.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    return () => window.removeEventListener("pointermove", onPointerMove);
  }, [profile.reducedMotion]);

  useEffect(() => {
    const element = container.current;
    if (!element || !("IntersectionObserver" in window)) return;
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.01 }
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={container}
      className="cubbie-world-scene"
      aria-hidden="true"
    >
      <Canvas
        camera={{ position: [0, 0.06, 5.8], fov: 43 }}
        dpr={profile.mobile ? 1 : profile.tablet ? 1.15 : [1, 1.5]}
        frameloop={
          profile.reducedMotion ? "demand" : visible ? "always" : "never"
        }
        gl={{
          alpha: true,
          antialias: !profile.mobile,
          powerPreference: profile.mobile ? "low-power" : "default",
        }}
        fallback={
          <div className="cubbie-world-scene__fallback">
            <img src={poster} alt="" />
          </div>
        }
      >
        <World
          profile={profile}
          pointer={pointer}
          accent={accent}
          modelSrc={modelSrc}
        />
      </Canvas>
    </div>
  );
}
