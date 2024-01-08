"use client"

import { CopyIcon } from "@radix-ui/react-icons"

import { toast } from "sonner"

import { Button } from "@/components/ui/button"

export const Clipboard = (props: { content: string }) => (
  <Button variant={"outline"} className="w-full max-w-[256px] text-muted-foreground flex justify-between" onClick={() => {
    toast("Copied to clipboard.", {
      description: (
        <span>Copied <code className="rounded-md border border-border px-1 py-0.5 text-foreground">{props.content}</code> to your clipboard.</span>
      ),
    })
    
    navigator.clipboard.writeText(props.content)
  }}>
    {props.content} <CopyIcon className="h-4 w-4" />
  </Button>
)