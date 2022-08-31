import { Routes } from "@blitzjs/next"
import Head from "next/head"
import Link from "next/link"
import { useRouter } from "next/router"
import { useQuery, useMutation } from "@blitzjs/rpc"
import { useParam } from "@blitzjs/next"
import { useI18n } from "locales"
import Layout from "app/core/layouts/Layout"
import getEntry from "app/entries/queries/getEntry"
import deleteEntry from "app/entries/mutations/deleteEntry"
import getComments from "app/comments/queries/getComments"
import { arrayToTree } from "performant-array-to-tree"
import Markdown from "marked-react"

import {
  ChatBubbleLeftEllipsisIcon as ChatAltIcon,
  ChevronUpIcon,
  ClockIcon,
  EyeSlashIcon as EyeOffIcon,
  UserIcon,
} from "@heroicons/react/24/outline"

import { MinusIcon, PlusIcon } from "@heroicons/react/20/solid"
import { useCurrentUser } from "app/core/hooks/useCurrentUser"

import { formatDistance } from "date-fns"
import React, { useState, useEffect, useContext, createContext } from "react"
import classNames from "classnames"

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
        colorindex={colorindex}
        key={i}
        path={[...path, i]}
        data={comment.data}
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
  const currentUser = useCurrentUser()

  const [minimized, setMinimized] = useState(false)
  const { t } = useI18n()

  return (
    <>
      <div className="bg-white shadow overflow-hidden sm:rounded-md mb-4">
        <div className="flex items-start p-4">
          <div className="mr-4 text-center text-gray-800">
            <button className="" id="thumbs_up" onClick={() => {}}>
              <ChevronUpIcon className="h-4 w-4" />
            </button>
            <div className="">{props.data.votes.length}</div>
          </div>

          <div className="min-w-0 flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <div className="mt-1 flex justify-between">
                <div className="flex w-full">
                  <div className="flex items-center text-sm text-gray-500">
                    <span
                      onClick={() => {
                        setMinimized(!minimized)
                      }}
                    >
                      {minimized ? (
                        <PlusIcon
                          aria-hidden="true"
                          className="h-5 w-5 rounded bg-gray-100 text-gray-400 hover:bg-gray-200"
                        />
                      ) : (
                        <MinusIcon
                          aria-hidden="true"
                          className="h-5 w-5 rounded bg-gray-100 text-gray-400 hover:bg-gray-200"
                        />
                      )}
                    </span>

                    <UserIcon
                      className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
                      aria-hidden="true"
                    />
                    <Link href={`/user/${props.data.author.id}`}>
                      <a className="hover:underline">{props.data.author.name}</a>
                    </Link>
                  </div>
                  <div className="ml-2 flex items-center text-sm text-gray-500 ">
                    <ClockIcon
                      className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
                      aria-hidden="true"
                    />

                    <a className="hover:underline">
                      {formatDistance(new Date(props.data.createdAt), new Date(), {
                        addSuffix: true,
                      })}
                    </a>
                  </div>

                  <div className="ml-2 flex items-center text-sm text-gray-500 ">
                    <ChatAltIcon
                      className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
                      aria-hidden="true"
                    />
                    <Link href={`/comments/${props.data.id}`}>
                      <a className="hover:underline">Replies ({props.comments.length})</a>
                    </Link>
                  </div>
                </div>
              </div>
              <div className={`${minimized ? "hidden" : "mt-2"}`}>
                <Markdown value={props.data.content || ""} gfm={true} breaks={true} />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={`${minimized ? "hidden" : "ml-4"}`}>
        {gen_comments(props.comments, props.colorindex + 1, [...props.path])}
      </div>
    </>
  )
}

export function Comments({ comments }) {
  var [replying, setReplying] = useState([])

  return (
    <>
      <Reply />
      <CommentContext.Provider value={[replying, setReplying]}>
        {gen_comments(comments, 0, [])}
      </CommentContext.Provider>
    </>
  )
}
