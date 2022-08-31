import { forwardRef, PropsWithoutRef, useRef } from "react"
import { useField, useFormikContext, ErrorMessage } from "formik"
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

import { AtSymbolIcon, CodeBracketIcon, LinkIcon } from "@heroicons/react/20/solid"
import classNames from "classnames"

export interface MarkdownFieldProps extends PropsWithoutRef<JSX.IntrinsicElements["div"]> {
  /** Field name. */
  name: string
  /** Field label. */
  label: string
  /** Field type. Doesn't include radio buttons and checkboxes */
  type?: "text" | "password" | "email" | "number"
  outerProps?: PropsWithoutRef<JSX.IntrinsicElements["div"]>
}

export const MarkdownField = forwardRef<HTMLInputElement, MarkdownFieldProps>(
  ({ name, label, outerProps, ...props }, ref) => {
    const [input, meta, { setValue }] = useField(name)
    const { isSubmitting } = useFormikContext()
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
                  Write
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
                  Preview
                </Tab>

                {/* These buttons are here simply as examples and don't actually do anything. */}
                {selectedIndex === 0 ? (
                  <div className="ml-auto flex items-center space-x-5">
                    <div className="flex items-center">
                      <button
                        type="button"
                        className="-m-2.5 inline-flex h-10 w-10 items-center justify-center rounded-full text-gray-400 hover:text-gray-500"
                        onClick={() => mdRef.current?.trigger("bold")}
                      >
                        <span className="sr-only">Bold</span>
                        <FontAwesomeIcon icon={faBold} />
                      </button>
                    </div>
                    <div className="flex items-center">
                      <button
                        type="button"
                        className="-m-2.5 inline-flex h-10 w-10 items-center justify-center rounded-full text-gray-400 hover:text-gray-500"
                        onClick={() => mdRef.current?.trigger("strike-through")}
                      >
                        <span className="sr-only">Strikethrough</span>
                        <FontAwesomeIcon icon={faStrikethrough} />
                      </button>
                    </div>
                    <div className="flex items-center">
                      <button
                        type="button"
                        className="-m-2.5 inline-flex h-10 w-10 items-center justify-center rounded-full text-gray-400 hover:text-gray-500"
                        onClick={() => mdRef.current?.trigger("italic")}
                      >
                        <span className="sr-only">Italic</span>
                        <FontAwesomeIcon icon={faItalic} />
                      </button>
                    </div>
                    <div className="flex items-center">
                      <button
                        type="button"
                        className="-m-2.5 inline-flex h-10 w-10 items-center justify-center rounded-full text-gray-400 hover:text-gray-500"
                        onClick={() => mdRef.current?.trigger("ordered-list")}
                      >
                        <span className="sr-only">ordered list</span>
                        <FontAwesomeIcon icon={faListOl} />
                      </button>
                    </div>
                    <div className="flex items-center">
                      <button
                        type="button"
                        className="-m-2.5 inline-flex h-10 w-10 items-center justify-center rounded-full text-gray-400 hover:text-gray-500"
                        onClick={() => mdRef.current?.trigger("unordered-list")}
                      >
                        <span className="sr-only">unordered list</span>
                        <FontAwesomeIcon icon={faListUl} />
                      </button>
                    </div>
                    <div className="flex items-center">
                      <button
                        type="button"
                        className="-m-2.5 inline-flex h-10 w-10 items-center justify-center rounded-full text-gray-400 hover:text-gray-500"
                        onClick={() => mdRef.current?.trigger("code")}
                      >
                        <span className="sr-only">Code</span>
                        <FontAwesomeIcon icon={faCode} />
                      </button>
                    </div>
                  </div>
                ) : null}
              </Tab.List>
              <Tab.Panels className="mt-2">
                <Tab.Panel className="-m-0.5 rounded-lg p-0.5">
                  <label htmlFor={name} className="sr-only">
                    {label}
                  </label>
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
                  <div className="border-b">
                    <div className="mx-px mt-px px-3 pt-2 pb-12 text-sm leading-5 text-gray-800">
                      Preview content will render here.
                    </div>
                  </div>
                </Tab.Panel>
              </Tab.Panels>
            </>
          )}
        </Tab.Group>

        <ErrorMessage name={name}>
          {(msg) => (
            <div role="alert" style={{ color: "red" }}>
              {msg}
            </div>
          )}
        </ErrorMessage>
      </div>
    )
  }
)

export default MarkdownField
