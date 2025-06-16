"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ArrowLeft,
  ArrowRight,
  Info,
  ChevronLeft,
  RefreshCw,
  Settings,
  ArrowRightToLine,
  ArrowLeftToLine,
} from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface AnimationStep {
  type: "enqueue" | "dequeue" | "none"
  message: string
  complete: boolean
}

export default function CircularQueueVisualizer() {
  const [queueSize, setQueueSize] = useState(8)
  const [queue, setQueue] = useState<(string | null)[]>(Array(queueSize).fill(null))
  const [front, setFront] = useState(-1)
  const [rear, setRear] = useState(-1)
  const [inputValue, setInputValue] = useState("")
  const [error, setError] = useState("")
  const [showSettings, setShowSettings] = useState(false)
  const [animation, setAnimation] = useState<AnimationStep>({
    type: "none",
    message: "",
    complete: true,
  })
  const [visualizationType, setVisualizationType] = useState<"linear" | "circular">("linear")
  const [animationSpeed, setAnimationSpeed] = useState(1000)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])

  // Reset queue when size changes
  useEffect(() => {
    setQueue(Array(queueSize).fill(null))
    setFront(-1)
    setRear(-1)
    setError("")
  }, [queueSize])

  const isFull = () => {
    return (rear + 1) % queueSize === front
  }

  const isEmpty = () => {
    return front === -1
  }

  const getQueueSize = () => {
    if (isEmpty()) return 0
    if (front <= rear) return rear - front + 1
    return queueSize - front + rear + 1
  }

  const handleEnqueue = () => {
    if (!inputValue.trim()) {
      setError("Please enter a value to enqueue")
      return
    }

    if (isFull()) {
      setError("Queue is full! Cannot enqueue more elements.")
      return
    }

    // Start animation
    setAnimation({
      type: "enqueue",
      message: isEmpty()
        ? "Queue is empty. Setting both front and rear to 0."
        : `Calculating new rear position: (${rear} + 1) % ${queueSize} = ${(rear + 1) % queueSize}`,
      complete: false,
    })

    setTimeout(() => {
      const newQueue = [...queue]
      let newRear: number
      let newFront: number = front

      if (isEmpty()) {
        newFront = 0
        newRear = 0
      } else {
        newRear = (rear + 1) % queueSize
      }

      newQueue[newRear] = inputValue

      setAnimation({
        type: "enqueue",
        message: `Adding "${inputValue}" at position ${newRear}`,
        complete: false,
      })

      setTimeout(() => {
        setQueue(newQueue)
        setFront(newFront)
        setRear(newRear)
        setInputValue("")
        setError("")

        setTimeout(() => {
          setAnimation({
            type: "none",
            message: "",
            complete: true,
          })
        }, animationSpeed / 2)
      }, animationSpeed / 2)
    }, animationSpeed / 2)
  }

  const handleDequeue = () => {
    if (isEmpty()) {
      setError("Queue is empty! Cannot dequeue.")
      return
    }

    // Start animation
    setAnimation({
      type: "dequeue",
      message: `Removing element at front position ${front}`,
      complete: false,
    })

    setTimeout(() => {
      const newQueue = [...queue]
      const dequeuedValue = newQueue[front]
      newQueue[front] = null

      let newFront: number = front
      let newRear: number = rear

      if (front === rear) {
        // Last element
        setAnimation({
          type: "dequeue",
          message: "Last element removed. Resetting front and rear to -1.",
          complete: false,
        })
        newFront = -1
        newRear = -1
      } else {
        setAnimation({
          type: "dequeue",
          message: `Updating front: (${front} + 1) % ${queueSize} = ${(front + 1) % queueSize}`,
          complete: false,
        })
        newFront = (front + 1) % queueSize
      }

      setTimeout(() => {
        setQueue(newQueue)
        setFront(newFront)
        setRear(newRear)
        setError("")

        setTimeout(() => {
          setAnimation({
            type: "none",
            message: "",
            complete: true,
          })
        }, animationSpeed / 2)
      }, animationSpeed / 2)
    }, animationSpeed / 2)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleEnqueue()
    }
  }

  const handleSizeChange = (value: number[]) => {
    setQueueSize(value[0])
  }

  const handleSpeedChange = (value: number[]) => {
    setAnimationSpeed(value[0])
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
            <h1 className="text-3xl font-bold">Circular Queue Visualizer</h1>
            <p className="text-muted-foreground">A circular queue efficiently utilizes fixed-size memory</p>
          </div>
          <div className="w-[100px]">
            <Button variant="outline" size="sm" className="float-right" onClick={() => setShowSettings(!showSettings)}>
              <Settings className="h-4 w-4 mr-1" />
              Settings
            </Button>
          </div>
        </div>

        <AnimatePresence>
          {showSettings && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Queue Settings</CardTitle>
                  <CardDescription>Customize the circular queue parameters</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label htmlFor="queue-size">Queue Size: {queueSize}</Label>
                      </div>
                      <Slider
                        id="queue-size"
                        min={3}
                        max={12}
                        step={1}
                        defaultValue={[queueSize]}
                        onValueChange={handleSizeChange}
                        disabled={!isEmpty()}
                      />
                      {!isEmpty() && (
                        <p className="text-xs text-amber-600">
                          Queue must be empty to change its size. Please dequeue all elements first.
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label htmlFor="animation-speed">Animation Speed: {animationSpeed}ms</Label>
                      </div>
                      <Slider
                        id="animation-speed"
                        min={200}
                        max={2000}
                        step={100}
                        defaultValue={[animationSpeed]}
                        onValueChange={handleSpeedChange}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Operations</CardTitle>
              <CardDescription>Enqueue and dequeue elements from the circular queue</CardDescription>
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
                  disabled={!animation.complete}
                />
                <Button onClick={handleEnqueue} className="flex items-center gap-1" disabled={!animation.complete}>
                  <ArrowRight className="h-4 w-4" />
                  Enqueue
                </Button>
              </div>
              <Button
                onClick={handleDequeue}
                variant="outline"
                className="w-full flex items-center gap-1"
                disabled={isEmpty() || !animation.complete}
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

              {animation.message && (
                <Alert variant="info">
                  <Info className="h-4 w-4" />
                  <AlertTitle>Operation in Progress</AlertTitle>
                  <AlertDescription>{animation.message}</AlertDescription>
                </Alert>
              )}

              <div className="pt-2 border-t">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Front:</span>
                    <span className="font-mono">{front}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Rear:</span>
                    <span className="font-mono">{rear}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Size:</span>
                    <span className="font-mono">{getQueueSize()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Capacity:</span>
                    <span className="font-mono">{queueSize}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Visualization</CardTitle>
              <CardDescription>Circular queue with wrap-around behavior</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs
                defaultValue="linear"
                className="w-full"
                onValueChange={(v) => setVisualizationType(v as "linear" | "circular")}
              >
                <TabsList className="grid w-full grid-cols-2 mb-4">
                  <TabsTrigger value="linear">Linear View</TabsTrigger>
                  <TabsTrigger value="circular">Circular View</TabsTrigger>
                </TabsList>

                <TabsContent value="linear" className="mt-0">
                  <LinearQueueVisualization
                    queue={queue}
                    front={front}
                    rear={rear}
                    isEmpty={isEmpty()}
                    animation={animation}
                  />
                </TabsContent>

                <TabsContent value="circular" className="mt-0">
                  <CircularQueueVisualization
                    queue={queue}
                    front={front}
                    rear={rear}
                    isEmpty={isEmpty()}
                    animation={animation}
                  />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Circular Queue Operations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <h3 className="font-semibold">Enqueue Operation</h3>
                <p className="text-sm text-muted-foreground">
                  Adds an element to the rear of the circular queue, wrapping around if necessary.
                </p>
                <div className="bg-muted p-3 rounded text-sm font-mono">
                  enqueue(element) {"{"}
                  <br />
                  &nbsp;&nbsp;if (isFull()) {"{"} <span className="text-green-600">// Check if queue is full</span>
                  <br />
                  &nbsp;&nbsp;&nbsp;&nbsp;return "Queue Full"
                  <br />
                  &nbsp;&nbsp;{"}"}
                  <br />
                  &nbsp;&nbsp;if (isEmpty()) {"{"} <span className="text-green-600">// If queue is empty</span>
                  <br />
                  &nbsp;&nbsp;&nbsp;&nbsp;front = rear = 0{" "}
                  <span className="text-green-600">// Initialize pointers</span>
                  <br />
                  &nbsp;&nbsp;{"}"} else {"{"}
                  <br />
                  &nbsp;&nbsp;&nbsp;&nbsp;rear = (rear + 1) % size{" "}
                  <span className="text-green-600">// Circular increment</span>
                  <br />
                  &nbsp;&nbsp;{"}"}
                  <br />
                  &nbsp;&nbsp;queue[rear] = element <span className="text-green-600">// Store the element</span>
                  <br />
                  {"}"}
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold">Dequeue Operation</h3>
                <p className="text-sm text-muted-foreground">
                  Removes the front element from the circular queue, wrapping around if necessary.
                </p>
                <div className="bg-muted p-3 rounded text-sm font-mono">
                  dequeue() {"{"}
                  <br />
                  &nbsp;&nbsp;if (isEmpty()) {"{"} <span className="text-green-600">// Check if queue is empty</span>
                  <br />
                  &nbsp;&nbsp;&nbsp;&nbsp;return "Queue Empty"
                  <br />
                  &nbsp;&nbsp;{"}"}
                  <br />
                  &nbsp;&nbsp;const item = queue[front] <span className="text-green-600">// Get front element</span>
                  <br />
                  &nbsp;&nbsp;queue[front] = null <span className="text-green-600">// Clear the position</span>
                  <br />
                  &nbsp;&nbsp;if (front === rear) {"{"} <span className="text-green-600">// Last element</span>
                  <br />
                  &nbsp;&nbsp;&nbsp;&nbsp;front = rear = -1 <span className="text-green-600">// Reset pointers</span>
                  <br />
                  &nbsp;&nbsp;{"}"} else {"{"}
                  <br />
                  &nbsp;&nbsp;&nbsp;&nbsp;front = (front + 1) % size{" "}
                  <span className="text-green-600">// Circular increment</span>
                  <br />
                  &nbsp;&nbsp;{"}"}
                  <br />
                  &nbsp;&nbsp;return item
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

interface QueueVisualizationProps {
  queue: (string | null)[]
  front: number
  rear: number
  isEmpty: boolean
  animation: AnimationStep
}

function LinearQueueVisualization({ queue, front, rear, isEmpty, animation }: QueueVisualizationProps) {
  return (
    <div className="border rounded-lg p-4 h-[400px] flex flex-col justify-center items-center bg-muted/30 relative">
      {isEmpty && (
        <div className="text-muted-foreground absolute inset-0 flex items-center justify-center">
          Circular queue is empty
        </div>
      )}

      <div className="w-full flex flex-col items-center justify-center">
        {/* Wrap-around indicator */}
        {!isEmpty && front > rear && (
          <div className="w-full flex justify-between mb-4">
            <motion.div className="flex items-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <ArrowLeftToLine className="h-5 w-5 text-blue-500" />
              <div className="h-0.5 w-16 bg-blue-500 rounded-full ml-1"></div>
            </motion.div>
            <motion.div className="flex items-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="h-0.5 w-16 bg-blue-500 rounded-full mr-1"></div>
              <ArrowRightToLine className="h-5 w-5 text-blue-500" />
            </motion.div>
          </div>
        )}

        {/* Queue cells */}
        <div className="flex w-full justify-center mb-8">
          <div className="flex border border-dashed rounded overflow-hidden">
            {queue.map((item, index) => {
              const isFront = index === front && front !== -1
              const isRear = index === rear && rear !== -1
              const isActive =
                !isEmpty &&
                ((front <= rear && index >= front && index <= rear) ||
                  (front > rear && (index >= front || index <= rear)))
              const isHighlighted =
                (animation.type === "enqueue" && index === (rear + 1) % queue.length && !isEmpty) ||
                (animation.type === "dequeue" && index === front)

              return (
                <motion.div
                  key={index}
                  className={`w-12 h-12 flex items-center justify-center border-r last:border-r-0 relative
                    ${isActive ? "bg-card" : "bg-muted/30"}
                    ${isFront ? "border-l-2 border-l-green-500" : ""}
                    ${isRear ? "border-r-2 border-r-blue-500" : ""}
                    ${isHighlighted ? "ring-2 ring-yellow-400" : ""}
                  `}
                  initial={{ opacity: 0 }}
                  animate={{
                    opacity: 1,
                    scale: isHighlighted ? 1.1 : 1,
                    zIndex: isHighlighted ? 10 : 1,
                  }}
                >
                  {item !== null ? (
                    <span className="font-mono text-sm">{item}</span>
                  ) : (
                    <span className="text-muted-foreground text-xs">Empty</span>
                  )}
                  <div className="absolute -bottom-6 text-xs">
                    <span className="text-muted-foreground">{index}</span>
                  </div>
                  {isFront && (
                    <div className="absolute -top-6">
                      <span className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 px-1 py-0.5 rounded text-xs">
                        Front
                      </span>
                    </div>
                  )}
                  {isRear && (
                    <div className="absolute -top-6">
                      <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-1 py-0.5 rounded text-xs">
                        Rear
                      </span>
                    </div>
                  )}
                </motion.div>
              )
            })}
          </div>
        </div>

        {/* Memory explanation */}
        {!isEmpty && (
          <div className="text-sm text-center max-w-md">
            <p className="text-muted-foreground mb-2">
              {front <= rear ? (
                <>
                  Elements occupy positions from index <b>{front}</b> to <b>{rear}</b>
                </>
              ) : (
                <>
                  Elements wrap around from index <b>{front}</b> to the end and from 0 to <b>{rear}</b>
                </>
              )}
            </p>
            <div className="flex justify-center gap-2 text-xs">
              <span className="flex items-center">
                <span className="w-3 h-3 inline-block bg-card border mr-1"></span> Used
              </span>
              <span className="flex items-center">
                <span className="w-3 h-3 inline-block bg-muted/30 border mr-1"></span> Empty
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function CircularQueueVisualization({ queue, front, rear, isEmpty, animation }: QueueVisualizationProps) {
  return (
    <div className="border rounded-lg p-4 h-[400px] flex flex-col justify-center items-center bg-muted/30 relative">
      {isEmpty && (
        <div className="text-muted-foreground absolute inset-0 flex items-center justify-center">
          Circular queue is empty
        </div>
      )}

      <div className="relative w-[300px] h-[300px] flex items-center justify-center">
        <div className="absolute inset-0 flex items-center justify-center">
          <RefreshCw className="h-8 w-8 text-muted-foreground/20" />
        </div>

        {queue.map((item, index) => {
          // Fix the angle calculation - start from top and go clockwise
          const angle = (index * (360 / queue.length) - 90) * (Math.PI / 180) // -90 to start from top
          const radius = 120
          const x = radius * Math.cos(angle)
          const y = radius * Math.sin(angle)

          const isHighlighted =
            (animation.type === "enqueue" && index === (rear + 1) % queue.length && !isEmpty) ||
            (animation.type === "dequeue" && index === front)

          const isActive =
            !isEmpty &&
            ((front <= rear && index >= front && index <= rear) || (front > rear && (index >= front || index <= rear)))

          return (
            <motion.div
              key={index}
              initial={{ opacity: 0 }}
              animate={{
                opacity: 1,
                scale: isHighlighted ? 1.1 : 1,
                zIndex: isHighlighted ? 10 : 1,
              }}
              className="absolute"
              style={{
                left: `calc(50% + ${x}px)`,
                top: `calc(50% + ${y}px)`,
                transform: "translate(-50%, -50%)",
              }}
            >
              <div
                className={`w-16 h-16 flex items-center justify-center rounded-full border-2 text-xs
          ${item !== null ? (isActive ? "bg-card shadow-md border-solid" : "bg-muted/50 border-dashed") : "bg-muted/30 border-dashed"}
          ${index === front && front !== -1 ? "border-green-500 ring-2 ring-green-200" : ""} 
          ${index === rear && rear !== -1 ? "border-blue-500 ring-2 ring-blue-200" : ""}
          ${isHighlighted ? "ring-2 ring-yellow-400 ring-offset-2" : ""}
          ${item !== null && !isActive ? "border-muted-foreground/50" : item !== null ? "border-primary" : "border-muted-foreground"}`}
              >
                {item !== null ? (
                  <span
                    className={`font-mono text-sm font-medium ${isActive ? "text-foreground" : "text-muted-foreground/50"}`}
                  >
                    {item}
                  </span>
                ) : (
                  <span className="text-muted-foreground text-xs">Empty</span>
                )}
              </div>
              <div className="absolute top-full mt-1 left-1/2 transform -translate-x-1/2 text-xs text-center">
                <div className="text-muted-foreground mb-1">{index}</div>
                {index === front && front !== -1 && (
                  <span className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 px-1 py-0.5 rounded text-xs">
                    Front
                  </span>
                )}
                {index === rear && rear !== -1 && (
                  <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-1 py-0.5 rounded text-xs mt-1 block">
                    Rear
                  </span>
                )}
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
