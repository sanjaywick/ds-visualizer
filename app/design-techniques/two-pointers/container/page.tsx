"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Droplets, Play, Pause, RotateCcw, SkipForward } from "lucide-react"

interface AnimationStep {
  left: number
  right: number
  currentArea: number
  maxArea: number
  maxLeft: number
  maxRight: number
  action: "compare" | "move-left" | "move-right" | "found-max"
  message: string
}

export default function ContainerWithMostWater() {
  const [heights, setHeights] = useState([1, 8, 6, 2, 5, 4, 8, 3, 7])
  const [inputValue, setInputValue] = useState("1,8,6,2,5,4,8,3,7")
  const [steps, setSteps] = useState<AnimationStep[]>([])
  const [currentStep, setCurrentStep] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [animationSpeed, setAnimationSpeed] = useState(1000)
  const [left, setLeft] = useState(0)
  const [right, setRight] = useState(0)
  const [maxArea, setMaxArea] = useState(0)
  const [maxLeft, setMaxLeft] = useState(0)
  const [maxRight, setMaxRight] = useState(0)

  const calculateArea = (leftIndex: number, rightIndex: number, heightArray: number[]) => {
    const width = rightIndex - leftIndex
    const height = Math.min(heightArray[leftIndex], heightArray[rightIndex])
    return width * height
  }

  const solveContainer = (heightArray: number[]): AnimationStep[] => {
    const animationSteps: AnimationStep[] = []
    let leftPointer = 0
    let rightPointer = heightArray.length - 1
    let currentMaxArea = 0
    let bestLeft = 0
    let bestRight = heightArray.length - 1

    while (leftPointer < rightPointer) {
      const currentArea = calculateArea(leftPointer, rightPointer, heightArray)

      animationSteps.push({
        left: leftPointer,
        right: rightPointer,
        currentArea,
        maxArea: Math.max(currentMaxArea, currentArea),
        maxLeft: currentArea > currentMaxArea ? leftPointer : bestLeft,
        maxRight: currentArea > currentMaxArea ? rightPointer : bestRight,
        action: "compare",
        message: `Comparing heights at positions ${leftPointer} (${heightArray[leftPointer]}) and ${rightPointer} (${heightArray[rightPointer]}). Area = ${currentArea}`,
      })

      if (currentArea > currentMaxArea) {
        currentMaxArea = currentArea
        bestLeft = leftPointer
        bestRight = rightPointer

        animationSteps.push({
          left: leftPointer,
          right: rightPointer,
          currentArea,
          maxArea: currentMaxArea,
          maxLeft: bestLeft,
          maxRight: bestRight,
          action: "found-max",
          message: `New maximum area found: ${currentMaxArea}`,
        })
      }

      // Move the pointer with smaller height
      if (heightArray[leftPointer] < heightArray[rightPointer]) {
        leftPointer++
        animationSteps.push({
          left: leftPointer,
          right: rightPointer,
          currentArea: leftPointer < rightPointer ? calculateArea(leftPointer, rightPointer, heightArray) : 0,
          maxArea: currentMaxArea,
          maxLeft: bestLeft,
          maxRight: bestRight,
          action: "move-left",
          message: `Left height (${heightArray[leftPointer - 1]}) < Right height (${heightArray[rightPointer]}). Moving left pointer to ${leftPointer}`,
        })
      } else {
        rightPointer--
        animationSteps.push({
          left: leftPointer,
          right: rightPointer,
          currentArea: leftPointer < rightPointer ? calculateArea(leftPointer, rightPointer, heightArray) : 0,
          maxArea: currentMaxArea,
          maxLeft: bestLeft,
          maxRight: bestRight,
          action: "move-right",
          message: `Right height (${heightArray[rightPointer + 1]}) ≤ Left height (${heightArray[leftPointer]}). Moving right pointer to ${rightPointer}`,
        })
      }
    }

    return animationSteps
  }

  const startAnimation = () => {
    const solutionSteps = solveContainer(heights)
    setSteps(solutionSteps)
    setCurrentStep(0)
    setIsAnimating(true)
  }

  const pauseAnimation = () => {
    setIsAnimating(false)
  }

  const resetAnimation = () => {
    setIsAnimating(false)
    setCurrentStep(0)
    setLeft(0)
    setRight(heights.length - 1)
    setMaxArea(0)
    setMaxLeft(0)
    setMaxRight(heights.length - 1)
  }

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1)
    }
  }

  const updateHeights = () => {
    try {
      const newHeights = inputValue
        .split(",")
        .map((h) => Number.parseInt(h.trim()))
        .filter((h) => !isNaN(h) && h > 0)
      if (newHeights.length >= 2) {
        setHeights(newHeights)
        resetAnimation()
      }
    } catch (error) {
      console.error("Invalid input")
    }
  }

  const generateRandomHeights = () => {
    const length = Math.floor(Math.random() * 6) + 5 // 5-10 elements
    const newHeights = Array.from({ length }, () => Math.floor(Math.random() * 9) + 1)
    setHeights(newHeights)
    setInputValue(newHeights.join(","))
    resetAnimation()
  }

  useEffect(() => {
    if (isAnimating && currentStep < steps.length - 1) {
      const timer = setTimeout(() => {
        setCurrentStep((prev) => prev + 1)
      }, animationSpeed)
      return () => clearTimeout(timer)
    } else if (currentStep >= steps.length - 1) {
      setIsAnimating(false)
    }
  }, [isAnimating, currentStep, steps.length, animationSpeed])

  useEffect(() => {
    if (steps.length > 0 && currentStep < steps.length) {
      const step = steps[currentStep]
      setLeft(step.left)
      setRight(step.right)
      setMaxArea(step.maxArea)
      setMaxLeft(step.maxLeft)
      setMaxRight(step.maxRight)
    }
  }, [currentStep, steps])

  useEffect(() => {
    resetAnimation()
  }, [heights])

  const getBarColor = (index: number) => {
    if (steps.length === 0) return "bg-blue-400"

    const step = steps[currentStep]
    if (!step) return "bg-blue-400"

    if (index === step.maxLeft || index === step.maxRight) {
      return "bg-green-500" // Best solution so far
    }
    if (index === step.left || index === step.right) {
      return "bg-yellow-400" // Current pointers
    }
    return "bg-blue-400"
  }

  const maxHeight = Math.max(...heights)
  const currentArea = steps.length > 0 && currentStep < steps.length ? steps[currentStep].currentArea : 0

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Droplets className="h-8 w-8 text-blue-600" />
            <h1 className="text-4xl font-bold tracking-tight">Container With Most Water</h1>
          </div>
          <p className="text-xl text-muted-foreground">
            Find two lines that together with x-axis forms a container that holds the most water
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="heights-input">Heights (comma-separated)</Label>
                  <div className="flex gap-2">
                    <Input
                      id="heights-input"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder="1,8,6,2,5,4,8,3,7"
                    />
                    <Button onClick={updateHeights} variant="outline">
                      Update
                    </Button>
                    <Button onClick={generateRandomHeights} variant="outline">
                      Random
                    </Button>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button onClick={startAnimation} disabled={isAnimating} className="flex items-center gap-2">
                    <Play className="h-4 w-4" />
                    Start
                  </Button>
                  <Button onClick={pauseAnimation} disabled={!isAnimating} variant="outline">
                    <Pause className="h-4 w-4" />
                  </Button>
                  <Button onClick={resetAnimation} variant="outline">
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                  <Button
                    onClick={nextStep}
                    disabled={isAnimating || currentStep >= steps.length - 1}
                    variant="outline"
                  >
                    <SkipForward className="h-4 w-4" />
                  </Button>
                </div>

                <div>
                  <Label>Animation Speed: {animationSpeed}ms</Label>
                  <input
                    type="range"
                    min="500"
                    max="3000"
                    step="250"
                    value={animationSpeed}
                    onChange={(e) => setAnimationSpeed(Number(e.target.value))}
                    className="w-full"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Container Visualization</CardTitle>
                <CardDescription>
                  {steps.length > 0 ? `Step ${currentStep + 1} of ${steps.length}` : "Click Start to begin"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-muted p-4 rounded-lg mb-4 min-h-[60px]">
                  <p className="text-sm">
                    {steps.length > 0 && currentStep < steps.length
                      ? steps[currentStep].message
                      : "Two pointers start at both ends and move towards each other"}
                  </p>
                </div>

                <div className="flex justify-center">
                  <div className="relative">
                    {/* Container visualization */}
                    <div className="flex items-end gap-1 p-4 bg-gray-100 rounded-lg min-h-[300px]">
                      {heights.map((height, index) => (
                        <div key={index} className="relative flex flex-col items-center">
                          <div
                            className={`w-8 transition-all duration-500 ${getBarColor(index)}`}
                            style={{ height: `${(height / maxHeight) * 200}px` }}
                          />
                          <div className="text-xs mt-1 font-mono">{height}</div>
                          <div className="text-xs text-muted-foreground">{index}</div>

                          {/* Pointer indicators */}
                          {index === left && <div className="absolute -top-6 text-yellow-600 font-bold">L</div>}
                          {index === right && <div className="absolute -top-6 text-yellow-600 font-bold">R</div>}
                        </div>
                      ))}
                    </div>

                    {/* Water area visualization */}
                    {steps.length > 0 && currentStep < steps.length && left < right && (
                      <div
                        className="absolute bg-blue-200 opacity-50 border-2 border-blue-400"
                        style={{
                          left: `${20 + left * 36}px`,
                          width: `${(right - left) * 36}px`,
                          height: `${(Math.min(heights[left], heights[right]) / maxHeight) * 200}px`,
                          bottom: `60px`,
                        }}
                      />
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Current State</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span>Left Pointer:</span>
                  <span>
                    {left} (height: {heights[left] || 0})
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Right Pointer:</span>
                  <span>
                    {right} (height: {heights[right] || 0})
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Current Area:</span>
                  <span>{currentArea}</span>
                </div>
                <div className="flex justify-between font-bold text-green-600">
                  <span>Max Area:</span>
                  <span>{maxArea}</span>
                </div>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Best Container:</span>
                  <span>
                    [{maxLeft}, {maxRight}]
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Algorithm Explanation</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <p>
                  <strong>Two Pointers Approach:</strong>
                </p>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• Start with pointers at both ends</li>
                  <li>• Calculate area = width × min(height[left], height[right])</li>
                  <li>• Move pointer with smaller height inward</li>
                  <li>• Keep track of maximum area found</li>
                  <li>• Continue until pointers meet</li>
                </ul>
                <p className="mt-2">
                  <strong>Time:</strong> O(n), <strong>Space:</strong> O(1)
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Legend</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-yellow-400 rounded"></div>
                  <span>Current Pointers</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-500 rounded"></div>
                  <span>Best Container</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-blue-200 border border-blue-400 rounded"></div>
                  <span>Water Area</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
