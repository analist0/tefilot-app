import { getTags } from "@/app/actions/tags"
import { TagsClient } from "@/components/admin/tags-client"

export default async function AdminTagsPage() {
  const tags = await getTags()

  return (
    <div className="space-y-6">
      <TagsClient initialTags={tags} />
    </div>
  )
}
