import { BotCommandBuilder } from "phasebot/builders"

import { fetchWeatherApi } from "openmeteo"

import { BotError } from "~/lib/errors"

import { generateWeatherCard } from "~/images/weather"

import type { SnakeToCamel } from "~/types/utils"

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
      locationData: locationData[0]!,
      units,
    })

    const weatherCard = await generateWeatherCard(weatherData).toAttachment()

    void interaction.editReply({
      files: [weatherCard],
    })
  })

interface LocationData {
  id: number
  name: string
  latitude: number
  longitude: number
  elevation: number
  feature_code: string
  country_code: string
  country: string
  country_id: number
  population: number
  postcodes: string[]
  admin1: string
  admin2?: string
  admin3?: string
  admin4?: string
  admin1_id: number
  admin2_id?: number
  admin3_id?: number
  admin4_id?: number
  timezone: string
}

type Units = "metric" | "imperial"

async function getLocationData(location: string) {
  const url = new URL("https://geocoding-api.open-meteo.com/v1/search")

  url.searchParams.set("name", location)
  url.searchParams.set("count", "5")
  url.searchParams.set("language", "en")
  url.searchParams.set("format", "json")

  const response = await fetch(url.toString()).catch(() => null)
  const data = (await response?.json().catch(() => null)) as
    | { error: true }
    | { results?: LocationData[] }
    | null

  if (!data || "error" in data || !data.results?.length) return null

  return data.results
}

const getWeatherCodeDescription = (code: number) => {
  const WeatherCodes = {
    "0": "Clear sky",
    "1": "Mainly clear",
    "2": "Partly cloudy",
    "3": "Overcast",
    "45": "Fog",
    "48": "Rime fog",
    "51": "Light drizzle",
    "53": "Moderate drizzle",
    "55": "Heavy drizzle",
    "56": "Light freezing drizzle",
    "57": "Heavy freezing drizzle",
    "61": "Light rain",
    "63": "Moderate rain",
    "65": "Heavy rain",
    "66": "Light freezing rain",
    "67": "Heavy freezing rain",
    "71": "Light snow",
    "73": "Moderate snow",
    "75": "Heavy snow",
    "77": "Snow grains",
    "80": "Light rain showers",
    "81": "Moderate rain showers",
    "82": "Heavy rain showers",
    "85": "Light snow showers",
    "86": "Heavy snow showers",
    "95": "Thunderstorm",
    "96": "Thunderstorm, light hail",
    "99": "Thunderstorm, heavy hail",
  } as const

  return WeatherCodes[("" + code) as keyof typeof WeatherCodes]
}

const getUVIndexDescription = (index: number) => {
  index = Math.round(index)

  if (index < 2) return "Low"
  if (index < 5) return "Moderate"
  if (index < 7) return "High"
  if (index < 10) return "Very High"

  return "Extreme"
}

const getVisibilityDescription = (distance: number) => {
  if (distance < 1_000) return "Very Poor"
  if (distance < 4_000) return "Poor"
  if (distance < 10_000) return "Moderate"
  if (distance < 20_000) return "Good"
  if (distance < 40_000) return "Very Good"

  return "Excellent"
}

export async function getWeatherData({
  locationData,
  units,
}: {
  locationData: LocationData
  units: Units
}) {
  const params = {
    longitude: locationData.longitude,
    latitude: locationData.latitude,
    temperature_unit: units === "metric" ? "celsius" : "fahrenheit",
    wind_speed_unit: units === "metric" ? "kmh" : "mph",
    precipitation_unit: units === "metric" ? "mm" : "inch",
    timezone: "auto",
    daily: [
      "weather_code",
      "temperature_2m_max",
      "temperature_2m_min",
      "uv_index_max",
    ] as const,
    hourly: [
      "temperature_2m",
      "relative_humidity_2m",
      "dew_point_2m",
      "apparent_temperature",
      "precipitation",
      "visibility",
    ] as const,
  }

  const responses = await fetchWeatherApi(
    "https://api.open-meteo.com/v1/forecast",
    params,
  )

  const dailyWeatherVariables = (() => {
    const daily = responses[0]!.daily()!

    return Array.from({ length: daily.variablesLength() }).map(
      (_, i) => daily.variables(i)!.valuesArray()!,
    )
  })()

  const hourlyWeatherVariables = (() => {
    const hourly = responses[0]!.hourly()!

    return Array.from({ length: hourly.variablesLength() }).map(
      (_, i) => hourly.variables(i)!.valuesArray()!,
    )
  })()

  const weatherData = {
    daily: Array.from({ length: 7 }).map((_, fi) => ({
      date: new Date(Date.now() + fi * 1000 * 60 * 60 * 24),
      ...(Object.fromEntries(
        params.daily.map((v, vi) => [
          v.replace(/(_\w)/g, (match) => match[1]!.toUpperCase()),
          dailyWeatherVariables[vi]![fi],
        ]),
      ) as {
        [k in SnakeToCamel<
          (typeof params.daily)[number]
        >]: (typeof dailyWeatherVariables)[number][number]
      }),
    })),
    hourly: Array.from({ length: 24 }).map((_, fi) => ({
      date: new Date(Date.now() + fi * 1000 * 60 * 60 * 24),
      ...(Object.fromEntries(
        params.hourly.map((v, vi) => [
          v.replace(/(_\w)/g, (match) => match[1]!.toUpperCase()),
          hourlyWeatherVariables[vi]![fi],
        ]),
      ) as {
        [k in SnakeToCamel<
          (typeof params.hourly)[number]
        >]: (typeof hourlyWeatherVariables)[number][number]
      }),
    })),
  }

  return {
    units,
    location: {
      name: locationData.name,
      admin: locationData.admin1,
      country: locationData.country,
    },
    current: {
      temperature: {
        actual: Math.round(weatherData.hourly[0]!.temperature2m),
        feelsLike: Math.round(weatherData.hourly[0]!.apparentTemperature),
      },
      humidity: Math.round(weatherData.hourly[0]!.relativeHumidity2m),
      dewpoint: Math.round(weatherData.hourly[0]!.dewPoint2m),
      precipitation: Math.round(
        weatherData.hourly.reduce((acc, hour) => acc + hour.precipitation, 0),
      ),
      uvRadiation: {
        index: Math.round(weatherData.daily[0]!.uvIndexMax),
        description: getUVIndexDescription(weatherData.daily[0]!.uvIndexMax),
      },
      visibility: {
        distance: Math.floor(
          weatherData.hourly[0]!.visibility /
            (units === "metric" ? 1000 : 1609.344),
        ),
        description: getVisibilityDescription(
          weatherData.hourly[0]!.visibility,
        ),
      },
    },
    forecast: weatherData.daily.map(
      ({ date, temperature2mMax, temperature2mMin, weatherCode }) => ({
        day: date.getDay(),
        weather: getWeatherCodeDescription(weatherCode),
        temperature: {
          min: Math.round(temperature2mMin),
          max: Math.round(temperature2mMax),
        },
      }),
    ),
  }
}
