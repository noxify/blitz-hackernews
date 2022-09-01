import Link from "next/link"

import { useI18n } from "locales"

import Markdown from "markdown-to-jsx"

import {
  ChatBubbleLeftEllipsisIcon as ChatAltIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  ClockIcon,
  UserIcon,
} from "@heroicons/react/24/outline"

import { MinusIcon, PlusIcon } from "@heroicons/react/20/solid"

import { formatDistance } from "date-fns"
import React, { useState, createContext, useEffect } from "react"
import MarkdownField from "app/core/components/form/MarkdownField"
import Form from "app/core/components/form/Form"
import { useMutation, invalidateQuery } from "@blitzjs/rpc"
import createComment from "app/comments/mutations/createComment"
import { CommentValidation } from "app/comments/validations"
import getComments from "app/comments/queries/getComments"
import createVote from "app/votes/mutations/createVote"
import classNames from "classnames"
import deleteVote from "app/votes/mutations/deleteVote"

const CommentContext = createContext({})

function gen_comments(comments, entryId, userId) {
  return comments.map((comment, i) => {
    return (
      <Comment
        entryId={entryId}
        userId={userId}
        key={i}
        data={comment.data}
        comments={comment.children}
      />
    )
  })
}

function Reply(props) {
  const [commentMutation] = useMutation(createComment)

  return (
    <div className="my-4">
      <Form
        schema={CommentValidation}
        onSubmit={async (values) => {
          const res = await commentMutation({
            ...values,
            parentId: props.parentId,
            authorId: props.userId,
            entryId: props.entryId,
          })

          await invalidateQuery(getComments, { where: { entryId: props.entryId } })
        }}
        submitText={props.submitText || "Add reply"}
      >
        <MarkdownField label="Reply" name="content" />
      </Form>
    </div>
  )
}

function Comment(props) {
  const [createVoteMutation] = useMutation(createVote)
  const [deleteVoteMutation] = useMutation(deleteVote)

  const [minimized, setMinimized] = useState(false)
  const [reply, setReply] = useState(false)
  const { t } = useI18n()

  const hasVoted =
    props.userId && props.data.votes.find((ele) => ele.userId == props.userId) ? true : false
  return (
    <>
      <a id={props.data.id}></a>
      <div className="bg-white shadow overflow-hidden sm:rounded-md mb-4">
        <div className="flex items-start p-4">
          <div className={`${minimized ? "hidden" : "mr-4 text-center text-gray-800"}`}>
            {props.userId && !hasVoted && (
              <button
                id="thumbs_up"
                onClick={async () => {
                  await createVoteMutation({ commentId: props.data.id })
                  await invalidateQuery(getComments, {
                    where: { entryId: props.entryId },
                  })
                }}
              >
                <ChevronUpIcon className="h-4 w-4" />
              </button>
            )}
            <div className="">{props.data.votes.length}</div>
            {props.userId && hasVoted && (
              <button
                id="thumbs_down"
                onClick={async () => {
                  await deleteVoteMutation({ commentId: props.data.id })
                  await invalidateQuery(getComments, {
                    where: { entryId: props.entryId },
                  })
                }}
              >
                <ChevronDownIcon className="h-4 w-4" />
              </button>
            )}
          </div>

          <div className="min-w-0 flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <div className="mt-1 flex justify-between">
                <div className="flex w-full">
                  <div className="flex items-center text-sm text-gray-500">
                    <span
                      onClick={() => {
                        setMinimized(!minimized)
                        setReply(false)
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

                    <Link href={`/entries/${props.data.entryId}#${props.data.id}`}>
                      <a className="hover:underline">
                        {formatDistance(new Date(props.data.createdAt), new Date(), {
                          addSuffix: true,
                        })}
                      </a>
                    </Link>
                  </div>

                  <div className="ml-2 flex items-center text-sm text-gray-500 ">
                    <ChatAltIcon
                      className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
                      aria-hidden="true"
                    />

                    <span>Replies ({props.comments.length})</span>
                  </div>
                </div>
              </div>
              <div className={`${minimized ? "hidden" : "mt-2"}`}>
                <Markdown>{props.data.content || ""}</Markdown>
              </div>
              {!minimized && props.userId && (
                <span
                  onClick={() => {
                    setReply(!reply)
                  }}
                >
                  Reply
                </span>
              )}
            </div>
          </div>
        </div>
        {!minimized && props.userId && reply && (
          <div className="px-4">
            <Reply
              submitText="Add Comment"
              userId={props.userId}
              entryId={props.entryId}
              parentId={props.data.id}
            />
          </div>
        )}
      </div>
      <div className={`${minimized ? "hidden" : "ml-4"}`}>
        {gen_comments(props.comments, props.entryId, props.userId)}
      </div>
    </>
  )
}

export function Comments({ comments, entryId, userId }) {
  return (
    <>
      {userId && (
        <Reply submitText="Add Comment" userId={userId} entryId={entryId} parentId={null} />
      )}
      <CommentContext.Provider value={[]}>
        <div className="my-4">{gen_comments(comments, entryId, userId)}</div>
      </CommentContext.Provider>
    </>
  )
}
