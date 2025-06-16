"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Info, Plus, Trash2, ChevronLeft } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"

interface TreeNode {
  value: number
  id: string
  left: TreeNode | null
  right: TreeNode | null
  height: number
  balanceFactor?: number
}

interface AnimationStep {
  currentNode: string | null
  message: string
  complete: boolean
  path: string[]
  comparison: string | null
  rotationType?: "LL" | "RR" | "LR" | "RL" | null
  rotationNode?: string | null
  highlightNodes?: string[]
  treeState?: TreeNode | null // Add this line
}

export default function AVLTreeVisualizer() {
  const [root, setRoot] = useState<TreeNode | null>(null)
  const [inputValue, setInputValue] = useState("")
  const [error, setError] = useState("")
  const [animationSteps, setAnimationSteps] = useState<AnimationStep[]>([])
  const [currentAnimationStep, setCurrentAnimationStep] = useState<number>(-1)
  const [isAnimating, setIsAnimating] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])

  useEffect(() => {
    if (animationSteps.length > 0 && currentAnimationStep < animationSteps.length - 1 && isAnimating) {
      const timer = setTimeout(() => {
        setCurrentAnimationStep((prev) => prev + 1)
      }, 1500)
      return () => clearTimeout(timer)
    } else if (currentAnimationStep === animationSteps.length - 1 && isAnimating) {
      // Update the root with the final tree state
      if (animationSteps[currentAnimationStep]?.treeState) {
        setRoot(animationSteps[currentAnimationStep].treeState)
      }

      const timer = setTimeout(() => {
        setIsAnimating(false)
        setAnimationSteps([])
        setCurrentAnimationStep(-1)
      }, 1500)
      return () => clearTimeout(timer)
    }
  }, [animationSteps, currentAnimationStep, isAnimating])

  const getHeight = (node: TreeNode | null): number => {
    if (node === null) return 0
    return node.height
  }

  const getBalanceFactor = (node: TreeNode | null): number => {
    if (node === null) return 0
    return getHeight(node.left) - getHeight(node.right)
  }

  const rightRotate = (y: TreeNode): TreeNode => {
    const x = y.left as TreeNode
    const T2 = x.right

    // Perform rotation
    x.right = y
    y.left = T2

    // Update heights
    y.height = Math.max(getHeight(y.left), getHeight(y.right)) + 1
    x.height = Math.max(getHeight(x.left), getHeight(x.right)) + 1

    // Return new root
    return x
  }

  const leftRotate = (x: TreeNode): TreeNode => {
    const y = x.right as TreeNode
    const T2 = y.left

    // Perform rotation
    y.left = x
    x.right = T2

    // Update heights
    x.height = Math.max(getHeight(x.left), getHeight(x.right)) + 1
    y.height = Math.max(getHeight(y.left), getHeight(y.right)) + 1

    // Return new root
    return y
  }

  // Update the insertNode function to clone and store tree state at each step
  const insertNode = (value: number): void => {
    const newNode: TreeNode = {
      value,
      id: `node-${Date.now()}`,
      left: null,
      right: null,
      height: 1,
    }

    // Reset animation state
    setAnimationSteps([])
    setCurrentAnimationStep(-1)
    setIsAnimating(true)

    if (!root) {
      const steps = [
        {
          currentNode: null,
          message: "Tree is empty. Setting new node as root.",
          complete: false,
          path: [],
          comparison: null,
          treeState: newNode,
        },
        {
          currentNode: newNode.id,
          message: "Insertion complete. Tree is balanced.",
          complete: true,
          path: [newNode.id],
          comparison: null,
          treeState: newNode,
        },
      ]

      setAnimationSteps(steps)
      setCurrentAnimationStep(0)

      // Set the root directly for empty tree case
      setTimeout(() => {
        setRoot(newNode)
      }, 1500)

      return
    }

    // For non-empty tree, collect animation steps during insertion
    const steps: AnimationStep[] = []
    const currentRoot = cloneAVLTree(root)
    const newRoot = insertWithAnimationSteps(currentRoot, newNode, steps, [])

    // Add final step
    steps.push({
      currentNode: null,
      message: "Insertion complete. Tree is balanced.",
      complete: true,
      path: [],
      comparison: null,
      treeState: newRoot,
    })

    setAnimationSteps(steps)
    setCurrentAnimationStep(0)
  }

  // Add helper function to clone AVL tree
  const cloneAVLTree = (node: TreeNode | null): TreeNode | null => {
    if (!node) return null

    const cloned: TreeNode = {
      value: node.value,
      id: node.id,
      left: null,
      right: null,
      height: node.height,
      balanceFactor: node.balanceFactor,
    }

    cloned.left = cloneAVLTree(node.left)
    cloned.right = cloneAVLTree(node.right)

    return cloned
  }

  // Update insertWithAnimation to insertWithAnimationSteps and store tree state
  const insertWithAnimationSteps = (
    node: TreeNode | null,
    newNode: TreeNode,
    steps: AnimationStep[],
    path: string[],
  ): TreeNode => {
    // Base case: If the tree is empty, return the new node
    if (node === null) {
      steps.push({
        currentNode: null,
        message: `Found insertion point. Adding node with value ${newNode.value}.`,
        complete: false,
        path: [...path],
        comparison: null,
        treeState: newNode,
      })
      return newNode
    }

    // Add step for comparing values
    steps.push({
      currentNode: node.id,
      message: `Comparing ${newNode.value} with ${node.value}`,
      complete: false,
      path: [...path, node.id],
      comparison: newNode.value < node.value ? "less" : "greater",
      treeState: cloneAVLTree(node),
    })

    // Recursively insert the new node
    if (newNode.value < node.value) {
      steps.push({
        currentNode: node.id,
        message: `${newNode.value} < ${node.value}, going to left subtree`,
        complete: false,
        path: [...path, node.id],
        comparison: "less",
        treeState: cloneAVLTree(node),
      })
      node.left = insertWithAnimationSteps(node.left, newNode, steps, [...path, node.id])
    } else if (newNode.value > node.value) {
      steps.push({
        currentNode: node.id,
        message: `${newNode.value} > ${node.value}, going to right subtree`,
        complete: false,
        path: [...path, node.id],
        comparison: "greater",
        treeState: cloneAVLTree(node),
      })
      node.right = insertWithAnimationSteps(node.right, newNode, steps, [...path, node.id])
    } else {
      // Duplicate value
      steps.push({
        currentNode: node.id,
        message: `Value ${newNode.value} already exists. Duplicates not allowed.`,
        complete: false,
        path: [...path, node.id],
        comparison: null,
        treeState: cloneAVLTree(node),
      })
      return node
    }

    // Update height
    node.height = Math.max(getHeight(node.left), getHeight(node.right)) + 1

    // Calculate balance factor
    const balance = getBalanceFactor(node)
    node.balanceFactor = balance

    steps.push({
      currentNode: node.id,
      message: `Checking balance at node ${node.value}. Balance factor: ${balance}`,
      complete: false,
      path: [...path, node.id],
      comparison: null,
      treeState: cloneAVLTree(node),
    })

    // Apply rotations with tree state updates
    if (balance > 1 && node.left && getBalanceFactor(node.left) >= 0) {
      steps.push({
        currentNode: node.id,
        message: `Left-Left case detected at node ${node.value}. Performing right rotation.`,
        complete: false,
        path: [...path, node.id],
        comparison: null,
        rotationType: "LL",
        rotationNode: node.id,
        highlightNodes: [node.id, node.left.id],
        treeState: cloneAVLTree(node),
      })

      const rotatedNode = rightRotate(node)

      steps.push({
        currentNode: rotatedNode.id,
        message: `Right rotation complete. New subtree root: ${rotatedNode.value}`,
        complete: false,
        path: [...path],
        comparison: null,
        treeState: cloneAVLTree(rotatedNode),
      })

      return rotatedNode
    }

    // Similar updates for other rotation cases...
    // (Apply the same pattern for RR, LR, RL cases)
    // Right Right Case
    if (balance < -1 && node.right && getBalanceFactor(node.right) <= 0) {
      steps.push({
        currentNode: node.id,
        message: `Right-Right case detected at node ${node.value}. Performing left rotation.`,
        complete: false,
        path: [...path, node.id],
        comparison: null,
        rotationType: "RR",
        rotationNode: node.id,
        highlightNodes: [node.id, node.right.id],
        treeState: cloneAVLTree(node),
      })

      const rotatedNode = leftRotate(node)

      steps.push({
        currentNode: rotatedNode.id,
        message: `Left rotation complete. New subtree root: ${rotatedNode.value}`,
        complete: false,
        path: [...path],
        comparison: null,
        treeState: cloneAVLTree(rotatedNode),
      })

      return rotatedNode
    }

    // Left Right Case
    if (balance > 1 && node.left && getBalanceFactor(node.left) < 0) {
      steps.push({
        currentNode: node.left.id,
        message: `Left-Right case detected. First performing left rotation on left child of ${node.value}.`,
        complete: false,
        path: [...path, node.id, node.left.id],
        comparison: null,
        rotationType: "LR",
        rotationNode: node.left.id,
        highlightNodes: [node.id, node.left.id, node.left.right ? node.left.right.id : ""],
        treeState: cloneAVLTree(node),
      })

      node.left = leftRotate(node.left)

      steps.push({
        currentNode: node.id,
        message: `Completing Left-Right case. Performing right rotation on node ${node.value}.`,
        complete: false,
        path: [...path, node.id],
        comparison: null,
        rotationType: "LL",
        rotationNode: node.id,
        highlightNodes: [node.id, node.left ? node.left.id : ""],
        treeState: cloneAVLTree(node),
      })

      const rotatedNode = rightRotate(node)

      steps.push({
        currentNode: rotatedNode.id,
        message: `Right rotation complete. New subtree root: ${rotatedNode.value}`,
        complete: false,
        path: [...path],
        comparison: null,
        treeState: cloneAVLTree(rotatedNode),
      })

      return rotatedNode
    }

    // Right Left Case
    if (balance < -1 && node.right && getBalanceFactor(node.right) > 0) {
      steps.push({
        currentNode: node.right.id,
        message: `Right-Left case detected. First performing right rotation on right child of ${node.value}.`,
        complete: false,
        path: [...path, node.id, node.right.id],
        comparison: null,
        rotationType: "RL",
        rotationNode: node.right.id,
        highlightNodes: [node.id, node.right.id, node.right.left ? node.right.left.id : ""],
        treeState: cloneAVLTree(node),
      })

      node.right = rightRotate(node.right)

      steps.push({
        currentNode: node.id,
        message: `Completing Right-Left case. Performing left rotation on node ${node.value}.`,
        complete: false,
        path: [...path, node.id],
        comparison: null,
        rotationType: "RR",
        rotationNode: node.id,
        highlightNodes: [node.id, node.right ? node.right.id : ""],
        treeState: cloneAVLTree(node),
      })

      const rotatedNode = leftRotate(node)

      steps.push({
        currentNode: rotatedNode.id,
        message: `Left rotation complete. New subtree root: ${rotatedNode.value}`,
        complete: false,
        path: [...path],
        comparison: null,
        treeState: cloneAVLTree(rotatedNode),
      })

      return rotatedNode
    }

    // No rotation needed
    return node
  }

  const handleInsert = () => {
    if (!inputValue.trim()) {
      setError("Please enter a value to insert")
      return
    }

    const value = Number.parseInt(inputValue)
    if (isNaN(value)) {
      setError("Please enter a valid number")
      return
    }

    if (isAnimating) {
      setError("Please wait for the current operation to complete")
      return
    }

    insertNode(value)
    setInputValue("")
    setError("")
  }

  const handleDelete = () => {
    setRoot(null)
    setError("")
    setAnimationSteps([])
    setCurrentAnimationStep(-1)
    setIsAnimating(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleInsert()
    }
  }

  const TreeNodeComponent = ({ node, x, y, level }: { node: TreeNode; x: number; y: number; level: number }) => {
    const currentStep = animationSteps[currentAnimationStep]
    const isHighlighted = currentStep && currentStep.currentNode === node.id
    const isInPath = currentStep && currentStep.path.includes(node.id)
    const isRotating = currentStep && currentStep.type === "rotate" && currentStep.rotationNode === node.id
    const isInRotation = currentStep && currentStep.type === "rotate" && currentStep.highlightNodes?.includes(node.id)

    // Calculate balance factor color
    let balanceFactorColor = "text-green-600 dark:text-green-400"
    if (node.balanceFactor && Math.abs(node.balanceFactor) > 1) {
      balanceFactorColor = "text-red-600 dark:text-red-400"
    } else if (node.balanceFactor && Math.abs(node.balanceFactor) === 1) {
      balanceFactorColor = "text-yellow-600 dark:text-yellow-400"
    }

    const leftChild = node.left ? (
      <>
        <line
          x1={x}
          y1={y + 20}
          x2={x - 120 / level}
          y2={y + 60}
          stroke="currentColor"
          strokeWidth={
            isHighlighted || (isInRotation && node.left && currentStep.highlightNodes?.includes(node.left.id))
              ? "2"
              : "1"
          }
          className={
            isHighlighted || (isInRotation && node.left && currentStep.highlightNodes?.includes(node.left.id))
              ? "stroke-yellow-500"
              : "text-muted-foreground"
          }
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
          strokeWidth={
            isHighlighted || (isInRotation && node.right && currentStep.highlightNodes?.includes(node.right.id))
              ? "2"
              : "1"
          }
          className={
            isHighlighted || (isInRotation && node.right && currentStep.highlightNodes?.includes(node.right.id))
              ? "stroke-yellow-500"
              : "text-muted-foreground"
          }
        />
        <TreeNodeComponent node={node.right} x={x + 120 / level} y={y + 80} level={level + 1} />
      </>
    ) : null

    return (
      <>
        <motion.g
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0 }}
          transition={{ duration: 0.3 }}
        >
          <circle
            cx={x}
            cy={y}
            r={22}
            className={`${
              isRotating
                ? "fill-yellow-100 stroke-yellow-500 stroke-2 dark:fill-yellow-900/30"
                : isInRotation
                  ? "fill-orange-100 stroke-orange-500 stroke-2 dark:fill-orange-900/30"
                  : isHighlighted
                    ? "fill-yellow-100 stroke-yellow-500 stroke-2 dark:fill-yellow-900/30"
                    : isInPath
                      ? "fill-blue-50 stroke-blue-400 stroke-2 dark:fill-blue-900/30"
                      : "fill-card stroke-primary stroke-2"
            }`}
          />
          <text
            x={x}
            y={y - 5}
            textAnchor="middle"
            dominantBaseline="middle"
            className={`text-xs font-medium ${
              isRotating || isInRotation
                ? "text-yellow-700 dark:text-yellow-300"
                : isHighlighted
                  ? "text-yellow-700 dark:text-yellow-300"
                  : isInPath
                    ? "text-blue-700 dark:text-blue-300"
                    : ""
            }`}
          >
            {node.value}
          </text>
          <text
            x={x}
            y={y + 8}
            textAnchor="middle"
            dominantBaseline="middle"
            className={`text-[10px] ${balanceFactorColor}`}
          >
            {node.balanceFactor !== undefined ? `BF: ${node.balanceFactor}` : ""}
          </text>
          {isRotating && (
            <g>
              <circle
                cx={x}
                cy={y}
                r={28}
                className="fill-none stroke-yellow-500 stroke-2 stroke-dasharray-2"
                opacity={0.6}
              />
              <RotationArrow
                cx={x}
                cy={y}
                r={28}
                clockwise={currentStep.rotationType === "RR" || currentStep.rotationType === "RL"}
              />
            </g>
          )}
        </motion.g>
        {leftChild}
        {rightChild}
      </>
    )
  }

  const RotationArrow = ({ cx, cy, r, clockwise }: { cx: number; cy: number; r: number; clockwise: boolean }) => {
    // Create an arc path for the rotation arrow
    const startAngle = clockwise ? Math.PI * 0.8 : Math.PI * 0.2
    const endAngle = clockwise ? Math.PI * 0.2 : Math.PI * 0.8

    const startX = cx + r * Math.cos(startAngle)
    const startY = cy + r * Math.sin(startAngle)
    const endX = cx + r * Math.cos(endAngle)
    const endY = cy + r * Math.sin(endAngle)

    // Create an arc path
    const largeArcFlag = 0 // 0 for small arc, 1 for large arc
    const sweepFlag = clockwise ? 1 : 0 // 0 for counter-clockwise, 1 for clockwise

    const pathData = `
      M ${startX} ${startY}
      A ${r} ${r} 0 ${largeArcFlag} ${sweepFlag} ${endX} ${endY}
    `

    // Calculate the position for the arrowhead
    const arrowAngle = clockwise ? endAngle - 0.1 : endAngle + 0.1
    const arrowX = cx + r * Math.cos(arrowAngle)
    const arrowY = cy + r * Math.sin(arrowAngle)

    // Calculate points for the arrowhead
    const arrowSize = 6
    const arrowAngle1 = clockwise ? endAngle + Math.PI * 0.8 : endAngle - Math.PI * 0.8
    const arrowAngle2 = clockwise ? endAngle + Math.PI * 1.2 : endAngle - Math.PI * 1.2

    const arrowX1 = arrowX + arrowSize * Math.cos(arrowAngle1)
    const arrowY1 = arrowY + arrowSize * Math.sin(arrowAngle1)
    const arrowX2 = arrowX + arrowSize * Math.cos(arrowAngle2)
    const arrowY2 = arrowY + arrowSize * Math.sin(arrowAngle2)

    return (
      <g className="text-yellow-500">
        <path d={pathData} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <polygon points={`${endX},${endY} ${arrowX1},${arrowY1} ${arrowX2},${arrowY2}`} fill="currentColor" />
      </g>
    )
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <Link href="/binary-tree">
            <Button variant="ghost" size="sm" className="flex items-center gap-1">
              <ChevronLeft className="h-4 w-4" />
              Back to Tree Types
            </Button>
          </Link>
          <div className="text-center space-y-1 flex-1">
            <h1 className="text-3xl font-bold">AVL Tree Visualizer</h1>
            <p className="text-muted-foreground">
              A self-balancing binary search tree where the heights of child subtrees differ by at most one
            </p>
          </div>
          <div className="w-[100px]"></div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Operations</CardTitle>
              <CardDescription>Insert nodes and watch the tree balance itself</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex space-x-2">
                <Input
                  ref={inputRef}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Enter a number"
                  type="number"
                  className="flex-1"
                  disabled={isAnimating}
                />
                <Button onClick={handleInsert} className="flex items-center gap-1" disabled={isAnimating}>
                  <Plus className="h-4 w-4" />
                  Insert
                </Button>
              </div>

              <Button
                onClick={handleDelete}
                variant="outline"
                className="w-full flex items-center gap-1"
                disabled={!root || isAnimating}
              >
                <Trash2 className="h-4 w-4" />
                Clear Tree
              </Button>

              {currentAnimationStep >= 0 && animationSteps[currentAnimationStep] && (
                <Alert variant={animationSteps[currentAnimationStep].rotationType ? "warning" : "info"}>
                  <Info className="h-4 w-4" />
                  <AlertTitle>
                    {animationSteps[currentAnimationStep].comparison && "Comparison"}
                    {animationSteps[currentAnimationStep].rotationType && "Rotation"}
                    {animationSteps[currentAnimationStep].complete && "Complete"}
                  </AlertTitle>
                  <AlertDescription>{animationSteps[currentAnimationStep].message}</AlertDescription>
                </Alert>
              )}

              {error && (
                <Alert variant="destructive">
                  <Info className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Visualization</CardTitle>
              <CardDescription>Self-balancing tree with rotations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg p-4 h-[400px] flex flex-col justify-start items-center overflow-auto visualization-bg relative">
                {!root && (
                  <div className="text-muted-foreground absolute inset-0 flex items-center justify-center">
                    Tree is empty
                  </div>
                )}

                <svg width="100%" height="400" className="overflow-visible">
                  <g transform="translate(0, 20)">
                    <AnimatePresence>
                      {currentAnimationStep >= 0 && animationSteps[currentAnimationStep]?.treeState ? (
                        <motion.g
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <TreeNodeComponent
                            node={animationSteps[currentAnimationStep].treeState as TreeNode}
                            x={200}
                            y={20}
                            level={1}
                          />
                        </motion.g>
                      ) : root ? (
                        <motion.g
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <TreeNodeComponent node={root} x={200} y={20} level={1} />
                        </motion.g>
                      ) : null}
                    </AnimatePresence>
                  </g>
                </svg>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>AVL Tree Rotations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <h3 className="font-semibold">Balance Factor</h3>
                <p className="text-sm text-muted-foreground">
                  The balance factor of a node is the height of its left subtree minus the height of its right subtree.
                  A node is balanced if its balance factor is -1, 0, or 1.
                </p>
                <div className="bg-muted p-3 rounded text-sm">
                  <code>balanceFactor = height(leftSubtree) - height(rightSubtree)</code>
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    <div>BF &gt; 1:</div>
                    <div>Left subtree is taller</div>
                    <div>BF &lt; -1:</div>
                    <div>Right subtree is taller</div>
                    <div>BF = 0:</div>
                    <div>Perfectly balanced</div>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold">Rotation Types</h3>
                <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                  <li>
                    <strong>Left-Left Case (LL):</strong> Right rotation on the unbalanced node
                  </li>
                  <li>
                    <strong>Right-Right Case (RR):</strong> Left rotation on the unbalanced node
                  </li>
                  <li>
                    <strong>Left-Right Case (LR):</strong> Left rotation on the left child, then right rotation on the
                    unbalanced node
                  </li>
                  <li>
                    <strong>Right-Left Case (RL):</strong> Right rotation on the right child, then left rotation on the
                    unbalanced node
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
