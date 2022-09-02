import { forwardRef, PropsWithoutRef, useRef } from "react"
import { useField } from "formik"
import { Tab } from "@headlessui/react"
import TextareaMarkdown, { TextareaMarkdownRef } from "textarea-markdown-editor"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faBold,
  faStrikethrough,
  faLink,
  faListOl,
  faListUl,
  faItalic,
  faCode,
} from "@fortawesome/free-solid-svg-icons"

import classNames from "classnames"
import MarkdownContent from "app/core/components/MarkdownContent"
import { useI18n } from "locales"

export interface MarkdownFieldProps extends PropsWithoutRef<JSX.IntrinsicElements["div"]> {
  /** Field name. */
  name: string
  /** Field type. Doesn't include radio buttons and checkboxes */
  type?: "text" | "password" | "email" | "number"
  outerProps?: PropsWithoutRef<JSX.IntrinsicElements["div"]>
}

export const MarkdownField = forwardRef<HTMLInputElement, MarkdownFieldProps>(
  ({ name, outerProps, ...props }, ref) => {
    const { t } = useI18n()
    const [input, meta, { setValue }] = useField(name)
    const mdRef = useRef<TextareaMarkdownRef>(null)

    return (
      <div {...outerProps} ref={ref} className="mt-2">
        <Tab.Group>
          {({ selectedIndex }) => (
            <>
              <Tab.List className="flex items-center">
                <Tab
                  className={({ selected }) =>
                    classNames(
                      selected
                        ? "text-gray-900 bg-white hover:bg-gray-200"
                        : "text-gray-500 hover:text-gray-900 hover:bg-gray-100",
                      "rounded-md border border-transparent px-3 py-1.5 text-sm font-medium"
                    )
                  }
                >
                  {t("comments.write")}
                </Tab>
                <Tab
                  className={({ selected }) =>
                    classNames(
                      selected
                        ? "text-gray-900 bg-white hover:bg-gray-200"
                        : "text-gray-500 hover:text-gray-900 hover:bg-gray-100",
                      "ml-2 rounded-md border border-transparent px-3 py-1.5 text-sm font-medium"
                    )
                  }
                >
                  {t("comments.preview")}
                </Tab>

                {/* These buttons are here simply as examples and don't actually do anything. */}
                {selectedIndex === 0 ? (
                  <div className="ml-auto flex items-center space-x-5 mr-4 h-4">
                    <div className="flex items-center">
                      <button
                        type="button"
                        className="-m-2.5 inline-flex items-center justify-center rounded-full text-gray-400 hover:text-gray-500"
                        onClick={() => mdRef.current?.trigger("bold")}
                      >
                        <span className="sr-only">Bold</span>
                        <FontAwesomeIcon icon={faBold} size="1x" />
                      </button>
                    </div>
                    <div className="flex items-center">
                      <button
                        type="button"
                        className="-m-2.5 inline-flex  items-center justify-center rounded-full text-gray-400 hover:text-gray-500"
                        onClick={() => mdRef.current?.trigger("strike-through")}
                      >
                        <span className="sr-only">Strikethrough</span>
                        <FontAwesomeIcon icon={faStrikethrough} size="1x" />
                      </button>
                    </div>
                    <div className="flex items-center">
                      <button
                        type="button"
                        className="-m-2.5 inline-flex  items-center justify-center rounded-full text-gray-400 hover:text-gray-500"
                        onClick={() => mdRef.current?.trigger("italic")}
                      >
                        <span className="sr-only">Italic</span>
                        <FontAwesomeIcon icon={faItalic} size="1x" />
                      </button>
                    </div>
                    <div className="flex items-center">
                      <button
                        type="button"
                        className="-m-2.5 inline-flex  items-center justify-center rounded-full text-gray-400 hover:text-gray-500"
                        onClick={() => mdRef.current?.trigger("ordered-list")}
                      >
                        <span className="sr-only">ordered list</span>
                        <FontAwesomeIcon icon={faListOl} size="1x" />
                      </button>
                    </div>
                    <div className="flex items-center">
                      <button
                        type="button"
                        className="-m-2.5 inline-flex  items-center justify-center rounded-full text-gray-400 hover:text-gray-500"
                        onClick={() => mdRef.current?.trigger("unordered-list")}
                      >
                        <span className="sr-only">unordered list</span>
                        <FontAwesomeIcon icon={faListUl} size="1x" />
                      </button>
                    </div>
                    <div className="flex items-center">
                      <button
                        type="button"
                        className="-m-2.5 inline-flex  items-center justify-center rounded-full text-gray-400 hover:text-gray-500"
                        onClick={() => mdRef.current?.trigger("code")}
                      >
                        <span className="sr-only">Code</span>
                        <FontAwesomeIcon icon={faCode} size="1x" />
                      </button>
                    </div>
                  </div>
                ) : null}
              </Tab.List>
              <Tab.Panels className="mt-2">
                <Tab.Panel className="-m-0.5 rounded-lg p-0.5">
                  <div>
                    <TextareaMarkdown
                      name={name}
                      ref={mdRef}
                      value={input.value || ""}
                      onChange={(e) => setValue(e.target.value)}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm"
                      rows={5}
                    />
                  </div>
                </Tab.Panel>
                <Tab.Panel className="-m-0.5 rounded-lg p-0.5">
                  <div className="bg-white shadow overflow-hidden sm:rounded-md p-4">
                    <MarkdownContent>{input.value || "...Your content..."}</MarkdownContent>
                  </div>
                </Tab.Panel>
              </Tab.Panels>
            </>
          )}
        </Tab.Group>

        {meta.error ? (
          <>
            <p className="mt-1 text-sm text-red-600" id="email-error">
              {meta.error}
            </p>
          </>
        ) : null}
      </div>
    )
  }
)

export default MarkdownField
