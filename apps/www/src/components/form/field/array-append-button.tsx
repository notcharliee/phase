import { Button } from "@repo/ui/button"
import { useFormFieldArrayContext } from "~/components/form/field/array"

export interface FormFieldArrayAppendButtonProps
  extends React.ComponentPropsWithRef<typeof Button> {
  label: string
  description?: string
  appendValue?: object | (() => object)
}

export function FormFieldArrayAppendButton({
  disabled,
  children,
  label,
  description,
  appendValue,
  ...props
}: FormFieldArrayAppendButtonProps) {
  const { maxLength, fields, append } = useFormFieldArrayContext()
  const isDisabled = disabled ?? !!(maxLength && fields.length >= maxLength)

  const onClick = () => {
    append(appendValue instanceof Function ? appendValue() : appendValue)
  }

  return (
    <Button
      type="button"
      variant="outline"
      disabled={isDisabled}
      aria-label={label}
      aria-description={description}
      onClick={onClick}
      {...props}
    >
      {children ?? label}
    </Button>
  )
}
