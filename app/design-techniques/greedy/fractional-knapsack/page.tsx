"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Package, Play, Pause, RotateCcw, Plus, Trash2, Shuffle } from "lucide-react"

interface Item {
  id: number
  weight: number
  value: number
  name: string
  ratio: number
  fraction?: number
}

interface KnapsackState {
  currentIndex: number
  selectedItems: { id: number; fraction: number }[]
  remainingCapacity: number
  totalValue: number
  step: string
}

export default function FractionalKnapsackVisualization() {
  const [items, setItems] = useState<Item[]>([
    { id: 1, weight: 10, value: 60, name: "Item 1", ratio: 6 },
    { id: 2, weight: 20, value: 100, name: "Item 2", ratio: 5 },
    { id: 3, weight: 30, value: 120, name: "Item 3", ratio: 4 },
    { id: 4, weight: 15, value: 45, name: "Item 4", ratio: 3 },
    { id: 5, weight: 25, value: 50, name: "Item 5", ratio: 2 },
  ])
  const [capacity, setCapacity] = useState(50)
  const [currentState, setCurrentState] = useState<KnapsackState | null>(null)
  const [isAnimating, setIsAnimating] = useState(false)
  const [animationSpeed, setAnimationSpeed] = useState(1000)
  const [newItem, setNewItem] = useState({ weight: 1, value: 1, name: "" })
  const [sortedItems, setSortedItems] = useState<Item[]>([])

  useEffect(() => {
    // Update ratio whenever items change
    const updatedItems = items.map((item) => ({
      ...item,
      ratio: Number.parseFloat((item.value / item.weight).toFixed(2)),
    }))
    setItems(updatedItems)
  }, [])

  const generateRandomItems = () => {
    const count = Math.floor(Math.random() * 3) + 4 // 4-6 items
    const newItems: Item[] = []

    for (let i = 1; i <= count; i++) {
      const weight = Math.floor(Math.random() * 30) + 5
      const value = Math.floor(Math.random() * 100) + 10
      newItems.push({
        id: i,
        weight,
        value,
        name: `Item ${i}`,
        ratio: Number.parseFloat((value / weight).toFixed(2)),
      })
    }

    setItems(newItems)
    setSortedItems([])
    setCurrentState(null)
    setCapacity(Math.floor(Math.random() * 50) + 30) // 30-80 capacity
  }

  const addItem = () => {
    if (newItem.name && newItem.weight > 0 && newItem.value > 0) {
      const ratio = Number.parseFloat((newItem.value / newItem.weight).toFixed(2))
      setItems([
        ...items,
        {
          id: Date.now(),
          weight: newItem.weight,
          value: newItem.value,
          name: newItem.name,
          ratio,
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
    setCurrentState(null)
    setSortedItems([])
  }

  const solveKnapsack = async () => {
    if (isAnimating) return
    setIsAnimating(true)

    try {
      // Sort items by value-to-weight ratio (descending)
      const sorted = [...items].sort((a, b) => b.ratio - a.ratio)
      setSortedItems(sorted)

      setCurrentState({
        currentIndex: -1,
        selectedItems: [],
        remainingCapacity: capacity,
        totalValue: 0,
        step: "Sorting items by value-to-weight ratio (descending)",
      })
      await new Promise((resolve) => setTimeout(resolve, animationSpeed))

      let remainingCapacity = capacity
      let totalValue = 0
      const selectedItems: { id: number; fraction: number }[] = []

      // Process items in order of decreasing ratio
      for (let i = 0; i < sorted.length; i++) {
        setCurrentState({
          currentIndex: i,
          selectedItems: [...selectedItems],
          remainingCapacity,
          totalValue,
          step: `Considering ${sorted[i].name} (ratio: ${sorted[i].ratio})`,
        })
        await new Promise((resolve) => setTimeout(resolve, animationSpeed))

        if (remainingCapacity >= sorted[i].weight) {
          // Take the whole item
          selectedItems.push({ id: sorted[i].id, fraction: 1 })
          remainingCapacity -= sorted[i].weight
          totalValue += sorted[i].value

          setCurrentState({
            currentIndex: i,
            selectedItems: [...selectedItems],
            remainingCapacity,
            totalValue,
            step: `Take all of ${sorted[i].name} (weight: ${sorted[i].weight}, value: ${sorted[i].value})`,
          })
        } else if (remainingCapacity > 0) {
          // Take a fraction of the item
          const fraction = Number.parseFloat((remainingCapacity / sorted[i].weight).toFixed(2))
          const fractionalValue = Number.parseFloat((sorted[i].value * fraction).toFixed(2))

          selectedItems.push({ id: sorted[i].id, fraction })
          totalValue += fractionalValue
          remainingCapacity = 0

          setCurrentState({
            currentIndex: i,
            selectedItems: [...selectedItems],
            remainingCapacity,
            totalValue: Number.parseFloat(totalValue.toFixed(2)),
            step: `Take ${(fraction * 100).toFixed(0)}% of ${sorted[i].name} (value: ${fractionalValue})`,
          })
        } else {
          setCurrentState({
            currentIndex: i,
            selectedItems: [...selectedItems],
            remainingCapacity,
            totalValue,
            step: `Skip ${sorted[i].name}: no capacity left`,
          })
        }

        await new Promise((resolve) => setTimeout(resolve, animationSpeed))

        if (remainingCapacity === 0) {
          break
        }
      }

      // Final result
      setCurrentState({
        currentIndex: -1,
        selectedItems,
        remainingCapacity,
        totalValue: Number.parseFloat(totalValue.toFixed(2)),
        step: `Maximum value: ${Number.parseFloat(totalValue.toFixed(2))}, Remaining capacity: ${remainingCapacity}`,
      })
    } catch (error) {
      console.error("Error in solveKnapsack:", error)
    } finally {
      setIsAnimating(false)
    }
  }

  const getItemClass = (id: number) => {
    if (!currentState) return "bg-gray-100"

    const selectedItem = currentState.selectedItems.find((item) => item.id === id)
    if (selectedItem) {
      return selectedItem.fraction === 1 ? "bg-green-200 border-green-400" : "bg-yellow-200 border-yellow-400"
    }

    const currentItem = sortedItems[currentState.currentIndex]
    if (currentItem && currentItem.id === id) {
      return "bg-blue-200 border-blue-400"
    }

    return "bg-gray-100"
  }

  const getItemFraction = (id: number) => {
    if (!currentState) return null

    const selectedItem = currentState.selectedItems.find((item) => item.id === id)
    return selectedItem ? selectedItem.fraction : null
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Package className="h-8 w-8 text-yellow-600" />
            <h1 className="text-4xl font-bold tracking-tight">Fractional Knapsack</h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Maximize value with weight constraint by taking fractions of items
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
                  <Button onClick={solveKnapsack} disabled={isAnimating || items.length === 0} className="flex-1">
                    {isAnimating ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
                    {isAnimating ? "Running..." : "Solve Knapsack"}
                  </Button>
                  <Button onClick={reset} variant="outline" disabled={isAnimating}>
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                </div>

                <Button onClick={generateRandomItems} variant="outline" disabled={isAnimating} className="w-full">
                  <Shuffle className="h-4 w-4 mr-2" />
                  Random Items
                </Button>
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
                      onChange={(e) =>
                        setNewItem({ ...newItem, weight: Math.max(1, Number.parseInt(e.target.value) || 1) })
                      }
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
                      onChange={(e) =>
                        setNewItem({ ...newItem, value: Math.max(1, Number.parseInt(e.target.value) || 1) })
                      }
                      min="1"
                      disabled={isAnimating}
                    />
                  </div>
                </div>
                <Button onClick={addItem} disabled={isAnimating || !newItem.name} className="w-full">
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
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className={`flex items-center justify-between p-2 rounded border ${getItemClass(item.id)}`}
                    >
                      <div>
                        <div className="font-medium">{item.name}</div>
                        <div className="text-sm text-muted-foreground">
                          Weight: {item.weight}, Value: {item.value}, Ratio: {item.ratio}
                        </div>
                        {getItemFraction(item.id) !== null && getItemFraction(item.id) !== 1 && (
                          <div className="text-sm font-medium text-yellow-700">
                            Used: {(getItemFraction(item.id)! * 100).toFixed(0)}%
                          </div>
                        )}
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

          {/* Visualization */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Knapsack Visualization</CardTitle>
                <CardDescription>
                  Green: Fully used items | Yellow: Partially used | Blue: Currently considering
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Capacity bar */}
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Capacity: {capacity}</span>
                      {currentState && <span>Remaining: {currentState.remainingCapacity}</span>}
                    </div>
                    <div className="w-full h-6 bg-gray-200 rounded-full overflow-hidden">
                      {currentState && (
                        <div
                          className="h-full bg-blue-500"
                          style={{ width: `${((capacity - currentState.remainingCapacity) / capacity) * 100}%` }}
                        ></div>
                      )}
                    </div>
                  </div>

                  {/* Items visualization */}
                  {sortedItems.length > 0 ? (
                    <div className="space-y-3">
                      <h4 className="font-medium">Items (sorted by value-to-weight ratio)</h4>
                      <div className="space-y-2">
                        {sortedItems.map((item, index) => {
                          const fraction = getItemFraction(item.id)
                          return (
                            <div key={item.id} className="space-y-1">
                              <div className="flex justify-between text-sm">
                                <span>
                                  {item.name} (ratio: {item.ratio})
                                </span>
                                {fraction !== null && (
                                  <span>{fraction === 1 ? "Used: 100%" : `Used: ${(fraction * 100).toFixed(0)}%`}</span>
                                )}
                              </div>
                              <div className="w-full h-4 bg-gray-200 rounded overflow-hidden">
                                {fraction !== null && (
                                  <div
                                    className={`h-full ${fraction === 1 ? "bg-green-500" : "bg-yellow-500"}`}
                                    style={{ width: `${fraction * 100}%` }}
                                  ></div>
                                )}
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center text-muted-foreground py-4">
                      Click "Solve Knapsack" to start the algorithm
                    </div>
                  )}

                  {/* Value display */}
                  {currentState && (
                    <div className="bg-green-50 p-4 rounded-lg text-center">
                      <div className="text-sm text-green-700">Total Value</div>
                      <div className="text-3xl font-bold text-green-800">{currentState.totalValue}</div>
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
                  {currentState.selectedItems.length > 0 && (
                    <div className="mt-2 p-2 bg-green-50 rounded">
                      <span className="text-sm font-medium">
                        Selected items:{" "}
                        {currentState.selectedItems
                          .map((item) => {
                            const foundItem = items.find((i) => i.id === item.id)
                            return foundItem
                              ? `${foundItem.name}${item.fraction !== 1 ? ` (${(item.fraction * 100).toFixed(0)}%)` : ""}`
                              : ""
                          })
                          .join(", ")}
                      </span>
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
                  <h4 className="font-semibold">Greedy Approach:</h4>
                  <ol className="text-sm text-muted-foreground list-decimal list-inside space-y-1 mt-2">
                    <li>Calculate value-to-weight ratio for each item</li>
                    <li>Sort items by ratio in descending order</li>
                    <li>Take items with highest ratio first (as much as possible)</li>
                    <li>If an item can't be taken completely, take a fraction of it</li>
                  </ol>
                </div>
                <div>
                  <h4 className="font-semibold">Why Greedy Works:</h4>
                  <p className="text-sm text-muted-foreground">
                    By always choosing items with the highest value-to-weight ratio, we maximize the value per unit
                    weight. Unlike 0/1 Knapsack, we can take fractions of items, so the greedy approach is optimal.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold">Time Complexity:</h4>
                  <p className="text-sm text-muted-foreground">O(n log n) - dominated by the sorting step</p>
                </div>
                <div>
                  <h4 className="font-semibold">Space Complexity:</h4>
                  <p className="text-sm text-muted-foreground">O(1) - excluding the input and output storage</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
