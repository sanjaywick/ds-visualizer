"use client"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { RotateCcw, Target } from "lucide-react"

interface Node {
  id: number
  x: number
  y: number
  distance: number
  previous: number | null
  state: "unvisited" | "in-queue" | "current" | "visited"
}

interface Edge {
  from: number
  to: number
  weight: number
}

interface DijkstraState {
  nodes: Node[]
  edges: Edge[]
  priorityQueue: number[]
  visited: Set<number>
  currentNode: number | null
  targetNode: number | null
  step: number
  shortestPath: number[]
}

const WEIGHTED_GRAPH = {
  nodes: [
    { id: 0, x: 100, y: 100, distance: Number.POSITIVE_INFINITY, previous: null, state: "unvisited" as const },
    { id: 1, x: 250, y: 50, distance: Number.POSITIVE_INFINITY, previous: null, state: "unvisited" as const },
    { id: 2, x: 400, y: 100, distance: Number.POSITIVE_INFINITY, previous: null, state: "unvisited" as const },
    { id: 3, x: 100, y: 250, distance: Number.POSITIVE_INFINITY, previous: null, state: "unvisited" as const },
    { id: 4, x: 250, y: 200, distance: Number.POSITIVE_INFINITY, previous: null, state: "unvisited" as const },
    { id: 5, x: 400, y: 250, distance: Number.POSITIVE_INFINITY, previous: null, state: "unvisited" as const },
  ],
  edges: [
    { from: 0, to: 1, weight: 4 },
    { from: 0, to: 3, weight: 2 },
    { from: 1, to: 2, weight: 3 },
    { from: 1, to: 4, weight: 1 },
    { from: 2, to: 5, weight: 2 },
    { from: 3, to: 4, weight: 3 },
    { from: 4, to: 5, weight: 5 },
    { from: 3, to: 1, weight: 6 },
  ],
}

export default function DijkstraVisualizer() {
  const [dijkstraState, setDijkstraState] = useState<DijkstraState>({
    nodes: WEIGHTED_GRAPH.nodes,
    edges: WEIGHTED_GRAPH.edges,
    priorityQueue: [],
    visited: new Set(),
    currentNode: null,
    targetNode: 5,
    step: 0,
    shortestPath: [],
  })
  const [isAnimating, setIsAnimating] = useState(false)
  const [speed, setSpeed] = useState(1200)
  const [startNode, setStartNode] = useState(0)
  const [explanation, setExplanation] = useState("Select start and target nodes, then click 'Find Shortest Path'")

  const resetVisualization = () => {
    setDijkstraState((prev) => ({
      ...prev,
      nodes: prev.nodes.map((node) => ({
        ...node,
        distance: Number.POSITIVE_INFINITY,
        previous: null,
        state: "unvisited",
      })),
      priorityQueue: [],
      visited: new Set(),
      currentNode: null,
      step: 0,
      shortestPath: [],
    }))
    setIsAnimating(false)
    setExplanation("Select start and target nodes, then click 'Find Shortest Path'")
  }

  const getNeighbors = (nodeId: number): { id: number; weight: number }[] => {
    return dijkstraState.edges
      .filter((edge) => edge.from === nodeId || edge.to === nodeId)
      .map((edge) => ({
        id: edge.from === nodeId ? edge.to : edge.from,
        weight: edge.weight,
      }))
  }

  const reconstructPath = (nodes: Node[], target: number): number[] => {
    const path: number[] = []
    let current: number | null = target

    while (current !== null) {
      path.unshift(current)
      current = nodes.find((n) => n.id === current)?.previous || null
    }

    return path
  }

  const startDijkstra = useCallback(async () => {
    if (isAnimating || dijkstraState.targetNode === null) return

    setIsAnimating(true)

    // Initialize
    const nodes = dijkstraState.nodes.map((node) => ({
      ...node,
      distance: node.id === startNode ? 0 : Number.POSITIVE_INFINITY,
      previous: null,
      state: "unvisited" as const,
    }))

    const priorityQueue = [startNode]
    const visited = new Set<number>()
    let step = 0

    setDijkstraState((prev) => ({
      ...prev,
      nodes,
      priorityQueue,
      visited,
      currentNode: null,
      step: 0,
      shortestPath: [],
    }))

    setExplanation(`Starting Dijkstra's algorithm from node ${startNode} to node ${dijkstraState.targetNode}`)
    await new Promise((resolve) => setTimeout(resolve, speed))

    while (priorityQueue.length > 0) {
      // Find node with minimum distance in priority queue
      let minIndex = 0
      for (let i = 1; i < priorityQueue.length; i++) {
        const currentDistance = nodes.find((n) => n.id === priorityQueue[i])?.distance || Number.POSITIVE_INFINITY
        const minDistance = nodes.find((n) => n.id === priorityQueue[minIndex])?.distance || Number.POSITIVE_INFINITY
        if (currentDistance < minDistance) {
          minIndex = i
        }
      }

      const currentNodeId = priorityQueue.splice(minIndex, 1)[0]

      if (visited.has(currentNodeId)) continue

      visited.add(currentNodeId)
      step++

      // Update current node
      const currentNode = nodes.find((n) => n.id === currentNodeId)!
      currentNode.state = "current"

      setDijkstraState((prev) => ({
        ...prev,
        nodes: [...nodes],
        priorityQueue: [...priorityQueue],
        visited: new Set(visited),
        currentNode: currentNodeId,
        step,
      }))

      setExplanation(
        `Visiting node ${currentNodeId} (distance: ${currentNode.distance === Number.POSITIVE_INFINITY ? "∞" : currentNode.distance})`,
      )
      await new Promise((resolve) => setTimeout(resolve, speed))

      // If we reached the target, we can stop
      if (currentNodeId === dijkstraState.targetNode) {
        const shortestPath = reconstructPath(nodes, dijkstraState.targetNode)
        setDijkstraState((prev) => ({
          ...prev,
          shortestPath,
        }))
        setExplanation(`🎉 Found shortest path to node ${dijkstraState.targetNode}! Distance: ${currentNode.distance}`)
        break
      }

      // Check all neighbors
      const neighbors = getNeighbors(currentNodeId)

      for (const neighbor of neighbors) {
        if (!visited.has(neighbor.id)) {
          const neighborNode = nodes.find((n) => n.id === neighbor.id)!
          const newDistance = currentNode.distance + neighbor.weight

          if (newDistance < neighborNode.distance) {
            neighborNode.distance = newDistance
            neighborNode.previous = currentNodeId

            if (!priorityQueue.includes(neighbor.id)) {
              priorityQueue.push(neighbor.id)
              neighborNode.state = "in-queue"
            }

            setDijkstraState((prev) => ({
              ...prev,
              nodes: [...nodes],
              priorityQueue: [...priorityQueue],
            }))

            setExplanation(`Updated distance to node ${neighbor.id}: ${newDistance} (via node ${currentNodeId})`)
            await new Promise((resolve) => setTimeout(resolve, speed / 2))
          }
        }
      }

      // Mark current node as visited
      currentNode.state = "visited"
      setDijkstraState((prev) => ({
        ...prev,
        nodes: [...nodes],
        currentNode: null,
      }))

      await new Promise((resolve) => setTimeout(resolve, speed / 2))
    }

    setIsAnimating(false)
  }, [dijkstraState.edges, dijkstraState.nodes, dijkstraState.targetNode, startNode, speed, isAnimating])

  const getNodeColor = (node: Node) => {
    if (dijkstraState.shortestPath.includes(node.id)) {
      return "fill-purple-300 stroke-purple-500"
    }
    switch (node.state) {
      case "unvisited":
        return "fill-gray-200 stroke-gray-400"
      case "in-queue":
        return "fill-yellow-200 stroke-yellow-400"
      case "current":
        return "fill-blue-300 stroke-blue-500"
      case "visited":
        return "fill-green-200 stroke-green-500"
      default:
        return "fill-gray-200 stroke-gray-400"
    }
  }

  const getNodeTextColor = (node: Node) => {
    if (dijkstraState.shortestPath.includes(node.id)) {
      return "fill-purple-800"
    }
    switch (node.state) {
      case "current":
        return "fill-blue-800"
      case "visited":
        return "fill-green-800"
      case "in-queue":
        return "fill-yellow-800"
      default:
        return "fill-gray-600"
    }
  }

  const getEdgeColor = (edge: Edge) => {
    const isInPath =
      dijkstraState.shortestPath.length > 1 &&
      dijkstraState.shortestPath.some((nodeId, index) => {
        if (index === dijkstraState.shortestPath.length - 1) return false
        const nextNodeId = dijkstraState.shortestPath[index + 1]
        return (edge.from === nodeId && edge.to === nextNodeId) || (edge.to === nodeId && edge.from === nextNodeId)
      })

    return isInPath ? "#8b5cf6" : "#94a3b8"
  }

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Dijkstra's Algorithm</h1>
        <p className="text-gray-600">Find the shortest path between nodes in a weighted graph</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Graph Visualization */}
        <Card>
          <CardHeader>
            <CardTitle>Weighted Graph</CardTitle>
            <CardDescription>Click nodes to set start/target, then find shortest path</CardDescription>
          </CardHeader>
          <CardContent>
            <svg width="500" height="350" className="border rounded-lg bg-white">
              {/* Edges */}
              {dijkstraState.edges.map((edge, index) => {
                const fromNode = dijkstraState.nodes.find((n) => n.id === edge.from)!
                const toNode = dijkstraState.nodes.find((n) => n.id === edge.to)!
                const midX = (fromNode.x + toNode.x) / 2
                const midY = (fromNode.y + toNode.y) / 2

                return (
                  <g key={index}>
                    <line
                      x1={fromNode.x}
                      y1={fromNode.y}
                      x2={toNode.x}
                      y2={toNode.y}
                      stroke={getEdgeColor(edge)}
                      strokeWidth={getEdgeColor(edge) === "#8b5cf6" ? "4" : "2"}
                    />
                    <circle cx={midX} cy={midY} r="12" fill="white" stroke="#94a3b8" strokeWidth="1" />
                    <text x={midX} y={midY + 4} textAnchor="middle" className="text-xs font-bold fill-gray-700">
                      {edge.weight}
                    </text>
                  </g>
                )
              })}

              {/* Nodes */}
              {dijkstraState.nodes.map((node) => (
                <g key={node.id}>
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r="25"
                    className={`${getNodeColor(node)} cursor-pointer transition-all duration-300`}
                    strokeWidth="3"
                    onClick={() => {
                      if (!isAnimating) {
                        if (node.id === startNode) {
                          setDijkstraState((prev) => ({ ...prev, targetNode: node.id }))
                        } else {
                          setStartNode(node.id)
                        }
                      }
                    }}
                  />

                  {/* Node ID */}
                  <text
                    x={node.x}
                    y={node.y + 5}
                    textAnchor="middle"
                    className={`text-sm font-bold ${getNodeTextColor(node)}`}
                  >
                    {node.id}
                  </text>

                  {/* Distance */}
                  <text x={node.x} y={node.y - 35} textAnchor="middle" className="text-xs fill-gray-600 font-medium">
                    {node.distance === Number.POSITIVE_INFINITY ? "∞" : node.distance}
                  </text>

                  {/* Start/Target indicators */}
                  {node.id === startNode && (
                    <text x={node.x - 35} y={node.y + 5} className="text-xs fill-blue-600 font-bold">
                      START
                    </text>
                  )}
                  {node.id === dijkstraState.targetNode && (
                    <text x={node.x + 30} y={node.y + 5} className="text-xs fill-red-600 font-bold">
                      TARGET
                    </text>
                  )}
                </g>
              ))}
            </svg>

            <div className="mt-4 flex flex-wrap gap-2">
              <Button
                onClick={startDijkstra}
                disabled={isAnimating || dijkstraState.targetNode === null}
                className="flex items-center gap-2"
              >
                <Target className="w-4 h-4" />
                Find Shortest Path
              </Button>

              <Button onClick={resetVisualization} variant="outline" className="flex items-center gap-2">
                <RotateCcw className="w-4 h-4" />
                Reset
              </Button>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Start Node: </label>
                <select
                  value={startNode}
                  onChange={(e) => setStartNode(Number(e.target.value))}
                  disabled={isAnimating}
                  className="ml-2 px-2 py-1 border rounded"
                >
                  {dijkstraState.nodes.map((node) => (
                    <option key={node.id} value={node.id}>
                      Node {node.id}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium">Target Node: </label>
                <select
                  value={dijkstraState.targetNode || ""}
                  onChange={(e) =>
                    setDijkstraState((prev) => ({
                      ...prev,
                      targetNode: Number(e.target.value),
                    }))
                  }
                  disabled={isAnimating}
                  className="ml-2 px-2 py-1 border rounded"
                >
                  {dijkstraState.nodes.map((node) => (
                    <option key={node.id} value={node.id}>
                      Node {node.id}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-4 flex items-center gap-4">
              <label className="text-sm font-medium">Speed:</label>
              <input
                type="range"
                min="300"
                max="2000"
                step="300"
                value={speed}
                onChange={(e) => setSpeed(Number(e.target.value))}
                className="w-32"
                disabled={isAnimating}
              />
              <span className="text-sm text-gray-600">{speed}ms</span>
            </div>
          </CardContent>
        </Card>

        {/* Algorithm State */}
        <Card>
          <CardHeader>
            <CardTitle>Algorithm State</CardTitle>
            <CardDescription>Real-time Dijkstra's progress</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-blue-600">{dijkstraState.step}</div>
                <div className="text-sm text-gray-600">Steps</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">{dijkstraState.visited.size}</div>
                <div className="text-sm text-gray-600">Visited</div>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-2">Priority Queue:</h4>
              <div className="min-h-[40px] p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                {dijkstraState.priorityQueue.length > 0 ? (
                  <div className="flex gap-2 flex-wrap">
                    {dijkstraState.priorityQueue.map((nodeId, index) => {
                      const distance = dijkstraState.nodes.find((n) => n.id === nodeId)?.distance
                      return (
                        <Badge key={index} variant="secondary" className="bg-yellow-200">
                          {nodeId} ({distance === Number.POSITIVE_INFINITY ? "∞" : distance})
                        </Badge>
                      )
                    })}
                  </div>
                ) : (
                  <span className="text-gray-500 text-sm">Priority queue is empty</span>
                )}
              </div>
            </div>

            {dijkstraState.shortestPath.length > 0 && (
              <div>
                <h4 className="font-medium mb-2">Shortest Path:</h4>
                <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
                  <div className="flex gap-2 flex-wrap items-center">
                    {dijkstraState.shortestPath.map((nodeId, index) => (
                      <div key={index} className="flex items-center gap-1">
                        <Badge variant="default" className="bg-purple-200 text-purple-800">
                          {nodeId}
                        </Badge>
                        {index < dijkstraState.shortestPath.length - 1 && <span className="text-purple-600">→</span>}
                      </div>
                    ))}
                  </div>
                  <div className="mt-2 text-sm text-purple-700">
                    Total Distance: {dijkstraState.nodes.find((n) => n.id === dijkstraState.targetNode)?.distance}
                  </div>
                </div>
              </div>
            )}

            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium mb-2">Current Status:</h4>
              <p className="text-sm text-gray-700">{explanation}</p>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">Legend:</h4>
              <div className="grid grid-cols-1 gap-2 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-gray-200 border border-gray-400 rounded-full"></div>
                  <span>Unvisited</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-yellow-200 border border-yellow-400 rounded-full"></div>
                  <span>In Priority Queue</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-blue-300 border border-blue-500 rounded-full"></div>
                  <span>Current</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-200 border border-green-500 rounded-full"></div>
                  <span>Visited</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-purple-300 border border-purple-500 rounded-full"></div>
                  <span>Shortest Path</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Algorithm Explanation */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>How Dijkstra's Algorithm Works</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-2">Algorithm Steps:</h4>
              <ol className="list-decimal list-inside space-y-1 text-sm text-gray-700">
                <li>Set distance to start node as 0, others as infinity</li>
                <li>Add start node to priority queue</li>
                <li>While priority queue is not empty:</li>
                <li className="ml-4">• Extract node with minimum distance</li>
                <li className="ml-4">• Mark it as visited</li>
                <li className="ml-4">• Update distances to all neighbors</li>
                <li className="ml-4">• Add unvisited neighbors to queue</li>
                <li>Repeat until target is reached or queue is empty</li>
              </ol>
            </div>
            <div>
              <h4 className="font-medium mb-2">Complexity Analysis:</h4>
              <div className="space-y-2 text-sm">
                <div>
                  <strong>Time Complexity:</strong> O((V + E) log V)
                </div>
                <div>
                  <strong>Space Complexity:</strong> O(V)
                </div>
                <div>
                  <strong>V:</strong> Number of vertices
                </div>
                <div>
                  <strong>E:</strong> Number of edges
                </div>
                <div>
                  <strong>Applications:</strong> GPS navigation, network routing
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
