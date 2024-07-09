/* eslint-disable @typescript-eslint/no-unsafe-call */
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";

const postsDirectory = path.join(process.cwd(), "src", "app", "blog");

export function getAllPostIds() {
  const fileNames = fs.readdirSync(postsDirectory);
  return fileNames.map((fileName) => {
    return {
      params: {
        id: fileName.replace(/\.md$/, "").split("-"),
      },
    };
  });
}

export async function getPostData(id: string[]): Promise<{
  id: string[];
  contentHtml: string;
  title: string;
  date: string;
}> {
  const fullPath = path.join(postsDirectory, `${id.join("-")}.md`);
  const fileContents = fs.readFileSync(fullPath, "utf8");

  const matterResult = matter(fileContents);

  const processedContent = await remark()
    .use(html)
    .process(matterResult.content);
  const contentHtml = processedContent.toString();

  const { title, date } = matterResult.data as { title: string; date: string };

  return {
    id,
    contentHtml,
    title,
    date,
  };
}
