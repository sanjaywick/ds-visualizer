import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { ArrowRight, Divide, Search, BarChart3, Zap, TrendingUp } from "lucide-react"

export default function DivideConquer() {
  const problems = [
    {
      name: "Binary Search",
      description: "Search for element in sorted array by dividing search space",
      icon: <Search className="h-5 w-5" />,
      path: "/design-techniques/divide-conquer/binary-search",
      difficulty: "Easy",
      timeComplexity: "O(log n)",
      spaceComplexity: "O(1) iterative, O(log n) recursive",
      concepts: ["Search space reduction", "Sorted array", "Logarithmic time"],
    },
    {
      name: "Merge Sort",
      description: "Divide array into halves, sort recursively, then merge",
      icon: <BarChart3 className="h-5 w-5" />,
      path: "/sorting/merge",
      difficulty: "Medium",
      timeComplexity: "O(n log n)",
      spaceComplexity: "O(n)",
      concepts: ["Divide and conquer", "Stable sort", "Guaranteed performance"],
    },
    {
      name: "Quick Sort",
      description: "Partition around pivot, sort subarrays recursively",
      icon: <Zap className="h-5 w-5" />,
      path: "/sorting/quick",
      difficulty: "Medium",
      timeComplexity: "O(n log n) average",
      spaceComplexity: "O(log n)",
      concepts: ["Pivot selection", "Partitioning", "In-place sorting"],
    },
    {
      name: "Maximum Subarray",
      description: "Find contiguous subarray with maximum sum",
      icon: <TrendingUp className="h-5 w-5" />,
      path: "/design-techniques/divide-conquer/max-subarray",
      difficulty: "Medium",
      timeComplexity: "O(n log n)",
      spaceComplexity: "O(log n)",
      concepts: ["Kadane's algorithm", "Cross-sum", "Divide and conquer"],
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
            <Divide className="h-8 w-8 text-green-600" />
            <h1 className="text-4xl font-bold tracking-tight">Divide & Conquer</h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Break problems into smaller subproblems, solve recursively, then combine solutions
          </p>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-6 space-y-4">
          <h2 className="text-2xl font-bold text-green-900">Divide & Conquer Strategy</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <h3 className="font-semibold mb-2 text-green-800">1. Divide</h3>
              <p className="text-sm text-green-700">Break the problem into smaller subproblems of the same type</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2 text-green-800">2. Conquer</h3>
              <p className="text-sm text-green-700">Solve subproblems recursively. If small enough, solve directly</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2 text-green-800">3. Combine</h3>
              <p className="text-sm text-green-700">
                Merge solutions of subproblems to get solution to original problem
              </p>
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
                <div className="grid grid-cols-1 gap-2 text-sm">
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
          <h2 className="text-xl font-bold mb-4">Master Theorem</h2>
          <p className="text-sm text-muted-foreground mb-4">For recurrences of the form T(n) = aT(n/b) + f(n):</p>
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div className="bg-white p-3 rounded border">
              <h3 className="font-semibold mb-2">Case 1</h3>
              <p className="text-xs">If f(n) = O(n^(log_b(a) - ε))</p>
              <p className="text-xs font-medium">Then T(n) = Θ(n^log_b(a))</p>
            </div>
            <div className="bg-white p-3 rounded border">
              <h3 className="font-semibold mb-2">Case 2</h3>
              <p className="text-xs">If f(n) = Θ(n^log_b(a))</p>
              <p className="text-xs font-medium">Then T(n) = Θ(n^log_b(a) log n)</p>
            </div>
            <div className="bg-white p-3 rounded border">
              <h3 className="font-semibold mb-2">Case 3</h3>
              <p className="text-xs">If f(n) = Ω(n^(log_b(a) + ε))</p>
              <p className="text-xs font-medium">Then T(n) = Θ(f(n))</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
