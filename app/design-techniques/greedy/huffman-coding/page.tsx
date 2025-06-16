"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Binary, Play, Pause, RotateCcw, FileText } from "lucide-react"
import type { JSX } from "react/jsx-runtime" // Import JSX to fix the undeclared variable error

interface HuffmanNode {
  char: string | null
  freq: number
  left: HuffmanNode | null
  right: HuffmanNode | null
  id: string
  x?: number
  y?: number
}

interface HuffmanCode {
  char: string
  code: string
  freq: number
}

export default function HuffmanCoding() {
  const [text, setText] = useState("ABRACADABRA")
  const [frequencies, setFrequencies] = useState<Map<string, number>>(new Map())
  const [nodes, setNodes] = useState<HuffmanNode[]>([])
  const [tree, setTree] = useState<HuffmanNode | null>(null)
  const [codes, setCodes] = useState<HuffmanCode[]>([])
  const [currentStep, setCurrentStep] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [animationSpeed, setAnimationSpeed] = useState(1000)
  const [steps, setSteps] = useState<string[]>([])

  const calculateFrequencies = (inputText: string) => {
    const freq = new Map<string, number>()
    for (const char of inputText) {
      freq.set(char, (freq.get(char) || 0) + 1)
    }
    return freq
  }

  const buildHuffmanTree = (freq: Map<string, number>) => {
    const nodeList: HuffmanNode[] = []
    const stepList: string[] = []
    let nodeId = 0

    // Create leaf nodes
    for (const [char, frequency] of freq.entries()) {
      nodeList.push({
        char,
        freq: frequency,
        left: null,
        right: null,
        id: `node_${nodeId++}`,
      })
    }

    stepList.push(`Created ${nodeList.length} leaf nodes from character frequencies`)

    // Build tree bottom-up
    const queue = [...nodeList].sort((a, b) => a.freq - b.freq)

    while (queue.length > 1) {
      // Take two nodes with minimum frequency
      const left = queue.shift()!
      const right = queue.shift()!

      // Create new internal node
      const merged: HuffmanNode = {
        char: null,
        freq: left.freq + right.freq,
        left,
        right,
        id: `node_${nodeId++}`,
      }

      stepList.push(
        `Merged '${left.char || "Internal"}' (${left.freq}) and '${right.char || "Internal"}' (${right.freq}) → ${merged.freq}`,
      )

      // Insert back in sorted order
      let inserted = false
      for (let i = 0; i < queue.length; i++) {
        if (merged.freq <= queue[i].freq) {
          queue.splice(i, 0, merged)
          inserted = true
          break
        }
      }
      if (!inserted) {
        queue.push(merged)
      }
    }

    setSteps(stepList)
    return queue[0] || null
  }

  const generateCodes = (node: HuffmanNode | null, code = "", codeMap: Map<string, string> = new Map()) => {
    if (!node) return codeMap

    if (node.char !== null) {
      // Leaf node
      codeMap.set(node.char, code || "0") // Single character gets '0'
      return codeMap
    }

    // Internal node
    generateCodes(node.left, code + "0", codeMap)
    generateCodes(node.right, code + "1", codeMap)

    return codeMap
  }

  const initializeVisualization = () => {
    const freq = calculateFrequencies(text)
    setFrequencies(freq)

    const huffmanTree = buildHuffmanTree(freq)
    setTree(huffmanTree)

    if (huffmanTree) {
      const codeMap = generateCodes(huffmanTree)
      const codeArray: HuffmanCode[] = []

      for (const [char, code] of codeMap.entries()) {
        codeArray.push({
          char,
          code,
          freq: freq.get(char) || 0,
        })
      }

      setCodes(codeArray.sort((a, b) => b.freq - a.freq))
    }

    setCurrentStep(0)
  }

  const startAnimation = () => {
    setIsAnimating(true)
    setCurrentStep(0)
  }

  const pauseAnimation = () => {
    setIsAnimating(false)
  }

  const resetAnimation = () => {
    setIsAnimating(false)
    setCurrentStep(0)
  }

  useEffect(() => {
    initializeVisualization()
  }, [text])

  useEffect(() => {
    if (isAnimating && currentStep < steps.length) {
      const timer = setTimeout(() => {
        setCurrentStep((prev) => prev + 1)
      }, animationSpeed)
      return () => clearTimeout(timer)
    } else if (currentStep >= steps.length) {
      setIsAnimating(false)
    }
  }, [isAnimating, currentStep, steps.length, animationSpeed])

  const renderTree = (node: HuffmanNode | null, x = 400, y = 50, level = 0): JSX.Element[] => {
    if (!node) return []

    const elements: JSX.Element[] = []
    const radius = 25
    const levelHeight = 80
    const levelWidth = Math.max(200 / (level + 1), 50)

    // Draw connections to children
    if (node.left) {
      const leftX = x - levelWidth
      const leftY = y + levelHeight
      elements.push(
        <line
          key={`line-left-${node.id}`}
          x1={x}
          y1={y + radius}
          x2={leftX}
          y2={leftY - radius}
          stroke="#666"
          strokeWidth="2"
        />,
      )
      elements.push(...renderTree(node.left, leftX, leftY, level + 1))
    }

    if (node.right) {
      const rightX = x + levelWidth
      const rightY = y + levelHeight
      elements.push(
        <line
          key={`line-right-${node.id}`}
          x1={x}
          y1={y + radius}
          x2={rightX}
          y2={rightY - radius}
          stroke="#666"
          strokeWidth="2"
        />,
      )
      elements.push(...renderTree(node.right, rightX, rightY, level + 1))
    }

    // Draw node
    elements.push(
      <g key={node.id}>
        <circle cx={x} cy={y} r={radius} fill={node.char ? "#10b981" : "#6366f1"} stroke="#374151" strokeWidth="2" />
        <text x={x} y={y - 5} textAnchor="middle" className="text-xs font-bold fill-white">
          {node.char || "INT"}
        </text>
        <text x={x} y={y + 8} textAnchor="middle" className="text-xs fill-white">
          {node.freq}
        </text>
      </g>,
    )

    return elements
  }

  const calculateSavings = () => {
    const originalBits = text.length * 8 // ASCII encoding
    const huffmanBits = text.split("").reduce((total, char) => {
      const code = codes.find((c) => c.char === char)
      return total + (code?.code.length || 0)
    }, 0)

    return {
      original: originalBits,
      huffman: huffmanBits,
      savings: (((originalBits - huffmanBits) / originalBits) * 100).toFixed(1),
    }
  }

  const savings = calculateSavings()

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Binary className="h-8 w-8 text-blue-600" />
            <h1 className="text-4xl font-bold tracking-tight">Huffman Coding</h1>
          </div>
          <p className="text-xl text-muted-foreground">Optimal prefix-free binary codes for data compression</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Input Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="text-input">Text to Encode</Label>
                  <Input
                    id="text-input"
                    value={text}
                    onChange={(e) => setText(e.target.value.toUpperCase())}
                    placeholder="Enter text to encode"
                    className="font-mono"
                  />
                </div>

                <div className="flex gap-2">
                  <Button onClick={startAnimation} disabled={isAnimating} className="flex items-center gap-2">
                    <Play className="h-4 w-4" />
                    Start Animation
                  </Button>
                  <Button onClick={pauseAnimation} disabled={!isAnimating} variant="outline">
                    <Pause className="h-4 w-4" />
                  </Button>
                  <Button onClick={resetAnimation} variant="outline">
                    <RotateCcw className="h-4 w-4" />
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
                <CardTitle>Huffman Tree Construction</CardTitle>
                <CardDescription>
                  Step {currentStep} of {steps.length}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-muted p-4 rounded-lg mb-4 min-h-[60px]">
                  <p className="text-sm">
                    {currentStep > 0 ? steps[currentStep - 1] : "Click 'Start Animation' to begin tree construction"}
                  </p>
                </div>

                {tree && (
                  <div className="border rounded-lg p-4 bg-white overflow-auto">
                    <svg width="800" height="400" className="mx-auto">
                      {renderTree(tree)}
                    </svg>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Character Frequencies</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {Array.from(frequencies.entries())
                    .sort((a, b) => b[1] - a[1])
                    .map(([char, freq]) => (
                      <div key={char} className="flex justify-between items-center p-2 bg-muted rounded">
                        <span className="font-mono font-bold">'{char}'</span>
                        <span>{freq}</span>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Huffman Codes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {codes.map((code) => (
                    <div key={code.char} className="flex justify-between items-center p-2 bg-muted rounded">
                      <span className="font-mono font-bold">'{code.char}'</span>
                      <span className="font-mono text-blue-600">{code.code}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Compression Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span>Original (ASCII):</span>
                  <span>{savings.original} bits</span>
                </div>
                <div className="flex justify-between">
                  <span>Huffman:</span>
                  <span>{savings.huffman} bits</span>
                </div>
                <div className="flex justify-between font-bold text-green-600">
                  <span>Savings:</span>
                  <span>{savings.savings}%</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
