import { formatDistance } from "date-fns"
import React, { useState, useEffect, useContext, createContext } from "react"

const CommentContext = createContext({})

function compare(a1, a2) {
  if (JSON.stringify(a1) === JSON.stringify(a2)) {
    return true
  }
  return false
}

function gen_comments(comments, colorindex, path) {
  return comments.map((comment, i) => {
    return (
      <Comment
        username={comment.data.author.name}
        date={formatDistance(comment.data.createdAt, new Date())}
        text={comment.data.content}
        votes={0}
        colorindex={colorindex}
        key={i}
        path={[...path, i]}
        comments={comment.children}
      />
    )
  })
}

function Reply(props) {
  const [text, setText] = useState("")
  return (
    <div {...props}>
      <textarea
        placeholder="What are your thoughts?"
        defaultValue={text}
        onChange={(value) => {
          setText(value.target.value)
        }}
      />
      <div className="panel">
        <div className="comment_as">
          Comment as{" "}
          <a href="" className="username">
            Kevin
          </a>
        </div>
        <button>COMMENT</button>
      </div>
    </div>
  )
}

function Rating(props) {
  const [count, setCount] = useState(props.votes)
  const [thumbsUp, setThumbsUp] = useState(false)
  const [thumbsDown, setThumbsDown] = useState(false)

  return (
    <div {...props}>
      <button
        className={`material-icons ${thumbsUp ? "selected" : ""}`}
        id="thumbs_up"
        onClick={() => {
          setThumbsUp(!thumbsUp)
          setThumbsDown(false)
        }}
      >
        keyboard_arrow_up
      </button>
      <div className={`count ${thumbsUp ? "up" : ""} ${thumbsDown ? "down" : ""}`}>
        {thumbsUp ? count + 1 : ""}
        {thumbsDown ? count - 1 : ""}
        {thumbsUp || thumbsDown ? "" : count}
      </div>
      <button
        className={`material-icons ${thumbsDown ? "selected" : ""}`}
        id="thumbs_down"
        onClick={() => {
          setThumbsDown(!thumbsDown)
          setThumbsUp(false)
        }}
      >
        keyboard_arrow_down
      </button>
    </div>
  )
}

function Comment(props) {
  const [minimized, setMinimized] = useState(false)
  const [hidden, setHidden] = useState(false)

  return (
    <div {...props}>
      {hidden ? (
        <button
          id="showMore"
          onClick={() => {
            setHidden(false)
          }}
        >
          Show More Replies
        </button>
      ) : (
        <>
          <div id="left" className={minimized ? "hidden" : ""}>
            {/* <Rating votes={props.votes} /> */}
            votes
          </div>
          <div id="right">
            <div id="top">
              <span
                className="minimize"
                onClick={() => {
                  setMinimized(!minimized)
                }}
              >
                [{minimized ? "+" : "-"}]
              </span>
              <span id="username">
                <a href="">{props.username}</a>
                user
              </span>
              <span id="date">
                <a href="">{props.date}</a>
                date
              </span>
            </div>
            <div id="content" className={minimized ? "hidden" : ""}>
              {/* <Markdown options={{ forceBlock: true }}>{props.text}</Markdown> */}
              content
            </div>
            <div id="actions" className={minimized ? "hidden" : ""}>
              {/* <span
                className={`${compare(replying, props.path) ? "selected" : ""}`}
                onClick={() => {
                  if (compare(replying, props.path)) {
                    setReplying([])
                  } else {
                    setReplying(props.path)
                  }
                }}
              >
                reply
              </span> */}
              <span>report</span>
            </div>
            {/* <Reply className={compare(replying, props.path) && !minimized ? "" : "hidden"} /> */}
            <div className={`comments ${minimized ? "hidden" : ""}`}>
              {gen_comments(props.comments, props.colorindex + 1, [...props.path])}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export function Comments({ comments }) {
  var [replying, setReplying] = useState([])

  console.log(comments)
  return (
    <>
      <Reply />
      <CommentContext.Provider value={[replying, setReplying]}>
        {gen_comments(comments, 0, [])}
      </CommentContext.Provider>
    </>
  )
}
