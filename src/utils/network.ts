export interface UserNetworkData {
  ip: string;
  city?: string;
  region?: string;
  country?: string;
  org?: string;
  postal?: string;
  latitude?: number;
  longitude?: number;
  userAgent: string;
  screen: string;
  timezone: string;
  language: string;
}

export const getUserNetworkData = async (): Promise<UserNetworkData> => {
  let networkInfo: any = { ip: 'unknown' };
  try {
    // ipapi.co provides rich data including ISP and Location
    const response = await fetch('https://ipapi.co/json/');
    if (response.ok) {
      networkInfo = await response.json();
    }
  } catch (error) {
    console.error('Failed to get GeoIP data:', error);
    try {
      const resp = await fetch('https://api.ipify.org?format=json');
      const data = await resp.json();
      networkInfo = { ip: data.ip };
    } catch {}
  }

  return {
    ip: networkInfo.ip || 'unknown',
    city: networkInfo.city,
    region: networkInfo.region,
    country: networkInfo.country_name,
    org: networkInfo.org,
    postal: networkInfo.postal,
    latitude: networkInfo.latitude,
    longitude: networkInfo.longitude,
    userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown',
    screen: typeof window !== 'undefined' ? `${window.screen.width}x${window.screen.height}` : 'unknown',
    timezone: typeof Intl !== 'undefined' ? Intl.DateTimeFormat().resolvedOptions().timeZone : 'unknown',
    language: typeof navigator !== 'undefined' ? navigator.language : 'unknown'
  };
};

export const getUserIp = async (): Promise<string> => {
  const data = await getUserNetworkData();
  return data.ip;
};
