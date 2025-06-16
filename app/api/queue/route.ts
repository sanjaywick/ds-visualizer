import { NextResponse } from "next/server"

let queue: string[] = []
const MAX_SIZE = 10

export async function GET() {
  return NextResponse.json({ queue })
}

export async function POST(request: Request) {
  const { action, value } = await request.json()

  if (action === "enqueue") {
    if (queue.length >= MAX_SIZE) {
      return NextResponse.json({ error: "Queue is full! Maximum size reached." }, { status: 400 })
    }

    queue.push(value)
    return NextResponse.json({ queue })
  }

  if (action === "dequeue") {
    if (queue.length === 0) {
      return NextResponse.json({ error: "Queue is empty! Cannot dequeue." }, { status: 400 })
    }

    const dequeuedValue = queue.shift()
    return NextResponse.json({ queue, dequeuedValue })
  }

  return NextResponse.json({ error: "Invalid action. Use 'enqueue' or 'dequeue'." }, { status: 400 })
}

export async function DELETE() {
  queue = []
  return NextResponse.json({ queue })
}
