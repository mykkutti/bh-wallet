// curl -X GET "https://sygnfmfujvwzxasvxwhk.supabase.co/functions/v1/token-price/token" \
//   -H "apikey: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN5Z25mbWZ1anZ3enhhc3Z4d2hrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTExMDc4ODYsRuvYy9TeJDkjCJWet79MqlXC6Qaehyq4YSwoY7OsiE" \
//   -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN5Z25mbWZ1anZ3enhhc3Z4d2hrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTExMDc4ODYsRuvYy9TeJDkjCJWet79MqlXC6Qaehyq4YSwoY7OsiE"

// curl -X GET "https://sygnfmfujvwzxasvxwhk.supabase.co/functions/v1/token-price/token" \
//   -H "apikey: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN5Z25mbWZ1anZ3enhhc3Z4d2hrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTExMDc4ODYsRuvYy9TeJDkjCJWet79MqlXC6Qaehyq4YSwoY7OsiE"

export const getTokenPrice2 = async () => {
  const endPoint = 'https://sygnfmfujvwzxasvxwhk.supabase.co/functions/v1/token-price/token';
  const apiKey =
    // 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN5Z25mbWZ1anZ3enhhc3Z4d2hrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTExMDc4ODYsRuvYy9TeJDkjCJWet79MqlXC6Qaehyq4YSwoY7OsiE';
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN5Z25mbWZ1anZ3enhhc3Z4d2hrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTExMDc4ODYsRuvYy9TeJDkjCJWet79MqlXC6Qaehyq4YSwoY7OsiE';

  console.info('endPoint', endPoint);
  console.info('apiKey', apiKey);

  console.info('fetch begin');
  const response = await fetch(endPoint, {
    method: 'GET',
    headers: {
      apikey: apiKey,
      //   Authorization: `Bearer ${apiKey}`,
    },
  });
  console.info('fetch end');
  console.info('response', response);

  if (!response.ok) {
    console.error('token-price/token fetch', response);
    throw new Error(`Request failed: ${response.status}`);
  }

  const data = await response.json();
  console.info('token-price/token fetch', data);
  return data;
};

interface MarketPrice {
  decimal: string;
  frac: string;
}

export const fetchMarketPrice = async (): Promise<MarketPrice> => {
  // 임시 하드코딩된 값 반환
  return {
    decimal: '1523',
    frac: '62'
  };
};
