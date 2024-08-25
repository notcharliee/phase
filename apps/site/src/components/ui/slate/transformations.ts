import { Editor, Node, Text, Transforms } from "slate"

import type { GuildData } from "."
import type { Element, Path } from "slate"
import type { ReactEditor } from "slate-react"

export function applyTransformations(editor: ReactEditor, guildData: GuildData) {
  const applyTransformation = (path: Path) => {
    const node = Node.get(editor, path)

    if (node && Text.isText(node)) {
      const regex =
        /(?<!\\)<@!?(\d+)>|(?<!\\)<@&(\d+)>|(?<!\\)@(everyone|here)|(?<!\\)<#(\d+)>/g

      let match

      while ((match = regex.exec(node.text)) !== null) {
        const matchedText = match[0]
        const matchIndex = match.index
        const id = match[1]!

        const matchedTextRange = {
          anchor: { path, offset: matchIndex },
          focus: { path, offset: matchIndex + matchedText.length },
        }

        let element: Element

        if (matchedText.startsWith("<#")) {
          const channel = guildData.channels.find((ch) => ch.id === id)

          element = {
            type: "channel",
            children: [{ text: "" }],
            data: {
              id,
              name: channel?.name ?? "unknown",
              type: channel?.type ?? 0,
            },
          }
        } else if (matchedText.startsWith("@")) {
          const mention = matchedText === "@everyone" ? "everyone" : "here"

          element = {
            type: "mention",
            children: [{ text: "" }],
            data: {
              id,
              name: mention,
              type: mention,
              colour: "#f8f8f8",
            },
          }
        } else if (matchedText.startsWith("<@&")) {
          const role = guildData.roles.find((role) => role.id === id)

          element = {
            type: "mention",
            children: [{ text: "" }],
            data: {
              id,
              name: role?.name ?? "unknown",
              colour: role?.color ? `#${role.color.toString(16)}` : "#f8f8f8",
              type: "role",
            },
          }
        } else {
          element = {
            type: "mention",
            children: [{ text: "" }],
            data: {
              id,
              name: "user",
              type: "user",
              colour: "#f8f8f8",
            },
          }
        }

        const nodeAfter = Editor.after(editor, matchedTextRange)

        Transforms.delete(editor, {
          at: matchedTextRange,
        })

        Transforms.insertNodes(editor, element, {
          at: { path, offset: matchIndex },
        })

        if (!nodeAfter) {
          Transforms.move(editor, { distance: 2, unit: "offset" })
        }
      }
    }
  }

  // traverse the entire document
  const traverseNodes = (currentPath: Path) => {
    const node = Node.get(editor, currentPath)

    if (Text.isText(node)) {
      applyTransformation(currentPath)
    } else {
      for (const [, childPath] of Node.children(editor, currentPath)) {
        traverseNodes(childPath)
      }
    }
  }

  traverseNodes([])
}
