export interface User {
  activeCommand: string | null
  instagram: {
    hasAccess: boolean
    token: string | null
  }
  media: { url: string; caption: string } | null
}
