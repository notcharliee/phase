import Prism from "prismjs"
import { Text } from "slate"

import type { NodeEntry, Path, Range } from "slate"

function createInline(pattern: string) {
  pattern = pattern.replace(
    /<inner>/g,
    /(?:\\.|[^\\]|(?:\n|\r\n?)(?![\r\n]))/.source,
  )

  return RegExp(/((?:^|[^\\])(?:\\{2})*)/.source + "(?:" + pattern + ")")
}

const customGrammar = {
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
    pattern: createInline(
      /\*\*(?:(?!\*)<inner>|\*(?:(?!\*)<inner>)+\*)+\*\*/.source,
    ),
    lookbehind: true,
    greedy: true,
    inside: {
      content: {
        pattern: /(^\*\*)[\s\S]+(?=\*\*$)/,
        lookbehind: true,
        inside: {}, // see below
      },
      punctuation: /\*\*/,
    },
  },
  italic: {
    // *em*
    // _em_
    // allow one nested instance of italic text using the same delimiter
    pattern: createInline(
      /\b_(?:(?!_)<inner>|__(?:(?!_)<inner>)+__)+_\b|\*(?:(?!\*)<inner>|\*\*(?:(?!\*)<inner>)+\*\*)+\*/
        .source,
    ),
    lookbehind: true,
    greedy: true,
    inside: {
      content: {
        pattern: /(^.)[\s\S]+(?=.$)/,
        lookbehind: true,
        inside: {}, // see below
      },
      punctuation: /[*_]/,
    },
  },
  strike: {
    // ~~strike through~~
    pattern: createInline(/~~(?:(?!~)<inner>|~(?:(?!~)<inner>)+~)+~~/.source),
    lookbehind: true,
    greedy: true,
    inside: {
      content: {
        pattern: /(^~~)[\s\S]+(?=~~$)/,
        lookbehind: true,
        inside: {}, // see below
      },
      punctuation: /~~/,
    },
  },
  underline: {
    // __underline__
    pattern: createInline(/__(?:(?!_)<inner>|_(?:(?!_)<inner>)+_)+__/.source),
    lookbehind: true,
    greedy: true,
    inside: {
      content: {
        pattern: /(^__)[\s\S]+(?=__$)/,
        lookbehind: true,
        inside: {}, // see below
      },
      punctuation: /__/,
    },
  },
  spoiler: {
    // ||spoiler||
    pattern: createInline(
      /(?:\|\|)(?:(?!\|)<inner>|\|\|(?:(?!\|)<inner>)+\|\|)+(?:\|\|)/.source,
    ),
    lookbehind: true,
    greedy: true,
    inside: {
      content: {
        pattern: /(^\|\|)[\s\S]+(?=\|\|$)/,
        lookbehind: true,
        inside: {}, // see below
      },
      punctuation: /\|\|/,
    },
  },
  code: {
    // `code`
    pattern: createInline(/`(?:[^`\\\r\n]|\\.)+`/.source),
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
    pattern: createInline(/```[\s\S]*?```/.source),
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
} as const satisfies Record<string, Prism.TokenObject>

Prism.languages.custom = customGrammar

Object.keys(customGrammar).forEach((t, _, array) => {
  array.forEach((i) => {
    if (t === i) return

    const lang = Prism.languages.custom as typeof customGrammar
    const token = t as keyof typeof lang
    const inside = i as keyof typeof lang

    if (
      "content" in lang[token].inside &&
      "inside" in lang[token].inside.content
    ) {
      ;(
        lang[token].inside.content.inside as Record<
          typeof token,
          (typeof lang)[typeof token]
        >
      )[inside] = lang[inside]
    }
  })
})

export function decorateEntry(entry: NodeEntry): Range[] {
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
