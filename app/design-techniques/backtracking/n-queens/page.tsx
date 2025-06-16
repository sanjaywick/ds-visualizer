"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Crown, Play, Pause, RotateCcw, SkipForward } from "lucide-react"

interface Position {
  row: number
  col: number
}

interface BacktrackStep {
  board: number[][]
  queens: Position[]
  currentRow: number
  currentCol: number
  action: "place" | "remove" | "check" | "solution" | "backtrack"
  message: string
}

export default function NQueens() {
  const [n, setN] = useState(4)
  const [board, setBoard] = useState<number[][]>([])
  const [queens, setQueens] = useState<Position[]>([])
  const [solutions, setSolutions] = useState<Position[][]>([])
  const [currentSolution, setCurrentSolution] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [animationSpeed, setAnimationSpeed] = useState(800)
  const [steps, setSteps] = useState<BacktrackStep[]>([])
  const [currentStep, setCurrentStep] = useState(0)
  const [showAllSolutions, setShowAllSolutions] = useState(false)

  const initializeBoard = (size: number) => {
    const newBoard = Array(size)
      .fill(null)
      .map(() => Array(size).fill(0))
    setBoard(newBoard)
    setQueens([])
    setSolutions([])
    setCurrentSolution(0)
    setSteps([])
    setCurrentStep(0)
  }

  const isValidPosition = (board: number[][], row: number, col: number, size: number): boolean => {
    // Check column
    for (let i = 0; i < row; i++) {
      if (board[i][col] === 1) return false
    }

    // Check diagonal (top-left to bottom-right)
    for (let i = row - 1, j = col - 1; i >= 0 && j >= 0; i--, j--) {
      if (board[i][j] === 1) return false
    }

    // Check diagonal (top-right to bottom-left)
    for (let i = row - 1, j = col + 1; i >= 0 && j < size; i--, j++) {
      if (board[i][j] === 1) return false
    }

    return true
  }

  const solveNQueens = (size: number): BacktrackStep[] => {
    const allSteps: BacktrackStep[] = []
    const allSolutions: Position[][] = []
    const currentBoard = Array(size)
      .fill(null)
      .map(() => Array(size).fill(0))
    const currentQueens: Position[] = []

    const backtrack = (row: number) => {
      if (row === size) {
        // Found a solution
        allSolutions.push([...currentQueens])
        allSteps.push({
          board: currentBoard.map((row) => [...row]),
          queens: [...currentQueens],
          currentRow: row,
          currentCol: -1,
          action: "solution",
          message: `Solution ${allSolutions.length} found! All ${size} queens placed safely.`,
        })
        return
      }

      for (let col = 0; col < size; col++) {
        allSteps.push({
          board: currentBoard.map((row) => [...row]),
          queens: [...currentQueens],
          currentRow: row,
          currentCol: col,
          action: "check",
          message: `Checking if queen can be placed at position (${row}, ${col})`,
        })

        if (isValidPosition(currentBoard, row, col, size)) {
          // Place queen
          currentBoard[row][col] = 1
          currentQueens.push({ row, col })

          allSteps.push({
            board: currentBoard.map((row) => [...row]),
            queens: [...currentQueens],
            currentRow: row,
            currentCol: col,
            action: "place",
            message: `Placed queen at (${row}, ${col}). Moving to next row.`,
          })

          backtrack(row + 1)

          // Backtrack - remove queen
          currentBoard[row][col] = 0
          currentQueens.pop()

          allSteps.push({
            board: currentBoard.map((row) => [...row]),
            queens: [...currentQueens],
            currentRow: row,
            currentCol: col,
            action: "backtrack",
            message: `Backtracking: Removed queen from (${row}, ${col})`,
          })
        }
      }
    }

    backtrack(0)
    setSolutions(allSolutions)
    return allSteps
  }

  const startSolving = () => {
    const solutionSteps = solveNQueens(n)
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
    initializeBoard(n)
  }

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1)
    }
  }

  useEffect(() => {
    initializeBoard(n)
  }, [n])

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
      setBoard(step.board)
      setQueens(step.queens)
    }
  }, [currentStep, steps])

  const getCellColor = (row: number, col: number) => {
    const step = steps[currentStep]
    if (!step) return (row + col) % 2 === 0 ? "bg-amber-100" : "bg-amber-200"

    const isCurrentPosition = step.currentRow === row && step.currentCol === col
    const hasQueen = board[row][col] === 1
    const isUnderAttack = isQueenUnderAttack(row, col)

    if (isCurrentPosition && step.action === "check") {
      return "bg-blue-300 border-2 border-blue-500"
    }
    if (isCurrentPosition && step.action === "place") {
      return "bg-green-300 border-2 border-green-500"
    }
    if (isCurrentPosition && step.action === "backtrack") {
      return "bg-red-300 border-2 border-red-500"
    }
    if (hasQueen) {
      return "bg-purple-400"
    }
    if (isUnderAttack) {
      return "bg-red-100"
    }

    return (row + col) % 2 === 0 ? "bg-amber-100" : "bg-amber-200"
  }

  const isQueenUnderAttack = (row: number, col: number): boolean => {
    return queens.some((queen) => {
      return queen.col === col || Math.abs(queen.row - row) === Math.abs(queen.col - col)
    })
  }

  const showSolution = (solutionIndex: number) => {
    if (solutions[solutionIndex]) {
      const solutionBoard = Array(n)
        .fill(null)
        .map(() => Array(n).fill(0))
      solutions[solutionIndex].forEach((pos) => {
        solutionBoard[pos.row][pos.col] = 1
      })
      setBoard(solutionBoard)
      setQueens(solutions[solutionIndex])
    }
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Crown className="h-8 w-8 text-purple-600" />
            <h1 className="text-4xl font-bold tracking-tight">N-Queens Problem</h1>
          </div>
          <p className="text-xl text-muted-foreground">
            Place N queens on an N×N chessboard so that no two queens attack each other
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
                  <Label htmlFor="board-size">Board Size (N)</Label>
                  <Input
                    id="board-size"
                    type="number"
                    min="4"
                    max="8"
                    value={n}
                    onChange={(e) => setN(Math.max(4, Math.min(8, Number.parseInt(e.target.value) || 4)))}
                  />
                </div>

                <div className="flex gap-2">
                  <Button onClick={startSolving} disabled={isAnimating} className="flex items-center gap-2">
                    <Play className="h-4 w-4" />
                    Solve
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
                    min="200"
                    max="2000"
                    step="200"
                    value={animationSpeed}
                    onChange={(e) => setAnimationSpeed(Number(e.target.value))}
                    className="w-full"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Chessboard</CardTitle>
                <CardDescription>
                  {steps.length > 0 && currentStep < steps.length
                    ? `Step ${currentStep + 1} of ${steps.length}`
                    : `${n}×${n} board`}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-muted p-4 rounded-lg mb-4 min-h-[60px]">
                  <p className="text-sm">
                    {steps.length > 0 && currentStep < steps.length
                      ? steps[currentStep].message
                      : "Click 'Solve' to start the N-Queens algorithm"}
                  </p>
                </div>

                <div className="flex justify-center">
                  <div
                    className="grid gap-1 p-4 bg-amber-900 rounded-lg"
                    style={{ gridTemplateColumns: `repeat(${n}, 1fr)` }}
                  >
                    {board.map((row, rowIndex) =>
                      row.map((cell, colIndex) => (
                        <div
                          key={`${rowIndex}-${colIndex}`}
                          className={`w-12 h-12 flex items-center justify-center text-2xl font-bold transition-all duration-300 ${getCellColor(rowIndex, colIndex)}`}
                        >
                          {cell === 1 && <Crown className="h-8 w-8 text-purple-800" />}
                        </div>
                      )),
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Algorithm Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span>Board Size:</span>
                  <span>
                    {n}×{n}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Queens Placed:</span>
                  <span>{queens.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Solutions Found:</span>
                  <span>{solutions.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Current Step:</span>
                  <span>
                    {currentStep + 1} / {steps.length}
                  </span>
                </div>
              </CardContent>
            </Card>

            {solutions.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Solutions ({solutions.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {solutions.map((_, index) => (
                      <Button
                        key={index}
                        variant={currentSolution === index ? "default" : "outline"}
                        size="sm"
                        onClick={() => {
                          setCurrentSolution(index)
                          showSolution(index)
                        }}
                        className="w-full"
                      >
                        Solution {index + 1}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle>Legend</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-purple-400 rounded"></div>
                  <span>Queen</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-blue-300 border-2 border-blue-500 rounded"></div>
                  <span>Checking Position</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-300 border-2 border-green-500 rounded"></div>
                  <span>Placing Queen</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-red-300 border-2 border-red-500 rounded"></div>
                  <span>Backtracking</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-red-100 rounded"></div>
                  <span>Under Attack</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
