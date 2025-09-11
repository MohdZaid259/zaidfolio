import React from 'react'
import { AuroraText } from '../magicui/aurora-text'

function aboutStats() {
  return (
          <div className="-mt-24 grid grid-cols-3 gap-8 text-center">
            <div>
              <AuroraText className="text-3xl md:text-4xl font-bold">
                50+
              </AuroraText>
              <p className="text-sm text-gray-400 mt-1">Completed Projects</p>
            </div>

            <div>
              <AuroraText className="text-3xl md:text-4xl font-bold">
                98.7%
              </AuroraText>
              <p className="text-sm text-gray-400 mt-1">Client Satisfaction</p>
            </div>

            <div>
              <AuroraText className="text-3xl md:text-4xl font-bold">
                3+
              </AuroraText>
              <p className="text-sm text-gray-400 mt-1">Years Experience</p>
            </div>
          </div>
  )
}

export default aboutStats