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
  leftArray: number[]
  rightArray: number[]
  merging: boolean
  leftPointer: number
  rightPointer: number
  mergeIndex: number
  dividing: boolean
  currentRange: [number, number]
  message: string
}

export default function MergeSortPage() {
  const [arraySize, setArraySize] = useState(8)
  const [array, setArray] = useState<number[]>([])
  const [originalArray, setOriginalArray] = useState<number[]>([])
  const [isAnimating, setIsAnimating] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [steps, setSteps] = useState<SortStep[]>([])
  const [speed, setSpeed] = useState([800])
  const [comparisons, setComparisons] = useState(0)
  const [merges, setMerges] = useState(0)

  // Generate random array
  const generateRandomArray = () => {
    const newArray = Array.from({ length: arraySize }, () => Math.floor(Math.random() * 100) + 1)
    setArray([...newArray])
    setOriginalArray([...newArray])
    setCurrentStep(0)
    setSteps([])
    setComparisons(0)
    setMerges(0)
  }

  // Generate merge sort steps
  const generateMergeSortSteps = (arr: number[]): SortStep[] => {
    const steps: SortStep[] = []
    const workingArray = [...arr]
    let totalComparisons = 0
    let totalMerges = 0

    steps.push({
      array: [...workingArray],
      leftArray: [],
      rightArray: [],
      merging: false,
      leftPointer: -1,
      rightPointer: -1,
      mergeIndex: -1,
      dividing: false,
      currentRange: [0, workingArray.length - 1],
      message: "Starting Merge Sort - We'll divide the array and then merge sorted subarrays",
    })

    const mergeSort = (left: number, right: number, depth = 0) => {
      if (left < right) {
        const indent = "  ".repeat(depth)

        steps.push({
          array: [...workingArray],
          leftArray: [],
          rightArray: [],
          merging: false,
          leftPointer: -1,
          rightPointer: -1,
          mergeIndex: -1,
          dividing: true,
          currentRange: [left, right],
          message: `${indent}Dividing array from index ${left} to ${right}`,
        })

        const mid = Math.floor((left + right) / 2)

        steps.push({
          array: [...workingArray],
          leftArray: [],
          rightArray: [],
          merging: false,
          leftPointer: -1,
          rightPointer: -1,
          mergeIndex: -1,
          dividing: true,
          currentRange: [left, right],
          message: `${indent}Split point at index ${mid}. Left: [${left}..${mid}], Right: [${mid + 1}..${right}]`,
        })

        // Recursively sort left and right halves
        mergeSort(left, mid, depth + 1)
        mergeSort(mid + 1, right, depth + 1)

        // Merge the sorted halves
        merge(left, mid, right, depth)
      }
    }

    const merge = (left: number, mid: number, right: number, depth: number) => {
      const indent = "  ".repeat(depth)
      const leftArr = workingArray.slice(left, mid + 1)
      const rightArr = workingArray.slice(mid + 1, right + 1)

      steps.push({
        array: [...workingArray],
        leftArray: leftArr,
        rightArray: rightArr,
        merging: true,
        leftPointer: 0,
        rightPointer: 0,
        mergeIndex: left,
        dividing: false,
        currentRange: [left, right],
        message: `${indent}Merging sorted subarrays: [${leftArr.join(",")}] and [${rightArr.join(",")}]`,
      })

      let i = 0,
        j = 0,
        k = left

      while (i < leftArr.length && j < rightArr.length) {
        totalComparisons++

        steps.push({
          array: [...workingArray],
          leftArray: leftArr,
          rightArray: rightArr,
          merging: true,
          leftPointer: i,
          rightPointer: j,
          mergeIndex: k,
          dividing: false,
          currentRange: [left, right],
          message: `${indent}Comparing ${leftArr[i]} and ${rightArr[j]}`,
        })

        if (leftArr[i] <= rightArr[j]) {
          workingArray[k] = leftArr[i]
          i++
        } else {
          workingArray[k] = rightArr[j]
          j++
        }

        totalMerges++
        steps.push({
          array: [...workingArray],
          leftArray: leftArr,
          rightArray: rightArr,
          merging: true,
          leftPointer: i,
          rightPointer: j,
          mergeIndex: k,
          dividing: false,
          currentRange: [left, right],
          message: `${indent}Placed ${workingArray[k]} at index ${k}`,
        })

        k++
      }

      // Copy remaining elements
      while (i < leftArr.length) {
        workingArray[k] = leftArr[i]
        totalMerges++

        steps.push({
          array: [...workingArray],
          leftArray: leftArr,
          rightArray: rightArr,
          merging: true,
          leftPointer: i,
          rightPointer: j,
          mergeIndex: k,
          dividing: false,
          currentRange: [left, right],
          message: `${indent}Copying remaining element ${leftArr[i]} from left array`,
        })

        i++
        k++
      }

      while (j < rightArr.length) {
        workingArray[k] = rightArr[j]
        totalMerges++

        steps.push({
          array: [...workingArray],
          leftArray: leftArr,
          rightArray: rightArr,
          merging: true,
          leftPointer: i,
          rightPointer: j,
          mergeIndex: k,
          dividing: false,
          currentRange: [left, right],
          message: `${indent}Copying remaining element ${rightArr[j]} from right array`,
        })

        j++
        k++
      }

      steps.push({
        array: [...workingArray],
        leftArray: [],
        rightArray: [],
        merging: false,
        leftPointer: -1,
        rightPointer: -1,
        mergeIndex: -1,
        dividing: false,
        currentRange: [left, right],
        message: `${indent}Merge complete for range [${left}..${right}]`,
      })
    }

    mergeSort(0, workingArray.length - 1)

    steps.push({
      array: [...workingArray],
      leftArray: [],
      rightArray: [],
      merging: false,
      leftPointer: -1,
      rightPointer: -1,
      mergeIndex: -1,
      dividing: false,
      currentRange: [0, workingArray.length - 1],
      message: `Sorting complete! Total comparisons: ${totalComparisons}, Total merges: ${totalMerges}`,
    })

    return steps
  }

  // Start sorting animation
  const startSorting = () => {
    if (steps.length === 0) {
      const sortSteps = generateMergeSortSteps(array)
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
          if (step.leftPointer >= 0 && step.rightPointer >= 0) {
            setComparisons((prev) => prev + 1)
          }
          if (step.merging && step.mergeIndex >= 0) {
            setMerges((prev) => prev + 1)
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
    setMerges(0)
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
            <h1 className="text-3xl font-bold">Merge Sort Visualizer</h1>
            <p className="text-muted-foreground">
              Watch the divide and conquer approach with merging of sorted subarrays
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
                  max={16}
                  min={4}
                  step={1}
                  disabled={isAnimating}
                />
              </div>
              <div className="space-y-2">
                <Label>Animation Speed: {speed[0]}ms</Label>
                <Slider value={speed} onValueChange={setSpeed} max={1500} min={200} step={100} />
              </div>
              <div className="space-y-2">
                <Label>Custom Values (comma-separated)</Label>
                <Input
                  placeholder="e.g., 64,34,25,12,22,11,90,88"
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
                        setMerges(0)
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
              <div className="text-2xl font-bold">{merges}</div>
              <p className="text-xs text-muted-foreground">Merges</p>
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
                const isInCurrentRange =
                  currentStepData &&
                  index >= currentStepData.currentRange[0] &&
                  index <= currentStepData.currentRange[1]
                const isMergeIndex = currentStepData?.mergeIndex === index

                return (
                  <div key={index} className="flex flex-col items-center gap-2 transition-all duration-300">
                    <div className="text-xs font-medium">{value}</div>
                    <div
                      className={`w-8 transition-all duration-300 ${
                        isMergeIndex ? "bg-green-500" : isInCurrentRange ? "bg-blue-400" : "bg-gray-300"
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

            {/* Subarrays visualization */}
            {currentStepData?.merging && (
              <div className="mt-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold mb-2">Left Subarray</h4>
                    <div className="flex gap-1 justify-center">
                      {currentStepData.leftArray.map((value, index) => (
                        <div
                          key={index}
                          className={`w-8 h-8 flex items-center justify-center text-xs font-medium rounded ${
                            index === currentStepData.leftPointer ? "bg-yellow-500" : "bg-blue-200"
                          }`}
                        >
                          {value}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Right Subarray</h4>
                    <div className="flex gap-1 justify-center">
                      {currentStepData.rightArray.map((value, index) => (
                        <div
                          key={index}
                          className={`w-8 h-8 flex items-center justify-center text-xs font-medium rounded ${
                            index === currentStepData.rightPointer ? "bg-yellow-500" : "bg-blue-200"
                          }`}
                        >
                          {value}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Legend */}
            <div className="flex justify-center gap-4 mt-4 flex-wrap">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-gray-300 rounded"></div>
                <span className="text-sm">Not in current range</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-blue-400 rounded"></div>
                <span className="text-sm">Current range</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                <span className="text-sm">Comparing</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-500 rounded"></div>
                <span className="text-sm">Merging</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Algorithm Info */}
        <Card>
          <CardHeader>
            <CardTitle>About Merge Sort</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Merge Sort is a divide-and-conquer algorithm that divides the input array into two halves, recursively
              sorts both halves, and then merges the sorted halves. It's known for its stable performance and guaranteed
              O(n log n) time complexity.
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
                <p className="text-sm">O(n) - Additional space for merging</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Characteristics</h4>
                <ul className="text-sm space-y-1">
                  <li>Stable sorting algorithm</li>
                  <li>Divide and conquer</li>
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
