"use client"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Play, RotateCcw, Plus, Minus } from "lucide-react"

interface PermutationState {
  elements: string[]
  currentPermutation: string[]
  allPermutations: string[][]
  usedElements: boolean[]
  currentIndex: number
  isBacktracking: boolean
  step: number
}

export default function PermutationsVisualizer() {
  const [permState, setPermState] = useState<PermutationState>({
    elements: ["A", "B", "C"],
    currentPermutation: [],
    allPermutations: [],
    usedElements: [false, false, false],
    currentIndex: 0,
    isBacktracking: false,
    step: 0,
  })
  const [isAnimating, setIsAnimating] = useState(false)
  const [speed, setSpeed] = useState(800)
  const [newElement, setNewElement] = useState("")
  const [explanation, setExplanation] = useState("Click 'Generate Permutations' to start the backtracking algorithm")

  const generatePermutations = useCallback(
    async (
      elements: string[],
      currentPerm: string[],
      used: boolean[],
      allPerms: string[][],
      step: number,
    ): Promise<void> => {
      // Base case: if current permutation is complete
      if (currentPerm.length === elements.length) {
        const newPermutation = [...currentPerm]
        allPerms.push(newPermutation)

        setPermState((prev) => ({
          ...prev,
          allPermutations: [...allPerms],
          step: step + 1,
        }))

        setExplanation(`✅ Found complete permutation: [${newPermutation.join(", ")}]`)
        await new Promise((resolve) => setTimeout(resolve, speed))
        return
      }

      // Try each unused element
      for (let i = 0; i < elements.length; i++) {
        if (!used[i]) {
          // Choose
          currentPerm.push(elements[i])
          used[i] = true

          setPermState((prev) => ({
            ...prev,
            currentPermutation: [...currentPerm],
            usedElements: [...used],
            currentIndex: i,
            isBacktracking: false,
            step: step + 1,
          }))

          setExplanation(`➡️ Adding '${elements[i]}' to current permutation: [${currentPerm.join(", ")}]`)
          await new Promise((resolve) => setTimeout(resolve, speed))

          // Explore
          await generatePermutations(elements, currentPerm, used, allPerms, step + 1)

          // Backtrack
          currentPerm.pop()
          used[i] = false

          setPermState((prev) => ({
            ...prev,
            currentPermutation: [...currentPerm],
            usedElements: [...used],
            isBacktracking: true,
            step: step + 2,
          }))

          setExplanation(`⬅️ Backtracking: Removed '${elements[i]}', trying next option...`)
          await new Promise((resolve) => setTimeout(resolve, speed))
        }
      }
    },
    [speed],
  )

  const startGeneration = async () => {
    if (isAnimating || permState.elements.length === 0) return

    setIsAnimating(true)
    setPermState((prev) => ({
      ...prev,
      currentPermutation: [],
      allPermutations: [],
      usedElements: new Array(prev.elements.length).fill(false),
      currentIndex: 0,
      isBacktracking: false,
      step: 0,
    }))

    const allPerms: string[][] = []
    await generatePermutations(permState.elements, [], new Array(permState.elements.length).fill(false), allPerms, 0)

    setExplanation(`🎉 Generated all ${allPerms.length} permutations!`)
    setIsAnimating(false)
  }

  const resetVisualization = () => {
    setPermState((prev) => ({
      ...prev,
      currentPermutation: [],
      allPermutations: [],
      usedElements: new Array(prev.elements.length).fill(false),
      currentIndex: 0,
      isBacktracking: false,
      step: 0,
    }))
    setIsAnimating(false)
    setExplanation("Click 'Generate Permutations' to start the backtracking algorithm")
  }

  const addElement = () => {
    if (newElement.trim() && !permState.elements.includes(newElement.trim()) && permState.elements.length < 5) {
      setPermState((prev) => ({
        ...prev,
        elements: [...prev.elements, newElement.trim()],
        usedElements: [...prev.usedElements, false],
      }))
      setNewElement("")
      resetVisualization()
    }
  }

  const removeElement = (index: number) => {
    if (permState.elements.length > 1) {
      setPermState((prev) => ({
        ...prev,
        elements: prev.elements.filter((_, i) => i !== index),
        usedElements: prev.usedElements.filter((_, i) => i !== index),
      }))
      resetVisualization()
    }
  }

  const factorial = (n: number): number => {
    if (n <= 1) return 1
    return n * factorial(n - 1)
  }

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Permutations Generator</h1>
        <p className="text-gray-600">Watch the backtracking algorithm generate all permutations step by step</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input and Controls */}
        <Card>
          <CardHeader>
            <CardTitle>Elements & Controls</CardTitle>
            <CardDescription>Manage elements and control the permutation generation</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Element Management */}
            <div>
              <h4 className="font-medium mb-2">Current Elements:</h4>
              <div className="flex flex-wrap gap-2 mb-3">
                {permState.elements.map((element, index) => (
                  <div key={index} className="flex items-center gap-1">
                    <Badge
                      variant={permState.usedElements[index] ? "default" : "secondary"}
                      className={`${
                        permState.currentIndex === index && !permState.isBacktracking ? "ring-2 ring-blue-400" : ""
                      } ${permState.isBacktracking && permState.currentIndex === index ? "ring-2 ring-red-400" : ""}`}
                    >
                      {element}
                    </Badge>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => removeElement(index)}
                      disabled={isAnimating || permState.elements.length <= 1}
                      className="h-6 w-6 p-0"
                    >
                      <Minus className="w-3 h-3" />
                    </Button>
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                <Input
                  value={newElement}
                  onChange={(e) => setNewElement(e.target.value)}
                  placeholder="Add element (A-Z)"
                  maxLength={3}
                  disabled={isAnimating || permState.elements.length >= 5}
                  onKeyPress={(e) => e.key === "Enter" && addElement()}
                />
                <Button
                  onClick={addElement}
                  disabled={isAnimating || !newElement.trim() || permState.elements.length >= 5}
                  size="sm"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Current Permutation */}
            <div>
              <h4 className="font-medium mb-2">Current Permutation:</h4>
              <div className="min-h-[40px] p-3 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                {permState.currentPermutation.length > 0 ? (
                  <div className="flex gap-2">
                    {permState.currentPermutation.map((element, index) => (
                      <Badge key={index} variant="default" className="animate-pulse">
                        {element}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <span className="text-gray-500 text-sm">Building permutation...</span>
                )}
              </div>
            </div>

            {/* Controls */}
            <div className="flex flex-wrap gap-2">
              <Button
                onClick={startGeneration}
                disabled={isAnimating || permState.elements.length === 0}
                className="flex items-center gap-2"
              >
                <Play className="w-4 h-4" />
                Generate Permutations
              </Button>

              <Button onClick={resetVisualization} variant="outline" className="flex items-center gap-2">
                <RotateCcw className="w-4 h-4" />
                Reset
              </Button>
            </div>

            <div className="flex items-center gap-4">
              <label className="text-sm font-medium">Speed:</label>
              <input
                type="range"
                min="200"
                max="2000"
                step="200"
                value={speed}
                onChange={(e) => setSpeed(Number(e.target.value))}
                className="w-32"
                disabled={isAnimating}
              />
              <span className="text-sm text-gray-600">{speed}ms</span>
            </div>
          </CardContent>
        </Card>

        {/* Algorithm Progress */}
        <Card>
          <CardHeader>
            <CardTitle>Algorithm Progress</CardTitle>
            <CardDescription>Real-time backtracking visualization</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-blue-600">{permState.allPermutations.length}</div>
                <div className="text-sm text-gray-600">Found</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">{factorial(permState.elements.length)}</div>
                <div className="text-sm text-gray-600">Total</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600">{permState.step}</div>
                <div className="text-sm text-gray-600">Steps</div>
              </div>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium mb-2">Current Status:</h4>
              <p className="text-sm text-gray-700">{explanation}</p>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">Legend:</h4>
              <div className="grid grid-cols-1 gap-2 text-xs">
                <div className="flex items-center gap-2">
                  <Badge variant="default">Used</Badge>
                  <span>Element currently in permutation</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">Available</Badge>
                  <span>Element available for selection</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-blue-400 rounded"></div>
                  <span>Currently selecting</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-red-400 rounded"></div>
                  <span>Backtracking from</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Generated Permutations */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Generated Permutations ({permState.allPermutations.length})</CardTitle>
          <CardDescription>All permutations found by the backtracking algorithm</CardDescription>
        </CardHeader>
        <CardContent>
          {permState.allPermutations.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
              {permState.allPermutations.map((perm, index) => (
                <div key={index} className="p-2 bg-green-50 border border-green-200 rounded text-center">
                  <span className="font-mono text-sm">[{perm.join(", ")}]</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500 py-8">
              No permutations generated yet. Click "Generate Permutations" to start.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Algorithm Explanation */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>How Backtracking Works for Permutations</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-2">Algorithm Steps:</h4>
              <ol className="list-decimal list-inside space-y-1 text-sm text-gray-700">
                <li>Start with an empty permutation</li>
                <li>For each position, try all unused elements</li>
                <li>Add element to current permutation</li>
                <li>Mark element as used</li>
                <li>Recursively fill remaining positions</li>
                <li>When permutation is complete, save it</li>
                <li>Backtrack: remove element and mark as unused</li>
                <li>Try next available element</li>
              </ol>
            </div>
            <div>
              <h4 className="font-medium mb-2">Complexity Analysis:</h4>
              <div className="space-y-2 text-sm">
                <div>
                  <strong>Time Complexity:</strong> O(n! × n)
                </div>
                <div>
                  <strong>Space Complexity:</strong> O(n) for recursion
                </div>
                <div>
                  <strong>Total Permutations:</strong> n! for n elements
                </div>
                <div>
                  <strong>Applications:</strong> Scheduling, arrangements, combinations
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
