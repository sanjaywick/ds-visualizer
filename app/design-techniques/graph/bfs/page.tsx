"use client"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Play, RotateCcw } from "lucide-react"

interface Node {
  id: number
  x: number
  y: number
  state: "unvisited" | "in-queue" | "current" | "visited"
  distance: number
}

interface Edge {
  from: number
  to: number
}

interface BFSState {
  nodes: Node[]
  edges: Edge[]
  queue: number[]
  visited: Set<number>
  currentNode: number | null
  step: number
  traversalOrder: number[]
}

const GRAPH_PRESETS = {
  simple: {
    nodes: [
      { id: 0, x: 200, y: 100, state: "unvisited" as const, distance: -1 },
      { id: 1, x: 100, y: 200, state: "unvisited" as const, distance: -1 },
      { id: 2, x: 300, y: 200, state: "unvisited" as const, distance: -1 },
      { id: 3, x: 150, y: 300, state: "unvisited" as const, distance: -1 },
      { id: 4, x: 250, y: 300, state: "unvisited" as const, distance: -1 },
    ],
    edges: [
      { from: 0, to: 1 },
      { from: 0, to: 2 },
      { from: 1, to: 3 },
      { from: 2, to: 4 },
      { from: 3, to: 4 },
    ],
  },
  tree: {
    nodes: [
      { id: 0, x: 200, y: 50, state: "unvisited" as const, distance: -1 },
      { id: 1, x: 100, y: 150, state: "unvisited" as const, distance: -1 },
      { id: 2, x: 300, y: 150, state: "unvisited" as const, distance: -1 },
      { id: 3, x: 50, y: 250, state: "unvisited" as const, distance: -1 },
      { id: 4, x: 150, y: 250, state: "unvisited" as const, distance: -1 },
      { id: 5, x: 250, y: 250, state: "unvisited" as const, distance: -1 },
      { id: 6, x: 350, y: 250, state: "unvisited" as const, distance: -1 },
    ],
    edges: [
      { from: 0, to: 1 },
      { from: 0, to: 2 },
      { from: 1, to: 3 },
      { from: 1, to: 4 },
      { from: 2, to: 5 },
      { from: 2, to: 6 },
    ],
  },
}

export default function BFSVisualizer() {
  const [bfsState, setBfsState] = useState<BFSState>({
    nodes: GRAPH_PRESETS.simple.nodes,
    edges: GRAPH_PRESETS.simple.edges,
    queue: [],
    visited: new Set(),
    currentNode: null,
    step: 0,
    traversalOrder: [],
  })
  const [isAnimating, setIsAnimating] = useState(false)
  const [speed, setSpeed] = useState(1000)
  const [startNode, setStartNode] = useState(0)
  const [explanation, setExplanation] = useState("Select a starting node and click 'Start BFS' to begin")

  const resetVisualization = () => {
    setBfsState((prev) => ({
      ...prev,
      nodes: prev.nodes.map((node) => ({ ...node, state: "unvisited", distance: -1 })),
      queue: [],
      visited: new Set(),
      currentNode: null,
      step: 0,
      traversalOrder: [],
    }))
    setIsAnimating(false)
    setExplanation("Select a starting node and click 'Start BFS' to begin")
  }

  const loadPreset = (preset: keyof typeof GRAPH_PRESETS) => {
    setBfsState((prev) => ({
      ...prev,
      nodes: GRAPH_PRESETS[preset].nodes,
      edges: GRAPH_PRESETS[preset].edges,
      queue: [],
      visited: new Set(),
      currentNode: null,
      step: 0,
      traversalOrder: [],
    }))
    setStartNode(0)
    resetVisualization()
  }

  const getNeighbors = (nodeId: number): number[] => {
    return bfsState.edges
      .filter((edge) => edge.from === nodeId || edge.to === nodeId)
      .map((edge) => (edge.from === nodeId ? edge.to : edge.from))
  }

  const startBFS = useCallback(async () => {
    if (isAnimating) return

    setIsAnimating(true)

    const queue: number[] = [startNode]
    const visited = new Set<number>()
    const traversalOrder: number[] = []
    let step = 0

    // Initialize start node
    setBfsState((prev) => ({
      ...prev,
      nodes: prev.nodes.map((node) =>
        node.id === startNode
          ? { ...node, state: "in-queue", distance: 0 }
          : { ...node, state: "unvisited", distance: -1 },
      ),
      queue: [startNode],
      visited: new Set(),
      currentNode: null,
      step: 0,
      traversalOrder: [],
    }))

    setExplanation(`Starting BFS from node ${startNode}. Added to queue.`)
    await new Promise((resolve) => setTimeout(resolve, speed))

    while (queue.length > 0) {
      const currentNodeId = queue.shift()!
      visited.add(currentNodeId)
      traversalOrder.push(currentNodeId)
      step++

      // Update current node
      setBfsState((prev) => ({
        ...prev,
        nodes: prev.nodes.map((node) => (node.id === currentNodeId ? { ...node, state: "current" } : node)),
        queue: [...queue],
        visited: new Set(visited),
        currentNode: currentNodeId,
        step,
        traversalOrder: [...traversalOrder],
      }))

      setExplanation(`Visiting node ${currentNodeId}. Checking its neighbors...`)
      await new Promise((resolve) => setTimeout(resolve, speed))

      // Get neighbors
      const neighbors = getNeighbors(currentNodeId)
      const currentDistance = bfsState.nodes.find((n) => n.id === currentNodeId)?.distance || 0

      for (const neighborId of neighbors) {
        if (!visited.has(neighborId) && !queue.includes(neighborId)) {
          queue.push(neighborId)

          setBfsState((prev) => ({
            ...prev,
            nodes: prev.nodes.map((node) =>
              node.id === neighborId ? { ...node, state: "in-queue", distance: currentDistance + 1 } : node,
            ),
            queue: [...queue],
          }))

          setExplanation(`Added neighbor ${neighborId} to queue (distance: ${currentDistance + 1})`)
          await new Promise((resolve) => setTimeout(resolve, speed / 2))
        }
      }

      // Mark current node as visited
      setBfsState((prev) => ({
        ...prev,
        nodes: prev.nodes.map((node) => (node.id === currentNodeId ? { ...node, state: "visited" } : node)),
        currentNode: null,
      }))

      if (queue.length > 0) {
        setExplanation(`Node ${currentNodeId} fully explored. Next in queue: ${queue[0]}`)
      } else {
        setExplanation(`BFS complete! Visited ${traversalOrder.length} nodes.`)
      }
      await new Promise((resolve) => setTimeout(resolve, speed / 2))
    }

    setIsAnimating(false)
  }, [bfsState.edges, bfsState.nodes, startNode, speed, isAnimating])

  const getNodeColor = (node: Node) => {
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

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Breadth-First Search (BFS)</h1>
        <p className="text-gray-600">Watch BFS explore the graph level by level using a queue</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Graph Visualization */}
        <Card>
          <CardHeader>
            <CardTitle>Graph Visualization</CardTitle>
            <CardDescription>Interactive graph showing BFS traversal</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4 flex flex-wrap gap-2">
              <Button onClick={() => loadPreset("simple")} variant="outline" size="sm">
                Simple Graph
              </Button>
              <Button onClick={() => loadPreset("tree")} variant="outline" size="sm">
                Tree Graph
              </Button>
            </div>

            <svg width="400" height="350" className="border rounded-lg bg-white">
              {/* Edges */}
              {bfsState.edges.map((edge, index) => {
                const fromNode = bfsState.nodes.find((n) => n.id === edge.from)!
                const toNode = bfsState.nodes.find((n) => n.id === edge.to)!
                return (
                  <line
                    key={index}
                    x1={fromNode.x}
                    y1={fromNode.y}
                    x2={toNode.x}
                    y2={toNode.y}
                    stroke="#94a3b8"
                    strokeWidth="2"
                  />
                )
              })}

              {/* Nodes */}
              {bfsState.nodes.map((node) => (
                <g key={node.id}>
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r="20"
                    className={`${getNodeColor(node)} cursor-pointer transition-all duration-300`}
                    strokeWidth="2"
                    onClick={() => !isAnimating && setStartNode(node.id)}
                  />
                  <text
                    x={node.x}
                    y={node.y + 5}
                    textAnchor="middle"
                    className={`text-sm font-bold ${getNodeTextColor(node)}`}
                  >
                    {node.id}
                  </text>
                  {node.distance >= 0 && (
                    <text x={node.x} y={node.y - 30} textAnchor="middle" className="text-xs fill-gray-600">
                      d:{node.distance}
                    </text>
                  )}
                </g>
              ))}
            </svg>

            <div className="mt-4 flex flex-wrap gap-2">
              <Button onClick={startBFS} disabled={isAnimating} className="flex items-center gap-2">
                <Play className="w-4 h-4" />
                Start BFS
              </Button>

              <Button onClick={resetVisualization} variant="outline" className="flex items-center gap-2">
                <RotateCcw className="w-4 h-4" />
                Reset
              </Button>
            </div>

            <div className="mt-4">
              <label className="text-sm font-medium">Start Node: </label>
              <select
                value={startNode}
                onChange={(e) => setStartNode(Number(e.target.value))}
                disabled={isAnimating}
                className="ml-2 px-2 py-1 border rounded"
              >
                {bfsState.nodes.map((node) => (
                  <option key={node.id} value={node.id}>
                    Node {node.id}
                  </option>
                ))}
              </select>
            </div>

            <div className="mt-4 flex items-center gap-4">
              <label className="text-sm font-medium">Speed:</label>
              <input
                type="range"
                min="200"
                max="2000"
                step="200"
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
            <CardDescription>Real-time BFS progress</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-blue-600">{bfsState.step}</div>
                <div className="text-sm text-gray-600">Steps</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">{bfsState.visited.size}</div>
                <div className="text-sm text-gray-600">Visited</div>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-2">Queue:</h4>
              <div className="min-h-[40px] p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                {bfsState.queue.length > 0 ? (
                  <div className="flex gap-2">
                    {bfsState.queue.map((nodeId, index) => (
                      <Badge key={index} variant="secondary" className="bg-yellow-200">
                        {nodeId}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <span className="text-gray-500 text-sm">Queue is empty</span>
                )}
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-2">Traversal Order:</h4>
              <div className="min-h-[40px] p-3 bg-green-50 border border-green-200 rounded-lg">
                {bfsState.traversalOrder.length > 0 ? (
                  <div className="flex gap-2 flex-wrap">
                    {bfsState.traversalOrder.map((nodeId, index) => (
                      <Badge key={index} variant="default" className="bg-green-200 text-green-800">
                        {nodeId}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <span className="text-gray-500 text-sm">No nodes visited yet</span>
                )}
              </div>
            </div>

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
                  <span>In Queue</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-blue-300 border border-blue-500 rounded-full"></div>
                  <span>Current</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-200 border border-green-500 rounded-full"></div>
                  <span>Visited</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Algorithm Explanation */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>How Breadth-First Search Works</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-2">Algorithm Steps:</h4>
              <ol className="list-decimal list-inside space-y-1 text-sm text-gray-700">
                <li>Start with the initial node in the queue</li>
                <li>While queue is not empty:</li>
                <li className="ml-4">• Dequeue the front node</li>
                <li className="ml-4">• Mark it as visited</li>
                <li className="ml-4">• Add all unvisited neighbors to queue</li>
                <li className="ml-4">• Set their distance from start</li>
                <li>Repeat until queue is empty</li>
              </ol>
            </div>
            <div>
              <h4 className="font-medium mb-2">Complexity Analysis:</h4>
              <div className="space-y-2 text-sm">
                <div>
                  <strong>Time Complexity:</strong> O(V + E)
                </div>
                <div>
                  <strong>Space Complexity:</strong> O(V) for queue
                </div>
                <div>
                  <strong>V:</strong> Number of vertices
                </div>
                <div>
                  <strong>E:</strong> Number of edges
                </div>
                <div>
                  <strong>Applications:</strong> Shortest path, level-order traversal
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
