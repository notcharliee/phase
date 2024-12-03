import type {
  ThemeBackground,
  ThemeButtons,
  ThemeColours,
  ThemeFont,
  ThemeId,
} from "~/types/theme"

export class Theme {
  public readonly id: ThemeId
  public readonly background: ThemeBackground
  public readonly buttons: ThemeButtons
  public readonly colours: ThemeColours
  public readonly font: ThemeFont

  constructor(params: {
    id: ThemeId
    background: ThemeBackground
    buttons: ThemeButtons
    colours: ThemeColours
    font: ThemeFont
  }) {
    this.id = params.id
    this.background = params.background
    this.buttons = params.buttons
    this.colours = params.colours
    this.font = params.font
  }

  static isTheme(theme: unknown): theme is Theme {
    return theme instanceof Theme
  }

  static isThemeId(id: unknown): id is ThemeId {
    return typeof id === "string" && /^\w+-\w+-\w+-\w+-\w+$/.test(id)
  }
}
