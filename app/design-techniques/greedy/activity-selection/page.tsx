"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Calendar, Play, Pause, RotateCcw, Plus, Trash2, Shuffle } from "lucide-react"

interface Activity {
  id: number
  start: number
  finish: number
  name: string
  selected?: boolean
}

interface SelectionState {
  currentIndex: number
  lastSelected: number
  selectedActivities: number[]
  step: string
}

export default function ActivitySelectionVisualization() {
  const [activities, setActivities] = useState<Activity[]>([
    { id: 1, start: 1, finish: 4, name: "Activity 1" },
    { id: 2, start: 3, finish: 5, name: "Activity 2" },
    { id: 3, start: 0, finish: 6, name: "Activity 3" },
    { id: 4, start: 5, finish: 7, name: "Activity 4" },
    { id: 5, start: 3, finish: 9, name: "Activity 5" },
    { id: 6, start: 5, finish: 9, name: "Activity 6" },
    { id: 7, start: 6, finish: 10, name: "Activity 7" },
    { id: 8, start: 8, finish: 11, name: "Activity 8" },
    { id: 9, start: 8, finish: 12, name: "Activity 9" },
    { id: 10, start: 2, finish: 14, name: "Activity 10" },
  ])
  const [currentState, setCurrentState] = useState<SelectionState | null>(null)
  const [isAnimating, setIsAnimating] = useState(false)
  const [animationSpeed, setAnimationSpeed] = useState(1000)
  const [newActivity, setNewActivity] = useState({ start: 0, finish: 0, name: "" })
  const [sortedActivities, setSortedActivities] = useState<Activity[]>([])

  const generateRandomActivities = () => {
    const count = Math.floor(Math.random() * 5) + 6 // 6-10 activities
    const newActivities: Activity[] = []

    for (let i = 1; i <= count; i++) {
      const start = Math.floor(Math.random() * 10)
      const duration = Math.floor(Math.random() * 5) + 1
      newActivities.push({
        id: i,
        start,
        finish: start + duration,
        name: `Activity ${i}`,
      })
    }

    setActivities(newActivities)
    setSortedActivities([])
    setCurrentState(null)
  }

  const addActivity = () => {
    if (newActivity.name && newActivity.finish > newActivity.start) {
      setActivities([
        ...activities,
        {
          id: Date.now(),
          start: newActivity.start,
          finish: newActivity.finish,
          name: newActivity.name,
        },
      ])
      setNewActivity({ start: 0, finish: 0, name: "" })
    }
  }

  const removeActivity = (id: number) => {
    setActivities(activities.filter((activity) => activity.id !== id))
  }

  const reset = () => {
    setIsAnimating(false)
    setCurrentState(null)
    setSortedActivities([])
  }

  const selectActivities = async () => {
    if (isAnimating) return
    setIsAnimating(true)

    try {
      // Sort activities by finish time
      const sorted = [...activities].sort((a, b) => a.finish - b.finish)
      setSortedActivities(sorted)

      setCurrentState({
        currentIndex: -1,
        lastSelected: -1,
        selectedActivities: [],
        step: "Sorting activities by finish time",
      })
      await new Promise((resolve) => setTimeout(resolve, animationSpeed))

      const selected: number[] = []

      // Always select first activity (greedy choice)
      selected.push(0)
      setCurrentState({
        currentIndex: 0,
        lastSelected: 0,
        selectedActivities: [...selected],
        step: `Select first activity: ${sorted[0].name} (${sorted[0].start}-${sorted[0].finish})`,
      })
      await new Promise((resolve) => setTimeout(resolve, animationSpeed))

      let lastSelected = 0

      // Consider remaining activities
      for (let i = 1; i < sorted.length; i++) {
        setCurrentState({
          currentIndex: i,
          lastSelected,
          selectedActivities: [...selected],
          step: `Considering ${sorted[i].name} (${sorted[i].start}-${sorted[i].finish})`,
        })
        await new Promise((resolve) => setTimeout(resolve, animationSpeed))

        // If this activity starts after the finish time of last selected activity
        if (sorted[i].start >= sorted[lastSelected].finish) {
          selected.push(i)
          lastSelected = i

          setCurrentState({
            currentIndex: i,
            lastSelected,
            selectedActivities: [...selected],
            step: `Select ${sorted[i].name}: starts (${sorted[i].start}) after previous finishes (${sorted[lastSelected].finish})`,
          })
        } else {
          setCurrentState({
            currentIndex: i,
            lastSelected,
            selectedActivities: [...selected],
            step: `Skip ${sorted[i].name}: starts (${sorted[i].start}) before previous finishes (${sorted[lastSelected].finish})`,
          })
        }

        await new Promise((resolve) => setTimeout(resolve, animationSpeed))
      }

      // Final result
      setCurrentState({
        currentIndex: -1,
        lastSelected: -1,
        selectedActivities: selected,
        step: `Selected ${selected.length} activities: [${selected.map((i) => sorted[i].name).join(", ")}]`,
      })
    } catch (error) {
      console.error("Error in selectActivities:", error)
    } finally {
      setIsAnimating(false)
    }
  }

  const getTimelineWidth = () => {
    if (activities.length === 0) return 100
    const maxFinish = Math.max(...activities.map((a) => a.finish))
    return Math.max(100, maxFinish * 40 + 80) // Scale for visibility
  }

  const getActivityClass = (index: number) => {
    if (!currentState || !sortedActivities.length) return "bg-gray-100"

    if (currentState.selectedActivities.includes(index)) {
      return "bg-green-200 border-green-400"
    }

    if (currentState.currentIndex === index) {
      return "bg-blue-200 border-blue-400"
    }

    return "bg-gray-100"
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Calendar className="h-8 w-8 text-yellow-600" />
            <h1 className="text-4xl font-bold tracking-tight">Activity Selection</h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Select maximum number of non-overlapping activities using greedy algorithm
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Controls */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="speed">Animation Speed (ms)</Label>
                  <Input
                    id="speed"
                    type="number"
                    value={animationSpeed}
                    onChange={(e) => setAnimationSpeed(Math.max(100, Number.parseInt(e.target.value) || 1000))}
                    min="100"
                    max="3000"
                    step="100"
                  />
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={selectActivities}
                    disabled={isAnimating || activities.length === 0}
                    className="flex-1"
                  >
                    {isAnimating ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
                    {isAnimating ? "Running..." : "Select Activities"}
                  </Button>
                  <Button onClick={reset} variant="outline" disabled={isAnimating}>
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                </div>

                <Button onClick={generateRandomActivities} variant="outline" disabled={isAnimating} className="w-full">
                  <Shuffle className="h-4 w-4 mr-2" />
                  Random Activities
                </Button>
              </CardContent>
            </Card>

            {/* Add Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Add Activity</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="activityName">Name</Label>
                  <Input
                    id="activityName"
                    value={newActivity.name}
                    onChange={(e) => setNewActivity({ ...newActivity, name: e.target.value })}
                    placeholder="Activity name"
                    disabled={isAnimating}
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label htmlFor="startTime">Start Time</Label>
                    <Input
                      id="startTime"
                      type="number"
                      value={newActivity.start}
                      onChange={(e) => setNewActivity({ ...newActivity, start: Number.parseInt(e.target.value) || 0 })}
                      min="0"
                      disabled={isAnimating}
                    />
                  </div>
                  <div>
                    <Label htmlFor="finishTime">Finish Time</Label>
                    <Input
                      id="finishTime"
                      type="number"
                      value={newActivity.finish}
                      onChange={(e) => setNewActivity({ ...newActivity, finish: Number.parseInt(e.target.value) || 0 })}
                      min={newActivity.start + 1}
                      disabled={isAnimating}
                    />
                  </div>
                </div>
                <Button
                  onClick={addActivity}
                  disabled={isAnimating || !newActivity.name || newActivity.finish <= newActivity.start}
                  className="w-full"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Activity
                </Button>
              </CardContent>
            </Card>

            {/* Activities List */}
            <Card>
              <CardHeader>
                <CardTitle>Activities</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {activities.map((activity) => (
                    <div key={activity.id} className="flex items-center justify-between p-2 rounded border bg-gray-50">
                      <div>
                        <div className="font-medium">{activity.name}</div>
                        <div className="text-sm text-muted-foreground">
                          Start: {activity.start}, Finish: {activity.finish}
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => removeActivity(activity.id)}
                        disabled={isAnimating}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Timeline Visualization */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Timeline Visualization</CardTitle>
                <CardDescription>Green: Selected activities | Blue: Currently considering</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Timeline */}
                  <div className="relative" style={{ width: `${getTimelineWidth()}px`, overflowX: "auto" }}>
                    {/* Time markers */}
                    <div className="flex border-b mb-2">
                      {Array.from({ length: 20 }).map((_, i) => (
                        <div key={i} className="flex-none w-10 text-center text-xs">
                          {i}
                        </div>
                      ))}
                    </div>

                    {/* Activities */}
                    <div className="space-y-2">
                      {sortedActivities.length > 0 ? (
                        sortedActivities.map((activity, index) => (
                          <div key={activity.id} className="flex items-center h-8">
                            <div className="w-16 text-xs font-medium truncate pr-2">{activity.name}</div>
                            <div className="relative flex-grow">
                              <div
                                className={`absolute h-6 rounded-md border-2 ${getActivityClass(index)}`}
                                style={{
                                  left: `${activity.start * 40}px`,
                                  width: `${(activity.finish - activity.start) * 40}px`,
                                }}
                              >
                                <span className="text-xs px-1">
                                  {activity.start}-{activity.finish}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center text-muted-foreground py-4">
                          Click "Select Activities" to start the algorithm
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Current Step */}
            {currentState && (
              <Card>
                <CardHeader>
                  <CardTitle>Current Step</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">{currentState.step}</p>
                  {currentState.selectedActivities.length > 0 && (
                    <div className="mt-2 p-2 bg-green-50 rounded">
                      <span className="text-sm font-medium">
                        Selected so far:{" "}
                        {currentState.selectedActivities.map((i) => sortedActivities[i]?.name || "").join(", ")}
                      </span>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Algorithm Explanation */}
            <Card>
              <CardHeader>
                <CardTitle>Algorithm Explanation</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold">Greedy Approach:</h4>
                  <ol className="text-sm text-muted-foreground list-decimal list-inside space-y-1 mt-2">
                    <li>Sort all activities by finish time</li>
                    <li>Select the first activity (earliest finish)</li>
                    <li>For remaining activities, select if start time ≥ finish time of last selected activity</li>
                  </ol>
                </div>
                <div>
                  <h4 className="font-semibold">Why Greedy Works:</h4>
                  <p className="text-sm text-muted-foreground">
                    By always choosing the activity that finishes earliest, we maximize the time available for remaining
                    activities.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold">Time Complexity:</h4>
                  <p className="text-sm text-muted-foreground">O(n log n) - dominated by the sorting step</p>
                </div>
                <div>
                  <h4 className="font-semibold">Space Complexity:</h4>
                  <p className="text-sm text-muted-foreground">O(1) - excluding the input and output storage</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
