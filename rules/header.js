import i18n from '../i18n/settings.js';

export function headerMaxLength(ruleConfig) {
  const { level = 0, applicable = 'always', value = 50 } = ruleConfig;
  if (level === 0) return '';

  const headerMaxLengthStr = `
  headerMaxLength() {
    HEADER_LENGTH=\${#HEADER}
    always_case=$([ $HEADER_LENGTH -gt ${value} ] && [ ${applicable} = "always" ] && echo "true")
    never_case=$([ $HEADER_LENGTH -lt ${value} ] && [ ${applicable} = "never" ] && echo "true")

    # 根據條件判斷是否顯示 modal
    if [ "$always_case" = "true" ] || [ "$never_case" = "true" ]; then
      modal "${level}" "${i18n.t(`header_max_length_${applicable}`, { length: value })}"
    fi
  }

  headerMaxLength
  `;
  return headerMaxLengthStr;
}

export function headerMinLength(ruleConfig) {
  const { level = 0, applicable = 'always', value = 10 } = ruleConfig;
  if (level === 0) return '';

  const headerMinLengthStr = `
  headerMinLength() {
    HEADER_LENGTH=\${#HEADER}

    always_case=$([ $HEADER_LENGTH -lt ${value} ] && [ ${applicable} == "always" ] && echo "true")
    never_case=$([ $HEADER_LENGTH -gt ${value} ] && [ ${applicable} == "never" ] && echo "true")

    if [ "$always_case" = "true" ] || [ "$never_case" = "true" ]; then
      modal "${level}" "${i18n.t(`header_min_length_${applicable}`, { length: value })}"
    fi
  }

  headerMinLength
  `;
  return headerMinLengthStr;
}

export function headerCase(ruleConfig) {
  const { level = 0, applicable = 'always', value = 'lower-case' } = ruleConfig;
  if(level === 0) return '';

  const headerCaseStr= `
  headerCase() {
    style_result=$(check_style "${value}" "$HEADER")
  
    always_case=$([ ${applicable} = always ] && [ "$style_result" = "false" ] && echo "true")
    never_case=$([ ${applicable} = never ] && [ "$style_result" != "false" ] && echo "true")

    if [ "$always_case" = "true" ] || [ "$never_case" = "true" ] ; then
      modal "${level}" "${i18n.t(`header_case_${applicable}`, { style: value })}"
    fi
  }
  headerCase
  `;

  return headerCaseStr;
}

export function headerFullStop(ruleConfig) {
  const { level = 0, applicable = 'always', value = 'lower-case' } = ruleConfig;
  if(level === 0) return '';

  const checkHeaderLastWord = `
  check_header_last_word() {
    header_last_word="\${HEADER: -1}"
    expected="${value}"

    always_case=$([ "${applicable}" = "always" ] && [ "$header_last_word" != "$expected" ] && echo "true")
    never_case=$([ "${applicable}" = "never" ] && [ "$header_last_word" = "$expected" ] && echo "true")

    if [ "$always_case" = "true" ] || [ "$never_case" = "true" ]; then
      modal "${level}" "${i18n.t(`header_full_stop_${applicable}`, { char: value })}"
    fi
  }
  check_header_last_word
  `;
  return checkHeaderLastWord;
}

export function headerTrim(ruleConfig) {
  const { level = 0, applicable = 'always' } = ruleConfig;
  if(level === 0) return '';

  const checkHeaderLastWord = `
  check_header_whitespace() {
    # 去除標題前後的空白
    trimmed_header=$(echo "$HEADER" | sed 's/^[ \t]*//;s/[ \t]*$//')

    # 比較修剪前後的標題是否相同
    always_case=$([ "${applicable}" = "always" ] && [ "$HEADER" != "$trimmed_header" ] && echo "true")
    never_case=$([ "${applicable}" = "never" ] && [ "$HEADER" = "$trimmed_header" ] && echo "true")

    if [ "$always_case" = "true" ] || [ "$never_case" = "true" ]; then
      modal "${level}" "${i18n.t(`header_trim_${applicable}`)}"
    fi
  }
  check_header_whitespace
  `;
  return checkHeaderLastWord;
}