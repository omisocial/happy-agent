# HappyAgent

HappyAgent (formerly TikTok Connect) is an intelligent, stealth-oriented, and self-healing automation system for eCommerce platforms.

## Core Features
- **CloakBrowser Stealth**: Avoids bot detection through advanced fingerprinting.
- **Healer 2.0 (Self-Healing)**: AI automatically detects and fixes obsolete selectors during runtime, validating new selectors locally before application.
- **Continuity Memory**: Learns from failed interactions to prevent repetitive errors ("Loop of Death").
- **Orchestrator**: Maintains persistent operation with robust recovery flows.

## Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```
2. **Setup environment:**
   ```bash
   cp .env.example .env
   # Update variables
   ```
3. **Run Documentation:**
   ```bash
   npm run docs:dev
   ```
4. **Deploy Documentation:**
   ```bash
   npm run docs:build
   # Output is in docs/.vitepress/dist
   ```

HappyAgent relies on modern Web Automation paired with AI-driven visual/DOM intelligence. For a detailed guide, please refer to the internal documentation.
