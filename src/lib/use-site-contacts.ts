'use client'

import { useEffect, useState } from 'react'

import { fallbackContacts, fetchContactsFromStrapi, type SiteContacts } from './contacts'

// Кэшируем промис на уровне модуля, чтобы несколько компонентов на странице
// (хедер, футер, формы) не дёргали Strapi по отдельности.
let contactsPromise: Promise<SiteContacts> | null = null

function loadContacts(): Promise<SiteContacts> {
  if (!contactsPromise) {
    contactsPromise = fetchContactsFromStrapi()
  }
  return contactsPromise
}

export function useSiteContacts(): SiteContacts {
  const [contacts, setContacts] = useState<SiteContacts>(fallbackContacts)

  useEffect(() => {
    let mounted = true
    loadContacts().then((next) => {
      if (mounted) setContacts(next)
    })
    return () => {
      mounted = false
    }
  }, [])

  return contacts
}
