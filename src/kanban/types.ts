export type TTask = {
  id: number
  title: string
  sectionId: number
  position: string
}

export type TSection = {
  id: number
  title: string
  tasks: TTask[]
}