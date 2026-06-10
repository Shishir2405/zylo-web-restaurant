export default function Logo({ size = "normal" }: { size?: "small" | "normal" }) {
  return (
    <div className="flex items-center">
      <span className={`text-[#0a3158] ${size === "small" ? "text-3xl" : "text-4xl"} font-bold leading-none`}>Z</span>
      <span className={`text-[#0a3158] ${size === "small" ? "text-3xl" : "text-4xl"} font-bold leading-none -ml-1`}>
        y
      </span>
      <span className={`text-[#0a3158] ${size === "small" ? "text-3xl" : "text-4xl"} font-bold leading-none -ml-1`}>
        l
      </span>
      <div className={`relative ${size === "small" ? "-ml-1" : "-ml-1"}`}>
        <div
          className={`${size === "small" ? "w-[30px] h-[30px]" : "w-[40px] h-[40px]"} rounded-full bg-[#f8b133] flex items-center justify-center`}
        >
          <div
            className={`${size === "small" ? "w-[22px] h-[22px]" : "w-[30px] h-[30px]"} rounded-full border-[3px] border-white flex items-center justify-center`}
          >
            <div
              className={`${size === "small" ? "w-[10px] h-[10px]" : "w-[15px] h-[15px]"} rounded-full bg-white flex items-center justify-center`}
            >
              <div
                className={`${size === "small" ? "w-[5px] h-[5px]" : "w-[7px] h-[7px]"} rounded-full bg-[#f8b133]`}
              ></div>
            </div>
            <div
              className={`absolute ${size === "small" ? "w-[5px] h-[1px]" : "w-[7px] h-[1px]"} bg-white rotate-0 ${size === "small" ? "translate-x-[7px]" : "translate-x-[10px]"}`}
            ></div>
            <div
              className={`absolute ${size === "small" ? "w-[5px] h-[1px]" : "w-[7px] h-[1px]"} bg-white rotate-72 ${size === "small" ? "translate-x-[7px]" : "translate-x-[10px]"}`}
            ></div>
            <div
              className={`absolute ${size === "small" ? "w-[5px] h-[1px]" : "w-[7px] h-[1px]"} bg-white rotate-144 ${size === "small" ? "translate-x-[7px]" : "translate-x-[10px]"}`}
            ></div>
            <div
              className={`absolute ${size === "small" ? "w-[5px] h-[1px]" : "w-[7px] h-[1px]"} bg-white rotate-216 ${size === "small" ? "translate-x-[7px]" : "translate-x-[10px]"}`}
            ></div>
            <div
              className={`absolute ${size === "small" ? "w-[5px] h-[1px]" : "w-[7px] h-[1px]"} bg-white rotate-288 ${size === "small" ? "translate-x-[7px]" : "translate-x-[10px]"}`}
            ></div>
          </div>
        </div>
      </div>
      <div className={`text-[#0a3158] ${size === "small" ? "text-lg" : "text-2xl"} font-bold ml-1`}>RIDE</div>
    </div>
  )
}
