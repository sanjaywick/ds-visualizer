import { NextResponse } from "next/server"

let stack: string[] = []
const MAX_SIZE = 10

export async function GET() {
  return NextResponse.json({ stack })
}

export async function POST(request: Request) {
  const { action, value } = await request.json()

  if (action === "push") {
    if (stack.length >= MAX_SIZE) {
      return NextResponse.json({ error: "Stack overflow! Maximum size reached." }, { status: 400 })
    }

    stack.push(value)
    return NextResponse.json({ stack })
  }

  if (action === "pop") {
    if (stack.length === 0) {
      return NextResponse.json({ error: "Stack underflow! Cannot pop from an empty stack." }, { status: 400 })
    }

    const poppedValue = stack.pop()
    return NextResponse.json({ stack, poppedValue })
  }

  return NextResponse.json({ error: "Invalid action. Use 'push' or 'pop'." }, { status: 400 })
}

export async function DELETE() {
  stack = []
  return NextResponse.json({ stack })
}
