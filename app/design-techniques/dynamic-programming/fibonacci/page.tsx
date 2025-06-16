"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Play, Pause, RotateCcw, TrendingUp } from "lucide-react"

interface FibStep {
  n: number
  value: number | null
  computed: boolean
  fromCache: boolean
}

export default function FibonacciVisualization() {
  const [n, setN] = useState(10)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [approach, setApproach] = useState<"recursive" | "memoization" | "tabulation">("recursive")
  const [steps, setSteps] = useState<FibStep[]>([])
  const [memo, setMemo] = useState<{ [key: number]: number }>({})
  const [table, setTable] = useState<number[]>([])
  const [callStack, setCallStack] = useState<number[]>([])
  const [stats, setStats] = useState({ calls: 0, cacheHits: 0 })

  const generateSteps = () => {
    setSteps([])
    setMemo({})
    setTable([])
    setCallStack([])
    setStats({ calls: 0, cacheHits: 0 })
    setCurrentStep(0)

    if (approach === "recursive") {
      generateRecursiveSteps()
    } else if (approach === "memoization") {
      generateMemoizationSteps()
    } else {
      generateTabulationSteps()
    }
  }

  const generateRecursiveSteps = () => {
    const newSteps: FibStep[] = []
    let callCount = 0

    const fibRecursive = (num: number): number => {
      callCount++
      newSteps.push({ n: num, value: null, computed: false, fromCache: false })

      if (num <= 1) {
        newSteps.push({ n: num, value: num, computed: true, fromCache: false })
        return num
      }

      const left = fibRecursive(num - 1)
      const right = fibRecursive(num - 2)
      const result = left + right

      newSteps.push({ n: num, value: result, computed: true, fromCache: false })
      return result
    }

    fibRecursive(n)
    setSteps(newSteps)
    setStats({ calls: callCount, cacheHits: 0 })
  }

  const generateMemoizationSteps = () => {
    const newSteps: FibStep[] = []
    const memoCache: { [key: number]: number } = {}
    let callCount = 0
    let cacheHits = 0

    const fibMemo = (num: number): number => {
      callCount++

      if (memoCache[num] !== undefined) {
        cacheHits++
        newSteps.push({ n: num, value: memoCache[num], computed: true, fromCache: true })
        return memoCache[num]
      }

      newSteps.push({ n: num, value: null, computed: false, fromCache: false })

      if (num <= 1) {
        memoCache[num] = num
        newSteps.push({ n: num, value: num, computed: true, fromCache: false })
        return num
      }

      const result = fibMemo(num - 1) + fibMemo(num - 2)
      memoCache[num] = result
      newSteps.push({ n: num, value: result, computed: true, fromCache: false })
      return result
    }

    fibMemo(n)
    setSteps(newSteps)
    setMemo(memoCache)
    setStats({ calls: callCount, cacheHits })
  }

  const generateTabulationSteps = () => {
    const newSteps: FibStep[] = []
    const dp: number[] = new Array(n + 1)

    for (let i = 0; i <= n; i++) {
      if (i <= 1) {
        dp[i] = i
        newSteps.push({ n: i, value: i, computed: true, fromCache: false })
      } else {
        dp[i] = dp[i - 1] + dp[i - 2]
        newSteps.push({ n: i, value: dp[i], computed: true, fromCache: false })
      }
    }

    setSteps(newSteps)
    setTable(dp)
    setStats({ calls: n + 1, cacheHits: 0 })
  }

  const playAnimation = () => {
    if (steps.length === 0) generateSteps()
    setIsPlaying(true)
  }

  const pauseAnimation = () => {
    setIsPlaying(false)
  }

  const resetAnimation = () => {
    setIsPlaying(false)
    setCurrentStep(0)
    generateSteps()
  }

  useEffect(() => {
    if (isPlaying && currentStep < steps.length - 1) {
      const timer = setTimeout(() => {
        setCurrentStep((prev) => prev + 1)
      }, 800)
      return () => clearTimeout(timer)
    } else if (currentStep >= steps.length - 1) {
      setIsPlaying(false)
    }
  }, [isPlaying, currentStep, steps.length])

  useEffect(() => {
    generateSteps()
  }, [n, approach])

  const getCurrentStep = () => steps[currentStep]
  const getFinalResult = () => (steps.length > 0 ? steps[steps.length - 1]?.value : null)

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3 mb-4">
            <TrendingUp className="h-8 w-8 text-blue-600" />
            <h1 className="text-4xl font-bold tracking-tight">Fibonacci Sequence</h1>
          </div>
          <p className="text-xl text-muted-foreground">Compare different approaches to computing Fibonacci numbers</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Visualization</CardTitle>
              <CardDescription>
                Watch how different approaches compute F({n}) = {getFinalResult()}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Label htmlFor="n-input">n =</Label>
                  <Input
                    id="n-input"
                    type="number"
                    min="1"
                    max="15"
                    value={n}
                    onChange={(e) => setN(Math.max(1, Math.min(15, Number.parseInt(e.target.value) || 1)))}
                    className="w-20"
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={isPlaying ? pauseAnimation : playAnimation} variant="outline" size="sm">
                    {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                    {isPlaying ? "Pause" : "Play"}
                  </Button>
                  <Button onClick={resetAnimation} variant="outline" size="sm">
                    <RotateCcw className="h-4 w-4" />
                    Reset
                  </Button>
                </div>
              </div>

              <Tabs value={approach} onValueChange={(value) => setApproach(value as any)}>
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="recursive">Recursive</TabsTrigger>
                  <TabsTrigger value="memoization">Memoization</TabsTrigger>
                  <TabsTrigger value="tabulation">Tabulation</TabsTrigger>
                </TabsList>

                <TabsContent value="recursive" className="space-y-4">
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <h3 className="font-semibold text-red-800 mb-2">Naive Recursive Approach</h3>
                    <p className="text-sm text-red-700 mb-2">Time: O(2ⁿ), Space: O(n)</p>
                    <code className="text-xs bg-red-100 p-2 rounded block">
                      {`function fib(n) {
  if (n <= 1) return n;
  return fib(n-1) + fib(n-2);
}`}
                    </code>
                  </div>
                </TabsContent>

                <TabsContent value="memoization" className="space-y-4">
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <h3 className="font-semibold text-yellow-800 mb-2">Top-Down with Memoization</h3>
                    <p className="text-sm text-yellow-700 mb-2">Time: O(n), Space: O(n)</p>
                    <code className="text-xs bg-yellow-100 p-2 rounded block">
                      {`function fib(n, memo = {}) {
  if (memo[n]) return memo[n];
  if (n <= 1) return n;
  memo[n] = fib(n-1, memo) + fib(n-2, memo);
  return memo[n];
}`}
                    </code>
                  </div>
                  {Object.keys(memo).length > 0 && (
                    <div className="bg-muted p-3 rounded">
                      <h4 className="font-medium mb-2">Memoization Cache:</h4>
                      <div className="flex flex-wrap gap-1">
                        {Object.entries(memo).map(([key, value]) => (
                          <Badge key={key} variant="secondary" className="text-xs">
                            F({key}) = {value}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="tabulation" className="space-y-4">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h3 className="font-semibold text-green-800 mb-2">Bottom-Up Tabulation</h3>
                    <p className="text-sm text-green-700 mb-2">Time: O(n), Space: O(n)</p>
                    <code className="text-xs bg-green-100 p-2 rounded block">
                      {`function fib(n) {
  const dp = [0, 1];
  for (let i = 2; i <= n; i++) {
    dp[i] = dp[i-1] + dp[i-2];
  }
  return dp[n];
}`}
                    </code>
                  </div>
                  {table.length > 0 && (
                    <div className="bg-muted p-3 rounded">
                      <h4 className="font-medium mb-2">DP Table:</h4>
                      <div className="grid grid-cols-8 gap-1">
                        {table.slice(0, Math.min(16, table.length)).map((value, index) => (
                          <div
                            key={index}
                            className={`text-center p-2 rounded text-xs border ${
                              currentStep >= index ? "bg-green-100 border-green-300" : "bg-gray-100 border-gray-300"
                            }`}
                          >
                            <div className="font-mono">F({index})</div>
                            <div className="font-bold">{currentStep >= index ? value : "?"}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </TabsContent>
              </Tabs>

              {getCurrentStep() && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-800 mb-2">
                    Current Step: {currentStep + 1} / {steps.length}
                  </h4>
                  <p className="text-sm text-blue-700">
                    Computing F({getCurrentStep().n}){getCurrentStep().fromCache && " (from cache)"}
                    {getCurrentStep().computed && ` = ${getCurrentStep().value}`}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Statistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Total Calls:</span>
                  <Badge variant="outline">{stats.calls}</Badge>
                </div>
                {approach === "memoization" && (
                  <div className="flex justify-between">
                    <span className="text-sm">Cache Hits:</span>
                    <Badge variant="outline">{stats.cacheHits}</Badge>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-sm">Progress:</span>
                  <Badge variant="outline">
                    {currentStep + 1} / {steps.length}
                  </Badge>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium">Complexity Comparison:</h4>
                <div className="text-xs space-y-1">
                  <div className="flex justify-between">
                    <span>Recursive:</span>
                    <span className="text-red-600">O(2ⁿ)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Memoization:</span>
                    <span className="text-green-600">O(n)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tabulation:</span>
                    <span className="text-green-600">O(n)</span>
                  </div>
                </div>
              </div>

              <div className="bg-muted p-3 rounded">
                <h4 className="font-medium text-sm mb-2">Key Insights:</h4>
                <ul className="text-xs space-y-1 text-muted-foreground">
                  <li>• Recursive: Exponential time due to repeated calculations</li>
                  <li>• Memoization: Cache results to avoid recomputation</li>
                  <li>• Tabulation: Build solution bottom-up iteratively</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
