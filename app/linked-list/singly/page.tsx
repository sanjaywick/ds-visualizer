"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Info, Plus, Trash2, ChevronLeft, Search } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { motion, AnimatePresence } from "framer-motion"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import Link from "next/link"

interface Node {
  value: string
  id: string
}

interface AnimationStep {
  type: "search" | "insert" | "delete" | "none"
  currentIndex: number
  message: string
  complete: boolean
}

export default function SinglyLinkedListVisualizer() {
  const [nodes, setNodes] = useState<Node[]>([])
  const [inputValue, setInputValue] = useState("")
  const [searchValue, setSearchValue] = useState("")
  const [error, setError] = useState("")
  const [insertPosition, setInsertPosition] = useState("end")
  const [animation, setAnimation] = useState<AnimationStep>({
    type: "none",
    currentIndex: -1,
    message: "",
    complete: true,
  })
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])

  const handleInsert = () => {
    if (!inputValue.trim()) {
      setError("Please enter a value to insert")
      return
    }

    const newNode = {
      value: inputValue,
      id: `node-${Date.now()}`,
    }

    // Start animation
    setAnimation({
      type: "insert",
      currentIndex: insertPosition === "beginning" ? 0 : nodes.length,
      message:
        insertPosition === "beginning"
          ? "Inserting at the beginning: updating head pointer"
          : "Inserting at the end: traversing to the tail node",
      complete: false,
    })

    // Use setTimeout to allow animation to render before updating state
    setTimeout(() => {
      if (insertPosition === "beginning") {
        setNodes([newNode, ...nodes])
      } else {
        setNodes([...nodes, newNode])
      }

      setInputValue("")
      setError("")

      // Complete animation after a delay
      setTimeout(() => {
        setAnimation({
          type: "none",
          currentIndex: -1,
          message: "",
          complete: true,
        })
      }, 1500)
    }, 1000)
  }

  const handleDelete = (position: "beginning" | "end") => {
    if (nodes.length === 0) {
      setError("Linked list is empty! Cannot delete.")
      return
    }

    // Start animation
    setAnimation({
      type: "delete",
      currentIndex: position === "beginning" ? 0 : nodes.length - 1,
      message:
        position === "beginning"
          ? "Deleting from beginning: updating head pointer to the next node"
          : "Deleting from end: traversing to find the node before tail",
      complete: false,
    })

    // Use setTimeout to allow animation to render before updating state
    setTimeout(() => {
      if (position === "beginning") {
        setNodes(nodes.slice(1))
      } else {
        setNodes(nodes.slice(0, -1))
      }

      setError("")

      // Complete animation after a delay
      setTimeout(() => {
        setAnimation({
          type: "none",
          currentIndex: -1,
          message: "",
          complete: true,
        })
      }, 1500)
    }, 1000)
  }

  const handleDeleteByValue = () => {
    if (!searchValue.trim()) {
      setError("Please enter a value to delete")
      return
    }

    const index = nodes.findIndex((node) => node.value === searchValue)
    if (index === -1) {
      setError(`Value "${searchValue}" not found in the linked list`)
      return
    }

    // Start animation
    setAnimation({
      type: "delete",
      currentIndex: 0,
      message: "Searching for node to delete...",
      complete: false,
    })

    // Animate traversal through the list
    let currentIndex = 0
    const traverseInterval = setInterval(() => {
      if (currentIndex < index) {
        currentIndex++
        setAnimation({
          type: "delete",
          currentIndex,
          message:
            currentIndex === index
              ? "Found node to delete! Updating pointers..."
              : `Traversing node ${currentIndex + 1}/${nodes.length}`,
          complete: false,
        })
      } else {
        clearInterval(traverseInterval)

        // Delete the node after finding it
        setTimeout(() => {
          const newNodes = [...nodes]
          newNodes.splice(index, 1)
          setNodes(newNodes)
          setSearchValue("")

          // Complete animation
          setTimeout(() => {
            setAnimation({
              type: "none",
              currentIndex: -1,
              message: "",
              complete: true,
            })
          }, 1000)
        }, 1000)
      }
    }, 500)
  }

  const handleSearch = () => {
    if (!searchValue.trim()) {
      setError("Please enter a value to search")
      return
    }

    // Start animation
    setAnimation({
      type: "search",
      currentIndex: 0,
      message: "Starting search from head node",
      complete: false,
    })

    // Animate traversal through the list
    let currentIndex = 0
    const traverseInterval = setInterval(() => {
      if (currentIndex < nodes.length) {
        if (nodes[currentIndex].value === searchValue) {
          clearInterval(traverseInterval)
          setAnimation({
            type: "search",
            currentIndex,
            message: `Found value "${searchValue}" at position ${currentIndex + 1}!`,
            complete: false,
          })

          // Complete animation after showing the result
          setTimeout(() => {
            setAnimation({
              type: "none",
              currentIndex: -1,
              message: "",
              complete: true,
            })
          }, 2000)
        } else {
          currentIndex++
          if (currentIndex < nodes.length) {
            setAnimation({
              type: "search",
              currentIndex,
              message: `Checking node at position ${currentIndex + 1}`,
              complete: false,
            })
          } else {
            clearInterval(traverseInterval)
            setAnimation({
              type: "search",
              currentIndex: -1,
              message: `Value "${searchValue}" not found in the linked list`,
              complete: false,
            })

            // Complete animation after showing the result
            setTimeout(() => {
              setAnimation({
                type: "none",
                currentIndex: -1,
                message: "",
                complete: true,
              })
            }, 2000)
          }
        }
      }
    }, 500)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleInsert()
    }
  }

  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <Link href="/linked-list">
            <Button variant="ghost" size="sm" className="flex items-center gap-1">
              <ChevronLeft className="h-4 w-4" />
              Back to Linked List Types
            </Button>
          </Link>
          <div className="text-center space-y-1 flex-1">
            <h1 className="text-3xl font-bold">Singly Linked List Visualizer</h1>
            <p className="text-muted-foreground">
              A singly linked list is a linear collection where each node points to the next node
            </p>
          </div>
          <div className="w-[100px]"></div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Operations</CardTitle>
              <CardDescription>Insert and delete nodes from the linked list</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex space-x-2">
                  <Input
                    ref={inputRef}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Enter a value"
                    className="flex-1"
                  />
                  <Button onClick={handleInsert} className="flex items-center gap-1">
                    <Plus className="h-4 w-4" />
                    Insert
                  </Button>
                </div>

                <RadioGroup
                  defaultValue="end"
                  className="flex space-x-4"
                  onValueChange={(value) => setInsertPosition(value)}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="beginning" id="beginning" />
                    <Label htmlFor="beginning">At Beginning</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="end" id="end" />
                    <Label htmlFor="end">At End</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="flex space-x-2">
                <Button
                  onClick={() => handleDelete("beginning")}
                  variant="outline"
                  className="flex-1 flex items-center gap-1"
                  disabled={nodes.length === 0 || !animation.complete}
                >
                  <Trash2 className="h-4 w-4" />
                  Delete First
                </Button>
                <Button
                  onClick={() => handleDelete("end")}
                  variant="outline"
                  className="flex-1 flex items-center gap-1"
                  disabled={nodes.length === 0 || !animation.complete}
                >
                  <Trash2 className="h-4 w-4" />
                  Delete Last
                </Button>
              </div>

              <div className="pt-2 border-t">
                <h3 className="text-sm font-medium mb-2">Search & Delete by Value</h3>
                <div className="flex space-x-2 mb-2">
                  <Input
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    onKeyDown={handleSearchKeyDown}
                    placeholder="Enter value to search/delete"
                    className="flex-1"
                  />
                  <Button onClick={handleSearch} variant="secondary" disabled={!animation.complete}>
                    <Search className="h-4 w-4 mr-1" />
                    Find
                  </Button>
                </div>
                <Button
                  onClick={handleDeleteByValue}
                  variant="outline"
                  className="w-full"
                  disabled={nodes.length === 0 || !animation.complete}
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete by Value
                </Button>
              </div>

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
              <CardDescription>Nodes connected in a linear sequence</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg p-4 h-[400px] flex flex-col justify-center items-center overflow-auto visualization-bg relative">
                {nodes.length === 0 && (
                  <div className="text-muted-foreground absolute inset-0 flex items-center justify-center">
                    Linked list is empty
                  </div>
                )}

                {animation.message && (
                  <div className="absolute top-2 left-0 right-0 bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200 p-2 text-sm text-center">
                    {animation.message}
                  </div>
                )}

                <div className="w-full overflow-x-auto">
                  <div className="flex items-center min-w-max p-4 mt-8">
                    <AnimatePresence>
                      {nodes.map((node, index) => (
                        <motion.div
                          key={node.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{
                            opacity: 1,
                            y: 0,
                            scale: animation.currentIndex === index ? 1.1 : 1,
                            zIndex: animation.currentIndex === index ? 10 : 1,
                          }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          transition={{ duration: 0.3 }}
                          className="flex items-center"
                        >
                          <div className="flex flex-col items-center">
                            <div
                              className={`w-24 h-24 border-2 rounded-lg flex flex-col items-center justify-center bg-card shadow-sm
                                ${
                                  animation.currentIndex === index
                                    ? animation.type === "search"
                                      ? "border-yellow-500 bg-yellow-50 dark:bg-yellow-900/30"
                                      : animation.type === "delete"
                                        ? "border-red-500 bg-red-50 dark:bg-red-900/30"
                                        : "border-green-500 bg-green-50 dark:bg-green-900/30"
                                    : ""
                                }`}
                            >
                              <div className="font-mono mb-2">{node.value}</div>
                              <div className="w-16 h-6 border rounded-md bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center">
                                <span className="text-xs text-blue-600 dark:text-blue-300">next</span>
                              </div>
                            </div>
                            {index === 0 && <span className="text-xs mt-2">Head</span>}
                            {index === nodes.length - 1 && <span className="text-xs mt-2">Tail</span>}
                          </div>

                          {index < nodes.length - 1 && (
                            <div className="mx-2 flex items-center justify-center relative">
                              <svg width="40" height="20" className="absolute">
                                <defs>
                                  <marker
                                    id="arrowhead"
                                    markerWidth="10"
                                    markerHeight="7"
                                    refX="9"
                                    refY="3.5"
                                    orient="auto"
                                  >
                                    <polygon
                                      points="0 0, 10 3.5, 0 7"
                                      className={`${animation.currentIndex === index && animation.type !== "none" ? "fill-yellow-500" : "fill-primary"}`}
                                    />
                                  </marker>
                                </defs>
                                <line
                                  x1="0"
                                  y1="10"
                                  x2="30"
                                  y2="10"
                                  className={`${animation.currentIndex === index && animation.type !== "none" ? "stroke-yellow-500" : "stroke-primary"}`}
                                  strokeWidth="2"
                                  markerEnd="url(#arrowhead)"
                                />
                              </svg>
                            </div>
                          )}

                          {index === nodes.length - 1 && (
                            <div className="ml-2 flex items-center">
                              <svg width="40" height="20">
                                <defs>
                                  <marker
                                    id="nullarrow"
                                    markerWidth="10"
                                    markerHeight="7"
                                    refX="9"
                                    refY="3.5"
                                    orient="auto"
                                  >
                                    <polygon points="0 0, 10 3.5, 0 7" className="fill-muted-foreground" />
                                  </marker>
                                </defs>
                                <line
                                  x1="0"
                                  y1="10"
                                  x2="25"
                                  y2="10"
                                  className="stroke-muted-foreground"
                                  strokeWidth="1"
                                  strokeDasharray="3,3"
                                  markerEnd="url(#nullarrow)"
                                />
                              </svg>
                              <div className="border rounded px-2 py-1 text-xs text-muted-foreground ml-1">null</div>
                            </div>
                          )}
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Singly Linked List Operations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <h3 className="font-semibold">Insert Operation</h3>
                <p className="text-sm text-muted-foreground">
                  Adds a node to the linked list, either at the beginning or end.
                </p>
                <div className="bg-muted p-3 rounded text-sm font-mono">
                  insertAtBeginning(value) {"{"}
                  <br />
                  &nbsp;&nbsp;const newNode = {"{"} value, next: null {"}"}
                  <br />
                  &nbsp;&nbsp;newNode.next = this.head <span className="text-green-600">// Point to current head</span>
                  <br />
                  &nbsp;&nbsp;this.head = newNode <span className="text-green-600">// Update head to new node</span>
                  <br />
                  {"}"}
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold">Search & Delete by Value</h3>
                <p className="text-sm text-muted-foreground">
                  Searches for a node with a specific value and optionally deletes it.
                </p>
                <div className="bg-muted p-3 rounded text-sm font-mono">
                  deleteByValue(value) {"{"}
                  <br />
                  &nbsp;&nbsp;if (!this.head) return null <span className="text-green-600">// Empty list</span>
                  <br />
                  &nbsp;&nbsp;if (this.head.value === value) {"{"}{" "}
                  <span className="text-green-600">// Delete head</span>
                  <br />
                  &nbsp;&nbsp;&nbsp;&nbsp;this.head = this.head.next
                  <br />
                  &nbsp;&nbsp;&nbsp;&nbsp;return
                  <br />
                  &nbsp;&nbsp;{"}"}
                  <br />
                  &nbsp;&nbsp;let current = this.head
                  <br />
                  &nbsp;&nbsp;while (current.next && current.next.value !== value) {"{"}
                  <br />
                  &nbsp;&nbsp;&nbsp;&nbsp;current = current.next{" "}
                  <span className="text-green-600">// Traverse list</span>
                  <br />
                  &nbsp;&nbsp;{"}"}
                  <br />
                  &nbsp;&nbsp;if (current.next) {"{"} <span className="text-green-600">// Found node to delete</span>
                  <br />
                  &nbsp;&nbsp;&nbsp;&nbsp;current.next = current.next.next{" "}
                  <span className="text-green-600">// Skip over node</span>
                  <br />
                  &nbsp;&nbsp;{"}"}
                  <br />
                  {"}"}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
