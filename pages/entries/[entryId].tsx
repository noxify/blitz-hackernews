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
import { Comments } from "app/comments/components/Comment"
import Markdown from "markdown-to-jsx"

import {
  ChatBubbleLeftEllipsisIcon as ChatAltIcon,
  ChevronUpIcon,
  ClockIcon,
  EyeSlashIcon as EyeOffIcon,
  UserIcon,
} from "@heroicons/react/24/outline"
import { formatDistance } from "date-fns"
import { useCurrentUser } from "app/core/hooks/useCurrentUser"

export const Entry = () => {
  const { t } = useI18n()
  const currentUser = useCurrentUser()

  const router = useRouter()
  const entryId = useParam("entryId", "number")
  const [deleteEntryMutation] = useMutation(deleteEntry)
  const [entry] = useQuery(getEntry, { id: entryId })
  const [comments] = useQuery(getComments, {
    orderBy: { id: "desc" },
    where: {
      entryId,
    },
  })

  const commentTree = arrayToTree(comments, {})
  console.log(commentTree)

  return (
    <>
      <Head>
        <title>Entry {entry.title}</title>
      </Head>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <div className="flex items-center p-4">
          <div className="mr-4 text-center text-gray-800">
            <button className="" id="thumbs_up" onClick={() => {}}>
              <ChevronUpIcon className="h-4 w-4" />
            </button>
            <div className="">{entry.votes.length}</div>
          </div>

          <div className="min-w-0 flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <div className="flex text-sm">
                {entry.link ? (
                  <a
                    href={entry.link}
                    target="_blank"
                    className="font-medium text-orange-600 hover:text-orange-800 truncate"
                    rel="noreferrer"
                  >
                    {entry.title}
                  </a>
                ) : (
                  <Link href={`/entries/${entry.id}`}>
                    <a className="font-medium text-orange-600 hover:text-orange-800 truncate">
                      {entry.title}
                    </a>
                  </Link>
                )}
                {entry.siteName && (
                  <p className="ml-1 flex-shrink-0 font-normal text-gray-500">
                    ({" "}
                    <Link href={`/filter?siteName=${entry.siteName}`}>
                      <a className="hover:underline">{entry.siteName}</a>
                    </Link>{" "}
                    )
                  </p>
                )}
              </div>
              <div className="mt-1 flex justify-between">
                <div className="flex w-full">
                  <div className="flex items-center text-sm text-gray-500">
                    <UserIcon
                      className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
                      aria-hidden="true"
                    />
                    <Link href={`/user/${entry.author.id}`}>
                      <a className="hover:underline">{entry.author.name}</a>
                    </Link>
                  </div>
                  <div className="ml-2 flex items-center text-sm text-gray-500 ">
                    <ClockIcon
                      className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
                      aria-hidden="true"
                    />
                    <Link href={`/entries/${entry.id}`}>
                      <a className="hover:underline">
                        {formatDistance(new Date(entry.createdAt), new Date(), {
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
                    <Link href={`/comments/${entry.id}`}>
                      <a className="hover:underline">
                        {t("recordlist.comments")} ({entry.comments.length})
                      </a>
                    </Link>
                  </div>
                  {currentUser && (
                    <div className="ml-2 flex items-center text-sm text-gray-500 ">
                      <EyeOffIcon
                        className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
                        aria-hidden="true"
                      />
                      <a
                        className="hover:underline"
                        onClick={() => {
                          console.log("hide record")
                        }}
                      >
                        {t("recordlist.hide")}
                      </a>
                    </div>
                  )}
                </div>
              </div>
              <div className="mt-2">
                <Markdown>{entry.content || ""}</Markdown>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Comments comments={commentTree} />
    </>
  )
}

const ShowEntryPage = () => {
  return (
    <Layout>
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <Entry />
      </div>
    </Layout>
  )
}

ShowEntryPage.authenticate = false

export default ShowEntryPage
