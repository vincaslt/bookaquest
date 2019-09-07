// TODO: limit only to escape rooms that have weekDays and workHours and interval
export interface EscapeRoomDTO {
  id: string
  organizationId: string
  name: string
  description: string
  createdAt: string
  updatedAt: string
  weekDays: number[]
  workHours: [number, number]
  interval: number
  location?: string
}
