"use client"

import { CopyIcon } from "@radix-ui/react-icons"

import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"


const copyToClipboard = (content: string, secret?: boolean) => {
  toast("Copied to clipboard.", {
    description: (
      <span>Copied <code className="rounded-md border border-border px-1 py-0.5 text-foreground">{secret ? content.replace(/./g, '*') : content}</code> to your clipboard.</span>
    ),
  })
  
  navigator.clipboard.writeText(content)
}


export const Clipboard = (props: { children: string, secret?: boolean }) => (
  <div className="flex items-center space-x-2">
    <Input
      className="text-muted-foreground pointer-events-none select-none"
      defaultValue={props.secret ? props.children.replace(/./g, '*') : props.children}
      readOnly
    />
    <Button type="submit" size="sm" className="px-3" onClick={() => copyToClipboard(props.children, props.secret)}>
      <span className="sr-only">Copy</span>
      <CopyIcon className="h-4 w-4" />
    </Button>
  </div>
)