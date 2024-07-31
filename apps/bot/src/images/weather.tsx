import { ImageBuilder } from "phasebot/builders"

import { getDayName } from "~/lib/utils"

import geist500 from "./fonts/Geist-500.otf"
import geist700 from "./fonts/Geist-700.otf"

import type { getWeatherData } from "~/commands/(info)/(weather)/_utils"

interface WeatherCardProps extends Awaited<ReturnType<typeof getWeatherData>> {}

export const generateWeatherCard = (props: WeatherCardProps) => {
  return new ImageBuilder(
    (
      <div
        tw="flex flex-col font-bold text-[#f8f8f8]"
        style={{
          fontFamily: "Geist",
          letterSpacing: "-0.04em",
          lineHeight: "1.25em",
        }}
      >
        <div
          tw="px-12 py-9 flex flex-col justify-center bg-[#282828] rounded-t-[36px]"
          style={{ gap: "36px" }}
        >
          <div tw="flex items-center justify-between" style={{ gap: "36px" }}>
            <div tw="font-bold text-[128px]">
              {props.current.temperature.actual + "°"}
            </div>
            <div
              tw="flex flex-col items-end text-right"
              style={{ gap: "36px" }}
            >
              <div tw="flex flex-col items-end">
                <div tw="font-bold text-[32px]">{`${props.location.name}, ${props.location.admin}`}</div>
                <div tw="font-medium text-[28px] text-[#C0C0C0]">
                  {props.location.country}
                </div>
              </div>
              <div tw="font-bold text-[32px]">
                {`Feels like ${props.current.temperature.feelsLike}°`}
              </div>
            </div>
          </div>
          <div
            tw="flex items-center justify-between h-[75px]"
            style={{ gap: "36px" }}
          >
            <div tw="flex flex-col">
              <div tw="font-bold text-[32px]">Humidity</div>
              <div tw="font-medium text-[28px] text-[#C0C0C0]">
                {`${props.current.humidity}%, dew point is ${props.current.dewpoint}°`}
              </div>
            </div>
            <div tw="flex flex-col items-end text-right">
              <div tw="font-bold text-[32px]">Precipitation</div>
              <div tw="font-medium text-[28px] text-[#C0C0C0]">
                {`${props.current.precipitation} ${props.units === "metric" ? "mm" : "inches"} in next 24h`}
              </div>
            </div>
          </div>
          <div
            tw="flex items-center justify-between h-[75px]"
            style={{ gap: "36px" }}
          >
            <div tw="flex flex-col">
              <div tw="font-bold text-[32px]">UV Index</div>
              <div tw="font-medium text-[28px] text-[#C0C0C0]">
                {`${props.current.uvRadiation.description} (${props.current.uvRadiation.index})`}
              </div>
            </div>
            <div tw="flex flex-col items-end text-right">
              <div tw="font-bold text-[32px]">Visibility</div>
              <div tw="font-medium text-[28px] text-[#C0C0C0]">
                {`${props.current.visibility.description} (${props.current.visibility.distance} ${props.units === "metric" ? "km" : "miles"})`}
              </div>
            </div>
          </div>
        </div>
        <div tw="flex bg-[#282828]">
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
          tw="flex items-center bg-[#101010] px-12 py-9 rounded-b-[36px]"
          style={{ gap: "36px" }}
        >
          <div tw="flex flex-col grow" style={{ gap: "12px" }}>
            {props.forecast.map((forecast, index) => (
              <div
                key={index}
                tw="flex items-center justify-between h-[40px]"
                style={{ gap: "12px" }}
              >
                <div tw="font-bold text-[32px] text-left">
                  {getDayName(forecast.day)}
                </div>
                <div tw="font-medium text-[28px] text-[#C0C0C0] text-right">
                  {forecast.weather}
                </div>
              </div>
            ))}
          </div>
          <div tw="flex flex-col" style={{ gap: "12px" }}>
            {props.forecast.map((forecast, index) => (
              <div
                key={index}
                tw="flex items-center justify-between h-[40px]"
                style={{ gap: "12px" }}
              >
                <div tw="font-bold text-[32px] text-left">
                  {forecast.temperature.max + "°"}
                </div>
                <div tw="font-medium text-[32px] text-[#C0C0C0] text-right">
                  {forecast.temperature.max + "°"}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
  )
    .setWidth(730)
    .setHeight(970)
    .setFonts([
      {
        data: geist500,
        name: "Geist",
        style: "normal",
        weight: 500,
      },
      {
        data: geist700,
        name: "Geist",
        style: "normal",
        weight: 700,
      },
    ])
}
