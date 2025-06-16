"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Coins, Play, Pause, RotateCcw, Plus, Trash2 } from "lucide-react"

interface CoinState {
  amount: number
  coinIndex: number
  step: string
  coinsUsed: number[]
}

export default function CoinChangeVisualization() {
  const [coins, setCoins] = useState([1, 3, 4])
  const [targetAmount, setTargetAmount] = useState(6)
  const [dp, setDp] = useState<number[]>([])
  const [coinUsed, setCoinUsed] = useState<number[]>([])
  const [currentState, setCurrentState] = useState<CoinState | null>(null)
  const [isAnimating, setIsAnimating] = useState(false)
  const [animationSpeed, setAnimationSpeed] = useState(800)
  const [solution, setSolution] = useState<number[]>([])
  const [newCoin, setNewCoin] = useState(1)

  const initializeDP = () => {
    const newDp = Array(targetAmount + 1).fill(Number.POSITIVE_INFINITY)
    const newCoinUsed = Array(targetAmount + 1).fill(-1)
    newDp[0] = 0
    setDp(newDp)
    setCoinUsed(newCoinUsed)
    setSolution([])
    setCurrentState(null)
  }

  useEffect(() => {
    initializeDP()
  }, [coins, targetAmount])

  const solveCoinChange = async () => {
    if (isAnimating) return
    setIsAnimating(true)

    const newDp = Array(targetAmount + 1).fill(Number.POSITIVE_INFINITY)
    const newCoinUsed = Array(targetAmount + 1).fill(-1)
    newDp[0] = 0

    // Fill the DP array with animation
    for (let amount = 1; amount <= targetAmount; amount++) {
      setCurrentState({
        amount,
        coinIndex: -1,
        step: `Finding minimum coins for amount ${amount}`,
        coinsUsed: [],
      })

      await new Promise((resolve) => setTimeout(resolve, animationSpeed))

      for (let i = 0; i < coins.length; i++) {
        const coin = coins[i]

        setCurrentState({
          amount,
          coinIndex: i,
          step: `Trying coin ${coin} for amount ${amount}`,
          coinsUsed: [],
        })

        await new Promise((resolve) => setTimeout(resolve, animationSpeed / 2))

        if (coin <= amount && newDp[amount - coin] !== Number.POSITIVE_INFINITY) {
          const newCount = newDp[amount - coin] + 1
          if (newCount < newDp[amount]) {
            newDp[amount] = newCount
            newCoinUsed[amount] = coin

            setCurrentState({
              amount,
              coinIndex: i,
              step: `Using coin ${coin}: ${newCount} coins needed (${newDp[amount - coin]} + 1)`,
              coinsUsed: [],
            })
          } else {
            setCurrentState({
              amount,
              coinIndex: i,
              step: `Coin ${coin} doesn't improve solution (${newCount} >= ${newDp[amount]})`,
              coinsUsed: [],
            })
          }
        } else {
          setCurrentState({
            amount,
            coinIndex: i,
            step: `Coin ${coin} ${coin > amount ? "too large" : "not reachable"} for amount ${amount}`,
            coinsUsed: [],
          })
        }

        setDp([...newDp])
        setCoinUsed([...newCoinUsed])
        await new Promise((resolve) => setTimeout(resolve, animationSpeed / 2))
      }
    }

    // Backtrack to find solution
    if (newDp[targetAmount] !== Number.POSITIVE_INFINITY) {
      const solutionCoins: number[] = []
      let amount = targetAmount

      while (amount > 0) {
        const coin = newCoinUsed[amount]
        solutionCoins.push(coin)
        amount -= coin
      }

      setSolution(solutionCoins)
      setCurrentState({
        amount: targetAmount,
        coinIndex: -1,
        step: `Solution found! Minimum ${newDp[targetAmount]} coins: [${solutionCoins.join(", ")}]`,
        coinsUsed: solutionCoins,
      })
    } else {
      setCurrentState({
        amount: targetAmount,
        coinIndex: -1,
        step: `No solution possible with given coins`,
        coinsUsed: [],
      })
    }

    setIsAnimating(false)
  }

  const addCoin = () => {
    if (newCoin > 0 && !coins.includes(newCoin)) {
      setCoins([...coins, newCoin].sort((a, b) => a - b))
      setNewCoin(1)
    }
  }

  const removeCoin = (coinToRemove: number) => {
    setCoins(coins.filter((coin) => coin !== coinToRemove))
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
            <Coins className="h-8 w-8 text-yellow-600" />
            <h1 className="text-4xl font-bold tracking-tight">Coin Change Problem</h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Find minimum number of coins needed to make a target amount
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
                  <Label htmlFor="amount">Target Amount</Label>
                  <Input
                    id="amount"
                    type="number"
                    value={targetAmount}
                    onChange={(e) => setTargetAmount(Math.max(1, Number.parseInt(e.target.value) || 1))}
                    min="1"
                    max="50"
                    disabled={isAnimating}
                  />
                </div>

                <div>
                  <Label htmlFor="speed">Animation Speed (ms)</Label>
                  <Input
                    id="speed"
                    type="number"
                    value={animationSpeed}
                    onChange={(e) => setAnimationSpeed(Math.max(100, Number.parseInt(e.target.value) || 800))}
                    min="100"
                    max="2000"
                    step="100"
                  />
                </div>

                <div className="flex gap-2">
                  <Button onClick={solveCoinChange} disabled={isAnimating || coins.length === 0} className="flex-1">
                    {isAnimating ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
                    {isAnimating ? "Running..." : "Solve"}
                  </Button>
                  <Button onClick={reset} variant="outline" disabled={isAnimating}>
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Add Coin */}
            <Card>
              <CardHeader>
                <CardTitle>Add Coin</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="newCoin">Coin Value</Label>
                  <Input
                    id="newCoin"
                    type="number"
                    value={newCoin}
                    onChange={(e) => setNewCoin(Number.parseInt(e.target.value) || 1)}
                    min="1"
                    disabled={isAnimating}
                  />
                </div>
                <Button onClick={addCoin} disabled={isAnimating} className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Coin
                </Button>
              </CardContent>
            </Card>

            {/* Coins List */}
            <Card>
              <CardHeader>
                <CardTitle>Available Coins</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {coins.map((coin) => (
                    <div
                      key={coin}
                      className={`flex items-center justify-between p-2 rounded border ${
                        solution.includes(coin) ? "bg-yellow-100 border-yellow-300" : "bg-gray-50"
                      }`}
                    >
                      <div className="font-medium">{coin}</div>
                      <Button size="sm" variant="ghost" onClick={() => removeCoin(coin)} disabled={isAnimating}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Solution */}
            {solution.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Solution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div>
                      <span className="font-medium">Coins used: </span>
                      <span className="font-mono">[{solution.join(", ")}]</span>
                    </div>
                    <div>
                      <span className="font-medium">Total coins: </span>
                      <span className="text-lg font-bold">{solution.length}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* DP Array Visualization */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Dynamic Programming Array</CardTitle>
                <CardDescription>dp[i] = minimum coins needed to make amount i</CardDescription>
              </CardHeader>
              <CardContent>
                {dp.length > 0 && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-10 gap-1">
                      {dp.map((value, index) => (
                        <div key={index} className="text-center">
                          <div className="text-xs text-muted-foreground mb-1">{index}</div>
                          <div
                            className={`h-12 border rounded flex items-center justify-center text-sm font-medium ${
                              currentState && currentState.amount === index
                                ? "bg-blue-200 border-blue-400"
                                : value === Number.POSITIVE_INFINITY
                                  ? "bg-red-100 border-red-300 text-red-600"
                                  : value === 0
                                    ? "bg-gray-100"
                                    : "bg-green-100 border-green-300"
                            }`}
                          >
                            {value === Number.POSITIVE_INFINITY ? "∞" : value}
                          </div>
                        </div>
                      ))}
                    </div>
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
                  {currentState.coinIndex >= 0 && (
                    <div className="mt-2 p-2 bg-blue-50 rounded">
                      <span className="text-sm font-medium">Considering coin: {coins[currentState.coinIndex]}</span>
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
                  <h4 className="font-semibold">Recurrence Relation:</h4>
                  <code className="block bg-gray-100 p-2 rounded mt-1 text-sm">
                    dp[amount] = min(dp[amount], dp[amount - coin] + 1) for each coin
                  </code>
                </div>
                <div>
                  <h4 className="font-semibold">Time Complexity:</h4>
                  <p className="text-sm text-muted-foreground">
                    O(amount × coins) where amount is target and coins is number of coin types
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold">Space Complexity:</h4>
                  <p className="text-sm text-muted-foreground">O(amount) for the DP array</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
