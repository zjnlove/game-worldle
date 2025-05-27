import { NextResponse } from 'next/server';

export async function GET() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Worldle Unlimited",
    "alternateName": "WORLDLE UNLIMITED",
    "url": "https://worldle.top"
  };

  return NextResponse.json(structuredData);
} 