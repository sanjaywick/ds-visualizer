import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { ArrowRight, ArrowLeftRight, Droplets, Plus } from "lucide-react"

export default function TwoPointers() {
  const problems = [
    {
      name: "Two Sum (Sorted Array)",
      description: "Find two numbers that add up to a target sum",
      icon: <Plus className="h-5 w-5" />,
      path: "/design-techniques/two-pointers/two-sum",
      difficulty: "Easy",
      timeComplexity: "O(n)",
      spaceComplexity: "O(1)",
      concepts: ["Opposite direction", "Target sum", "Sorted array"],
    },
    {
      name: "Container With Most Water",
      description: "Find container that can hold the most water",
      icon: <Droplets className="h-5 w-5" />,
      path: "/design-techniques/two-pointers/container",
      difficulty: "Medium",
      timeComplexity: "O(n)",
      spaceComplexity: "O(1)",
      concepts: ["Area maximization", "Greedy choice", "Opposite direction"],
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
            <ArrowLeftRight className="h-8 w-8 text-purple-600" />
            <h1 className="text-4xl font-bold tracking-tight">Two Pointers Technique</h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Efficiently solve array and string problems using two pointers moving in coordination
          </p>
        </div>

        <div className="bg-purple-50 border border-purple-200 rounded-lg p-6 space-y-4">
          <h2 className="text-2xl font-bold text-purple-900">Two Pointers Patterns</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <h3 className="font-semibold mb-2 text-purple-800">Opposite Direction</h3>
              <ul className="space-y-1 text-sm text-purple-700">
                <li>• Start from both ends</li>
                <li>• Move towards center</li>
                <li>• Common in sorted arrays</li>
                <li>• Examples: Two Sum, Palindrome</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2 text-purple-800">Same Direction</h3>
              <ul className="space-y-1 text-sm text-purple-700">
                <li>• Both pointers move forward</li>
                <li>• Different speeds (fast/slow)</li>
                <li>• Sliding window variant</li>
                <li>• Examples: Remove duplicates</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2 text-purple-800">Fixed + Moving</h3>
              <ul className="space-y-1 text-sm text-purple-700">
                <li>• One pointer fixed</li>
                <li>• Other pointer explores</li>
                <li>• Reduces complexity</li>
                <li>• Examples: 3Sum, 4Sum</li>
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
          <h2 className="text-xl font-bold mb-4">When to Use Two Pointers</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-2 text-green-700">✅ Good Candidates:</h3>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Sorted arrays or strings</li>
                <li>• Finding pairs/triplets with target sum</li>
                <li>• Palindrome checking</li>
                <li>• Removing duplicates in-place</li>
                <li>• Container/area maximization problems</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2 text-red-700">❌ Not Suitable:</h3>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Unsorted data (usually)</li>
                <li>• Complex state tracking needed</li>
                <li>• Non-linear data structures</li>
                <li>• Problems requiring backtracking</li>
                <li>• When order matters significantly</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
