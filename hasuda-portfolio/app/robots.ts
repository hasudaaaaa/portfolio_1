import type { MetadataRoute } from "next";

// 生成AI・機械学習向けクローラー。学習・データセット化目的の収集をお断りする意思表示。
const AI_CRAWLERS = [
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "anthropic-ai",
  "ClaudeBot",
  "Claude-Web",
  "Google-Extended",
  "Applebot-Extended",
  "CCBot",
  "Bytespider",
  "Amazonbot",
  "FacebookBot",
  "Meta-ExternalAgent",
  "PerplexityBot",
  "cohere-ai",
  "Diffbot",
  "ImagesiftBot",
  "Omgilibot",
  "Omgili",
  "Timpibot",
  "YouBot",
  "img2dataset",
  "PetalBot",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // 検索エンジン等、通常のクローラーは許可
      {
        userAgent: "*",
        allow: "/",
      },
      // 生成AI・機械学習向けクローラーは全面的にブロック
      {
        userAgent: AI_CRAWLERS,
        disallow: "/",
      },
    ],
    host: "https://hasuda.org",
  };
}
