"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Info, Plus, Trash2, ChevronLeft, Search, X } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { motion, AnimatePresence } from "framer-motion"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import Link from "next/link"

interface NodeData {
  [key: string]: string
}

interface Node {
  value: string | NodeData
  id: string
}

export default function DoublyLinkedListVisualizer() {
  const [nodes, setNodes] = useState<Node[]>([])
  const [inputValue, setInputValue] = useState("")
  const [error, setError] = useState("")
  const [insertPosition, setInsertPosition] = useState("end")
  const [inputType, setInputType] = useState("single")
  const [structuredFields, setStructuredFields] = useState<{ key: string; value: string }[]>([{ key: "", value: "" }])
  const inputRef = useRef<HTMLInputElement>(null)
  const [searchValue, setSearchValue] = useState("")

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])

  const addStructuredField = () => {
    setStructuredFields([...structuredFields, { key: "", value: "" }])
  }

  const removeStructuredField = (index: number) => {
    if (structuredFields.length > 1) {
      setStructuredFields(structuredFields.filter((_, i) => i !== index))
    }
  }

  const updateStructuredField = (index: number, field: "key" | "value", newValue: string) => {
    const updated = [...structuredFields]
    updated[index][field] = newValue
    setStructuredFields(updated)
  }

  const handleInsert = () => {
    let nodeValue: string | NodeData

    if (inputType === "single") {
      if (!inputValue.trim()) {
        setError("Please enter a value to insert")
        return
      }
      nodeValue = inputValue
    } else {
      const validFields = structuredFields.filter((field) => field.key.trim() && field.value.trim())
      if (validFields.length === 0) {
        setError("Please enter at least one key-value pair")
        return
      }

      const structuredData: NodeData = {}
      validFields.forEach((field) => {
        structuredData[field.key.trim()] = field.value.trim()
      })
      nodeValue = structuredData
    }

    const newNode = {
      value: nodeValue,
      id: `node-${Date.now()}`,
    }

    if (insertPosition === "beginning") {
      setNodes([newNode, ...nodes])
    } else {
      setNodes([...nodes, newNode])
    }

    if (inputType === "single") {
      setInputValue("")
    } else {
      setStructuredFields([{ key: "", value: "" }])
    }
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

    const index = nodes.findIndex((node) => {
      if (typeof node.value === "string") {
        return node.value === searchValue
      } else {
        return Object.values(node.value).some((val) => val === searchValue)
      }
    })

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

    const index = nodes.findIndex((node) => {
      if (typeof node.value === "string") {
        return node.value === searchValue
      } else {
        return Object.values(node.value as NodeData).some((val) => val === searchValue)
      }
    })

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

  const renderNodeContent = (node: Node) => {
    if (typeof node.value === "string") {
      return <div className="font-mono text-center">{node.value}</div>
    } else {
      return (
        <div className="text-xs space-y-1">
          {Object.entries(node.value).map(([key, value]) => (
            <div key={key} className="flex justify-between">
              <span className="font-semibold text-blue-600">{key}:</span>
              <span className="font-mono">{value}</span>
            </div>
          ))}
        </div>
      )
    }
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
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
                <RadioGroup
                  defaultValue="single"
                  className="flex space-x-4"
                  onValueChange={(value) => setInputType(value)}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="single" id="single" />
                    <Label htmlFor="single">Single Value</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="structured" id="structured" />
                    <Label htmlFor="structured">Structured Data</Label>
                  </div>
                </RadioGroup>

                {inputType === "single" ? (
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
                ) : (
                  <div className="space-y-3">
                    <div className="text-sm font-medium">Add structured data:</div>
                    {structuredFields.map((field, index) => (
                      <div key={index} className="flex space-x-2 items-center">
                        <Input
                          value={field.key}
                          onChange={(e) => updateStructuredField(index, "key", e.target.value)}
                          placeholder="Key (e.g., emp_id)"
                          className="flex-1"
                        />
                        <Input
                          value={field.value}
                          onChange={(e) => updateStructuredField(index, "value", e.target.value)}
                          placeholder="Value (e.g., 125)"
                          className="flex-1"
                        />
                        {structuredFields.length > 1 && (
                          <Button variant="outline" size="icon" onClick={() => removeStructuredField(index)}>
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                    <div className="flex space-x-2">
                      <Button variant="outline" onClick={addStructuredField} className="flex-1">
                        Add Field
                      </Button>
                      <Button onClick={handleInsert} className="flex items-center gap-1">
                        <Plus className="h-4 w-4" />
                        Insert Node
                      </Button>
                    </div>
                  </div>
                )}

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
              <div className="border rounded-lg p-4 h-[400px] flex flex-col justify-center items-center overflow-auto bg-muted/30 relative">
                {nodes.length === 0 && (
                  <div className="text-muted-foreground absolute inset-0 flex items-center justify-center">
                    Doubly linked list is empty
                  </div>
                )}

                <div className="w-full overflow-x-auto">
                  <div className="flex items-center min-w-max p-4">
                    {/* NULL pointer at the beginning */}
                    {nodes.length > 0 && (
                      <div className="flex items-center mr-2">
                        <div className="border rounded px-2 py-1 text-xs text-muted-foreground">NULL</div>
                        <svg width="40" height="40" className="mx-1">
                          <defs>
                            <marker id="leftArrow" markerWidth="8" markerHeight="6" refX="1" refY="3" orient="auto">
                              <polygon points="8 0, 0 3, 8 6" className="fill-red-500" />
                            </marker>
                          </defs>
                          <line
                            x1="8"
                            y1="15"
                            x2="32"
                            y2="15"
                            className="stroke-red-500"
                            strokeWidth="2"
                            markerStart="url(#leftArrow)"
                          />
                          <text x="20" y="30" className="text-xs fill-red-500" textAnchor="middle">
                            Prev
                          </text>
                        </svg>
                      </div>
                    )}

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
                            <div className="min-w-[140px] min-h-[120px] border-2 rounded-lg flex flex-col items-center justify-center bg-card shadow-sm p-3">
                              <div className="w-24 h-6 border rounded-md bg-red-50 flex items-center justify-center mb-2">
                                <span className="text-xs text-red-600">prev</span>
                              </div>
                              {renderNodeContent(node)}
                              <div className="w-24 h-6 border rounded-md bg-blue-50 flex items-center justify-center mt-2">
                                <span className="text-xs text-blue-600">next</span>
                              </div>
                            </div>
                            {index === 0 && <span className="text-xs mt-2">Head</span>}
                            {index === nodes.length - 1 && <span className="text-xs mt-2">Tail</span>}
                          </div>

                          {/* Arrows between nodes */}
                          {index < nodes.length - 1 && (
                            <div className="mx-2 flex flex-col items-center justify-center">
                              {/* Next arrow (top) */}
                              <svg width="60" height="20" className="mb-2">
                                <defs>
                                  <marker
                                    id={`nextArrow${index}`}
                                    markerWidth="8"
                                    markerHeight="6"
                                    refX="7"
                                    refY="3"
                                    orient="auto"
                                  >
                                    <polygon points="0 0, 8 3, 0 6" className="fill-blue-500" />
                                  </marker>
                                </defs>
                                <line
                                  x1="5"
                                  y1="10"
                                  x2="50"
                                  y2="10"
                                  className="stroke-blue-500"
                                  strokeWidth="2"
                                  markerEnd={`url(#nextArrow${index})`}
                                />
                                <text x="30" y="8" className="text-xs fill-blue-500" textAnchor="middle">
                                  Next
                                </text>
                              </svg>

                              {/* Prev arrow (bottom) */}
                              <svg width="60" height="20">
                                <defs>
                                  <marker
                                    id={`prevArrow${index}`}
                                    markerWidth="8"
                                    markerHeight="6"
                                    refX="1"
                                    refY="3"
                                    orient="auto"
                                  >
                                    <polygon points="8 0, 0 3, 8 6" className="fill-red-500" />
                                  </marker>
                                </defs>
                                <line
                                  x1="50"
                                  y1="10"
                                  x2="5"
                                  y2="10"
                                  className="stroke-red-500"
                                  strokeWidth="2"
                                  markerStart={`url(#prevArrow${index})`}
                                />
                                <text x="30" y="18" className="text-xs fill-red-500" textAnchor="middle">
                                  Prev
                                </text>
                              </svg>
                            </div>
                          )}
                        </motion.div>
                      ))}
                    </AnimatePresence>

                    {/* NULL pointer at the end */}
                    {nodes.length > 0 && (
                      <div className="flex items-center ml-2">
                        <svg width="40" height="40" className="mx-1">
                          <defs>
                            <marker id="rightArrow" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
                              <polygon points="0 0, 8 3, 0 6" className="fill-blue-500" />
                            </marker>
                          </defs>
                          <line
                            x1="8"
                            y1="15"
                            x2="32"
                            y2="15"
                            className="stroke-blue-500"
                            strokeWidth="2"
                            markerEnd="url(#rightArrow)"
                          />
                          <text x="20" y="30" className="text-xs fill-blue-500" textAnchor="middle">
                            Next
                          </text>
                        </svg>
                        <div className="border rounded px-2 py-1 text-xs text-muted-foreground">NULL</div>
                      </div>
                    )}
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
