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

export function normalizeWhatsApp(code: string, number: string): string {
    // Remove spaces, dashes, and other non-numeric chars from number
    let cleanedNumber = number.replace(/\D/g, '')

    // Strip leading '0'
    if (cleanedNumber.startsWith('0')) {
        cleanedNumber = cleanedNumber.substring(1)
    }

    return code + cleanedNumber
}
