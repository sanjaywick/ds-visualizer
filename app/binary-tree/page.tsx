"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { ArrowRight, GitBranch, BarChart2, Scale, Layers } from "lucide-react"
import { useState, useRef, useEffect } from "react"

interface TreeNode {
  value: number
  id: string
  left: TreeNode | null
  right: TreeNode | null
  highlighted?: boolean
}

interface AnimationStep {
  currentNode: string | null
  message: string
  complete: boolean
  path: string[]
  comparison: string | null
}

export default function BinaryTreePage() {
  const [root, setRoot] = useState<TreeNode | null>(null)
  const [inputValue, setInputValue] = useState("")
  const [error, setError] = useState("")
  const [treeType, setTreeType] = useState("bst")
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
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold">Binary Tree Visualizers</h1>
          <p className="text-muted-foreground">Explore different types of binary tree data structures</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card className="group hover:shadow-md transition-all">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <GitBranch className="h-5 w-5" />
                Binary Search Tree
              </CardTitle>
              <CardDescription>Simple binary tree with ordered nodes</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Visualize operations on a binary search tree where each node has at most two children.
              </p>
              <Link href="/binary-tree/bst" className="inline-block">
                <Button variant="outline" className="group-hover:bg-primary group-hover:text-primary-foreground">
                  Explore <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-md transition-all">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <Scale className="h-5 w-5" />
                AVL Tree
              </CardTitle>
              <CardDescription>Self-balancing binary search tree</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Visualize operations on an AVL tree with automatic rotations to maintain balance.
              </p>
              <Link href="/binary-tree/avl" className="inline-block">
                <Button variant="outline" className="group-hover:bg-primary group-hover:text-primary-foreground">
                  Explore <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-md transition-all">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <Layers className="h-5 w-5" />
                Heap
              </CardTitle>
              <CardDescription>Complete binary tree with heap property</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Visualize operations on a heap tree where parent nodes maintain heap property with children.
              </p>
              <Link href="/binary-tree/heap" className="inline-block">
                <Button variant="outline" className="group-hover:bg-primary group-hover:text-primary-foreground">
                  Explore <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-md transition-all">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <BarChart2 className="h-5 w-5" />
                Red-Black Tree
              </CardTitle>
              <CardDescription>Self-balancing tree with color properties</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Visualize operations on a red-black tree with color-based balancing rules.
              </p>
              <Link href="/binary-tree/red-black" className="inline-block">
                <Button variant="outline" className="group-hover:bg-primary group-hover:text-primary-foreground">
                  Explore <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
