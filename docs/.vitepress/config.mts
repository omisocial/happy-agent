import { defineConfig } from 'vitepress'

export default defineConfig({
  title: "TikTok Connect",
  description: "Trang hướng dẫn sử dụng Hệ thống tự động mời Creator",
  lang: 'vi-VN',
  themeConfig: {
    nav: [
      { text: 'Trang chủ', link: '/' },
      { text: 'Hướng dẫn sử dụng', link: '/sop/user-guide' },
      { text: 'Kiến trúc', link: '/architecture' }
    ],

    sidebar: [
      {
        text: 'Vận hành (SOP)',
        items: [
          { text: 'Hướng dẫn sử dụng', link: '/sop/user-guide' }
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
