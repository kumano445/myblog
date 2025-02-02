import './content.css';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkHtml from 'remark-html';
import Image from 'next/image';
import Layout from '../../../components/Layout';

// ブログ記事ページ
export default async function BlogPost({ params }) {
  const { slug } = params;
  const filePath = path.join(process.cwd(), 'content', `${slug}.md`);

  // ファイルが存在しない場合はエラーを回避
  if (!fs.existsSync(filePath)) {
    return <p className="text-center text-gray-500">記事が見つかりません</p>;
  }

  // ファイルの中身を取得
  const fileContents = fs.readFileSync(filePath, 'utf8');
  const { data, content } = matter(fileContents);
  const title = data.title; // 記事のタイトル
  const processedContent = await unified().use(remarkParse).use(remarkHtml).process(content);
  const contentHtml = processedContent.toString(); // 記事の本文をHTMLに変換

  return (
    <Layout> 
    <div className="bg-white px-6 py-32 lg:px-8">
      <div className="mx-auto max-w-3xl text-base leading-7 text-gray-700">
        {/* サムネイル画像を表示 */}
        {data.thumbnail && (
          <div className="mb-6">
            <Image
              src={data.thumbnail}
              alt={title}
              width={800}  // 幅
              height={400} // 高さ
              className="w-full h-64 object-cover rounded-lg"
            />
          </div>
        )}

        {/* 記事タイトル */}
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          {title}
        </h1>
        {/* 投稿日を追加 */}
        <p className="text-gray-500 text-sm mt-2">{data.date}</p>
        {/* 記事本文 */}
        <div className="mt-6" dangerouslySetInnerHTML={{ __html: contentHtml }}></div>
        
      </div>
    </div>
    </Layout> 
  );
}