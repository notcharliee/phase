#!/usr/bin/env node

const args = process.argv.slice(2);

if (args.length !== 1) {
  console.log(`Error: No command specified.`)
  process.exit()
}

const command = args[0]

switch (command) {

  case 'dotenv': require('./dotenv.js'); break;

  default: {
    console.log(`Error: "utils ${command}" is not a valid command.`)
    process.exit()
  }

}
