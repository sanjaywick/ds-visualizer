import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { ArrowRight, Network, Search, Route, GitBranch } from "lucide-react"

export default function GraphAlgorithms() {
  const problems = [
    {
      name: "Depth-First Search (DFS)",
      description: "Explore graph by going as deep as possible before backtracking",
      icon: <Search className="h-5 w-5" />,
      path: "/design-techniques/graph/dfs",
      difficulty: "Medium",
      timeComplexity: "O(V + E)",
      spaceComplexity: "O(V)",
      concepts: ["Stack-based", "Recursive", "Connected components"],
    },
    {
      name: "Breadth-First Search (BFS)",
      description: "Explore graph level by level using queue",
      icon: <GitBranch className="h-5 w-5" />,
      path: "/design-techniques/graph/bfs",
      difficulty: "Medium",
      timeComplexity: "O(V + E)",
      spaceComplexity: "O(V)",
      concepts: ["Queue-based", "Shortest path", "Level-order"],
    },
    {
      name: "Dijkstra's Algorithm",
      description: "Find shortest paths from source to all vertices",
      icon: <Route className="h-5 w-5" />,
      path: "/design-techniques/graph/dijkstra",
      difficulty: "Hard",
      timeComplexity: "O((V + E) log V)",
      spaceComplexity: "O(V)",
      concepts: ["Priority queue", "Shortest path", "Weighted graph"],
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
            <Network className="h-8 w-8 text-indigo-600" />
            <h1 className="text-4xl font-bold tracking-tight">Graph Algorithms</h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Solve problems involving graphs, networks, and relationships between entities
          </p>
        </div>

        <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-6 space-y-4">
          <h2 className="text-2xl font-bold text-indigo-900">Graph Representations</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-2 text-indigo-800">Adjacency List</h3>
              <ul className="space-y-1 text-sm text-indigo-700">
                <li>• Space efficient for sparse graphs</li>
                <li>• O(V + E) space complexity</li>
                <li>• Fast to iterate over neighbors</li>
                <li>• Common in practice</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2 text-indigo-800">Adjacency Matrix</h3>
              <ul className="space-y-1 text-sm text-indigo-700">
                <li>• O(1) edge lookup time</li>
                <li>• O(V²) space complexity</li>
                <li>• Good for dense graphs</li>
                <li>• Simple implementation</li>
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
      </div>
    </div>
  )
}
