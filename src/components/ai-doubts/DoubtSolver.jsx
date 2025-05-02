import { useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Html } from "@react-three/drei";
import { motion, AnimatePresence } from "framer-motion";
import DoubtForm from "./DoubtForm";
import DoubtResponse from "./DoubtResponse";

export default function DoubtSolver() {
  const [chat, setChat] = useState(null);

  // 3D Scene Configuration
  const Scene = () => (
    <Canvas camera={{ position: [0, 0, 10], fov: 50 }}>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <OrbitControls enableZoom={false} />
      {/* Floating Knowledge Sphere */}
      <mesh position={[0, 0, -5]} scale={[2, 2, 2]}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial
          color="#4f46e5"
          transparent
          opacity={0.1}
          metalness={0.4}
          roughness={0.2}
        />
        <Html transform>
          <div className="text-4xl font-bold text-indigo-500 animate-pulse">
            ?
          </div>
        </Html>
      </mesh>
    </Canvas>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative mt-10 bg-white rounded-2xl shadow-xl overflow-hidden border border-indigo-100"
    >
      {/* 3D Background */}
      <div className="absolute inset-0 h-full w-full opacity-10 z-0">
        <Scene />
      </div>
      {/* Content */}
      <div className="relative z-10 bg-white/95 backdrop-blur-sm">
        <div className="p-6 border-b border-indigo-50">
          <motion.h2
            initial={{ x: -20 }}
            animate={{ x: 0 }}
            className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"
          >
            AI Doubt Solver
          </motion.h2>
          <p className="mt-2 text-indigo-500">
            Koi bhi sawaal poochho - Hum Aapko samjhayenge!
          </p>
        </div>
        <div className="p-6">
          <DoubtForm onAnswer={setChat} />
          <AnimatePresence>
            {chat && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <DoubtResponse chat={chat} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
