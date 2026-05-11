import { buildCourseMarkdown } from '@/lib/server/courseExport';

export const dynamic = 'force-static';

export function GET() {
  return new Response(buildCourseMarkdown(), {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Content-Disposition': 'attachment; filename="cts-ai-course-guide.md"',
    },
  });
}
