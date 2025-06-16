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
  current: number
  comparing: number
  sortedBoundary: number
  inserting: boolean
  message: string
}

export default function InsertionSortPage() {
  const [arraySize, setArraySize] = useState(10)
  const [array, setArray] = useState<number[]>([])
  const [originalArray, setOriginalArray] = useState<number[]>([])
  const [isAnimating, setIsAnimating] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [steps, setSteps] = useState<SortStep[]>([])
  const [speed, setSpeed] = useState([500])
  const [comparisons, setComparisons] = useState(0)
  const [shifts, setShifts] = useState(0)

  // Generate random array
  const generateRandomArray = () => {
    const newArray = Array.from({ length: arraySize }, () => Math.floor(Math.random() * 100) + 1)
    setArray([...newArray])
    setOriginalArray([...newArray])
    setCurrentStep(0)
    setSteps([])
    setComparisons(0)
    setShifts(0)
  }

  // Generate insertion sort steps
  const generateInsertionSortSteps = (arr: number[]): SortStep[] => {
    const steps: SortStep[] = []
    const workingArray = [...arr]
    let totalComparisons = 0
    let totalShifts = 0

    steps.push({
      array: [...workingArray],
      current: -1,
      comparing: -1,
      sortedBoundary: 0,
      inserting: false,
      message: "Starting Insertion Sort - We'll build the sorted array one element at a time",
    })

    for (let i = 1; i < workingArray.length; i++) {
      const key = workingArray[i]

      steps.push({
        array: [...workingArray],
        current: i,
        comparing: -1,
        sortedBoundary: i - 1,
        inserting: false,
        message: `Taking element ${key} at index ${i} to insert into sorted portion`,
      })

      let j = i - 1

      // Find the correct position for the key
      while (j >= 0) {
        totalComparisons++

        steps.push({
          array: [...workingArray],
          current: i,
          comparing: j,
          sortedBoundary: i - 1,
          inserting: false,
          message: `Comparing ${key} with ${workingArray[j]} at index ${j}`,
        })

        if (workingArray[j] > key) {
          totalShifts++
          workingArray[j + 1] = workingArray[j]

          steps.push({
            array: [...workingArray],
            current: j + 1,
            comparing: j,
            sortedBoundary: i - 1,
            inserting: true,
            message: `${workingArray[j]} > ${key}, shifting ${workingArray[j]} to the right`,
          })

          j--
        } else {
          steps.push({
            array: [...workingArray],
            current: i,
            comparing: j,
            sortedBoundary: i - 1,
            inserting: false,
            message: `${workingArray[j]} ≤ ${key}, found correct position for ${key}`,
          })
          break
        }
      }

      // Insert the key at the correct position
      workingArray[j + 1] = key

      steps.push({
        array: [...workingArray],
        current: j + 1,
        comparing: -1,
        sortedBoundary: i,
        inserting: true,
        message: `Inserting ${key} at index ${j + 1}. Sorted portion now extends to index ${i}`,
      })
    }

    steps.push({
      array: [...workingArray],
      current: -1,
      comparing: -1,
      sortedBoundary: workingArray.length - 1,
      inserting: false,
      message: `Sorting complete! Total comparisons: ${totalComparisons}, Total shifts: ${totalShifts}`,
    })

    return steps
  }

  // Start sorting animation
  const startSorting = () => {
    if (steps.length === 0) {
      const sortSteps = generateInsertionSortSteps(array)
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
          if (step.inserting) {
            setShifts((prev) => prev + 1)
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
    setShifts(0)
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
            <h1 className="text-3xl font-bold">Insertion Sort Visualizer</h1>
            <p className="text-muted-foreground">
              Watch how elements are inserted into their correct position in the sorted portion
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
                        setShifts(0)
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
              <div className="text-2xl font-bold">{shifts}</div>
              <p className="text-xs text-muted-foreground">Shifts</p>
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
                const isCurrent = currentStepData?.current === index
                const isComparing = currentStepData?.comparing === index
                const isInserting = currentStepData?.inserting && currentStepData?.current === index

                return (
                  <div key={index} className="flex flex-col items-center gap-2 transition-all duration-300">
                    <div className="text-xs font-medium">{value}</div>
                    <div
                      className={`w-8 transition-all duration-300 ${
                        isInserting
                          ? "bg-green-500"
                          : isCurrent
                            ? "bg-red-500"
                            : isComparing
                              ? "bg-yellow-500"
                              : isSorted
                                ? "bg-green-300"
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
                <span className="text-sm">Current Element</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                <span className="text-sm">Comparing</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-500 rounded"></div>
                <span className="text-sm">Inserting</span>
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
            <CardTitle>About Insertion Sort</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Insertion Sort builds the final sorted array one item at a time. It works by taking elements from the
              unsorted portion and inserting them into their correct position in the sorted portion. It's similar to how
              you might sort playing cards in your hands.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <h4 className="font-semibold mb-2">Time Complexity</h4>
                <ul className="text-sm space-y-1">
                  <li>Best Case: O(n)</li>
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
                  <li>Stable sorting algorithm</li>
                  <li>In-place sorting</li>
                  <li>Adaptive (efficient for small datasets)</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
