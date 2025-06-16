"use client"

import { motion, AnimatePresence } from "framer-motion"
import { ArrowRight } from "lucide-react"

interface Node {
  value: string
  id: string
}

interface LinkedListAnimationProps {
  nodes: Node[]
}

export default function LinkedListAnimation({ nodes }: LinkedListAnimationProps) {
  return (
    <div className="border rounded-lg p-4 h-[400px] flex flex-col justify-center items-center overflow-hidden bg-muted/30 relative">
      {nodes.length === 0 && (
        <div className="text-muted-foreground absolute inset-0 flex items-center justify-center">
          Linked list is empty
        </div>
      )}

      <div className="w-full overflow-x-auto">
        <div className="flex items-center min-w-max p-4">
          <AnimatePresence>
            {nodes.map((node, index) => (
              <motion.div
                key={node.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3 }}
                className="flex items-center"
              >
                <div className="flex flex-col items-center">
                  <div className="w-20 h-20 border-2 rounded-lg flex items-center justify-center bg-card">
                    <span className="font-mono">{node.value}</span>
                  </div>
                  {index === 0 && <span className="text-xs mt-2">Head</span>}
                  {index === nodes.length - 1 && <span className="text-xs mt-2">Tail</span>}
                </div>

                {index < nodes.length - 1 && (
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: 40 }}
                    className="mx-2 flex items-center justify-center"
                  >
                    <div className="h-0.5 bg-primary flex-1"></div>
                    <ArrowRight className="h-4 w-4 text-primary" />
                  </motion.div>
                )}

                {index === nodes.length - 1 && (
                  <div className="ml-2 flex items-center">
                    <div className="h-0.5 w-8 bg-muted"></div>
                    <div className="border rounded px-2 py-1 text-xs text-muted-foreground">null</div>
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
