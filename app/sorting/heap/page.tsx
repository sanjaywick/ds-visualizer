"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Play, Pause, RotateCcw, Shuffle, ArrowLeft } from "lucide-react"
import Link from "next/link"

interface SortStep {
  array: number[]
  heapSize: number
  comparing: number[]
  swapping: number[]
  building: boolean
  extracting: boolean
  message: string
}

export default function HeapSortPage() {
  const [arraySize, setArraySize] = useState(10)
  const [array, setArray] = useState<number[]>([])
  const [originalArray, setOriginalArray] = useState<number[]>([])
  const [isAnimating, setIsAnimating] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [steps, setSteps] = useState<SortStep[]>([])
  const [speed, setSpeed] = useState([600])
  const [comparisons, setComparisons] = useState(0)
  const [swaps, setSwaps] = useState(0)

  // Generate random array
  const generateRandomArray = () => {
    const newArray = Array.from({ length: arraySize }, () => Math.floor(Math.random() * 100) + 1)
    setArray([...newArray])
    setOriginalArray([...newArray])
    setCurrentStep(0)
    setSteps([])
    setComparisons(0)
    setSwaps(0)
  }

  // Generate heap sort steps
  const generateHeapSortSteps = (arr: number[]): SortStep[] => {
    const steps: SortStep[] = []
    const workingArray = [...arr]
    let totalComparisons = 0
    let totalSwaps = 0
    const n = workingArray.length

    steps.push({
      array: [...workingArray],
      heapSize: n,
      comparing: [],
      swapping: [],
      building: false,
      extracting: false,
      message: "Starting Heap Sort - First we'll build a max heap, then extract elements",
    })

    // Helper function to heapify
    const heapify = (arr: number[], n: number, i: number, isBuilding = false) => {
      let largest = i
      const left = 2 * i + 1
      const right = 2 * i + 2

      steps.push({
        array: [...arr],
        heapSize: n,
        comparing: [i],
        swapping: [],
        building: isBuilding,
        extracting: !isBuilding,
        message: `Heapifying at index ${i} (value: ${arr[i]})`,
      })

      // Check left child
      if (left < n) {
        totalComparisons++
        steps.push({
          array: [...arr],
          heapSize: n,
          comparing: [i, left],
          swapping: [],
          building: isBuilding,
          extracting: !isBuilding,
          message: `Comparing parent ${arr[i]} with left child ${arr[left]}`,
        })

        if (arr[left] > arr[largest]) {
          largest = left
          steps.push({
            array: [...arr],
            heapSize: n,
            comparing: [left],
            swapping: [],
            building: isBuilding,
            extracting: !isBuilding,
            message: `Left child ${arr[left]} is larger, updating largest`,
          })
        }
      }

      // Check right child
      if (right < n) {
        totalComparisons++
        steps.push({
          array: [...arr],
          heapSize: n,
          comparing: [largest, right],
          swapping: [],
          building: isBuilding,
          extracting: !isBuilding,
          message: `Comparing current largest ${arr[largest]} with right child ${arr[right]}`,
        })

        if (arr[right] > arr[largest]) {
          largest = right
          steps.push({
            array: [...arr],
            heapSize: n,
            comparing: [right],
            swapping: [],
            building: isBuilding,
            extracting: !isBuilding,
            message: `Right child ${arr[right]} is larger, updating largest`,
          })
        }
      }

      // Swap if needed
      if (largest !== i) {
        totalSwaps++
        steps.push({
          array: [...arr],
          heapSize: n,
          comparing: [],
          swapping: [i, largest],
          building: isBuilding,
          extracting: !isBuilding,
          message: `Swapping ${arr[i]} with ${arr[largest]} to maintain heap property`,
        })

        const temp = arr[i]
        arr[i] = arr[largest]
        arr[largest] = temp

        steps.push({
          array: [...arr],
          heapSize: n,
          comparing: [],
          swapping: [],
          building: isBuilding,
          extracting: !isBuilding,
          message: `Swap complete. Continue heapifying down from index ${largest}`,
        })

        heapify(arr, n, largest, isBuilding)
      }
    }

    // Build max heap
    steps.push({
      array: [...workingArray],
      heapSize: n,
      comparing: [],
      swapping: [],
      building: true,
      extracting: false,
      message: "Building max heap - starting from last non-leaf node",
    })

    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
      heapify(workingArray, n, i, true)
    }

    steps.push({
      array: [...workingArray],
      heapSize: n,
      comparing: [],
      swapping: [],
      building: false,
      extracting: false,
      message: "Max heap built! Now extracting elements one by one",
    })

    // Extract elements from heap
    for (let i = n - 1; i > 0; i--) {
      totalSwaps++

      steps.push({
        array: [...workingArray],
        heapSize: i + 1,
        comparing: [],
        swapping: [0, i],
        building: false,
        extracting: true,
        message: `Extracting max element ${workingArray[0]} and placing it at position ${i}`,
      })

      // Move current root to end
      const temp = workingArray[0]
      workingArray[0] = workingArray[i]
      workingArray[i] = temp

      steps.push({
        array: [...workingArray],
        heapSize: i,
        comparing: [],
        swapping: [],
        building: false,
        extracting: true,
        message: `Element ${temp} is now in its final sorted position. Heap size reduced to ${i}`,
      })

      // Heapify the reduced heap
      heapify(workingArray, i, 0, false)
    }

    steps.push({
      array: [...workingArray],
      heapSize: 0,
      comparing: [],
      swapping: [],
      building: false,
      extracting: false,
      message: `Sorting complete! Total comparisons: ${totalComparisons}, Total swaps: ${totalSwaps}`,
    })

    return steps
  }

  // Start sorting animation
  const startSorting = () => {
    if (steps.length === 0) {
      const sortSteps = generateHeapSortSteps(array)
      setSteps(sortSteps)
    }
    setIsAnimating(true)
    setIsPaused(false)
  }

  // Animation effect
  useEffect(() => {
    if (isAnimating && !isPaused && currentStep < steps.length - 1) {
      const timer = setTimeout(() => {
        setCurrentStep((prev) => prev + 1)
        const step = steps[currentStep + 1]
        if (step) {
          setArray(step.array)
          if (step.comparing.length > 0) {
            setComparisons((prev) => prev + 1)
          }
          if (step.swapping.length > 0) {
            setSwaps((prev) => prev + 1)
          }
        }
      }, speed[0])

      return () => clearTimeout(timer)
    } else if (currentStep >= steps.length - 1) {
      setIsAnimating(false)
    }
  }, [isAnimating, isPaused, currentStep, steps, speed])

  // Reset to original array
  const reset = () => {
    setArray([...originalArray])
    setCurrentStep(0)
    setSteps([])
    setIsAnimating(false)
    setIsPaused(false)
    setComparisons(0)
    setSwaps(0)
  }

  // Initialize with random array
  useEffect(() => {
    generateRandomArray()
  }, [arraySize])

  const currentStepData = steps[currentStep]
  const maxValue = Math.max(...array)

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link href="/sorting">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Sorting
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">Heap Sort Visualizer</h1>
            <p className="text-muted-foreground">
              Watch how a max heap is built and elements are extracted to create a sorted array
            </p>
          </div>
        </div>

        {/* Controls */}
        <Card>
          <CardHeader>
            <CardTitle>Controls</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Array Size: {arraySize}</Label>
                <Slider
                  value={[arraySize]}
                  onValueChange={(value) => setArraySize(value[0])}
                  max={15}
                  min={5}
                  step={1}
                  disabled={isAnimating}
                />
              </div>
              <div className="space-y-2">
                <Label>Animation Speed: {speed[0]}ms</Label>
                <Slider value={speed} onValueChange={setSpeed} max={1000} min={200} step={100} />
              </div>
              <div className="space-y-2">
                <Label>Custom Values (comma-separated)</Label>
                <Input
                  placeholder="e.g., 64,34,25,12,22,11,90"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      const values = e.currentTarget.value
                        .split(",")
                        .map((v) => Number.parseInt(v.trim()))
                        .filter((v) => !isNaN(v))
                      if (values.length > 0) {
                        setArray(values)
                        setOriginalArray(values)
                        setArraySize(values.length)
                        setCurrentStep(0)
                        setSteps([])
                        setComparisons(0)
                        setSwaps(0)
                      }
                    }
                  }}
                  disabled={isAnimating}
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button onClick={generateRandomArray} disabled={isAnimating}>
                <Shuffle className="h-4 w-4 mr-2" />
                Generate Random
              </Button>
              <Button onClick={startSorting} disabled={isAnimating}>
                <Play className="h-4 w-4 mr-2" />
                Start Sorting
              </Button>
              <Button onClick={() => setIsPaused(!isPaused)} disabled={!isAnimating} variant="outline">
                {isPaused ? <Play className="h-4 w-4 mr-2" /> : <Pause className="h-4 w-4 mr-2" />}
                {isPaused ? "Resume" : "Pause"}
              </Button>
              <Button onClick={reset} variant="outline">
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">{comparisons}</div>
              <p className="text-xs text-muted-foreground">Comparisons</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">{swaps}</div>
              <p className="text-xs text-muted-foreground">Swaps</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">{currentStep}</div>
              <p className="text-xs text-muted-foreground">Current Step</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">{currentStepData?.heapSize || 0}</div>
              <p className="text-xs text-muted-foreground">Heap Size</p>
            </CardContent>
          </Card>
        </div>

        {/* Visualization */}
        <Card>
          <CardHeader>
            <CardTitle>Array Visualization</CardTitle>
            {currentStepData && <CardDescription>{currentStepData.message}</CardDescription>}
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-center gap-1 h-64 p-4">
              {array.map((value, index) => {
                const isInHeap = currentStepData && index < currentStepData.heapSize
                const isComparing = currentStepData?.comparing.includes(index)
                const isSwapping = currentStepData?.swapping.includes(index)
                const isSorted = currentStepData && index >= currentStepData.heapSize

                return (
                  <div key={index} className="flex flex-col items-center gap-2 transition-all duration-300">
                    <div className="text-xs font-medium">{value}</div>
                    <div
                      className={`w-8 transition-all duration-300 ${
                        isSwapping
                          ? "bg-red-500"
                          : isComparing
                            ? "bg-yellow-500"
                            : isSorted
                              ? "bg-green-500"
                              : isInHeap
                                ? "bg-blue-500"
                                : "bg-gray-300"
                      }`}
                      style={{
                        height: `${(value / maxValue) * 200}px`,
                        minHeight: "20px",
                      }}
                    />
                    <div className="text-xs text-muted-foreground">{index}</div>
                  </div>
                )
              })}
            </div>

            {/* Legend */}
            <div className="flex justify-center gap-4 mt-4 flex-wrap">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-gray-300 rounded"></div>
                <span className="text-sm">Not in heap</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-blue-500 rounded"></div>
                <span className="text-sm">In heap</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                <span className="text-sm">Comparing</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-500 rounded"></div>
                <span className="text-sm">Swapping</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-500 rounded"></div>
                <span className="text-sm">Sorted</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Algorithm Info */}
        <Card>
          <CardHeader>
            <CardTitle>About Heap Sort</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Heap Sort is a comparison-based sorting algorithm that uses a binary heap data structure. It first builds
              a max heap from the input data, then repeatedly extracts the maximum element from the heap and places it
              at the end of the sorted array.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <h4 className="font-semibold mb-2">Time Complexity</h4>
                <ul className="text-sm space-y-1">
                  <li>Best Case: O(n log n)</li>
                  <li>Average Case: O(n log n)</li>
                  <li>Worst Case: O(n log n)</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Space Complexity</h4>
                <p className="text-sm">O(1) - In-place sorting</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Characteristics</h4>
                <ul className="text-sm space-y-1">
                  <li>Not stable sorting</li>
                  <li>In-place sorting</li>
                  <li>Consistent performance</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
