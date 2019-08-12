export interface CreateEscapeRoomDTO {
  name: string
  description: string
  weekDays?: number[]
  workHours?: number[]
  interval?: number
  location?: string
}
