import Section from './Section.tsx'
import { useState } from 'react'
import { TSection } from './types.ts'
import { LexoRank } from 'lexorank'

const lexoRank1 = LexoRank.middle()
const lexoRank2 = LexoRank.middle()
const lexoRank3 = LexoRank.middle()

const initialSections: TSection[] = [
  {
    id: 1,
    title: 'ToDo',
    tasks: [
      { id: 1, title: 'ToDo Task 1', sectionId: 1, position: lexoRank1.toString() },
      { id: 2, title: 'ToDo Task 2', sectionId: 1, position: lexoRank1.genNext().toString() },
      {
        id: 3,
        title: 'ToDo Task 3',
        sectionId: 1,
        position: lexoRank1.genNext().genNext().toString(),
      },
    ],
  },
  {
    id: 2,
    title: 'In Progress',
    tasks: [
      { id: 4, title: 'In Progress Task 1', sectionId: 2, position: lexoRank2.toString() },
      {
        id: 5,
        title: 'In Progress Task 2',
        sectionId: 2,
        position: lexoRank2.genNext().toString(),
      },
    ],
  },
  {
    id: 3,
    title: 'Done',
    tasks: [{ id: 6, title: 'Done Task 1', sectionId: 3, position: lexoRank3.toString() }],
  },
]

export default function Kanban() {
  const [sections, setSections] = useState<TSection[]>(initialSections)

  return (
    <div className="flex h-full w-full flex-row gap-4 overflow-auto p-8">
      {sections.map((section) => {
        return <Section key={section.id} section={section} setSections={setSections} />
      })}
    </div>
  )
}
