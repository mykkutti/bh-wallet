// curl -X GET "https://sygnfmfujvwzxasvxwhk.supabase.co/functions/v1/token-price/token" \
//   -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN5Z25mbWZ1anZ3enhhc3Z4d2hrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTExMDc4ODYsImV4cCI6MjA2NjY4Mzg4Nn0.-RuvYy9TeJDkjCJWet79MqlXC6Qaehyq4YSwoY7OsiE"

import { Toast } from 'toastify-react-native';
import z from 'zod/v4';

// {"B":{"usd":684.33},"HAR":{"usd":2.84},"VEST":{"usd":35.48}}%
const zodPrice = z.object({
  B: z.object({
    usd: z.number(),
  }),
  HAR: z.object({
    usd: z.number(),
  }),
  VEST: z.object({
    usd: z.number(),
  }),
});

export const fetchTokenPrice = async () => {
  const endPoint = 'https://sygnfmfujvwzxasvxwhk.supabase.co/functions/v1/token-price/token';
  const apiKey =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN5Z25mbWZ1anZ3enhhc3Z4d2hrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTExMDc4ODYsImV4cCI6MjA2NjY4Mzg4Nn0.-RuvYy9TeJDkjCJWet79MqlXC6Qaehyq4YSwoY7OsiE';

  console.info('endPoint', endPoint);
  console.info('apiKey', apiKey);

  console.info('fetch begin');
  const response = await fetchWithRetry(endPoint, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
  });
  console.info('fetch end');
  console.info('response', response);

  if (response.ok) {
    console.info('response ok');
    const json = await response.json();
    console.info('json', json);
    const result = zodPrice.safeParse(json);

    if (result.success) {
      console.info('result', result);
      console.info('VEST.usd', result.data.VEST.usd);
      return result.data.VEST.usd;
    } else {
      console.error('zodPrice parse error', result.error);
      throw new Error('zodPrice parse error');
    }
  } else {
    // { status: 503, message: "Service temporarily unavailable", code: "SERVICE_UNAVAILABLE" },
    // { status: 429, message: "Rate limit exceeded", code: "RATE_LIMIT" },
    // { status: 500, message: "Internal server error", code: "INTERNAL_ERROR" },
    switch (response.status) {
      case 429:
        Toast.error('Rate limit exceeded', 'center');
        throw new Error('Rate limit exceeded');
      case 500:
        Toast.error('Internal server error', 'center');
        throw new Error('Internal server error');
      case 503:
        Toast.error('Service temporarily unavailable', 'center');
        throw new Error('Service temporarily unavailable');
      default:
        Toast.error(`HTTP error! status: ${response.status}`, 'center');
        throw new Error(`HTTP error! status: ${response.status}`);
    }
  }
};

async function fetchWithRetry(
  url: string,
  options: RequestInit,
  maxRetries: number = 5,
  baseDelay: number = 1000
) {
  console.info('fetchWithRetry begin', url, options, maxRetries, baseDelay);
  let attempt = 0;

  while (attempt < maxRetries) {
    try {
      const response = await fetch(url, options);
      if (response.ok) {
        return response;
      }
      throw new Error(`HTTP ${response.status}`);
    } catch (error) {
      console.error(`Fetch attempt ${attempt + 1} failed:`, error);
      Toast.error('Internal server error try again', 'center');
      attempt++;
      if (attempt >= maxRetries) {
        throw error;
      }

      // 지수적으로 증가하는 대기 시간 + 랜덤 지터
      const delay = baseDelay * Math.pow(2, attempt - 1);
      const jitter = Math.random() * 1000;
      await new Promise((resolve) => setTimeout(resolve, delay + jitter));
    }
  }

  throw new Error(`fail maxRetries: ${maxRetries}`);
}
