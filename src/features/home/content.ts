import { Headset, PackageCheck, ShieldCheck, Truck } from 'lucide-react'

export const INDUSTRIES = ['Manufacturing', 'Construction', 'Mining', 'Utilities', 'Agriculture', 'Logistics']

export const CAPABILITIES = [
  { icon: Truck, title: 'Nationwide delivery', text: 'Own trucks for Luzon, partner depots for the Visayas and Mindanao. Most stock items ship within two working days.' },
  { icon: ShieldCheck, title: 'Manufacturer warranty', text: 'Authorised distributor pricing and warranty on every unit, registered with the manufacturer at handover.' },
  { icon: Headset, title: 'Technical support', text: 'Engineers size the equipment for your load, commission it on site and answer the phone when something stops.' },
  { icon: PackageCheck, title: 'Genuine spare parts', text: 'Filters, belts, seals and consumables kept on the shelf for everything we sell, so downtime stays short.' },
]

export const PROCESS = [
  { title: 'Tell us the job', text: 'Add products to a quote or describe the application. Load, duty cycle, site conditions and timeline are all useful.' },
  { title: 'Get a sized quotation', text: 'An engineer checks the specification and returns a written quote with lead times, usually within one working day.' },
  { title: 'Delivery and commissioning', text: 'We deliver, install and test the equipment with your team, and register the warranty.' },
  { title: 'Ongoing support', text: 'Scheduled servicing, spare parts and a phone line to the people who sold you the machine.' },
]
