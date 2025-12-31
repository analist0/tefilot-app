interface JsonLdProps {
  data: Record<string, unknown>
}

export function JsonLd({ data }: JsonLdProps) {
  // Escape closing script tags to prevent XSS
  const jsonString = JSON.stringify(data).replace(/<\/script>/gi, '<\\/script>')

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: jsonString,
      }}
    />
  )
}
