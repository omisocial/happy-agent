Chào Tody, tư duy xây dựng hệ thống "Self-healing" (tự phục hồi) này rất chuẩn xác đối với các luồng tác vụ dễ bị đứt gãy do nền tảng thay đổi giao diện. Việc kết hợp tốc độ của mã cứng (hardcode) để xử lý số lượng lớn và sự linh hoạt của AI khi có sự cố sẽ giúp luồng công việc vận hành trơn tru và tối ưu chi phí token.
Để làm được việc này với nhiều Chrome Profile, bạn bắt buộc phải dùng môi trường cục bộ (Node.js) thay vì Tampermonkey. Kịch bản vận hành sẽ như sau:
 * Runner (Node.js + Playwright): Mở lần lượt các thư mục Profile Chrome, lấy danh sách Creator và chạy code thao tác nhanh.
 * Tracer: Nếu một bước bị lỗi (ví dụ: TikTok đổi class nút Bấm, gây Timeout), script sẽ tự động chụp màn hình, lưu file HTML cục bộ của trang đó và ghi log lỗi.
 * Healer (AI / Agent Browser): Agent sẽ được trigger, đọc file log + HTML, viết lại file selector và cho Runner chạy tiếp.
Dưới đây là mã nguồn và bộ Skill cụ thể để bạn thiết lập luồng này.
1. Script Điều phối (Node.js Playwright Runner)
Lưu file này là auto_invite.js. Script này hỗ trợ chạy nhiều profile và xuất data lỗi ra file để AI phân tích.
const { chromium } = require('playwright');
const fs = require('fs');

// --- CẤU HÌNH ---
// Đường dẫn tới thư mục chứa các Profile Chrome (bạn cần tạo trước các profile này và đăng nhập sẵn)
const PROFILES = [
    './chrome_profiles/shop_1',
    './chrome_profiles/shop_2'
];

// Danh sách Creator cần mời
const CREATORS = ['nhungluong270292', 'creator_test_01'];

const MESSAGE = 'Hãy hợp tác với Kệ...';
const PHONE = '0946096033';

async function runProfile(profilePath, creators) {
    console.log(`\n🚀 Đang khởi động Profile: ${profilePath}`);
    const browser = await chromium.launchPersistentContext(profilePath, {
        headless: false,
        viewport: { width: 1280, height: 720 },
        args: ['--disable-blink-features=AutomationControlled'] // Giảm thiểu bị detect bot
    });

    const page = await browser.newPage();

    for (let creator of creators) {
        try {
            console.log(`[${profilePath}] Đang xử lý: ${creator}`);
            await page.goto('https://partner.tiktokshop.com/affiliate-cmp/creator/market=7', { waitUntil: 'networkidle' });

            // BƯỚC 1: TÌM KIẾM
            const searchInput = page.getByPlaceholder('Search products, hashtags, or creators...');
            await searchInput.waitFor({ state: 'visible', timeout: 5000 });
            await searchInput.fill(creator);
            await searchInput.press('Enter');
            await page.waitForTimeout(3000);

            // BƯỚC 2: LƯU CREATOR
            const firstRow = page.locator('table tbody tr').first();
            const saveBtn = firstRow.locator('button').nth(1); // Playwright dùng 0-indexed
            await saveBtn.click();
            await page.waitForTimeout(1000);

            // BƯỚC 3: MỞ DANH SÁCH & CHỌN
            await page.getByRole('button', { name: 'Saved creators' }).click();
            await page.waitForTimeout(2000);
            
            const drawer = page.locator('div[role="dialog"]');
            await drawer.locator('input[type="checkbox"]').first().check();
            await drawer.getByRole('button', { name: /Invite/ }).click();
            await page.waitForSelector('text="Invite creators"', { state: 'visible' });

            // BƯỚC 4: ĐIỀN FORM
            await page.getByLabel('Inviting the creator for product distribution').check();
            await page.locator('textarea').fill(MESSAGE);
            
            const zaloInput = page.locator('div').filter({ hasText: /^Zalo$/ }).locator('input');
            await zaloInput.fill(PHONE);
            const phoneInput = page.locator('div').filter({ hasText: /^Phone number \(optional\)$/ }).locator('input');
            await phoneInput.fill(PHONE);

            // BƯỚC 5: GỬI (Comment lại khi test)
            // await page.getByRole('button', { name: 'Send invite' }).click();
            console.log(`✅ Thành công: ${creator}`);
            await page.waitForTimeout(5000); // Nghỉ giữa các lượt

        } catch (error) {
            console.error(`❌ Lỗi tại ${creator}: Bắt đầu thu thập data cho AI...`);
            
            // XUẤT DỮ LIỆU CHO AI PHÂN TÍCH
            const errorHtml = await page.content();
            fs.writeFileSync('error_context.html', errorHtml);
            fs.writeFileSync('error.log', error.message);
            await page.screenshot({ path: 'error_screenshot.png' });
            
            console.log('🛑 Đã xuất file lỗi. Dừng Profile này để AI xử lý...');
            await browser.close();
            
            // Thoát tiến trình với mã lỗi để các tool như Claude Code/Agent Browser biết mà can thiệp
            process.exit(1); 
        }
    }
    await browser.close();
}

(async () => {
    for (let profile of PROFILES) {
        await runProfile(profile, CREATORS);
    }
    console.log('🎉 Đã chạy xong toàn bộ hệ thống!');
})();

2. Cấu hình Skill cho Agent (Claude Code / Agent-browser)
Khi file auto_invite.js văng lỗi (exit code 1), bạn có thể dùng lệnh của công cụ AI trên terminal (ví dụ: claude "fix the automation script") và đính kèm bộ Skill dưới đây để nó tự động sửa.
Lưu nội dung dưới đây thành file tiktok-healer-skill.md và cung cấp cho Agent làm context (hoặc add vào Agent Browser):
# Role
You are a Self-Healing Automation Engineer expert in Playwright and Node.js. Your job is to analyze broken Playwright scripts caused by DOM changes in TikTok Shop Partner Center, rewrite the selectors, and get the script running again.

# Trigger Condition
You are activated when `auto_invite.js` fails and exits with an error code, generating `error.log` and `error_context.html`.

# Execution Steps
1. **Analyze Error:** Read `error.log` to identify which Playwright step failed (e.g., timeout waiting for a selector, element not found, element not interactable).
2. **Analyze Context:** Read `error_context.html` (and `error_screenshot.png` if accessible) to understand the current DOM structure of the TikTok Shop interface.
3. **Identify New Selectors:** Find the robust, updated CSS/XPath selectors or use Playwright's locator methods (e.g., `getByRole`, `getByText`, `filter`) to target the required element that caused the failure.
4. **Rewrite Code:** Modify the `auto_invite.js` file. Update ONLY the specific line(s) of code that failed with the newly discovered locators. Do not change the overall structure or logic of the loop.
5. **Verify:** Run `node auto_invite.js` again to verify the fix works. If it fails again, repeat the process.

# Constraints
* Always prioritize text-based or ARIA-role locators (`getByRole`, `getByLabel`, `getByPlaceholder`) over brittle auto-generated class names (like `.tiktok-123xyz`).
* When dealing with Modals/Drawers, ensure you scope locators within the dialog (e.g., `page.locator('div[role="dialog"]').getByRole(...)`).

Cách vận hành thực tế
Thay vì gõ lệnh thủ công mỗi khi lỗi, bạn có thể tạo một file bash script/batch script đơn giản để tự động gọi Agent mỗi khi Node.js thoát với lỗi.
Ví dụ trong terminal (giả định dùng Claude CLI hoặc một Agent CLI tương tự):
# Vòng lặp tự động sửa lỗi
while true; do
  node auto_invite.js
  EXIT_CODE=$?
  
  if [ $EXIT_CODE -eq 0 ]; then
    echo "Hoàn thành không có lỗi."
    break
  else
    echo "Phát hiện lỗi, đang gọi AI Agent để sửa code..."
    # Gọi AI đọc log và sửa code tự động. Thay dòng dưới bằng CLI của Agent bạn đang dùng
    agent-browser fix "Read error.log and error_context.html, update auto_invite.js based on tiktok-healer-skill.md"
  fi
done

Hệ thống này sẽ tự động vận hành nhiều profile, thao tác liên tục và khi giao diện cập nhật, phần mềm sẽ "chết", ném ra HTML, AI vào đọc file HTML, sửa lại selector trong file auto_invite.js và vòng lặp bash sẽ khởi động lại chương trình tự động.
