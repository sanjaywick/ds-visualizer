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

interface RBNode {
  value: number
  id: string
  color: "red" | "black"
  left: RBNode | null
  right: RBNode | null
  parent: RBNode | null
}

interface AnimationStep {
  type: "insert" | "check" | "rotate" | "recolor" | "complete" | "violation"
  message: string
  highlightNodes: string[]
  violationNodes?: string[]
  rotationType?: "left" | "right"
  rotationNode?: string
  rule?: string
  ruleNumber?: number
  treeState?: RBNode | null
}

const RedBlackTreeVisualizer = () => {
  const [root, setRoot] = useState<RBNode | null>(null)
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
      }, 2500)
      return () => clearTimeout(timer)
    } else if (currentAnimationStep === animationSteps.length - 1 && isAnimating) {
      const timer = setTimeout(() => {
        // Update the final tree state
        if (animationSteps[currentAnimationStep]?.treeState) {
          setRoot(animationSteps[currentAnimationStep].treeState)
        }
        setIsAnimating(false)
        setAnimationSteps([])
        setCurrentAnimationStep(-1)
      }, 2500)
      return () => clearTimeout(timer)
    }
  }, [animationSteps, currentAnimationStep, isAnimating])

  const createNode = (value: number, color: "red" | "black" = "red"): RBNode => ({
    value,
    id: `node-${Date.now()}-${Math.random()}`,
    color,
    left: null,
    right: null,
    parent: null,
  })

  const rotateLeft = (node: RBNode, newRoot: RBNode): RBNode => {
    const rightChild = node.right!
    node.right = rightChild.left

    if (rightChild.left) {
      rightChild.left.parent = node
    }

    rightChild.parent = node.parent

    if (!node.parent) {
      newRoot = rightChild
    } else if (node === node.parent.left) {
      node.parent.left = rightChild
    } else {
      node.parent.right = rightChild
    }

    rightChild.left = node
    node.parent = rightChild

    return newRoot
  }

  const rotateRight = (node: RBNode, newRoot: RBNode): RBNode => {
    const leftChild = node.left!
    node.left = leftChild.right

    if (leftChild.right) {
      leftChild.right.parent = node
    }

    leftChild.parent = node.parent

    if (!node.parent) {
      newRoot = leftChild
    } else if (node === node.parent.right) {
      node.parent.right = leftChild
    } else {
      node.parent.left = leftChild
    }

    leftChild.right = node
    node.parent = leftChild

    return newRoot
  }

  const insertNode = (value: number): void => {
    // Reset animation state
    setAnimationSteps([])
    setCurrentAnimationStep(-1)
    setIsAnimating(true)

    const steps: AnimationStep[] = []
    let currentRoot = root ? cloneTree(root) : null

    // Create new node
    const newNode = createNode(value, "red")

    steps.push({
      type: "insert",
      message: `Inserting ${value} as a RED node`,
      highlightNodes: [],
      rule: "Rule 1: New nodes are always inserted as RED to minimize violations",
      ruleNumber: 1,
      treeState: currentRoot,
    })

    // If tree is empty
    if (!currentRoot) {
      newNode.color = "black"
      steps.push({
        type: "recolor",
        message: `Root node ${value} colored BLACK`,
        highlightNodes: [newNode.id],
        rule: "Rule 2: Root must always be BLACK",
        ruleNumber: 2,
        treeState: newNode,
      })

      steps.push({
        type: "complete",
        message: "Insertion complete. All Red-Black Tree properties satisfied.",
        highlightNodes: [newNode.id],
        rule: "Tree maintains all 5 Red-Black properties",
        treeState: newNode,
      })

      setAnimationSteps(steps)
      setCurrentAnimationStep(0)
      return
    }

    // Find insertion point and show the search process
    let current = currentRoot
    let parent: RBNode | null = null

    steps.push({
      type: "check",
      message: `Starting BST insertion for ${value}`,
      highlightNodes: [current.id],
      rule: "Rule: Red-Black tree maintains BST property during insertion",
      treeState: currentRoot,
    })

    while (current) {
      parent = current
      steps.push({
        type: "check",
        message: `Comparing ${value} with ${current.value}`,
        highlightNodes: [current.id],
        rule: `BST Rule: ${value} ${value < current.value ? "<" : ">"} ${current.value}, go ${value < current.value ? "left" : "right"}`,
        treeState: currentRoot,
      })

      if (value < current.value) {
        current = current.left
      } else if (value > current.value) {
        current = current.right
      } else {
        // Duplicate value
        steps.push({
          type: "complete",
          message: `Value ${value} already exists. No insertion needed.`,
          highlightNodes: [current.id],
          rule: "BST Rule: Duplicate values are not allowed",
          treeState: currentRoot,
        })

        setAnimationSteps(steps)
        setCurrentAnimationStep(0)
        return
      }
    }

    // Insert the new node and show the tree with new node
    newNode.parent = parent!
    if (value < parent!.value) {
      parent!.left = newNode
    } else {
      parent!.right = newNode
    }

    steps.push({
      type: "insert",
      message: `Inserted ${value} as ${parent!.value < value ? "right" : "left"} child of ${parent!.value}`,
      highlightNodes: [newNode.id, parent!.id],
      rule: "BST insertion complete. Now checking Red-Black properties.",
      treeState: cloneTree(currentRoot),
    })

    // Fix Red-Black tree violations with step-by-step tree updates
    currentRoot = fixRedBlackViolationsWithSteps(newNode, currentRoot, steps)

    steps.push({
      type: "complete",
      message: "Insertion complete. All Red-Black Tree properties satisfied.",
      highlightNodes: [],
      rule: "Final check: All 5 Red-Black properties are maintained",
      treeState: currentRoot,
    })

    setAnimationSteps(steps)
    setCurrentAnimationStep(0)
  }

  const fixRedBlackViolationsWithSteps = (node: RBNode, currentRoot: RBNode, steps: AnimationStep[]): RBNode => {
    let current = node

    while (current !== currentRoot && current.parent && current.parent.color === "red") {
      steps.push({
        type: "violation",
        message: `Red-Red violation detected: ${current.value} (RED) and parent ${current.parent.value} (RED)`,
        highlightNodes: [current.id, current.parent.id],
        violationNodes: [current.id, current.parent.id],
        rule: "Property 4 Violation: No two adjacent RED nodes allowed",
        ruleNumber: 4,
        treeState: cloneTree(currentRoot),
      })

      if (current.parent === current.parent.parent?.left) {
        // Parent is left child of grandparent
        const uncle = current.parent.parent.right

        steps.push({
          type: "check",
          message: `Checking uncle node: ${uncle ? `${uncle.value} (${uncle.color.toUpperCase()})` : "NULL (BLACK)"}`,
          highlightNodes: uncle
            ? [current.id, current.parent.id, current.parent.parent.id, uncle.id]
            : [current.id, current.parent.id, current.parent.parent.id],
          rule: "Case Analysis: Check uncle's color to determine fix strategy",
          treeState: cloneTree(currentRoot),
        })

        if (uncle && uncle.color === "red") {
          // Case 1: Uncle is red - Recoloring
          steps.push({
            type: "recolor",
            message: "Case 1: Uncle is RED - Recoloring parent, uncle, and grandparent",
            highlightNodes: [current.parent.id, uncle.id, current.parent.parent.id],
            rule: "Case 1 Fix: Recolor parent→BLACK, uncle→BLACK, grandparent→RED",
            treeState: cloneTree(currentRoot),
          })

          // Apply the recoloring
          current.parent.color = "black"
          uncle.color = "black"
          current.parent.parent.color = "red"

          // Show tree after recoloring
          steps.push({
            type: "recolor",
            message: "Recoloring complete. Tree updated.",
            highlightNodes: [current.parent.id, uncle.id, current.parent.parent.id],
            rule: "Colors changed: Parent and Uncle are now BLACK, Grandparent is RED",
            treeState: cloneTree(currentRoot),
          })

          current = current.parent.parent

          steps.push({
            type: "check",
            message: `Moved up to grandparent ${current.value}. Checking for new violations.`,
            highlightNodes: [current.id],
            rule: "After recoloring, check grandparent for new violations",
            treeState: cloneTree(currentRoot),
          })
        } else {
          // Case 2 & 3: Uncle is black
          if (current === current.parent.right) {
            // Case 2: Current is right child - Left rotation needed
            steps.push({
              type: "rotate",
              message: "Case 2: Current is right child of left parent - Left rotation on parent",
              highlightNodes: [current.id, current.parent.id],
              rotationType: "left",
              rotationNode: current.parent.id,
              rule: "Case 2 Fix: Left rotate parent to convert to Case 3",
              treeState: cloneTree(currentRoot),
            })

            current = current.parent
            currentRoot = rotateLeft(current, currentRoot)

            // Show tree after rotation
            steps.push({
              type: "rotate",
              message: "Left rotation complete. Tree structure updated.",
              highlightNodes: [current.id],
              rule: "Rotation applied. Now proceeding to Case 3.",
              treeState: cloneTree(currentRoot),
            })
          }

          // Case 3: Current is left child - Right rotation and recoloring
          steps.push({
            type: "rotate",
            message: "Case 3: Right rotation on grandparent and recolor",
            highlightNodes: [current.id, current.parent!.id, current.parent!.parent!.id],
            rotationType: "right",
            rotationNode: current.parent!.parent!.id,
            rule: "Case 3 Fix: Right rotate grandparent, swap colors of parent and grandparent",
            treeState: cloneTree(currentRoot),
          })

          // Apply rotation and recoloring
          current.parent!.color = "black"
          current.parent!.parent!.color = "red"
          currentRoot = rotateRight(current.parent!.parent!, currentRoot)

          // Show tree after rotation and recoloring
          steps.push({
            type: "rotate",
            message: "Right rotation and recoloring complete.",
            highlightNodes: [current.id, current.parent!.id],
            rule: "Case 3 complete: Structure and colors updated",
            treeState: cloneTree(currentRoot),
          })
        }
      } else {
        // Mirror cases - similar implementation with step-by-step updates
        const uncle = current.parent.parent?.left

        steps.push({
          type: "check",
          message: `Checking uncle node: ${uncle ? `${uncle.value} (${uncle.color.toUpperCase()})` : "NULL (BLACK)"}`,
          highlightNodes: uncle
            ? [current.id, current.parent.id, current.parent.parent!.id, uncle.id]
            : [current.id, current.parent.id, current.parent.parent!.id],
          rule: "Mirror Case Analysis: Check uncle's color to determine fix strategy",
          treeState: cloneTree(currentRoot),
        })

        if (uncle && uncle.color === "red") {
          // Mirror Case 1
          steps.push({
            type: "recolor",
            message: "Mirror Case 1: Uncle is RED - Recoloring parent, uncle, grandparent",
            highlightNodes: [current.parent.id, uncle.id, current.parent.parent!.id],
            rule: "Mirror Case 1 Fix: Recolor parent→BLACK, uncle→BLACK, grandparent→RED",
            treeState: cloneTree(currentRoot),
          })

          current.parent.color = "black"
          uncle.color = "black"
          current.parent.parent!.color = "red"

          steps.push({
            type: "recolor",
            message: "Mirror recoloring complete. Tree updated.",
            highlightNodes: [current.parent.id, uncle.id, current.parent.parent!.id],
            rule: "Colors changed: Parent and Uncle are now BLACK, Grandparent is RED",
            treeState: cloneTree(currentRoot),
          })

          current = current.parent.parent!

          steps.push({
            type: "check",
            message: `Moved up to grandparent ${current.value}. Checking for new violations.`,
            highlightNodes: [current.id],
            rule: "After recoloring, check grandparent for new violations",
            treeState: cloneTree(currentRoot),
          })
        } else {
          // Mirror Case 2 & 3
          if (current === current.parent.left) {
            // Mirror Case 2
            steps.push({
              type: "rotate",
              message: "Mirror Case 2: Current is left child of right parent - Right rotation on parent",
              highlightNodes: [current.id, current.parent.id],
              rotationType: "right",
              rotationNode: current.parent.id,
              rule: "Mirror Case 2 Fix: Right rotate parent to convert to Mirror Case 3",
              treeState: cloneTree(currentRoot),
            })

            current = current.parent
            currentRoot = rotateRight(current, currentRoot)

            steps.push({
              type: "rotate",
              message: "Right rotation complete. Tree structure updated.",
              highlightNodes: [current.id],
              rule: "Rotation applied. Now proceeding to Mirror Case 3.",
              treeState: cloneTree(currentRoot),
            })
          }

          // Mirror Case 3
          steps.push({
            type: "rotate",
            message: "Mirror Case 3: Left rotation on grandparent and recolor",
            highlightNodes: [current.id, current.parent!.id, current.parent!.parent!.id],
            rotationType: "left",
            rotationNode: current.parent!.parent!.id,
            rule: "Mirror Case 3 Fix: Left rotate grandparent, swap colors of parent and grandparent",
            treeState: cloneTree(currentRoot),
          })

          current.parent!.color = "black"
          current.parent!.parent!.color = "red"
          currentRoot = rotateLeft(current.parent!.parent!, currentRoot)

          steps.push({
            type: "rotate",
            message: "Left rotation and recoloring complete.",
            highlightNodes: [current.id, current.parent!.id],
            rule: "Mirror Case 3 complete: Structure and colors updated",
            treeState: cloneTree(currentRoot),
          })
        }
      }
    }

    // Ensure root is black
    if (currentRoot.color === "red") {
      steps.push({
        type: "recolor",
        message: "Ensuring root is BLACK",
        highlightNodes: [currentRoot.id],
        rule: "Property 2: Root must always be BLACK",
        ruleNumber: 2,
        treeState: cloneTree(currentRoot),
      })
      currentRoot.color = "black"

      steps.push({
        type: "recolor",
        message: "Root recolored to BLACK.",
        highlightNodes: [currentRoot.id],
        rule: "Root is now BLACK. Property 2 satisfied.",
        treeState: cloneTree(currentRoot),
      })
    }

    return currentRoot
  }

  // Add helper function to clone the tree for each step
  const cloneTree = (node: RBNode | null): RBNode | null => {
    if (!node) return null

    const cloned: RBNode = {
      value: node.value,
      id: node.id,
      color: node.color,
      left: null,
      right: null,
      parent: null,
    }

    cloned.left = cloneTree(node.left)
    cloned.right = cloneTree(node.right)

    if (cloned.left) cloned.left.parent = cloned
    if (cloned.right) cloned.right.parent = cloned

    return cloned
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

  const handleClear = () => {
    if (isAnimating) {
      setError("Please wait for the current operation to complete")
      return
    }

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

  // Calculate position for tree visualization
  const getNodePosition = (node: RBNode, x: number, y: number, level: number): { x: number; y: number } => {
    return { x, y }
  }

  const TreeNodeComponent = ({ node, x, y, level }: { node: RBNode; x: number; y: number; level: number }) => {
    const currentStep = animationSteps[currentAnimationStep]
    const isHighlighted = currentStep && currentStep.highlightNodes.includes(node.id)
    const isViolation = currentStep && currentStep.violationNodes?.includes(node.id)
    const isRotating = currentStep && currentStep.rotationNode === node.id

    const leftChild = node.left ? (
      <>
        <line
          x1={x}
          y1={y + 25}
          x2={x - 120 / level}
          y2={y + 80}
          stroke="currentColor"
          strokeWidth="2"
          className="text-muted-foreground"
        />
        <TreeNodeComponent node={node.left} x={x - 120 / level} y={y + 100} level={level + 1} />
      </>
    ) : null

    const rightChild = node.right ? (
      <>
        <line
          x1={x}
          y1={y + 25}
          x2={x + 120 / level}
          y2={y + 80}
          stroke="currentColor"
          strokeWidth="2"
          className="text-muted-foreground"
        />
        <TreeNodeComponent node={node.right} x={x + 120 / level} y={y + 100} level={level + 1} />
      </>
    ) : null

    return (
      <>
        <motion.g
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: 1,
            scale: isHighlighted || isViolation || isRotating ? 1.2 : 1,
            rotate: isRotating ? (currentStep.rotationType === "left" ? 15 : -15) : 0,
          }}
          exit={{ opacity: 0, scale: 0 }}
          transition={{ duration: 0.3 }}
        >
          <circle
            cx={x}
            cy={y}
            r={25}
            className={`${
              isViolation
                ? "fill-red-200 stroke-red-600 stroke-3 dark:fill-red-900/50"
                : isRotating
                  ? "fill-yellow-100 stroke-yellow-500 stroke-3 dark:fill-yellow-900/30"
                  : isHighlighted
                    ? "fill-blue-100 stroke-blue-500 stroke-3 dark:fill-blue-900/30"
                    : node.color === "red"
                      ? "fill-red-500 stroke-red-700 stroke-2"
                      : "fill-gray-800 stroke-gray-900 stroke-2 dark:fill-gray-200 dark:stroke-gray-100"
            }`}
          />
          <text
            x={x}
            y={y}
            textAnchor="middle"
            dominantBaseline="middle"
            className={`text-sm font-bold ${node.color === "red" ? "text-white" : "text-white dark:text-gray-800"}`}
          >
            {node.value}
          </text>
          <text
            x={x}
            y={y + 40}
            textAnchor="middle"
            dominantBaseline="middle"
            className={`text-xs font-medium ${
              node.color === "red" ? "text-red-600" : "text-gray-800 dark:text-gray-200"
            }`}
          >
            {node.color.toUpperCase()}
          </text>
          {isRotating && (
            <g>
              <circle
                cx={x}
                cy={y}
                r={35}
                className="fill-none stroke-yellow-500 stroke-2 stroke-dasharray-4"
                opacity={0.7}
              />
              <RotationArrow cx={x} cy={y} r={35} clockwise={currentStep.rotationType === "left"} />
            </g>
          )}
        </motion.g>
        {leftChild}
        {rightChild}
      </>
    )
  }

  const RotationArrow = ({ cx, cy, r, clockwise }: { cx: number; cy: number; r: number; clockwise: boolean }) => {
    const startAngle = clockwise ? Math.PI * 0.8 : Math.PI * 0.2
    const endAngle = clockwise ? Math.PI * 0.2 : Math.PI * 0.8

    const startX = cx + r * Math.cos(startAngle)
    const startY = cy + r * Math.sin(startAngle)
    const endX = cx + r * Math.cos(endAngle)
    const endY = cy + r * Math.sin(endAngle)

    const largeArcFlag = 0
    const sweepFlag = clockwise ? 1 : 0

    const pathData = `M ${startX} ${startY} A ${r} ${r} 0 ${largeArcFlag} ${sweepFlag} ${endX} ${endY}`

    const arrowSize = 8
    const arrowAngle1 = clockwise ? endAngle + Math.PI * 0.8 : endAngle - Math.PI * 0.8
    const arrowAngle2 = clockwise ? endAngle + Math.PI * 1.2 : endAngle - Math.PI * 1.2

    const arrowX1 = endX + arrowSize * Math.cos(arrowAngle1)
    const arrowY1 = endY + arrowSize * Math.sin(arrowAngle1)
    const arrowX2 = endX + arrowSize * Math.cos(arrowAngle2)
    const arrowY2 = endY + arrowSize * Math.sin(arrowAngle2)

    return (
      <g className="text-yellow-500">
        <path d={pathData} fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
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
            <h1 className="text-3xl font-bold">Red-Black Tree Visualizer</h1>
            <p className="text-muted-foreground">
              A self-balancing binary search tree with color-based balancing rules
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
                onClick={handleClear}
                variant="outline"
                className="w-full flex items-center gap-1"
                disabled={!root || isAnimating}
              >
                <Trash2 className="h-4 w-4" />
                Clear Tree
              </Button>

              {currentAnimationStep >= 0 && animationSteps[currentAnimationStep] && (
                <Alert variant={animationSteps[currentAnimationStep].type === "violation" ? "destructive" : "default"}>
                  <Info className="h-4 w-4" />
                  <AlertTitle>
                    {animationSteps[currentAnimationStep].ruleNumber &&
                      `Rule ${animationSteps[currentAnimationStep].ruleNumber}: `}
                    {animationSteps[currentAnimationStep].type === "insert" && "Insertion"}
                    {animationSteps[currentAnimationStep].type === "check" && "Checking"}
                    {animationSteps[currentAnimationStep].type === "violation" && "Violation Detected"}
                    {animationSteps[currentAnimationStep].type === "rotate" && "Rotation"}
                    {animationSteps[currentAnimationStep].type === "recolor" && "Recoloring"}
                    {animationSteps[currentAnimationStep].type === "complete" && "Complete"}
                  </AlertTitle>
                  <AlertDescription>
                    <div>{animationSteps[currentAnimationStep].message}</div>
                    {animationSteps[currentAnimationStep].rule && (
                      <div className="text-xs mt-1 opacity-80 font-medium">
                        {animationSteps[currentAnimationStep].rule}
                      </div>
                    )}
                  </AlertDescription>
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
              <CardDescription>Self-balancing tree with color properties</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg p-4 h-[400px] flex flex-col justify-start items-center overflow-auto visualization-bg relative">
                {!root && (
                  <div className="text-muted-foreground absolute inset-0 flex items-center justify-center">
                    Tree is empty
                  </div>
                )}

                <svg width="100%" height="400" className="overflow-visible">
                  <g transform="translate(0, 40)">
                    <AnimatePresence>
                      {(currentAnimationStep >= 0 && animationSteps[currentAnimationStep]?.treeState) || root ? (
                        <motion.g
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <TreeNodeComponent
                            node={
                              (currentAnimationStep >= 0 && animationSteps[currentAnimationStep]?.treeState) || root!
                            }
                            x={200}
                            y={40}
                            level={1}
                          />
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
            <CardTitle>Red-Black Tree Properties</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <h3 className="font-semibold">The 5 Red-Black Properties</h3>
                <ol className="list-decimal pl-5 space-y-2 text-sm text-muted-foreground">
                  <li>
                    <strong>Node Color:</strong> Every node is either red or black
                  </li>
                  <li>
                    <strong>Root Property:</strong> The root is always black
                  </li>
                  <li>
                    <strong>Leaf Property:</strong> All leaves (NIL nodes) are black
                  </li>
                  <li>
                    <strong>Red Property:</strong> If a node is red, both its children are black (no two red nodes are
                    adjacent)
                  </li>
                  <li>
                    <strong>Black Height:</strong> Every path from a node to its descendant leaves contains the same
                    number of black nodes
                  </li>
                </ol>
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold">Insertion Cases</h3>
                <div className="bg-muted p-3 rounded text-sm space-y-2">
                  <div>
                    <strong>Case 1:</strong> Uncle is RED → Recolor parent, uncle, grandparent
                  </div>
                  <div>
                    <strong>Case 2:</strong> Uncle is BLACK, current is right child → Left rotate parent
                  </div>
                  <div>
                    <strong>Case 3:</strong> Uncle is BLACK, current is left child → Right rotate grandparent + recolor
                  </div>
                  <div className="text-xs opacity-75">Mirror cases exist when parent is right child of grandparent</div>
                </div>
              </div>
            </div>

            <div className="mt-4 space-y-2">
              <h3 className="font-semibold">Time Complexity</h3>
              <div className="bg-muted p-3 rounded text-sm">
                <div className="grid grid-cols-2 gap-2">
                  <div>Search:</div>
                  <div>O(log n)</div>
                  <div>Insert:</div>
                  <div>O(log n)</div>
                  <div>Delete:</div>
                  <div>O(log n)</div>
                  <div>Height:</div>
                  <div>≤ 2 log(n + 1)</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default RedBlackTreeVisualizer
