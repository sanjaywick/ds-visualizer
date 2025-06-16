import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { ArrowRight, ArrowUpDown, BarChart3, Zap, Target, Shuffle, TrendingUp, Layers } from "lucide-react"

export default function SortingAlgorithms() {
  const algorithms = [
    {
      name: "Bubble Sort",
      description: "Simple comparison-based algorithm with adjacent swaps",
      icon: <BarChart3 className="h-6 w-6" />,
      path: "/sorting/bubble",
      difficulty: "Easy",
      timeComplexity: "O(n²)",
      spaceComplexity: "O(1)",
      stable: true,
      inPlace: true,
      color: "bg-red-50 border-red-200 hover:bg-red-100",
    },
    {
      name: "Selection Sort",
      description: "Find minimum element and place at beginning",
      icon: <Target className="h-6 w-6" />,
      path: "/sorting/selection",
      difficulty: "Easy",
      timeComplexity: "O(n²)",
      spaceComplexity: "O(1)",
      stable: false,
      inPlace: true,
      color: "bg-orange-50 border-orange-200 hover:bg-orange-100",
    },
    {
      name: "Insertion Sort",
      description: "Build sorted array one element at a time",
      icon: <TrendingUp className="h-6 w-6" />,
      path: "/sorting/insertion",
      difficulty: "Easy",
      timeComplexity: "O(n²)",
      spaceComplexity: "O(1)",
      stable: true,
      inPlace: true,
      color: "bg-yellow-50 border-yellow-200 hover:bg-yellow-100",
    },
    {
      name: "Quick Sort",
      description: "Divide and conquer with pivot partitioning",
      icon: <Zap className="h-6 w-6" />,
      path: "/sorting/quick",
      difficulty: "Medium",
      timeComplexity: "O(n log n)",
      spaceComplexity: "O(log n)",
      stable: false,
      inPlace: true,
      color: "bg-blue-50 border-blue-200 hover:bg-blue-100",
    },
    {
      name: "Merge Sort",
      description: "Divide and conquer with merging",
      icon: <Layers className="h-6 w-6" />,
      path: "/sorting/merge",
      difficulty: "Medium",
      timeComplexity: "O(n log n)",
      spaceComplexity: "O(n)",
      stable: true,
      inPlace: false,
      color: "bg-green-50 border-green-200 hover:bg-green-100",
    },
    {
      name: "Heap Sort",
      description: "Using heap data structure for sorting",
      icon: <Shuffle className="h-6 w-6" />,
      path: "/sorting/heap",
      difficulty: "Hard",
      timeComplexity: "O(n log n)",
      spaceComplexity: "O(1)",
      stable: false,
      inPlace: true,
      color: "bg-purple-50 border-purple-200 hover:bg-purple-100",
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
            <ArrowUpDown className="h-8 w-8 text-blue-600" />
            <h1 className="text-4xl font-bold tracking-tight">Sorting Algorithms</h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Visualize and compare different sorting algorithms with step-by-step animations
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {algorithms.map((algorithm) => (
            <Card key={algorithm.name} className={`group transition-all duration-200 ${algorithm.color}`}>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-3">
                  {algorithm.icon}
                  <span className="text-lg">{algorithm.name}</span>
                  <span className={`text-xs px-2 py-1 rounded-full ${getDifficultyColor(algorithm.difficulty)}`}>
                    {algorithm.difficulty}
                  </span>
                </CardTitle>
                <CardDescription>{algorithm.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Time:</span>
                    <p className="text-muted-foreground">{algorithm.timeComplexity}</p>
                  </div>
                  <div>
                    <span className="font-medium">Space:</span>
                    <p className="text-muted-foreground">{algorithm.spaceComplexity}</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <span
                    className={`text-xs px-2 py-1 rounded ${algorithm.stable ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
                  >
                    {algorithm.stable ? "Stable" : "Unstable"}
                  </span>
                  <span
                    className={`text-xs px-2 py-1 rounded ${algorithm.inPlace ? "bg-blue-100 text-blue-800" : "bg-orange-100 text-orange-800"}`}
                  >
                    {algorithm.inPlace ? "In-place" : "Not in-place"}
                  </span>
                </div>

                <Link href={algorithm.path} className="inline-block w-full">
                  <Button
                    variant="outline"
                    className="w-full group-hover:bg-primary group-hover:text-primary-foreground"
                  >
                    Visualize <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="bg-muted/50 rounded-lg p-6 space-y-4">
          <h2 className="text-2xl font-bold">Sorting Algorithm Comparison</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Algorithm</th>
                  <th className="text-left p-2">Best Case</th>
                  <th className="text-left p-2">Average Case</th>
                  <th className="text-left p-2">Worst Case</th>
                  <th className="text-left p-2">Space</th>
                  <th className="text-left p-2">Stable</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="p-2 font-medium">Bubble Sort</td>
                  <td className="p-2">O(n)</td>
                  <td className="p-2">O(n²)</td>
                  <td className="p-2">O(n²)</td>
                  <td className="p-2">O(1)</td>
                  <td className="p-2">✅</td>
                </tr>
                <tr className="border-b">
                  <td className="p-2 font-medium">Selection Sort</td>
                  <td className="p-2">O(n²)</td>
                  <td className="p-2">O(n²)</td>
                  <td className="p-2">O(n²)</td>
                  <td className="p-2">O(1)</td>
                  <td className="p-2">❌</td>
                </tr>
                <tr className="border-b">
                  <td className="p-2 font-medium">Insertion Sort</td>
                  <td className="p-2">O(n)</td>
                  <td className="p-2">O(n²)</td>
                  <td className="p-2">O(n²)</td>
                  <td className="p-2">O(1)</td>
                  <td className="p-2">✅</td>
                </tr>
                <tr className="border-b">
                  <td className="p-2 font-medium">Quick Sort</td>
                  <td className="p-2">O(n log n)</td>
                  <td className="p-2">O(n log n)</td>
                  <td className="p-2">O(n²)</td>
                  <td className="p-2">O(log n)</td>
                  <td className="p-2">❌</td>
                </tr>
                <tr className="border-b">
                  <td className="p-2 font-medium">Merge Sort</td>
                  <td className="p-2">O(n log n)</td>
                  <td className="p-2">O(n log n)</td>
                  <td className="p-2">O(n log n)</td>
                  <td className="p-2">O(n)</td>
                  <td className="p-2">✅</td>
                </tr>
                <tr>
                  <td className="p-2 font-medium">Heap Sort</td>
                  <td className="p-2">O(n log n)</td>
                  <td className="p-2">O(n log n)</td>
                  <td className="p-2">O(n log n)</td>
                  <td className="p-2">O(1)</td>
                  <td className="p-2">❌</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
