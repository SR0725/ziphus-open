# 專案名稱：Ziphus Alpha API

## 專案概述

Run the following command:

Ziphus Alpha API 是一個用於管理空間、卡片及帳號信息的後端服務，提供 RESTful API 和 WebSocket 通訊接口，支持多種數據操作，如用戶註冊、登錄、創建卡片等功能。

## 系統要求

- Node.js 20 以上
- PNPM
- MongoDB
- Amazon S3 或其他支持相同標準之雲存儲服務(可選)

## 環境設置

請依照以下步驟配置您的開發環境：

1. 建立 `.env` 文件
   你可以參考 .env.example 的格式，建立一個 .env 文件，並填入您的配置訊息。

```shell
# LOCAL
NEXT_PUBLIC_API_ENDPOINT=http://127.0.0.1:8080 # API 的 endpoint
NEXT_PUBLIC_WS_ENDPOINT=ws://127.0.0.1:8080 # WebSocket 的 endpoint
MONGODB_CONNECTION_STRING=mongodb://localhost:27017 # MongoDB 的連接字串
MAIN_DB_NAME=ziphus # 主資料庫名稱，將用來存放用戶、卡片等資料
YJS_DB_NAME=ziphus-yjs # YJS 資料庫名稱，將用來存放 YJS 的協作資料
C2_OBJECT_STORAGE_ENDPOINT=AWS 的 ENDPOINT # Amazon S3 的 endpoint
C2_OBJECT_STORAGE_STORAGE_KEY=AWS 的 STORAGE_KEY # Amazon S3 的 storage key
C2_OBJECT_STORAGE_PRIVATE_KEY=AWS 的 PRIVATE_KEY # Amazon S3 的 private key
NEXT_PUBLIC_PROJECT_ENV=LOCAL # 專案環境，可選值為 LOCAL、PRODUCTION
OPENAI_API_KEY=openai_api_key # OpenAI 的 API key
GEMINI_API_KEY=gemini_api_key # Gemini 的 API key
CLAUDE_API_KEY=claude_api_key # Claude 的 API key
```

2. 安裝依賴

```shell
pnpm install
```

3. 啟動服務

```shell
pnpm dev
```

## 文件結構

以下是專案的主要文件結構說明：

### 後端

```
ziphus-alpha/
├── apps/
│   ├── api/
│   │   ├── src/
│   │   │   ├── adapter/
│   │   │   │   ├── in/
│   │   │   │   │   ├── fastify/                   # Fastify 控制器實現
│   │   │   │   │   ├── socket/                   # WebSocket 控制器實現
│   │   │   │   │   └── yjs/                      # Yjs WebSocket 工廠
│   │   │   │   └── out/
│   │   │   │       ├── io/                       # Socket 發射接口
│   │   │   │       └── persistence/              # 持久層適配器
│   │   │   ├── application/
│   │   │   │   ├── domain/
│   │   │   │   │   ├── model/                    # 領域模型
│   │   │   │   │   └── service/                  # 領域服務
│   │   │   │   └── port/
│   │   │   │       ├── in/                       # 用例接口
│   │   │   │       └── out/                      # 外部端口
│   │   │   └── common/                           # 共用工具
│   │   └── test/                                 # 測試目錄
└───
```

### 前端

```
ziphus-alpha/
├── apps/
│   ├── web/
│   │   ├── src/
│   │   │   ├── app/                             # 頁面
│   │   │   ├── components/                       # 共用組件
│   │   │   ├── hooks/                            # 自定義 hooks
│   │   │   ├── models/                           # 模型
│   │   │   ├── providers/                        # 全局提供者
│   │   │   ├── utils/                            # 工具
│   │   │   ├── App.tsx                           # App 入口
└───
```

### Package

- `@repo/eslint-config`: ESLint 配置
- `@repo/shared-types`: 定義前後端資料傳輸模型
- `@repo/shared-utils`: 前後端共用工具
- `@repo/sketch-canvas`: 繪圖白板
- `@repo/y-socket-io`: 基於 YJS 的 WebSocket 服務
