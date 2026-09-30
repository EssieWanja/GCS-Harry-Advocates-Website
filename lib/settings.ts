// Editable firm details shown across the public site. Shared by the admin
// Settings page (labels, grouping) and the site itself (defaults).

export const settingGroups = [
  {
    title: 'Contact details',
    description: 'Shown in the site header, footer, contact page and home page.',
    fields: [
      { key: 'phonePrimary', label: 'Main telephone', default: '+254 20 516 0344' },
      { key: 'phoneSecondary', label: 'Mobile', default: '+254 735 684 462' },
      { key: 'phoneTertiary', label: 'Second mobile (optional)', default: '+254 723 684 462' },
      { key: 'email', label: 'Email address', default: 'info@harryadvocates.co.ke' },
      { key: 'officeHours', label: 'Office hours', default: 'Monday – Friday, 8:00 AM – 5:00 PM' },
      { key: 'address', label: 'Office address', default: 'Consolidated Bank House, 5th Floor, Suite 508, Koinange Street, Nairobi' },
      { key: 'postalAddress', label: 'Postal address', default: 'P. O. Box 7763-00200, Nairobi' },
    ],
  },
  {
    title: 'Home page figures',
    description: 'The animated numbers in the "Who we are" section of the home page.',
    fields: [
      { key: 'statYears', label: 'Years of practice', default: '10' },
      { key: 'statClients', label: 'Clients served', default: '500' },
      { key: 'statStaff', label: 'Legal professionals', default: '15' },
    ],
  },
  {
    title: 'Social media',
    description: 'Links for the icons in the site footer. Leave blank to hide an icon.',
    fields: [
      { key: 'facebookUrl', label: 'Facebook URL', default: '' },
      { key: 'xUrl', label: 'X (Twitter) URL', default: '' },
      { key: 'linkedinUrl', label: 'LinkedIn URL', default: '' },
    ],
  },
] as const

export type SettingKey = (typeof settingGroups)[number]['fields'][number]['key']
export type SiteSettings = Record<SettingKey, string>

export const settingKeys = settingGroups.flatMap((group) => group.fields.map((field) => field.key)) as SettingKey[]

export const defaultSettings = Object.fromEntries(
  settingGroups.flatMap((group) => group.fields.map((field) => [field.key, field.default])),
) as SiteSettings

export function telHref(phone: string) {
  return `tel:${phone.replace(/[^\d+]/g, '')}`
}
