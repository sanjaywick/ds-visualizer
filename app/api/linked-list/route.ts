import { NextResponse } from "next/server"

interface Node {
  value: string
  id: string
}

let nodes: Node[] = []

export async function GET() {
  return NextResponse.json({ nodes })
}

export async function POST(request: Request) {
  const { action, value, position } = await request.json()

  if (action === "insert") {
    const newNode = {
      value,
      id: `node-${Date.now()}`,
    }

    if (position === "beginning") {
      nodes = [newNode, ...nodes]
    } else {
      nodes = [...nodes, newNode]
    }

    return NextResponse.json({ nodes })
  }

  if (action === "delete") {
    if (nodes.length === 0) {
      return NextResponse.json({ error: "Linked list is empty! Cannot delete." }, { status: 400 })
    }

    if (position === "beginning") {
      nodes = nodes.slice(1)
    } else {
      nodes = nodes.slice(0, -1)
    }

    return NextResponse.json({ nodes })
  }

  return NextResponse.json({ error: "Invalid action. Use 'insert' or 'delete'." }, { status: 400 })
}

export async function DELETE() {
  nodes = []
  return NextResponse.json({ nodes })
}
