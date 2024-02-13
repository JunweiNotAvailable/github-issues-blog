import { isDark } from '@/utils/functions'
import React from 'react'

interface Props {
  label: any
}

const Label: React.FC<Props> = React.memo(({ label }) => {
  return (
    <div
      className="text-xs mr-2 my-1 px-3 py-1 rounded-full"
      style={{ borderColor: `#${label.color}`, background: `#${label.color}88`, color: isDark(`#${label.color}`) ? '#fff' : '#000' }}
    >{label.name}</div>
  )
})

export default Label