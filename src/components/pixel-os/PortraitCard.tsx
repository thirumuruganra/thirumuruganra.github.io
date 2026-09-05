export function PortraitCard() {
  return (
    <div
      className="hidden lg:block fixed z-[1] left-[62px] top-[300px] w-[214px] p-3.5 pt-3.5 pb-2.5 bg-pixel-window pixel-border rounded-[10px] anim-pop-in hover:rotate-0 hover:-translate-y-1 transition-transform duration-200"
      style={{ transform: "rotate(3.5deg)", animationDelay: "160ms", ["--rot" as never]: "3.5deg" }}
    >
      <div
        className="absolute left-1/2 -top-3.5 border-2 border-black/35"
        style={{ width: 84, height: 26, background: "rgba(198,113,57,.35)", transform: "translateX(-50%) rotate(-3deg)" }}
      />
      <div className="w-full h-[186px] border-2 border-black rounded-[6px] overflow-hidden bg-pixel-muted">
        <img
          src="/portrait.webp"
          alt="Thirumurugan"
          className="w-full h-full object-cover block"
          style={{ filter: "saturate(.82) contrast(.94) sepia(.12)" }}
        />
      </div>
      <div className="font-sticky text-xl text-center mt-2 text-pixel-muted">hii!!</div>
    </div>
  );
}
