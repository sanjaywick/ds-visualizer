"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Search, Play, Pause, RotateCcw, SkipForward } from "lucide-react"

interface Node {
  id: number
  x: number
  y: number
  visited: boolean
  inStack: boolean
}

interface Edge {
  from: number
  to: number
}

interface DFSStep {
  currentNode: number
  stack: number[]
  visited: number[]
  action: "visit" | "explore" | "backtrack" | "complete"
  message: string
}

export default function DFSVisualization() {
  const [nodes, setNodes] = useState<Node[]>([])
  const [edges, setEdges] = useState<Edge[]>([])
  const [adjacencyList, setAdjacencyList] = useState<Map<number, number[]>>(new Map())
  const [steps, setSteps] = useState<DFSStep[]>([])
  const [currentStep, setCurrentStep] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [animationSpeed, setAnimationSpeed] = useState(1000)
  const [startNode, setStartNode] = useState(0)
  const [graphType, setGraphType] = useState<"simple" | "complex">("simple")

  const createSimpleGraph = () => {
    const simpleNodes: Node[] = [
      { id: 0, x: 200, y: 100, visited: false, inStack: false },
      { id: 1, x: 100, y: 200, visited: false, inStack: false },
      { id: 2, x: 300, y: 200, visited: false, inStack: false },
      { id: 3, x: 50, y: 300, visited: false, inStack: false },
      { id: 4, x: 150, y: 300, visited: false, inStack: false },
      { id: 5, x: 250, y: 300, visited: false, inStack: false },
      { id: 6, x: 350, y: 300, visited: false, inStack: false },
    ]

    const simpleEdges: Edge[] = [
      { from: 0, to: 1 },
      { from: 0, to: 2 },
      { from: 1, to: 3 },
      { from: 1, to: 4 },
      { from: 2, to: 5 },
      { from: 2, to: 6 },
      { from: 3, to: 4 },
      { from: 5, to: 6 },
    ]

    return { nodes: simpleNodes, edges: simpleEdges }
  }

  const createComplexGraph = () => {
    const complexNodes: Node[] = [
      { id: 0, x: 200, y: 50, visited: false, inStack: false },
      { id: 1, x: 100, y: 150, visited: false, inStack: false },
      { id: 2, x: 300, y: 150, visited: false, inStack: false },
      { id: 3, x: 50, y: 250, visited: false, inStack: false },
      { id: 4, x: 150, y: 250, visited: false, inStack: false },
      { id: 5, x: 250, y: 250, visited: false, inStack: false },
      { id: 6, x: 350, y: 250, visited: false, inStack: false },
      { id: 7, x: 200, y: 350, visited: false, inStack: false },
    ]

    const complexEdges: Edge[] = [
      { from: 0, to: 1 },
      { from: 0, to: 2 },
      { from: 1, to: 3 },
      { from: 1, to: 4 },
      { from: 2, to: 5 },
      { from: 2, to: 6 },
      { from: 3, to: 7 },
      { from: 4, to: 5 },
      { from: 4, to: 7 },
      { from: 5, to: 6 },
      { from: 6, to: 7 },
    ]

    return { nodes: complexNodes, edges: complexEdges }
  }

  const buildAdjacencyList = (nodeList: Node[], edgeList: Edge[]) => {
    const adjList = new Map<number, number[]>()

    // Initialize empty arrays for all nodes
    nodeList.forEach((node) => {
      adjList.set(node.id, [])
    })

    // Add edges (undirected graph)
    edgeList.forEach((edge) => {
      adjList.get(edge.from)?.push(edge.to)
      adjList.get(edge.to)?.push(edge.from)
    })

    // Sort adjacency lists for consistent traversal
    adjList.forEach((neighbors, node) => {
      neighbors.sort((a, b) => a - b)
    })

    return adjList
  }

  const performDFS = (startNodeId: number, adjList: Map<number, number[]>): DFSStep[] => {
    const dfsSteps: DFSStep[] = []
    const visited = new Set<number>()
    const stack: number[] = [startNodeId]

    dfsSteps.push({
      currentNode: startNodeId,
      stack: [...stack],
      visited: [],
      action: "visit",
      message: `Starting DFS from node ${startNodeId}. Push ${startNodeId} to stack.`,
    })

    while (stack.length > 0) {
      const currentNode = stack.pop()!

      if (!visited.has(currentNode)) {
        visited.add(currentNode)

        dfsSteps.push({
          currentNode,
          stack: [...stack],
          visited: Array.from(visited),
          action: "visit",
          message: `Visiting node ${currentNode}. Mark as visited.`,
        })

        const neighbors = adjList.get(currentNode) || []
        const unvisitedNeighbors = neighbors.filter((neighbor) => !visited.has(neighbor))

        // Add unvisited neighbors to stack (in reverse order for correct traversal)
        for (let i = unvisitedNeighbors.length - 1; i >= 0; i--) {
          const neighbor = unvisitedNeighbors[i]
          if (!stack.includes(neighbor)) {
            stack.push(neighbor)
          }
        }

        if (unvisitedNeighbors.length > 0) {
          dfsSteps.push({
            currentNode,
            stack: [...stack],
            visited: Array.from(visited),
            action: "explore",
            message: `Exploring neighbors of ${currentNode}: [${unvisitedNeighbors.join(", ")}]. Added to stack.`,
          })
        } else {
          dfsSteps.push({
            currentNode,
            stack: [...stack],
            visited: Array.from(visited),
            action: "backtrack",
            message: `No unvisited neighbors for node ${currentNode}. Backtracking.`,
          })
        }
      }
    }

    dfsSteps.push({
      currentNode: -1,
      stack: [],
      visited: Array.from(visited),
      action: "complete",
      message: `DFS traversal complete! Visited ${visited.size} nodes.`,
    })

    return dfsSteps
  }

  const initializeGraph = (type: "simple" | "complex") => {
    const { nodes: newNodes, edges: newEdges } = type === "simple" ? createSimpleGraph() : createComplexGraph()
    setNodes(newNodes)
    setEdges(newEdges)
    setAdjacencyList(buildAdjacencyList(newNodes, newEdges))
    setSteps([])
    setCurrentStep(0)
    setStartNode(0)
  }

  const startDFS = () => {
    const dfsSteps = performDFS(startNode, adjacencyList)
    setSteps(dfsSteps)
    setCurrentStep(0)
    setIsAnimating(true)
  }

  const pauseAnimation = () => {
    setIsAnimating(false)
  }

  const resetAnimation = () => {
    setIsAnimating(false)
    setCurrentStep(0)
    setNodes((prev) => prev.map((node) => ({ ...node, visited: false, inStack: false })))
  }

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1)
    }
  }

  useEffect(() => {
    initializeGraph(graphType)
  }, [graphType])

  useEffect(() => {
    if (isAnimating && currentStep < steps.length - 1) {
      const timer = setTimeout(() => {
        setCurrentStep((prev) => prev + 1)
      }, animationSpeed)
      return () => clearTimeout(timer)
    } else if (currentStep >= steps.length - 1) {
      setIsAnimating(false)
    }
  }, [isAnimating, currentStep, steps.length, animationSpeed])

  useEffect(() => {
    if (steps.length > 0 && currentStep < steps.length) {
      const step = steps[currentStep]
      setNodes((prev) =>
        prev.map((node) => ({
          ...node,
          visited: step.visited.includes(node.id),
          inStack: step.stack.includes(node.id),
        })),
      )
    }
  }, [currentStep, steps])

  const getNodeColor = (node: Node, currentNodeId: number) => {
    if (node.id === currentNodeId && currentNodeId !== -1) {
      return "fill-red-500 stroke-red-700" // Current node
    }
    if (node.visited) {
      return "fill-green-500 stroke-green-700" // Visited
    }
    if (node.inStack) {
      return "fill-yellow-400 stroke-yellow-600" // In stack
    }
    return "fill-blue-400 stroke-blue-600" // Unvisited
  }

  const currentNodeId = steps.length > 0 && currentStep < steps.length ? steps[currentStep].currentNode : -1
  const currentStack = steps.length > 0 && currentStep < steps.length ? steps[currentStep].stack : []
  const visitedNodes = steps.length > 0 && currentStep < steps.length ? steps[currentStep].visited : []

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Search className="h-8 w-8 text-indigo-600" />
            <h1 className="text-4xl font-bold tracking-tight">Depth-First Search (DFS)</h1>
          </div>
          <p className="text-xl text-muted-foreground">
            Explore graph by going as deep as possible before backtracking
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Graph Type</Label>
                    <select
                      value={graphType}
                      onChange={(e) => setGraphType(e.target.value as "simple" | "complex")}
                      className="w-full p-2 border rounded"
                    >
                      <option value="simple">Simple Graph</option>
                      <option value="complex">Complex Graph</option>
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="start-node">Start Node</Label>
                    <Input
                      id="start-node"
                      type="number"
                      min="0"
                      max={nodes.length - 1}
                      value={startNode}
                      onChange={(e) =>
                        setStartNode(Math.max(0, Math.min(nodes.length - 1, Number.parseInt(e.target.value) || 0)))
                      }
                    />
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button onClick={startDFS} disabled={isAnimating} className="flex items-center gap-2">
                    <Play className="h-4 w-4" />
                    Start DFS
                  </Button>
                  <Button onClick={pauseAnimation} disabled={!isAnimating} variant="outline">
                    <Pause className="h-4 w-4" />
                  </Button>
                  <Button onClick={resetAnimation} variant="outline">
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                  <Button
                    onClick={nextStep}
                    disabled={isAnimating || currentStep >= steps.length - 1}
                    variant="outline"
                  >
                    <SkipForward className="h-4 w-4" />
                  </Button>
                </div>

                <div>
                  <Label>Animation Speed: {animationSpeed}ms</Label>
                  <input
                    type="range"
                    min="500"
                    max="3000"
                    step="250"
                    value={animationSpeed}
                    onChange={(e) => setAnimationSpeed(Number(e.target.value))}
                    className="w-full"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Graph Visualization</CardTitle>
                <CardDescription>
                  {steps.length > 0 ? `Step ${currentStep + 1} of ${steps.length}` : "Click Start DFS to begin"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-muted p-4 rounded-lg mb-4 min-h-[60px]">
                  <p className="text-sm">
                    {steps.length > 0 && currentStep < steps.length
                      ? steps[currentStep].message
                      : "DFS uses a stack (LIFO) to explore as deep as possible before backtracking"}
                  </p>
                </div>

                <div className="flex justify-center">
                  <svg width="400" height="400" className="border rounded-lg bg-white">
                    {/* Draw edges */}
                    {edges.map((edge, index) => {
                      const fromNode = nodes.find((n) => n.id === edge.from)
                      const toNode = nodes.find((n) => n.id === edge.to)
                      if (!fromNode || !toNode) return null

                      return (
                        <line
                          key={index}
                          x1={fromNode.x}
                          y1={fromNode.y}
                          x2={toNode.x}
                          y2={toNode.y}
                          stroke="#666"
                          strokeWidth="2"
                        />
                      )
                    })}

                    {/* Draw nodes */}
                    {nodes.map((node) => (
                      <g key={node.id}>
                        <circle
                          cx={node.x}
                          cy={node.y}
                          r="20"
                          className={`transition-all duration-500 ${getNodeColor(node, currentNodeId)}`}
                          strokeWidth="3"
                        />
                        <text x={node.x} y={node.y + 5} textAnchor="middle" className="text-sm font-bold fill-white">
                          {node.id}
                        </text>
                      </g>
                    ))}
                  </svg>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>DFS State</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span>Current Node:</span>
                  <span>{currentNodeId !== -1 ? currentNodeId : "None"}</span>
                </div>
                <div className="flex justify-between">
                  <span>Visited Count:</span>
                  <span>{visitedNodes.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Stack Size:</span>
                  <span>{currentStack.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Step:</span>
                  <span>
                    {currentStep + 1} / {steps.length}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Stack Contents</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-1">
                  {currentStack.length === 0 ? (
                    <div className="text-muted-foreground text-sm">Stack is empty</div>
                  ) : (
                    currentStack
                      .slice()
                      .reverse()
                      .map((nodeId, index) => (
                        <div key={index} className="p-2 bg-yellow-100 rounded text-center font-mono">
                          {nodeId} {index === 0 ? "← top" : ""}
                        </div>
                      ))
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Visited Nodes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-1">
                  {visitedNodes.length === 0 ? (
                    <div className="text-muted-foreground text-sm">No nodes visited yet</div>
                  ) : (
                    visitedNodes.map((nodeId) => (
                      <div key={nodeId} className="px-2 py-1 bg-green-100 text-green-800 rounded text-sm font-mono">
                        {nodeId}
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Legend</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                  <span>Current Node</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                  <span>Visited</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-yellow-400 rounded-full"></div>
                  <span>In Stack</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-blue-400 rounded-full"></div>
                  <span>Unvisited</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Algorithm Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <p>
                  <strong>Time Complexity:</strong> O(V + E)
                </p>
                <p>
                  <strong>Space Complexity:</strong> O(V)
                </p>
                <p>
                  <strong>Data Structure:</strong> Stack (LIFO)
                </p>
                <p className="text-muted-foreground">
                  DFS explores as far as possible along each branch before backtracking.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
