export function RichContent({ content, className }: { content: string; className?: string }) {
  const blocks = content.split('\n\n').map((block) => block.trim()).filter(Boolean)

  return (
    <div className={className}>
      {blocks.map((block, index) => {
        const lines = block.split('\n').map((line) => line.trim()).filter(Boolean)
        const isList = lines.length > 0 && lines.every((line) => line.startsWith('- '))
        if (isList) {
          return (
            <ul key={index} className="grid sm:grid-cols-2 gap-3 my-5">
              {lines.map((line, lineIndex) => (
                <li key={lineIndex} className="flex items-start gap-2 text-[13px] text-ink bg-canvas border border-line rounded-md px-3 py-2.5">
                  <span className="text-gold mt-0.5">—</span>{line.slice(2)}
                </li>
              ))}
            </ul>
          )
        }
        return <p key={index} className="text-muted text-[14px] leading-relaxed mb-4">{block}</p>
      })}
    </div>
  )
}
