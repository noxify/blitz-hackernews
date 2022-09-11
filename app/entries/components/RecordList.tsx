/* This example requires Tailwind CSS v2.0+ */
import { invalidateQuery, useMutation } from "@blitzjs/rpc"
import {
  ChatBubbleLeftEllipsisIcon as ChatAltIcon,
  ClockIcon,
  EyeSlashIcon as EyeOffIcon,
  UserIcon,
} from "@heroicons/react/24/outline"
import { Comment, Entry, User, Vote as VoteModel } from "@prisma/client"
import { useCurrentUser } from "app/users/hooks/useCurrentUser"
import createHide from "app/hides/mutations/createHide"
import getCurrentUser from "app/users/queries/getCurrentUser"
import { formatDistance } from "date-fns"
import { useI18n } from "locales"
import Link from "next/link"
import Vote from "app/votes/components/Vote"
import getEntries from "app/entries/queries/getEntries"

const getPrefix = (type: string) => {
  switch (type) {
    case "ask":
      return "Ask:"
    case "tell":
      return "Tell:"
    case "show":
      return "Show:"
    default:
      return ""
  }
}

const RecordList = ({
  data,
}: {
  data: (Entry & {
    author: User
    comments: Comment[]
    votes: VoteModel[]
  })[]
}) => {
  const currentUser = useCurrentUser()
  const [createHideMutation] = useMutation(createHide)

  const { t } = useI18n()

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-md">
      <ul role="list" className="divide-y divide-gray-200 list-none">
        {data &&
          data.map((entry) => (
            <li key={entry.id}>
              <div className="flex items-center hover:bg-gray-50 p-4">
                <Vote
                  entry={entry}
                  invalidateFn={async () => {
                    await invalidateQuery(getEntries, {})
                  }}
                />

                <div className="min-w-0 flex-1 sm:flex sm:items-center sm:justify-between">
                  <div className="truncate">
                    <div className="flex text-sm">
                      {entry.type !== "general" && (
                        <span className="font-medium">{getPrefix(entry.type)}&nbsp;</span>
                      )}

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
                          <Link href={`/entries/${entry.id}`}>
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
                              onClick={async () => {
                                await createHideMutation({ entryId: entry.id })
                                await invalidateQuery(getCurrentUser, null)
                              }}
                            >
                              {t("recordlist.hide")}
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          ))}
        {data && data.length == 0 && (
          <li>
            <div className="flex items-center hover:bg-gray-50 p-4">
              <div className="min-w-0 flex-1 sm:flex sm:items-center sm:justify-between">
                <div className="truncate">
                  <div className="flex text-sm">{t("recordlist.no_data")}</div>
                </div>
              </div>
            </div>
          </li>
        )}
      </ul>
    </div>
  )
}

export default RecordList
