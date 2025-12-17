import { type NextRequest, NextResponse } from "next/server"
import { searchArticles } from "@/lib/queries"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const query = searchParams.get("q")

  if (!query) {
    return NextResponse.json({ articles: [] })
  }

  try {
    const articles = await searchArticles(query)
    return NextResponse.json({ articles })
  } catch {
    return NextResponse.json({ articles: [], error: "Search failed" }, { status: 500 })
  }
}
