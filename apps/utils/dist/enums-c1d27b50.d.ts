declare enum GameType {
    TicTacToe = "TICTACTOE"
}
declare enum PhaseColour {
    Failure = "#ED4245",
    GradientPrimary = "#8000FF",
    GradientSecondary = "#DB00FF",
    Primary = "#A400FF",
    Warning = "#FEE75C"
}
declare enum PhaseError {
    AccessDenied = "You do not have the required permissions to do this.",
    MemberNotFound = "Member not found. Make sure they are in this server, then try again.",
    Unknown = "Something went wrong, and we're not quite sure why. Please contact Phase Support to report it."
}
declare enum PhaseEmoji {
    Announce = "<:d_announce:1091003807690932295> ",
    Coffee = "<:f_coffee:1150717922524794930> ",
    Cross = "<:e_cross:1161925543529304075>",
    Naught = "<:e_naught:1161927252913700884>",
    Explode = "<:a_explode:1089925207088693248> ",
    Failure = "<:a_cross:1092852415855853600> ",
    Lock = "<:b_lock:1089925211211694151> ",
    Locked = "<:b_locked:1089925208552521838> ",
    Pin = "<:a_pin:1089926621974245496>",
    Success = "<:c_check:1092852414211706880> ",
    Tada = "<a:e_tada:1091006786221395968>",
    ZeroWidthJoiner = "\u200D"
}
declare enum PhaseURL {
    PhaseCoffee = "https://www.buymeacoffee.com/notcharliee",
    PhaseCommands = "https://phasebot.xyz/commands",
    PhaseModules = "https://phasebot.xyz/modules",
    PhaseSupport = "https://discord.gg/338tyqeg82"
}

type enums_GameType = GameType;
declare const enums_GameType: typeof GameType;
type enums_PhaseColour = PhaseColour;
declare const enums_PhaseColour: typeof PhaseColour;
type enums_PhaseEmoji = PhaseEmoji;
declare const enums_PhaseEmoji: typeof PhaseEmoji;
type enums_PhaseError = PhaseError;
declare const enums_PhaseError: typeof PhaseError;
type enums_PhaseURL = PhaseURL;
declare const enums_PhaseURL: typeof PhaseURL;
declare namespace enums {
  export {
    enums_GameType as GameType,
    enums_PhaseColour as PhaseColour,
    enums_PhaseEmoji as PhaseEmoji,
    enums_PhaseError as PhaseError,
    enums_PhaseURL as PhaseURL,
  };
}

export { GameType as G, PhaseColour as P, PhaseError as a, PhaseEmoji as b, PhaseURL as c, enums as e };
