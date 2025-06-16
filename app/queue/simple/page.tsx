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

export default function SimpleQueueVisualizer() {
  const [queue, setQueue] = useState<string[]>([])
  const [inputValue, setInputValue] = useState("")
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

    setQueue([...queue, inputValue])
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
            <h1 className="text-3xl font-bold">Simple Queue Visualizer</h1>
            <p className="text-muted-foreground">A queue is a First-In-First-Out (FIFO) data structure</p>
          </div>
          <div className="w-[100px]"></div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Operations</CardTitle>
              <CardDescription>Enqueue and dequeue elements from the queue</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex space-x-2">
                <Input
                  ref={inputRef}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Enter a value"
                  className="flex-1"
                />
                <Button onClick={handleEnqueue} className="flex items-center gap-1">
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
              <CardDescription>First-In-First-Out (FIFO) principle</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg p-4 h-[400px] flex flex-col justify-center items-center overflow-hidden visualization-bg relative">
                {queue.length === 0 && (
                  <div className="text-muted-foreground absolute inset-0 flex items-center justify-center">
                    Queue is empty
                  </div>
                )}

                <div className="w-full flex items-center justify-start overflow-x-auto p-4">
                  <AnimatePresence>
                    {queue.map((item, index) => (
                      <motion.div
                        key={`${item}-${index}`}
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        transition={{ duration: 0.3 }}
                        className={`min-w-[100px] p-3 border rounded mx-2 bg-card shadow-sm flex flex-col items-center justify-between ${
                          index === 0 ? "border-primary border-2" : ""
                        }`}
                      >
                        <span className="font-mono">{item}</span>
                        {index === 0 && (
                          <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded mt-2">Front</span>
                        )}
                        {index === queue.length - 1 && (
                          <span className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded mt-2">Rear</span>
                        )}
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>

                {queue.length > 0 && (
                  <div className="w-full mt-8 flex justify-between px-4">
                    <div className="text-sm text-muted-foreground">Front (Dequeue from here)</div>
                    <div className="text-sm text-muted-foreground">Rear (Enqueue here)</div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Simple Queue Operations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <h3 className="font-semibold">Enqueue Operation</h3>
                <p className="text-sm text-muted-foreground">
                  Adds an element to the rear of the queue. If the queue is full, it results in a queue overflow
                  condition.
                </p>
                <div className="bg-muted p-3 rounded text-sm font-mono">
                  enqueue(element) {"{"}
                  <br />
                  &nbsp;&nbsp;if (queue.length === maxSize) {"{"}
                  <br />
                  &nbsp;&nbsp;&nbsp;&nbsp;return "Queue Overflow"
                  <br />
                  &nbsp;&nbsp;{"}"}
                  <br />
                  &nbsp;&nbsp;queue.push(element)
                  <br />
                  {"}"}
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold">Dequeue Operation</h3>
                <p className="text-sm text-muted-foreground">
                  Removes the front element from the queue. If the queue is empty, it results in a queue underflow
                  condition.
                </p>
                <div className="bg-muted p-3 rounded text-sm font-mono">
                  dequeue() {"{"}
                  <br />
                  &nbsp;&nbsp;if (queue.length === 0) {"{"}
                  <br />
                  &nbsp;&nbsp;&nbsp;&nbsp;return "Queue Underflow"
                  <br />
                  &nbsp;&nbsp;{"}"}
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
