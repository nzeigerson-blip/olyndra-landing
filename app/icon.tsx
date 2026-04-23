import { ImageResponse } from 'next/og'
 
export const size = {
  width: 32,
  height: 32,
}
export const contentType = 'image/png'
 
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#0070f3', // This is your blue color
          color: 'white',
          borderRadius: '50%',
          fontSize: 20,
          fontWeight: 'bold',
        }}
      >
        O
      </div>
    ),
    { ...size }
  )
}
