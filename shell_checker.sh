#!/bin/sh
# Git hook script for commit-msg

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

  OUTPUT=$(echo "$COMMIT_MSG" | while IFS= read -r line || [ -n "$line" ]; do
      LINE_NUMBER=$((LINE_NUMBER + 1))

      # 檢查是否為 header 後的第一個空行（前導空行）
      if [ -n "$line" ] && [ -z "$PREV_LINE" ] && [ "$PREV_PREV_LINE" = "$HEADER" ]; then
          BODY_START=$LINE_NUMBER
      fi

      # 若已確定 body 起始行，尋找 body 終止行
      if [ $BODY_START -ne 0 ] && [ $LINE_NUMBER -ge $BODY_START ]; then
          if [ -z "$line" ]; then
              BODY_END=$((LINE_NUMBER - 1))
              echo "$BODY_START $BODY_END"
              break
          elif [ $LINE_NUMBER -eq $COMMIT_MSG_LINES ]; then
              BODY_END=$LINE_NUMBER
              echo "$BODY_START $BODY_END"
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
  else
      BODY_START=0
      BODY_END=0
  fi

  # 擷取 body
  if [ $BODY_START -ne 0 ] && [ $BODY_END -ne 0 ]; then
      BODY=$(echo "$COMMIT_MSG" | sed -n "${BODY_START},${BODY_END}p")
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
      FOOTER=$(echo "$COMMIT_MSG" | sed -n "${FOOTER_START},${FOOTER_END}p")
  fi

  # 輸出結果
  echo "Header: $HEADER"
  echo "Type: $TYPE"
  echo "Body: $BODY"
  echo "Footer: $FOOTER"
  


  get_color() {
    # 根據 level 設定顏色
    if [ "$1" -eq 1 ]; then
        # 加粗的黃色
        echo "[1;33m"
    elif [ "$1" -eq 2 ]; then
        # 加粗的紅色
        echo "[1;31m"
    else
        # 預設顏色（重置顏色）
        echo "[0m"
    fi
  }
  

  set_editor() {
    test -z "${HOOK_EDITOR}" && HOOK_EDITOR=$(git config --get core.editor)
    test -z "${HOOK_EDITOR}" && HOOK_EDITOR=$VISUAL
    test -z "${HOOK_EDITOR}" && HOOK_EDITOR=$EDITOR
    test -z "${HOOK_EDITOR}" && HOOK_EDITOR='vi'
  }  
  

  set_tty(){
    if tty >/dev/null 2>&1; then
      TTY=$(tty)
    else
      TTY=/dev/tty
    fi
  }
  

  # $1 = level
  # $2 = msg
  modal() {
    modal_color=$(get_color "$1")
    set_editor
    set_tty

    printf "%b%s%b
" "${modal_color}" "$2" "[0m"
    printf "Continue? (y/n): "

    read REPLY < "$TTY"
    case "$REPLY" in
        [Yy]*) ;;
        [Nn]*) echo "Commit cancelled."; exit 1;;
        *) echo "Please answer yes or no."; exit 1;;
    esac
  }
  

  check_style() {
    local style_name="$1"
    local string="$2"

    case "$style_name" in
        "lower-case")
            [[ $string =~ ^[a-z]+$ ]] && echo "true" || echo "false"
            ;;
        "upper-case")
            [[ $string =~ ^[A-Z]+$ ]] && echo "true" || echo "false"
            ;;
        "camel-case")
            [[ $string =~ ^[a-z]+([A-Z][a-z]+)*$ ]] && echo "true" || echo "false"
            ;;
        "kebab-case")
            [[ $string =~ ^[a-z]+(-[a-z]+)*$ ]] && echo "true" || echo "false"
            ;;
        "pascal-case")
            [[ $string =~ ^[A-Z][a-z]+([A-Z][a-z]+)*$ ]] && echo "true" || echo "false"
            ;;
        "sentence-case")
            [[ $string =~ ^[A-Z][a-z]*([ ][a-z]+)*$ ]] && echo "true" || echo "false"
            ;;
        "snake-case")
            [[ $string =~ ^[a-z]+(_[a-z]+)*$ ]] && echo "true" || echo "false"
            ;;
        "start-case")
            [[ $string =~ ^[A-Z][a-z]*([ ][A-Z][a-z]*)*$ ]] && echo "true" || echo "false"
            ;;
        *)
            echo "Unknown style"
            ;;
    esac
  }
  

  headerMaxLength() {
    HEADER_LENGTH=${#HEADER}
    always_case=$([ $HEADER_LENGTH -gt 10 ] && [ always == "always" ] && echo "true")
    never_case=$([ $HEADER_LENGTH -lt 10 ] && [ always == "never" ] && echo "true")

    # 根據條件判斷是否顯示 modal
    if [ "$always_case" = "true" ] || [ "$never_case" = "true" ]; then
      modal "2" "請重新檢查 header 是否超出最大長度限制 10"
    fi
  }

  headerMaxLength
  

  checkBodyEmpty() {
    always_case=$([ never = "always" ] && [ -n "$BODY" ] && echo "true")
    never_case=$([ never = "never" ] && [ -z "$BODY" ] && echo "true")

    if [ "$always_case" = "true" ] || [ "$never_case" = "true" ]; then
      modal "2" "請保持 body 非空字串"
    fi
  }
  checkBodyEmpty
  

  checkFooterEmpty() {

    always_case=$([ never = "always" ] && [ -n "$FOOTER" ] && echo "true")
    never_case=$([ never = "never" ] && [ -z "$FOOTER" ] && echo "true")

    if [ "$always_case" = "true" ] || [ $never_case = "true" ]; then
      modal "2" "請保持 footer 非空字串"
    fi
  }
  checkFooterEmpty
  

  typeEnum() {
    valid_types="Test Add Modify Refactor Remove Fix"
    is_in_white_list=0
    for i in $valid_types; do
        if [ "$i" = "$TYPE" ]; then
            is_in_white_list=1
            break
        fi
    done

    always_case=$([ always = always ] && [ "$is_in_white_list" -ne 1 ] && echo "true")
    never_case=$([ always = never ] && [ "$is_in_white_list" -eq 1 ] && echo "true")

    if [ "$always_case" = "true" ] || [ "$never_case" = "true" ]; then
      modal "2" "請重新檢查 type 是否在白名單中"
    fi
  }
  typeEnum
  

  body_max_line_length() {
    LINE_COUNT=$(echo "$BODY" | wc -l)

    always_case=$([ "always" = "always" ] && [ "$LINE_COUNT" -gt "5" ] && echo "true")
    never_case=$([ "always" = "never" ] && [ "$LINE_COUNT" -lt "5" ] && echo "true")

    if [ "$always_case" = "true" ] || [ "$never_case" = "true" ]; then
      modal "2" "body_max_line_length_always"
    fi
  }
  body_max_line_length
  

  footer_max_line_length() {
    LINE_COUNT=$(echo "$FOOTER" | wc -l)

    always_case=$([ "always" = "always" ] && [ "$LINE_COUNT" -gt "5" ] && echo "true")
    never_case=$([ "always" = "never" ] && [ "$LINE_COUNT" -lt "5" ] && echo "true")

    if [ "$always_case" = "true" ] || [ "$never_case" = "true" ]; then
      modal "2" "footer_max_line_length_always"
    fi
  }
  footer_max_line_length
  

  body_max_length() {
    echo "$BODY" | while IFS= read -r line
    do
      LINE_CHARS=$(printf "%s" "$line" | wc -m)
      
      always_case=$([ "always" = "always" ] && [ "$LINE_CHARS" -gt 20 ] && echo "true")
      never_case=$([ "always" = "never" ] && [ "$LINE_CHARS" -lt 20 ] && echo "true")

      if [ "$always_case" = "true" ] || [ "$never_case" = "true" ]; then
        exit 1;
      fi
    done

    # 檢查執行結果
    if [ $? -ne 0 ]; then
      modal "2" "請重新檢查 body 是否超出最大長度限制 20"
    fi
  }
  body_max_length
  

  footer_max_length() {
    echo "$FOOTER" | while IFS= read -r line
    do
      LINE_CHARS=$(printf "%s" "$line" | wc -m)
      
      always_case=$([ "always" = "always" ] && [ "$LINE_CHARS" -gt 10 ] && echo "true")
      never_case=$([ "always" = "never" ] && [ "$LINE_CHARS" -lt 10 ] && echo "true")

      if [ "$always_case" = "true" ] || [ "$never_case" = "true" ]; then
        exit 1;
      fi
    done

    # 檢查執行結果
    if [ $? -ne 0 ]; then
      modal "2" "請重新檢查 footer 是否超出最大長度限制 10"
    fi
  }
  footer_max_length
  

  body_min_length() {
    echo "$BODY" | while IFS= read -r line
    do
      LINE_CHARS=$(printf "%s" "$line" | wc -m)
      
      always_case=$([ "always" = "always" ] && [ "$LINE_CHARS" -lt 3 ] && echo "true")
      never_case=$([ "always" = "never" ] && [ "$LINE_CHARS" -gt 3 ] && echo "true")

      if [ "$always_case" = "true" ] || [ "$never_case" = "true" ]; then
        exit 1;
      fi
    done

    # 檢查執行結果
    if [ $? -ne 0 ]; then
      modal "2" "請重新檢查 body 是否小於最低長度限制 3"
    fi
  }
  body_min_length
  

  footer_min_length() {
    echo "$FOOTER" | while IFS= read -r line
    do
      LINE_CHARS=$(printf "%s" "$line" | wc -m)
      
      always_case=$([ "always" = "always" ] && [ "$LINE_CHARS" -lt 5 ] && echo "true")
      never_case=$([ "always" = "never" ] && [ "$LINE_CHARS" -gt 5 ] && echo "true")

      if [ "$always_case" = "true" ] || [ "$never_case" = "true" ]; then
        exit 1;
      fi
    done

    # 檢查執行結果
    if [ $? -ne 0 ]; then
      modal "2" "請重新檢查 footer 是否小於最低長度限制 5"
    fi
  }
  footer_min_length
  