"use client"

import type React from "react"
import { useState, useRef, useEffect, Suspense } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, Info, Plus, Trash2 } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { motion, AnimatePresence } from "framer-motion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import Link from "next/link"

import dynamic from "next/dynamic"

const SinglyLinkedListVisualizer = dynamic(() => import("@/components/linked-list/SinglyLinkedListVisualizer"), { ssr: false })
const DoublyLinkedListVisualizer = dynamic(() => import("@/components/linked-list/DoublyLinkedListVisualizer"), { ssr: false })
const CircularLinkedListVisualizer = dynamic(() => import("@/components/linked-list/CircularLinkedListVisualizer"), { ssr: false })



interface Node {
  value: string
  id: string
}

export default function LinkedListVisualizer() {
  const [nodes, setNodes] = useState<Node[]>([])
  const [inputValue, setInputValue] = useState("")
  const [error, setError] = useState("")
  const [insertPosition, setInsertPosition] = useState("end")
  const [listType, setListType] = useState("singly")
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])

  const handleInsert = () => {
    if (!inputValue.trim()) {
      setError("Please enter a value to insert")
      return
    }

    const newNode = {
      value: inputValue,
      id: `node-${Date.now()}`,
    }

    if (insertPosition === "beginning") {
      setNodes([newNode, ...nodes])
    } else {
      setNodes([...nodes, newNode])
    }

    setInputValue("")
    setError("")
  }

  const handleDelete = (position: "beginning" | "end") => {
    if (nodes.length === 0) {
      setError("Linked list is empty! Cannot delete.")
      return
    }

    if (position === "beginning") {
      setNodes(nodes.slice(1))
    } else {
      setNodes(nodes.slice(0, -1))
    }

    setError("")
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleInsert()
    }
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold">Linked List Visualizers</h1>
          <p className="text-muted-foreground">Explore different types of linked list data structures</p>
        </div>

        <Tabs defaultValue="singly" className="w-full" onValueChange={setListType}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="singly">Singly Linked List</TabsTrigger>
            <TabsTrigger value="doubly">Doubly Linked List</TabsTrigger>
            <TabsTrigger value="circular">Circular Linked List</TabsTrigger>
          </TabsList>

          <TabsContent value="singly">
            <Suspense fallback={<p className="text-center py-10">Loading Singly Linked List...</p>}>
              <SinglyLinkedListVisualizer />
            </Suspense>
          </TabsContent>

          <TabsContent value="doubly">
            <Suspense fallback={<p className="text-center py-10">Loading Doubly Linked List...</p>}>
              <DoublyLinkedListVisualizer />
            </Suspense>
          </TabsContent>

          <TabsContent value="circular">
            <Suspense fallback={<p className="text-center py-10">Loading Circular Linked List...</p>}>
              <CircularLinkedListVisualizer />
            </Suspense>
          </TabsContent>
        </Tabs>

        <div className="grid gap-6 md:grid-cols-3">
          <Card className="group hover:shadow-md transition-all">
            <CardHeader className="pb-3">
              <CardTitle>Singly Linked List</CardTitle>
              <CardDescription>Linear collection with one-way links</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Visualize operations on a singly linked list where each node points to the next node.
              </p>
              <Link href="/linked-list/singly" className="inline-block">
                <Button variant="outline" className="group-hover:bg-primary group-hover:text-primary-foreground">
                  Explore <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-md transition-all">
            <CardHeader className="pb-3">
              <CardTitle>Doubly Linked List</CardTitle>
              <CardDescription>Linear collection with two-way links</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Visualize operations on a doubly linked list where each node points to both next and previous nodes.
              </p>
              <Link href="/linked-list/doubly" className="inline-block">
                <Button variant="outline" className="group-hover:bg-primary group-hover:text-primary-foreground">
                  Explore <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-md transition-all">
            <CardHeader className="pb-3">
              <CardTitle>Circular Linked List</CardTitle>
              <CardDescription>Linked list that forms a circle</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Visualize operations on a circular linked list where the last node points back to the first node.
              </p>
              <Link href="/linked-list/circular" className="inline-block">
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
