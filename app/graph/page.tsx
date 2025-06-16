"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Info, Plus } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { motion } from "framer-motion"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

interface GraphNode {
  id: string
  label: string
  x: number
  y: number
}

interface GraphEdge {
  id: string
  source: string
  target: string
  weight?: number
}

export default function GraphVisualizer() {
  const [nodes, setNodes] = useState<GraphNode[]>([])
  const [edges, setEdges] = useState<GraphEdge[]>([])
  const [nodeInput, setNodeInput] = useState("")
  const [sourceNode, setSourceNode] = useState("")
  const [targetNode, setTargetNode] = useState("")
  const [error, setError] = useState("")
  const [graphType, setGraphType] = useState("undirected")

  const handleAddNode = () => {
    if (!nodeInput.trim()) {
      setError("Please enter a node label")
      return
    }

    // Check if node already exists
    if (nodes.some((node) => node.label === nodeInput)) {
      setError("Node with this label already exists")
      return
    }

    // Generate random position within the visualization area
    const newNode: GraphNode = {
      id: `node-${Date.now()}`,
      label: nodeInput,
      x: 150 + Math.random() * 300,
      y: 100 + Math.random() * 200,
    }

    setNodes([...nodes, newNode])
    setNodeInput("")
    setError("")
  }

  const handleAddEdge = () => {
    if (!sourceNode || !targetNode) {
      setError("Please select both source and target nodes")
      return
    }

    if (sourceNode === targetNode) {
      setError("Source and target nodes must be different")
      return
    }

    // Check if edge already exists
    if (
      edges.some(
        (edge) =>
          (edge.source === sourceNode && edge.target === targetNode) ||
          (graphType === "undirected" && edge.source === targetNode && edge.target === sourceNode),
      )
    ) {
      setError("Edge already exists between these nodes")
      return
    }

    const newEdge: GraphEdge = {
      id: `edge-${Date.now()}`,
      source: sourceNode,
      target: targetNode,
    }

    setEdges([...edges, newEdge])
    setSourceNode("")
    setTargetNode("")
    setError("")
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold">Graph Visualizer (Planned)</h1>
          <p className="text-muted-foreground">A graph is a non-linear data structure consisting of nodes and edges</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Operations</CardTitle>
              <CardDescription>Add nodes and edges to the graph</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <RadioGroup defaultValue="undirected" className="flex space-x-4" onValueChange={setGraphType}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="undirected" id="undirected" />
                  <Label htmlFor="undirected">Undirected</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="directed" id="directed" />
                  <Label htmlFor="directed">Directed</Label>
                </div>
              </RadioGroup>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Add Node</Label>
                  <div className="flex space-x-2">
                    <Input
                      value={nodeInput}
                      onChange={(e) => setNodeInput(e.target.value)}
                      placeholder="Enter node label"
                      className="flex-1"
                    />
                    <Button onClick={handleAddNode} className="flex items-center gap-1">
                      <Plus className="h-4 w-4" />
                      Add
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Add Edge</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <select
                      value={sourceNode}
                      onChange={(e) => setSourceNode(e.target.value)}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="">Source Node</option>
                      {nodes.map((node) => (
                        <option key={node.id} value={node.id}>
                          {node.label}
                        </option>
                      ))}
                    </select>
                    <select
                      value={targetNode}
                      onChange={(e) => setTargetNode(e.target.value)}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="">Target Node</option>
                      {nodes.map((node) => (
                        <option key={node.id} value={node.id}>
                          {node.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <Button
                    onClick={handleAddEdge}
                    className="w-full flex items-center gap-1"
                    disabled={nodes.length < 2}
                  >
                    <Plus className="h-4 w-4" />
                    Add Edge
                  </Button>
                </div>
              </div>

              {error && (
                <Alert variant="destructive">
                  <Info className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Visualization</CardTitle>
              <CardDescription>Nodes connected by edges</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg p-4 h-[400px] bg-muted/30 relative overflow-hidden">
                {nodes.length === 0 && (
                  <div className="text-muted-foreground absolute inset-0 flex items-center justify-center">
                    Graph is empty
                  </div>
                )}

                <svg width="100%" height="100%">
                  {/* Render edges */}
                  {edges.map((edge) => {
                    const source = nodes.find((node) => node.id === edge.source)
                    const target = nodes.find((node) => node.id === edge.target)

                    if (!source || !target) return null

                    return (
                      <g key={edge.id}>
                        <line
                          x1={source.x}
                          y1={source.y}
                          x2={target.x}
                          y2={target.y}
                          stroke="currentColor"
                          strokeWidth="2"
                          className="text-muted-foreground"
                        />
                        {graphType === "directed" && (
                          <polygon
                            points="0,-5 10,0 0,5"
                            className="fill-muted-foreground"
                            transform={`translate(${target.x}, ${target.y}) rotate(${(Math.atan2(target.y - source.y, target.x - source.x) * 180) / Math.PI}) translate(-10, 0)`}
                          />
                        )}
                      </g>
                    )
                  })}

                  {/* Render nodes */}
                  {nodes.map((node) => (
                    <motion.g
                      key={node.id}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <circle cx={node.x} cy={node.y} r={20} className="fill-card stroke-primary stroke-2" />
                      <text
                        x={node.x}
                        y={node.y}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        className="text-xs font-medium"
                      >
                        {node.label}
                      </text>
                    </motion.g>
                  ))}
                </svg>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Graph Operations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <h3 className="font-semibold">Breadth-First Search (BFS)</h3>
                <p className="text-sm text-muted-foreground">
                  Explores all vertices at the present depth before moving on to vertices at the next depth level.
                </p>
                <div className="bg-muted p-3 rounded text-sm font-mono">
                  bfs(startNode) {"{"}
                  <br />
                  &nbsp;&nbsp;const visited = new Set()
                  <br />
                  &nbsp;&nbsp;const queue = [startNode]
                  <br />
                  &nbsp;&nbsp;visited.add(startNode)
                  <br />
                  &nbsp;&nbsp;while (queue.length &gt; 0) {"{"}
                  <br />
                  &nbsp;&nbsp;&nbsp;&nbsp;const node = queue.shift()
                  <br />
                  &nbsp;&nbsp;&nbsp;&nbsp;// Process node
                  <br />
                  &nbsp;&nbsp;&nbsp;&nbsp;// Add unvisited neighbors to queue
                  <br />
                  &nbsp;&nbsp;{"}"}
                  <br />
                  {"}"}
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold">Depth-First Search (DFS)</h3>
                <p className="text-sm text-muted-foreground">
                  Explores as far as possible along each branch before backtracking.
                </p>
                <div className="bg-muted p-3 rounded text-sm font-mono">
                  dfs(startNode) {"{"}
                  <br />
                  &nbsp;&nbsp;const visited = new Set()
                  <br />
                  &nbsp;&nbsp;function explore(node) {"{"}
                  <br />
                  &nbsp;&nbsp;&nbsp;&nbsp;visited.add(node)
                  <br />
                  &nbsp;&nbsp;&nbsp;&nbsp;// Process node
                  <br />
                  &nbsp;&nbsp;&nbsp;&nbsp;// For each neighbor
                  <br />
                  &nbsp;&nbsp;&nbsp;&nbsp;// if not visited, explore(neighbor)
                  <br />
                  &nbsp;&nbsp;{"}"}
                  <br />
                  &nbsp;&nbsp;explore(startNode)
                  <br />
                  {"}"}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
