---
title: "Hướng dẫn Tổng quan (User Guide)"
description: "Cẩm nang hướng dẫn tạo Data, vận hành và xử lý lỗi phần mềm HappyAgent dành cho Non-tech"
robots: "index, follow"
---

# 📖 Hướng dẫn Vận hành HappyAgent (Dành cho Non-Tech)

> **"Trăm KOC, một cú click"**
> Bạn không cần phải biết lập trình hay rành công nghệ để vận hành HappyAgent. Chúng tôi hiểu rằng thứ bạn cần là **Thực thi nhanh, ổn định và tự động**. HappyAgent đã gánh phần kỹ thuật phức tạp (ẩn danh IP, vượt check captcha, tự học lại khi TikTok đổi giao diện), việc của bạn chỉ là: Giao việc cho nó và theo dõi.

---

## 🧐 HappyAgent giải quyết vấn đề gì?

Khi vận hành Affiliate hay tìm kiếm KOC trên hệ thống, việc nhắn tin cho hàng trăm KOC một cách thủ công vừa tốn thời gian, vừa dễ bị hệ thống đánh dấu là "Hành vi bất thường" (Spam). 

HappyAgent đóng vai trò như một **Trợ lý Ảo độc lập**:
1. **Tự động đăng nhập** an toàn vào các tài khoản của bạn (mà không bị quét là Robot).
2. Tự động đọc danh sách KOC bạn đã lưu trong File dữ liệu.
3. Liên hệ, gửi tin nhắn theo các **Thông điệp mẫu** đã được cá nhân hóa.
4. Tự ghi nhận báo cáo xem tin nhắn nào đã gửi, tin nào thất bại.

---

## 📦 3 Thành phần chính bạn cần biết

Không cần nhìn mã code, bạn chỉ thao tác với 3 tệp dữ liệu quen thuộc như dùng Excel hay Word:

1. **📁 Danh sách Khách hàng (`creators.csv`)**: File danh sách KOC/Creator mà bạn muốn liên hệ. Mở nó bằng Excel hoặc thẻ Google Sheets quen thuộc.
2. **📝 Mẫu tin nhắn (`message-template.json`)**: Kịch bản chat của bạn. Bạn có thể sửa "Nội dung chào hỏi", "Links đính kèm" theo ý muốn.
3. **🔑 Hồ sơ Trình duyệt (`profiles.json`)**: Chứa "CMND ảo" của mỗi nick đăng nhập để an toàn nhất.

---

## ❓ Câu Hỏi Thường Gặp (Q&A)

### 1. Nếu tôi vô tình nhập sai file thì sao?
Đừng lo! HappyAgent có chế độ kiểm tra lỗi ngay khi bạn bấm chạy. Nó sẽ nhắc nhở bằng tiếng Việt rõ ràng nếu bạn lỡ xóa nhầm dấu phẩy hay sai cột Excel.

### 2. Lúc nó chạy, tài khoản có bị khóa không?
HappyAgent dùng công nghệ **CloakBrowser Stealth** có thiết lập cơ chế bấm ngẫu nhiên theo nhịp điệu của con người (Humanize). Mỗi tài khoản sẽ có một dấu vân tay (Fingerprint) riêng trên Internet. Hãy tưởng tượng 5 tài khoản ở 5 máy tính ở tỉnh thành khác nhau đang chạy, TikTok hoàn toàn không biết!

### 3. Đang chạy thì nó bị văng ra (Crash)?
Lúc này tính năng **Healer 2.0 (AI Tự Chữa Lành)** sẽ hoạt động. 
Mỗi khi TikTok thay đổi giao diện, thay vì phải gọi đội Dev sửa code, HappyAgent tự "nhìn" giao diện bằng AI, tìm hiểu nút bấm mới ở đâu và tự cập nhật cách bấm. Tất cả diễn ra tự động trong vòng 30 giây rưỡi! Việc của bạn là đợi AI tự khởi động lại.

### 4. Báo cáo tôi xem ở đâu?
Bạn sẽ có một Dashboard trực tiếp (Ngay trên máy tính của bạn) màu xanh mát mẻ báo rõ trạng thái: **Bao nhiêu người đã nhận, Hôm nay hiệu suất làm việc ra sao**.

---

👉 **Sẵn sàng chưa? Hãy xem hướng dẫn Cầm tay chỉ việc (Step-by-Step) tại trang tiếp theo để bấm chạy ngay lần đầu tiên!**
