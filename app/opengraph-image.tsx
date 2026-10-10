import { ImageResponse } from 'next/og';

export const runtime = 'nodejs';
export const alt = "Sohan Pipeline's & Plumbing — Total Plumbing Solutions";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          backgroundColor: '#090d16',
          backgroundImage:
            'radial-gradient(circle at 15% 20%, rgba(2, 132, 199, 0.25) 0%, transparent 40%), radial-gradient(circle at 85% 80%, rgba(14, 165, 233, 0.15) 0%, transparent 40%)',
          padding: '64px 80px',
          fontFamily: 'sans-serif',
          color: '#ffffff',
          position: 'relative',
        }}
      >
        {/* Top Header Tag */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              backgroundColor: 'rgba(2, 132, 199, 0.15)',
              border: '1px solid rgba(2, 132, 199, 0.4)',
              borderRadius: '999px',
              padding: '8px 20px',
            }}
          >
            <div
              style={{
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                backgroundColor: '#38bdf8',
              }}
            />
            <span
              style={{
                fontSize: '16px',
                fontWeight: 700,
                letterSpacing: '2px',
                textTransform: 'uppercase',
                color: '#38bdf8',
              }}
            >
              Total Plumbing Solutions · Est. 2015
            </span>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '999px',
              padding: '8px 18px',
              color: '#facc15',
              fontSize: '16px',
              fontWeight: 700,
            }}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="#facc15"
              stroke="#facc15"
            >
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
            <span>5.0 Rating</span>
            <span style={{ color: '#94a3b8' }}>· 21+ Verified Reviews</span>
          </div>
        </div>

        {/* Main Title & Value Prop */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '18px',
            maxWidth: '960px',
          }}
        >
          <h1
            style={{
              fontSize: '56px',
              fontWeight: 900,
              lineHeight: 1.1,
              letterSpacing: '-1.5px',
              margin: 0,
              color: '#ffffff',
            }}
          >
            Sohan Pipeline&apos;s &amp; Plumbing
          </h1>
          <p
            style={{
              fontSize: '26px',
              lineHeight: 1.4,
              color: '#94a3b8',
              margin: 0,
            }}
          >
            Master pipe fitting, concealed leak detection, high-pressure drainage, and 24/7 emergency dispatch across Midnapore, Dantan, and South Bengal.
          </p>
        </div>

        {/* Bottom Bar with Contact & Regions */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            paddingTop: '32px',
          }}
        >
          <div
            style={{
              display: 'flex',
              gap: '24px',
              color: '#cbd5e1',
              fontSize: '18px',
              fontWeight: 500,
            }}
          >
            <span>📍 Midnapore</span>
            <span>📍 Dantan</span>
            <span>📍 Kharagpur</span>
            <span>📍 Contai</span>
            <span>📍 Jhargram</span>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              backgroundColor: '#0284c7',
              borderRadius: '12px',
              padding: '12px 24px',
              color: '#ffffff',
              fontSize: '20px',
              fontWeight: 800,
            }}
          >
            <span>📞 +91 86701 43003</span>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
