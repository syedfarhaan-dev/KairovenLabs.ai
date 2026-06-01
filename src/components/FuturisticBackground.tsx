import React, { useMemo } from 'react';
import { motion } from 'motion/react';

interface FuturisticBackgroundProps {
  primaryColor?: 'brand-cyan' | 'brand-purple' | 'brand-indigo';
  secondaryColor?: 'brand-cyan' | 'brand-purple' | 'brand-indigo';
  intensity?: 'low' | 'medium' | 'high';
}

export default function FuturisticBackground({
  primaryColor = 'brand-cyan',
  secondaryColor = 'brand-purple',
  intensity = 'medium'
}: FuturisticBackgroundProps) {
  
  const particles = useMemo(() => {
    const count = intensity === 'low' ? 8 : intensity === 'medium' ? 14 : 20;
    const colors = {
      'brand-cyan': 'rgba(6, 182, 212, 0.25)',
      'brand-purple': 'rgba(168, 85, 247, 0.25)',
      'brand-indigo': 'rgba(99, 102, 241, 0.25)',
    };

    return Array.from({ length: count }).map((_, i) => {
      const selectColorKey = i % 3 === 0 
        ? primaryColor 
        : i % 3 === 1 
          ? secondaryColor 
          : 'brand-indigo';

      const colorVal = colors[selectColorKey];

      return {
        id: i,
        size: Math.random() * 2 + 1, // 1px to 3px
        x: Math.random() * 100,
        y: Math.random() * 100,
        delay: Math.random() * 5,
        duration: 12 + Math.random() * 16,
        color: colorVal
      };
    });
  }, [primaryColor, secondaryColor, intensity]);

  const pBlobClass = primaryColor === 'brand-cyan' 
    ? 'bg-brand-cyan/5 border-brand-cyan/10' 
    : primaryColor === 'brand-purple'
      ? 'bg-brand-purple/5 border-brand-purple/10'
      : 'bg-brand-indigo/5 border-brand-indigo/10';

  const sBlobClass = secondaryColor === 'brand-cyan'
    ? 'bg-brand-cyan/5 border-brand-cyan/10' 
    : secondaryColor === 'brand-purple'
      ? 'bg-brand-purple/5 border-brand-purple/10'
      : 'bg-brand-indigo/5 border-brand-indigo/10';

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0">
      {/* Tech Grid mesh */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.012)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.012)_1px,transparent_1px)] bg-[size:64px_64px] opacity-70" />

      {/* Vignettes for soft dark blends */}
      <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-[#030303] to-transparent opacity-100" />
      <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#030303] to-transparent opacity-100" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_40%,#030303_100%)] opacity-40" />

      {/* Floating Animated Glow Blob 1 */}
      <motion.div
        animate={{
          x: [0, 40, -30, 0],
          y: [0, -50, 30, 0],
          scale: [1, 1.15, 0.9, 1],
        }}
        transition={{
          duration: 35,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className={`absolute top-[10%] left-[5%] w-[250px] h-[250px] md:w-[450px] md:h-[450px] rounded-full blur-[130px] opacity-70 ${pBlobClass}`}
      />

      {/* Floating Animated Glow Blob 2 */}
      <motion.div
        animate={{
          x: [0, -30, 40, 0],
          y: [0, 50, -40, 0],
          scale: [1, 0.9, 1.1, 1],
        }}
        transition={{
          duration: 40,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className={`absolute bottom-[10%] right-[5%] w-[250px] h-[250px] md:w-[450px] md:h-[450px] rounded-full blur-[135px] opacity-60 ${sBlobClass}`}
      />

      {/* Sweeping laser scanner effect */}
      <motion.div
        animate={{
          top: ['-10%', '110%']
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: 'linear',
        }}
        className="absolute left-0 right-0 h-[60px] bg-gradient-to-b from-transparent via-brand-cyan/[0.03] to-transparent blur-[2px] opacity-30 pointer-events-none"
      />

      {/* Floating active grid nodes */}
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            left: `${p.x}%`,
            top: `${p.y}%`,
            boxShadow: `0 0 5px ${p.color}`,
          }}
          animate={{
            y: [0, -25, 0],
            opacity: [0.1, 0.6, 0.1],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}
