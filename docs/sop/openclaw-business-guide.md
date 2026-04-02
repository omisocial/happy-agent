---
title: "Hướng dẫn Hỗ trợ Phòng ban"
description: "Các Use Case ứng dụng HappyAgent cho từng phòng ban chuyên môn tại Boxme"
---

# Cẩm Nang Happy Agent Dành Cho Non-Tech (Boxme)

Chào mừng các bạn đến với tài liệu hướng dẫn ứng dụng **Happy Agent** - Cỗ máy tự động hoá vạn năng. Tài liệu này được thiết kế dành riêng cho các nhân sự khối Kinh doanh, Kế toán, Chăm sóc Khách hàng, Nhân sự, Vận hành... (Non-Tech) tại Boxme để có thể tận dụng AI một cách mạnh mẽ vào việc xử lý các tác vụ lặp đi lặp lại.

## 1. Happy Agent là gì?

Happy Agent là một "nhân viên ảo" chạy trực tiếp trên máy tính của bạn. Thay vì phải nhấp chuột lặp đi lặp lại trên nhiều giao diện hay xử lý hàng ngàn dòng Excel thủ công, bạn chỉ cần cấu hình (hoặc ra lệnh), Happy Agent sẽ làm thay bạn: tải báo cáo, gửi tin nhắn hàng loạt, lọc dữ liệu, click hệ thống nội bộ, v.v.

Đặc biệt, hệ thống hoạt động trực tiếp trên máy bạn (Local) nên **bảo mật tuyệt đối 100% dữ liệu** và **tiết kiệm chi phí API**.

---

## 2. Các Use Cases Thực Chiến Theo Từng Phòng Ban

Dưới đây là các ứng dụng (Playbook) thực tế mà các phòng ban tại Boxme có thể áp dụng ngay để cải thiện hiệu suất x10 lần.

### 2.1. Phòng Hỗ trợ Khách hàng (Customer Support)
Thay vì tra mã vận đơn bằng tay cho từng người, hãy để Agent tự động hóa:
*   **Auto-Reply Ticket:** Quét các tài khoản kênh khiếu nại (Email, Fanpage), lấy mẫu câu trả lời chuẩn mực và phản hồi hàng loạt các sự cố tương tự (báo giao trễ, hỏng hóc).
*   **Tra cứu trạng thái đơn:** Tự động đọc mã đơn hàng mà khách nhắn qua Zalo/Chat, mở hệ thống ERP Boxme để xem tiến trình và tự phản hồi lại cho khách.
*   **Xin đánh giá 5 Sao:** Nhắn tin xin feedback qua các sàn TMĐT (Shopee Chat/TikTok) ngay khi đơn hàng chuyển màu "Đã Giao".

### 2.2. Phòng Kinh doanh (Sales / BD) 
Giao phần việc đi tìm số điện thoại cực nhọc cho AI:
*   **Cào File Đối tác tiềm năng (Lead Generation):** Quét các hội nhóm Facebook kinh doanh hoặc Top cửa hàng Shopee, lọc lấy Tên gian hàng, Số điện thoại, Email và đẩy thẳng lên CRM Boxme.
*   **Rải tin mời lên Sàn / Mời KOC (TikTok/Shopee):** Gửi tin nhắn hợp tác hàng loạt đến hàng trăm Influencer theo kịch bản cá nhân hoá (tự gọi tên, tự theo ngách).

### 2.3. Phòng Kế toán & Tài chính (Finance)
Biến quá trình tải hoá đơn nhàm chán thành tự động:
*   **Tải hoá đơn đỏ tự động:** Đăng nhập vào các cổng hoá đơn điện tử của nhà cung cấp, tải file PDF/XML về thư mục máy tính và phân chia theo đúng cấu trúc Ngày-Tháng.
*   **Đối soát sao kê tĩnh:** Lấy báo cáo từ cổng thanh toán, tự động mở ERP nội bộ và thao tác khớp lệnh các khoản tiền thu về.
*   **Cào dữ liệu Tỷ giá & Lãi suất:** Mỗi sáng tự động mở web ngân hàng, copy tỷ giá USD/VND hiện tại và báo cáo lên group Slack.

### 2.4. Doanh thu & Công nợ (Revenue / Cashflow)
*   **Báo cáo Tiền về Đa sàn:** Tối muộn, Agent đăng nhập vào các Seller Center (TikTok, Shopee, Lazada), tổng hợp số tiền đối soát chuẩn bị về và ném vào Group BOT Telegram.
*   **Nhắc nợ tự động:** Dựa vào danh sách công nợ trên Excel, Agent login vào Zalo/Email để gửi tin nhắn nhắc nhở quá hạn thanh toán lịch sự tới tập KH trả sau của Boxme.

### 2.5. Phòng Nhân sự (HR)
*   **Tự động đăng tin tuyển dụng đa kênh:** Lấy thông tin JD từ Google Docs, tự động mở web (TopCV, VietnamWorks, LinkedIn), điền form và đẩy tin chuẩn SEO.
*   **Lọc CV hàng loạt:** Mở list CV, trích xuất dữ liệu cơ bản (Tên, SDT, Kỹ năng) và copy tự động vào bảng Google Sheets quản lý ƯV.
*   **Bật/Tắt tài khoản Onboarding:** Tự động điền Form cấp phát quyền (Slack, Jira, Git) khi có nhân viên mới, và tắt hàng loạt hệ thống khi có nhân sự offboard chỉ từ 1 file CSV.

### 2.6. Kho vận (Fulfillment / Operations)
*   **Phân tệp Nhãn dán tự động:** Tải hàng ngàn tem vận đơn (PDF) từ hệ thống và tách thành từng thư mục nhỏ để máy in in dần theo kịch bản, không làm sập mạng cục bộ.
*   **Theo dõi Đơn Lỗi/Hoàn:** Quét liên tục các Dashboard trạng thái. Tự động bóc tách các đơn hàng rớt/hỏng để kho có cảnh báo xử lý lập tức.

---

## 3. Nếu Tôi Muốn Dạy Happy Agent Làm Thêm Việc Khác? (Teach Skill)

Bạn là chuyên gia trong công việc của mình. Nếu có tác vụ lặp nào đó chưa có trong list trên, bạn hoàn toàn có thể "dạy" Agent kỹ năng đó chỉ trong 3 bước:

1. **Chuẩn bị SOP Mẫu**: Làm thao tác chuẩn (Bấm nút nào, điền nội dung gì) 1 lần, quay lại video màn hình hoặc liệt kê bằng chữ.
2. **Kéo thả File vào Tab "Dạy Skill"**: Mở phần mềm giao diện điều khiển (Dashboard) của hệ thống lên, kéo quy trình vận hành bạn vừa làm vào đó.
3. Thư giãn! Sức mạnh của AI sẽ hiểu quy trình bạn làm và biến thành 1 "Kỹ năng chuyên biệt" cho phòng ban của bạn có thể tái sử dụng về sau.
