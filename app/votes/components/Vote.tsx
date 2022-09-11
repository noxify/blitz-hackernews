import { useMutation, invalidateQuery } from "@blitzjs/rpc"
import { ChevronUpIcon, ChevronDownIcon } from "@heroicons/react/24/outline"
import { Entry, Vote as VoteModel } from "@prisma/client"
import getEntry from "app/entries/queries/getEntry"
import { useCurrentUser } from "app/users/hooks/useCurrentUser"
import createVote from "app/votes/mutations/createVote"
import deleteVote from "app/votes/mutations/deleteVote"

const Vote = ({
  entry,
  invalidateFn,
}: {
  entry: Entry & { votes: VoteModel[] }
  invalidateFn?: Function
}) => {
  const currentUser = useCurrentUser()
  const [createVoteMutation] = useMutation(createVote)
  const [deleteVoteMutation] = useMutation(deleteVote)
  const hasVoted =
    currentUser?.id && entry.votes.find((ele) => ele.userId == currentUser.id) ? true : false

  return (
    <div className="mr-4 text-center text-gray-800">
      {currentUser && !hasVoted && (
        <button
          id="thumbs_up"
          onClick={async () => {
            await createVoteMutation({ entryId: entry.id })
            if (invalidateFn) {
              await invalidateFn(entry)
            }
          }}
        >
          <ChevronUpIcon className="h-4 w-4" />
        </button>
      )}
      <div className="">{entry.votes.length}</div>
      {currentUser && hasVoted && (
        <button
          id="thumbs_down"
          onClick={async () => {
            await deleteVoteMutation({ entryId: entry.id })
            if (invalidateFn) {
              await invalidateFn(entry)
            }
          }}
        >
          <ChevronDownIcon className="h-4 w-4" />
        </button>
      )}
    </div>
  )
}

export default Vote
