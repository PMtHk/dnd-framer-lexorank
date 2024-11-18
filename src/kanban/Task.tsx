import { useState, DragEvent } from 'react'
import { motion } from 'framer-motion'
import { TTask } from './types.ts'

export interface TaskProps {
  task: TTask
  handleDragOver: (e: DragEvent<HTMLDivElement>) => void
  handleDragLeave: () => void
  belowed: boolean
}

export default function Task({ task, handleDragOver, handleDragLeave, belowed }: TaskProps) {
  const { id, title: initTitle } = task
  const [title, setTitle] = useState<string>(initTitle)

  const handleDragStart = (event: DragEvent<HTMLDivElement>, task: TTask) => {
    event.dataTransfer.setData('taskId', task.id.toString())
    event.dataTransfer.setData('sectionId', task.sectionId.toString())
  }

  const onDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation() // 이벤트 전파 중단
    handleDragOver(e)
  }

  return (
    <motion.div
      layout
      layoutId={id.toString()}
      draggable
      onDragStart={(e) => handleDragStart(e as unknown as DragEvent<HTMLDivElement>, task)}
      onDragOver={onDragOver}
      onDragLeave={handleDragLeave}
    >
      <div
        className={`my-2 h-1 w-full rounded-full bg-blue-500 ${belowed ? 'opacity-100' : 'opacity-0'} transition-all`}
      />
      <div className="rounded-md border border-gray-500 p-2">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full cursor-grab bg-neutral-50 bg-transparent p-1 outline-none focus:text-blue-500 active:cursor-grabbing"
        />
      </div>
    </motion.div>
  )
}
