import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

const MarkdownContent = ({ children }) => {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        code: ({ inline, children: codeChildren }) =>
          inline ? (
            <code className="bg-gray-300 rounded p-1 text-sm">{codeChildren}</code>
          ) : (
            <code className="bg-gray-300 rounded p-4 block my-2 text-sm">{codeChildren}</code>
          ),
      }}
    >
      {children}
    </ReactMarkdown>
  )
}

export default MarkdownContent
