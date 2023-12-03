import * as Discord from 'discord.js'
import * as Utils from '@repo/utils/bot'
import * as Schemas from '@repo/utils/schemas'


export default Utils.Functions.clientSlashCommand({
  data: new Discord.SlashCommandBuilder()
    .setName('dadjoke')
    .setDescription('Finds a "funny" dad joke.'),
  async execute(client, interaction) {

    const jokes = [
      "Why don't scientists trust atoms? Because they make up everything.",
      "I'm reading a book on anti-gravity. It's impossible to put down!",
      "I'm reading a book on the history of glue. I just can't seem to put it down!",
      "I'm on a whiskey diet. I've lost three days already!",
      "Why don't eggs tell jokes? Because they'd crack each other up!",
      "I'm trying to organize a hide and seek tournament, but it's really hard to find good players.",
      "I told my wife she was drawing her eyebrows too high. She looked surprised.",
      "I told my wife she was only getting older and wiser. She asked me when I was going to start.",
      "What do you call a fake noodle? An impasta.",
      "Why did the scarecrow win an award? Because he was outstanding in his field!",
      "Why don't skeletons fight each other? They don't have the guts.",
      "I used to play piano by ear, but now I use my hands.",
      "Why did the tomato turn red? Because it saw the salad dressing!",
      "I'm reading a book about teleportation. It's bound to get me somewhere.",
      "Why don't oysters share their pearls? Because they're shellfish.",
      "Why did the math book look so sad? Because it had too many problems.",
      "What do you get when you cross a snowman and a shark? Frostbite.",
      "I don't always tell dad jokes, but when I do, he laughs.",
      "Why don't scientists trust atoms? Because they make up everything.",
      "I don't trust people who do acupuncture. They're back stabbers.",
      "Why was the computer cold? It left its Windows open.",
      "I don't trust stairs. They're always up to something.",
      "Why did the hipster burn his tongue? He drank his coffee before it was cool.",
      "Why don't scientists trust atoms? Because they make up everything.",
      "Why do bees hum? Because they don't know the words.",
      "I don't like going to funerals. They're always dead boring.",
      "Why don't eggs like jokes? Because they might crack up!",
      "I just quit my job at the helium factory. I refuse to be spoken to in that tone!",
      "Why was the belt arrested? For holding up pants!",
      "I told my wife she was drawing her eyebrows too high. She looked surprised.",
      "Why did the invisible man turn down the job offer? He couldn't see himself doing it.",
      "What did the janitor say when he jumped out of the closet? 'Supplies!'",
      "I used to play piano by ear, but now I use my hands.",
      "Why do we tell actors to 'break a leg?' Because every play has a cast.",
      "I'm reading a book on the history of glue. I just can't seem to put it down!",
      "I told my wife she was only getting older and wiser. She asked me when I was going to start.",
      "What's the difference between a poorly dressed man on a trampoline and a well-dressed man on a trampoline? Attire.",
      "Why was the math book sad? Because it had too many problems.",
      "I'm trying to organize a hide and seek tournament, but it's really hard to find good players.",
      "Why did the bicycle fall over? Because it was two-tired.",
      "Why don't scientists trust atoms? Because they make up everything.",
      "I told my wife she was drawing her eyebrows too high. She looked surprised.",
      "Why don't skeletons fight each other? They don't have the guts.",
      "Why don't oysters share their pearls? Because they're shellfish.",
      "What do you call fake spaghetti? An impasta.",
      "I don't always tell dad jokes, but when I do, he laughs.",
      "Why do you never see elephants hiding in trees? Because they're really good at it!",
      "I'm reading a book about teleportation. It's bound to get me somewhere.",
      "Why do we tell actors to 'break a leg?' Because every play has a cast.",
      "I'm reading a book on anti-gravity. It's impossible to put down!",
      "Why did the scarecrow win an award? Because he was outstanding in his field!",
      "Why did the tomato turn red? Because it saw the salad dressing!",
      "I'm on a whiskey diet. I've lost three days already!",
      "What do you call a fake noodle? An impasta.",
      "I don't trust people who do acupuncture. They're back stabbers.",
      "Why was the computer cold? It left its Windows open.",
      "I don't trust stairs. They're always up to something.",
      "Why did the hipster burn his tongue? He drank his coffee before it was cool.",
      "Why do bees hum? Because they don't know the words.",
      "I don't like going to funerals. They're always dead boring.",
      "Why don't eggs like jokes? Because they might crack up!",
      "Why was the belt arrested? For holding up pants!",
      "I told my wife she was drawing her eyebrows too high. She looked surprised.",
      "Why did the invisible man turn down the job offer? He couldn't see himself doing it.",
      "What's the best time to go to the dentist? Tooth-hurty.",
      "Why do cows wear bells? Because their horns don't work.",
      "What did the grape say when it got stepped on? Nothing, it just let out a little wine.",
      "Why did the coffee file a police report? It got mugged.",
      "Why did the golfer bring two pairs of pants? In case he got a hole in one.",
      "Why did the cookie go to the doctor? Because it was feeling crumbly.",
      "Why do birds fly south for the winter? Because it's too far to walk.",
      "I'm reading a book on the history of glue. I just can't seem to put it down!",
      "Why did the scarecrow win an award? Because he was outstanding in his field!",
      "I'm trying to organize a hide and seek tournament, but it's really hard to find good players.",
      "Why don't scientists trust atoms? Because they make up everything.",
      "I told my wife she was only getting older and wiser. She asked me when I was going to start.",
      "Why don't skeletons fight each other? They don't have the guts.",
      "Why don't oysters share their pearls? Because they're shellfish.",
      "What do you call fake spaghetti? An impasta.",
      "I don't always tell dad jokes, but when I do, he laughs.",
      "Why do you never see elephants hiding in trees? Because they're really good at it!",
      "I'm reading a book about teleportation. It's bound to get me somewhere.",
      "Why do we tell actors to 'break a leg?' Because every play has a cast.",
      "I'm reading a book on anti-gravity. It's impossible to put down!",
      "Why did the tomato turn red? Because it saw the salad dressing!",
      "Why was the math book sad? Because it had too many problems.",
      "Why did the bicycle fall over? Because it was two-tired.",
      "What's the difference between a poorly dressed man on a trampoline and a well-dressed man on a trampoline? Attire.",
      "Why was the computer cold? It left its Windows open.",
      "I don't trust stairs. They're always up to something.",
      "Why did the hipster burn his tongue? He drank his coffee before it was cool.",
      "Why do bees hum? Because they don't know the words.",
      "I don't like going to funerals. They're always dead boring.",
      "Why don't eggs like jokes? Because they might crack up!",
      "Why was the belt arrested? For holding up pants!",
      "I told my wife she was drawing her eyebrows too high. She looked surprised.",
      "Why did the invisible man turn down the job offer? He couldn't see himself doing it.",
      "What's the best time to go to the dentist? Tooth-hurty.",
      "Why do cows wear bells? Because their horns don't work.",
      "What did the grape say when it got stepped on? Nothing, it just let out a little wine.",
      "Why did the coffee file a police report? It got mugged.",
      "Why did the golfer bring two pairs of pants? In case he got a hole in one.",
      "Why did the cookie go to the doctor? Because it was feeling crumbly.",
      "Why do birds fly south for the winter? Because it's too far to walk.",
      "Why don't scientists trust atoms? Because they make up everything!",
      "I'm reading a book on the history of glue. I just can't seem to put it down!",
      "I'm trying to start a band called '1023MB'. We haven't got a gig yet.",
      "Why did the scarecrow win an award? Because he was outstanding in his field!",
      "Why do seagulls fly over the sea? Because if they flew over the bay, they would be bagels.",
      "I'm trying to organize a hide and seek tournament, but it's really hard to find good players.",
      "Why don't skeletons fight each other? They don't have the guts!",
      "Why don't oysters share their pearls? Because they're shellfish!",
      "What do you call a group of cows playing instruments? A moo-sical band!",
      "Why don't scientists trust atoms? Because they make up everything!",
      "Why don't scientists trust atoms? Because they make up everything!",
      "What do you call an alligator in a vest? An investigator!",
      "Why don't ants get sick? They have tiny ant-bodies!",
      "Why did the tomato turn red? Because it saw the salad dressing!",
      "What do you call a man with a rubber toe? Roberto!",
      "I'm reading a book on anti-gravity. It's impossible to put down!",
      "I told my wife she was drawing her eyebrows too high. She looked surprised.",
      "Why was the math book sad? Because it had too many problems.",
      "Why did the scarecrow win an award? Because he was outstanding in his field!",
      "Why don't eggs like jokes? Because they might crack up!",
      "Why was the computer cold? It left its Windows open!",
      "What do you call a person who tells dad jokes but isn't a dad? A faux-pa!",
      "I don't trust people that do acupuncture. They're back stabbers.",
      "I'm trying to start a new business selling glasses for people who don't need them. I call it 'Focals Point.'",
      "Why don't scientists trust atoms? Because they make up everything!",
      "Why don't dinosaurs drive cars? Because they're extinct!",
      "Why don't crabs give to charity? Because they're shellfish!",
      "Why don't mummies take time off? They're afraid to unwind!",
      "Why don't ghosts use elevators? They lift their spirits instead!",
      "Why don't lions play poker in the jungle? Too many cheetahs!",
    ]

    interaction.reply(jokes[Math.floor(Math.random() * jokes.length)])

  }
})