import React from "react"

export function DataTable({
  columns,
  data,
  emptyMessage = "No data found"
}: {
  columns: string[]
  data: React.ReactNode[][]
  emptyMessage?: string
}) {
  return (
    <div className="premium-card rounded-3xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-accent-muted uppercase bg-white/[0.055] border-b border-white/10">
            <tr>
              {columns.map((col, i) => (
                <th key={i} className="px-6 py-4 font-semibold">{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-6 py-10 text-center text-accent-muted">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((row, i) => (
                <tr key={i} className="border-b border-white/8 last:border-0 hover:bg-white/[0.055] transition-colors">
                  {row.map((cell, j) => (
                    <td key={j} className="px-6 py-4 whitespace-nowrap">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
