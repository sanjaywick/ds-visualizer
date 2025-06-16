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

export default function DoublyLinkedListVisualizer() {
  const [nodes, setNodes] = useState<Node[]>([])
  const [inputValue, setInputValue] = useState("")
  const [error, setError] = useState("")
  const [insertPosition, setInsertPosition] = useState("end")
  const inputRef = useRef<HTMLInputElement>(null)
  const [searchValue, setSearchValue] = useState("")

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

    if (insertPosition === "beginning") {
      setNodes([newNode, ...nodes])
    } else {
      setNodes([...nodes, newNode])
    }

    setInputValue("")
    setError("")
  }

  const handleDelete = (position: "beginning" | "end") => {
    if (nodes.length === 0) {
      setError("Linked list is empty! Cannot delete.")
      return
    }

    if (position === "beginning") {
      setNodes(nodes.slice(1))
    } else {
      setNodes(nodes.slice(0, -1))
    }

    setError("")
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

    const newNodes = [...nodes]
    newNodes.splice(index, 1)
    setNodes(newNodes)
    setSearchValue("")
    setError("")
  }

  const handleSearch = () => {
    if (!searchValue.trim()) {
      setError("Please enter a value to search")
      return
    }

    const index = nodes.findIndex((node) => node.value === searchValue)
    if (index === -1) {
      setError(`Value "${searchValue}" not found in the linked list`)
    } else {
      setError(`Value "${searchValue}" found at position ${index + 1}!`)
    }
  }

  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleInsert()
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
            <h1 className="text-3xl font-bold">Doubly Linked List Visualizer</h1>
            <p className="text-muted-foreground">
              A doubly linked list is a linear collection where each node points to both next and previous nodes
            </p>
          </div>
          <div className="w-[100px]"></div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Operations</CardTitle>
              <CardDescription>Insert and delete nodes from the doubly linked list</CardDescription>
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
                  disabled={nodes.length === 0}
                >
                  <Trash2 className="h-4 w-4" />
                  Delete First
                </Button>
                <Button
                  onClick={() => handleDelete("end")}
                  variant="outline"
                  className="flex-1 flex items-center gap-1"
                  disabled={nodes.length === 0}
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
                  <Button onClick={handleSearch} variant="secondary">
                    <Search className="h-4 w-4 mr-1" />
                    Find
                  </Button>
                </div>
                <Button
                  onClick={handleDeleteByValue}
                  variant="outline"
                  className="w-full"
                  disabled={nodes.length === 0}
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
              <CardDescription>Nodes connected with bidirectional links</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg p-4 h-[400px] flex flex-col justify-center items-center overflow-auto visualization-bg relative">
                {nodes.length === 0 && (
                  <div className="text-muted-foreground absolute inset-0 flex items-center justify-center">
                    Doubly linked list is empty
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
                          {index === 0 && (
                            <div className="mr-2 flex items-center">
                              <div className="border rounded px-2 py-1 text-xs text-muted-foreground mr-1">null</div>
                              <svg width="40" height="20">
                                <defs>
                                  <marker
                                    id="nullleftarrow"
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
                                  markerEnd="url(#nullleftarrow)"
                                />
                              </svg>
                            </div>
                          )}

                          {index > 0 && (
                            <div className="mx-2 flex items-center justify-center relative">
                              <svg width="40" height="20">
                                <defs>
                                  <marker
                                    id="leftarrow"
                                    markerWidth="10"
                                    markerHeight="7"
                                    refX="1"
                                    refY="3.5"
                                    orient="auto"
                                  >
                                    <polygon points="10 0, 0 3.5, 10 7" className="fill-red-500" />
                                  </marker>
                                </defs>
                                <line
                                  x1="10"
                                  y1="10"
                                  x2="40"
                                  y2="10"
                                  className="stroke-red-500"
                                  strokeWidth="2"
                                  markerStart="url(#leftarrow)"
                                />
                              </svg>
                            </div>
                          )}

                          <div className="flex flex-col items-center">
                            <div className="w-28 h-28 border-2 rounded-lg flex flex-col items-center justify-center bg-card shadow-sm">
                              <div className="w-20 h-6 border rounded-md bg-red-50 dark:bg-red-900/30 flex items-center justify-center mb-2">
                                <span className="text-xs text-red-600 dark:text-red-300">prev</span>
                              </div>
                              <div className="font-mono my-1">{node.value}</div>
                              <div className="w-20 h-6 border rounded-md bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center mt-1">
                                <span className="text-xs text-blue-600 dark:text-blue-300">next</span>
                              </div>
                            </div>
                            {index === 0 && <span className="text-xs mt-2">Head</span>}
                            {index === nodes.length - 1 && <span className="text-xs mt-2">Tail</span>}
                          </div>

                          {index < nodes.length - 1 && (
                            <div className="mx-2 flex items-center justify-center relative">
                              <svg width="40" height="20">
                                <defs>
                                  <marker
                                    id="rightarrow"
                                    markerWidth="10"
                                    markerHeight="7"
                                    refX="9"
                                    refY="3.5"
                                    orient="auto"
                                  >
                                    <polygon points="0 0, 10 3.5, 0 7" className="fill-blue-500" />
                                  </marker>
                                </defs>
                                <line
                                  x1="0"
                                  y1="10"
                                  x2="30"
                                  y2="10"
                                  className="stroke-blue-500"
                                  strokeWidth="2"
                                  markerEnd="url(#rightarrow)"
                                />
                              </svg>
                            </div>
                          )}

                          {index === nodes.length - 1 && (
                            <div className="ml-2 flex items-center">
                              <svg width="40" height="20">
                                <defs>
                                  <marker
                                    id="nullrightarrow"
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
                                  markerEnd="url(#nullrightarrow)"
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
            <CardTitle>Doubly Linked List Operations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <h3 className="font-semibold">Insert Operation</h3>
                <p className="text-sm text-muted-foreground">
                  Adds a node to the doubly linked list, maintaining both next and previous pointers.
                </p>
                <div className="bg-muted p-3 rounded text-sm font-mono">
                  insertAtBeginning(value) {"{"}
                  <br />
                  &nbsp;&nbsp;const newNode = {"{"}
                  <br />
                  &nbsp;&nbsp;&nbsp;&nbsp;value,
                  <br />
                  &nbsp;&nbsp;&nbsp;&nbsp;next: null,
                  <br />
                  &nbsp;&nbsp;&nbsp;&nbsp;prev: null
                  <br />
                  &nbsp;&nbsp;{"}"}
                  <br />
                  &nbsp;&nbsp;if (this.head) {"{"}
                  <br />
                  &nbsp;&nbsp;&nbsp;&nbsp;newNode.next = this.head
                  <br />
                  &nbsp;&nbsp;&nbsp;&nbsp;this.head.prev = newNode
                  <br />
                  &nbsp;&nbsp;{"}"}
                  <br />
                  &nbsp;&nbsp;this.head = newNode
                  <br />
                  {"}"}
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold">Delete Operation</h3>
                <p className="text-sm text-muted-foreground">
                  Removes a node from the doubly linked list, updating both next and previous pointers.
                </p>
                <div className="bg-muted p-3 rounded text-sm font-mono">
                  deleteFromBeginning() {"{"}
                  <br />
                  &nbsp;&nbsp;if (!this.head) return null
                  <br />
                  &nbsp;&nbsp;const value = this.head.value
                  <br />
                  &nbsp;&nbsp;this.head = this.head.next
                  <br />
                  &nbsp;&nbsp;if (this.head) {"{"}
                  <br />
                  &nbsp;&nbsp;&nbsp;&nbsp;this.head.prev = null
                  <br />
                  &nbsp;&nbsp;{"}"}
                  <br />
                  &nbsp;&nbsp;return value
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
