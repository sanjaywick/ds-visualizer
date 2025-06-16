"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Type, Play, Pause, RotateCcw } from "lucide-react"

interface LCSState {
  i: number
  j: number
  step: string
  lcs: string
}

export default function LCSVisualization() {
  const [string1, setString1] = useState("ABCDGH")
  const [string2, setString2] = useState("AEDFHR")
  const [dp, setDp] = useState<number[][]>([])
  const [currentState, setCurrentState] = useState<LCSState | null>(null)
  const [isAnimating, setIsAnimating] = useState(false)
  const [animationSpeed, setAnimationSpeed] = useState(800)
  const [lcsResult, setLcsResult] = useState("")
  const [lcsPath, setLcsPath] = useState<{ i: number; j: number }[]>([])

  const initializeDP = () => {
    const m = string1.length
    const n = string2.length
    const newDp = Array(m + 1)
      .fill(null)
      .map(() => Array(n + 1).fill(0))
    setDp(newDp)
    setLcsResult("")
    setLcsPath([])
    setCurrentState(null)
  }

  useEffect(() => {
    initializeDP()
  }, [string1, string2])

  const solveLCS = async () => {
    if (isAnimating) return
    setIsAnimating(true)

    const m = string1.length
    const n = string2.length
    const newDp = Array(m + 1)
      .fill(null)
      .map(() => Array(n + 1).fill(0))

    // Fill the DP table with animation
    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        setCurrentState({
          i,
          j,
          step: `Comparing '${string1[i - 1]}' with '${string2[j - 1]}'`,
          lcs: "",
        })

        await new Promise((resolve) => setTimeout(resolve, animationSpeed))

        if (string1[i - 1] === string2[j - 1]) {
          newDp[i][j] = newDp[i - 1][j - 1] + 1
          setCurrentState((prev) =>
            prev
              ? {
                  ...prev,
                  step: `Match found! '${string1[i - 1]}' = '${string2[j - 1]}', dp[${i}][${j}] = ${newDp[i][j]}`,
                }
              : null,
          )
        } else {
          newDp[i][j] = Math.max(newDp[i - 1][j], newDp[i][j - 1])
          setCurrentState((prev) =>
            prev
              ? {
                  ...prev,
                  step: `No match. Taking max(${newDp[i - 1][j]}, ${newDp[i][j - 1]}) = ${newDp[i][j]}`,
                }
              : null,
          )
        }

        setDp([...newDp])
        await new Promise((resolve) => setTimeout(resolve, animationSpeed))
      }
    }

    // Backtrack to find LCS
    let lcs = ""
    let i = m,
      j = n
    const path: { i: number; j: number }[] = []

    while (i > 0 && j > 0) {
      path.push({ i, j })
      if (string1[i - 1] === string2[j - 1]) {
        lcs = string1[i - 1] + lcs
        i--
        j--
      } else if (newDp[i - 1][j] > newDp[i][j - 1]) {
        i--
      } else {
        j--
      }
    }

    setLcsPath(path.reverse())
    setLcsResult(lcs)
    setCurrentState({
      i: m,
      j: n,
      step: `LCS found: "${lcs}" (length: ${lcs.length})`,
      lcs,
    })

    setIsAnimating(false)
  }

  const reset = () => {
    setIsAnimating(false)
    initializeDP()
  }

  const getCellClass = (i: number, j: number) => {
    if (currentState && currentState.i === i && currentState.j === j) {
      return "bg-blue-200 font-bold"
    }
    if (lcsPath.some((p) => p.i === i && p.j === j)) {
      return "bg-green-200"
    }
    if (dp[i] && dp[i][j] > 0) {
      return "bg-green-50"
    }
    return ""
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Type className="h-8 w-8 text-purple-600" />
            <h1 className="text-4xl font-bold tracking-tight">Longest Common Subsequence</h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Find the longest subsequence common to both strings using dynamic programming
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
                  <Label htmlFor="string1">String 1</Label>
                  <Input
                    id="string1"
                    value={string1}
                    onChange={(e) => setString1(e.target.value.toUpperCase())}
                    disabled={isAnimating}
                    placeholder="Enter first string"
                  />
                </div>

                <div>
                  <Label htmlFor="string2">String 2</Label>
                  <Input
                    id="string2"
                    value={string2}
                    onChange={(e) => setString2(e.target.value.toUpperCase())}
                    disabled={isAnimating}
                    placeholder="Enter second string"
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
                  <Button onClick={solveLCS} disabled={isAnimating || !string1 || !string2} className="flex-1">
                    {isAnimating ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
                    {isAnimating ? "Running..." : "Find LCS"}
                  </Button>
                  <Button onClick={reset} variant="outline" disabled={isAnimating}>
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Result */}
            {lcsResult && (
              <Card>
                <CardHeader>
                  <CardTitle>Result</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div>
                      <span className="font-medium">LCS: </span>
                      <span className="font-mono text-lg bg-green-100 px-2 py-1 rounded">{lcsResult}</span>
                    </div>
                    <div>
                      <span className="font-medium">Length: </span>
                      <span className="text-lg font-bold">{lcsResult.length}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* String Visualization */}
            <Card>
              <CardHeader>
                <CardTitle>String Comparison</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="font-medium mb-2">String 1:</div>
                    <div className="flex gap-1">
                      {string1.split("").map((char, index) => (
                        <div
                          key={index}
                          className={`w-8 h-8 border rounded flex items-center justify-center font-mono ${
                            lcsResult.includes(char) ? "bg-green-100 border-green-300" : "bg-gray-50"
                          }`}
                        >
                          {char}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="font-medium mb-2">String 2:</div>
                    <div className="flex gap-1">
                      {string2.split("").map((char, index) => (
                        <div
                          key={index}
                          className={`w-8 h-8 border rounded flex items-center justify-center font-mono ${
                            lcsResult.includes(char) ? "bg-green-100 border-green-300" : "bg-gray-50"
                          }`}
                        >
                          {char}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* DP Table Visualization */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Dynamic Programming Table</CardTitle>
                <CardDescription>
                  dp[i][j] = length of LCS of first i characters of string1 and first j characters of string2
                </CardDescription>
              </CardHeader>
              <CardContent>
                {dp.length > 0 && (
                  <div className="overflow-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr>
                          <th className="border p-2 bg-gray-100"></th>
                          <th className="border p-2 bg-gray-100">∅</th>
                          {string2.split("").map((char, index) => (
                            <th key={index} className="border p-2 bg-gray-100 min-w-[40px]">
                              {char}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {dp.map((row, i) => (
                          <tr key={i}>
                            <td className="border p-2 bg-gray-100 font-medium">{i === 0 ? "∅" : string1[i - 1]}</td>
                            {row.map((value, j) => (
                              <td key={j} className={`border p-2 text-center ${getCellClass(i, j)}`}>
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
                  <div className="bg-gray-100 p-3 rounded mt-1 text-sm font-mono">
                    <div>if (str1[i-1] == str2[j-1]):</div>
                    <div className="ml-4">dp[i][j] = dp[i-1][j-1] + 1</div>
                    <div>else:</div>
                    <div className="ml-4">dp[i][j] = max(dp[i-1][j], dp[i][j-1])</div>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold">Time Complexity:</h4>
                  <p className="text-sm text-muted-foreground">O(m × n) where m and n are lengths of the strings</p>
                </div>
                <div>
                  <h4 className="font-semibold">Space Complexity:</h4>
                  <p className="text-sm text-muted-foreground">O(m × n) for the DP table</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
