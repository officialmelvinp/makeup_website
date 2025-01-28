import { Suspense } from "react"
import TimeSelectionContent from "./TimeSelectionContent"

export default function TimeSelection() {
  return (
    <div className="container mx-auto px-4 py-8 mt-16">
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-8 text-plum-800 font-playfair">
        Select a Time
      </h1>
      <div className="max-w-2xl mx-auto bg-white shadow-xl rounded-lg overflow-hidden p-6">
        <Suspense fallback={<div>Loading available times...</div>}>
          <TimeSelectionContent />
        </Suspense>
      </div>
    </div>
  )
}

