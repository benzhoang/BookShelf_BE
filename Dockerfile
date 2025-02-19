# Sử dụng Node.js làm base image
FROM node:18

# Đặt thư mục làm việc
WORKDIR /app

# Sao chép code vào container
COPY . .

# Cài đặt dependencies
RUN npm install

# Expose cổng 3000
EXPOSE 3000

# Chạy ứng dụng
CMD ["node", "./src/index.js"]