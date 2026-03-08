#!/bin/bash
# Chạy trong Git Bash: sh setup.sh hoặc bash setup.sh
cd "$(dirname "$0")"
npm install
if [ ! -f .env ]; then
  cp .env.example .env
  echo "Đã tạo file .env từ .env.example. Hãy mở .env và chỉnh MONGODB_URI, JWT_SECRET nếu cần."
else
  echo "File .env đã tồn tại, không ghi đè."
fi
