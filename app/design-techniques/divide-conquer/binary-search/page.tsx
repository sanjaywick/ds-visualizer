"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Search, Play, Pause, RotateCcw, Shuffle } from "lucide-react"

interface SearchState {
  left: number
  right: number
  mid: number
  step: string
  found: boolean
  target: number
}

export default function BinarySearchVisualization() {
  const [array, setArray] = useState([1, 3, 5, 7, 9, 11, 13, 15, 17, 19])
  const [target, setTarget] = useState(7)
  const [currentState, setCurrentState] = useState<SearchState | null>(null)
  const [isAnimating, setIsAnimating] = useState(false)
  const [animationSpeed, setAnimationSpeed] = useState(1000)
  const [searchHistory, setSearchHistory] = useState<SearchState[]>([])
  const [customArray, setCustomArray] = useState("")

  const generateRandomArray = () => {
    const size = Math.floor(Math.random() * 8) + 8 // 8-15 elements
    const arr = Array.from({ length: size }, (_, i) => (i + 1) * 2 + Math.floor(Math.random() * 3))
    arr.sort((a, b) => a - b)
    setArray(arr)
    setTarget(arr[Math.floor(Math.random() * arr.length)])
  }

  const setCustomArrayFromInput = () => {
    try {
      const newArray = customArray
        .split(",")
        .map((x) => Number.parseInt(x.trim()))
        .filter((x) => !isNaN(x))
      if (newArray.length > 0) {
        newArray.sort((a, b) => a - b)
        setArray(newArray)
        setCustomArray("")
      }
    } catch (e) {
      // Invalid input, ignore
    }
  }

  const binarySearch = async () => {
    if (isAnimating) return
    setIsAnimating(true)
    setSearchHistory([])

    let left = 0
    let right = array.length - 1
    const history: SearchState[] = []

    while (left <= right) {
      const mid = Math.floor((left + right) / 2)
      const state: SearchState = {
        left,
        right,
        mid,
        step: `Checking middle element at index ${mid}: ${array[mid]}`,
        found: false,
        target,
      }

      setCurrentState(state)
      history.push(state)
      setSearchHistory([...history])

      await new Promise((resolve) => setTimeout(resolve, animationSpeed))

      if (array[mid] === target) {
        const foundState: SearchState = {
          left,
          right,
          mid,
          step: `Found target ${target} at index ${mid}!`,
          found: true,
          target,
        }
        setCurrentState(foundState)
        history.push(foundState)
        setSearchHistory([...history])
        setIsAnimating(false)
        return
      } else if (array[mid] < target) {
        const newState: SearchState = {
          left,
          right,
          mid,
          step: `${array[mid]} < ${target}, search right half`,
          found: false,
          target,
        }
        setCurrentState(newState)
        history[history.length - 1] = newState
        setSearchHistory([...history])
        left = mid + 1
      } else {
        const newState: SearchState = {
          left,
          right,
          mid,
          step: `${array[mid]} > ${target}, search left half`,
          found: false,
          target,
        }
        setCurrentState(newState)
        history[history.length - 1] = newState
        setSearchHistory([...history])
        right = mid - 1
      }

      await new Promise((resolve) => setTimeout(resolve, animationSpeed))
    }

    // Not found
    const notFoundState: SearchState = {
      left,
      right,
      mid: -1,
      step: `Target ${target} not found in array`,
      found: false,
      target,
    }
    setCurrentState(notFoundState)
    history.push(notFoundState)
    setSearchHistory([...history])
    setIsAnimating(false)
  }

  const reset = () => {
    setIsAnimating(false)
    setCurrentState(null)
    setSearchHistory([])
  }

  const getElementClass = (index: number) => {
    if (!currentState) return "bg-gray-100"

    if (currentState.found && index === currentState.mid) {
      return "bg-green-200 border-green-400"
    }

    if (index === currentState.mid) {
      return "bg-blue-200 border-blue-400"
    }

    if (index >= currentState.left && index <= currentState.right) {
      return "bg-yellow-100 border-yellow-300"
    }

    return "bg-gray-200 border-gray-300"
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Search className="h-8 w-8 text-blue-600" />
            <h1 className="text-4xl font-bold tracking-tight">Binary Search</h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Search for an element in a sorted array by repeatedly dividing the search space in half
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
                  <Label htmlFor="target">Target Value</Label>
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
                  <Button onClick={binarySearch} disabled={isAnimating} className="flex-1">
                    {isAnimating ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
                    {isAnimating ? "Searching..." : "Search"}
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
                    placeholder="1, 3, 5, 7, 9"
                    disabled={isAnimating}
                  />
                </div>
                <Button onClick={setCustomArrayFromInput} disabled={isAnimating} className="w-full">
                  Set Array
                </Button>
              </CardContent>
            </Card>

            {/* Search History */}
            {searchHistory.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Search History</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {searchHistory.map((state, index) => (
                      <div key={index} className="text-sm p-2 bg-gray-50 rounded">
                        <div className="font-medium">Step {index + 1}</div>
                        <div className="text-muted-foreground">{state.step}</div>
                        <div className="text-xs mt-1">
                          Range: [{state.left}, {state.right}] | Mid: {state.mid >= 0 ? state.mid : "N/A"}
                        </div>
                      </div>
                    ))}
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
                  Yellow: Current search range | Blue: Middle element | Green: Found target
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

                  {/* Search range indicators */}
                  {currentState && (
                    <div className="space-y-2">
                      <div className="flex justify-center gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 bg-yellow-100 border border-yellow-300 rounded"></div>
                          <span>
                            Search Range [{currentState.left}, {currentState.right}]
                          </span>
                        </div>
                        {currentState.mid >= 0 && (
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 bg-blue-200 border border-blue-400 rounded"></div>
                            <span>Mid: {currentState.mid}</span>
                          </div>
                        )}
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
                  {currentState.mid >= 0 && !currentState.found && (
                    <div className="mt-2 p-2 bg-blue-50 rounded text-sm">
                      <div>
                        Left: {currentState.left}, Right: {currentState.right}
                      </div>
                      <div>
                        Mid: {currentState.mid} (value: {array[currentState.mid]})
                      </div>
                      <div>Target: {currentState.target}</div>
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
                  <h4 className="font-semibold">How it works:</h4>
                  <ol className="text-sm text-muted-foreground list-decimal list-inside space-y-1">
                    <li>Start with the entire sorted array</li>
                    <li>Find the middle element</li>
                    <li>If middle equals target, found!</li>
                    <li>If middle {"<"} target, search right half</li>
                    <li>If middle {">"} target, search left half</li>
                    <li>Repeat until found or search space is empty</li>
                  </ol>
                </div>
                <div>
                  <h4 className="font-semibold">Time Complexity:</h4>
                  <p className="text-sm text-muted-foreground">O(log n) - halves search space each iteration</p>
                </div>
                <div>
                  <h4 className="font-semibold">Space Complexity:</h4>
                  <p className="text-sm text-muted-foreground">O(1) iterative, O(log n) recursive</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
