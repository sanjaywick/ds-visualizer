"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowDown, ArrowUp, Info } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { motion, AnimatePresence } from "framer-motion"

export default function StackVisualizer() {
  const [stack, setStack] = useState<string[]>([])
  const [inputValue, setInputValue] = useState("")
  const [error, setError] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])

  const handlePush = () => {
    if (!inputValue.trim()) {
      setError("Please enter a value to push")
      return
    }

    setStack([...stack, inputValue])
    setInputValue("")
    setError("")
  }

  const handlePop = () => {
    if (stack.length === 0) {
      setError("Stack underflow! Cannot pop from an empty stack.")
      return
    }

    setStack(stack.slice(0, -1))
    setError("")
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handlePush()
    }
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold">Stack Visualizer</h1>
          <p className="text-muted-foreground">A stack is a Last-In-First-Out (LIFO) data structure</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Operations</CardTitle>
              <CardDescription>Push and pop elements from the stack</CardDescription>
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
                <Button onClick={handlePush} className="flex items-center gap-1">
                  <ArrowDown className="h-4 w-4" />
                  Push
                </Button>
              </div>
              <Button
                onClick={handlePop}
                variant="outline"
                className="w-full flex items-center gap-1"
                disabled={stack.length === 0}
              >
                <ArrowUp className="h-4 w-4" />
                Pop
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
              <CardDescription>Last-In-First-Out (LIFO) principle</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg p-4 h-[400px] flex flex-col-reverse justify-start items-center overflow-y-auto visualization-bg relative">
                {stack.length === 0 && (
                  <div className="text-muted-foreground absolute inset-0 flex items-center justify-center">
                    Stack is empty
                  </div>
                )}

                <AnimatePresence>
                  {stack.map((item, index) => (
                    <motion.div
                      key={`${item}-${stack.length - index - 1}`}
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.3 }}
                      className={`w-full p-3 border rounded mb-2 bg-card shadow-sm flex items-center justify-between ${
                        index === stack.length - 1 ? "border-primary border-2" : ""
                      }`}
                    >
                      <span className="font-mono">{item}</span>
                      {index === stack.length - 1 && (
                        <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">Top</span>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Stack Operations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <h3 className="font-semibold">Push Operation</h3>
                <p className="text-sm text-muted-foreground">
                  Adds an element to the top of the stack. If the stack is full, it results in a stack overflow
                  condition.
                </p>
                <div className="bg-muted p-3 rounded text-sm font-mono">
                  push(element) {"{"}
                  <br />
                  &nbsp;&nbsp;if (stack.length === maxSize) {"{"}
                  <br />
                  &nbsp;&nbsp;&nbsp;&nbsp;return "Stack Overflow"
                  <br />
                  &nbsp;&nbsp;{"}"}
                  <br />
                  &nbsp;&nbsp;stack.push(element)
                  <br />
                  {"}"}
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold">Pop Operation</h3>
                <p className="text-sm text-muted-foreground">
                  Removes the top element from the stack. If the stack is empty, it results in a stack underflow
                  condition.
                </p>
                <div className="bg-muted p-3 rounded text-sm font-mono">
                  pop() {"{"}
                  <br />
                  &nbsp;&nbsp;if (stack.length === 0) {"{"}
                  <br />
                  &nbsp;&nbsp;&nbsp;&nbsp;return "Stack Underflow"
                  <br />
                  &nbsp;&nbsp;{"}"}
                  <br />
                  &nbsp;&nbsp;return stack.pop()
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
