import { useState } from 'react'

import { CodeEditor } from '@/components/editor/CodeEditor'

export function EditorPanel() {
  const [value, setValue] = useState('')

  return (
    <section className="bg-editor min-h-[55vh] min-w-0 flex-1 lg:min-h-0">
      <CodeEditor value={value} language="typescript" onChange={setValue} />
    </section>
  )
}
