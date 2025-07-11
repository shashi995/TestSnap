import { useState, useEffect } from "react";
import Cookies from "js-cookie";

const getBrowserName = (userAgent: string) => {
  if (userAgent.includes("chrome")) return "Chrome";
  if (userAgent.includes("firefox")) return "Firefox";
  if (userAgent.includes("safari") && !userAgent.includes("chrome"))
    return "Safari";
  if (userAgent.includes("edg")) return "Edge";
  if (userAgent.includes("opera") || userAgent.includes("opr")) return "Opera";
  return "Unknown";
};

const useDeviceMeta = () => {
  const [meta, setMeta] = useState<{
    device: string;
    browser: string;
    userAgent: string;
    ip: string;
    geo: {
      city: string;
      region: string;
      country: string;
      latitude: number;
      longitude: number;
      timezone: string;
      postalCode: string;
    };
  } | null>(null);

  useEffect(() => {
    const cached = Cookies.get("deviceMeta");
    if (cached) {
      setMeta(JSON.parse(cached));
      return;
    }

    const detectDevice = () => {
      const ua = navigator.userAgent.toLowerCase();
      const isMobile = /iphone|ipad|ipod|android|blackberry|windows phone/.test(
        ua
      );
      const isTablet = /(ipad|tablet|playbook|silk)|(android(?!.*mobile))/.test(
        ua
      );
      const device = isMobile ? "Mobile" : isTablet ? "Tablet" : "Desktop";
      const browser = getBrowserName(ua);
      const userAgent = navigator.userAgent;

      return { device, browser, userAgent };
    };

    const fetchAndCacheMeta = async () => {
      const baseMeta = detectDevice();
      try {
        const res = await fetch("https://workers.algohire.ai/geoip-check");
        const geo = await res.json();
        const finalMeta = {
          ...baseMeta,
          ip: geo.ip_address,
          geo: {
            city: geo.city,
            region: geo.region,
            country: geo.country,
            latitude: geo.latitude,
            longitude: geo.longitude,
            timezone: geo.timezone,
            postalCode: geo.postalCode,
          },
        };

        Cookies.set("deviceMeta", JSON.stringify(finalMeta), {
          expires: 1 / 24,
        }); // 1 hour
        setMeta(finalMeta);
      } catch (err) {
        console.error("GeoIP fetch failed:", err);
        setMeta(baseMeta);
      }
    };

    fetchAndCacheMeta();
  }, []);

  return meta;
};

export default useDeviceMeta;
