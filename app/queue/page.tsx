"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

export default function QueuePage() {
  return (
    <div className="container mx-auto py-10 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold">Queue Visualizers</h1>
          <p className="text-muted-foreground">Explore different types of queue data structures</p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <Card className="group hover:shadow-md transition-all">
            <CardHeader className="pb-3">
              <CardTitle>Simple Queue</CardTitle>
              <CardDescription>First-In-First-Out (FIFO) data structure</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Visualize enqueue and dequeue operations with animations showing the FIFO principle.
              </p>
              <Link href="/queue/simple" className="inline-block">
                <Button variant="outline" className="group-hover:bg-primary group-hover:text-primary-foreground">
                  Explore <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-md transition-all">
            <CardHeader className="pb-3">
              <CardTitle>Circular Queue</CardTitle>
              <CardDescription>Fixed-size queue with wrap-around</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Visualize circular queue operations with efficient space utilization.
              </p>
              <Link href="/queue/circular" className="inline-block">
                <Button variant="outline" className="group-hover:bg-primary group-hover:text-primary-foreground">
                  Explore <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-md transition-all">
            <CardHeader className="pb-3">
              <CardTitle>Priority Queue</CardTitle>
              <CardDescription>Elements with higher priority are served first</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Visualize priority queue operations where elements are dequeued based on priority.
              </p>
              <Link href="/queue/priority" className="inline-block">
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
