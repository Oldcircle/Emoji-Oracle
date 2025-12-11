# 🔮 Emoji Oracle | 表情包神谕

**Emoji Oracle** is an intelligent puzzle game that challenges you to decode stories, movies, and daily life scenarios hidden within sequences of emojis. Powered by advanced Large Language Models (LLMs).

**Emoji Oracle** 是一款智能解谜游戏，挑战你解读隐藏在表情包序列中的故事、电影和日常生活场景。由先进的大语言模型 (LLM) 驱动。

---

## ✨ Features | 功能特性

- **🤖 Multi-Model Support | 多模型支持**:
  - Built-in support for **Google Gemini**, **OpenAI (GPT)**, **DeepSeek**, **Anthropic (Claude)**, **Groq**, and local **Ollama** models.
  - 内置支持 **Google Gemini**, **OpenAI (GPT)**, **DeepSeek**, **Anthropic (Claude)**, **Groq** 以及本地 **Ollama** 模型。

- **🎨 Diverse Topics | 丰富主题**:
  - Movies, Food, Animals, Actions, Daily Objects.
  - 电影、美食、动物、动作、日常物品。

- **🌏 Bilingual UI | 双语界面**:
  - Fully localized in English and Simplified Chinese.
  - 完全本地化的英文和简体中文界面。

- **⚙️ Advanced Configuration | 高级配置**:
  - Customize API keys, Base URLs, and Model names directly in the browser.
  - 直接在浏览器中自定义 API 密钥、API 地址 (Base URL) 和模型名称。
  - Adjustable AI Creativity (Temperature).
  - 可调节的 AI 创造力（温度）。

- **📊 Progress Tracking | 进度追踪**:
  - Track your win rate, current streak, and best streak.
  - 追踪您的胜率、当前连胜和最高连胜记录。

---

## 🚀 How to Run | 如何运行

Since this project uses ES Modules and React via CDN, you need a simple static file server to avoid CORS issues with local file protocols (`file://`).

由于本项目使用 ES Modules 和 React CDN，你需要一个简单的静态文件服务器来避免本地文件协议 (`file://`) 的跨域问题。

1. **Clone or Download** the repository.
   **克隆或下载** 本仓库。

2. **Start a Local Server**:
   **启动本地服务器**：

   If you have Python installed / 如果你安装了 Python:
   ```bash
   python3 -m http.server 8000
   ```

   Or using Node.js / 或使用 Node.js:
   ```bash
   npx http-server
   ```

3. **Open in Browser**:
   **在浏览器中打开**：
   Visit `http://localhost:8000`
   访问 `http://localhost:8000`

---

## 🎮 How to Play / 玩法说明

1. **Choose a Topic**: Select a category from the home screen.
   **选择主题**：在主屏幕选择一个分类。
2. **Guess the Meaning**: The AI will generate a sequence of emojis (e.g., 🦁👑 → "The Lion King").
   **猜测含义**：AI 会生成一组表情包（例如：🦁👑 → "狮子王"）。
3. **Submit Answer**: Type your guess. Fuzzy matching is supported!
   **提交答案**：输入你的猜测。支持模糊匹配！
4. **Win & Config**: Earn points and customize your AI provider in Settings.
   **赢取积分与配置**：赚取积分，并在设置中自定义你的 AI 服务商。

---

## 🔌 API Configuration | API 配置

The game supports multiple AI providers. Go to **Settings** -> **Add New** to configure:

游戏支持多种 AI 服务商。进入 **设置 (Settings)** -> **新建 (Add New)** 进行配置：

| Provider | Default Base URL | Notes |
|----------|------------------|-------|
| **Google Gemini** | (Built-in) | Default provider. Requires API Key. |
| **OpenAI** | `https://api.openai.com/v1` | Supports GPT-4o, GPT-3.5, etc. |
| **DeepSeek** | `https://api.deepseek.com` | Excellent reasoning capabilities. |
| **Claude** | `https://api.anthropic.com/v1` | *Note: Requires CORS proxy if run in browser.* |
| **Ollama** | `http://localhost:11434/v1` | For local inference. Ensure CORS is enabled in Ollama.* |

> **Note on Local Ollama**: To allow the browser to connect to Ollama, run Ollama with `OLLAMA_ORIGINS="*"` environment variable.
>
> **关于本地 Ollama 的提示**：为了允许浏览器连接到 Ollama，启动时请设置环境变量 `OLLAMA_ORIGINS="*"`。

---

## 🛠️ Tech Stack | 技术栈

- **React 18/19** (via ESM)
- **Tailwind CSS** (Styling)
- **TypeScript**
- **Google GenAI SDK**

---

Designed with ❤️ by Emoji Oracle Team.
