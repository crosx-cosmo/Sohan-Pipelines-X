import { ImageResponse } from 'next/og';

export const size = {
  width: 32,
  height: 32,
};
export const contentType = 'image/png';

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
          background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
          borderRadius: '7px',
          color: '#ffffff',
          fontWeight: 900,
          fontSize: '20px',
          fontFamily: 'sans-serif',
          boxShadow: 'inset 0 0 0 1px rgba(255, 255, 255, 0.25)',
        }}
      >
        S
      </div>
    ),
    {
      ...size,
    }
  );
}
