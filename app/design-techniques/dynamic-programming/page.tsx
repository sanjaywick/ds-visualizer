import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { ArrowRight, Zap, TrendingUp, Package, Type, Coins } from "lucide-react"

export default function DynamicProgramming() {
  const problems = [
    {
      name: "Fibonacci Sequence",
      description: "Classic introduction to memoization and bottom-up DP",
      icon: <TrendingUp className="h-5 w-5" />,
      path: "/design-techniques/dynamic-programming/fibonacci",
      difficulty: "Easy",
      timeComplexity: "O(n)",
      spaceComplexity: "O(n) or O(1)",
      concepts: ["Memoization", "Bottom-up", "Space optimization"],
    },
    {
      name: "0/1 Knapsack",
      description: "Optimize value within weight constraints",
      icon: <Package className="h-5 w-5" />,
      path: "/design-techniques/dynamic-programming/knapsack",
      difficulty: "Medium",
      timeComplexity: "O(nW)",
      spaceComplexity: "O(nW)",
      concepts: ["2D DP", "Optimization", "Space reduction"],
    },
    {
      name: "Longest Common Subsequence",
      description: "Find longest common subsequence between two strings",
      icon: <Type className="h-5 w-5" />,
      path: "/design-techniques/dynamic-programming/lcs",
      difficulty: "Medium",
      timeComplexity: "O(mn)",
      spaceComplexity: "O(mn)",
      concepts: ["String DP", "2D table", "Backtracking"],
    },
    {
      name: "Coin Change",
      description: "Find minimum coins needed to make a target amount",
      icon: <Coins className="h-5 w-5" />,
      path: "/design-techniques/dynamic-programming/coin-change",
      difficulty: "Medium",
      timeComplexity: "O(amount × coins)",
      spaceComplexity: "O(amount)",
      concepts: ["Unbounded knapsack", "Minimum path", "Bottom-up"],
    },
  ]

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "bg-green-100 text-green-800"
      case "Medium":
        return "bg-yellow-100 text-yellow-800"
      case "Hard":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Zap className="h-8 w-8 text-blue-600" />
            <h1 className="text-4xl font-bold tracking-tight">Dynamic Programming</h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Master the art of solving complex problems by breaking them into simpler, overlapping subproblems
          </p>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 space-y-4">
          <h2 className="text-2xl font-bold text-blue-900">What is Dynamic Programming?</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-2 text-blue-800">Key Principles:</h3>
              <ul className="space-y-1 text-sm text-blue-700">
                <li>
                  • <strong>Optimal Substructure:</strong> Optimal solution contains optimal solutions to subproblems
                </li>
                <li>
                  • <strong>Overlapping Subproblems:</strong> Same subproblems are solved multiple times
                </li>
                <li>
                  • <strong>Memoization:</strong> Store results to avoid recomputation
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2 text-blue-800">Two Approaches:</h3>
              <ul className="space-y-1 text-sm text-blue-700">
                <li>
                  • <strong>Top-down (Memoization):</strong> Recursive with caching
                </li>
                <li>
                  • <strong>Bottom-up (Tabulation):</strong> Iterative table filling
                </li>
                <li>
                  • <strong>Space Optimization:</strong> Reduce memory usage when possible
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {problems.map((problem) => (
            <Card key={problem.name} className="group hover:shadow-lg transition-all duration-200">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-3">
                  {problem.icon}
                  <span>{problem.name}</span>
                  <span className={`text-xs px-2 py-1 rounded-full ${getDifficultyColor(problem.difficulty)}`}>
                    {problem.difficulty}
                  </span>
                </CardTitle>
                <CardDescription>{problem.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Time:</span>
                    <p className="text-muted-foreground">{problem.timeComplexity}</p>
                  </div>
                  <div>
                    <span className="font-medium">Space:</span>
                    <p className="text-muted-foreground">{problem.spaceComplexity}</p>
                  </div>
                </div>

                <div>
                  <span className="font-medium text-sm">Key Concepts:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {problem.concepts.map((concept) => (
                      <span key={concept} className="text-xs bg-muted px-2 py-1 rounded">
                        {concept}
                      </span>
                    ))}
                  </div>
                </div>

                <Link href={problem.path} className="inline-block w-full">
                  <Button
                    variant="outline"
                    className="w-full group-hover:bg-primary group-hover:text-primary-foreground"
                  >
                    Visualize Solution <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="bg-muted/50 rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4">DP Problem-Solving Steps</h2>
          <div className="grid md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-2 text-sm font-bold">
                1
              </div>
              <h3 className="font-semibold text-sm">Identify</h3>
              <p className="text-xs text-muted-foreground">
                Recognize optimal substructure and overlapping subproblems
              </p>
            </div>
            <div className="text-center">
              <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-2 text-sm font-bold">
                2
              </div>
              <h3 className="font-semibold text-sm">Define</h3>
              <p className="text-xs text-muted-foreground">Define the DP state and recurrence relation</p>
            </div>
            <div className="text-center">
              <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-2 text-sm font-bold">
                3
              </div>
              <h3 className="font-semibold text-sm">Implement</h3>
              <p className="text-xs text-muted-foreground">Choose between top-down or bottom-up approach</p>
            </div>
            <div className="text-center">
              <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-2 text-sm font-bold">
                4
              </div>
              <h3 className="font-semibold text-sm">Optimize</h3>
              <p className="text-xs text-muted-foreground">Optimize space complexity if possible</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
