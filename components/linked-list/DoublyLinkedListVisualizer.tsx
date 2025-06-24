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
            <div className="border rounded-lg p-4 h-[400px] flex justify-center items-center overflow-auto bg-muted/30 relative">
              {nodes.length === 0 && (
                <div className="text-muted-foreground absolute inset-0 flex items-center justify-center">
                  Doubly linked list is empty
                </div>
              )}
              <div className="w-full overflow-x-auto">
                <div className="flex items-center min-w-max p-4">

                  {/* START: NULL & Prev Arrow */}
                  {nodes.length > 0 && (
                    <div className="flex items-center mr-4 space-x-1">
                      <span className="text-sm text-green-600">NULL</span>
                      <svg width="40" height="30">
                        <defs>
                          <marker id="arrow-prev" markerWidth="10" markerHeight="6" refX="10" refY="3" orient="auto">
                            <polygon points="10 3, 0 6, 0 0" fill="green" />
                          </marker>
                        </defs>
                        <line x1="35" y1="15" x2="5" y2="15" stroke="green" strokeWidth="2" markerEnd="url(#arrow-prev)" />
                        <text x="20" y="28" fill="green" fontSize="10" textAnchor="middle">Prev</text>
                      </svg>
                    </div>
                  )}

                  {/* NODES */}
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
                          <div className="min-w-[140px] min-h-[120px] border-2 rounded-lg flex flex-col items-center justify-center bg-white shadow p-3">
                            <div className="w-24 h-6 border rounded-md bg-green-50 flex items-center justify-center mb-2">
                              <span className="text-xs text-green-600">Prev</span>
                            </div>
                            {renderNodeContent(node)}
                            <div className="w-24 h-6 border rounded-md bg-blue-50 flex items-center justify-center mt-2">
                              <span className="text-xs text-blue-600">Next</span>
                            </div>
                          </div>
                          {index === 0 && <span className="text-xs mt-1">Head</span>}
                          {index === nodes.length - 1 && <span className="text-xs mt-1">Tail</span>}
                        </div>

                        {/* Arrows */}
                        {index < nodes.length - 1 && (
                          <div className="mx-3 flex flex-col items-center">
                            <svg width="80" height="30">
                              <defs>
                                <marker id="next-arrow" markerWidth="10" markerHeight="6" refX="0" refY="3" orient="auto">
                                  <polygon points="0 3, 10 6, 10 0" fill="blue" />
                                </marker>
                                <marker id="prev-arrow" markerWidth="10" markerHeight="6" refX="10" refY="3" orient="auto">
                                  <polygon points="10 3, 0 6, 0 0" fill="green" />
                                </marker>
                              </defs>
                              <line x1="5" y1="10" x2="75" y2="10" stroke="blue" strokeWidth="2" markerEnd="url(#next-arrow)" />
                              <text x="40" y="8" fill="blue" fontSize="10" textAnchor="middle">Next</text>
                              <line x1="75" y1="20" x2="5" y2="20" stroke="green" strokeWidth="2" markerEnd="url(#prev-arrow)" />
                              <text x="40" y="28" fill="green" fontSize="10" textAnchor="middle">Prev</text>
                            </svg>
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </AnimatePresence>

                  {/* END: Next ➝ NULL */}
                  {nodes.length > 0 && (
                    <div className="flex items-center ml-4 space-x-1">
                      <svg width="40" height="30">
                        <defs>
                          <marker id="arrow-next" markerWidth="10" markerHeight="6" refX="0" refY="3" orient="auto">
                            <polygon points="0 3, 10 6, 10 0" fill="blue" />
                          </marker>
                        </defs>
                        <line x1="5" y1="15" x2="35" y2="15" stroke="blue" strokeWidth="2" markerEnd="url(#arrow-next)" />
                        <text x="20" y="28" fill="blue" fontSize="10" textAnchor="middle">Next</text>
                      </svg>
                      <span className="text-sm text-blue-600">NULL</span>
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
