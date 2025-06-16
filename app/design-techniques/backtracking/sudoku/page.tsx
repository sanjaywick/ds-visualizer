"use client"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Play, RotateCcw } from "lucide-react"

interface SudokuState {
  board: number[][]
  isOriginal: boolean[][]
  currentCell: [number, number] | null
  backtrackCell: [number, number] | null
  attempts: number
  backtracks: number
}

const INITIAL_PUZZLE = [
  [5, 3, 0, 0, 7, 0, 0, 0, 0],
  [6, 0, 0, 1, 9, 5, 0, 0, 0],
  [0, 9, 8, 0, 0, 0, 0, 6, 0],
  [8, 0, 0, 0, 6, 0, 0, 0, 3],
  [4, 0, 0, 8, 0, 3, 0, 0, 1],
  [7, 0, 0, 0, 2, 0, 0, 0, 6],
  [0, 6, 0, 0, 0, 0, 2, 8, 0],
  [0, 0, 0, 4, 1, 9, 0, 0, 5],
  [0, 0, 0, 0, 8, 0, 0, 7, 9],
]

export default function SudokuSolver() {
  const [sudokuState, setSudokuState] = useState<SudokuState>({
    board: INITIAL_PUZZLE.map((row) => [...row]),
    isOriginal: INITIAL_PUZZLE.map((row) => row.map((cell) => cell !== 0)),
    currentCell: null,
    backtrackCell: null,
    attempts: 0,
    backtracks: 0,
  })
  const [isAnimating, setIsAnimating] = useState(false)
  const [speed, setSpeed] = useState(500)
  const [isSolved, setIsSolved] = useState(false)
  const [explanation, setExplanation] = useState("Click 'Start Solving' to begin the backtracking algorithm")

  const isValid = (board: number[][], row: number, col: number, num: number): boolean => {
    // Check row
    for (let x = 0; x < 9; x++) {
      if (board[row][x] === num) return false
    }

    // Check column
    for (let x = 0; x < 9; x++) {
      if (board[x][col] === num) return false
    }

    // Check 3x3 box
    const startRow = row - (row % 3)
    const startCol = col - (col % 3)
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (board[i + startRow][j + startCol] === num) return false
      }
    }

    return true
  }

  const findEmptyCell = (board: number[][]): [number, number] | null => {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (board[row][col] === 0) {
          return [row, col]
        }
      }
    }
    return null
  }

  const solveSudoku = useCallback(
    async (board: number[][], attempts: number, backtracks: number): Promise<boolean> => {
      const emptyCell = findEmptyCell(board)

      if (!emptyCell) {
        setIsSolved(true)
        setExplanation("🎉 Sudoku solved successfully!")
        return true
      }

      const [row, col] = emptyCell

      setSudokuState((prev) => ({
        ...prev,
        currentCell: [row, col],
        backtrackCell: null,
        attempts: attempts + 1,
      }))

      setExplanation(`Trying to fill cell (${row + 1}, ${col + 1})...`)
      await new Promise((resolve) => setTimeout(resolve, speed))

      for (let num = 1; num <= 9; num++) {
        if (isValid(board, row, col, num)) {
          board[row][col] = num

          setSudokuState((prev) => ({
            ...prev,
            board: board.map((r) => [...r]),
            attempts: attempts + 1,
          }))

          setExplanation(`Placed ${num} at (${row + 1}, ${col + 1}). Checking if this leads to a solution...`)
          await new Promise((resolve) => setTimeout(resolve, speed))

          if (await solveSudoku(board, attempts + 1, backtracks)) {
            return true
          }

          // Backtrack
          board[row][col] = 0
          setSudokuState((prev) => ({
            ...prev,
            board: board.map((r) => [...r]),
            backtrackCell: [row, col],
            backtracks: backtracks + 1,
          }))

          setExplanation(`${num} at (${row + 1}, ${col + 1}) didn't work. Backtracking...`)
          await new Promise((resolve) => setTimeout(resolve, speed))
        }
      }

      setSudokuState((prev) => ({
        ...prev,
        currentCell: null,
        backtrackCell: null,
      }))

      return false
    },
    [speed],
  )

  const startSolving = async () => {
    if (isAnimating) return

    setIsAnimating(true)
    setIsSolved(false)

    const boardCopy = sudokuState.board.map((row) => [...row])
    await solveSudoku(boardCopy, 0, 0)

    setIsAnimating(false)
  }

  const resetPuzzle = () => {
    setSudokuState({
      board: INITIAL_PUZZLE.map((row) => [...row]),
      isOriginal: INITIAL_PUZZLE.map((row) => row.map((cell) => cell !== 0)),
      currentCell: null,
      backtrackCell: null,
      attempts: 0,
      backtracks: 0,
    })
    setIsAnimating(false)
    setIsSolved(false)
    setExplanation("Click 'Start Solving' to begin the backtracking algorithm")
  }

  const getCellClassName = (row: number, col: number) => {
    let className = "w-8 h-8 border border-gray-400 flex items-center justify-center text-sm font-medium "

    // Grid lines
    if (row % 3 === 0) className += "border-t-2 border-t-gray-800 "
    if (col % 3 === 0) className += "border-l-2 border-l-gray-800 "
    if (row === 8) className += "border-b-2 border-b-gray-800 "
    if (col === 8) className += "border-r-2 border-r-gray-800 "

    // Cell states
    if (sudokuState.isOriginal[row][col]) {
      className += "bg-gray-100 font-bold text-gray-800 "
    } else if (sudokuState.currentCell && sudokuState.currentCell[0] === row && sudokuState.currentCell[1] === col) {
      className += "bg-blue-200 text-blue-800 animate-pulse "
    } else if (
      sudokuState.backtrackCell &&
      sudokuState.backtrackCell[0] === row &&
      sudokuState.backtrackCell[1] === col
    ) {
      className += "bg-red-200 text-red-800 animate-pulse "
    } else if (sudokuState.board[row][col] !== 0) {
      className += "bg-green-100 text-green-800 "
    } else {
      className += "bg-white hover:bg-gray-50 "
    }

    return className
  }

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Sudoku Solver</h1>
        <p className="text-gray-600">Watch the backtracking algorithm solve a Sudoku puzzle step by step</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sudoku Board */}
        <Card>
          <CardHeader>
            <CardTitle>Sudoku Board</CardTitle>
            <CardDescription>Blue = Current cell, Red = Backtracking, Green = Filled, Gray = Original</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center space-y-4">
            <div className="grid grid-cols-9 gap-0 border-2 border-gray-800">
              {sudokuState.board.map((row, rowIndex) =>
                row.map((cell, colIndex) => (
                  <div key={`${rowIndex}-${colIndex}`} className={getCellClassName(rowIndex, colIndex)}>
                    {cell !== 0 ? cell : ""}
                  </div>
                )),
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              <Button onClick={startSolving} disabled={isAnimating || isSolved} className="flex items-center gap-2">
                <Play className="w-4 h-4" />
                Start Solving
              </Button>

              <Button onClick={resetPuzzle} variant="outline" className="flex items-center gap-2">
                <RotateCcw className="w-4 h-4" />
                Reset
              </Button>
            </div>

            <div className="flex items-center gap-4">
              <label className="text-sm font-medium">Speed:</label>
              <input
                type="range"
                min="100"
                max="2000"
                step="100"
                value={speed}
                onChange={(e) => setSpeed(Number(e.target.value))}
                className="w-32"
                disabled={isAnimating}
              />
              <span className="text-sm text-gray-600">{speed}ms</span>
            </div>
          </CardContent>
        </Card>

        {/* Algorithm Info */}
        <Card>
          <CardHeader>
            <CardTitle>Algorithm Progress</CardTitle>
            <CardDescription>Real-time backtracking visualization</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{sudokuState.attempts}</div>
                <div className="text-sm text-gray-600">Attempts</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{sudokuState.backtracks}</div>
                <div className="text-sm text-gray-600">Backtracks</div>
              </div>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium mb-2">Current Status:</h4>
              <p className="text-sm text-gray-700">{explanation}</p>
            </div>

            {isSolved && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <h4 className="font-medium text-green-800 mb-2">🎉 Puzzle Solved!</h4>
                <p className="text-sm text-green-700">
                  The backtracking algorithm successfully solved the Sudoku puzzle with {sudokuState.attempts} attempts
                  and {sudokuState.backtracks} backtracks.
                </p>
              </div>
            )}

            <div className="space-y-2">
              <h4 className="font-medium">Legend:</h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-blue-200 border"></div>
                  <span>Current cell</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-red-200 border"></div>
                  <span>Backtracking</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-100 border"></div>
                  <span>Filled by algorithm</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-gray-100 border"></div>
                  <span>Original clues</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Algorithm Explanation */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>How Backtracking Works in Sudoku</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-2">Algorithm Steps:</h4>
              <ol className="list-decimal list-inside space-y-1 text-sm text-gray-700">
                <li>Find the first empty cell</li>
                <li>Try numbers 1-9 in that cell</li>
                <li>Check if the number is valid (row, column, 3x3 box)</li>
                <li>If valid, place the number and move to next empty cell</li>
                <li>If no valid numbers work, backtrack to previous cell</li>
                <li>Try the next number in the previous cell</li>
                <li>Repeat until puzzle is solved</li>
              </ol>
            </div>
            <div>
              <h4 className="font-medium mb-2">Complexity Analysis:</h4>
              <div className="space-y-2 text-sm">
                <div>
                  <strong>Time Complexity:</strong> O(9^(n*n)) worst case
                </div>
                <div>
                  <strong>Space Complexity:</strong> O(n*n) for recursion stack
                </div>
                <div>
                  <strong>Best Case:</strong> When puzzle has many clues
                </div>
                <div>
                  <strong>Worst Case:</strong> When puzzle has few clues
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
