"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { TrendingUp, Play, Pause, RotateCcw, Shuffle } from "lucide-react"

interface SubarrayState {
  left: number
  right: number
  mid: number
  sum: number
  maxLeft: number
  maxRight: number
  leftSum: number
  rightSum: number
  crossSum: number
  step: string
  phase: "divide" | "conquer" | "combine" | "complete"
  subproblems: { left: number; right: number; sum: number }[]
}

export default function MaxSubarrayVisualization() {
  const [array, setArray] = useState([-2, 1, -3, 4, -1, 2, 1, -5, 4])
  const [currentState, setCurrentState] = useState<SubarrayState | null>(null)
  const [isAnimating, setIsAnimating] = useState(false)
  const [animationSpeed, setAnimationSpeed] = useState(1000)
  const [customArray, setCustomArray] = useState("")
  const [result, setResult] = useState<{ sum: number; left: number; right: number } | null>(null)

  const generateRandomArray = () => {
    const size = Math.floor(Math.random() * 8) + 8 // 8-15 elements
    const arr = Array.from({ length: size }, () => Math.floor(Math.random() * 20) - 10) // -10 to 10
    setArray(arr)
    setResult(null)
    setCurrentState(null)
  }

  const setCustomArrayFromInput = () => {
    try {
      const newArray = customArray
        .split(",")
        .map((x) => Number.parseInt(x.trim()))
        .filter((x) => !isNaN(x))
      if (newArray.length > 0) {
        setArray(newArray)
        setCustomArray("")
        setResult(null)
        setCurrentState(null)
      }
    } catch (e) {
      // Invalid input, ignore
    }
  }

  const findMaxCrossingSubarray = async (arr: number[], low: number, mid: number, high: number) => {
    let leftSum = Number.NEGATIVE_INFINITY
    let sum = 0
    let maxLeft = mid

    // Find maximum subarray on left side
    setCurrentState({
      left: low,
      right: high,
      mid,
      sum: 0,
      maxLeft: -1,
      maxRight: -1,
      leftSum: Number.NEGATIVE_INFINITY,
      rightSum: Number.NEGATIVE_INFINITY,
      crossSum: 0,
      step: "Finding maximum crossing subarray: Looking at left side",
      phase: "combine",
      subproblems: [],
    })
    await new Promise((resolve) => setTimeout(resolve, animationSpeed))

    for (let i = mid; i >= low; i--) {
      sum += arr[i]
      if (sum > leftSum) {
        leftSum = sum
        maxLeft = i

        setCurrentState((prev) =>
          prev
            ? {
                ...prev,
                maxLeft: i,
                leftSum: sum,
                step: `Left side: Found new max sum ${sum} at index ${i}`,
              }
            : null,
        )
        await new Promise((resolve) => setTimeout(resolve, animationSpeed / 2))
      }
    }

    // Find maximum subarray on right side
    let rightSum = Number.NEGATIVE_INFINITY
    sum = 0
    let maxRight = mid + 1

    setCurrentState((prev) =>
      prev
        ? {
            ...prev,
            step: "Finding maximum crossing subarray: Looking at right side",
          }
        : null,
    )
    await new Promise((resolve) => setTimeout(resolve, animationSpeed))

    for (let i = mid + 1; i <= high; i++) {
      sum += arr[i]
      if (sum > rightSum) {
        rightSum = sum
        maxRight = i

        setCurrentState((prev) =>
          prev
            ? {
                ...prev,
                maxRight: i,
                rightSum: sum,
                step: `Right side: Found new max sum ${sum} at index ${i}`,
              }
            : null,
        )
        await new Promise((resolve) => setTimeout(resolve, animationSpeed / 2))
      }
    }

    const crossSum = leftSum + rightSum
    setCurrentState((prev) =>
      prev
        ? {
            ...prev,
            crossSum,
            step: `Cross sum: ${leftSum} + ${rightSum} = ${crossSum}`,
          }
        : null,
    )
    await new Promise((resolve) => setTimeout(resolve, animationSpeed))

    return { maxLeft, maxRight, sum: crossSum }
  }

  const findMaxSubarrayRecursive = async (
    arr: number[],
    low: number,
    high: number,
  ): Promise<{ sum: number; left: number; right: number }> => {
    // Base case: one element
    if (low === high) {
      setCurrentState((prev) => {
        const subproblems = prev?.subproblems || []
        return {
          left: low,
          right: high,
          mid: low,
          sum: arr[low],
          maxLeft: -1,
          maxRight: -1,
          leftSum: 0,
          rightSum: 0,
          crossSum: 0,
          step: `Base case: Single element at index ${low} with value ${arr[low]}`,
          phase: "conquer",
          subproblems: [...subproblems, { left: low, right: high, sum: arr[low] }],
        }
      })
      await new Promise((resolve) => setTimeout(resolve, animationSpeed))
      return { sum: arr[low], left: low, right: low }
    }

    // Divide
    const mid = Math.floor((low + high) / 2)
    setCurrentState((prev) => {
      return {
        left: low,
        right: high,
        mid,
        sum: 0,
        maxLeft: -1,
        maxRight: -1,
        leftSum: 0,
        rightSum: 0,
        crossSum: 0,
        step: `Dividing array at mid=${mid}: [${low}...${mid}] and [${mid + 1}...${high}]`,
        phase: "divide",
        subproblems: prev?.subproblems || [],
      }
    })
    await new Promise((resolve) => setTimeout(resolve, animationSpeed))

    // Conquer: recursively solve subproblems
    const leftResult = await findMaxSubarrayRecursive(arr, low, mid)
    const rightResult = await findMaxSubarrayRecursive(arr, mid + 1, high)

    // Combine: find max crossing subarray
    const crossResult = await findMaxCrossingSubarray(arr, low, mid, high)

    // Compare the three results
    setCurrentState((prev) =>
      prev
        ? {
            ...prev,
            step: `Comparing: Left sum=${leftResult.sum}, Right sum=${rightResult.sum}, Cross sum=${crossResult.sum}`,
          }
        : null,
    )
    await new Promise((resolve) => setTimeout(resolve, animationSpeed))

    if (leftResult.sum >= rightResult.sum && leftResult.sum >= crossResult.sum) {
      setCurrentState((prev) =>
        prev
          ? {
              ...prev,
              step: `Left subarray has maximum sum: ${leftResult.sum}`,
              sum: leftResult.sum,
            }
          : null,
      )
      await new Promise((resolve) => setTimeout(resolve, animationSpeed))
      return leftResult
    } else if (rightResult.sum >= leftResult.sum && rightResult.sum >= crossResult.sum) {
      setCurrentState((prev) =>
        prev
          ? {
              ...prev,
              step: `Right subarray has maximum sum: ${rightResult.sum}`,
              sum: rightResult.sum,
            }
          : null,
      )
      await new Promise((resolve) => setTimeout(resolve, animationSpeed))
      return rightResult
    } else {
      setCurrentState((prev) =>
        prev
          ? {
              ...prev,
              step: `Crossing subarray has maximum sum: ${crossResult.sum}`,
              sum: crossResult.sum,
            }
          : null,
      )
      await new Promise((resolve) => setTimeout(resolve, animationSpeed))
      return { sum: crossResult.sum, left: crossResult.maxLeft, right: crossResult.maxRight }
    }
  }

  const findMaxSubarray = async () => {
    if (isAnimating) return
    setIsAnimating(true)
    setResult(null)
    setCurrentState(null)

    try {
      const result = await findMaxSubarrayRecursive(array, 0, array.length - 1)
      setResult(result)

      setCurrentState({
        left: result.left,
        right: result.right,
        mid: -1,
        sum: result.sum,
        maxLeft: -1,
        maxRight: -1,
        leftSum: 0,
        rightSum: 0,
        crossSum: 0,
        step: `Maximum subarray found: Sum = ${result.sum}, Range = [${result.left}...${result.right}]`,
        phase: "complete",
        subproblems: [],
      })
    } catch (error) {
      console.error("Error in findMaxSubarray:", error)
    } finally {
      setIsAnimating(false)
    }
  }

  const reset = () => {
    setIsAnimating(false)
    setCurrentState(null)
    setResult(null)
  }

  const getElementClass = (index: number) => {
    if (!currentState) return "bg-gray-100"

    if (result && index >= result.left && index <= result.right) {
      return "bg-green-200 border-green-400"
    }

    if (currentState.phase === "divide" || currentState.phase === "conquer") {
      if (index >= currentState.left && index <= currentState.right) {
        return "bg-blue-100 border-blue-300"
      }
    } else if (currentState.phase === "combine") {
      if (index === currentState.mid) {
        return "bg-purple-200 border-purple-400"
      }
      if (index >= currentState.maxLeft && index <= currentState.mid && currentState.maxLeft !== -1) {
        return "bg-yellow-100 border-yellow-300"
      }
      if (index > currentState.mid && index <= currentState.maxRight && currentState.maxRight !== -1) {
        return "bg-orange-100 border-orange-300"
      }
    }

    return "bg-gray-100"
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3 mb-4">
            <TrendingUp className="h-8 w-8 text-green-600" />
            <h1 className="text-4xl font-bold tracking-tight">Maximum Subarray</h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Find contiguous subarray with maximum sum using divide and conquer
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Controls */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="speed">Animation Speed (ms)</Label>
                  <Input
                    id="speed"
                    type="number"
                    value={animationSpeed}
                    onChange={(e) => setAnimationSpeed(Math.max(100, Number.parseInt(e.target.value) || 1000))}
                    min="100"
                    max="3000"
                    step="100"
                  />
                </div>

                <div className="flex gap-2">
                  <Button onClick={findMaxSubarray} disabled={isAnimating} className="flex-1">
                    {isAnimating ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
                    {isAnimating ? "Running..." : "Find Max Subarray"}
                  </Button>
                  <Button onClick={reset} variant="outline" disabled={isAnimating}>
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                </div>

                <Button onClick={generateRandomArray} variant="outline" disabled={isAnimating} className="w-full">
                  <Shuffle className="h-4 w-4 mr-2" />
                  Random Array
                </Button>
              </CardContent>
            </Card>

            {/* Custom Array Input */}
            <Card>
              <CardHeader>
                <CardTitle>Custom Array</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="customArray">Enter comma-separated numbers</Label>
                  <Input
                    id="customArray"
                    value={customArray}
                    onChange={(e) => setCustomArray(e.target.value)}
                    placeholder="-2, 1, -3, 4, -1, 2, 1, -5, 4"
                    disabled={isAnimating}
                  />
                </div>
                <Button onClick={setCustomArrayFromInput} disabled={isAnimating} className="w-full">
                  Set Array
                </Button>
              </CardContent>
            </Card>

            {/* Result */}
            {result && (
              <Card>
                <CardHeader>
                  <CardTitle>Result</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div>
                      <span className="font-medium">Maximum Sum: </span>
                      <span className="text-lg font-bold">{result.sum}</span>
                    </div>
                    <div>
                      <span className="font-medium">Subarray: </span>
                      <span className="font-mono">[{array.slice(result.left, result.right + 1).join(", ")}]</span>
                    </div>
                    <div>
                      <span className="font-medium">Indices: </span>
                      <span className="font-mono">
                        [{result.left}...{result.right}]
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Array Visualization */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Array Visualization</CardTitle>
                <CardDescription>
                  Blue: Current subarray | Purple: Mid | Yellow/Orange: Crossing subarrays | Green: Result
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Array elements */}
                  <div className="flex flex-wrap gap-2 justify-center">
                    {array.map((value, index) => (
                      <div key={index} className="text-center">
                        <div className="text-xs text-muted-foreground mb-1">{index}</div>
                        <div
                          className={`w-12 h-12 border-2 rounded flex items-center justify-center font-medium ${getElementClass(index)}`}
                        >
                          {value}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Legend */}
                  {currentState && (
                    <div className="flex flex-wrap justify-center gap-4 text-sm mt-4">
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-blue-100 border border-blue-300 rounded"></div>
                        <span>Current Subarray</span>
                      </div>
                      {currentState.phase === "combine" && (
                        <>
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 bg-purple-200 border border-purple-400 rounded"></div>
                            <span>Mid Element</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 bg-yellow-100 border border-yellow-300 rounded"></div>
                            <span>Left Crossing</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 bg-orange-100 border border-orange-300 rounded"></div>
                            <span>Right Crossing</span>
                          </div>
                        </>
                      )}
                      {result && (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 bg-green-200 border border-green-400 rounded"></div>
                          <span>Max Subarray</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Current Step */}
            {currentState && (
              <Card>
                <CardHeader>
                  <CardTitle>Current Step</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">{currentState.step}</p>
                  {currentState.phase === "combine" && currentState.crossSum > 0 && (
                    <div className="mt-2 p-2 bg-blue-50 rounded text-sm">
                      <div>Left sum: {currentState.leftSum}</div>
                      <div>Right sum: {currentState.rightSum}</div>
                      <div>Cross sum: {currentState.crossSum}</div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Algorithm Explanation */}
            <Card>
              <CardHeader>
                <CardTitle>Algorithm Explanation</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold">Divide and Conquer Approach:</h4>
                  <ol className="text-sm text-muted-foreground list-decimal list-inside space-y-1 mt-2">
                    <li>Divide array into two halves</li>
                    <li>Recursively find maximum subarray in left half</li>
                    <li>Recursively find maximum subarray in right half</li>
                    <li>Find maximum subarray crossing the middle</li>
                    <li>Return the maximum of the three</li>
                  </ol>
                </div>
                <div>
                  <h4 className="font-semibold">Time Complexity:</h4>
                  <p className="text-sm text-muted-foreground">O(n log n) - each level takes O(n) work</p>
                </div>
                <div>
                  <h4 className="font-semibold">Space Complexity:</h4>
                  <p className="text-sm text-muted-foreground">O(log n) for the recursion stack</p>
                </div>
                <div>
                  <h4 className="font-semibold">Note:</h4>
                  <p className="text-sm text-muted-foreground">
                    While Kadane's algorithm solves this in O(n) time, the divide and conquer approach demonstrates an
                    important algorithmic technique.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
