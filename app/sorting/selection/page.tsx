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
  currentMin: number
  comparing: number
  sortedBoundary: number
  swapped: boolean
  message: string
}

export default function SelectionSortPage() {
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

  // Generate selection sort steps
  const generateSelectionSortSteps = (arr: number[]): SortStep[] => {
    const steps: SortStep[] = []
    const workingArray = [...arr]
    let totalComparisons = 0
    let totalSwaps = 0

    steps.push({
      array: [...workingArray],
      currentMin: -1,
      comparing: -1,
      sortedBoundary: -1,
      swapped: false,
      message: "Starting Selection Sort - We'll find the minimum element and place it at the beginning",
    })

    for (let i = 0; i < workingArray.length - 1; i++) {
      let minIndex = i

      steps.push({
        array: [...workingArray],
        currentMin: minIndex,
        comparing: -1,
        sortedBoundary: i - 1,
        swapped: false,
        message: `Pass ${i + 1}: Finding minimum element in unsorted portion (index ${i} to ${workingArray.length - 1})`,
      })

      for (let j = i + 1; j < workingArray.length; j++) {
        totalComparisons++

        steps.push({
          array: [...workingArray],
          currentMin: minIndex,
          comparing: j,
          sortedBoundary: i - 1,
          swapped: false,
          message: `Comparing ${workingArray[j]} with current minimum ${workingArray[minIndex]}`,
        })

        if (workingArray[j] < workingArray[minIndex]) {
          minIndex = j
          steps.push({
            array: [...workingArray],
            currentMin: minIndex,
            comparing: j,
            sortedBoundary: i - 1,
            swapped: false,
            message: `New minimum found! ${workingArray[j]} is smaller than ${workingArray[i]}`,
          })
        }
      }

      if (minIndex !== i) {
        totalSwaps++
        const temp = workingArray[i]
        workingArray[i] = workingArray[minIndex]
        workingArray[minIndex] = temp

        steps.push({
          array: [...workingArray],
          currentMin: i,
          comparing: -1,
          sortedBoundary: i,
          swapped: true,
          message: `Swapping ${workingArray[minIndex]} with ${workingArray[i]} to place minimum at position ${i}`,
        })
      } else {
        steps.push({
          array: [...workingArray],
          currentMin: i,
          comparing: -1,
          sortedBoundary: i,
          swapped: false,
          message: `Minimum element ${workingArray[i]} is already in correct position`,
        })
      }
    }

    steps.push({
      array: [...workingArray],
      currentMin: -1,
      comparing: -1,
      sortedBoundary: workingArray.length - 1,
      swapped: false,
      message: `Sorting complete! Total comparisons: ${totalComparisons}, Total swaps: ${totalSwaps}`,
    })

    return steps
  }

  // Start sorting animation
  const startSorting = () => {
    if (steps.length === 0) {
      const sortSteps = generateSelectionSortSteps(array)
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
          if (step.comparing >= 0) {
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
            <h1 className="text-3xl font-bold">Selection Sort Visualizer</h1>
            <p className="text-muted-foreground">
              Watch how the algorithm selects the minimum element and places it in the sorted portion
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
                  max={20}
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
                const isSorted = currentStepData && index <= currentStepData.sortedBoundary
                const isCurrentMin = currentStepData?.currentMin === index
                const isComparing = currentStepData?.comparing === index
                const isSwapped =
                  currentStepData?.swapped &&
                  (currentStepData?.currentMin === index || currentStepData?.comparing === index)

                return (
                  <div key={index} className="flex flex-col items-center gap-2 transition-all duration-300">
                    <div className="text-xs font-medium">{value}</div>
                    <div
                      className={`w-8 transition-all duration-300 ${
                        isSwapped
                          ? "bg-green-500"
                          : isSorted
                            ? "bg-green-300"
                            : isCurrentMin
                              ? "bg-red-500"
                              : isComparing
                                ? "bg-yellow-500"
                                : "bg-blue-500"
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
                <div className="w-4 h-4 bg-blue-500 rounded"></div>
                <span className="text-sm">Unsorted</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-500 rounded"></div>
                <span className="text-sm">Current Min</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                <span className="text-sm">Comparing</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-500 rounded"></div>
                <span className="text-sm">Swapped</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-300 rounded"></div>
                <span className="text-sm">Sorted</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Algorithm Info */}
        <Card>
          <CardHeader>
            <CardTitle>About Selection Sort</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Selection Sort divides the input list into two parts: a sorted portion at the left end and an unsorted
              portion at the right end. Initially, the sorted portion is empty and the unsorted portion is the entire
              list. The algorithm proceeds by finding the smallest element in the unsorted portion, exchanging it with
              the leftmost unsorted element, and moving the sorted boundary one element to the right.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <h4 className="font-semibold mb-2">Time Complexity</h4>
                <ul className="text-sm space-y-1">
                  <li>Best Case: O(n²)</li>
                  <li>Average Case: O(n²)</li>
                  <li>Worst Case: O(n²)</li>
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
                  <li>Minimum number of swaps</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
