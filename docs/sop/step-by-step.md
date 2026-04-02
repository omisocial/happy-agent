---
title: "Thực Chiến: Mời 500 KOC/Tuần"
description: "Cầm tay chỉ việc cách dùng HappyAgent để tự động hóa mời KOC (Use case thực tế)"
robots: "index, follow"
---

# 🎯 Thực Chiến: Cách Tự Động Mời 500 KOC Mỗi Tuần

> Hệ thống đã cài đặt xong. Bây giờ là lúc dùng nó để ra số. Đây là Use Case tiêu chuẩn cho bộ phận Vận hành/CSKH. Hãy đi theo đúng trình tự này, bạn chỉ mất đúng 5 phút mỗi sáng!

---

## 🕒 Bước 1: 8h Sáng - Cập Nhật "Luồng Mồi" (File Excel)

Hàng tuần/Hàng ngày, khi bạn đã lọc được danh sách KOC cần liên hệ bằng tay, hãy làm như sau:

1. Copy toàn bộ thông tin đó.
2. Tìm thư mục `config` trên máy tính (nơi bộ kỹ thuật đã thiết lập cho bạn).
3. Mở file có tên `creators.csv` lên (Có thể bấm chuột phải chọn **Open with Excel** hoặc **Notepad**).
4. Dán thông tin vào theo đúng cột. Ví dụ có cột `id_tiktok`, `link_profile`, vân vân. 
5. Bấm `Ctrl+S` (Windows) hoặc `Cmd+S` (Mac) để lưu lại tệp này. Đóng nó đi.

*Xong. HappyAgent bây giờ đã biết hôm nay bạn muốn mời ai.*

---

## ✍️ Bước 2: 8h05 Sáng - Viết Kịch Bản Phù Hợp

Bạn đang chạy Campaign Sale Tết và muốn mời họ tham gia? Hãy vào chỉnh lại tin nhắn cho đúng ngữ cảnh!

1. Tại chính thư mục `config`, có một file tên là `message-template.json`.
2. Bấm chuột phải, chọn **Mở bằng Notepad** (trên máy Win) hoặc TextEdit (trên máy Mac). Bạn sẽ thấy nội dung tương tự thế này:
   ```json
   {
      "loi_chao": "Chào bạn, mình từ Team Boxme!",
      "noi_dung": "Sắp tới có Sale lớn, team mình rất muốn booking bạn làm video.",
      "chi_tiet_link": "https://campaigntet.com"
   }
   ```
3. Bạn dùng chuột, **sửa nội dung màu xanh lá (hoặc cam) nằm giữa các cặp ngoặc kép `""`**. Chú ý ĐỪNG xoá mất thẻ ngoặc kép của hệ thống.
4. Lưu tệp lại (`Ctrl+S`).

*Lưu ý: Nếu bạn có nhiều dạng chiến dịch (Mời KOC Beauty, Mời KOC Thời trang), tốt nhất là chuẩn bị sẵn nội dung trong file Word rồi copy thả vào đây mỗi sáng.*

---

## 🚀 Bước 3: 8h10 Sáng - Bấm Nút Chạy & Uống Cà Phê

Bạn đã nói cho AI biết "*Cần mời ai*" và "*Nói cái gì*". Việc cuối cùng là khởi chạy công tắc.

1. Bấm đúp vào biểu tượng (Shortcut/Lệnh) do đội Dev cài săn ngoài màn hình máy tính của bạn. (Hoặc nếu mở Terminal, đánh dòng chữ ngắn gọn: `npm start` rồi bấm `Enter`).
2. Một màn hình xuất hiện các chữ chạy liên tục như "Đang tải cấu hình...", "Đang khởi động Shop 1...".  **Kệ nó**.
3. Bạn cứ việc thu nhỏ cửa sổ. Thu nhỏ lại và lướt Web hoặc check tin nhắn khác. 

Hệ thống sẽ chạy ngầm bằng công nghệ ẩn danh CloakBrowser, hoàn toàn không chiếm màn hình của bạn. Lâu lâu, nếu ứng dụng chớp màn hình Terminal màu xanh đỏ tức là nó thông báo 1 nick đã chạy xong!

---

## 📊 Bước 4: Kiểm Tra Thành Quả

Ai cũng muốn nhìn thấy "tiền rơi vào túi".

Sau tầm nửa tiếng hãy mở **Bảng điều khiển (Dashboard)**:
*   Đội Dev đã cài sẵn nó dưới dạng liên kết web cục bộ (`http://localhost...` hoặc một trang web chỉ máy bạn xem được).
*   Truy cập nó, đập vào mắt bạn là: Biểu đồ **Thành Công** (Màu Xanh), **Thất Bại** (Màu Đỏ do KOC đó khóa tin nhắn người lạ hoặc lỗi).
*   Hãy lấy danh sách "Thành Công" gửi cho cấp trên của bạn báo cáo hiệu suất sáng hôm nay.

✨ **Chúc mừng bạn! Việc trước đây cần 4 tiếng click tay nay đã gộp vào 10 phút đầu giờ sáng. Bạn là bậc thầy vận hành tiếp theo với AI!**
