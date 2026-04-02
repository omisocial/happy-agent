---
title: "Hướng dẫn sử dụng (User Guide)"
description: "Cẩm nang hướng dẫn tạo Data, vận hành và xử lý lỗi phần mềm HappyAgent"
robots: "index, follow"
---

# 📖 Hướng dẫn sử dụng & Vận hành (SOP)

Tài liệu này cung cấp các bước từ lúc cấu hình Data, chạy dự án cho đến khi khắc phục sự cố thông qua Healer 2.0.

## 1. Môi trường chuẩn bị

*   **Node.js**: Máy tính cần cài đặt Node.js phiên bản `>= 18.0.0`.
*   **Trình duyệt**: Tool đã tích hợp sẵn ngầm `cloakbrowser` tự động tải xuống.
*   **API LLM**: (Dành cho Healer) Cần cài đặt biến số API vào file `.env` (nếu có sử dụng các dạng Agent tích hợp qua CLI).

---

## 2. Chuẩn bị (Cấu hình Profile & Data)

Trước khi chạy tool, bạn cần cung cấp Data qua việc thiết lập `config/profiles.json` và cấu hình các Creator cần mời thông qua `config/creators.csv`.

### Tạo và gỡ lỗi Profile Trình duyệt (`profiles.json`)

Mỗi Profile được xem như một chiếc máy tính ảo độc lập.

```json
{
  "profiles": [
    {
      "id": "shop_1",
      "path": "./chrome_profiles/shop_1",
      "fingerprintSeed": "shop1_unique_seed"
    }
  ]
}
```

:::warning Lưu ý về Fingerprint
Không được đổi `fingerprintSeed` sau khi Shop đã đăng nhập thành công. Điều này sẽ khiến trang web hiểu lầm rằng bạn chuyển sang thiết bị khác!
:::

### Mẫu tin nhắn (Message Template)

Chỉnh sửa file `config/message-template.json` theo đúng cấu trúc.

---

## 3. Khởi chạy & Vận hành (Orchestrator)

Luồng chạy chính của Project là **Orchestrator** - một hệ thống bash có khả năng tự reload lại chạy khi bị văng lỗi.

**Để khởi động:**

:::code-group
```bash [Terminal]
npm start
```
:::

Khi chạy, Terminal sẽ hiển thị các log thông báo (`[INFO]`) trạng thái duyệt qua từng Creator. Các báo cáo sau đó sẽ được đổ vào Output CSV. 

Bạn có thể theo dõi Dashboard Local HTML (Mở `dashboard/index.html` trong thư mục bằng Live Server) để xem Visual Report trực quan.

---

## 4. Xử lý Sự cố & Bảo trì (Troubleshooting)

Hệ thống được thiết kế với sự hỗ trợ của thành phần AI ảo tên là **Healer 2.0**.
Với mô hình 0-giờ-bảo-trì (Zero-Maintenance), khi xảy ra việc website TikTok bị cập nhật (ví dụ class `.button` bị đổi), bạn **không cần thao tác** gì. Tuy nhiên cần hiểu cách nó xử lý:

### Quá trình Healer giải cứu
1.  **Orchestrator (Runner)** phát hiện Selector bị lỗi Timeout $\Rightarrow$ Crash hệ thống.
2.  **Tracer** xuất file Screenshot và HTML Snapshot ra thư mục `data/errors/`.
3.  **Healer** kích hoạt AI, phân tích HTML hiện thời và ghi đè Selector mới vào file mã máy.
4.  **Local Test-Gate:** Khởi tạo một phiên chạy Headless ngầm để test Selector AI vừa tạo bằng cách móc thẳng vào HTML cục bộ (không thông qua mạng Internet).
    *   *Xác thực 1 phần tử (Valid):* Pass -> Chạy lại tiến trình.
    *   *Khác 1 phần tử (Invalid):* Reject -> Lưu báo cáo, AI nghĩ lại cách khác (tối đa 3 lần).

### Can thiệp thủ công (Nếu cấp bách)

Trong trường hợp AI sau 3 lần Test-Gate vẫn thất bại (File log báo `Exhausted 3 attempts. Giving up`), bạn cần:
1.  Mở screenshot bị lỗi tại `data/errors/error_screenshot.png` xem TikTok đã hiển thị thế nào.
2.  Vào `src/utils/selectors.js`.
3.  Vá lại selector bằng tay ứng với giao diện mới.
4.  Lưu file và kích hoạt lệnh khởi chạy lại (`npm start`). 
    
    *Hệ thống Orchestrator sẽ tự chạy lại đúng Profile chứa Creator mà lúc nãy nó đang chạy dang dở.*
