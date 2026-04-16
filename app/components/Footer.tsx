export default function Footer() {
    return (
      <footer className="w-full bg-[#ffc5d1] px-6 md:px-16 py-14">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-10">
  
          {/* Left */}
          <div className="flex flex-col gap-4">
            <img
              src="/Logo.png"
              alt="Type Harder"
              className="w-[170px] md:w-[200px]"
            />
  
            <p className="text-sm md:text-base text-black tracking-wide">
              Manila · London · Type Harder Studio 2026
            </p>
          </div>
  
          {/* Right */}
          <div className="flex flex-col items-start md:items-end gap-3 text-black text-sm md:text-base">
  
            <a
              href="https://onyourplate.substack.com"
              target="_blank"
              className="underline underline-offset-4 hover:opacity-70 transition"
            >
              onyourplate.substack.com
            </a>
  
            <a
              href="https://instagram.com/beatrinidad"
              target="_blank"
              className="underline underline-offset-4 hover:opacity-70 transition"
            >
              @beatrinidad
            </a>
  
            <a
              href="#"
              className="underline underline-offset-4 hover:opacity-70 transition"
            >
              LinkedIn
            </a>
  
            <a
              href="#"
              className="underline underline-offset-4 hover:opacity-70 transition"
            >
              Book a call
            </a>
  
          </div>
        </div>
      </footer>
    );
  }