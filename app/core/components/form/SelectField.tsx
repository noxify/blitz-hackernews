import { forwardRef, Fragment, PropsWithoutRef } from "react"
import { useField, useFormikContext, ErrorMessage } from "formik"
import { CheckIcon, ChevronUpDownIcon as SelectorIcon } from "@heroicons/react/24/outline"
import classNames from "classnames"
import { Listbox, Transition } from "@headlessui/react"

export interface SelectFieldProps extends PropsWithoutRef<JSX.IntrinsicElements["select"]> {
  /** Field name. */
  name: string
  /** Field label. */
  label: string
  options: {
    value: string
    label: string
  }[]
  /** Field type. Doesn't include radio buttons and checkboxes */
  outerProps?: PropsWithoutRef<JSX.IntrinsicElements["div"]>
}

export const SelectField = forwardRef<HTMLInputElement, SelectFieldProps>(
  ({ name, label, options, outerProps, ...props }, ref) => {
    const [input, meta, { setValue }] = useField(name)
    const { isSubmitting, isValid, values } = useFormikContext()

    const value = input.value || props.defaultValue || null
    const selected = options.find((option) => option.value == value)
    // @ts-ignore
    return (
      <div>
        <Listbox value={value} onChange={(val) => setValue(val)}>
          {({ open }) => (
            <>
              <Listbox.Label className="block text-sm font-medium text-gray-700">
                {label}
              </Listbox.Label>
              <div className="mt-1 relative">
                <Listbox.Button className="bg-white relative w-full border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:border-gray-300 sm:text-sm">
                  <span className="block truncate">{selected?.label || "Please select"}</span>
                  <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                    <SelectorIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                  </span>
                </Listbox.Button>

                <Transition
                  show={open}
                  as={Fragment}
                  leave="transition ease-in duration-100"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <Listbox.Options className="list-none absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
                    {options.map((option, idx) => (
                      <Listbox.Option
                        key={`${name}-${idx}`}
                        className={({ active }) =>
                          classNames(
                            active ? "text-white bg-orange-500" : "text-gray-900",
                            "cursor-default select-none relative py-2 pl-3 pr-9"
                          )
                        }
                        value={option.value}
                      >
                        {({ selected, active }) => (
                          <>
                            <span
                              className={classNames(
                                selected ? "font-semibold" : "font-normal",
                                "block truncate"
                              )}
                            >
                              {option.label}
                            </span>

                            {selected ? (
                              <span
                                className={classNames(
                                  active ? "text-white" : "text-orange-500",
                                  "absolute inset-y-0 right-0 flex items-center pr-4"
                                )}
                              >
                                <CheckIcon className="h-5 w-5" aria-hidden="true" />
                              </span>
                            ) : null}
                          </>
                        )}
                      </Listbox.Option>
                    ))}
                  </Listbox.Options>
                </Transition>
              </div>
            </>
          )}
        </Listbox>

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

export default SelectField
