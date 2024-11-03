import Prism from "prismjs"
import { Text } from "slate"

import type { NodeEntry, Path, Range } from "slate"

export function createInlineRegex(pattern: string) {
  pattern = pattern.replace(
    /<inner>/g,
    /(?:\\.|[^\\]|(?:\n|\r\n?)(?![\r\n]))/.source,
  )

  return RegExp(/((?:^|[^\\])(?:\\{2})*)/.source + "(?:" + pattern + ")")
}

export function createDecorator(grammar: Record<string, Prism.TokenObject>) {
  Prism.languages.custom = grammar

  Object.keys(grammar).forEach((t, _, array) => {
    array.forEach((i) => {
      if (t === i) return

      const lang = Prism.languages.custom as typeof grammar
      const token = t as keyof Prism.Grammar
      const inside = i as keyof Prism.Grammar

      if (
        lang[token]?.inside &&
        "content" in lang[token].inside &&
        typeof lang[token].inside.content === "object" &&
        "inside" in lang[token].inside.content &&
        typeof lang[token].inside.content.inside === "object"
      ) {
        lang[token].inside.content.inside[inside] = lang[inside]!
      }
    })
  })

  const decorate = (entry: NodeEntry): Range[] => {
    const [node, path] = entry

    const ranges: Range[] = []

    if (!Text.isText(node)) {
      return ranges
    }

    const getLength = (token: string | Prism.Token): number => {
      if (typeof token === "string") {
        return token.length
      } else if (typeof token.content === "string") {
        return token.content.length
      } else if (Array.isArray(token.content)) {
        return token.content.reduce(
          (l: number, t: string | Prism.Token) => l + getLength(t),
          0,
        )
      } else {
        return 0
      }
    }

    const processToken = (
      token: string | Prism.Token,
      start: number,
      path: Path,
    ): number => {
      const length = getLength(token)
      const end = start + length

      if (typeof token !== "string") {
        ranges.push({
          [token.type]: true,
          anchor: { path, offset: start },
          focus: { path, offset: end },
        })

        if (Array.isArray(token.content)) {
          let nestedStart = start
          for (const nestedToken of token.content) {
            nestedStart = processToken(nestedToken, nestedStart, path)
          }
        }
      }

      return end
    }

    const tokens = Prism.tokenize(node.text, Prism.languages.custom!)

    let start = 0
    for (const token of tokens) {
      start = processToken(token, start, path)
    }

    return ranges
  }

  return decorate
}

export const decorateEntry = createDecorator({
  h1: {
    // # title 1
    pattern: /(^\s*)# .+/m,
    lookbehind: true,
    inside: {
      punctuation: /^#+|#+$/,
    },
  },
  h2: {
    // ## title 2
    pattern: /(^\s*)## .+/m,
    lookbehind: true,
    inside: {
      punctuation: /^#+|#+$/,
    },
  },
  h3: {
    // ### title 3
    pattern: /(^\s*)### .+/m,
    lookbehind: true,
    inside: {
      punctuation: /^#+|#+$/,
    },
  },
  subtext: {
    // -# subtext
    pattern: /(^\s*)-# .+/m,
    lookbehind: true,
    alias: "subtext",
    inside: {
      punctuation: /^-#/,
    },
  },
  bold: {
    // **strong**
    pattern: createInlineRegex(
      /\*\*(?:(?!\*)<inner>|\*(?:(?!\*)<inner>)+\*)+\*\*/.source,
    ),
    lookbehind: true,
    greedy: true,
    inside: {
      content: {
        pattern: /(^\*\*)[\s\S]+(?=\*\*$)/,
        lookbehind: true,
        inside: {},
      },
      punctuation: /\*\*/,
    },
  },
  italic: {
    // *em*
    // _em_
    // allow one nested instance of italic text using the same delimiter
    pattern: createInlineRegex(
      /\b_(?:(?!_)<inner>|__(?:(?!_)<inner>)+__)+_\b|\*(?:(?!\*)<inner>|\*\*(?:(?!\*)<inner>)+\*\*)+\*/
        .source,
    ),
    lookbehind: true,
    greedy: true,
    inside: {
      content: {
        pattern: /(^.)[\s\S]+(?=.$)/,
        lookbehind: true,
        inside: {},
      },
      punctuation: /[*_]/,
    },
  },
  strike: {
    // ~~strike through~~
    pattern: createInlineRegex(
      /~~(?:(?!~)<inner>|~(?:(?!~)<inner>)+~)+~~/.source,
    ),
    lookbehind: true,
    greedy: true,
    inside: {
      content: {
        pattern: /(^~~)[\s\S]+(?=~~$)/,
        lookbehind: true,
        inside: {},
      },
      punctuation: /~~/,
    },
  },
  underline: {
    // __underline__
    pattern: createInlineRegex(
      /__(?:(?!_)<inner>|_(?:(?!_)<inner>)+_)+__/.source,
    ),
    lookbehind: true,
    greedy: true,
    inside: {
      content: {
        pattern: /(^__)[\s\S]+(?=__$)/,
        lookbehind: true,
        inside: {},
      },
      punctuation: /__/,
    },
  },
  spoiler: {
    // ||spoiler||
    pattern: createInlineRegex(
      /(?:\|\|)(?:(?!\|)<inner>|\|\|(?:(?!\|)<inner>)+\|\|)+(?:\|\|)/.source,
    ),
    lookbehind: true,
    greedy: true,
    inside: {
      content: {
        pattern: /(^\|\|)[\s\S]+(?=\|\|$)/,
        lookbehind: true,
        inside: {},
      },
      punctuation: /\|\|/,
    },
  },
  code: {
    // `code`
    pattern: createInlineRegex(/`(?:[^`\\\r\n]|\\.)+`/.source),
    lookbehind: true,
    greedy: true,
    inside: {
      content: {
        pattern: /(^`)[\s\S]+(?=`$)/m,
        lookbehind: true,
      },
      punctuation: /`/,
    },
  },
  codeblock: {
    // ```codeblock```
    pattern: createInlineRegex(/```[\s\S]*?```/.source),
    lookbehind: true,
    greedy: true,
    inside: {
      content: {
        pattern: /(^```)[\s\S]+(?=```$)/m,
        lookbehind: true,
      },
      punctuation: /```/,
    },
  },
})
