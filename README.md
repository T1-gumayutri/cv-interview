# 🚀 AI Mock Interview Assistant

Hệ thống phỏng vấn mô phỏng ứng dụng Trí tuệ Nhân tạo (AI), cho phép ứng viên tải lên CV của họ và trải nghiệm một buổi phỏng vấn sát với thực tế dựa trên Job Description (JD) của công ty.

Dự án sử dụng **Llama 3.3 70B** (thông qua [Groq API](https://groq.com/)) để phân tích khoảng cách kỹ năng (Gap Analysis), tự động sinh câu hỏi, và chấm điểm câu trả lời qua giọng nói của ứng viên một cách khắt khe nhưng công tâm.

## ✨ Tính Năng Nổi Bật

- **📄 Phân Tích CV Nâng Cao**: Upload CV định dạng PDF, trích xuất text tự động.
- **🎯 Gap Analysis**: Đánh giá độ phù hợp (Fit Score) giữa CV và JD thực tế, chỉ ra kỹ năng còn thiếu.
- **🤖 Dynamic Questions**: AI tự động tạo ra 5 câu hỏi phỏng vấn tập trung vào điểm yếu và các kỹ năng còn thiếu, bao gồm cả câu hỏi tình huống (Behavioral) và kiểm tra thực tế (Reality Check).
- **🎙️ Ghi Âm & Chấm Điểm (Speech-to-Text & Evaluation)**: Ứng viên trả lời bằng giọng nói. AI sẽ đánh giá chi tiết Điểm mạnh, Điểm yếu, sửa lỗi ngữ pháp và đưa ra câu trả lời mẫu (Model Answer).
- **📊 Report Tổng Quan**: Báo cáo quyết định tuyển dụng (Hire / Maybe / Not Yet) cho bộ phận HR.
- **🔐 Admin Dashboard**: Quản lý các phiên phỏng vấn, xem lại file âm thanh và cấu hình Job Description của công ty.
- **🌐 Đa Ngôn Ngữ**: Hỗ trợ phỏng vấn bằng cả Tiếng Anh (en-US) và Tiếng Việt (vi-VN).

## 🛠️ Công Nghệ Sử Dụng

### 💻 Front-end (Client)

- **React.js** (Vite/CRA)
- **Tailwind CSS**: Styling giao diện hiện đại (Dark mode theme).
- **Lucide React**: Hệ thống Icon.

### ⚙️ Back-end (Server)

- **Node.js & Express.js**: RESTful API.
- **MongoDB / Mongoose**: Lưu trữ dữ liệu các phiên phỏng vấn (Sessions) và Cấu hình (Settings).
- **Multer**: Xử lý upload file (PDF, MP4/WebM/Audio).
- **PDF-Parse**: Đọc và trích xuất dữ liệu từ file PDF CV.
- **Groq SDK**: Tích hợp Model AI siêu tốc (Llama-3.3-70b-versatile).

## 🚀 Hướng Dẫn Cài Đặt (Local Development)

### Yêu cầu hệ thống:

- [Node.js](https://nodejs.org/en/) (v16 trở lên)
- [MongoDB](https://www.mongodb.com/) (Local hoặc MongoDB Atlas)
- Tài khoản và API Key của [Groq Cloud](https://console.groq.com/keys)

### 1. Cài đặt Server (Back-end)

Di chuyển vào thư mục server và cài đặt các dependencies:

```bash
cd server
npm install
```

Tạo file `.env` trong thư mục `server/` và thiết lập các biến môi trường:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/cv_interview  # Hoặc link MongoDB Atlas của bạn
GROQ_API_KEY=your_groq_api_key_here
```

Khởi động server:

```bash
npm run dev
# Server chạy tại http://localhost:5000
```

### 2. Cài đặt Client (Front-end)

Mở một terminal mới, di chuyển vào thư mục client và cài đặt dependencies:

```bash
cd client
npm install
```

Khởi động React app:

```bash
npm start
# (Hoặc npm run dev nếu dùng Vite)
```

## 📁 Cấu Trúc Thư Mục Quan Trọng

```text
CVInterview/
├── client/                 # Mã nguồn React Frontend
└── server/                 # Mã nguồn Node.js Backend
    ├── controllers/        # Xử lý logic API (Upload, Admin,...)
    ├── middleware/         # Cấu hình Multer lưu file (PDF, Audio)
    ├── models/             # Schema Database MongoDB
    ├── services/           # Chứa logic gọi Groq API (geminiService) & phân tích PDF
    └── uploads/            # Nơi lưu file tĩnh do người dùng đẩy lên (Git-ignored)
```
