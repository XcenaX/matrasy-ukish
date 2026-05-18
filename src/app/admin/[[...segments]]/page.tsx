import { redirect } from 'next/navigation'

export default function AdminPage() {
  redirect(process.env.NEXT_PUBLIC_STRAPI_ADMIN_URL || 'http://127.0.0.1:1337/admin')
}
