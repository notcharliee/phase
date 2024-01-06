import Link from "next/link"
import { SVGProps } from "react"
import { Button } from "@/components/ui/button"

export default () => (
  <main className="min-h-dvh grid text-light-900">
    <Stars className="place-self-center fixed -z-10 overflow-hidden scale-50 rotate-90 sm:scale-[.6] sm:rotate-0 md:scale-75" />
    <div className="place-self-center w-full flex flex-col items-center">
      <div className="relative flex justify-center items-center w-full">
        <h1 className="animate-[scale-up_1s_ease-out_forwards] shadow-light-100/50 text-shadow-glow text-6xl sm:text-7xl md:text-8xl max-w-[500px] sm:max-w-[600px] md:max-w-[700px] font-black tracking-tighter text-center absolute z-10">The all in one Discord Bot</h1>
        <Moon className="w-72 h-72 sm:w-80 sm:h-80 md:w-96 md:h-96 animate-[moon-rotate_1s_ease-out_forwards]" />
      </div>
      <div className="animate-[scale-up_1s_ease-out_forwards] opacity-0 animation-delay-500 flex flex-col sm:flex-row gap-6 shadow-light-100/50 mt-20">
        <Button variant={"default"} className="shadow-glow" size={"xl"}>
          <Link href={"/dashboard"}>Get Started</Link>
        </Button>
        <Button variant={"outline"} className="shadow-glow border-2 border-light-800" size={"xl"}>
          <Link href={"/docs"}>Learn More</Link>
        </Button>
      </div>
    </div>
  </main>
)


const Moon: React.FC<SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} width="676" height="676" viewBox="0 0 676 676" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="338" cy="338" r="337.5" fill="#F8F8F8"/>
    <path fillRule="evenodd" clipRule="evenodd" d="M645.348 477.639C589.864 523.494 519.292 550.946 442.464 550.946C263.835 550.946 119.027 402.541 119.027 219.473C119.027 156.577 136.12 97.7722 165.805 47.6718C66.8288 106.502 0.5 214.505 0.5 338C0.5 524.396 151.604 675.5 338 675.5C474.594 675.5 592.236 594.354 645.348 477.639Z" fill="#B2B2B2"/>
    <circle cx="273.714" cy="490.679" r="45.2009" fill="#B2B2B2" stroke="#F8F8F8" strokeWidth="10.0446"/>
    <circle cx="146.434" cy="338" r="23.856" fill="#B2B2B2" stroke="#F8F8F8" strokeWidth="10.0446"/>
    <circle cx="357.085" cy="51.7277" r="19.0848" fill="#B2B2B2" stroke="#F8F8F8" strokeWidth="8.03571"/>
    <circle cx="399.272" cy="216.46" r="37.1652" fill="#B2B2B2" stroke="#F8F8F8" strokeWidth="8.03571"/>
    <circle cx="555.969" cy="332.978" r="75.3348" fill="#B2B2B2" stroke="#F8F8F8" strokeWidth="8.03571"/>
    <circle cx="362.107" cy="352.063" r="42.1875" fill="#B2B2B2" stroke="#F8F8F8" strokeWidth="8.03571"/>
    <circle cx="221.482" cy="139.116" r="30.1339" fill="#B2B2B2" stroke="#F8F8F8" strokeWidth="8.03571"/>
    <circle cx="247.598" cy="261.661" r="16.0714" fill="#B2B2B2" stroke="#F8F8F8" strokeWidth="8.03571"/>
  </svg>
)

const Stars: React.FC<SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} width="1564" height="999" viewBox="0 0 1564 999" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g>
      <circle opacity="0.5" cx="39.7734" cy="75.7458" r="6" className="animate-[star-twinkle_3s_ease-in-out_infinite] animation-delay-[2s]" fill="#C0C0C0"/>
      <circle opacity="0.5" cx="6.68152" cy="435.561" r="3" className="animate-[star-twinkle_3s_ease-in-out_infinite] animation-delay-[1s]" fill="#C0C0C0"/>
      <circle opacity="0.5" cx="279.925" cy="474.25" r="3" className="animate-[star-twinkle_3s_ease-in-out_infinite] animation-delay-[1.5s]" fill="#C0C0C0"/>
      <circle opacity="0.5" cx="1239.91" cy="355.764" r="3" className="animate-[star-twinkle_3s_ease-in-out_infinite] animation-delay-[3s]" fill="#C0C0C0"/>
      <circle opacity="0.5" cx="1510.73" cy="816.678" r="3" className="animate-[star-twinkle_3s_ease-in-out_infinite] animation-delay-[1.25s]" fill="#C0C0C0"/>
      <circle opacity="0.5" cx="220.492" cy="231.716" r="4.5" className="animate-[star-twinkle_3s_ease-in-out_infinite] animation-delay-[4s]" fill="#C0C0C0"/>
      <circle opacity="0.5" cx="390.626" cy="35.6624" r="6" className="animate-[star-twinkle_3s_ease-in-out_infinite] animation-delay-[0s]" fill="#C0C0C0"/>
      <circle opacity="0.5" cx="724.218" cy="75.7458" r="3" className="animate-[star-twinkle_3s_ease-in-out_infinite] animation-delay-[0.5s]" fill="#C0C0C0"/>
      <circle opacity="0.5" cx="1056.27" cy="181.987" r="4.5" className="animate-[star-twinkle_3s_ease-in-out_infinite] animation-delay-[1.75s]" fill="#C0C0C0"/>
      <circle opacity="0.5" cx="1419.23" cy="237.716" r="6" className="animate-[star-twinkle_3s_ease-in-out_infinite] animation-delay-[4.5s]" fill="#C0C0C0"/>
      <circle opacity="0.5" cx="1266.4" cy="69.7458" r="3" className="animate-[star-twinkle_3s_ease-in-out_infinite] animation-delay-[3.25s]" fill="#C0C0C0"/>
      <circle opacity="0.5" cx="1398.39" cy="605.037" r="4.5" className="animate-[star-twinkle_3s_ease-in-out_infinite] animation-delay-[2.5s]" fill="#C0C0C0"/>
      <circle opacity="0.5" cx="1518.23" cy="433.217" r="4.5" className="animate-[star-twinkle_3s_ease-in-out_infinite] animation-delay-[5.75s]" fill="#C0C0C0"/>
      <circle opacity="0.5" cx="1198.67" cy="834.678" r="3" className="animate-[star-twinkle_3s_ease-in-out_infinite] animation-delay-[2.75s]" fill="#C0C0C0"/>
      <circle opacity="0.5" cx="1537.32" cy="986.171" r="6" className="animate-[star-twinkle_3s_ease-in-out_infinite] animation-delay-[5s]" fill="#C0C0C0"/>
      <circle opacity="0.5" cx="420.378" cy="822.678" r="3" className="animate-[star-twinkle_3s_ease-in-out_infinite] animation-delay-[7s]" fill="#C0C0C0"/>
      <circle opacity="0.5" cx="90.1384" cy="968.309" r="4.5" className="animate-[star-twinkle_3s_ease-in-out_infinite] animation-delay-[5.5s]" fill="#C0C0C0"/>
      <circle opacity="0.5" cx="847.038" cy="926.382" r="6" className="animate-[star-twinkle_3s_ease-in-out_infinite] animation-delay-[4.75s]" fill="#C0C0C0"/>
      <circle opacity="0.5" cx="140.376" cy="655.894" r="6" className="animate-[star-twinkle_3s_ease-in-out_infinite] animation-delay-[6.5s]" fill="#C0C0C0"/>
      <circle opacity="0.5" cx="1560.03" cy="29.6624" r="3" className="animate-[star-twinkle_3s_ease-in-out_infinite] animation-delay-[5.25s]" fill="#C0C0C0"/>
      <circle opacity="0.5" cx="974.345" cy="3.49023" r="3" className="animate-[star-twinkle_3s_ease-in-out_infinite] animation-delay-[6s]" fill="#C0C0C0"/>
      <circle opacity="0.5" cx="547.431" cy="995.171" r="3" className="animate-[star-twinkle_3s_ease-in-out_infinite] animation-delay-[4.25s]" fill="#C0C0C0"/>
    </g>
  </svg>
)