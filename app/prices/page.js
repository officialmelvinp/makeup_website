import { FaHome, FaPlane } from "react-icons/fa"
import { getPrices } from "@/lib/supabase"

export default async function Prices() {
  const prices = await getPrices()

  const priceList = prices.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = []
    }
    acc[item.category].push({ name: item.name, price: item.price })
    return acc
  }, {})

  return (
    <div className="container mx-auto px-6 py-16">
      <h1 className="text-5xl font-bold text-center mb-16 text-plum-800 font-playfair">Our Price List</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
        {Object.entries(priceList).map(([category, items], index) => (
          <div key={index} className="bg-white shadow-xl rounded-lg overflow-hidden">
            <div className="bg-rose-gold p-6">
              <h2 className="text-2xl font-semibold text-white font-playfair">{category}</h2>
            </div>
            <ul className="p-6 space-y-4">
              {items.map((item, itemIndex) => (
                <li key={itemIndex} className="flex justify-between items-center">
                  <span className="text-charcoal-600 font-lato">{item.name}</span>
                  <span className="text-plum-700 font-semibold font-lato">{item.price}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="mt-16 bg-champagne-100 p-8 rounded-lg shadow-lg">
        <h3 className="text-2xl font-semibold mb-4 text-plum-800 font-playfair">Additional Information</h3>
        <ul className="space-y-2 text-charcoal-600 font-lato">
          <li className="flex items-center">
            <FaHome className="mr-2 text-rose-gold" />
            Home service fee applies for locations beyond 32 km
          </li>
          <li className="flex items-center">
            <FaPlane className="mr-2 text-rose-gold" />
            Travel expenses for destination services will be discussed and agreed upon in advance
          </li>
        </ul>
      </div>
    </div>
  )
}

