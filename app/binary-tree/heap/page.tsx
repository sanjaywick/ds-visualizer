"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Info, Plus, Trash2, ChevronLeft, ArrowUp, ArrowDown } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

interface HeapNode {
  value: number
  id: string
  index: number
}

interface AnimationStep {
  type: "insert" | "heapify" | "swap" | "extract" | "complete" | "compare"
  message: string
  highlightIndices: number[]
  swapIndices?: [number, number]
  extractIndex?: number
  compareIndices?: [number, number]
  rule?: string
  heapState?: HeapNode[] // Add this line
}

export default function HeapVisualizer() {
  const [heap, setHeap] = useState<HeapNode[]>([])
  const [inputValue, setInputValue] = useState("")
  const [error, setError] = useState("")
  const [heapType, setHeapType] = useState<"min" | "max">("max")
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
      }, 2000)
      return () => clearTimeout(timer)
    } else if (currentAnimationStep === animationSteps.length - 1 && isAnimating) {
      const timer = setTimeout(() => {
        // Update the final heap state
        if (animationSteps[currentAnimationStep]?.heapState) {
          setHeap(animationSteps[currentAnimationStep].heapState!)
        }
        setIsAnimating(false)
        setAnimationSteps([])
        setCurrentAnimationStep(-1)
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [animationSteps, currentAnimationStep, isAnimating])

  const getParentIndex = (index: number): number => {
    return Math.floor((index - 1) / 2)
  }

  const getLeftChildIndex = (index: number): number => {
    return 2 * index + 1
  }

  const getRightChildIndex = (index: number): number => {
    return 2 * index + 2
  }

  const shouldSwap = (parentValue: number, childValue: number): boolean => {
    return heapType === "max" ? parentValue < childValue : parentValue > childValue
  }

  const insertNode = (value: number): void => {
    const newNode: HeapNode = {
      value,
      id: `node-${Date.now()}`,
      index: heap.length,
    }

    // Reset animation state
    setAnimationSteps([])
    setCurrentAnimationStep(-1)
    setIsAnimating(true)

    // Create a copy of the heap with the new node
    const newHeap = [...heap, newNode]

    // Collect animation steps
    const steps: AnimationStep[] = [
      {
        type: "insert",
        message: `Inserting ${value} at the end of the heap (index ${newHeap.length - 1})`,
        highlightIndices: [newHeap.length - 1],
        rule: "Rule: New elements are always inserted at the end to maintain complete binary tree property",
        heapState: [...newHeap],
      },
    ]

    // Heapify up with step-by-step heap states
    let currentIndex = newHeap.length - 1
    let parentIndex = getParentIndex(currentIndex)

    while (currentIndex > 0) {
      steps.push({
        type: "compare",
        message: `Comparing ${newHeap[currentIndex].value} (child) with ${newHeap[parentIndex].value} (parent)`,
        highlightIndices: [currentIndex, parentIndex],
        compareIndices: [currentIndex, parentIndex],
        rule: `Rule: In a ${heapType} heap, ${heapType === "max" ? "parent ≥ children" : "parent ≤ children"}`,
        heapState: [...newHeap],
      })

      if (shouldSwap(newHeap[parentIndex].value, newHeap[currentIndex].value)) {
        steps.push({
          type: "heapify",
          message: `${heapType === "max" ? "Max" : "Min"} heap property violated! ${newHeap[currentIndex].value} ${heapType === "max" ? ">" : "<"} ${newHeap[parentIndex].value}`,
          highlightIndices: [currentIndex, parentIndex],
          rule: `Rule: When heap property is violated, we must swap to restore the property`,
          heapState: [...newHeap],
        })

        steps.push({
          type: "swap",
          message: `Swapping ${newHeap[currentIndex].value} with ${newHeap[parentIndex].value}`,
          highlightIndices: [currentIndex, parentIndex],
          swapIndices: [currentIndex, parentIndex],
          rule: "Rule: Swap violating elements and continue checking upward",
          heapState: [...newHeap],
        })

        // Perform the swap
        const temp = newHeap[currentIndex]
        newHeap[currentIndex] = newHeap[parentIndex]
        newHeap[parentIndex] = temp

        // Update indices
        newHeap[currentIndex].index = currentIndex
        newHeap[parentIndex].index = parentIndex

        // Show heap after swap
        steps.push({
          type: "swap",
          message: `Swap complete. Heap updated.`,
          highlightIndices: [currentIndex, parentIndex],
          rule: "Heap structure updated after swap",
          heapState: [...newHeap],
        })

        // Move up
        currentIndex = parentIndex
        parentIndex = getParentIndex(currentIndex)
      } else {
        steps.push({
          type: "heapify",
          message: `Heap property satisfied: ${newHeap[parentIndex].value} ${heapType === "max" ? "≥" : "≤"} ${newHeap[currentIndex].value}`,
          highlightIndices: [currentIndex, parentIndex],
          rule: "Rule: When heap property is satisfied, heapify-up is complete",
          heapState: [...newHeap],
        })
        break
      }
    }

    if (currentIndex === 0) {
      steps.push({
        type: "heapify",
        message: `${newHeap[currentIndex].value} has reached the root position`,
        highlightIndices: [currentIndex],
        rule: "Rule: Root has no parent, so heapify-up stops here",
        heapState: [...newHeap],
      })
    }

    steps.push({
      type: "complete",
      message: `Insertion complete. Heap property restored. ${heapType === "max" ? "Maximum" : "Minimum"} element is at root.`,
      highlightIndices: [],
      rule: `Rule: ${heapType === "max" ? "Max" : "Min"} heap maintains ${heapType === "max" ? "largest" : "smallest"} element at root`,
      heapState: [...newHeap],
    })

    setAnimationSteps(steps)
    setCurrentAnimationStep(0)

    // Update the heap after all animations
    setTimeout(() => {
      setHeap(newHeap)
    }, steps.length * 2000)
  }

  const extractRoot = (): void => {
    if (heap.length === 0) {
      setError("Heap is empty! Cannot extract.")
      return
    }

    // Reset animation state
    setAnimationSteps([])
    setCurrentAnimationStep(-1)
    setIsAnimating(true)

    // Create a copy of the heap
    const newHeap = [...heap]

    // Collect animation steps
    const steps: AnimationStep[] = [
      {
        type: "extract",
        message: `Extracting root element: ${newHeap[0].value} (${heapType === "max" ? "maximum" : "minimum"} value)`,
        highlightIndices: [0],
        extractIndex: 0,
        rule: `Rule: Root always contains the ${heapType === "max" ? "maximum" : "minimum"} element in a ${heapType} heap`,
      },
    ]

    if (newHeap.length === 1) {
      steps.push({
        type: "complete",
        message: "Heap is now empty",
        highlightIndices: [],
        rule: "Rule: When only one element exists, extraction results in empty heap",
      })

      setAnimationSteps(steps)
      setCurrentAnimationStep(0)

      // Update the heap after all animations
      setTimeout(() => {
        setHeap([])
      }, steps.length * 2000)

      return
    }

    steps.push({
      type: "swap",
      message: `Replacing root with last element: ${newHeap[newHeap.length - 1].value}`,
      highlightIndices: [0, newHeap.length - 1],
      swapIndices: [0, newHeap.length - 1],
      rule: "Rule: Replace root with last element to maintain complete binary tree property",
    })

    // Swap root with last element - Fix the syntax error
    const temp = newHeap[0]
    newHeap[0] = newHeap[newHeap.length - 1]
    newHeap[newHeap.length - 1] = temp

    // Update indices
    newHeap[0].index = 0

    // Remove the last element (original root)
    newHeap.pop()

    steps.push({
      type: "heapify",
      message: `Removed extracted element. Now need to restore heap property by heapifying down.`,
      highlightIndices: [0],
      rule: "Rule: After replacement, heap property may be violated, so we heapify down from root",
    })

    // Heapify down
    let currentIndex = 0
    const heapSize = newHeap.length

    while (true) {
      let targetIndex = currentIndex
      const leftIndex = getLeftChildIndex(currentIndex)
      const rightIndex = getRightChildIndex(currentIndex)

      steps.push({
        type: "compare",
        message: `Checking children of node ${newHeap[currentIndex].value} at index ${currentIndex}`,
        highlightIndices: [currentIndex],
        rule: `Rule: Compare current node with its children to find ${heapType === "max" ? "largest" : "smallest"} value`,
      })

      // Check left child
      if (leftIndex < heapSize) {
        steps.push({
          type: "compare",
          message: `Comparing with left child: ${newHeap[currentIndex].value} vs ${newHeap[leftIndex].value}`,
          highlightIndices: [currentIndex, leftIndex],
          compareIndices: [currentIndex, leftIndex],
          rule: `Rule: Left child index = 2 * parent_index + 1 = ${leftIndex}`,
        })

        if (shouldSwap(newHeap[targetIndex].value, newHeap[leftIndex].value)) {
          steps.push({
            type: "heapify",
            message: `Left child ${newHeap[leftIndex].value} ${heapType === "max" ? ">" : "<"} current ${heapType === "max" ? "maximum" : "minimum"} ${newHeap[targetIndex].value}`,
            highlightIndices: [targetIndex, leftIndex],
            rule: `Rule: Left child violates ${heapType} heap property`,
          })
          targetIndex = leftIndex
        }
      }

      // Check right child
      if (rightIndex < heapSize) {
        steps.push({
          type: "compare",
          message: `Comparing with right child: ${newHeap[targetIndex].value} vs ${newHeap[rightIndex].value}`,
          highlightIndices: [targetIndex, rightIndex],
          compareIndices: [targetIndex, rightIndex],
          rule: `Rule: Right child index = 2 * parent_index + 2 = ${rightIndex}`,
        })

        if (shouldSwap(newHeap[targetIndex].value, newHeap[rightIndex].value)) {
          steps.push({
            type: "heapify",
            message: `Right child ${newHeap[rightIndex].value} ${heapType === "max" ? ">" : "<"} current ${heapType === "max" ? "maximum" : "minimum"} ${newHeap[targetIndex].value}`,
            highlightIndices: [targetIndex, rightIndex],
            rule: `Rule: Right child violates ${heapType} heap property`,
          })
          targetIndex = rightIndex
        }
      }

      // If no swap needed, break
      if (targetIndex === currentIndex) {
        steps.push({
          type: "heapify",
          message: `${newHeap[currentIndex].value} is in correct position. Heap property satisfied.`,
          highlightIndices: [currentIndex],
          rule: "Rule: When no child violates heap property, heapify-down is complete",
        })
        break
      }

      steps.push({
        type: "swap",
        message: `Swapping ${newHeap[currentIndex].value} with ${newHeap[targetIndex].value}`,
        highlightIndices: [currentIndex, targetIndex],
        swapIndices: [currentIndex, targetIndex],
        rule: "Rule: Swap with the child that violates heap property most",
      })

      // Swap - Fix the syntax error
      const temp = newHeap[currentIndex]
      newHeap[currentIndex] = newHeap[targetIndex]
      newHeap[targetIndex] = temp

      // Update indices
      newHeap[currentIndex].index = currentIndex
      newHeap[targetIndex].index = targetIndex

      // Move down
      currentIndex = targetIndex
    }

    steps.push({
      type: "complete",
      message: `Extraction complete. Heap property restored. New ${heapType === "max" ? "maximum" : "minimum"}: ${newHeap.length > 0 ? newHeap[0].value : "none"}`,
      highlightIndices: newHeap.length > 0 ? [0] : [],
      rule: `Rule: After heapify-down, ${heapType === "max" ? "maximum" : "minimum"} element is again at root`,
    })

    setAnimationSteps(steps)
    setCurrentAnimationStep(0)

    // Update the heap after all animations
    setTimeout(() => {
      setHeap(newHeap)
    }, steps.length * 2000)
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

  const handleExtract = () => {
    if (heap.length === 0) {
      setError("Heap is empty! Cannot extract.")
      return
    }

    if (isAnimating) {
      setError("Please wait for the current operation to complete")
      return
    }

    extractRoot()
    setError("")
  }

  const handleClear = () => {
    if (isAnimating) {
      setError("Please wait for the current operation to complete")
      return
    }

    setHeap([])
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

  const handleHeapTypeChange = (value: string) => {
    if (isAnimating) {
      setError("Cannot change heap type during animation")
      return
    }
    setHeapType(value as "min" | "max")
    setHeap([]) // Clear heap when changing type
    setError("")
  }

  // Calculate position for tree visualization
  const getNodePosition = (index: number, totalNodes: number) => {
    const level = Math.floor(Math.log2(index + 1))
    const maxNodesInLevel = Math.pow(2, level)
    const positionInLevel = index - (Math.pow(2, level) - 1)

    const levelWidth = 400
    const nodeSpacing = levelWidth / (maxNodesInLevel + 1)
    const x = nodeSpacing * (positionInLevel + 1)
    const y = 60 + level * 80

    return { x, y, level }
  }

  const TreeVisualization = () => {
    const currentStep = animationSteps[currentAnimationStep]
    const currentHeap = currentStep?.heapState || heap

    return (
      <div className="border rounded-lg p-4 h-[400px] flex flex-col justify-start items-center overflow-auto visualization-bg relative">
        {currentHeap.length === 0 && (
          <div className="text-muted-foreground absolute inset-0 flex items-center justify-center">Heap is empty</div>
        )}

        {currentStep && (
          <div className="absolute top-2 left-2 right-2 bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200 p-2 text-sm rounded">
            <div className="font-medium">{currentStep.message}</div>
            {currentStep.rule && <div className="text-xs mt-1 opacity-80">{currentStep.rule}</div>}
          </div>
        )}

        <svg width="100%" height="400" className="overflow-visible">
          <g transform="translate(0, 60)">
            {/* Draw edges first */}
            {currentHeap.map((node, index) => {
              const leftChildIndex = getLeftChildIndex(index)
              const rightChildIndex = getRightChildIndex(index)
              const nodePos = getNodePosition(index, currentHeap.length)

              return (
                <g key={`edges-${node.id}`}>
                  {/* Left child edge */}
                  {leftChildIndex < currentHeap.length && (
                    <line
                      x1={nodePos.x}
                      y1={nodePos.y + 20}
                      x2={getNodePosition(leftChildIndex, currentHeap.length).x}
                      y2={getNodePosition(leftChildIndex, currentHeap.length).y - 20}
                      stroke="currentColor"
                      strokeWidth="2"
                      className="text-muted-foreground"
                    />
                  )}
                  {/* Right child edge */}
                  {rightChildIndex < currentHeap.length && (
                    <line
                      x1={nodePos.x}
                      y1={nodePos.y + 20}
                      x2={getNodePosition(rightChildIndex, currentHeap.length).x}
                      y2={getNodePosition(rightChildIndex, currentHeap.length).y - 20}
                      stroke="currentColor"
                      strokeWidth="2"
                      className="text-muted-foreground"
                    />
                  )}
                </g>
              )
            })}

            {/* Draw nodes using current heap state */}
            <AnimatePresence>
              {currentHeap.map((node, index) => {
                const position = getNodePosition(index, currentHeap.length)
                const isHighlighted = currentStep && currentStep.highlightIndices.includes(index)
                const isSwapping = currentStep && currentStep.swapIndices && currentStep.swapIndices.includes(index)
                const isExtracting = currentStep && currentStep.extractIndex === index
                const isComparing =
                  currentStep && currentStep.compareIndices && currentStep.compareIndices.includes(index)

                let nodeColor = "fill-card stroke-primary stroke-2"
                if (isExtracting) {
                  nodeColor = "fill-red-100 stroke-red-500 stroke-2 dark:fill-red-900/30"
                } else if (isSwapping) {
                  nodeColor = "fill-orange-100 stroke-orange-500 stroke-2 dark:fill-orange-900/30"
                } else if (isComparing) {
                  nodeColor = "fill-yellow-100 stroke-yellow-500 stroke-2 dark:fill-yellow-900/30"
                } else if (isHighlighted) {
                  nodeColor = "fill-blue-100 stroke-blue-500 stroke-2 dark:fill-blue-900/30"
                }

                return (
                  <motion.g
                    key={node.id}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{
                      opacity: 1,
                      scale: isHighlighted || isSwapping || isExtracting ? 1.1 : 1,
                      x: position.x,
                      y: position.y,
                    }}
                    exit={{ opacity: 0, scale: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <circle cx={0} cy={0} r={20} className={nodeColor} />
                    <text x={0} y={0} textAnchor="middle" dominantBaseline="middle" className="text-sm font-medium">
                      {node.value}
                    </text>
                    <text
                      x={0}
                      y={-35}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      className="text-xs text-muted-foreground"
                    >
                      {index}
                    </text>
                    {index === 0 && (
                      <text
                        x={0}
                        y={35}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        className="text-xs font-medium text-primary"
                      >
                        Root
                      </text>
                    )}
                  </motion.g>
                )
              })}
            </AnimatePresence>
          </g>
        </svg>
      </div>
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
            <h1 className="text-3xl font-bold">Heap Visualizer</h1>
            <p className="text-muted-foreground">
              A complete binary tree with heap property where parent nodes maintain ordering with children
            </p>
          </div>
          <div className="w-[100px]"></div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Operations</CardTitle>
              <CardDescription>Insert and extract elements from the heap</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <RadioGroup
                  value={heapType}
                  onValueChange={handleHeapTypeChange}
                  className="flex space-x-4"
                  disabled={isAnimating}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="max" id="max" />
                    <Label htmlFor="max">Max Heap</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="min" id="min" />
                    <Label htmlFor="min">Min Heap</Label>
                  </div>
                </RadioGroup>

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

                <div className="flex space-x-2">
                  <Button
                    onClick={handleExtract}
                    variant="outline"
                    className="flex-1 flex items-center gap-1"
                    disabled={heap.length === 0 || isAnimating}
                  >
                    {heapType === "max" ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
                    Extract {heapType === "max" ? "Max" : "Min"}
                  </Button>
                  <Button
                    onClick={handleClear}
                    variant="outline"
                    className="flex-1 flex items-center gap-1"
                    disabled={heap.length === 0 || isAnimating}
                  >
                    <Trash2 className="h-4 w-4" />
                    Clear
                  </Button>
                </div>
              </div>

              {error && (
                <Alert variant="destructive">
                  <Info className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {heap.length > 0 && (
                <div className="p-3 bg-muted rounded-md">
                  <p className="text-sm font-medium mb-1">Heap Status</p>
                  <div className="text-sm space-y-1">
                    <div>Size: {heap.length}</div>
                    <div>
                      Root ({heapType === "max" ? "Maximum" : "Minimum"}): {heap[0]?.value}
                    </div>
                    <div>Type: {heapType === "max" ? "Max Heap" : "Min Heap"}</div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Visualization</CardTitle>
              <CardDescription>Complete binary tree with heap property</CardDescription>
            </CardHeader>
            <CardContent>
              <TreeVisualization />
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Heap Properties & Rules</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <h3 className="font-semibold">Heap Properties</h3>
                <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                  <li>
                    <strong>Complete Binary Tree:</strong> All levels filled except possibly the last, which fills left
                    to right
                  </li>
                  <li>
                    <strong>Heap Property:</strong> Parent nodes maintain ordering relationship with children
                  </li>
                  <li>
                    <strong>Max Heap:</strong> Parent ≥ children (largest element at root)
                  </li>
                  <li>
                    <strong>Min Heap:</strong> Parent ≤ children (smallest element at root)
                  </li>
                  <li>
                    <strong>Array Representation:</strong> Parent at index i, children at 2i+1 and 2i+2
                  </li>
                </ul>
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold">Time Complexity</h3>
                <div className="bg-muted p-3 rounded text-sm">
                  <div className="grid grid-cols-2 gap-2">
                    <div>Insert:</div>
                    <div>O(log n)</div>
                    <div>Extract Root:</div>
                    <div>O(log n)</div>
                    <div>Peek Root:</div>
                    <div>O(1)</div>
                    <div>Build Heap:</div>
                    <div>O(n)</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 space-y-2">
              <h3 className="font-semibold">Operations Explained</h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="bg-muted p-3 rounded text-sm">
                  <h4 className="font-medium mb-2">Insert (Heapify Up)</h4>
                  <ol className="list-decimal pl-4 space-y-1">
                    <li>Add element at end of heap</li>
                    <li>Compare with parent</li>
                    <li>If heap property violated, swap</li>
                    <li>Repeat until property satisfied or reach root</li>
                  </ol>
                </div>
                <div className="bg-muted p-3 rounded text-sm">
                  <h4 className="font-medium mb-2">Extract Root (Heapify Down)</h4>
                  <ol className="list-decimal pl-4 space-y-1">
                    <li>Remove root element</li>
                    <li>Replace root with last element</li>
                    <li>Compare with children</li>
                    <li>Swap with appropriate child if needed</li>
                    <li>Repeat until property satisfied</li>
                  </ol>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
