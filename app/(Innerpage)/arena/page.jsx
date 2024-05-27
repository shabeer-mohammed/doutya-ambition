import Image from 'next/image'
import React from 'react'

const page = () => {
  return (
    <div >
      <div className="relative w-full h-full">
        <Image src={"/assets/images/soon.jpg"} fill />
      </div>
    </div>
  )
}

export default page