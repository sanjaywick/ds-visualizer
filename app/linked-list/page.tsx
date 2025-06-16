"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, Info, Plus, Trash2 } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { motion, AnimatePresence } from "framer-motion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import Link from "next/link"

interface Node {
  value: string
  id: string
}

export default function LinkedListVisualizer() {
  const [nodes, setNodes] = useState<Node[]>([])
  const [inputValue, setInputValue] = useState("")
  const [error, setError] = useState("")
  const [insertPosition, setInsertPosition] = useState("end")
  const [listType, setListType] = useState("singly")
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

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleInsert()
    }
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold">Linked List Visualizers</h1>
          <p className="text-muted-foreground">Explore different types of linked list data structures</p>
        </div>

        <Tabs defaultValue="singly" className="w-full" onValueChange={setListType}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="singly">Singly Linked List</TabsTrigger>
            <TabsTrigger value="doubly" disabled>
              Doubly Linked List (Planned)
            </TabsTrigger>
            <TabsTrigger value="circular" disabled>
              Circular Linked List (Planned)
            </TabsTrigger>
          </TabsList>
          <TabsContent value="singly" className="mt-6">
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
                  <div className="border rounded-lg p-4 h-[400px] flex flex-col justify-center items-center overflow-hidden bg-muted/30 relative">
                    {nodes.length === 0 && (
                      <div className="text-muted-foreground absolute inset-0 flex items-center justify-center">
                        Linked list is empty
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
                              <div className="flex flex-col items-center">
                                <div className="w-20 h-20 border-2 rounded-lg flex items-center justify-center bg-card">
                                  <span className="font-mono">{node.value}</span>
                                </div>
                                {index === 0 && <span className="text-xs mt-2">Head</span>}
                                {index === nodes.length - 1 && <span className="text-xs mt-2">Tail</span>}
                              </div>

                              {index < nodes.length - 1 && (
                                <motion.div
                                  initial={{ width: 0 }}
                                  animate={{ width: 40 }}
                                  className="mx-2 flex items-center justify-center"
                                >
                                  <div className="h-0.5 bg-primary flex-1"></div>
                                  <ArrowRight className="h-4 w-4 text-primary" />
                                </motion.div>
                              )}

                              {index === nodes.length - 1 && (
                                <div className="ml-2 flex items-center">
                                  <div className="h-0.5 w-8 bg-muted"></div>
                                  <div className="border rounded px-2 py-1 text-xs text-muted-foreground">null</div>
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
          </TabsContent>
        </Tabs>

        <div className="grid gap-6 md:grid-cols-3">
          <Card className="group hover:shadow-md transition-all">
            <CardHeader className="pb-3">
              <CardTitle>Singly Linked List</CardTitle>
              <CardDescription>Linear collection with one-way links</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Visualize operations on a singly linked list where each node points to the next node.
              </p>
              <Link href="/linked-list/singly" className="inline-block">
                <Button variant="outline" className="group-hover:bg-primary group-hover:text-primary-foreground">
                  Explore <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-md transition-all">
            <CardHeader className="pb-3">
              <CardTitle>Doubly Linked List</CardTitle>
              <CardDescription>Linear collection with two-way links</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Visualize operations on a doubly linked list where each node points to both next and previous nodes.
              </p>
              <Link href="/linked-list/doubly" className="inline-block">
                <Button variant="outline" className="group-hover:bg-primary group-hover:text-primary-foreground">
                  Explore <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-md transition-all">
            <CardHeader className="pb-3">
              <CardTitle>Circular Linked List</CardTitle>
              <CardDescription>Linked list that forms a circle</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Visualize operations on a circular linked list where the last node points back to the first node.
              </p>
              <Link href="/linked-list/circular" className="inline-block">
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
