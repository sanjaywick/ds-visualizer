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
}

interface AnimationStep {
  currentNode: string | null
  message: string
  complete: boolean
  path: string[]
  comparison: string | null
}

export default function BinarySearchTreeVisualizer() {
  const [root, setRoot] = useState<TreeNode | null>(null)
  const [inputValue, setInputValue] = useState("")
  const [error, setError] = useState("")
  const [traversalResult, setTraversalResult] = useState<number[]>([])
  const [traversalType, setTraversalType] = useState<string | null>(null)
  const [animation, setAnimation] = useState<AnimationStep>({
    currentNode: null,
    message: "",
    complete: true,
    path: [],
    comparison: null,
  })
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])

  const insertNode = (value: number): void => {
    const newNode: TreeNode = {
      value,
      id: `node-${Date.now()}`,
      left: null,
      right: null,
    }

    if (!root) {
      // Start animation for empty tree
      setAnimation({
        currentNode: null,
        message: "Tree is empty. Setting new node as root.",
        complete: false,
        path: [],
        comparison: null,
      })

      // Delay to show the message
      setTimeout(() => {
        setRoot(newNode)

        // Complete animation
        setTimeout(() => {
          setAnimation({
            currentNode: null,
            message: "",
            complete: true,
            path: [],
            comparison: null,
          })
        }, 1500)
      }, 1000)

      return
    }

    // For non-empty tree, we'll animate the insertion process
    animateInsertion(root, newNode)
  }

  const animateInsertion = (currentRoot: TreeNode, newNode: TreeNode, path: string[] = []) => {
    // Start by highlighting the current node we're comparing with
    setAnimation({
      currentNode: currentRoot.id,
      message: `Comparing ${newNode.value} with ${currentRoot.value}`,
      complete: false,
      path: [...path, currentRoot.id],
      comparison: newNode.value < currentRoot.value ? "less" : "greater",
    })

    // Delay to show the comparison
    setTimeout(() => {
      if (newNode.value < currentRoot.value) {
        // Go left
        setAnimation({
          currentNode: currentRoot.id,
          message: `${newNode.value} < ${currentRoot.value}, going to left subtree`,
          complete: false,
          path: [...path, currentRoot.id],
          comparison: "less",
        })

        setTimeout(() => {
          if (currentRoot.left === null) {
            // Insert as left child
            setAnimation({
              currentNode: currentRoot.id,
              message: `Left child is null. Inserting ${newNode.value} as left child of ${currentRoot.value}`,
              complete: false,
              path: [...path, currentRoot.id],
              comparison: "less",
            })

            setTimeout(() => {
              // Update the tree
              setRoot((prevRoot) => {
                if (!prevRoot) return newNode

                // Create a new tree with the new node inserted
                const insert = (node: TreeNode): TreeNode => {
                  if (node.id === currentRoot.id) {
                    return { ...node, left: newNode }
                  }

                  return {
                    ...node,
                    left: node.left ? insert(node.left) : null,
                    right: node.right ? insert(node.right) : null,
                  }
                }

                return insert(prevRoot)
              })

              // Complete animation
              setTimeout(() => {
                setAnimation({
                  currentNode: null,
                  message: "",
                  complete: true,
                  path: [],
                  comparison: null,
                })
              }, 1500)
            }, 1000)
          } else {
            // Continue traversal to the left
            animateInsertion(currentRoot.left, newNode, [...path, currentRoot.id])
          }
        }, 1000)
      } else {
        // Go right
        setAnimation({
          currentNode: currentRoot.id,
          message: `${newNode.value} >= ${currentRoot.value}, going to right subtree`,
          complete: false,
          path: [...path, currentRoot.id],
          comparison: "greater",
        })

        setTimeout(() => {
          if (currentRoot.right === null) {
            // Insert as right child
            setAnimation({
              currentNode: currentRoot.id,
              message: `Right child is null. Inserting ${newNode.value} as right child of ${currentRoot.value}`,
              complete: false,
              path: [...path, currentRoot.id],
              comparison: "greater",
            })

            setTimeout(() => {
              // Update the tree
              setRoot((prevRoot) => {
                if (!prevRoot) return newNode

                // Create a new tree with the new node inserted
                const insert = (node: TreeNode): TreeNode => {
                  if (node.id === currentRoot.id) {
                    return { ...node, right: newNode }
                  }

                  return {
                    ...node,
                    left: node.left ? insert(node.left) : null,
                    right: node.right ? insert(node.right) : null,
                  }
                }

                return insert(prevRoot)
              })

              // Complete animation
              setTimeout(() => {
                setAnimation({
                  currentNode: null,
                  message: "",
                  complete: true,
                  path: [],
                  comparison: null,
                })
              }, 1500)
            }, 1000)
          } else {
            // Continue traversal to the right
            animateInsertion(currentRoot.right, newNode, [...path, currentRoot.id])
          }
        }, 1000)
      }
    }, 1000)
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

    if (!animation.complete) {
      setError("Please wait for the current operation to complete")
      return
    }

    insertNode(value)
    setInputValue("")
    setError("")
    setTraversalResult([])
    setTraversalType(null)
  }

  const handleDelete = () => {
    setRoot(null)
    setTraversalResult([])
    setTraversalType(null)
    setError("")
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleInsert()
    }
  }

  const inOrderTraversal = (node: TreeNode | null, result: number[] = []): number[] => {
    if (node) {
      inOrderTraversal(node.left, result)
      result.push(node.value)
      inOrderTraversal(node.right, result)
    }
    return result
  }

  const preOrderTraversal = (node: TreeNode | null, result: number[] = []): number[] => {
    if (node) {
      result.push(node.value)
      preOrderTraversal(node.left, result)
      preOrderTraversal(node.right, result)
    }
    return result
  }

  const postOrderTraversal = (node: TreeNode | null, result: number[] = []): number[] => {
    if (node) {
      postOrderTraversal(node.left, result)
      postOrderTraversal(node.right, result)
      result.push(node.value)
    }
    return result
  }

  const handleTraversal = (type: string) => {
    if (!root) {
      setError("Tree is empty! Cannot traverse.")
      return
    }

    let result: number[] = []

    switch (type) {
      case "inorder":
        result = inOrderTraversal(root)
        break
      case "preorder":
        result = preOrderTraversal(root)
        break
      case "postorder":
        result = postOrderTraversal(root)
        break
      default:
        break
    }

    setTraversalResult(result)
    setTraversalType(type)
    setError("")
  }

  const TreeNodeComponent = ({ node, x, y, level }: { node: TreeNode; x: number; y: number; level: number }) => {
    const isHighlighted = animation.currentNode === node.id
    const isInPath = animation.path.includes(node.id)

    // Determine edge colors for left and right children
    const leftEdgeColor =
      animation.currentNode === node.id && animation.comparison === "less"
        ? "stroke-yellow-500"
        : "text-muted-foreground"

    const rightEdgeColor =
      animation.currentNode === node.id && animation.comparison === "greater"
        ? "stroke-yellow-500"
        : "text-muted-foreground"

    const leftChild = node.left ? (
      <>
        <line
          x1={x}
          y1={y + 20}
          x2={x - 120 / level}
          y2={y + 60}
          stroke="currentColor"
          strokeWidth={isHighlighted && animation.comparison === "less" ? "2" : "1"}
          className={leftEdgeColor}
        />
        <TreeNodeComponent node={node.left} x={x - 120 / level} y={y + 80} level={level + 1} />
      </>
    ) : isHighlighted && animation.comparison === "less" ? (
      // Show potential left insertion point
      <g>
        <line
          x1={x}
          y1={y + 20}
          x2={x - 120 / level}
          y2={y + 60}
          stroke="currentColor"
          strokeWidth="2"
          strokeDasharray="5,5"
          className="stroke-yellow-500"
        />
        <circle
          cx={x - 120 / level}
          cy={y + 80}
          r={20}
          className="fill-yellow-100 stroke-yellow-500 stroke-2 dark:fill-yellow-900/30"
          strokeDasharray="5,5"
        />
        <text
          x={x - 120 / level}
          y={y + 80}
          textAnchor="middle"
          dominantBaseline="middle"
          className="text-xs font-medium text-yellow-700 dark:text-yellow-300"
        >
          ?
        </text>
      </g>
    ) : null

    const rightChild = node.right ? (
      <>
        <line
          x1={x}
          y1={y + 20}
          x2={x + 120 / level}
          y2={y + 60}
          stroke="currentColor"
          strokeWidth={isHighlighted && animation.comparison === "greater" ? "2" : "1"}
          className={rightEdgeColor}
        />
        <TreeNodeComponent node={node.right} x={x + 120 / level} y={y + 80} level={level + 1} />
      </>
    ) : isHighlighted && animation.comparison === "greater" ? (
      // Show potential right insertion point
      <g>
        <line
          x1={x}
          y1={y + 20}
          x2={x + 120 / level}
          y2={y + 60}
          stroke="currentColor"
          strokeWidth="2"
          strokeDasharray="5,5"
          className="stroke-yellow-500"
        />
        <circle
          cx={x + 120 / level}
          cy={y + 80}
          r={20}
          className="fill-yellow-100 stroke-yellow-500 stroke-2 dark:fill-yellow-900/30"
          strokeDasharray="5,5"
        />
        <text
          x={x + 120 / level}
          y={y + 80}
          textAnchor="middle"
          dominantBaseline="middle"
          className="text-xs font-medium text-yellow-700 dark:text-yellow-300"
        >
          ?
        </text>
      </g>
    ) : null

    return (
      <>
        <circle
          cx={x}
          cy={y}
          r={20}
          className={`${
            isHighlighted
              ? "fill-yellow-100 stroke-yellow-500 stroke-2 dark:fill-yellow-900/30"
              : isInPath
                ? "fill-blue-50 stroke-blue-400 stroke-2 dark:fill-blue-900/30"
                : "fill-card stroke-primary stroke-2"
          }`}
        />
        <text
          x={x}
          y={y}
          textAnchor="middle"
          dominantBaseline="middle"
          className={`text-xs font-medium ${
            isHighlighted ? "text-yellow-700 dark:text-yellow-300" : isInPath ? "text-blue-700 dark:text-blue-300" : ""
          }`}
        >
          {node.value}
        </text>
        {leftChild}
        {rightChild}
      </>
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
            <h1 className="text-3xl font-bold">Binary Search Tree Visualizer</h1>
            <p className="text-muted-foreground">
              A binary search tree is a binary tree where nodes are ordered based on their values
            </p>
          </div>
          <div className="w-[100px]"></div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Operations</CardTitle>
              <CardDescription>Insert nodes and traverse the binary search tree</CardDescription>
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
                  disabled={!animation.complete}
                />
                <Button onClick={handleInsert} className="flex items-center gap-1" disabled={!animation.complete}>
                  <Plus className="h-4 w-4" />
                  Insert
                </Button>
              </div>

              <Button
                onClick={handleDelete}
                variant="outline"
                className="w-full flex items-center gap-1"
                disabled={!root || !animation.complete}
              >
                <Trash2 className="h-4 w-4" />
                Clear Tree
              </Button>

              <div className="grid grid-cols-3 gap-2">
                <Button
                  onClick={() => handleTraversal("inorder")}
                  variant="secondary"
                  size="sm"
                  disabled={!root || !animation.complete}
                  className={traversalType === "inorder" ? "border-primary" : ""}
                >
                  In-Order
                </Button>
                <Button
                  onClick={() => handleTraversal("preorder")}
                  variant="secondary"
                  size="sm"
                  disabled={!root || !animation.complete}
                  className={traversalType === "preorder" ? "border-primary" : ""}
                >
                  Pre-Order
                </Button>
                <Button
                  onClick={() => handleTraversal("postorder")}
                  variant="secondary"
                  size="sm"
                  disabled={!root || !animation.complete}
                  className={traversalType === "postorder" ? "border-primary" : ""}
                >
                  Post-Order
                </Button>
              </div>

              {traversalResult.length > 0 && (
                <div className="p-3 bg-muted rounded-md">
                  <p className="text-sm font-medium mb-1">
                    {traversalType === "inorder" && "In-Order Traversal"}
                    {traversalType === "preorder" && "Pre-Order Traversal"}
                    {traversalType === "postorder" && "Post-Order Traversal"}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {traversalResult.map((value, index) => (
                      <span key={index} className="px-2 py-1 bg-card rounded border text-sm">
                        {value}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {animation.message && (
                <Alert variant="info">
                  <Info className="h-4 w-4" />
                  <AlertTitle>Operation in Progress</AlertTitle>
                  <AlertDescription>{animation.message}</AlertDescription>
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
              <CardDescription>Hierarchical structure with nodes and edges</CardDescription>
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
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Binary Search Tree Properties</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <h3 className="font-semibold">Key Properties</h3>
                <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                  <li>The left subtree of a node contains only nodes with keys less than the node's key</li>
                  <li>The right subtree of a node contains only nodes with keys greater than the node's key</li>
                  <li>Both the left and right subtrees must also be binary search trees</li>
                  <li>No duplicate nodes (in this implementation)</li>
                </ul>
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold">Time Complexity</h3>
                <div className="bg-muted p-3 rounded text-sm">
                  <div className="grid grid-cols-2 gap-2">
                    <div>Search:</div>
                    <div>O(h) - h is height of tree</div>
                    <div>Insert:</div>
                    <div>O(h)</div>
                    <div>Delete:</div>
                    <div>O(h)</div>
                    <div>Worst case:</div>
                    <div>O(n) - when tree is skewed</div>
                    <div>Average case:</div>
                    <div>O(log n) - when tree is balanced</div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
