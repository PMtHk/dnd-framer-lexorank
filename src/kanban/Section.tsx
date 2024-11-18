import { Dispatch, SetStateAction, useState, DragEvent } from 'react'
import Task from './Task.tsx'
import { TSection, TTask } from './types.ts'
import { LexoRank } from 'lexorank'

export interface SectionProps {
  section: TSection
  setSections: Dispatch<SetStateAction<TSection[]>>
}

export default function Section({ section, setSections }: SectionProps) {
  const { id, title, tasks } = section
  const [active, setActive] = useState<boolean>(false)
  const [belowTaskId, setBelowTaskId] = useState<number>(-1)

  const handleDragOver = (event: DragEvent<HTMLDivElement>, taskId?: number) => {
    event.preventDefault()
    setActive(true)

    if (!taskId) {
      setBelowTaskId(-1)
      return
    }

    setBelowTaskId(taskId)
  }

  const handleDragLeave = () => {
    setBelowTaskId(-1)
    setActive(false)
  }

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    const taskId = event.dataTransfer.getData('taskId')
    const prevSectionId = event.dataTransfer.getData('sectionId')

    if (taskId === belowTaskId.toString()) {
      // 자기 자리 위치면 굳이 이동할 필요 없다.
      setActive(false)
      setBelowTaskId(-1)
      return
    }

    setSections((prevSections) => {
      const prevSection = prevSections.find((section) => section.id.toString() === prevSectionId)
      const targetTask = prevSection?.tasks.find((task) => task.id.toString() === taskId)

      if (!targetTask) {
        return prevSections
      }

      const newPosition = calculatePosition(tasks, belowTaskId)
      const newTask = { ...targetTask, sectionId: id, position: newPosition }

      if (prevSectionId === id.toString()) {
        return prevSections.map((section) => {
          if (section.id === id) {
            const filteredTasks = section.tasks.filter((t) => t.id.toString() !== taskId)
            return {
              ...section,
              tasks: [...filteredTasks, newTask].sort((a, b) =>
                a.position.localeCompare(b.position)
              ),
            }
          }
          return section
        })
      }

      return prevSections.map((section) => {
        if (section.id.toString() === prevSectionId) {
          return {
            ...section,
            tasks: section.tasks.filter((t) => t.id.toString() !== taskId),
          }
        }

        if (section.id === id) {
          return {
            ...section,
            tasks: [...section.tasks, newTask].sort((a, b) => a.position.localeCompare(b.position)),
          }
        }

        return section
      })
    })

    setActive(false)
    setBelowTaskId(-1)
  }

  const sortedTasks = tasks.sort((a, b) => a.position.localeCompare(b.position))

  const calculatePosition = (tasks: TTask[], belowTaskId: number) => {
    const sortedTasks = tasks.sort((a, b) => a.position.localeCompare(b.position))

    if (tasks.length === 0) {
      // 빈 섹션이면 아무 값 생성
      return LexoRank.middle().toString()
    }

    if (belowTaskId === -1) {
      // 섹션 안에는 넣었지만, 특정 태스크 위에 드랍하지 않은 경우
      // 마지막의 다음 값
      return LexoRank.parse(sortedTasks[sortedTasks.length - 1].position)
        .genNext()
        .toString()
    }

    const belowTaskIndex = sortedTasks.findIndex((task) => task.id === belowTaskId)
    const belowTask = sortedTasks[belowTaskIndex]

    if (belowTaskIndex === 0) {
      // 첫 번째 태스크인 경우
      // 첫 번째 태스크의 이전 값
      return LexoRank.parse(belowTask.position).genPrev().toString()
    }

    return LexoRank.parse(sortedTasks[belowTaskIndex - 1].position)
      .between(LexoRank.parse(belowTask.position))
      .toString()
  }

  return (
    <div
      className={`mb-0 h-full flex-1 rounded-xl border-2 p-4 ${active ? 'border-blue-500' : 'border-transparent'} transition-all`}
    >
      <div className="mb-3 flex items-center justify-start gap-2">
        <h3 className={`font-medium`}>{title}</h3>
        <span className="text-sm text-neutral-400">{tasks?.length}</span>
      </div>
      <div
        onDragOver={(e) => handleDragOver(e)}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className="flex h-full min-h-80 w-full flex-col transition-colors"
      >
        {sortedTasks.map((task) => (
          <Task
            key={task.id}
            task={task}
            handleDragOver={(e) =>
              handleDragOver(e as unknown as DragEvent<HTMLDivElement>, task.id)
            }
            handleDragLeave={handleDragLeave}
            belowed={task.id === belowTaskId}
          />
        ))}
        <div
          className={`mt-2 h-1 w-full rounded-full bg-blue-500 ${
            active && belowTaskId === -1 ? 'opacity-100' : 'opacity-0'
          } transition-all`}
        />
      </div>
    </div>
  )
}
