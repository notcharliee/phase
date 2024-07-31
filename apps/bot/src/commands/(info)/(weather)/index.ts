import { BotCommandBuilder } from "phasebot/builders"

import { BotError } from "~/lib/errors"

import { generateWeatherCard } from "~/images/weather"
import { getLocationData, getWeatherData } from "./_utils"

import type { Units } from "./_utils"

export default new BotCommandBuilder()
  .setName("weather")
  .setDescription("Gives you info about the weather.")
  .setDMPermission(false)
  .addStringOption((option) =>
    option
      .setName("location")
      .setDescription("The town/city you want to get the weather for.")
      .setRequired(true),
  )
  .addStringOption((option) =>
    option
      .setName("units")
      .setDescription("The units you want to use (defaults to metric).")
      .setChoices(
        { name: "Metric", value: "metric" },
        { name: "Imperial", value: "imperial" },
      )
      .setRequired(false),
  )
  .setExecute(async (interaction) => {
    await interaction.deferReply()

    const location = interaction.options.getString("location", true)
    const units = (interaction.options.getString("units") ?? "metric") as Units

    const locationData = await getLocationData(location)

    if (!locationData) {
      void interaction.editReply(
        new BotError(
          "Could not find a town or city by that name. Make sure you typed it in correctly and try again.",
        ).toJSON(),
      )

      return
    }

    const weatherData = await getWeatherData({
      locationData: locationData[0],
      units,
    })

    const weatherCard = await generateWeatherCard(weatherData).toAttachment()

    void interaction.editReply({
      files: [weatherCard],
    })
  })
