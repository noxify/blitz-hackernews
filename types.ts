import { SimpleRolesIsAuthorized } from "@blitzjs/auth"
import { User } from "db"
import { LocaleKeys } from "international-types"
import type Locale from "locales/en"

export type Role = "ADMIN" | "USER"

declare module "@blitzjs/auth" {
  export interface Session {
    isAuthorized: SimpleRolesIsAuthorized<Role>
    PublicData: {
      userId: User["id"]
      role: Role
      views?: number
    }
  }
}

export type NavigationLink = {
  name: LocaleKeys<typeof Locale, undefined>
  href: string
  alias?: string
}
