"use client"

import { motion, AnimatePresence } from "framer-motion"

interface QueueAnimationProps {
  items: string[]
}

export default function QueueAnimation({ items }: QueueAnimationProps) {
  return (
    <div className="border rounded-lg p-4 h-[400px] flex flex-col justify-center items-center overflow-hidden bg-muted/30 relative">
      {items.length === 0 && (
        <div className="text-muted-foreground absolute inset-0 flex items-center justify-center">Queue is empty</div>
      )}

      <div className="w-full flex items-center justify-start overflow-x-auto p-4">
        <AnimatePresence>
          {items.map((item, index) => (
            <motion.div
              key={`${item}-${index}`}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
              className={`min-w-[100px] p-3 border rounded mx-2 bg-card shadow-sm flex flex-col items-center justify-between ${
                index === 0 ? "border-primary border-2" : ""
              }`}
            >
              <span className="font-mono">{item}</span>
              {index === 0 && <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded mt-2">Front</span>}
              {index === items.length - 1 && (
                <span className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded mt-2">Rear</span>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {items.length > 0 && (
        <div className="w-full mt-8 flex justify-between px-4">
          <div className="text-sm text-muted-foreground">Front (Dequeue from here)</div>
          <div className="text-sm text-muted-foreground">Rear (Enqueue here)</div>
        </div>
      )}
    </div>
  )
}
