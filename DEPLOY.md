# デプロイ手順（Vercel）

## 1. 必要なもの

- Node.js（v18以上）
- [Vercel CLI](https://vercel.com/cli)（`npm i -g vercel` でインストール）

## 2. APIキーの設定

本番環境では `.env` はアップロードされないため、Vercel 上で環境変数を設定してください。

### 方法A: Vercel ダッシュボード

1. [vercel.com](https://vercel.com) にログイン
2. プロジェクトを選択（または新規作成）
3. **Settings** > **Environment Variables**
4. `OPENAI_API_KEY` を追加（Value に API キーを入力）

### 方法B: CLI

```bash
cd tesou-kantei-tool
vercel env add OPENAI_API_KEY production
# プロンプトが表示されたら API キーを貼り付けて Enter
```

## 3. デプロイ

```bash
cd tesou-kantei-tool
vercel --prod
```

初回はプロジェクト名や設定の確認があります。完了後、表示されたURLが本番環境です。

## 4. ローカル確認（任意）

```bash
vercel dev
```

`.env` のキーが読み込まれ、`http://localhost:3000` で動作確認できます。
