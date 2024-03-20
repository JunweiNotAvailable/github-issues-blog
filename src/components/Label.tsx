import { isDark } from '@/utils/functions'
import { PostLabel } from '@/utils/interfaces'
import React from 'react'

interface Props {
  label: PostLabel
}

const Label: React.FC<Props> = React.memo(({ label }) => {
  return (
    <div
      className="text-xs mr-2 my-1 px-3 py-1 rounded-full"
      style={{ borderColor: `#${label.color}`, background: `#${label.color}88`, color: isDark(`#${label.color}`) ? '#fff' : '#000' }}
    >{label.name}</div>
  )
})

Label.displayName = 'Label';

export default Label