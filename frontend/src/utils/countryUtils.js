/**
 * Converts a nationality string (e.g., "British") into an ISO 2-letter country code (e.g., "GB").
 * Useful for rendering flag icons.
 *
 * @param {string} nationality
 * @returns {string|null} ISO code or null if not found
 */
export const getCountryCode = (nationality) => {
    if (!nationality) return null;

    const nat = nationality.toLowerCase().trim();

    const mapping = {
        'american': 'US',
        'american-italian': 'US',
        'argentinian': 'AR',
        'australian': 'AU',
        'austrian': 'AT',
        'belgian': 'BE',
        'brazilian': 'BR',
        'british': 'GB',
        'canadian': 'CA',
        'chilean': 'CL',
        'chinese': 'CN',
        'colombian': 'CO',
        'czech': 'CZ',
        'danish': 'DK',
        'dutch': 'NL',
        'east german': 'DE', // Mapped to Germany
        'finnish': 'FI',
        'french': 'FR',
        'german': 'DE',
        'hungarian': 'HU',
        'indian': 'IN',
        'indonesian': 'ID',
        'irish': 'IE',
        'italian': 'IT',
        'japanese': 'JP',
        'liechtensteiner': 'LI',
        'malaysian': 'MY',
        'mexican': 'MX',
        'monegasque': 'MC',
        'new zealander': 'NZ',
        'polish': 'PL',
        'portuguese': 'PT',
        'rhodesian': 'ZW', // Historical mapping
        'russian': 'RU',
        'south african': 'ZA',
        'spanish': 'ES',
        'swedish': 'SE',
        'swiss': 'CH',
        'thai': 'TH',
        'uruguayan': 'UY',
        'venezuelan': 'VE',
        'hong kong': 'HK',
        'israeli': 'IL',
        'saudi': 'SA',
        'singaporean': 'SG'
    };

    return mapping[nat] || null;
};

/**
 * Converts a country name (e.g., "Monaco") into an ISO 2-letter country code.
 * @param {string} countryName
 * @returns {string|null}
 */
export const getCountryCodeFromCountry = (countryName) => {
    if (!countryName) return null;
    const name = countryName.toLowerCase().trim();

    const mapping = {
        'australia': 'AU',
        'austria': 'AT',
        'azerbaijan': 'AZ',
        'bahrain': 'BH',
        'belgium': 'BE',
        'brazil': 'BR',
        'canada': 'CA',
        'china': 'CN',
        'france': 'FR',
        'germany': 'DE',
        'hungary': 'HU',
        'india': 'IN',
        'italy': 'IT',
        'japan': 'JP',
        'malaysia': 'MY',
        'mexico': 'MX',
        'monaco': 'MC',
        'netherlands': 'NL',
        'portugal': 'PT',
        'qatar': 'QA',
        'russia': 'RU',
        'saudi arabia': 'SA',
        'singapore': 'SG',
        'south africa': 'ZA',
        'south korea': 'KR',
        'spain': 'ES',
        'switzerland': 'CH',
        'turkey': 'TR',
        'uae': 'AE',
        'united arab emirates': 'AE',
        'uk': 'GB',
        'united kingdom': 'GB',
        'usa': 'US',
        'united states': 'US',
        'vietnam': 'VN'
    };
    return mapping[name] || null;
};

/**
 * Returns a URL for the flag image based on nationality.
 * Uses flagcdn.com.
 *
 * @param {string} nationality
 * @returns {string|null} URL string or null
 */
export const getFlagUrl = (identifier) => {
    if (!identifier) return null;

    // Try as nationality first
    let code = getCountryCode(identifier);

    // If not found, try as country name
    if (!code) {
        code = getCountryCodeFromCountry(identifier);
    }

    if (!code) return null;
    return `https://flagcdn.com/w40/${code.toLowerCase()}.png`;
};
