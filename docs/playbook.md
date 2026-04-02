# Bảng Playbook Ứng Dụng (Use Cases) Cho Boxme

Happy Agent (Cỗ máy Tự động hoá vạn năng) không chỉ dùng cho TikTok mà có thể triển khai tự động hóa cho nhiều bộ phận khác nhau trong nội bộ Boxme, giúp nhân sự thao tác tự động, không tốn Token phụ phí nhờ mô hình Local CLI (Opencode / Gemini CLI).

Dưới đây là các **Use Case (SOP)** gợi ý để đào tạo (Dạy Skill) cho Happy Agent tuỳ theo đặc thù từng phòng ban:

## 1. Phòng Nhân sự (HR)
- **Tự động đăng tin tuyển dụng đa kênh:** Lấy nội dung từ Google Docs/Notion, tự động mở các trang tuyển dụng (TopCV, VietnamWorks, LinkedIn), copy-paste, chọn danh mục và đẩy tin tự động.
- **Onboarding Nhân viên mới:** Tự động hoá việc gửi email thông báo, tự click mời tài khoản vào hệ thống Slack, Jira, Bitbucket sau khi có email nhân sự từ File Excel trúng tuyển.
- **Lọc CV hàng loạt:** Mở list CV từ Drive, trích xuất dữ liệu cơ bản (Tên, Số Đt, Kỹ năng) và copy tự động vào bảng Google Sheets quản lý Ứng viên.

## 2. Kế toán & Tài chính (Finance / Accounting)
- **Cào dữ liệu tỷ giá & Lãi suất:** Mỗi sáng tự động mở trang web ngân hàng, copy tỷ giá USD/VND hiện tại và điền vào phần mềm kế toán hoặc nhóm Slack báo cáo.
- **Tải hoá đơn đỏ tự động:** Đăng nhập vào các cổng xuất hoá đơn điện tử của nhà cung cấp, tải file PDF/XML về thư mục lưu trữ cục bộ theo đúng cấu trúc Ngày-Tháng.
- **Đối soát sao kê tĩnh:** Lấy báo cáo từ Excel Cổng thanh toán, tự mở phần mềm ERP nội bộ khớp lệnh các khoản tiền thu về.

## 3. Mua hàng (Purchasing)
- **Theo dõi giá Nhà Cung cấp (Scraping):** Tự động cào giá và số lượng tồn kho của các sản phẩm trên trang web nguồn (Taobao, 1688, Shopee) và cảnh báo khi giá vượt ngưỡng quy định.
- **Tự động đặt lại vật tư:** Nếu trong sheet quy định số lượng băng dính/thùng carton dưới mức tối thiểu, Agent tự động đăng nhập trang B2B nhà cung cấp và đặt hàng chờ duyệt.

## 4. Hỗ trợ Khách hàng (Customer Support)
- **Auto-Reply Ticket:** Quét tài khoản kênh đánh giá/khiếu nại, lấy mẫu câu trả lời phù hợp trong `message-template.json` và trả lời hàng loạt các khiếu nại tương đồng (vd. lỗi giao hàng chậm).
- **Trích xuất thông tin ID Đơn Hàng:** Tự vào hệ thống Zalo OA, nếu thấy KH nhắn mã đơn hàng, Agent tự mở trang Admin ERP lấy trạng thái đơn gửi về lại cho KH.
- **Xin đánh giá:** Nhắn tin tự động xin review 5 sao hoặc phản hồi khách hàng thông qua kênh Shopee Chat/Tiktok Chat sau khi giao hàng thành công.

## 5. Kinh doanh (Sales / BD)
- **Cào File Đối tác tiềm năng (Lead Generation):** Vào các nhóm Facebook kinh doanh / Top seller Shopee, quét tên cửa hàng, số điện thoại hoặc email rồi cập nhật vào CRM của công ty.
- **Rải tin nhắn Mời lên sàn:** (Giống tính năng cốt lõi Tiktok Invite hiện tại). Tự động rải hàng loạt tin nhắn mời hợp tác cho các Influencers/KOCs theo kịch bản cá nhân hoá dựa trên ngách của họ.

## 6. Công nghệ / Kỹ thuật (Tech / IT)
- **Tạo Account Nội bộ hàng loạt:** Tự động điền Form cấu trúc để cấp phát quyền (Jira, Confluence, Email) khi có nhân viên mới or tắt tài khoản cho người vừa nghỉ chỉ từ 1 click file CSV.
- **Cronjob theo dõi Hệ thống Health Check:** Tự động mở Dashboard theo dõi log rớt đơn, nếu có lỗi bất thường Agent tự chụp ảnh màn hình nén lại gửi cảnh báo qua Telegram.

## 7. Doanh thu & Công nợ (Revenue / Cashflow)
- **Nhắc nợ tự động:** Dựa vào danh sách công nợ trên sheet, Agent tự động lấy chi tiết, login vào email/Zalo gửi tin nhắn nhắc nhở quá hạn thanh toán đối với các tập KH trả sau của Boxme.
- **Báo cáo Tiền về đa sàn:** Buổi tối Agent login vào Seller Center 3 sàn (Tiktok, Shopee, Lazada) tổng hợp số tiền đối soát chuẩn bị chuyển về tài khoản, ném vào Group BOT Telegram.

## 8. Kho vận (Fulfillment / Operations)
- **Phân tệp Nhãn dán:** Tự động tải hàng ngàn tem vận đơn PDF từ Seller Center, phân chia thành các thư mục nhỏ để máy in in dần theo kịch bản không bị nghẽn mạng máy in nội bộ.
- **Theo dõi Đơn Lỗi/Hoàn:** Tự động phân loại đơn hàng rớt/hỏng/hoàn trên Dashboard để kho lập tức xuất quy trình liên lạc lại tránh phạt giao trễ.

---

### Hướng dẫn cách "Dạy" (Teach Skill) các Playbook này
1. **Chuẩn bị SOP Mẫu**: Các phòng ban chỉ cần làm thao tác chuẩn (Bấm đâu, Gõ gì) 1 lần, quay video hoặc xuất dưới dạng chữ.
2. **Kéo thả File vào Táp "Dạy Skill"**: Mở giao diện Light Mode -> Upload lên.
3. Happy Agent với sức mạnh của Local AI CLI (như Gemini) sẽ học lệnh và tự động biến thành kỹ năng vận hành vĩnh viễn. Không tốn tiền duy trì, bảo mật tuyệt đối 100% dữ liệu vì mọi thứ chạy trên máy tính nội bộ của phòng ban (Localhost).
