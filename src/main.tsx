import { createRoot } from "react-dom/client";
import { Canvas } from "@react-three/fiber";
import { Text } from "./Text";

createRoot(document.getElementById("root")!).render(
  <Canvas>
    <ambientLight />
    <pointLight position={[10, 10, 10]} />
    <Text
      position={[0, 0, 0]}
      font="IBM Plex Mono"
      letterSpacing={0.5}
      color={"black"}
    >
      Hello world!
    </Text>
  </Canvas>
);
