import * as React from "react"
import * as CheckboxPrimitive from "@radix-ui/react-checkbox"
import { CheckIcon } from "lucide-react"

import { cn } from "@/lib/utils"

function Checkbox({
  className,
  ...props
}: React.ComponentProps<typeof CheckboxPrimitive.Root>) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        "w-5 h-5 bg-white border-2 border-destructive border-solid rounded-sm flex items-center justify-center shrink-0 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      style={{
        borderColor: 'black',
        borderWidth: '1px',
        borderStyle: 'solid',
        backgroundColor: 'white',
      }}
      {...props}
    >
      <CheckboxPrimitive.Indicator className="text-black">
        <CheckIcon className="w-3.5 h-3.5" strokeWidth={3} />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
}

export { Checkbox }
