export interface Country {
  code: string; // ISO 3166-1 alpha-2
  name: string;
  nativeName: string;
  flag: string; // Flag emoji
  region: string;
  subregion: string;
  capital: string;
  currency: string;
  languages: string[];
  timezones: string[];
  callingCode: string;
  // Telehealth specific
  healthcareSystem: string;
  telemedicineRegulated: boolean;
  popularSpecialties: string[];
  currencySymbol: string;
}

export const COUNTRIES: Country[] = [
  // ===== AFRICA =====
  {
    code: 'NG',
    name: 'Nigeria',
    nativeName: 'Nigeria',
    flag: '🇳🇬',
    region: 'Africa',
    subregion: 'Western Africa',
    capital: 'Abuja',
    currency: 'NGN',
    currencySymbol: '₦',
    languages: ['English', 'Hausa', 'Yoruba', 'Igbo'],
    timezones: ['UTC+01:00'],
    callingCode: '+234',
    healthcareSystem: 'Mixed public-private',
    telemedicineRegulated: true,
    popularSpecialties: ['Cardiology', 'Obstetrics', 'Internal Medicine', 'Pediatrics']
  },
  {
    code: 'ZA',
    name: 'South Africa',
    nativeName: 'South Africa',
    flag: '🇿🇦',
    region: 'Africa',
    subregion: 'Southern Africa',
    capital: 'Cape Town',
    currency: 'ZAR',
    currencySymbol: 'R',
    languages: ['English', 'Afrikaans', 'Zulu', 'Xhosa'],
    timezones: ['UTC+02:00'],
    callingCode: '+27',
    healthcareSystem: 'Two-tiered system',
    telemedicineRegulated: true,
    popularSpecialties: ['Dermatology', 'Orthopedics', 'Psychiatry', 'Oncology']
  },
  {
    code: 'EG',
    name: 'Egypt',
    nativeName: 'مصر',
    flag: '🇪🇬',
    region: 'Africa',
    subregion: 'Northern Africa',
    capital: 'Cairo',
    currency: 'EGP',
    currencySymbol: '£',
    languages: ['Arabic', 'English'],
    timezones: ['UTC+02:00'],
    callingCode: '+20',
    healthcareSystem: 'Universal healthcare',
    telemedicineRegulated: true,
    popularSpecialties: ['Cardiology', 'Neurology', 'Ophthalmology', 'Dentistry']
  },
  {
    code: 'KE',
    name: 'Kenya',
    nativeName: 'Kenya',
    flag: '🇰🇪',
    region: 'Africa',
    subregion: 'Eastern Africa',
    capital: 'Nairobi',
    currency: 'KES',
    currencySymbol: 'KSh',
    languages: ['English', 'Swahili'],
    timezones: ['UTC+03:00'],
    callingCode: '+254',
    healthcareSystem: 'Public-private mix',
    telemedicineRegulated: true,
    popularSpecialties: ['Infectious Diseases', 'Obstetrics', 'Surgery', 'Internal Medicine']
  },
  {
    code: 'GH',
    name: 'Ghana',
    nativeName: 'Ghana',
    flag: '🇬🇭',
    region: 'Africa',
    subregion: 'Western Africa',
    capital: 'Accra',
    currency: 'GHS',
    currencySymbol: '₵',
    languages: ['English', 'Twi', 'Fante'],
    timezones: ['UTC+00:00'],
    callingCode: '+233',
    healthcareSystem: 'National Health Insurance',
    telemedicineRegulated: true,
    popularSpecialties: ['Family Medicine', 'Pediatrics', 'Gynecology', 'Cardiology']
  },
  {
    code: 'MA',
    name: 'Morocco',
    nativeName: 'المغرب',
    flag: '🇲🇦',
    region: 'Africa',
    subregion: 'Northern Africa',
    capital: 'Rabat',
    currency: 'MAD',
    currencySymbol: 'د.م.',
    languages: ['Arabic', 'Berber', 'French'],
    timezones: ['UTC+01:00'],
    callingCode: '+212',
    healthcareSystem: 'Mandatory health insurance',
    telemedicineRegulated: true,
    popularSpecialties: ['Dermatology', 'Rheumatology', 'Ophthalmology', 'Dentistry']
  },
  {
    code: 'TN',
    name: 'Tunisia',
    nativeName: 'تونس',
    flag: '🇹🇳',
    region: 'Africa',
    subregion: 'Northern Africa',
    capital: 'Tunis',
    currency: 'TND',
    currencySymbol: 'د.ت',
    languages: ['Arabic', 'French'],
    timezones: ['UTC+01:00'],
    callingCode: '+216',
    healthcareSystem: 'Universal coverage',
    telemedicineRegulated: true,
    popularSpecialties: ['Cardiology', 'Neurology', 'Psychiatry', 'Endocrinology']
  },
  {
    code: 'ET',
    name: 'Ethiopia',
    nativeName: 'ኢትዮጵያ',
    flag: '🇪🇹',
    region: 'Africa',
    subregion: 'Eastern Africa',
    capital: 'Addis Ababa',
    currency: 'ETB',
    currencySymbol: 'Br',
    languages: ['Amharic', 'Oromo', 'Tigrinya', 'English'],
    timezones: ['UTC+03:00'],
    callingCode: '+251',
    healthcareSystem: 'Community-based',
    telemedicineRegulated: false,
    popularSpecialties: ['Infectious Diseases', 'Nutrition', 'Obstetrics', 'Surgery']
  },
  {
    code: 'TZ',
    name: 'Tanzania',
    nativeName: 'Tanzania',
    flag: '🇹🇿',
    region: 'Africa',
    subregion: 'Eastern Africa',
    capital: 'Dodoma',
    currency: 'TZS',
    currencySymbol: 'TSh',
    languages: ['Swahili', 'English'],
    timezones: ['UTC+03:00'],
    callingCode: '+255',
    healthcareSystem: 'Public-private mix',
    telemedicineRegulated: true,
    popularSpecialties: ['Malaria Treatment', 'HIV/AIDS', 'Maternal Health', 'Surgery']
  },
  {
    code: 'UG',
    name: 'Uganda',
    nativeName: 'Uganda',
    flag: '🇺🇬',
    region: 'Africa',
    subregion: 'Eastern Africa',
    capital: 'Kampala',
    currency: 'UGX',
    currencySymbol: 'USh',
    languages: ['English', 'Swahili', 'Luganda'],
    timezones: ['UTC+03:00'],
    callingCode: '+256',
    healthcareSystem: 'Public-private mix',
    telemedicineRegulated: true,
    popularSpecialties: ['Infectious Diseases', 'Obstetrics', 'Pediatrics', 'Surgery']
  },
  {
    code: 'RW',
    name: 'Rwanda',
    nativeName: 'Rwanda',
    flag: '🇷🇼',
    region: 'Africa',
    subregion: 'Eastern Africa',
    capital: 'Kigali',
    currency: 'RWF',
    currencySymbol: 'FRw',
    languages: ['Kinyarwanda', 'English', 'French'],
    timezones: ['UTC+02:00'],
    callingCode: '+250',
    healthcareSystem: 'Community-based insurance',
    telemedicineRegulated: true,
    popularSpecialties: ['Maternal Health', 'Infectious Diseases', 'Surgery', 'Internal Medicine']
  },
  {
    code: 'ZM',
    name: 'Zambia',
    nativeName: 'Zambia',
    flag: '🇿🇲',
    region: 'Africa',
    subregion: 'Southern Africa',
    capital: 'Lusaka',
    currency: 'ZMW',
    currencySymbol: 'ZK',
    languages: ['English', 'Bemba', 'Nyanja'],
    timezones: ['UTC+02:00'],
    callingCode: '+260',
    healthcareSystem: 'Public-private mix',
    telemedicineRegulated: true,
    popularSpecialties: ['HIV/AIDS', 'Malaria', 'Tuberculosis', 'Maternal Health']
  },
  {
    code: 'ZW',
    name: 'Zimbabwe',
    nativeName: 'Zimbabwe',
    flag: '🇿🇼',
    region: 'Africa',
    subregion: 'Southern Africa',
    capital: 'Harare',
    currency: 'ZWL',
    currencySymbol: '$',
    languages: ['English', 'Shona', 'Ndebele'],
    timezones: ['UTC+02:00'],
    callingCode: '+263',
    healthcareSystem: 'Public-private mix',
    telemedicineRegulated: true,
    popularSpecialties: ['HIV/AIDS', 'Oncology', 'Cardiology', 'Surgery']
  },
  {
    code: 'BW',
    name: 'Botswana',
    nativeName: 'Botswana',
    flag: '🇧🇼',
    region: 'Africa',
    subregion: 'Southern Africa',
    capital: 'Gaborone',
    currency: 'BWP',
    currencySymbol: 'P',
    languages: ['English', 'Tswana'],
    timezones: ['UTC+02:00'],
    callingCode: '+267',
    healthcareSystem: 'Public-private mix',
    telemedicineRegulated: true,
    popularSpecialties: ['HIV/AIDS', 'Cardiology', 'Oncology', 'Internal Medicine']
  },
  {
    code: 'MZ',
    name: 'Mozambique',
    nativeName: 'Moçambique',
    flag: '🇲🇿',
    region: 'Africa',
    subregion: 'Southern Africa',
    capital: 'Maputo',
    currency: 'MZN',
    currencySymbol: 'MT',
    languages: ['Portuguese', 'Swahili'],
    timezones: ['UTC+02:00'],
    callingCode: '+258',
    healthcareSystem: 'Public-private mix',
    telemedicineRegulated: false,
    popularSpecialties: ['Malaria', 'HIV/AIDS', 'Tuberculosis', 'Maternal Health']
  },
  {
    code: 'AO',
    name: 'Angola',
    nativeName: 'Angola',
    flag: '🇦🇴',
    region: 'Africa',
    subregion: 'Central Africa',
    capital: 'Luanda',
    currency: 'AOA',
    currencySymbol: 'Kz',
    languages: ['Portuguese', 'Kimbundu', 'Umbundu'],
    timezones: ['UTC+01:00'],
    callingCode: '+244',
    healthcareSystem: 'Public-private mix',
    telemedicineRegulated: false,
    popularSpecialties: ['Infectious Diseases', 'Surgery', 'Internal Medicine', 'Pediatrics']
  },
  {
    code: 'CM',
    name: 'Cameroon',
    nativeName: 'Cameroun',
    flag: '🇨🇲',
    region: 'Africa',
    subregion: 'Central Africa',
    capital: 'Yaoundé',
    currency: 'XAF',
    currencySymbol: 'FCFA',
    languages: ['English', 'French', 'Pidgin'],
    timezones: ['UTC+01:00'],
    callingCode: '+237',
    healthcareSystem: 'Public-private mix',
    telemedicineRegulated: true,
    popularSpecialties: ['Malaria', 'HIV/AIDS', 'Cardiology', 'Surgery']
  },
  {
    code: 'CD',
    name: 'Democratic Republic of the Congo',
    nativeName: 'République démocratique du Congo',
    flag: '🇨🇩',
    region: 'Africa',
    subregion: 'Central Africa',
    capital: 'Kinshasa',
    currency: 'CDF',
    currencySymbol: 'FC',
    languages: ['French', 'Lingala', 'Swahili'],
    timezones: ['UTC+01:00', 'UTC+02:00'],
    callingCode: '+243',
    healthcareSystem: 'Public-private mix',
    telemedicineRegulated: false,
    popularSpecialties: ['Infectious Diseases', 'Malaria', 'HIV/AIDS', 'Surgery']
  },
  {
    code: 'CG',
    name: 'Republic of the Congo',
    nativeName: 'République du Congo',
    flag: '🇨🇬',
    region: 'Africa',
    subregion: 'Central Africa',
    capital: 'Brazzaville',
    currency: 'XAF',
    currencySymbol: 'FCFA',
    languages: ['French', 'Lingala'],
    timezones: ['UTC+01:00'],
    callingCode: '+242',
    healthcareSystem: 'Public-private mix',
    telemedicineRegulated: false,
    popularSpecialties: ['Infectious Diseases', 'Internal Medicine', 'Surgery', 'Pediatrics']
  },
  {
    code: 'GA',
    name: 'Gabon',
    nativeName: 'Gabon',
    flag: '🇬🇦',
    region: 'Africa',
    subregion: 'Central Africa',
    capital: 'Libreville',
    currency: 'XAF',
    currencySymbol: 'FCFA',
    languages: ['French', 'Fang'],
    timezones: ['UTC+01:00'],
    callingCode: '+241',
    healthcareSystem: 'Public-private mix',
    telemedicineRegulated: false,
    popularSpecialties: ['Cardiology', 'Internal Medicine', 'Surgery', 'Pediatrics']
  },
  {
    code: 'GQ',
    name: 'Equatorial Guinea',
    nativeName: 'Guinea Ecuatorial',
    flag: '🇬🇶',
    region: 'Africa',
    subregion: 'Central Africa',
    capital: 'Malabo',
    currency: 'XAF',
    currencySymbol: 'FCFA',
    languages: ['Spanish', 'French', 'Portuguese'],
    timezones: ['UTC+01:00'],
    callingCode: '+240',
    healthcareSystem: 'Public-private mix',
    telemedicineRegulated: false,
    popularSpecialties: ['Infectious Diseases', 'Internal Medicine', 'Surgery', 'Pediatrics']
  },
  {
    code: 'TD',
    name: 'Chad',
    nativeName: 'Tchad',
    flag: '🇹🇩',
    region: 'Africa',
    subregion: 'Central Africa',
    capital: 'N\'Djamena',
    currency: 'XAF',
    currencySymbol: 'FCFA',
    languages: ['Arabic', 'French'],
    timezones: ['UTC+01:00'],
    callingCode: '+235',
    healthcareSystem: 'Public-private mix',
    telemedicineRegulated: false,
    popularSpecialties: ['Infectious Diseases', 'Malaria', 'Internal Medicine', 'Surgery']
  },
  {
    code: 'CF',
    name: 'Central African Republic',
    nativeName: 'République centrafricaine',
    flag: '🇨🇫',
    region: 'Africa',
    subregion: 'Central Africa',
    capital: 'Bangui',
    currency: 'XAF',
    currencySymbol: 'FCFA',
    languages: ['French', 'Sango'],
    timezones: ['UTC+01:00'],
    callingCode: '+236',
    healthcareSystem: 'Public-private mix',
    telemedicineRegulated: false,
    popularSpecialties: ['Infectious Diseases', 'Malaria', 'Internal Medicine', 'Surgery']
  },
  {
    code: 'SS',
    name: 'South Sudan',
    nativeName: 'South Sudan',
    flag: '🇸🇸',
    region: 'Africa',
    subregion: 'Eastern Africa',
    capital: 'Juba',
    currency: 'SSP',
    currencySymbol: '£',
    languages: ['English', 'Arabic'],
    timezones: ['UTC+02:00'],
    callingCode: '+211',
    healthcareSystem: 'Public-private mix',
    telemedicineRegulated: false,
    popularSpecialties: ['Infectious Diseases', 'Malaria', 'Internal Medicine', 'Surgery']
  },
  {
    code: 'ER',
    name: 'Eritrea',
    nativeName: 'ኤርትራ',
    flag: '🇪🇷',
    region: 'Africa',
    subregion: 'Eastern Africa',
    capital: 'Asmara',
    currency: 'ERN',
    currencySymbol: 'Nfk',
    languages: ['Tigrinya', 'Arabic', 'English'],
    timezones: ['UTC+03:00'],
    callingCode: '+291',
    healthcareSystem: 'Public-private mix',
    telemedicineRegulated: false,
    popularSpecialties: ['Infectious Diseases', 'Internal Medicine', 'Surgery', 'Pediatrics']
  },
  {
    code: 'DJ',
    name: 'Djibouti',
    nativeName: 'Djibouti',
    flag: '🇩🇯',
    region: 'Africa',
    subregion: 'Eastern Africa',
    capital: 'Djibouti',
    currency: 'DJF',
    currencySymbol: 'Fdj',
    languages: ['Arabic', 'French'],
    timezones: ['UTC+03:00'],
    callingCode: '+253',
    healthcareSystem: 'Public-private mix',
    telemedicineRegulated: false,
    popularSpecialties: ['Infectious Diseases', 'Internal Medicine', 'Surgery', 'Pediatrics']
  },
  {
    code: 'SO',
    name: 'Somalia',
    nativeName: 'Soomaaliya',
    flag: '🇸🇴',
    region: 'Africa',
    subregion: 'Eastern Africa',
    capital: 'Mogadishu',
    currency: 'SOS',
    currencySymbol: 'Sh',
    languages: ['Somali', 'Arabic', 'English'],
    timezones: ['UTC+03:00'],
    callingCode: '+252',
    healthcareSystem: 'Public-private mix',
    telemedicineRegulated: false,
    popularSpecialties: ['Infectious Diseases', 'Internal Medicine', 'Surgery', 'Pediatrics']
  },
  {
    code: 'SD',
    name: 'Sudan',
    nativeName: 'السودان',
    flag: '🇸🇩',
    region: 'Africa',
    subregion: 'Northern Africa',
    capital: 'Khartoum',
    currency: 'SDG',
    currencySymbol: '£',
    languages: ['Arabic', 'English'],
    timezones: ['UTC+02:00'],
    callingCode: '+249',
    healthcareSystem: 'Public-private mix',
    telemedicineRegulated: false,
    popularSpecialties: ['Infectious Diseases', 'Internal Medicine', 'Surgery', 'Pediatrics']
  },
  {
    code: 'LY',
    name: 'Libya',
    nativeName: 'ليبيا',
    flag: '🇱🇾',
    region: 'Africa',
    subregion: 'Northern Africa',
    capital: 'Tripoli',
    currency: 'LYD',
    currencySymbol: 'ل.د',
    languages: ['Arabic', 'English'],
    timezones: ['UTC+02:00'],
    callingCode: '+218',
    healthcareSystem: 'Public-private mix',
    telemedicineRegulated: false,
    popularSpecialties: ['Internal Medicine', 'Surgery', 'Cardiology', 'Pediatrics']
  },
  {
    code: 'DZ',
    name: 'Algeria',
    nativeName: 'الجزائر',
    flag: '🇩🇿',
    region: 'Africa',
    subregion: 'Northern Africa',
    capital: 'Algiers',
    currency: 'DZD',
    currencySymbol: 'د.ج',
    languages: ['Arabic', 'Berber', 'French'],
    timezones: ['UTC+01:00'],
    callingCode: '+213',
    healthcareSystem: 'Universal healthcare',
    telemedicineRegulated: true,
    popularSpecialties: ['Cardiology', 'Neurology', 'Surgery', 'Internal Medicine']
  },
  {
    code: 'NE',
    name: 'Niger',
    nativeName: 'Niger',
    flag: '🇳🇪',
    region: 'Africa',
    subregion: 'Western Africa',
    capital: 'Niamey',
    currency: 'XOF',
    currencySymbol: 'CFA',
    languages: ['French', 'Hausa'],
    timezones: ['UTC+01:00'],
    callingCode: '+227',
    healthcareSystem: 'Public-private mix',
    telemedicineRegulated: false,
    popularSpecialties: ['Infectious Diseases', 'Malaria', 'Internal Medicine', 'Pediatrics']
  },
  {
    code: 'ML',
    name: 'Mali',
    nativeName: 'Mali',
    flag: '🇲🇱',
    region: 'Africa',
    subregion: 'Western Africa',
    capital: 'Bamako',
    currency: 'XOF',
    currencySymbol: 'CFA',
    languages: ['French', 'Bambara'],
    timezones: ['UTC+00:00'],
    callingCode: '+223',
    healthcareSystem: 'Public-private mix',
    telemedicineRegulated: false,
    popularSpecialties: ['Infectious Diseases', 'Malaria', 'Internal Medicine', 'Pediatrics']
  },
  {
    code: 'SN',
    name: 'Senegal',
    nativeName: 'Sénégal',
    flag: '🇸🇳',
    region: 'Africa',
    subregion: 'Western Africa',
    capital: 'Dakar',
    currency: 'XOF',
    currencySymbol: 'CFA',
    languages: ['French', 'Wolof'],
    timezones: ['UTC+00:00'],
    callingCode: '+221',
    healthcareSystem: 'Universal coverage',
    telemedicineRegulated: true,
    popularSpecialties: ['Cardiology', 'Internal Medicine', 'Surgery', 'Pediatrics']
  },
  {
    code: 'GM',
    name: 'Gambia',
    nativeName: 'Gambia',
    flag: '🇬🇲',
    region: 'Africa',
    subregion: 'Western Africa',
    capital: 'Banjul',
    currency: 'GMD',
    currencySymbol: 'D',
    languages: ['English', 'Mandinka'],
    timezones: ['UTC+00:00'],
    callingCode: '+220',
    healthcareSystem: 'Public-private mix',
    telemedicineRegulated: false,
    popularSpecialties: ['Infectious Diseases', 'Internal Medicine', 'Surgery', 'Pediatrics']
  },
  {
    code: 'GN',
    name: 'Guinea',
    nativeName: 'Guinée',
    flag: '🇬🇳',
    region: 'Africa',
    subregion: 'Western Africa',
    capital: 'Conakry',
    currency: 'GNF',
    currencySymbol: 'FG',
    languages: ['French', 'Pular'],
    timezones: ['UTC+00:00'],
    callingCode: '+224',
    healthcareSystem: 'Public-private mix',
    telemedicineRegulated: false,
    popularSpecialties: ['Infectious Diseases', 'Malaria', 'Internal Medicine', 'Pediatrics']
  },
  {
    code: 'SL',
    name: 'Sierra Leone',
    nativeName: 'Sierra Leone',
    flag: '🇸🇱',
    region: 'Africa',
    subregion: 'Western Africa',
    capital: 'Freetown',
    currency: 'SLL',
    currencySymbol: 'Le',
    languages: ['English', 'Krio'],
    timezones: ['UTC+00:00'],
    callingCode: '+232',
    healthcareSystem: 'Public-private mix',
    telemedicineRegulated: false,
    popularSpecialties: ['Infectious Diseases', 'Malaria', 'Internal Medicine', 'Pediatrics']
  },
  {
    code: 'LR',
    name: 'Liberia',
    nativeName: 'Liberia',
    flag: '🇱🇷',
    region: 'Africa',
    subregion: 'Western Africa',
    capital: 'Monrovia',
    currency: 'LRD',
    currencySymbol: '$',
    languages: ['English'],
    timezones: ['UTC+00:00'],
    callingCode: '+231',
    healthcareSystem: 'Public-private mix',
    telemedicineRegulated: false,
    popularSpecialties: ['Infectious Diseases', 'Malaria', 'Internal Medicine', 'Pediatrics']
  },
  {
    code: 'CI',
    name: 'Ivory Coast',
    nativeName: 'Côte d\'Ivoire',
    flag: '🇨🇮',
    region: 'Africa',
    subregion: 'Western Africa',
    capital: 'Yamoussoukro',
    currency: 'XOF',
    currencySymbol: 'CFA',
    languages: ['French', 'Dyula'],
    timezones: ['UTC+00:00'],
    callingCode: '+225',
    healthcareSystem: 'Universal coverage',
    telemedicineRegulated: true,
    popularSpecialties: ['Cardiology', 'Internal Medicine', 'Surgery', 'Pediatrics']
  },
  {
    code: 'BF',
    name: 'Burkina Faso',
    nativeName: 'Burkina Faso',
    flag: '🇧🇫',
    region: 'Africa',
    subregion: 'Western Africa',
    capital: 'Ouagadougou',
    currency: 'XOF',
    currencySymbol: 'CFA',
    languages: ['French', 'Mossi'],
    timezones: ['UTC+00:00'],
    callingCode: '+226',
    healthcareSystem: 'Public-private mix',
    telemedicineRegulated: false,
    popularSpecialties: ['Infectious Diseases', 'Malaria', 'Internal Medicine', 'Pediatrics']
  },
  {
    code: 'TG',
    name: 'Togo',
    nativeName: 'Togo',
    flag: '🇹🇬',
    region: 'Africa',
    subregion: 'Western Africa',
    capital: 'Lomé',
    currency: 'XOF',
    currencySymbol: 'CFA',
    languages: ['French', 'Ewe'],
    timezones: ['UTC+00:00'],
    callingCode: '+228',
    healthcareSystem: 'Universal coverage',
    telemedicineRegulated: true,
    popularSpecialties: ['Cardiology', 'Internal Medicine', 'Surgery', 'Pediatrics']
  },
  {
    code: 'BJ',
    name: 'Benin',
    nativeName: 'Bénin',
    flag: '🇧🇯',
    region: 'Africa',
    subregion: 'Western Africa',
    capital: 'Porto-Novo',
    currency: 'XOF',
    currencySymbol: 'CFA',
    languages: ['French', 'Yoruba'],
    timezones: ['UTC+01:00'],
    callingCode: '+229',
    healthcareSystem: 'Universal coverage',
    telemedicineRegulated: true,
    popularSpecialties: ['Cardiology', 'Internal Medicine', 'Surgery', 'Pediatrics']
  },
  {
    code: 'CV',
    name: 'Cape Verde',
    nativeName: 'Cabo Verde',
    flag: '🇨🇻',
    region: 'Africa',
    subregion: 'Western Africa',
    capital: 'Praia',
    currency: 'CVE',
    currencySymbol: '$',
    languages: ['Portuguese', 'Crioulo'],
    timezones: ['UTC-01:00'],
    callingCode: '+238',
    healthcareSystem: 'Universal coverage',
    telemedicineRegulated: false,
    popularSpecialties: ['Cardiology', 'Internal Medicine', 'Surgery', 'Pediatrics']
  },
  {
    code: 'ST',
    name: 'São Tomé and Príncipe',
    nativeName: 'São Tomé e Príncipe',
    flag: '🇸🇹',
    region: 'Africa',
    subregion: 'Central Africa',
    capital: 'São Tomé',
    currency: 'STN',
    currencySymbol: 'Db',
    languages: ['Portuguese'],
    timezones: ['UTC+00:00'],
    callingCode: '+239',
    healthcareSystem: 'Public-private mix',
    telemedicineRegulated: false,
    popularSpecialties: ['Internal Medicine', 'Surgery', 'Pediatrics', 'Obstetrics']
  },
  {
    code: 'BI',
    name: 'Burundi',
    nativeName: 'Burundi',
    flag: '🇧🇮',
    region: 'Africa',
    subregion: 'Eastern Africa',
    capital: 'Bujumbura',
    currency: 'BIF',
    currencySymbol: 'FBu',
    languages: ['Kirundi', 'French', 'English'],
    timezones: ['UTC+02:00'],
    callingCode: '+257',
    healthcareSystem: 'Public-private mix',
    telemedicineRegulated: false,
    popularSpecialties: ['Infectious Diseases', 'Internal Medicine', 'Surgery', 'Pediatrics']
  },
  {
    code: 'MW',
    name: 'Malawi',
    nativeName: 'Malawi',
    flag: '🇲🇼',
    region: 'Africa',
    subregion: 'Southern Africa',
    capital: 'Lilongwe',
    currency: 'MWK',
    currencySymbol: 'MK',
    languages: ['English', 'Chichewa'],
    timezones: ['UTC+02:00'],
    callingCode: '+265',
    healthcareSystem: 'Public-private mix',
    telemedicineRegulated: true,
    popularSpecialties: ['HIV/AIDS', 'Malaria', 'Tuberculosis', 'Maternal Health']
  },
  {
    code: 'LS',
    name: 'Lesotho',
    nativeName: 'Lesotho',
    flag: '🇱🇸',
    region: 'Africa',
    subregion: 'Southern Africa',
    capital: 'Maseru',
    currency: 'LSL',
    currencySymbol: 'L',
    languages: ['English', 'Sesotho'],
    timezones: ['UTC+02:00'],
    callingCode: '+266',
    healthcareSystem: 'Public-private mix',
    telemedicineRegulated: false,
    popularSpecialties: ['HIV/AIDS', 'Internal Medicine', 'Surgery', 'Pediatrics']
  },
  {
    code: 'SZ',
    name: 'Eswatini',
    nativeName: 'Eswatini',
    flag: '🇸🇿',
    region: 'Africa',
    subregion: 'Southern Africa',
    capital: 'Mbabane',
    currency: 'SZL',
    currencySymbol: 'L',
    languages: ['English', 'Swazi'],
    timezones: ['UTC+02:00'],
    callingCode: '+268',
    healthcareSystem: 'Public-private mix',
    telemedicineRegulated: false,
    popularSpecialties: ['HIV/AIDS', 'Internal Medicine', 'Surgery', 'Pediatrics']
  },
  {
    code: 'KM',
    name: 'Comoros',
    nativeName: 'Komori',
    flag: '🇰🇲',
    region: 'Africa',
    subregion: 'Eastern Africa',
    capital: 'Moroni',
    currency: 'KMF',
    currencySymbol: 'CF',
    languages: ['Arabic', 'French', 'Comorian'],
    timezones: ['UTC+03:00'],
    callingCode: '+269',
    healthcareSystem: 'Public-private mix',
    telemedicineRegulated: false,
    popularSpecialties: ['Internal Medicine', 'Surgery', 'Pediatrics', 'Obstetrics']
  },
  {
    code: 'SC',
    name: 'Seychelles',
    nativeName: 'Sesel',
    flag: '🇸🇨',
    region: 'Africa',
    subregion: 'Eastern Africa',
    capital: 'Victoria',
    currency: 'SCR',
    currencySymbol: '₨',
    languages: ['English', 'French', 'Seselwa'],
    timezones: ['UTC+04:00'],
    callingCode: '+248',
    healthcareSystem: 'Universal coverage',
    telemedicineRegulated: true,
    popularSpecialties: ['Cardiology', 'Internal Medicine', 'Surgery', 'Tourism Medicine']
  },
  {
    code: 'MU',
    name: 'Mauritius',
    nativeName: 'Maurice',
    flag: '🇲🇺',
    region: 'Africa',
    subregion: 'Eastern Africa',
    capital: 'Port Louis',
    currency: 'MUR',
    currencySymbol: '₨',
    languages: ['English', 'French', 'Mauritian Creole'],
    timezones: ['UTC+04:00'],
    callingCode: '+230',
    healthcareSystem: 'Universal coverage',
    telemedicineRegulated: true,
    popularSpecialties: ['Cardiology', 'Dermatology', 'Internal Medicine', 'Surgery']
  },
  {
    code: 'MG',
    name: 'Madagascar',
    nativeName: 'Madagasikara',
    flag: '🇲🇬',
    region: 'Africa',
    subregion: 'Southern Africa',
    capital: 'Antananarivo',
    currency: 'MGA',
    currencySymbol: 'Ar',
    languages: ['Malagasy', 'French'],
    timezones: ['UTC+03:00'],
    callingCode: '+261',
    healthcareSystem: 'Public-private mix',
    telemedicineRegulated: false,
    popularSpecialties: ['Infectious Diseases', 'Malaria', 'Internal Medicine', 'Surgery']
  },

  // ===== ASIA =====
  {
    code: 'IN',
    name: 'India',
    nativeName: 'भारत',
    flag: '🇮🇳',
    region: 'Asia',
    subregion: 'Southern Asia',
    capital: 'New Delhi',
    currency: 'INR',
    currencySymbol: '₹',
    languages: ['Hindi', 'English'],
    timezones: ['UTC+05:30'],
    callingCode: '+91',
    healthcareSystem: 'Mixed public-private',
    telemedicineRegulated: true,
    popularSpecialties: ['Cardiology', 'Neurology', 'Orthopedics', 'Dermatology']
  },
  {
    code: 'CN',
    name: 'China',
    nativeName: '中国',
    flag: '🇨🇳',
    region: 'Asia',
    subregion: 'Eastern Asia',
    capital: 'Beijing',
    currency: 'CNY',
    currencySymbol: '¥',
    languages: ['Mandarin'],
    timezones: ['UTC+08:00'],
    callingCode: '+86',
    healthcareSystem: 'Universal healthcare',
    telemedicineRegulated: true,
    popularSpecialties: ['Traditional Medicine', 'Cardiology', 'Oncology', 'Neurology']
  },
  {
    code: 'JP',
    name: 'Japan',
    nativeName: '日本',
    flag: '🇯🇵',
    region: 'Asia',
    subregion: 'Eastern Asia',
    capital: 'Tokyo',
    currency: 'JPY',
    currencySymbol: '¥',
    languages: ['Japanese'],
    timezones: ['UTC+09:00'],
    callingCode: '+81',
    healthcareSystem: 'Universal healthcare',
    telemedicineRegulated: true,
    popularSpecialties: ['Geriatrics', 'Cardiology', 'Oncology', 'Mental Health']
  },
  // ===== AMERICAS =====
  {
    code: 'US',
    name: 'United States',
    nativeName: 'United States',
    flag: '🇺🇸',
    region: 'Americas',
    subregion: 'Northern America',
    capital: 'Washington, D.C.',
    currency: 'USD',
    currencySymbol: '$',
    languages: ['English'],
    timezones: ['UTC-12:00', 'UTC-11:00', 'UTC-10:00', 'UTC-09:00', 'UTC-08:00', 'UTC-07:00', 'UTC-06:00', 'UTC-05:00', 'UTC-04:00', 'UTC+10:00', 'UTC+11:00'],
    callingCode: '+1',
    healthcareSystem: 'Mixed public-private',
    telemedicineRegulated: true,
    popularSpecialties: ['Primary Care', 'Cardiology', 'Orthopedics', 'Mental Health']
  },
  {
    code: 'CA',
    name: 'Canada',
    nativeName: 'Canada',
    flag: '🇨🇦',
    region: 'Americas',
    subregion: 'Northern America',
    capital: 'Ottawa',
    currency: 'CAD',
    currencySymbol: '$',
    languages: ['English', 'French'],
    timezones: ['UTC-08:00', 'UTC-07:00', 'UTC-06:00', 'UTC-05:00', 'UTC-04:00', 'UTC-03:30', 'UTC+10:00'],
    callingCode: '+1',
    healthcareSystem: 'Universal healthcare',
    telemedicineRegulated: true,
    popularSpecialties: ['Family Medicine', 'Cardiology', 'Mental Health', 'Sports Medicine']
  },
  {
    code: 'MX',
    name: 'Mexico',
    nativeName: 'México',
    flag: '🇲🇽',
    region: 'Americas',
    subregion: 'Northern America',
    capital: 'Mexico City',
    currency: 'MXN',
    currencySymbol: '$',
    languages: ['Spanish'],
    timezones: ['UTC-08:00', 'UTC-07:00', 'UTC-06:00'],
    callingCode: '+52',
    healthcareSystem: 'Mixed public-private',
    telemedicineRegulated: true,
    popularSpecialties: ['Family Medicine', 'Cardiology', 'Dermatology', 'Internal Medicine']
  },
  {
    code: 'BR',
    name: 'Brazil',
    nativeName: 'Brasil',
    flag: '🇧🇷',
    region: 'Americas',
    subregion: 'South America',
    capital: 'Brasília',
    currency: 'BRL',
    currencySymbol: 'R$',
    languages: ['Portuguese'],
    timezones: ['UTC-05:00', 'UTC-04:00', 'UTC-03:00', 'UTC-02:00'],
    callingCode: '+55',
    healthcareSystem: 'Universal healthcare',
    telemedicineRegulated: true,
    popularSpecialties: ['Cardiology', 'Dermatology', 'Plastic Surgery', 'Sports Medicine']
  },
  {
    code: 'AR',
    name: 'Argentina',
    nativeName: 'Argentina',
    flag: '🇦🇷',
    region: 'Americas',
    subregion: 'South America',
    capital: 'Buenos Aires',
    currency: 'ARS',
    currencySymbol: '$',
    languages: ['Spanish'],
    timezones: ['UTC-03:00'],
    callingCode: '+54',
    healthcareSystem: 'Mixed public-private',
    telemedicineRegulated: true,
    popularSpecialties: ['Cardiology', 'Sports Medicine', 'Mental Health', 'Dermatology']
  },
  {
    code: 'CO',
    name: 'Colombia',
    nativeName: 'Colombia',
    flag: '🇨🇴',
    region: 'Americas',
    subregion: 'South America',
    capital: 'Bogotá',
    currency: 'COP',
    currencySymbol: '$',
    languages: ['Spanish'],
    timezones: ['UTC-05:00'],
    callingCode: '+57',
    healthcareSystem: 'Mixed public-private',
    telemedicineRegulated: true,
    popularSpecialties: ['Family Medicine', 'Cardiology', 'Mental Health', 'Internal Medicine']
  },
  {
    code: 'PE',
    name: 'Peru',
    nativeName: 'Perú',
    flag: '🇵🇪',
    region: 'Americas',
    subregion: 'South America',
    capital: 'Lima',
    currency: 'PEN',
    currencySymbol: 'S/',
    languages: ['Spanish', 'Quechua', 'Aymara'],
    timezones: ['UTC-05:00'],
    callingCode: '+51',
    healthcareSystem: 'Mixed public-private',
    telemedicineRegulated: true,
    popularSpecialties: ['Family Medicine', 'Cardiology', 'Dermatology', 'Mental Health']
  },
  {
    code: 'CL',
    name: 'Chile',
    nativeName: 'Chile',
    flag: '🇨🇱',
    region: 'Americas',
    subregion: 'South America',
    capital: 'Santiago',
    currency: 'CLP',
    currencySymbol: '$',
    languages: ['Spanish'],
    timezones: ['UTC-06:00', 'UTC-04:00'],
    callingCode: '+56',
    healthcareSystem: 'Mixed public-private',
    telemedicineRegulated: true,
    popularSpecialties: ['Cardiology', 'Sports Medicine', 'Mental Health', 'Dermatology']
  },
  {
    code: 'VE',
    name: 'Venezuela',
    nativeName: 'Venezuela',
    flag: '🇻🇪',
    region: 'Americas',
    subregion: 'South America',
    capital: 'Caracas',
    currency: 'VES',
    currencySymbol: 'Bs.',
    languages: ['Spanish'],
    timezones: ['UTC-04:00'],
    callingCode: '+58',
    healthcareSystem: 'Mixed public-private',
    telemedicineRegulated: false,
    popularSpecialties: ['Family Medicine', 'Internal Medicine', 'Pediatrics', 'Mental Health']
  }
];

// Helper functions
export const getCountryByCode = (code: string): Country | undefined => {
  return COUNTRIES.find(country => country.code === code.toUpperCase());
};

export const getCountriesByRegion = (region: string): Country[] => {
  return COUNTRIES.filter(country => country.region === region);
};

export const getCountriesBySubregion = (subregion: string): Country[] => {
  return COUNTRIES.filter(country => country.subregion === subregion);
};

export const getAfricanCountries = (): Country[] => {
  return getCountriesByRegion('Africa');
};

export const getAmericanCountries = (): Country[] => {
  return getCountriesByRegion('Americas');
};

export const getNorthAmericanCountries = (): Country[] => {
  return getCountriesBySubregion('Northern America');
};

export const getSouthAmericanCountries = (): Country[] => {
  return getCountriesBySubregion('South America');
};

export const getPopularCountries = (): Country[] => {
  // Return most commonly used countries for quick access
  const popularCodes = ['US', 'CA', 'BR', 'MX', 'AR', 'CO', 'NG', 'ZA', 'EG', 'KE', 'GH', 'MA'];
  return popularCodes.map(code => getCountryByCode(code)).filter(Boolean) as Country[];
};

export const searchCountries = (query: string): Country[] => {
  const lowercaseQuery = query.toLowerCase();
  return COUNTRIES.filter(country =>
    country.name.toLowerCase().includes(lowercaseQuery) ||
    country.nativeName.toLowerCase().includes(lowercaseQuery) ||
    country.code.toLowerCase().includes(lowercaseQuery)
  );
};

// Smart country selection algorithm
export const getSmartCountrySuggestions = (userTimezone?: string, userLanguage?: string): Country[] => {
  const allCountries = COUNTRIES;

  // 1. Detect region based on timezone
  let detectedRegion = 'Africa'; // Default to Africa

  if (userTimezone) {
    // North America timezones
    if (userTimezone.includes('UTC-') && ['04', '05', '06', '07', '08', '09', '10', '11', '12'].some(tz => userTimezone.includes(tz))) {
      detectedRegion = 'Americas';
    }
    // South America timezones
    else if (userTimezone.includes('UTC-') && ['02', '03', '04', '05'].some(tz => userTimezone.includes(tz))) {
      detectedRegion = 'Americas';
    }
    // Africa timezones (UTC+0 to UTC+4)
    else if (userTimezone.includes('UTC+') && ['00', '01', '02', '03', '04'].some(tz => userTimezone.includes(tz))) {
      detectedRegion = 'Africa';
    }
  }

  // 2. Detect subregion based on language
  let detectedSubregion = '';

  if (userLanguage) {
    const lang = userLanguage.toLowerCase();
    if (lang.includes('es') || lang.includes('spanish')) {
      detectedSubregion = detectedRegion === 'Americas' ? 'South America' : 'Northern Africa';
    } else if (lang.includes('pt') || lang.includes('portuguese')) {
      detectedSubregion = 'South America';
    } else if (lang.includes('fr') || lang.includes('french')) {
      detectedSubregion = 'Northern Africa';
    } else if (lang.includes('ar') || lang.includes('arabic')) {
      detectedSubregion = 'Northern Africa';
    }
  }

  // 3. Prioritize countries based on detection
  const prioritizedCountries = allCountries.sort((a, b) => {
    let scoreA = 0;
    let scoreB = 0;

    // Region match gets highest priority
    if (a.region === detectedRegion) scoreA += 10;
    if (b.region === detectedRegion) scoreB += 10;

    // Subregion match gets additional priority
    if (a.subregion === detectedSubregion) scoreA += 5;
    if (b.subregion === detectedSubregion) scoreB += 5;

    // Language match
    if (userLanguage && a.languages.some(lang => lang.toLowerCase().includes(userLanguage.toLowerCase()))) scoreA += 3;
    if (userLanguage && b.languages.some(lang => lang.toLowerCase().includes(userLanguage.toLowerCase()))) scoreB += 3;

    // Telemedicine regulation
    if (a.telemedicineRegulated) scoreA += 2;
    if (b.telemedicineRegulated) scoreB += 2;

    // Popular countries get slight boost
    const popularCodes = ['US', 'CA', 'BR', 'NG', 'ZA', 'EG', 'KE'];
    if (popularCodes.includes(a.code)) scoreA += 1;
    if (popularCodes.includes(b.code)) scoreB += 1;

    return scoreB - scoreA; // Higher score first
  });

  return prioritizedCountries.slice(0, 12); // Return top 12 suggestions
};

// Function to detect country from phone number
export const getCountryFromPhoneNumber = (phoneNumber: string): Country | null => {
  if (!phoneNumber || !phoneNumber.startsWith('+')) {
    return null;
  }

  // Extract the calling code from the phone number
  // Try different lengths of calling codes (1-4 digits)
  for (let length = 4; length >= 1; length--) {
    const callingCode = phoneNumber.substring(0, length + 1); // +1 for the +
    const country = COUNTRIES.find(c => c.callingCode === callingCode);
    if (country) {
      return country;
    }
  }

  return null;
};
