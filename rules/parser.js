export function parserCommitStruct(hookName) {
  const scriptTitle = `#!/bin/sh\n# Git hook script for ${hookName}`;
  const parseCommitMessageScript = 
  `
  COMMIT_MSG_FILE=$1
  COMMIT_MSG=$(cat $COMMIT_MSG_FILE | grep -v '^#' | sed '/./,$!d')

  # 分割 header
  HEADER=$(echo "$COMMIT_MSG" | head -n 1)
  COMMIT_MSG_LINES=$(echo "$COMMIT_MSG" | wc -l)

  # 初始化 type
  TYPE=$(echo "$HEADER" | awk '{print $1}')

  # 初始化 body 和 footer
  BODY=''
  FOOTER=''

  # 處理 body
  PREV_LINE=''
  PREV_PREV_LINE=''
  LINE_NUMBER=0
  BODY_START=0
  BODY_END=0
  IS_BODY_LEADING_BLANK=false

  OUTPUT=$(echo "$COMMIT_MSG" | while IFS= read -r line || [ -n "$line" ]; do
      LINE_NUMBER=$((LINE_NUMBER + 1))

      # 檢查是否為 header 後的第一個空行（前導空行）
      if [ -n "$line" ] && [ -z "$PREV_LINE" ] && [ "$PREV_PREV_LINE" = "$HEADER" ]; then
          BODY_START=$LINE_NUMBER
          IS_BODY_LEADING_BLANK=true
      elif [ -n "$line" ] && [ "$PREV_LINE" = "$HEADER" ]; then
          BODY_START=$LINE_NUMBER
      fi

      # 若已確定 body 起始行，尋找 body 終止行
      if [ $BODY_START -ne 0 ] && [ $LINE_NUMBER -ge $BODY_START ]; then
          if [ -z "$line" ]; then
              BODY_END=$((LINE_NUMBER - 1))
              echo "$BODY_START $BODY_END $IS_BODY_LEADING_BLANK"
              break
          elif [ $LINE_NUMBER -eq $COMMIT_MSG_LINES ]; then
              BODY_END=$LINE_NUMBER
              echo "$BODY_START $BODY_END $IS_BODY_LEADING_BLANK"
              break
          fi
      fi

      PREV_PREV_LINE=$PREV_LINE
      PREV_LINE=$line
  done)

  # 從 OUTPUT 中讀取 BODY_START 和 BODY_END 的值
  if [ -n "$OUTPUT" ]; then
      BODY_START=$(echo $OUTPUT | cut -d ' ' -f 1)
      BODY_END=$(echo $OUTPUT | cut -d ' ' -f 2)
      IS_BODY_LEADING_BLANK=$(echo $OUTPUT | cut -d ' ' -f 3)
  else
      BODY_START=0
      BODY_END=0
  fi

  # 擷取 body
  if [ $BODY_START -ne 0 ] && [ $BODY_END -ne 0 ]; then
      BODY=$(echo "$COMMIT_MSG" | sed -n "\${BODY_START},\${BODY_END}p")
  fi

  # 處理 footer
  FOOTER_START=0
  FOOTER_END=$COMMIT_MSG_LINES

  if [ $BODY_END -ne 0 ]; then
      FOOTER_START=$((BODY_END + 2))
  else
      FOOTER_START=5
  fi

  # 擷取 footer
  if [ $FOOTER_START -le $FOOTER_END ]; then
      FOOTER=$(echo "$COMMIT_MSG" | sed -n "\${FOOTER_START},\${FOOTER_END}p")
  fi

  # 輸出結果 For Development
  # echo "Header: $HEADER"
  # echo "Type: $TYPE"
  # echo "Body: $BODY"
  # echo "Footer: $FOOTER"
  `;

  return `${scriptTitle}\n${parseCommitMessageScript}\n`;
}
