export interface WordData {
  word: string
  phonetic?: string
  phonetics: {
    text?: string
    audio?: string
  }[]
  origin?: string
  meanings: {
    partOfSpeech: string
    definitions: {
      definition: string
      example?: string
      synonyms: string[]
      antonyms: string[]
    }[]
  }[]
  sourceUrls: string[]
}

export type WordDataArray = [WordData, ...WordData[]]

export async function askDictionary(
  word: string,
): Promise<WordDataArray | null> {
  const baseApiUrl = "https://api.dictionaryapi.dev/api/v2/entries/en/"
  const fullApiUrl = baseApiUrl + encodeURIComponent(word)

  return await fetch(fullApiUrl)
    .then((res) => (res.ok ? (res.json() as Promise<WordDataArray>) : null))
    .catch(() => null)
}

export function getPhonetic(wordData: WordData) {
  const phonetic = wordData.phonetics.find(
    (p): p is Required<WordData["phonetics"][number]> =>
      !!p.text?.length && !!p.audio?.length,
  )

  return phonetic ?? null
}
