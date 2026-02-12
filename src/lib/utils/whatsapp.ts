export const countries = [
    { name: 'Indonesia', code: '+62', flag: '🇮🇩' },
    { name: 'Malaysia', code: '+60', flag: '🇲🇾' },
    { name: 'Singapore', code: '+65', flag: '🇸🇬' },
    { name: 'Thailand', code: '+66', flag: '🇹🇭' },
    { name: 'USA', code: '+1', flag: '🇺🇸' },
    { name: 'UK', code: '+44', flag: '🇬🇧' },
    { name: 'Australia', code: '+61', flag: '🇦🇺' },
    { name: 'Germany', code: '+49', flag: '🇩🇪' },
    { name: 'France', code: '+33', flag: '🇫🇷' },
    { name: 'Russia', code: '+7', flag: '🇷🇺' },
]

export function getCountryInfo(number: string): { flag: string, code: string } | null {
    if (!number) return null
    const cleaned = number.replace(/\D/g, '')

    // Sort by code length descending to match longest codes first (e.g., +62 before +6)
    const sortedCountries = [...countries].sort((a, b) => b.code.length - a.code.length)

    for (const country of sortedCountries) {
        const countryCode = country.code.replace('+', '')
        if (cleaned.startsWith(countryCode)) {
            return country
        }
    }
    return null
}

export function normalizeWhatsApp(input: string): string {
    // Remove all non-numeric characters except +
    let cleaned = input.replace(/[^\d+]/g, '')

    // Handle 0 prefix for Indonesia if no country code
    if (cleaned.startsWith('0')) {
        cleaned = '62' + cleaned.substring(1)
    }

    // Ensure it has a +
    if (!cleaned.startsWith('+')) {
        cleaned = '+' + cleaned
    }

    return cleaned
}
