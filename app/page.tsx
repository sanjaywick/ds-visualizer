import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { ArrowRight, BarChart2, GitBranch, ListTree, ListOrdered, ArrowUpDown, Lightbulb } from "lucide-react"

export default function Home() {
  return (
    <div className="container mx-auto py-10 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Struct Assist</h1>
          <p className="text-xl text-muted-foreground">
            Learn and visualize common data structures and algorithms with interactive animations
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <Card className="group hover:shadow-md transition-all">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <BarChart2 className="h-5 w-5" />
                Stack
              </CardTitle>
              <CardDescription>Last-In-First-Out (LIFO) data structure</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Visualize push and pop operations with animations showing the LIFO principle in action.
              </p>
              <Link href="/stack" className="inline-block">
                <Button variant="outline" className="group-hover:bg-primary group-hover:text-primary-foreground">
                  Explore <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-md transition-all">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <ListOrdered className="h-5 w-5" />
                Queue
              </CardTitle>
              <CardDescription>First-In-First-Out (FIFO) data structure</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Visualize enqueue and dequeue operations with animations showing the FIFO principle.
              </p>
              <Link href="/queue" className="inline-block">
                <Button variant="outline" className="group-hover:bg-primary group-hover:text-primary-foreground">
                  Explore <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-md transition-all">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <GitBranch className="h-5 w-5" />
                Linked List
              </CardTitle>
              <CardDescription>Linear collection of elements</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Visualize insertions and deletions with animations showing node connections.
              </p>
              <Link href="/linked-list" className="inline-block">
                <Button variant="outline" className="group-hover:bg-primary group-hover:text-primary-foreground">
                  Explore <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-md transition-all">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <ListTree className="h-5 w-5" />
                Binary Tree
              </CardTitle>
              <CardDescription>Hierarchical data structure</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Visualize tree operations and traversals with animations showing the hierarchical structure.
              </p>
              <Link href="/binary-tree" className="inline-block">
                <Button variant="outline" className="group-hover:bg-primary group-hover:text-primary-foreground">
                  Explore <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-md transition-all">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <ArrowUpDown className="h-5 w-5" />
                Sorting Algorithms
              </CardTitle>
              <CardDescription>Various sorting techniques</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Visualize different sorting algorithms with step-by-step animations and comparisons.
              </p>
              <Link href="/sorting" className="inline-block">
                <Button variant="outline" className="group-hover:bg-primary group-hover:text-primary-foreground">
                  Explore <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-md transition-all">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5" />
                Design Techniques
              </CardTitle>
              <CardDescription>Classic algorithmic problem-solving patterns</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Learn fundamental design techniques through classic problems with step-by-step visualizations.
              </p>
              <Link href="/design-techniques" className="inline-block">
                <Button variant="outline" className="group-hover:bg-primary group-hover:text-primary-foreground">
                  Explore <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
