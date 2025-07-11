export type DistrictData = {
  [district: string]: {
    [mandal: string]: string[]
  }
}

export function getDistricts(data: DistrictData): string[] {
  return Object.keys(data)
}

export function getMandals(data: DistrictData, district: string): string[] {
  if (!district) return []
  return Object.keys(data[district] || {})
}

export function getSecretariats(
  data: DistrictData,
  district: string,
  mandal: string
): string[] {
  if (!district || !mandal) return []
  return data[district]?.[mandal] || []
}
