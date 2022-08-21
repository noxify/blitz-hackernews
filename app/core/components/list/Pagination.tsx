import { ArrowNarrowLeftIcon, ArrowNarrowRightIcon } from "@heroicons/react/outline"
import classNames from "classnames"

const Pagination = ({
  position,
  previousLink,
  nextLink,
  currentPage,
  pages,
  more,
}: {
  position: "top" | "bottom"
  previousLink: any
  nextLink: any
  currentPage: number
  pages: number
  more: boolean
}) => {
  return (
    <nav
      className={classNames(
        "px-4 flex items-center justify-between sm:px-0",
        position == "top" ? "mb-4" : "mt-4",
        pages <= 1 ? "hidden" : ""
      )}
    >
      <div className="-mt-px w-0 flex-1 flex">
        <button
          disabled={currentPage == 0}
          onClick={previousLink}
          className={classNames(
            "border-t-2 border-transparent pr-1 inline-flex items-center text-sm font-medium text-gray-500",
            currentPage != 0 ? "hover:text-gray-700 " : "hidden"
          )}
        >
          <ArrowNarrowLeftIcon className="mr-3 h-5 w-5 text-gray-400" aria-hidden="true" />
          Previous
        </button>
      </div>

      <div className="hidden md:-mt-px md:flex ">
        <p className=" text-gray-500   px-4 inline-flex items-center text-sm font-medium">
          {currentPage + 1} / {pages}
        </p>
      </div>

      <div className="-mt-px w-0 flex-1 flex justify-end">
        <button
          disabled={!more}
          onClick={nextLink}
          className={classNames(
            "border-t-2 border-transparent  pl-1 inline-flex items-center text-sm font-medium text-gray-500",
            more ? "hover:text-gray-700 " : "hidden"
          )}
        >
          Next
          <ArrowNarrowRightIcon className="ml-3 h-5 w-5 text-gray-400" aria-hidden="true" />
        </button>
      </div>
    </nav>
  )
}

export default Pagination
