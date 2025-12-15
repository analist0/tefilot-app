import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { HeroSection } from "@/components/home/hero-section"
import { FeaturedArticles } from "@/components/home/featured-articles"
import { CategoriesShowcase } from "@/components/home/categories-showcase"
import { LatestArticles } from "@/components/home/latest-articles"
import { PopularArticles } from "@/components/home/popular-articles"
import { NewsletterSection } from "@/components/home/newsletter-section"

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <FeaturedArticles />
        <CategoriesShowcase />
        <LatestArticles />
        <PopularArticles />
        <NewsletterSection />
      </main>
      <Footer />
    </div>
  )
}
