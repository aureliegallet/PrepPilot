"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";

const steps = [
  { id: 1, name: "Upload" },
  { id: 2, name: "Interview" },
  { id: 3, name: "Feedback" },
];

export function StepIndicator({ currentStep }) {
  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center flex-1">
            <div className="flex flex-col items-center relative">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors ${
                  currentStep > step.id
                    ? "bg-primary border-primary text-primary-foreground"
                    : currentStep === step.id
                    ? "border-primary text-primary"
                    : "border-muted-foreground/30 text-muted-foreground"
                }`}
              >
                {currentStep > step.id ? (
                  <Check className="h-5 w-5" />
                ) : (
                  <span className="font-semibold">{step.id}</span>
                )}
              </motion.div>
              <motion.span
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 + 0.1 }}
                className={`mt-2 text-sm font-medium ${
                  currentStep >= step.id
                    ? "text-foreground"
                    : "text-muted-foreground"
                }`}
              >
                {step.name}
              </motion.span>
            </div>
            {index < steps.length - 1 && (
              <div className="flex-1 h-0.5 mx-4 relative top-[-12px]">
                <div className="h-full bg-muted-foreground/30" />
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: currentStep > step.id ? "100%" : "0%" }}
                  transition={{ duration: 0.3 }}
                  className="h-full bg-primary absolute top-0 left-0"
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
