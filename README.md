# Healthier VietinBank — AI đồng hành điều phối

Prototype local dùng dữ liệu giả, chưa kết nối Google Sheets hay hệ thống ngân hàng.

## Chạy trên Windows

Yêu cầu Node.js 20 trở lên và pnpm.

```powershell
pnpm install
pnpm dev
```

Mở `http://127.0.0.1:4173`.

## Tài khoản mẫu

- Người dùng: bấm **Vào vai người dùng**; hoặc `minhanh.n` với PIN `123456`.
- Admin: bấm **Vào vai Admin**; hoặc `admin.vtb` với PIN `654321`.

Trong prototype, form đăng nhập chấp nhận mọi `userAD` cùng PIN đúng 6 chữ số. Dữ liệu phiên và consent chỉ được lưu trong `localStorage` của trình duyệt.

## Phạm vi đã mô phỏng

- Đăng nhập / tạo tài khoản và consent dữ liệu.
- Dashboard và next-best action.
- Prepare 5 bước, bộ câu hỏi check-in/check-out curated và tips tình huống khó.
- Review 5 bước, ghi nhận mức “thông”, action plan và xác nhận insight.
- Nhật ký phát triển năng lực điều phối.
- Góp ý phát triển ứng dụng.
- Admin Console: người dùng, góp ý, đặt lại PIN và vận hành dữ liệu.

## Chưa có trong bản local

- API backend, phân quyền thật và bảo vệ session phía server.
- Google Sheets API, backup, xóa dữ liệu trong 30 ngày.
- AI/LLM. Insight hiện dùng dữ liệu và nội dung giả theo luật đã đặc tả.
