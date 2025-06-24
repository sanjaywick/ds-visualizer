"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Info, Plus, Trash2, ChevronLeft, RefreshCw, Search, X } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { motion } from "framer-motion"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import Link from "next/link"

interface NodeData {
  key: string
  value: string
}

interface Node {
  data: NodeData[]
  id: string
}

export default function CircularLinkedListVisualizer() {
  const [nodes, setNodes] = useState<Node[]>([])
  const [inputValue, setInputValue] = useState("")
  const [error, setError] = useState("")
  const [insertPosition, setInsertPosition] = useState("end")
  const inputRef = useRef<HTMLInputElement>(null)
  const [searchValue, setSearchValue] = useState("")
  const [dataType, setDataType] = useState("single")
  const [structuredDataFields, setStructuredDataFields] = useState<NodeData[]>([{ key: "", value: "" }])

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])

  const addStructuredField = () => {
    setStructuredDataFields([...structuredDataFields, { key: "", value: "" }])
  }

  const removeStructuredField = (index: number) => {
    const newFields = [...structuredDataFields]
    newFields.splice(index, 1)
    setStructuredDataFields(newFields)
  }

  const updateStructuredField = (index: number, field: "key" | "value", value: string) => {
    const newFields = [...structuredDataFields]
    newFields[index] = { ...newFields[index], [field]: value }
    setStructuredDataFields(newFields)
  }

  const handleInsert = () => {
    if (dataType === "single") {
      if (!inputValue.trim()) {
        setError("Please enter a value to insert")
        return
      }

      const newNode = {
        data: [{ key: "value", value: inputValue }],
        id: `node-${Date.now()}`,
      }

      if (insertPosition === "beginning") {
        setNodes([newNode, ...nodes])
      } else {
        setNodes([...nodes, newNode])
      }

      setInputValue("")
      setError("")
    } else {
      // Structured data insertion
      if (structuredDataFields.some((field) => !field.key.trim() || !field.value.trim())) {
        setError("Please ensure all fields in structured data are filled.")
        return
      }

      const newNode = {
        data: structuredDataFields,
        id: `node-${Date.now()}`,
      }

      if (insertPosition === "beginning") {
        setNodes([newNode, ...nodes])
      } else {
        setNodes([...nodes, newNode])
      }

      setStructuredDataFields([{ key: "", value: "" }]) // Reset fields
      setError("")
    }
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

    const index = nodes.findIndex((node) => node.data.some((item) => item.value === searchValue))

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

    const index = nodes.findIndex((node) => node.data.some((item) => item.value === searchValue))
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
    if (dataType === "single") {
      return <div className="font-mono">{node.data[0].value}</div>
    } else {
      return (
        <div>
          {node.data.map((item, index) => (
            <div key={index} className="text-sm">
              <span className="font-semibold">{item.key}:</span> {item.value}
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
          <Link href="/linked-list">
            <Button variant="ghost" size="sm" className="flex items-center gap-1">
              <ChevronLeft className="h-4 w-4" />
              Back to Linked List Types
            </Button>
          </Link>
          <div className="text-center space-y-1 flex-1">
            <h1 className="text-3xl font-bold">Circular Linked List Visualizer</h1>
            <p className="text-muted-foreground">
              A circular linked list is a linked list where the last node points back to the first node
            </p>
          </div>
          <div className="w-[100px]"></div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Operations</CardTitle>
              <CardDescription>Insert and delete nodes from the circular linked list</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <RadioGroup onValueChange={(value) => setDataType(value)} defaultValue="single" className="mb-4">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="single" id="single" />
                  <Label htmlFor="single">Single Value</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="structured" id="structured" />
                  <Label htmlFor="structured">Structured Data</Label>
                </div>
              </RadioGroup>

              {dataType === "single" ? (
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
                </div>
              ) : (
                <div className="space-y-4">
                  {structuredDataFields.map((field, index) => (
                    <div key={index} className="flex space-x-2 items-center">
                      <Input
                        placeholder="Key"
                        value={field.key}
                        onChange={(e) => updateStructuredField(index, "key", e.target.value)}
                      />
                      <Input
                        placeholder="Value"
                        value={field.value}
                        onChange={(e) => updateStructuredField(index, "value", e.target.value)}
                      />
                      {structuredDataFields.length > 1 ? (
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          onClick={() => removeStructuredField(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      ) : null}
                    </div>
                  ))}
                  <Button type="button" variant="secondary" onClick={addStructuredField}>
                    Add Field
                  </Button>
                  <Button onClick={handleInsert} className="flex items-center gap-1">
                    <Plus className="h-4 w-4" />
                    Insert
                  </Button>
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
              <CardDescription>Nodes connected in a circular sequence</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg p-4 h-[400px] flex flex-col justify-center items-center overflow-hidden visualization-bg relative">
                {nodes.length === 0 && (
                  <div className="text-muted-foreground absolute inset-0 flex items-center justify-center">
                    Circular linked list is empty
                  </div>
                )}

                {nodes.length > 0 && (
                  <div className="relative w-[300px] h-[300px]">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <RefreshCw className="h-8 w-8 text-muted-foreground/20" />
                    </div>

                    {nodes.map((node, index) => {
                      const angle = (index * (360 / nodes.length) * Math.PI) / 180
                      const radius = 120
                      const x = radius * Math.cos(angle)
                      const y = radius * Math.sin(angle)

                      return (
                        <motion.div
                          key={node.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="absolute"
                          style={{
                            transform: `translate(${x + 150}px, ${y + 150}px)`,
                          }}
                        >
                          <div className="w-24 h-24 border-2 rounded-lg flex flex-col items-center justify-center bg-card shadow-sm">
                            {renderNodeContent(node)}
                            <div className="w-16 h-6 border rounded-md bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center">
                              <span className="text-xs text-blue-600 dark:text-blue-300">next</span>
                            </div>
                          </div>
                          {index === 0 && (
                            <div className="absolute top-full mt-1 left-1/2 transform -translate-x-1/2">
                              <span className="text-xs">Head</span>
                            </div>
                          )}
                        </motion.div>
                      )
                    })}

                    {/* Draw arrows connecting the nodes */}
                    <svg className="absolute inset-0 w-full h-full" style={{ zIndex: -1 }}>
                      <defs>
                        <marker id="circularArrow" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
                          <polygon points="0 0, 8 3, 0 6" className="fill-primary" />
                        </marker>
                      </defs>
                      {nodes.map((_, index) => {
                        const startAngle = (index * (360 / nodes.length) * Math.PI) / 180
                        const endAngle = (((index + 1) % nodes.length) * (360 / nodes.length) * Math.PI) / 180

                        const startX = 150 + (120 - 15) * Math.cos(startAngle)
                        const startY = 150 + (120 - 15) * Math.sin(startAngle)

                        const endX = 150 + (120 - 15) * Math.cos(endAngle)
                        const endY = 150 + (120 - 15) * Math.sin(endAngle)

                        // Calculate control point for curved arrow
                        const midAngle = (startAngle + endAngle) / 2
                        const controlDistance = 40
                        const controlX = 150 + (120 + controlDistance) * Math.cos(midAngle)
                        const controlY = 150 + (120 + controlDistance) * Math.sin(midAngle)

                        return (
                          <path
                            key={`arrow-${index}`}
                            d={`M ${startX} ${startY} Q ${controlX} ${controlY} ${endX} ${endY}`}
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            className="text-primary"
                            markerEnd="url(#circularArrow)"
                          />
                        )
                      })}
                    </svg>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Circular Linked List Operations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <h3 className="font-semibold">Insert Operation</h3>
                <p className="text-sm text-muted-foreground">
                  Adds a node to the circular linked list, maintaining the circular structure.
                </p>
                <div className="bg-muted p-3 rounded text-sm font-mono">
                  insertAtBeginning(value) {"{"}
                  <br />
                  &nbsp;&nbsp;const newNode = {"{"} value, next: null {"}"}
                  <br />
                  &nbsp;&nbsp;if (!this.head) {"{"}
                  <br />
                  &nbsp;&nbsp;&nbsp;&nbsp;newNode.next = newNode // Points to itself
                  <br />
                  &nbsp;&nbsp;&nbsp;&nbsp;this.head = newNode
                  <br />
                  &nbsp;&nbsp;&nbsp;&nbsp;return
                  <br />
                  &nbsp;&nbsp;{"}"}
                  <br />
                  &nbsp;&nbsp;// Find the last node
                  <br />
                  &nbsp;&nbsp;let last = this.head
                  <br />
                  &nbsp;&nbsp;while (last.next !== this.head) {"{"}
                  <br />
                  &nbsp;&nbsp;&nbsp;&nbsp;last = last.next
                  <br />
                  &nbsp;&nbsp;{"}"}
                  <br />
                  &nbsp;&nbsp;// Update connections
                  <br />
                  &nbsp;&nbsp;newNode.next = this.head
                  <br />
                  &nbsp;&nbsp;last.next = newNode
                  <br />
                  &nbsp;&nbsp;this.head = newNode
                  <br />
                  {"}"}
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold">Delete Operation</h3>
                <p className="text-sm text-muted-foreground">
                  Removes a node from the circular linked list, maintaining the circular structure.
                </p>
                <div className="bg-muted p-3 rounded text-sm font-mono">
                  deleteFromBeginning() {"{"}
                  <br />
                  &nbsp;&nbsp;if (!this.head) return null
                  <br />
                  &nbsp;&nbsp;const value = this.head.value
                  <br />
                  &nbsp;&nbsp;// If only one node
                  <br />
                  &nbsp;&nbsp;if (this.head.next === this.head) {"{"}
                  <br />
                  &nbsp;&nbsp;&nbsp;&nbsp;this.head = null
                  <br />
                  &nbsp;&nbsp;&nbsp;&nbsp;return value
                  <br />
                  &nbsp;&nbsp;{"}"}
                  <br />
                  &nbsp;&nbsp;// Find the last node
                  <br />
                  &nbsp;&nbsp;let last = this.head
                  <br />
                  &nbsp;&nbsp;while (last.next !== this.head) {"{"}
                  <br />
                  &nbsp;&nbsp;&nbsp;&nbsp;last = last.next
                  <br />
                  &nbsp;&nbsp;{"}"}
                  <br />
                  &nbsp;&nbsp;// Update connections
                  <br />
                  &nbsp;&nbsp;last.next = this.head.next
                  <br />
                  &nbsp;&nbsp;this.head = this.head.next
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
