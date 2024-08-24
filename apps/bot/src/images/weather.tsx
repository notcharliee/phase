import { ImageBuilder } from "phasebot/builders"

import { tw } from "~/lib/tw"
import { getDayName } from "~/lib/utils"

import geistBold from "./fonts/geist-bold.otf"
import geistMedium from "./fonts/geist-medium.otf"

import type { getWeatherData } from "~/commands/(info)/weather"

interface WeatherCardProps extends Awaited<ReturnType<typeof getWeatherData>> {}

export function generateWeatherCard(props: WeatherCardProps) {
  return new ImageBuilder(
    (
      <div
        style={tw`text-foreground flex flex-col font-['Geist'] font-bold leading-5 tracking-tighter`}
      >
        <div
          style={tw`bg-accent flex flex-col justify-center gap-9 rounded-t-3xl px-12 py-9`}
        >
          <div style={tw`flex items-center justify-between gap-9`}>
            <div style={tw`text-9xl font-bold`}>
              {degrees(props.current.temperature.actual)}
            </div>
            <div style={tw`flex items-end gap-9 text-right`}>
              <div style={tw`flex flex-col items-end`}>
                <div
                  style={tw`text-4xl font-bold`}
                >{`${props.location.name}, ${props.location.admin}`}</div>
                <div style={tw`text-muted-foreground text-3xl font-medium`}>
                  {props.location.country}
                </div>
              </div>
            </div>
          </div>
          <div style={tw`flex items-center justify-between gap-9`}>
            <div style={tw`flex flex-col`}>
              <div style={tw`text-4xl font-bold`}>Humidity</div>
              <div style={tw`text-muted-foreground text-3xl font-medium`}>
                {`${props.current.humidity}%, dew point is ${degrees(props.current.dewpoint)}`}
              </div>
            </div>
            <div style={tw`flex flex-col items-end text-right`}>
              <div style={tw`text-4xl font-bold`}>Precipitation</div>
              <div style={tw`text-muted-foreground text-3xl font-medium`}>
                {`${props.current.precipitation} ${props.units === "metric" ? "mm" : "inches"} in next 24h`}
              </div>
            </div>
          </div>
          <div style={tw`flex items-center justify-between gap-9`}>
            <div style={tw`flex flex-col`}>
              <div style={tw`text-4xl font-bold`}>UV Index</div>
              <div style={tw`text-muted-foreground text-3xl font-medium`}>
                {`${props.current.uvRadiation.description} (${props.current.uvRadiation.index})`}
              </div>
            </div>
            <div style={tw`flex flex-col items-end text-right`}>
              <div style={tw`text-4xl font-bold`}>Visibility</div>
              <div style={tw`text-muted-foreground text-3xl font-medium`}>
                {`${props.current.visibility.description} (${props.current.visibility.distance} ${props.units === "metric" ? "km" : "miles"})`}
              </div>
            </div>
          </div>
        </div>
        <div style={tw`bg-accent flex`}>
          <svg
            width="730"
            height="100"
            viewBox="0 0 730 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0 71.8954L15.173 62.549C30.452 53.1373 60.798 34.4444 91.25 24.7059C121.702 15.0327 152.048 14.3791 182.5 15.1634C212.952 15.8824 243.298 18.1046 273.75 22.2222C304.202 26.3399 334.548 32.4837 365 38.4314C395.452 44.4444 425.798 50.3268 456.25 55.7516C486.702 61.2418 517.048 66.2092 547.5 66.1438C577.952 66.0131 608.298 60.7843 638.75 48.8889C669.202 37.0588 699.548 18.4967 714.827 9.28105L730 0V100H714.827C699.548 100 669.202 100 638.75 100C608.298 100 577.952 100 547.5 100C517.048 100 486.702 100 456.25 100C425.798 100 395.452 100 365 100C334.548 100 304.202 100 273.75 100C243.298 100 212.952 100 182.5 100C152.048 100 121.702 100 91.25 100C60.798 100 30.452 100 15.173 100H0V71.8954Z"
              fill="#101010"
            />
          </svg>
        </div>
        <div
          style={tw`bg-background flex items-center gap-9 rounded-b-3xl px-12 py-9`}
        >
          <div style={tw`flex grow flex-col gap-3`}>
            {props.forecast.map((forecast, index) => (
              <div
                key={index}
                style={tw`flex items-center justify-between gap-3`}
              >
                <div style={tw`text-left text-4xl font-bold`}>
                  {getDayName(forecast.day)}
                </div>
                <div
                  style={tw`text-muted-foreground text-right text-3xl font-medium`}
                >
                  {forecast.weather}
                </div>
              </div>
            ))}
          </div>
          <div style={tw`flex flex-col gap-3`}>
            {props.forecast.map((forecast, index) => (
              <div
                key={index}
                style={tw`flex items-center justify-between gap-3`}
              >
                <div style={tw`text-4xl font-bold`}>
                  {degrees(forecast.temperature.max)}
                </div>
                <div
                  style={tw`text-muted-foreground text-right text-3xl font-medium`}
                >
                  {degrees(forecast.temperature.max)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
  )
    .setWidth(730)
    .setHeight(920)
    .setFonts([
      { name: "Geist", weight: 500, data: geistMedium },
      { name: "Geist", weight: 700, data: geistBold },
    ])
}

function degrees(degrees: string | number) {
  return degrees + "°"
}
