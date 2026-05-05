import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface LoadingScreenProps {
  onLoadingComplete: () => void;
}

export function LoadingScreen({ onLoadingComplete }: LoadingScreenProps) {
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    // Auto complete after 2.5 seconds
    const timer = setTimeout(() => {
      setIsComplete(true);
      setTimeout(onLoadingComplete, 600);
    }, 500);

    return () => clearTimeout(timer);
  }, [onLoadingComplete]);

  const dots = [
    { color: '#ef4444', delay: 0 },     // Red
    { color: '#eab308', delay: 0.1 },   // Yellow
    { color: '#22c55e', delay: 0.2 },   // Green
    { color: '#3b82f6', delay: 0.3 }    // Blue
  ];

  const bounceTransition = {
    duration: 0.6,
    repeat: Infinity,
    repeatType: "reverse" as const,
    ease: "easeInOut"
  };

  return (
    <AnimatePresence>
      {!isComplete && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ 
            duration: 0.75, 
            ease: "easeInOut" 
          }}
          className="fixed inset-0 z-[100] bg-background flex items-center justify-center"
        >
          <div className="flex items-center gap-3">
            {dots.map((dot, index) => (
              <motion.div
                key={index}
                initial={{ scale: 0 }}
                animate={{
                  scale: [0, 1, 1],
                  y: [0, -30, 0]
                }}
                transition={{
                  scale: {
                    duration: 0.4,
                    delay: dot.delay,
                    ease: "easeOut"
                  },
                  y: {
                    duration: 0.6,
                    delay: dot.delay + 0.3,
                    repeat: Infinity,
                    repeatType: "reverse" as const,
                    ease: "easeInOut"
                  }
                }}
                style={{
                  width: index === 2 ? '24px' : index === 3 ? '20px' : index === 1 ? '18px' : '14px',
                  height: index === 2 ? '24px' : index === 3 ? '20px' : index === 1 ? '18px' : '14px',
                  backgroundColor: dot.color,
                  borderRadius: '50%'
                }}
              />
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
