"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Package, Play, Pause, RotateCcw, Plus, Trash2 } from "lucide-react"

interface Item {
  id: number
  weight: number
  value: number
  name: string
}

interface DPState {
  i: number
  w: number
  value: number
  included: boolean[]
  step: string
}

export default function KnapsackVisualization() {
  const [items, setItems] = useState<Item[]>([
    { id: 1, weight: 2, value: 3, name: "Item 1" },
    { id: 2, weight: 3, value: 4, name: "Item 2" },
    { id: 3, weight: 4, value: 5, name: "Item 3" },
    { id: 4, weight: 5, value: 6, name: "Item 4" },
  ])
  const [capacity, setCapacity] = useState(8)
  const [dp, setDp] = useState<number[][]>([])
  const [currentState, setCurrentState] = useState<DPState | null>(null)
  const [isAnimating, setIsAnimating] = useState(false)
  const [animationSpeed, setAnimationSpeed] = useState(500)
  const [solution, setSolution] = useState<boolean[]>([])
  const [newItem, setNewItem] = useState({ weight: 1, value: 1, name: "" })

  const initializeDP = () => {
    const n = items.length
    const newDp = Array(n + 1)
      .fill(null)
      .map(() => Array(capacity + 1).fill(0))
    setDp(newDp)
    setSolution([])
    setCurrentState(null)
  }

  useEffect(() => {
    initializeDP()
  }, [items, capacity])

  const solveKnapsack = async () => {
    if (isAnimating) return
    setIsAnimating(true)

    const n = items.length
    const newDp = Array(n + 1)
      .fill(null)
      .map(() => Array(capacity + 1).fill(0))

    // Fill the DP table with animation
    for (let i = 1; i <= n; i++) {
      for (let w = 1; w <= capacity; w++) {
        const currentItem = items[i - 1]

        setCurrentState({
          i,
          w,
          value: 0,
          included: [],
          step: `Considering ${currentItem.name} (weight: ${currentItem.weight}, value: ${currentItem.value}) for capacity ${w}`,
        })

        await new Promise((resolve) => setTimeout(resolve, animationSpeed))

        if (currentItem.weight <= w) {
          const includeValue = currentItem.value + newDp[i - 1][w - currentItem.weight]
          const excludeValue = newDp[i - 1][w]

          if (includeValue > excludeValue) {
            newDp[i][w] = includeValue
            setCurrentState((prev) =>
              prev
                ? {
                    ...prev,
                    step: `Including ${currentItem.name}: ${includeValue} > ${excludeValue}`,
                  }
                : null,
            )
          } else {
            newDp[i][w] = excludeValue
            setCurrentState((prev) =>
              prev
                ? {
                    ...prev,
                    step: `Excluding ${currentItem.name}: ${excludeValue} >= ${includeValue}`,
                  }
                : null,
            )
          }
        } else {
          newDp[i][w] = newDp[i - 1][w]
          setCurrentState((prev) =>
            prev
              ? {
                  ...prev,
                  step: `${currentItem.name} too heavy (${currentItem.weight} > ${w}), excluding`,
                }
              : null,
          )
        }

        setDp([...newDp])
        await new Promise((resolve) => setTimeout(resolve, animationSpeed))
      }
    }

    // Backtrack to find solution
    const solutionItems = Array(n).fill(false)
    let w = capacity
    for (let i = n; i > 0; i--) {
      if (newDp[i][w] !== newDp[i - 1][w]) {
        solutionItems[i - 1] = true
        w -= items[i - 1].weight
      }
    }

    setSolution(solutionItems)
    setCurrentState({
      i: n,
      w: capacity,
      value: newDp[n][capacity],
      included: solutionItems,
      step: `Solution found! Maximum value: ${newDp[n][capacity]}`,
    })

    setIsAnimating(false)
  }

  const addItem = () => {
    if (newItem.name && newItem.weight > 0 && newItem.value > 0) {
      setItems([
        ...items,
        {
          id: Date.now(),
          weight: newItem.weight,
          value: newItem.value,
          name: newItem.name,
        },
      ])
      setNewItem({ weight: 1, value: 1, name: "" })
    }
  }

  const removeItem = (id: number) => {
    setItems(items.filter((item) => item.id !== id))
  }

  const reset = () => {
    setIsAnimating(false)
    initializeDP()
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Package className="h-8 w-8 text-blue-600" />
            <h1 className="text-4xl font-bold tracking-tight">0/1 Knapsack Problem</h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Maximize value within weight constraint using dynamic programming
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
                  <Label htmlFor="capacity">Knapsack Capacity</Label>
                  <Input
                    id="capacity"
                    type="number"
                    value={capacity}
                    onChange={(e) => setCapacity(Math.max(1, Number.parseInt(e.target.value) || 1))}
                    min="1"
                    max="20"
                    disabled={isAnimating}
                  />
                </div>

                <div>
                  <Label htmlFor="speed">Animation Speed (ms)</Label>
                  <Input
                    id="speed"
                    type="number"
                    value={animationSpeed}
                    onChange={(e) => setAnimationSpeed(Math.max(100, Number.parseInt(e.target.value) || 500))}
                    min="100"
                    max="2000"
                    step="100"
                  />
                </div>

                <div className="flex gap-2">
                  <Button onClick={solveKnapsack} disabled={isAnimating} className="flex-1">
                    {isAnimating ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
                    {isAnimating ? "Running..." : "Solve"}
                  </Button>
                  <Button onClick={reset} variant="outline" disabled={isAnimating}>
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Add Item */}
            <Card>
              <CardHeader>
                <CardTitle>Add Item</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="itemName">Name</Label>
                  <Input
                    id="itemName"
                    value={newItem.name}
                    onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                    placeholder="Item name"
                    disabled={isAnimating}
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label htmlFor="itemWeight">Weight</Label>
                    <Input
                      id="itemWeight"
                      type="number"
                      value={newItem.weight}
                      onChange={(e) => setNewItem({ ...newItem, weight: Number.parseInt(e.target.value) || 1 })}
                      min="1"
                      disabled={isAnimating}
                    />
                  </div>
                  <div>
                    <Label htmlFor="itemValue">Value</Label>
                    <Input
                      id="itemValue"
                      type="number"
                      value={newItem.value}
                      onChange={(e) => setNewItem({ ...newItem, value: Number.parseInt(e.target.value) || 1 })}
                      min="1"
                      disabled={isAnimating}
                    />
                  </div>
                </div>
                <Button onClick={addItem} disabled={isAnimating} className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Item
                </Button>
              </CardContent>
            </Card>

            {/* Items List */}
            <Card>
              <CardHeader>
                <CardTitle>Items</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {items.map((item, index) => (
                    <div
                      key={item.id}
                      className={`flex items-center justify-between p-2 rounded border ${
                        solution[index] ? "bg-green-100 border-green-300" : "bg-gray-50"
                      }`}
                    >
                      <div>
                        <div className="font-medium">{item.name}</div>
                        <div className="text-sm text-muted-foreground">
                          W: {item.weight}, V: {item.value}
                        </div>
                      </div>
                      <Button size="sm" variant="ghost" onClick={() => removeItem(item.id)} disabled={isAnimating}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* DP Table Visualization */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Dynamic Programming Table</CardTitle>
                <CardDescription>dp[i][w] = maximum value using first i items with capacity w</CardDescription>
              </CardHeader>
              <CardContent>
                {dp.length > 0 && (
                  <div className="overflow-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr>
                          <th className="border p-2 bg-gray-100">Items \ Capacity</th>
                          {Array.from({ length: capacity + 1 }, (_, i) => (
                            <th key={i} className="border p-2 bg-gray-100 min-w-[40px]">
                              {i}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {dp.map((row, i) => (
                          <tr key={i}>
                            <td className="border p-2 bg-gray-100 font-medium">
                              {i === 0 ? "∅" : items[i - 1]?.name || `Item ${i}`}
                            </td>
                            {row.map((value, w) => (
                              <td
                                key={w}
                                className={`border p-2 text-center ${
                                  currentState && currentState.i === i && currentState.w === w
                                    ? "bg-blue-200 font-bold"
                                    : value > 0
                                      ? "bg-green-50"
                                      : ""
                                }`}
                              >
                                {value}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
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
                  {currentState.value > 0 && (
                    <p className="text-lg font-bold mt-2">Maximum Value: {currentState.value}</p>
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
                  <h4 className="font-semibold">Recurrence Relation:</h4>
                  <code className="block bg-gray-100 p-2 rounded mt-1">
                    dp[i][w] = max(dp[i-1][w], dp[i-1][w-weight[i]] + value[i])
                  </code>
                </div>
                <div>
                  <h4 className="font-semibold">Time Complexity:</h4>
                  <p className="text-sm text-muted-foreground">O(n × W) where n is number of items and W is capacity</p>
                </div>
                <div>
                  <h4 className="font-semibold">Space Complexity:</h4>
                  <p className="text-sm text-muted-foreground">O(n × W) for the DP table</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
