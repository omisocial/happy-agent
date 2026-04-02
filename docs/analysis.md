---
title: "Codebase Analysis"
description: "Phân tích cấu trúc thư mục, kiến trúc và test coverage của HappyAgent"
robots: "index, follow"
---

# Phân tích System & Codebase

:::info Tổng quan
**Hệ sinh thái:** Node.js, Shell Script
**Công nghệ lõi:** Playwright (Web Automation), Winston (Logging), AI CLI Agent
**Kiến trúc:** Modular, Pipeline theo Hướng sự kiện (Fail -> Heal)
:::

## 1. Cấu trúc thư mục (Directory Structure)

```text
HappyAgent/
├── config/                  # Configuration Layer
│   ├── creators.csv         # Danh sách Creators
│   ├── message-template.json# Template thư mời
│   └── profiles.json        # Cấu hình danh sách Chrome Profile
├── data/
│   └── errors/              # Dữ liệu xuất ra (Screenshot, DOM, Logs) cho Healer
├── docs/                    # Tài liệu dự án (bạn đang đọc thư mục này)
├── openspec/                # Thiết kế hệ thống (Proposal)
├── scripts/
│   └── run.sh               # Luồng điều phối cấp cao nhất (Bash Loop)
├── skills/
│   └── tiktok-healer.md     # Prompt guidelines cho AI Agent
└── src/                     # Core Business Logic
    ├── healer.js            # Tác vụ AI sửa selector
    ├── orchestrator.js      # Luồng Node.js quản lý tiến trình
    ├── runner.js            # Playwright automation engine
    ├── tracer.js            # Capture lỗi xuất DOM và logs
    └── utils/
        ├── csv-reader.js    # Modun đọc/ghi DB dạng CSV
        ├── logger.js        # Logging output chuẩn hóa Winston
        └── selectors.js     # Single Source of Truth cho các CSS Selectors
```

## 2. Dependencies Overview

Các thư viện chính được sử dụng (trong `package.json`):

- **`playwright`**: Lõi tự động hoá trình duyệt Chromium.
- **`winston`**: Tiêu chuẩn hoá logging, ghi log lỗi ra file JSON phục vụ cho Tracer.
- **`csv-parse/sync` & `csv-stringify/sync`**: Quản lý State/DB ngay trên file CSV, theo dõi tiến độ gửi thư mời.
- **`dotenv`**: Load environment variables từ `.env`.

## 3. Quản lý trạng thái (State Management)

Dự án không sử dụng Database Relational (MySQL/PostgreSQL) vì yêu cầu tính chất gọn nhẹ của Native Script. Thay vào đó:
1. **Dữ liệu đầu vào và Trạng thái**: Lưu trên file `config/creators.csv`. Dữ liệu liên tục được cập nhật cột `status`, `invited_at`. Cột status gồm: `pending`, `invited`, `error_reason`.
2. **Dữ liệu lỗi (Tracer)**: Xuất ra các file `.html`, `.png`, `.json` tĩnh trong thư mục `data/errors/`. Healer sẽ bốc tách file json mới nhất để đẩy vào AI System.

## 4. Test Coverage

- Hệ thống hỗ trợ cờ `DRY_RUN=true` trong môi trường giả lập, cho phép test toàn bộ tiến trình điều khiển UI mà không nhấn vào nút Gửi thật sự (Send Invite API của Tiktok sẽ không bị kích hoạt).
- Pipeline kiểm thử bao gồm việc tự động cập nhật `.csv` khi Dry Run hoàn thành mà không vướng phải `TimeoutError`.
