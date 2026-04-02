import { defineConfig } from 'vitepress'

export default defineConfig({
  title: "HappyAgent",
  description: "Cỗ máy Tự động hoá Vạn năng (Universal Automator)",
  lang: 'vi-VN',
  themeConfig: {
    nav: [
      { text: 'Trang chủ', link: '/' },
      { text: 'Playbook', link: '/playbook' },
      { text: 'SOP Hướng dẫn', link: '/sop/user-guide' }
    ],

    sidebar: [
      {
        text: 'Vận hành Cốt lõi',
        items: [
          { text: 'Playbook Từng Phòng Ban', link: '/playbook' },
          { text: 'Hướng dẫn Cấu hình', link: '/sop/user-guide' },
          { text: 'Thực Chiến Step-by-Step', link: '/sop/step-by-step' }
        ]
      },
      {
        text: 'Kỹ thuật',
        items: [
          { text: 'Cơ sở Kiến trúc', link: '/architecture' },
          { text: 'Triết lý Thiết kế', link: '/philosophy' },
          { text: 'Phân tích Dữ liệu', link: '/analysis' }
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/' }
    ],

    search: {
      provider: 'local',
      options: {
        locales: {
          root: {
            translations: {
              button: {
                buttonText: 'Tìm kiếm',
                buttonAriaLabel: 'Tìm kiếm'
              },
              modal: {
                noResultsText: 'Không tìm thấy kết quả',
                resetButtonTitle: 'Xoá điều kiện tìm kiếm',
                footer: {
                  selectText: 'chọn',
                  navigateText: 'chuyển',
                  closeText: 'đóng'
                }
              }
            }
          }
        }
      }
    }
  }
})
