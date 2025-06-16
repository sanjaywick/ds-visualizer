import { ArrowLeftRight, Network, RotateCcw, Scissors, Target, TrendingUp } from "lucide-react"

const techniques = [
  {
    name: "Dynamic Programming",
    description: "Solve complex problems by breaking them down into simpler subproblems",
    icon: <TrendingUp className="h-6 w-6" />,
    path: "/design-techniques/dynamic-programming",
    color: "bg-blue-500",
    problems: ["Fibonacci", "Knapsack", "LCS", "Coin Change"],
    difficulty: "Medium to Hard",
  },
  {
    name: "Divide & Conquer",
    description: "Break problems into smaller subproblems, solve recursively, then combine",
    icon: <Scissors className="h-6 w-6" />,
    path: "/design-techniques/divide-conquer",
    color: "bg-green-500",
    problems: ["Binary Search", "Merge Sort", "Quick Sort", "Maximum Subarray"],
    difficulty: "Medium",
  },
  {
    name: "Greedy Algorithms",
    description: "Make locally optimal choices at each step to find global optimum",
    icon: <Target className="h-6 w-6" />,
    path: "/design-techniques/greedy",
    color: "bg-yellow-500",
    problems: ["Activity Selection", "Fractional Knapsack", "Huffman Coding"],
    difficulty: "Easy to Medium",
  },
  {
    name: "Two Pointers",
    description: "Use two pointers moving in coordination to solve array/string problems",
    icon: <ArrowLeftRight className="h-6 w-6" />,
    path: "/design-techniques/two-pointers",
    color: "bg-purple-500",
    problems: ["Two Sum", "Container With Most Water"],
    difficulty: "Easy to Medium",
  },
  {
    name: "Backtracking",
    description: "Explore all possible solutions by trying and undoing choices",
    icon: <RotateCcw className="h-6 w-6" />,
    path: "/design-techniques/backtracking",
    color: "bg-red-500",
    problems: ["N-Queens", "Sudoku Solver", "Permutations"],
    difficulty: "Medium to Hard",
  },
  {
    name: "Graph Algorithms",
    description: "Traverse and analyze graph structures using various algorithms",
    icon: <Network className="h-6 w-6" />,
    path: "/design-techniques/graph",
    color: "bg-indigo-500",
    problems: ["DFS", "BFS", "Dijkstra's Algorithm"],
    difficulty: "Medium to Hard",
  },
]

export default function Page() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-5">Design Techniques</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {techniques.map((technique) => (
          <a
            key={technique.name}
            href={technique.path}
            className="block rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow duration-300"
          >
            <div className="flex items-center mb-4">
              <span className={`rounded-full p-2 ${technique.color} mr-3`}>{technique.icon}</span>
              <h2 className="text-xl font-semibold">{technique.name}</h2>
            </div>
            <p className="text-gray-700">{technique.description}</p>
            <p className="mt-2 text-sm">Difficulty: {technique.difficulty}</p>
            <p className="mt-2 text-sm">Problems: {technique.problems.join(", ")}</p>
          </a>
        ))}
      </div>
    </div>
  )
}
