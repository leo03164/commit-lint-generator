import i18n from '../i18n/settings.js';

export function bodyFullStop(ruleConfig){
  const { level = 0, applicable = 'always', value = '.' } = ruleConfig;
  if(level === 0) return '';

  const checkBodyEnd = `
  checkBodyEnd() {
    # 判斷 BODY 是否為空
    if [ -n "$BODY" ]; then
      # BODY 非空時，使用 awk 處理每一行的內容
      ERR_MSG=$(echo "$BODY" | awk -v applicable="${applicable}" -v value="${value}" '
      {
        # 取得每一行的最後一個字元
        lastChar = substr($0, length($0));
        
        # 根據規則檢查最後一個字元
        if ((applicable == "always" && lastChar != value) || 
            (applicable == "never" && lastChar == value)) {
          # 建立錯誤訊息
          printf "Error: Line %d end string is invalid", NR;
          # printf "${i18n.t(`body_full_stop_${applicable}`, { char: value })}"
          exit 1;
        }
      }')

      # 檢查 awk 的執行結果
      if [ $? -ne 0 ]; then
        # 呼叫 modal 函數顯示錯誤
        modal ${level} "$ERR_MSG"
      fi
    fi
  }
  checkBodyEnd
  `;
  
  return checkBodyEnd;
}

export function bodyEmpty(ruleConfig) {
  const { level = 0, applicable = 'always' } = ruleConfig;
  if(level === 0) return '';

  const checkBodyEmpty = `
  checkBodyEmpty() {
    always_case=$([ ${applicable} = "always" ] && [ -n "$BODY" ] && echo "true")
    never_case=$([ ${applicable} = "never" ] && [ -z "$BODY" ] && echo "true")

    if [ "$always_case" = "true" ] || [ "$never_case" = "true" ]; then
      modal "${level}" "${i18n.t(`body_empty_${applicable}`)}"
    fi
  }
  checkBodyEmpty
  `
  return checkBodyEmpty;
}

export function bodyCase(ruleConfig) {
  const { level = 0, applicable = 'always', value = 'lower-case' } = ruleConfig;
  if(level === 0) return '';

  const bodyCaseStr= `
  bodyCase() {
    # 移除空白行
    REMOVED_EMPTY_LINE_BODY=$(echo "$BODY" | grep -v '^$')

    style_result=$(check_style "${value}" "$REMOVED_EMPTY_LINE_BODY")
    
    always_case=$([ -n "$BODY" ] && [ ${applicable} = always ] && [ "$style_result" = "false" ] && echo "true")
    never_case=$([ -n "$BODY" ] && [ ${applicable} = never ] && [ "$style_result" != "false" ] && echo "true")

    if [ "$always_case" = "true" ] || [ "$never_case" = "true" ] ; then
      modal "${level}" "${i18n.t(`body_case_${applicable}`, { style: value })}"
    fi
  }
  bodyCase
  `;

  return bodyCaseStr;
}

export function bodyMaxLineLength(ruleConfig) {
  const { level = 0, applicable = 'always', value = 5 } = ruleConfig;
  if(level === 0) return '';

  const bodyMaxLineLengthStr= `
  body_max_line_length() {
    LINE_COUNT=$(echo "$BODY" | wc -l)

    always_case=$([ "${applicable}" = "always" ] && [ "$LINE_COUNT" -gt "${value}" ] && echo "true")
    never_case=$([ "${applicable}" = "never" ] && [ "$LINE_COUNT" -lt "${value}" ] && echo "true")

    if [ "$always_case" = "true" ] || [ "$never_case" = "true" ]; then
      modal "${level}" "${i18n.t(`body_max_line_length_${applicable}`, { length: value })}"
    fi
  }
  body_max_line_length
  `;

  return bodyMaxLineLengthStr;
}

export function bodyMaxLength(ruleConfig) {
  const { level = 0, applicable = 'always', value = 72 } = ruleConfig;
  if(level === 0) return '';

  const bodyMaxLength= `
  body_max_length() {
    echo "$BODY" | while IFS= read -r line
    do
      LINE_CHARS=$(printf "%s" "$line" | wc -m)
      
      always_case=$([ "${applicable}" = "always" ] && [ "$LINE_CHARS" -gt ${value} ] && echo "true")
      never_case=$([ "${applicable}" = "never" ] && [ "$LINE_CHARS" -lt ${value} ] && echo "true")

      if [ "$always_case" = "true" ] || [ "$never_case" = "true" ]; then
        exit 1;
      fi
    done

    # 檢查執行結果
    if [ $? -ne 0 ]; then
      modal "${level}" "${i18n.t(`body_max_length_${applicable}`, { length: value })}"
    fi
  }
  body_max_length
  `;

  return bodyMaxLength;
}

export function bodyMinLength(ruleConfig) {
  const { level = 0, applicable = 'always', value = 0 } = ruleConfig;
  if(level === 0) return '';

  const bodyMinLength= `
  body_min_length() {
    echo "$BODY" | while IFS= read -r line
    do
      LINE_CHARS=$(printf "%s" "$line" | wc -m)
      
      always_case=$([ "${applicable}" = "always" ] && [ "$LINE_CHARS" -lt ${value} ] && echo "true")
      never_case=$([ "${applicable}" = "never" ] && [ "$LINE_CHARS" -gt ${value} ] && echo "true")

      if [ "$always_case" = "true" ] || [ "$never_case" = "true" ]; then
        exit 1;
      fi
    done

    # 檢查執行結果
    if [ $? -ne 0 ]; then
      modal "${level}" "${i18n.t(`body_min_length_${applicable}`, { length: value })}"
    fi
  }
  body_min_length
  `;

  return bodyMinLength;
}

export function bodyLeadingBlank(ruleConfig) {
  const { level = 0, applicable = 'always' } = ruleConfig;
  if(level === 0) return '';

  const bodyLeadingBlankStr= `
  body_leading_blank() {
    always_case=$([ -n "$BODY" ] && [ "${applicable}" = "always" ] && [ "$IS_BODY_LEADING_BLANK" != "true" ] && echo "true")
    never_case=$([ -n "$BODY" ] && [ "${applicable}" = "never" ] && [ "$IS_BODY_LEADING_BLANK" = "true" ] && echo "true")

    if [ "$always_case" = "true" ] || [ "$never_case" = "true" ]; then
      modal "${level}" "${i18n.t(`body_leading_blank_${applicable}`)}"
    fi
  }
  body_leading_blank
  `;

  return bodyLeadingBlankStr;
}