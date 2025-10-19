"use client";

import { motion } from "framer-motion";
import { Mic, MicOff } from "lucide-react";

export function AudioVisualizer({ isRecording, level = 0 }) {
  const bars = Array.from({ length: 5 }, (_, i) => i);

  return (
    <div className="flex flex-col items-center gap-6">
      <motion.div
        animate={{
          scale: isRecording ? [1, 1.05, 1] : 1,
        }}
        transition={{
          duration: 1.5,
          repeat: isRecording ? Infinity : 0,
          ease: "easeInOut",
        }}
        className={`relative flex items-center justify-center w-32 h-32 rounded-full ${
          isRecording
            ? "bg-primary/20 border-2 border-primary"
            : "bg-muted border-2 border-muted-foreground/30"
        }`}
      >
        {isRecording && (
          <motion.div
            className="absolute inset-0 rounded-full bg-primary/30"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 0, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        )}
        <div
          className={`flex items-center justify-center w-20 h-20 rounded-full ${
            isRecording
              ? "bg-primary text-primary-foreground"
              : "bg-muted-foreground/20 text-muted-foreground"
          }`}
        >
          {isRecording ? (
            <Mic className="h-10 w-10" />
          ) : (
            <MicOff className="h-10 w-10" />
          )}
        </div>
      </motion.div>

      <div className="flex items-end gap-1 h-16">
        {bars.map((i) => (
          <motion.div
            key={i}
            className={`w-2 rounded-full ${
              isRecording ? "bg-primary" : "bg-muted-foreground/30"
            }`}
            animate={{
              height: isRecording
                ? [
                    `${20 + Math.random() * 40}%`,
                    `${40 + Math.random() * 60}%`,
                    `${20 + Math.random() * 40}%`,
                  ]
                : "20%",
            }}
            transition={{
              duration: 0.5 + Math.random() * 0.5,
              repeat: isRecording ? Infinity : 0,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      <p className="text-sm font-medium">
        {isRecording ? "Recording..." : "Ready to record"}
      </p>
    </div>
  );
}
