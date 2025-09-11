import React from 'react'
import Spline from '@splinetool/react-spline/next';

function ThreeDModel() {
  return (
    <div className="flex items-center justify-center overflow-hidden">
      <div className="relative max-md:mt-6 scale-125 ml-96 -mr-96" style={{ pointerEvents: "none" }}>
        {/* <div className='min-w-34 min-h-10 bg-black rounded absolute bottom-5 right-5'></div> */}
        <Spline
          scene="https://prod.spline.design/2FG51UXgwhoh7A2y/scene.splinecode" 
        />
      </div>
    </div>
  )
}

export default ThreeDModel