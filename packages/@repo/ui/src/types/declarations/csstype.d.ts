/* eslint-disable @typescript-eslint/consistent-indexed-object-style */

import type * as CSS from "csstype" // react depends on this

declare module "csstype" {
  // add css variable support
  interface Properties extends CSS.Properties {
    [key: `--${string}`]: string | number
  }
}
