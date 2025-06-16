import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { ArrowRight, RotateCcw, Crown, Grid3X3, Shuffle } from "lucide-react"

export default function Backtracking() {
  const problems = [
    {
      name: "N-Queens",
      description: "Place N queens on NxN chessboard so none attack each other",
      icon: <Crown className="h-5 w-5" />,
      path: "/design-techniques/backtracking/n-queens",
      difficulty: "Hard",
      timeComplexity: "O(N!)",
      spaceComplexity: "O(N)",
      concepts: ["Constraint satisfaction", "Pruning", "Recursive exploration"],
    },
    {
      name: "Sudoku Solver",
      description: "Fill 9x9 grid following Sudoku rules",
      icon: <Grid3X3 className="h-5 w-5" />,
      path: "/design-techniques/backtracking/sudoku",
      difficulty: "Hard",
      timeComplexity: "O(9^(n*n))",
      spaceComplexity: "O(n*n)",
      concepts: ["Constraint checking", "Backtracking", "Grid traversal"],
    },
    {
      name: "Permutations",
      description: "Generate all possible permutations of given elements",
      icon: <Shuffle className="h-5 w-5" />,
      path: "/design-techniques/backtracking/permutations",
      difficulty: "Medium",
      timeComplexity: "O(N! × N)",
      spaceComplexity: "O(N)",
      concepts: ["Recursive generation", "Swapping", "State restoration"],
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
            <RotateCcw className="h-8 w-8 text-red-600" />
            <h1 className="text-4xl font-bold tracking-tight">Backtracking</h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Explore all possible solutions by trying and undoing choices systematically
          </p>
        </div>

        <div className="bg-red-50 border border-red-200 rounded-lg p-6 space-y-4">
          <h2 className="text-2xl font-bold text-red-900">Backtracking Strategy</h2>
          <div className="grid md:grid-cols-4 gap-4">
            <div>
              <h3 className="font-semibold mb-2 text-red-800">1. Choose</h3>
              <p className="text-sm text-red-700">Make a choice from available options</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2 text-red-800">2. Explore</h3>
              <p className="text-sm text-red-700">Recursively explore the consequences</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2 text-red-800">3. Check</h3>
              <p className="text-sm text-red-700">Validate if choice leads to solution</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2 text-red-800">4. Backtrack</h3>
              <p className="text-sm text-red-700">Undo choice if it doesn't work</p>
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
          <h2 className="text-xl font-bold mb-4">Backtracking Template</h2>
          <div className="bg-gray-900 text-gray-100 p-4 rounded-lg text-sm font-mono">
            <pre>{`function backtrack(state, choices) {
  // Base case: check if we have a complete solution
  if (isComplete(state)) {
    return processSolution(state);
  }
  
  // Try each possible choice
  for (choice of choices) {
    // Make the choice
    makeChoice(state, choice);
    
    // Check if choice is valid
    if (isValid(state)) {
      // Recursively explore
      if (backtrack(state, getNextChoices(state))) {
        return true; // Solution found
      }
    }
    
    // Backtrack: undo the choice
    undoChoice(state, choice);
  }
  
  return false; // No solution found
}`}</pre>
          </div>
        </div>
      </div>
    </div>
  )
}
