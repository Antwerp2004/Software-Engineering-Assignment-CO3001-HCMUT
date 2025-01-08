<a id="readme-top"></a>

<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/minhduongts13/BTL_CNPM/tree/main">
    <img src="./public/img/HCMUT_official_logo.png" alt="Logo" width="160" height="160">
  </a>

<h3 align="center">Student Smart Printing Service</h3>

  <p align="center">
    Ứng dụng cung cấp dịch vụ in ấn cho sinh viên
  </p>
</div>

<!-- TABLE OF CONTENTS -->
<!-- <details>
  <summary>Mục lục</summary>
  <ol>
    <li>
      <a href="#about-the-project">Về dự án này</a>
      <ul>
        <li><a href="#built-with">Công nghệ sử dụng</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Bắt đầu</a>
      <ul>
        <li><a href="#prerequisites">Điều kiện</a></li>
        <li><a href="#installation">Cài đặt</a></li>
      </ul>
    </li>
    <li>
      <a href="#usage">Hướng dẫn sử dụng</a>
      <ul>
        <li><a href="#notes">Một số lưu ý</a></li>
        <li><a href="#functions">Thao tác trong ứng dụng</a></li>
        <li><a href="#errors">Lỗi có thể xảy ra khi sử dụng</a></li>
      </ul>
    </li>
  </ol>
</details> -->

<!-- ABOUT THE PROJECT -->

<a id="about-the-project"></a>

## Về dự án này

Ứng dụng này được hiện thực để phục vụ cho môn học Công nghệ phần mềm, thuộc về Trường Đại học Bách khoa, ĐHQG TP.HCM. Dự án đề cập việc xây dựng nên một trang web cung cấp dịch vụ in ấn cho sinh viên của trường.

Thành viên phát triển dự án:

- Dương Quang Minh, Đinh Xuân Quyết, Đỗ Thanh Liêm - phát triển frontend
- Đỗ Thanh Liêm - phát triển backend
- Đỗ Hoàng Quân, Đỗ Thanh Liêm - phát triển database
- Dương Quang Minh, Đinh Xuân Quyết, Đỗ Thanh Liêm, Đỗ Hoàng Quân, Hồ Quốc Đạt - phát triển thiết kế

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Công nghệ sử dụng

<a id="built-with"></a>

- Tailwind
- Bootstrap
- Pug
- ExpressJs
- MySQL
- MongoDB

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- GETTING STARTED -->

<a id="getting-started"></a>

## Bắt đầu

<a id="prerequisites"></a>

### Điều kiện

Trước khi sử dụng ứng dụng, bạn cần cài đặt trước một số phần mềm sau:

- [Node.js](https://nodejs.org/en) (phiên bản LTS)
- [MySQL](https://dev.mysql.com/downloads/installer/) (phiên bản Community)
- [MongoDB](https://www.mongodb.com/try/download/community) (phiên bản Community)

<a id="installation"></a>

### Cài đặt

Vì ứng dụng chưa được triển khai tên miền, bạn có thể sử dụng nó bằng localhost với các bước sau:

1. Truy cập đường dẫn [https://github.com/minhduongts13/BTL_CNPM.git](https://github.com/minhduongts13/BTL_CNPM.git).

2. Tải về source code và giải nén, lưu vào nơi bạn muốn

3. Mở một chương trình shell (Command Prompt, Powershell, Bash...)

4. Tại thư mục gốc, chạy lệnh sau để cài đặt các gói tin cần thiết

```bash
npm install
```

5. Tại vị trí thư mục gốc, tạo file (`.env`), điền các dòng sau với username và password của tài khoản MySQL và MongoDB mà bạn muốn sử dụng, với dòng `SECRET_ACCESS_TOKEN` thì điền chuỗi 40 ký tự ngẫu nhiên (đây là khóa bảo mật):

```properties
PORT = 3000

# mysql database config
database_host = ...
database_port = ...
database_user = ...
database_password = ...
database_name = ...

SECRET_ACCESS_TOKEN = ...

# mongodb config
BLACKLIST_URI = ...
```

6. Setup các Database

- Mở phần mềm MySQL Workbench (đi kèm khi tải MySQL Community)

- Đăng nhập vào cơ sở dữ liệu bạn muốn (mặc định: Local Instance MySQL80).

- Chạy lần lượt 2 file `hcmut_ssps_script.sql` và `function script.sql` để sinh data cho database MySQL

- Mở phần mềm MongoDB Compass (đi kèm khi tải MongoDB), tạo database `account_se_spss`, collection `blacklists`

<p align="right">(<a href="#readme-top">back to top</a>)</p>

7. Chạy chương trình: chạy lệnh sau

```bash
npm start
```

<!-- USAGE -->

<a id="usage"></a>

## Hướng dẫn sử dụng

<p align="right">(<a href="#readme-top">back to top</a>)</p>

**Lưu ý**: vì ứng dụng vẫn đang trong giai đoạn phát triển nên một số chức năng sẽ không được đầy đủ như mong muốn

### Tài khoản để sử dụng ứng dụng

Các tài khoản có sẵn trong dữ liệu mẫu:

- Tài khoản sinh viên:

  - Username: bao.trinh@hcmut.edu.vn
  - Password: 123456789

  Hoặc bất cứ tài khoản nào trong bảng `user_profile` trong MySQL

- Tài khoản nhân viên quản lý:

  - Username: nam.tranquoc@hcmut.edu.vn
  - Password: 123456789

  Hoặc bất cứ tài khoản nào trong bảng `admin_profile` trong MySQL

### Nhóm chức năng của sinh viên

#### In tài liệu

Ở giao diện **In tài liệu**, bạn có thể gửi một yêu cầu in tới server với các bước sau:

1. Đăng tải file

2. Thiết lập cấu hình in

   - Có thể thiết lập cơ bản như in 2 mặt, in 2 trang 1 mặt, ...

   - Số trang dư sẽ được hiển thị trên màn hình

   - Đơn vị trang in mặc định là A4, có thể chọn các loại giấy khác, giá tiền sẽ tính scale, ví dụ như sau:

     - 1 trang A3 = 2 trang A4
     - 1 trang B4 = 1.8 trang A4
     - 1 trang B5 = 0.8 trang A4 (số thập phân được làm tròn lên)

3. Chọn vị trí máy in

   - Lưu ý rằng máy in đang ngưng hoạt động sẽ không được hiển thị

4. Nhấn **Tải lên**

**Chú ý**: Tính năng tự động đếm số trang, nếu số trang dư đủ thì hệ thống sẽ gửi thông báo 'thành công', nếu không sẽ gửi thông báo 'số dư trang không đủ'

#### Thanh toán Online

Ở giao diện **Thanh toán Online**, bạn có thể gửi một yêu cầu mua trang tới server với các bước sau:

1. Chọn số trang cần mua

    Hệ thống sử dụng đơn vị tính là giấy A4, vì thế hệ thống sẽ tự động tính toán tổng tiền dựa trên đơn giá A4 (1000đ)

2. Xác nhận thanh toán

    Khi nhấn 'mua', bên dưới sẽ cập nhật lịch sử mua của bạn

**Chú ý**: Tính năng liên kết tới hệ thống thanh toán trực tuyến chưa được hiện thực.

#### Lịch sử in

Ở giao diện **Lịch sử in**, bạn có thể xem lại toàn bộ các yêu cầu in đã gửi từ giao diện **In tài liệu**.

Bạn có thể sử dụng tính năng lọc để lọc kết quả theo ngày hoặc máy in

#### Trang hồ sơ

Bạn nhấn nút 'avatar' ở góc trên bên phải để vào trang hồ sơ, tại đây bạn có thể đăng xuất khỏi hệ thống

### Nhóm chức năng của nhân viên quản lý (SPSO)

#### Trang chủ

Ở trang này, sẽ có những hình ảnh liên quan như các bản tin, ...

#### Quản lý máy in

Ở giao diện **Quản lý máy in**, bạn có thể sử dụng các chức năng như:

- Xem thông tin máy in

- Enable/Disable máy in

#### Chỉnh sửa hệ thống

Ở giao diện **Chỉnh sửa hệ thống**, bạn có thể sử dụng các chức năng như:

- Chỉnh lịch cấp phát trang in

- Chỉnh số trang mỗi lần cấp phát

- Chỉnh định dạng tài liệu được tải lên

#### Lịch sử dịch vụ

Ở trang này, bạn có thể xem lịch sử in của tất cả sinh viên ở tất cả máy in.
Bạn có thể lọc theo ngày, máy in, mã sinh viên

#### Xem báo cáo

Ở trang này, bạn có thể xem các thông số về tổng các loại giấy sử dụng theo tháng

#### Trang hồ sơ

Bạn nhấn nút 'avatar' ở góc trên bên phải để vào trang hồ sơ, tại đây bạn có thể đăng xuất khỏi hệ thống