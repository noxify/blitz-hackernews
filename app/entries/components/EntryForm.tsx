import { Form, FormProps } from "app/core/components/form/Form"
import { LabeledTextField } from "app/core/components/form/LabeledTextField"
import MarkdownField from "app/core/components/form/MarkdownField"
import SelectField from "app/core/components/form/SelectField"
import { z } from "zod"
export { FORM_ERROR } from "app/core/components/form/Form"

export function EntryForm<S extends z.ZodType<any, any>>(props: FormProps<S>) {
  return (
    <Form<S> {...props}>
      <SelectField
        name="type"
        label="Type"
        options={[
          { value: "general", label: "General" },
          { value: "ask", label: "Ask" },
          { value: "tell", label: "Tell" },
          { value: "show", label: "Show" },
        ]}
      />
      <LabeledTextField name="title" label="Title" placeholder="Title" type="text" />
      <LabeledTextField
        name="link"
        label="Link"
        placeholder="Link"
        type="text"
        condition={(values) => {
          return !["general", "show"].includes(values.type)
        }}
      />
      <MarkdownField name="content" label="Content" placeholder="" />
    </Form>
  )
}
