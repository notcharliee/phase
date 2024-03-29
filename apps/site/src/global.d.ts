/* eslint-disable @typescript-eslint/no-explicit-any */

type Nullable<T> = T | null

type UnionToIntersection<U> = 
  (U extends any ? (x: U)=>void : never) extends ((x: infer I)=>void) ? I : never
