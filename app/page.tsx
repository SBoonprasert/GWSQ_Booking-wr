import { redirect } from "next/navigation"

export default function HomePage() {
  redirect("/login")

  // This won't be rendered, but is needed for TypeScript
  return null
}
