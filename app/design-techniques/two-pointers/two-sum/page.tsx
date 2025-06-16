"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeftRight, Play, Pause, RotateCcw, Shuffle } from "lucide-react"

interface TwoSumState {
  left: number
  right: number
  currentSum: number
  step: string
  found: boolean
}

export default function TwoSumVisualization() {
  const [array, setArray] = useState([2, 7, 11, 15, 19, 23, 30])
  const [target, setTarget] = useState(26)
  const [currentState, setCurrentState] = useState<TwoSumState | null>(null)
  const [isAnimating, setIsAnimating] = useState(false)
  const [animationSpeed, setAnimationSpeed] = useState(1000)
  const [customArray, setCustomArray] = useState("")
  const [result, setResult] = useState<{ indices: [number, number]; values: [number, number] } | null>(null)

  const generateRandomArray = () => {
    const size = Math.floor(Math.random() * 5) + 5 // 5-9 elements
    const arr = Array.from({ length: size }, () => Math.floor(Math.random() * 30) + 1)
    arr.sort((a, b) => a - b) // Sort in ascending order
    setArray(arr)

    // Generate a target that has a solution
    const index1 = Math.floor(Math.random() * (arr.length - 1))
    const index2 = Math.floor(Math.random() * (arr.length - index1 - 1)) + index1 + 1
    setTarget(arr[index1] + arr[index2])

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
        newArray.sort((a, b) => a - b) // Sort in ascending order
        setArray(newArray)
        setCustomArray("")
        setResult(null)
        setCurrentState(null)
      }
    } catch (e) {
      // Invalid input, ignore
    }
  }

  const findTwoSum = async () => {
    if (isAnimating) return
    setIsAnimating(true)
    setResult(null)

    try {
      let left = 0
      let right = array.length - 1

      setCurrentState({
        left,
        right,
        currentSum: array[left] + array[right],
        step: `Initialize: left=${left} (${array[left]}), right=${right} (${array[right]})`,
        found: false,
      })
      await new Promise((resolve) => setTimeout(resolve, animationSpeed))

      while (left < right) {
        const currentSum = array[left] + array[right]

        setCurrentState({
          left,
          right,
          currentSum,
          step: `Sum: ${array[left]} + ${array[right]} = ${currentSum}`,
          found: false,
        })
        await new Promise((resolve) => setTimeout(resolve, animationSpeed))

        if (currentSum === target) {
          // Found the pair
          setResult({
            indices: [left, right],
            values: [array[left], array[right]],
          })

          setCurrentState({
            left,
            right,
            currentSum,
            step: `Found solution: ${array[left]} + ${array[right]} = ${target}`,
            found: true,
          })
          setIsAnimating(false)
          return
        } else if (currentSum < target) {
          // Sum is too small, increment left pointer
          setCurrentState({
            left,
            right,
            currentSum,
            step: `${currentSum} < ${target}, move left pointer right`,
            found: false,
          })
          await new Promise((resolve) => setTimeout(resolve, animationSpeed))
          left++
        } else {
          // Sum is too large, decrement right pointer
          setCurrentState({
            left,
            right,
            currentSum,
            step: `${currentSum} > ${target}, move right pointer left`,
            found: false,
          })
          await new Promise((resolve) => setTimeout(resolve, animationSpeed))
          right--
        }
      }

      // No solution found
      setCurrentState({
        left,
        right,
        currentSum: 0,
        step: "No solution found",
        found: false,
      })
    } catch (error) {
      console.error("Error in findTwoSum:", error)
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

    if (result && (index === result.indices[0] || index === result.indices[1])) {
      return "bg-green-200 border-green-400"
    }

    if (index === currentState.left) {
      return "bg-blue-200 border-blue-400"
    }

    if (index === currentState.right) {
      return "bg-red-200 border-red-400"
    }

    return "bg-gray-100"
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3 mb-4">
            <ArrowLeftRight className="h-8 w-8 text-blue-600" />
            <h1 className="text-4xl font-bold tracking-tight">Two Sum (Two Pointers)</h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Find two numbers in a sorted array that add up to a target sum
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
                  <Label htmlFor="target">Target Sum</Label>
                  <Input
                    id="target"
                    type="number"
                    value={target}
                    onChange={(e) => setTarget(Number.parseInt(e.target.value) || 0)}
                    disabled={isAnimating}
                  />
                </div>

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
                  <Button onClick={findTwoSum} disabled={isAnimating} className="flex-1">
                    {isAnimating ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
                    {isAnimating ? "Running..." : "Find Two Sum"}
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
                    placeholder="2, 7, 11, 15, 19, 23, 30"
                    disabled={isAnimating}
                  />
                </div>
                <Button onClick={setCustomArrayFromInput} disabled={isAnimating} className="w-full">
                  Set Array (will be sorted)
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
                      <span className="font-medium">Found: </span>
                      <span className="text-lg font-bold">
                        {result.values[0]} + {result.values[1]} = {target}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium">Indices: </span>
                      <span className="font-mono">
                        [{result.indices[0]}, {result.indices[1]}]
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
                <CardDescription>Blue: Left pointer | Red: Right pointer | Green: Solution</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Target display */}
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-sm text-muted-foreground">Target Sum</div>
                    <div className="text-3xl font-bold">{target}</div>
                  </div>

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

                  {/* Pointers display */}
                  {currentState && (
                    <div className="flex justify-center gap-8 text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-blue-200 border border-blue-400 rounded"></div>
                        <span>
                          Left: {array[currentState.left]} (index {currentState.left})
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-red-200 border border-red-400 rounded"></div>
                        <span>
                          Right: {array[currentState.right]} (index {currentState.right})
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Current sum display */}
                  {currentState && (
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <div className="text-sm text-blue-700">Current Sum</div>
                      <div className="text-2xl font-bold text-blue-800">
                        {array[currentState.left]} + {array[currentState.right]} = {currentState.currentSum}
                      </div>
                      <div className="text-sm text-blue-600 mt-1">
                        {currentState.currentSum === target
                          ? "✓ Found!"
                          : currentState.currentSum < target
                            ? "Too small"
                            : "Too large"}
                      </div>
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
                  <h4 className="font-semibold">Two Pointers Approach:</h4>
                  <ol className="text-sm text-muted-foreground list-decimal list-inside space-y-1 mt-2">
                    <li>Start with left pointer at beginning, right pointer at end</li>
                    <li>Calculate sum of elements at both pointers</li>
                    <li>If sum equals target, return the indices</li>
                    <li>If sum is less than target, move left pointer right</li>
                    <li>If sum is greater than target, move right pointer left</li>
                    <li>Repeat until pointers meet or solution is found</li>
                  </ol>
                </div>
                <div>
                  <h4 className="font-semibold">Why This Works:</h4>
                  <p className="text-sm text-muted-foreground">
                    Since the array is sorted, moving the left pointer right increases the sum, and moving the right
                    pointer left decreases the sum. This allows us to systematically explore all possible pairs.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold">Time Complexity:</h4>
                  <p className="text-sm text-muted-foreground">O(n) - each element is visited at most once</p>
                </div>
                <div>
                  <h4 className="font-semibold">Space Complexity:</h4>
                  <p className="text-sm text-muted-foreground">O(1) - only using two pointers</p>
                </div>
                <div>
                  <h4 className="font-semibold">Prerequisite:</h4>
                  <p className="text-sm text-muted-foreground">Array must be sorted for this approach to work</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
