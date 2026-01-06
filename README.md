# ai_trainning

ワークスペース構成でフロントエンドと API を分離しています。

## 構成

- `frontend/`: React + Vite + TypeScript
- `api/`: Express + TypeScript

## よく使うコマンド

```sh
npm run dev        # frontend
npm run dev:api    # api
npm run build      # 両方
npm run lint       # frontend
```

## API (LangChain)

`api/.env` に `OPENAI_API_KEY` を設定してから起動してください。

```sh
npm run dev:api
```

```sh
curl -X POST http://localhost:3001/agent \
  -H "Content-Type: application/json" \
  -d '{"input":"週末に引っ越し準備をしたい"}'
```
