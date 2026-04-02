---
layout: doc
title: Demo Workflow Các Bộ Kỹ Năng (Skills)
---

# Demo: Workflow Ứng Dụng Kỹ Năng Cơ Bản

Trang này minh hoạ trực quan (kèm video) cách một đội ngũ phát triển áp dụng chuỗi kỹ năng: **The Mom Test** -> **cm-planning** -> **test-scenarios** để phân tích, lên kế hoạch và kiểm thử một tính năng mới của HappyAgent.

## 1. Giai Đoạn Khám Phá: The Mom Test 
*Nguyên tắc: Không hỏi về ý tưởng của bạn. Hỏi về cuộc sống của họ.*

Khách hàng (Operations Team) đề xuất: *"Chúng tôi muốn có một Dashboard AI Healer để xem các lỗi."*

**Cách tiếp cận Sai (Không áp dụng Mom Test):**
- PM: *"Bạn có sẵn sàng dùng một Dashboard hiển thị UI bị hỏng và AI Agent đã heal lại như thế nào không? Bạn muốn tính năng gì trên đó?"*
- Ops: *"Tuyệt vời! Cho tôi thêm biểu đồ, export PDF và thông báo Telegram luôn nhé."*
-> Hậu quả: Xây dựng một đống tính năng không ai thực sự dùng.

**Cách tiếp cận Đúng (Áp dụng Mom Test):**
- PM: *"Lần gần nhất một kịch bản tự động bị hỏng do thay đổi UI, bạn đã xử lý thế nào? Hãy kể lại chi tiết."*
- Ops: *"Tuần trước Shopee đổi nút từ 'Xác nhận' sang 'Đồng ý'. Kịch bản dừng lại. Tôi mất 30 phút đọc file `error.log` mới tìm ra là bị sai DOM selector. Sau đó phải sửa script thủ công."*
- PM: *"Điều gì khó khăn nhất trong quá trình đó?"*
- Ops: *"Phải đọc log text. Nếu có hình chụp màn hình (screenshot) ngay lúc nó bị lỗi thì tôi biết ngay do đâu."*

**💡 Phát hiện cốt lõi:** Người dùng cần *bằng chứng trực quan* (screenshot) khi lỗi xuất hiện, không phải một dashboard phân tích phức tạp.

---

## 2. Lên Kế Hoạch: cm-planning
*Nguyên tắc: Nghĩ trước khi làm. Tài liệu hoá trước khi code.*

Dựa vào phát hiện từ Mom Test, chúng ta yêu cầu AI sử dụng kỹ năng `cm-planning` để lên kế hoạch.

> **Input cho AI:** Lên kế hoạch (cm-planning) tính năng chụp màn hình (Screenshot evidence) và hiển thị log đơn giản cho lỗi Healer 2.0.

**Output của Agent (Bản tóm tắt):**

```markdown
# Goal
Thêm tính năng lưu và hiển thị screenshot khi Healer 2.0 phát hiện sự cố DOM/UI để Ops dễ dàng nhận diện nguyên nhân gốc rễ.

## Proposed Changes

### [Server] `src/healer.js`
- Bắt exception khi Playwright locator thất bại.
- Gọi `page.screenshot()` lưu file vào thư mục `/temp/screenshots/` với naming format: `[timestamp]_[task]_failed.png`.

### [Frontend] `dashboard/main.js` & `dashboard/index.html`
- Bổ sung một danh sách "Sự cố gần đây".
- Khi người dùng click vào sự cố, hiển thị ảnh chụp màn hình tương ứng.

## Verification
- Chạy hệ thống với một script lỗi cố ý.
- Kiểm tra ảnh chụp màn hình có được xuất đúng vào thư mục `/temp` không.
```

---

## 3. Lập Kịch Bản Kiểm Thử: test-scenarios
*Nguyên tắc: Bao phủ mọi trường hợp ngay từ đầu.*

> **Input cho AI:** Viết các kịch bản kiểm thử (test-scenarios) cho User Story: "Là một nhân viên vận hành, tôi muốn xem ảnh chụp màn hình sự cố khi script lỗi để nắm được tình trạng UI."

**Output của Agent:**

**Test Scenario 1:** Lưu screenshot khi Locator thất bại
**Test Objective:** Đảm bảo ảnh được tạo ra với đúng tên và dung lượng hợp lệ khi lỗi xảy ra.
**Starting Conditions:**
- Kịch bản chạy trên một trang web cố tình bị thay đổi DOM.
- Thư mục `/temp/screenshots` đang trống.
**Test Steps:**
1. Chạy lệnh: `npm run start --task=dummy_task`
2. Đợi đến khi Terminal văng lỗi Timeout / Locator Error.
3. Kiểm tra thư mục `/temp/screenshots/`.
**Expected Outcomes:**
- Có file ảnh PNG mới được tạo.
- Tên ảnh chứa ID của tác vụ và thời gian chuẩn (VD: `16790012_dummy_task_failed.png`).

**Test Scenario 2:** Hiển thị mượt mà trên Light Mode Dashboard
**Test Objective:** Đảm bảo non-tech user có thể xem ảnh trực tiếp từ Dashboard.
**Test Steps:**
1. Mở giao diện Dashboard.
2. Tại cột "Cảnh báo & Lỗi", click vào sự cố lỗi vừa bị tạo ra ở Scenario 1.
**Expected Outcomes:**
- Ảnh chụp màn hình hiển thị dưới dạng Dialog/Modal.
- Layout gọn gàng, không bị tràn trên màn hình nhỏ.

---

## 4. Video Demo Quá Trình

Dưới đây là video demo ngắn ghi lại phiên làm việc của hệ thống và bộ kỹ năng trong thực tế.

<!-- ![Test Skillset Demo Video](/assets/videos/skillset_demo.webp) -->
