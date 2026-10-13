export const translations = {
  hu: {
    appTitle: 'WellFinder',
    tagline: 'IP Intelligence & Hálózati Diagnosztika',
    badge: 'v3.0 PRO',
    searchPlaceholder: 'Írj be IPv4, IPv6 címet vagy domain nevet (pl. 8.8.8.8, 1.1.1.1, github.com)...',
    searchButton: 'Keresés',
    searching: 'Keresés folyamatban...',
    myIpButton: 'Saját IP',
    shareLink: 'Megosztási link',
    copied: 'Másolva!',
    copy: 'Másolás',
    tabs: {
      dashboard: 'Irányítópult',
      dns: 'DNS Szonda',
      compare: 'Összehasonlítás',
      batch: 'Tömeges (Batch)',
      raw: 'Nyers JSON'
    },
    hero: {
      network: 'Hálózat',
      asn: 'Autonóm Rendszer (ASN)',
      isp: 'Szolgáltató',
      coordinates: 'Koordináták',
      localWeather: 'Helyi Időjárás',
      localTime: 'Helyi Idő',
      copyIpTooltip: 'IP cím másolása vágólapra'
    },
    threat: {
      title: 'Biztonsági Elemzés (Threat Intel)',
      fraudScore: 'Kockázati Index (Fraud Score)',
      vpnProxy: 'VPN / Proxy',
      torNode: 'Tor Exit Node',
      datacenter: 'Adatközpont / Cloud',
      networkType: 'Hálózat Típusa',
      low: 'Alacsony',
      medium: 'Közepes',
      high: 'Magas',
      yes: 'Igen (Észlelve)',
      no: 'Nem (Tiszta)',
      safeMessage: 'A kapcsolat nem mutat gyanús kiberbiztonsági anomáliát.',
      suspiciousMessage: 'Közepes kockázat: proxy vagy hoszting szerverhez kapcsolódhat.',
      dangerMessage: 'Magas kockázat: anonimizáló hálózat, VPN vagy Tor kapcsolat azonosítva.'
    },
    ping: {
      title: 'Élő Ping & Késleltetés Mérés',
      startTest: 'Ping Teszt',
      running: 'Mérés...',
      avgLatency: 'Átlagos késleltetés (RTT)',
      packetLoss: 'Csomagvesztés',
      jitter: 'Jitter',
      min: 'Min',
      max: 'Max',
      latencyGraph: 'Késleltetési Grafikon'
    },
    dns: {
      title: 'DNS & Reverse Lookup (rDNS)',
      hostname: 'PTR Rekord (Hostname)',
      records: 'DNS Rekordok',
      lookupTitle: 'Élő DNS Vizsgáló (Cloudflare DoH)',
      domainInput: 'Domain név vagy host (pl. wellcosta.dev, google.com)',
      query: 'Rekordok lekérése',
      recordType: 'Rekord típus',
      value: 'Érték',
      ttl: 'TTL (mp)'
    },
    map: {
      title: 'Pontos Térképes Lokáció',
      openGmaps: 'Megnyitás Google Térképen',
      noCoords: 'Nincsenek elérhető GPS koordináták a megadott címhez.'
    },
    networkSpecs: {
      title: 'Részletes Hálózati Paraméterek',
      country: 'Ország',
      region: 'Régió / Megye',
      city: 'Város',
      postal: 'Irányítószám',
      timezone: 'Időzóna',
      currency: 'Helyi Pénznem',
      organization: 'Szervezet'
    },
    compare: {
      title: 'Két IP Cím Összehasonlítása (Split-View)',
      subtitle: 'Hasonlítsd össze közvetlenül két szerver vagy IP hálózati szolgáltatóját, lokációját és biztonsági mutatóit.',
      ip1Placeholder: '1. IP / domain (pl. 8.8.8.8)',
      ip2Placeholder: '2. IP / domain (pl. 1.1.1.1)',
      compareButton: 'Összevetés',
      host1: 'Célpont #1',
      host2: 'Célpont #2'
    },
    batch: {
      title: 'Tömeges IP Elemző (Batch Processor)',
      subtitle: 'Illessz be több IP címet vagy domaint soronként (legfeljebb 20 cím). Automatikusan elemezzük és CSV/JSON formátumban exportálhatod.',
      placeholder: '8.8.8.8\n1.1.1.1\n9.9.9.9\n208.67.222.222\ngithub.com',
      runButton: 'Futtatás',
      exportCsv: 'Exportálás CSV-be',
      exportJson: 'Exportálás JSON-ba',
      ipCol: 'IP Cím',
      locationCol: 'Helyszín',
      ispCol: 'ISP / Szervezet',
      asnCol: 'ASN',
      riskCol: 'Kockázat',
      typeCol: 'Típus'
    },
    raw: {
      title: 'Nyers JSON Adatstruktúra (API Payload)',
      copyPayload: 'JSON Másolása',
      downloadJson: 'JSON Letöltése'
    },
    footer: {
      copyright: 'WellFinder – Wellcosta Development. Minden jog fenntartva.',
      privacyNote: 'Biztonságos & Titkosított: kereséseid nem kerülnek rögzítésre harmadik fél számára.'
    },
    presets: {
      myIp: 'Saját IP',
      cloudflare: 'Cloudflare (1.1.1.1)',
      google: 'Google (8.8.8.8)',
      quad9: 'Quad9 (9.9.9.9)',
      opendns: 'OpenDNS'
    }
  },
  en: {
    appTitle: 'WellFinder',
    tagline: 'IP Intelligence & Network Diagnostics',
    badge: 'v3.0 PRO',
    searchPlaceholder: 'Enter IPv4, IPv6 address or domain name (e.g. 8.8.8.8, 1.1.1.1, github.com)...',
    searchButton: 'Lookup',
    searching: 'Looking up...',
    myIpButton: 'My IP',
    shareLink: 'Share Link',
    copied: 'Copied!',
    copy: 'Copy',
    tabs: {
      dashboard: 'Dashboard',
      dns: 'DNS Inspector',
      compare: 'Compare',
      batch: 'Batch Lookup',
      raw: 'Raw JSON'
    },
    hero: {
      network: 'Network',
      asn: 'Autonomous System (ASN)',
      isp: 'Provider (ISP)',
      coordinates: 'Coordinates',
      localWeather: 'Local Weather',
      localTime: 'Local Time',
      copyIpTooltip: 'Copy IP address to clipboard'
    },
    threat: {
      title: 'Security Analysis (Threat Intel)',
      fraudScore: 'Fraud Risk Score',
      vpnProxy: 'VPN / Proxy',
      torNode: 'Tor Exit Node',
      datacenter: 'Data Center / Cloud',
      networkType: 'Network Type',
      low: 'Low',
      medium: 'Medium',
      high: 'High',
      yes: 'Yes (Detected)',
      no: 'No (Clean)',
      safeMessage: 'Connection exhibits no suspicious cyber anomalies.',
      suspiciousMessage: 'Moderate risk: potentially associated with proxy or hosting infrastructure.',
      dangerMessage: 'High risk: anonymizer network, VPN, or Tor node identified.'
    },
    ping: {
      title: 'Live Ping & Latency Diagnostics',
      startTest: 'Ping Test',
      running: 'Testing...',
      avgLatency: 'Average Round-Trip Latency (RTT)',
      packetLoss: 'Packet Loss',
      jitter: 'Jitter',
      min: 'Min',
      max: 'Max',
      latencyGraph: 'Latency Jitter Chart'
    },
    dns: {
      title: 'DNS & Reverse Lookup (rDNS)',
      hostname: 'PTR Record (Hostname)',
      records: 'DNS Records',
      lookupTitle: 'Live DNS Inspector (Cloudflare DoH)',
      domainInput: 'Domain name or host (e.g. wellcosta.dev, google.com)',
      query: 'Query Records',
      recordType: 'Type',
      value: 'Value',
      ttl: 'TTL (s)'
    },
    map: {
      title: 'Live Map Location',
      openGmaps: 'Open in Google Maps',
      noCoords: 'No GPS coordinates available for the given address.'
    },
    networkSpecs: {
      title: 'Network Specifications',
      country: 'Country',
      region: 'Region / State',
      city: 'City',
      postal: 'Postal Code',
      timezone: 'Timezone',
      currency: 'Local Currency',
      organization: 'Organization'
    },
    compare: {
      title: 'Two IP Comparison (Split-View)',
      subtitle: 'Directly compare two IPs or hosts side-by-side: ISP, routing, geolocation, and risk metrics.',
      ip1Placeholder: 'Host 1 (e.g. 8.8.8.8)',
      ip2Placeholder: 'Host 2 (e.g. 1.1.1.1)',
      compareButton: 'Compare Hosts',
      host1: 'Target #1',
      host2: 'Target #2'
    },
    batch: {
      title: 'Batch IP Processor',
      subtitle: 'Paste multiple IP addresses or domains line-by-line (up to 20). Automatically analyze and export to CSV or JSON.',
      placeholder: '8.8.8.8\n1.1.1.1\n9.9.9.9\n208.67.222.222\ngithub.com',
      runButton: 'Execute',
      exportCsv: 'Export CSV',
      exportJson: 'Export JSON',
      ipCol: 'IP Address',
      locationCol: 'Location',
      ispCol: 'ISP / Organization',
      asnCol: 'ASN',
      riskCol: 'Risk Score',
      typeCol: 'Type'
    },
    raw: {
      title: 'Raw JSON Data Payload',
      copyPayload: 'Copy JSON',
      downloadJson: 'Download JSON'
    },
    footer: {
      copyright: 'WellFinder by Wellcosta Development. All rights reserved.',
      privacyNote: 'Secure & Encrypted: your search queries are never stored or shared.'
    },
    presets: {
      myIp: 'My IP',
      cloudflare: 'Cloudflare (1.1.1.1)',
      google: 'Google (8.8.8.8)',
      quad9: 'Quad9 (9.9.9.9)',
      opendns: 'OpenDNS'
    }
  }
};
