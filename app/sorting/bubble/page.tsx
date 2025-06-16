"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Play, Pause, RotateCcw, Shuffle, BarChart3 } from "lucide-react"

interface SortStep {
  array: number[]
  comparing: [number, number] | null
  swapped: boolean
  message: string
}

export default function BubbleSortVisualization() {
  const [arraySize, setArraySize] = useState(8)
  const [speed, setSpeed] = useState(500)
  const [array, setArray] = useState<number[]>([])
  const [originalArray, setOriginalArray] = useState<number[]>([])
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [steps, setSteps] = useState<SortStep[]>([])
  const [stats, setStats] = useState({ comparisons: 0, swaps: 0 })

  const generateRandomArray = () => {
    const newArray = Array.from({ length: arraySize }, () => Math.floor(Math.random() * 100) + 1)
    setArray([...newArray])
    setOriginalArray([...newArray])
    setCurrentStep(0)
    setIsPlaying(false)
    generateSteps(newArray)
  }

  const generateSteps = (arr: number[]) => {
    const newSteps: SortStep[] = []
    const workingArray = [...arr]
    let comparisons = 0
    let swaps = 0

    newSteps.push({
      array: [...workingArray],
      comparing: null,
      swapped: false,
      message: "Starting Bubble Sort - we'll compare adjacent elements",
    })

    for (let i = 0; i < workingArray.length - 1; i++) {
      for (let j = 0; j < workingArray.length - i - 1; j++) {
        comparisons++

        // Show comparison
        newSteps.push({
          array: [...workingArray],
          comparing: [j, j + 1],
          swapped: false,
          message: `Comparing ${workingArray[j]} and ${workingArray[j + 1]}`,
        })

        if (workingArray[j] > workingArray[j + 1]) {
          // Show swap
          swaps++
          ;[workingArray[j], workingArray[j + 1]] = [workingArray[j + 1], workingArray[j]]

          newSteps.push({
            array: [...workingArray],
            comparing: [j, j + 1],
            swapped: true,
            message: `Swapped! ${workingArray[j + 1]} &gt; ${workingArray[j]}, so we swap them`,
          })
        } else {
          newSteps.push({
            array: [...workingArray],
            comparing: [j, j + 1],
            swapped: false,
            message: `No swap needed - ${workingArray[j]} ≤ ${workingArray[j + 1]}`,
          })
        }
      }

      newSteps.push({
        array: [...workingArray],
        comparing: null,
        swapped: false,
        message: `Pass ${i + 1} complete - largest element is now in position`,
      })
    }

    newSteps.push({
      array: [...workingArray],
      comparing: null,
      swapped: false,
      message: "Sorting complete! Array is now sorted.",
    })

    setSteps(newSteps)
    setStats({ comparisons, swaps })
  }

  const playAnimation = () => {
    if (steps.length === 0) generateSteps(array)
    setIsPlaying(true)
  }

  const pauseAnimation = () => {
    setIsPlaying(false)
  }

  const resetAnimation = () => {
    setIsPlaying(false)
    setCurrentStep(0)
    setArray([...originalArray])
  }

  const handleCustomInput = (input: string) => {
    const values = input
      .split(",")
      .map((v) => Number.parseInt(v.trim()))
      .filter((v) => !isNaN(v))
    if (values.length > 0) {
      setArray(values)
      setOriginalArray([...values])
      setArraySize(values.length)
      setCurrentStep(0)
      setIsPlaying(false)
      generateSteps(values)
    }
  }

  useEffect(() => {
    generateRandomArray()
  }, [arraySize])

  useEffect(() => {
    if (isPlaying && currentStep < steps.length - 1) {
      const timer = setTimeout(() => {
        setCurrentStep((prev) => prev + 1)
      }, speed)
      return () => clearTimeout(timer)
    } else if (currentStep >= steps.length - 1) {
      setIsPlaying(false)
    }
  }, [isPlaying, currentStep, steps.length, speed])

  const getCurrentStep = () => steps[currentStep] || { array, comparing: null, swapped: false, message: "" }
  const currentStepData = getCurrentStep()

  const getBarColor = (index: number) => {
    if (currentStepData.comparing && currentStepData.comparing.includes(index)) {
      return currentStepData.swapped ? "bg-red-500" : "bg-yellow-500"
    }
    return "bg-blue-500"
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3 mb-4">
            <BarChart3 className="h-8 w-8 text-red-600" />
            <h1 className="text-4xl font-bold tracking-tight">Bubble Sort</h1>
          </div>
          <p className="text-xl text-muted-foreground">
            Watch how Bubble Sort compares adjacent elements and "bubbles" larger elements to the end
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Visualization</CardTitle>
              <CardDescription>
                Step {currentStep + 1} of {steps.length}: {currentStepData.message}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-2">
                  <Label>Array Size:</Label>
                  <Slider
                    value={[arraySize]}
                    onValueChange={(value) => setArraySize(value[0])}
                    max={15}
                    min={3}
                    step={1}
                    className="w-24"
                  />
                  <span className="text-sm w-8">{arraySize}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Label>Speed:</Label>
                  <Slider
                    value={[speed]}
                    onValueChange={(value) => setSpeed(value[0])}
                    max={1000}
                    min={100}
                    step={100}
                    className="w-24"
                  />
                  <span className="text-sm w-12">{speed}ms</span>
                </div>
              </div>

              <div className="flex gap-2 flex-wrap">
                <Button onClick={isPlaying ? pauseAnimation : playAnimation} variant="outline" size="sm">
                  {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  {isPlaying ? "Pause" : "Play"}
                </Button>
                <Button onClick={resetAnimation} variant="outline" size="sm">
                  <RotateCcw className="h-4 w-4" />
                  Reset
                </Button>
                <Button onClick={generateRandomArray} variant="outline" size="sm">
                  <Shuffle className="h-4 w-4" />
                  New Array
                </Button>
              </div>

              <div className="space-y-2">
                <Label>Custom Input (comma-separated):</Label>
                <Input
                  placeholder="e.g., 64,34,25,12,22,11,90"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleCustomInput(e.currentTarget.value)
                    }
                  }}
                />
              </div>

              <div className="bg-muted p-4 rounded-lg">
                <div className="flex items-end justify-center gap-1 h-64">
                  {currentStepData.array.map((value, index) => (
                    <div key={index} className="flex flex-col items-center gap-1">
                      <div
                        className={`${getBarColor(index)} transition-all duration-300 rounded-t flex items-end justify-center text-white text-xs font-bold min-w-[30px]`}
                        style={{ height: `${(value / Math.max(...currentStepData.array)) * 200}px` }}
                      >
                        {value}
                      </div>
                      <div className="text-xs text-muted-foreground">{index}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-blue-500 rounded"></div>
                  <span>Normal</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                  <span>Comparing</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-red-500 rounded"></div>
                  <span>Swapping</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Algorithm Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Comparisons:</span>
                  <Badge variant="outline">{stats.comparisons}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Swaps:</span>
                  <Badge variant="outline">{stats.swaps}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Progress:</span>
                  <Badge variant="outline">
                    {currentStep + 1} / {steps.length}
                  </Badge>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium">Time Complexity:</h4>
                <div className="text-xs space-y-1">
                  <div className="flex justify-between">
                    <span>Best Case:</span>
                    <span className="text-green-600">O(n)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Average Case:</span>
                    <span className="text-yellow-600">O(n²)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Worst Case:</span>
                    <span className="text-red-600">O(n²)</span>
                  </div>
                </div>
              </div>

              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <h4 className="font-medium text-red-800 mb-2">How Bubble Sort Works:</h4>
                <ul className="text-xs space-y-1 text-red-700">
                  <li>1. Compare adjacent elements</li>
                  <li>2. Swap if left &gt; right</li>
                  <li>3. Continue through array</li>
                  <li>4. Repeat until no swaps needed</li>
                  <li>5. Largest elements "bubble" to end</li>
                </ul>
              </div>

              <div className="bg-muted p-3 rounded">
                <h4 className="font-medium text-sm mb-2">Characteristics:</h4>
                <ul className="text-xs space-y-1 text-muted-foreground">
                  <li>• Stable sorting algorithm</li>
                  <li>• In-place sorting</li>
                  <li>• Simple to understand</li>
                  <li>• Inefficient for large datasets</li>
                  <li>• Good for educational purposes</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
