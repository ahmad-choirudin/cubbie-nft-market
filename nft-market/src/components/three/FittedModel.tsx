import { useEffect, useMemo } from "react";
import { useGLTF } from "@react-three/drei";
import {
  Box3,
  Group,
  Mesh,
  MeshStandardMaterial,
  Object3D,
  Vector3,
} from "three";

interface FittedModelProps {
  src: string;
  lite?: boolean;
  onReady?: () => void;
}

export default function FittedModel({
  src,
  lite = false,
  onReady,
}: FittedModelProps) {
  const { scene } = useGLTF(src, false) as { scene: Object3D };

  const fitted = useMemo(() => {
    const copy = scene.clone(true);
    const box = new Box3().setFromObject(copy);
    const size = box.getSize(new Vector3());
    const center = box.getCenter(new Vector3());
    const holder = new Group();

    copy.position.sub(center);
    holder.add(copy);
    holder.scale.setScalar(2 / Math.max(size.x, size.y, size.z, 0.0001));

    return holder;
  }, [scene]);

  useEffect(() => {
    if (!lite) return;

    fitted.traverse((object) => {
      if (!(object instanceof Mesh)) return;

      (Array.isArray(object.material) ? object.material : [object.material]).forEach(
        (material) => {
          if (material instanceof MeshStandardMaterial) {
            material.metalness = Math.min(material.metalness, 0.35);
          }
        }
      );
    });
  }, [lite, fitted]);

  useEffect(() => {
    onReady?.();
  }, [onReady]);

  return <primitive object={fitted} />;
}
