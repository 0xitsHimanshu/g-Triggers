import { AnimatedText } from "./animated-text";
import localFont from "next/font/local";

const myfont = localFont({ src: "../public/DepartureMono-Regular.otf" });

export default function Header() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center relative overflow-hidden">
      <div className="absolute -top-[118px] inset-0 bg-[linear-gradient(to_right,#222_1px,transparent_1px),linear-gradient(to_bottom,#222_1px,transparent_1px)] bg-[size:4.5rem_2rem] -z-10 [transform:perspective(1000px)_rotateX(-63deg)] h-[80%] pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent pointer-events-none -z-10" />

      <h1
        className={
          myfont.className +
          " text-[40px] md:text-[84px] relative z-10 text-center h-[120px] md:h-auto leading-tight"
        }
      >
        <AnimatedText text="Get Ready to Play" />
      </h1>

      <p className="relative z-10 text-center max-w-[80%] mt-0 md:mt-4"></p>

      <div className="absolute -bottom-[280px] inset-0 bg-[linear-gradient(to_right,#222_1px,transparent_1px),linear-gradient(to_bottom,#222_1px,transparent_1px)] bg-[size:4.5rem_2rem] -z-10 [transform:perspective(560px)_rotateX(63deg)] pointer-events-none" />
      <div className="absolute w-full bottom-[100px] h-1/2  bg-gradient-to-b from-background to-transparent pointer-events-none -z-10" />
    </div>
  );
}
