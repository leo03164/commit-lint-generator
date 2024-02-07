FROM node:20.11.0
WORKDIR /app
RUN npm install -g commit-lint-generator
COPY entrypoint.sh /app/entrypoint.sh
RUN chmod +x /app/entrypoint.sh
ENTRYPOINT ["/app/entrypoint.sh"]
