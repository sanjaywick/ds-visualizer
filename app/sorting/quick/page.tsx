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
  pivot: number
  left: number
  right: number
  comparing: number[]
  partitionBoundary: number
  swapped: boolean
  message: string
}

export default function QuickSortPage() {
  const [arraySize, setArraySize] = useState(10)
  const [array, setArray] = useState<number[]>([])
  const [originalArray, setOriginalArray] = useState<number[]>([])
  const [isAnimating, setIsAnimating] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [steps, setSteps] = useState<SortStep[]>([])
  const [speed, setSpeed] = useState([500])
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

  // Generate quick sort steps
  const generateQuickSortSteps = (arr: number[]): SortStep[] => {
    const steps: SortStep[] = []
    const workingArray = [...arr]
    let totalComparisons = 0
    let totalSwaps = 0

    steps.push({
      array: [...workingArray],
      pivot: -1,
      left: -1,
      right: -1,
      comparing: [],
      partitionBoundary: -1,
      swapped: false,
      message: "Starting Quick Sort - We'll use divide and conquer with pivot partitioning",
    })

    const quickSort = (low: number, high: number, depth = 0) => {
      if (low < high) {
        const indent = "  ".repeat(depth)

        steps.push({
          array: [...workingArray],
          pivot: -1,
          left: low,
          right: high,
          comparing: [],
          partitionBoundary: -1,
          swapped: false,
          message: `${indent}Sorting subarray from index ${low} to ${high}`,
        })

        // Choose pivot (last element)
        const pivotIndex = high
        const pivotValue = workingArray[pivotIndex]

        steps.push({
          array: [...workingArray],
          pivot: pivotIndex,
          left: low,
          right: high,
          comparing: [],
          partitionBoundary: -1,
          swapped: false,
          message: `${indent}Choosing pivot: ${pivotValue} at index ${pivotIndex}`,
        })

        // Partition
        let i = low - 1

        for (let j = low; j < high; j++) {
          totalComparisons++

          steps.push({
            array: [...workingArray],
            pivot: pivotIndex,
            left: low,
            right: high,
            comparing: [j, pivotIndex],
            partitionBoundary: i,
            swapped: false,
            message: `${indent}Comparing ${workingArray[j]} with pivot ${pivotValue}`,
          })

          if (workingArray[j] < pivotValue) {
            i++
            if (i !== j) {
              totalSwaps++
              // Swap elements
              const temp = workingArray[i]
              workingArray[i] = workingArray[j]
              workingArray[j] = temp

              steps.push({
                array: [...workingArray],
                pivot: pivotIndex,
                left: low,
                right: high,
                comparing: [i, j],
                partitionBoundary: i,
                swapped: true,
                message: `${indent}${workingArray[i]} < ${pivotValue}, swapping with element at partition boundary`,
              })
            }
          }
        }

        // Place pivot in correct position
        totalSwaps++
        const temp = workingArray[i + 1]
        workingArray[i + 1] = workingArray[high]
        workingArray[high] = temp

        const newPivotIndex = i + 1

        steps.push({
          array: [...workingArray],
          pivot: newPivotIndex,
          left: low,
          right: high,
          comparing: [],
          partitionBoundary: newPivotIndex,
          swapped: true,
          message: `${indent}Placing pivot ${pivotValue} in its correct position at index ${newPivotIndex}`,
        })

        // Recursively sort left and right subarrays
        quickSort(low, newPivotIndex - 1, depth + 1)
        quickSort(newPivotIndex + 1, high, depth + 1)
      }
    }

    quickSort(0, workingArray.length - 1)

    steps.push({
      array: [...workingArray],
      pivot: -1,
      left: -1,
      right: -1,
      comparing: [],
      partitionBoundary: -1,
      swapped: false,
      message: `Sorting complete! Total comparisons: ${totalComparisons}, Total swaps: ${totalSwaps}`,
    })

    return steps
  }

  // Start sorting animation
  const startSorting = () => {
    if (steps.length === 0) {
      const sortSteps = generateQuickSortSteps(array)
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
          if (step.swapped) {
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
            <h1 className="text-3xl font-bold">Quick Sort Visualizer</h1>
            <p className="text-muted-foreground">Watch the divide and conquer approach with pivot partitioning</p>
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
                <Slider value={speed} onValueChange={setSpeed} max={1000} min={100} step={100} />
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
              <div className="text-2xl font-bold">{steps.length}</div>
              <p className="text-xs text-muted-foreground">Total Steps</p>
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
                const isPivot = currentStepData?.pivot === index
                const isInRange = currentStepData && index >= currentStepData.left && index <= currentStepData.right
                const isComparing = currentStepData?.comparing.includes(index)
                const isAtPartitionBoundary = currentStepData?.partitionBoundary === index
                const isSwapped = currentStepData?.swapped && currentStepData?.comparing.includes(index)

                return (
                  <div key={index} className="flex flex-col items-center gap-2 transition-all duration-300">
                    <div className="text-xs font-medium">{value}</div>
                    <div
                      className={`w-8 transition-all duration-300 ${
                        isSwapped
                          ? "bg-green-500"
                          : isPivot
                            ? "bg-red-500"
                            : isComparing
                              ? "bg-yellow-500"
                              : isAtPartitionBoundary
                                ? "bg-purple-500"
                                : isInRange
                                  ? "bg-blue-400"
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
                <span className="text-sm">Not in range</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-blue-400 rounded"></div>
                <span className="text-sm">Current range</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-500 rounded"></div>
                <span className="text-sm">Pivot</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                <span className="text-sm">Comparing</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-purple-500 rounded"></div>
                <span className="text-sm">Partition boundary</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-500 rounded"></div>
                <span className="text-sm">Swapped</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Algorithm Info */}
        <Card>
          <CardHeader>
            <CardTitle>About Quick Sort</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Quick Sort is a highly efficient divide-and-conquer algorithm. It works by selecting a 'pivot' element
              from the array and partitioning the other elements into two sub-arrays, according to whether they are less
              than or greater than the pivot. The sub-arrays are then sorted recursively.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <h4 className="font-semibold mb-2">Time Complexity</h4>
                <ul className="text-sm space-y-1">
                  <li>Best Case: O(n log n)</li>
                  <li>Average Case: O(n log n)</li>
                  <li>Worst Case: O(n²)</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Space Complexity</h4>
                <p className="text-sm">O(log n) - Recursive call stack</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Characteristics</h4>
                <ul className="text-sm space-y-1">
                  <li>Not stable sorting</li>
                  <li>In-place sorting</li>
                  <li>Divide and conquer</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
