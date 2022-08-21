import { forwardRef, PropsWithoutRef } from "react"
import { useField, useFormikContext, ErrorMessage, FieldInputProps } from "formik"
import { ExclamationCircleIcon } from "@heroicons/react/outline"
import classNames from "classnames"

export interface LabeledTextFieldProps extends PropsWithoutRef<JSX.IntrinsicElements["input"]> {
  /** Field name. */
  name: string
  /** Field label. */
  label: string
  /** Field type. Doesn't include radio buttons and checkboxes */
  type?: "text" | "password" | "email" | "number"
  condition?: (values: any) => boolean
  outerProps?: PropsWithoutRef<JSX.IntrinsicElements["div"]>
}

export const LabeledTextField = forwardRef<HTMLInputElement, LabeledTextFieldProps>(
  ({ name, label, condition, outerProps, ...props }, ref) => {
    const [input, meta] = useField(name)
    const { isSubmitting, isValid, values } = useFormikContext()

    // @ts-ignore
    return (
      <div>
        <label htmlFor={input.name} className="block text-sm font-medium text-gray-700">
          {label}
        </label>
        <div className="mt-1 relative rounded-md shadow-sm">
          <input
            {...input}
            disabled={isSubmitting || (condition && condition(values))}
            {...props}
            ref={ref}
            className={classNames(
              meta.error
                ? " border-red-300 text-red-900 bg-dbred-100 placeholder-red-300  sm:text-sm rounded-md"
                : "",
              "block disabled:bg-gray-100 w-full text-base md:text-sm bg-white border border-gray-300 rounded shadow-sm focus:outline-none outline-none focus:ring-transparent focus:border-gray-300"
            )}
          />

          {meta.error ? (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <ExclamationCircleIcon className="h-5 w-5 text-red-500" aria-hidden="true" />
            </div>
          ) : null}
        </div>

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

export default LabeledTextField
