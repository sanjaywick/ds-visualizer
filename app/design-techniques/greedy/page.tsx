import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { ArrowRight, Target, Calendar, Package, Binary } from "lucide-react"

export default function GreedyAlgorithms() {
  const problems = [
    {
      name: "Activity Selection",
      description: "Select maximum number of non-overlapping activities",
      icon: <Calendar className="h-5 w-5" />,
      path: "/design-techniques/greedy/activity-selection",
      difficulty: "Easy",
      timeComplexity: "O(n log n)",
      spaceComplexity: "O(1)",
      concepts: ["Interval scheduling", "Greedy choice", "Optimal substructure"],
    },
    {
      name: "Fractional Knapsack",
      description: "Maximize value with weight constraint (fractions allowed)",
      icon: <Package className="h-5 w-5" />,
      path: "/design-techniques/greedy/fractional-knapsack",
      difficulty: "Medium",
      timeComplexity: "O(n log n)",
      spaceComplexity: "O(1)",
      concepts: ["Value-to-weight ratio", "Sorting", "Greedy selection"],
    },
    {
      name: "Huffman Coding",
      description: "Optimal prefix-free binary codes for data compression",
      icon: <Binary className="h-5 w-5" />,
      path: "/design-techniques/greedy/huffman-coding",
      difficulty: "Hard",
      timeComplexity: "O(n log n)",
      spaceComplexity: "O(n)",
      concepts: ["Priority queue", "Binary tree", "Prefix codes"],
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
            <Target className="h-8 w-8 text-yellow-600" />
            <h1 className="text-4xl font-bold tracking-tight">Greedy Algorithms</h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Make locally optimal choices at each step, hoping to find a global optimum
          </p>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 space-y-4">
          <h2 className="text-2xl font-bold text-yellow-900">Greedy Strategy</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-2 text-yellow-800">Key Properties:</h3>
              <ul className="space-y-1 text-sm text-yellow-700">
                <li>
                  • <strong>Greedy Choice Property:</strong> Locally optimal choice leads to globally optimal solution
                </li>
                <li>
                  • <strong>Optimal Substructure:</strong> Optimal solution contains optimal solutions to subproblems
                </li>
                <li>
                  • <strong>No Backtracking:</strong> Once a choice is made, it's never reconsidered
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2 text-yellow-800">When to Use:</h3>
              <ul className="space-y-1 text-sm text-yellow-700">
                <li>• Optimization problems</li>
                <li>• Local choices lead to global optimum</li>
                <li>• Problem has greedy choice property</li>
                <li>• Simpler than dynamic programming</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
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
          <h2 className="text-xl font-bold mb-4">Greedy vs Dynamic Programming</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-2 text-green-700">✅ Use Greedy When:</h3>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Problem has greedy choice property</li>
                <li>• Local optimum leads to global optimum</li>
                <li>• No need to reconsider previous choices</li>
                <li>• Simpler and more efficient solution exists</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2 text-blue-700">🔄 Use DP When:</h3>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Overlapping subproblems exist</li>
                <li>• Need to consider all possibilities</li>
                <li>• Greedy choice doesn't guarantee optimum</li>
                <li>• Problem requires exploring multiple paths</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
