"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, ArrowRight, Info, ChevronLeft } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { Label } from "@/components/ui/label"

interface PriorityQueueItem {
  value: string
  priority: number
  id: string
}

export default function PriorityQueueVisualizer() {
  const [queue, setQueue] = useState<PriorityQueueItem[]>([])
  const [inputValue, setInputValue] = useState("")
  const [priority, setPriority] = useState<number>(1)
  const [error, setError] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])

  const handleEnqueue = () => {
    if (!inputValue.trim()) {
      setError("Please enter a value to enqueue")
      return
    }

    if (queue.length >= 10) {
      setError("Queue is full! Maximum size reached.")
      return
    }

    const newItem: PriorityQueueItem = {
      value: inputValue,
      priority: priority,
      id: `item-${Date.now()}`,
    }

    // Insert based on priority (higher priority first)
    const newQueue = [...queue]
    let inserted = false

    for (let i = 0; i < newQueue.length; i++) {
      if (priority > newQueue[i].priority) {
        newQueue.splice(i, 0, newItem)
        inserted = true
        break
      }
    }

    if (!inserted) {
      newQueue.push(newItem)
    }

    setQueue(newQueue)
    setInputValue("")
    setError("")
  }

  const handleDequeue = () => {
    if (queue.length === 0) {
      setError("Queue is empty! Cannot dequeue.")
      return
    }

    setQueue(queue.slice(1))
    setError("")
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleEnqueue()
    }
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <Link href="/queue">
            <Button variant="ghost" size="sm" className="flex items-center gap-1">
              <ChevronLeft className="h-4 w-4" />
              Back to Queue Types
            </Button>
          </Link>
          <div className="text-center space-y-1 flex-1">
            <h1 className="text-3xl font-bold">Priority Queue Visualizer</h1>
            <p className="text-muted-foreground">Elements with higher priority are dequeued first</p>
          </div>
          <div className="w-[100px]"></div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Operations</CardTitle>
              <CardDescription>Enqueue and dequeue elements from the priority queue</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="value">Value</Label>
                  <Input
                    id="value"
                    ref={inputRef}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Enter a value"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="priority">Priority (1-10)</Label>
                  <div className="flex items-center mt-1 space-x-2">
                    <Input
                      id="priority"
                      type="range"
                      min="1"
                      max="10"
                      value={priority}
                      onChange={(e) => setPriority(Number.parseInt(e.target.value))}
                      className="flex-1"
                    />
                    <span className="w-8 text-center font-medium">{priority}</span>
                  </div>
                </div>

                <Button onClick={handleEnqueue} className="w-full flex items-center gap-1">
                  <ArrowRight className="h-4 w-4" />
                  Enqueue
                </Button>
              </div>

              <Button
                onClick={handleDequeue}
                variant="outline"
                className="w-full flex items-center gap-1"
                disabled={queue.length === 0}
              >
                <ArrowLeft className="h-4 w-4" />
                Dequeue
              </Button>

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
              <CardDescription>Higher priority elements are dequeued first</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg p-4 h-[400px] flex flex-col justify-center items-center overflow-hidden visualization-bg relative">
                {queue.length === 0 && (
                  <div className="text-muted-foreground absolute inset-0 flex items-center justify-center">
                    Priority queue is empty
                  </div>
                )}

                <div className="w-full flex items-center justify-start overflow-x-auto p-4">
                  <AnimatePresence>
                    {queue.map((item, index) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        transition={{ duration: 0.3 }}
                        className={`min-w-[120px] p-3 border rounded mx-2 bg-card shadow-sm flex flex-col items-center ${
                          index === 0 ? "border-primary border-2" : ""
                        }`}
                        style={{
                          borderColor: index === 0 ? "" : `hsl(${item.priority * 25}, 70%, 60%)`,
                        }}
                      >
                        <span className="font-mono">{item.value}</span>
                        <div
                          className="mt-2 px-2 py-1 rounded text-xs text-white"
                          style={{ backgroundColor: `hsl(${item.priority * 25}, 70%, 60%)` }}
                        >
                          Priority: {item.priority}
                        </div>
                        {index === 0 && (
                          <span className="mt-2 text-xs bg-primary/10 text-primary px-2 py-1 rounded">Next</span>
                        )}
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>

                {queue.length > 0 && (
                  <div className="w-full mt-8 text-center">
                    <div className="text-sm text-muted-foreground">
                      Elements are dequeued based on priority (higher priority first)
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Priority Queue Operations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <h3 className="font-semibold">Enqueue Operation</h3>
                <p className="text-sm text-muted-foreground">
                  Adds an element to the priority queue based on its priority.
                </p>
                <div className="bg-muted p-3 rounded text-sm font-mono">
                  enqueue(element, priority) {"{"}
                  <br />
                  &nbsp;&nbsp;const newItem = {"{"} value, priority {"}"}
                  <br />
                  &nbsp;&nbsp;// Find position based on priority
                  <br />
                  &nbsp;&nbsp;let i
                  <br />
                  &nbsp;&nbsp;for (i = 0; i &lt; queue.length; i++) {"{"}
                  <br />
                  &nbsp;&nbsp;&nbsp;&nbsp;if (priority &gt; queue[i].priority) {"{"}
                  <br />
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;break
                  <br />
                  &nbsp;&nbsp;&nbsp;&nbsp;{"}"}
                  <br />
                  &nbsp;&nbsp;{"}"}
                  <br />
                  &nbsp;&nbsp;queue.splice(i, 0, newItem)
                  <br />
                  {"}"}
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold">Dequeue Operation</h3>
                <p className="text-sm text-muted-foreground">Removes the highest priority element from the queue.</p>
                <div className="bg-muted p-3 rounded text-sm font-mono">
                  dequeue() {"{"}
                  <br />
                  &nbsp;&nbsp;if (isEmpty()) {"{"}
                  <br />
                  &nbsp;&nbsp;&nbsp;&nbsp;return "Queue Empty"
                  <br />
                  &nbsp;&nbsp;{"}"}
                  <br />
                  &nbsp;&nbsp;// Remove highest priority element
                  <br />
                  &nbsp;&nbsp;return queue.shift()
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
