import e from "express";

declare module DichVu {
    export interface User {
        user_id: number;
        name: string;
        age: number;
        gender?: string; // Giới tính có thể không bắt buộc
    }

    export interface NhanVien {
        employee_id: number;
        name: string;
        age: number;
        sokhach?: number; // Số khách có thể không bắt buộc
        lichLamViec?: any; // Kiểu dữ liệu của lịch làm việc có thể là object hoặc một kiểu dữ liệu cụ thể hơn nếu bạn định nghĩa
        dichvu_id: number[]; // Foreign key đến DichVu, dùng để xác định dịch vụ mà nhân viên này cung cấp, kiểu dữ liệu phù hợp để lưu trữ nhiều dịch vụ
    }

    export interface LichHen {
        lichhen_id: number;
        date: string; // Ngày hẹn (YYYY-MM-DD)
        time: string; // Thời gian hẹn (HH:MM)
        dichvu_id: number; // Foreign key đến DichVu
        employee_id: number; // Foreign key đến NhanVien
        user_id: number; // Foreign key đến User
        status?: string; // Trạng thái lịch hẹn (ví dụ: pending, confirmed, completed)
        review_id?: number; // Foreign key đến Review
    }

    export interface DichVu {
        dichvu_id: number;
        name: string;
        price: number;
        description?: string; // Mô tả dịch vụ có thể không bắt buộc
        thoiGianThucHien?: number; // Thời gian thực hiện dịch vụ (ví dụ: phút)
    }

    export interface Review {
        review_id: number;
        review: string; // Nội dung đánh giá
        rating: number; // Điểm đánh giá
        employee_id: number; // Foreign key đến NhanVien
        response?: any; // Phản hồi từ nhân viên (có thể là object hoặc string)
        user_id: number; // Foreign key đến User
        dichvu_id: number; // Foreign key đến DichVu
        create_at?: string; // Thời gian tạo đánh giá
    }
}

export default DichVu;