"use client"

import { motion, AnimatePresence } from "framer-motion"

interface StackAnimationProps {
  items: string[]
}

export default function StackAnimation({ items }: StackAnimationProps) {
  return (
    <div className="border rounded-lg p-4 h-[400px] flex flex-col-reverse justify-start items-center overflow-hidden bg-muted/30 relative">
      {items.length === 0 && (
        <div className="text-muted-foreground absolute inset-0 flex items-center justify-center">Stack is empty</div>
      )}

      <AnimatePresence>
        {items.map((item, index) => (
          <motion.div
            key={`${item}-${items.length - index - 1}`}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
            className={`w-full p-3 border rounded mb-2 bg-card shadow-sm flex items-center justify-between ${
              index === items.length - 1 ? "border-primary border-2" : ""
            }`}
          >
            <span className="font-mono">{item}</span>
            {index === items.length - 1 && (
              <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">Top</span>
            )}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
