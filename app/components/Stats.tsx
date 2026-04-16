export default function Stats() {
    const stats = [
      {
        number: "12+",
        text: "Years in food and hospitality communications",
      },
      {
        number: "4",
        text: "Countries lived and worked in: Philippines, UK, Australia, Bhutan",
      },
      {
        number: "50+",
        text: "Stories told in the food and beverage space, with more on the way",
      },
      {
        number: "3",
        text: "Continents. One obsession: storytelling.",
      },
    ];
  
    return (
      <section className="w-full bg-[#FEFDF8] py-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 text-center">
            {stats.map((item, index) => (
              <div key={index} className="flex flex-col items-center">
                <h2 className="text-7xl md:text-8xl font-serif text-black mb-4">
                  {item.number}
                </h2>
  
                <p className="text-gray-800 text-sm md:text-base leading-relaxed max-w-[220px]">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }