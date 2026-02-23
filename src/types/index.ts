export interface Task {
  id: string
  title: string
  goalId?: string
  scheduledDate?: string // YYYY-MM-DD
  completed: boolean
  completedAt?: string
  createdAt: string
}

export interface Goal {
  id: string
  title: string
  createdAt: string
}
