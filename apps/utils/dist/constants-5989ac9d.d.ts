declare const isDevEnv: boolean;
declare const keyPermissionsArray: string[];
declare const emojiRegex: RegExp;

declare const constants_emojiRegex: typeof emojiRegex;
declare const constants_isDevEnv: typeof isDevEnv;
declare const constants_keyPermissionsArray: typeof keyPermissionsArray;
declare namespace constants {
  export {
    constants_emojiRegex as emojiRegex,
    constants_isDevEnv as isDevEnv,
    constants_keyPermissionsArray as keyPermissionsArray,
  };
}

export { constants as c, emojiRegex as e, isDevEnv as i, keyPermissionsArray as k };
