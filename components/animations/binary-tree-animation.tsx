"use client"

import { motion, AnimatePresence } from "framer-motion"

interface TreeNode {
  value: number
  id: string
  left: TreeNode | null
  right: TreeNode | null
}

interface BinaryTreeAnimationProps {
  root: TreeNode | null
}

export default function BinaryTreeAnimation({ root }: BinaryTreeAnimationProps) {
  const TreeNodeComponent = ({ node, x, y, level }: { node: TreeNode; x: number; y: number; level: number }) => {
    const leftChild = node.left ? (
      <>
        <line
          x1={x}
          y1={y + 20}
          x2={x - 120 / level}
          y2={y + 60}
          stroke="currentColor"
          strokeWidth="1"
          className="text-muted-foreground"
        />
        <TreeNodeComponent node={node.left} x={x - 120 / level} y={y + 80} level={level + 1} />
      </>
    ) : null

    const rightChild = node.right ? (
      <>
        <line
          x1={x}
          y1={y + 20}
          x2={x + 120 / level}
          y2={y + 60}
          stroke="currentColor"
          strokeWidth="1"
          className="text-muted-foreground"
        />
        <TreeNodeComponent node={node.right} x={x + 120 / level} y={y + 80} level={level + 1} />
      </>
    ) : null

    return (
      <>
        <circle cx={x} cy={y} r={20} className="fill-card stroke-primary stroke-2" />
        <text x={x} y={y} textAnchor="middle" dominantBaseline="middle" className="text-xs font-medium">
          {node.value}
        </text>
        {leftChild}
        {rightChild}
      </>
    )
  }

  return (
    <div className="border rounded-lg p-4 h-[400px] flex flex-col justify-start items-center overflow-auto bg-muted/30 relative">
      {!root && (
        <div className="text-muted-foreground absolute inset-0 flex items-center justify-center">Tree is empty</div>
      )}

      <svg width="100%" height="400" className="overflow-visible">
        <g transform="translate(0, 20)">
          <AnimatePresence>
            {root && (
              <motion.g
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <TreeNodeComponent node={root} x={200} y={20} level={1} />
              </motion.g>
            )}
          </AnimatePresence>
        </g>
      </svg>
    </div>
  )
}
