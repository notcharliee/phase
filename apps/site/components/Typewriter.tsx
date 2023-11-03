'use client'

import * as React from 'react'

import TypewriterEffect from 'typewriter-effect'


export default function Typewriter ({ typeString }: { typeString: string }) {

  return <TypewriterEffect onInit={(typewriter) => { typewriter.typeString(typeString).start() }}></TypewriterEffect>

}