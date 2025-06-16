import { NextResponse } from "next/server"

interface TreeNode {
  value: number
  id: string
  left: TreeNode | null
  right: TreeNode | null
}

let root: TreeNode | null = null

export async function GET() {
  return NextResponse.json({ root })
}

export async function POST(request: Request) {
  const { action, value } = await request.json()

  if (action === "insert") {
    const newNode: TreeNode = {
      value,
      id: `node-${Date.now()}`,
      left: null,
      right: null,
    }

    if (!root) {
      root = newNode
      return NextResponse.json({ root })
    }

    const insert = (node: TreeNode, newNode: TreeNode): TreeNode => {
      if (newNode.value < node.value) {
        if (node.left === null) {
          node.left = newNode
        } else {
          node.left = insert(node.left, newNode)
        }
      } else {
        if (node.right === null) {
          node.right = newNode
        } else {
          node.right = insert(node.right, newNode)
        }
      }
      return { ...node }
    }

    root = insert(root, newNode)
    return NextResponse.json({ root })
  }

  if (action === "traverse") {
    const { traversalType } = await request.json()

    if (!root) {
      return NextResponse.json({ error: "Tree is empty! Cannot traverse." }, { status: 400 })
    }

    let result: number[] = []

    const inOrderTraversal = (node: TreeNode | null, result: number[] = []): number[] => {
      if (node) {
        inOrderTraversal(node.left, result)
        result.push(node.value)
        inOrderTraversal(node.right, result)
      }
      return result
    }

    const preOrderTraversal = (node: TreeNode | null, result: number[] = []): number[] => {
      if (node) {
        result.push(node.value)
        preOrderTraversal(node.left, result)
        preOrderTraversal(node.right, result)
      }
      return result
    }

    const postOrderTraversal = (node: TreeNode | null, result: number[] = []): number[] => {
      if (node) {
        postOrderTraversal(node.left, result)
        postOrderTraversal(node.right, result)
        result.push(node.value)
      }
      return result
    }

    switch (traversalType) {
      case "inorder":
        result = inOrderTraversal(root)
        break
      case "preorder":
        result = preOrderTraversal(root)
        break
      case "postorder":
        result = postOrderTraversal(root)
        break
      default:
        return NextResponse.json(
          { error: "Invalid traversal type. Use 'inorder', 'preorder', or 'postorder'." },
          { status: 400 },
        )
    }

    return NextResponse.json({ result, traversalType })
  }

  return NextResponse.json({ error: "Invalid action. Use 'insert' or 'traverse'." }, { status: 400 })
}

export async function DELETE() {
  root = null
  return NextResponse.json({ root: null })
}
