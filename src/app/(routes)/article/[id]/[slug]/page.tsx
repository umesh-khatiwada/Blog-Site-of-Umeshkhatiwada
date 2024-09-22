// app/(routes)/article/[id]/[slug]/page.tsx
import { generateMetadata } from '@/app/utils/generateMetadata'
import ArticleClient from './ArticleClient'

export { generateMetadata }

export default function Page() {
  return <ArticleClient />
}