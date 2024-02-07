# 選擇一個 Node.js 的官方基礎映像
FROM node:20.11.0

# 設置容器內的工作目錄
WORKDIR /app

# 如果您的 npm package 已經發布到 npm registry，可以直接使用 npm install 命令安裝
# 例如，您的 package 名稱為 commitlint-tool
RUN npm install -g commitlint-tool

# 複製啟動腳本到容器內（下一步會創建此腳本）
COPY entrypoint.sh /app/entrypoint.sh

# 給予啟動腳本執行權限
RUN chmod +x /app/entrypoint.sh

# 設置容器啟動時執行的命令
ENTRYPOINT ["/app/entrypoint.sh"]
