import { requirePermission } from "@/lib/auth";
import { admin } from "@/services";
import { CornerEditor } from "./CornerEditor";

/** FR-NEWS-03 (admin side): curate student work — writing, artwork, handicrafts and any other activity. */
export default async function AdminStudentCornerPage() {
  await requirePermission("corner:manage");
  const posts = await admin.cornerPosts();

  return (
    <div className="max-w-3xl">
      <h1 className="font-display text-2xl font-semibold text-green mb-6">Student Corner</h1>
      <CornerEditor
        posts={posts.map((p) => ({
          id: p.id,
          title: p.title,
          body: p.body,
          studentName: p.studentName,
          kind: p.kind,
          published: p.published,
          imageUrl: p.imageUrl,
        }))}
      />
    </div>
  );
}
