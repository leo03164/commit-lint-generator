import i18n from '../i18n/settings.js';

export function footerEmpty(ruleConfig) {
  const { level = 0, applicable = 'always' } = ruleConfig;
  const checkFooterEmpty = `
  checkFooterEmpty() {

    always_case=$([ ${applicable} = "always" ] && [ -n "$FOOTER" ] && echo "true")
    never_case=$([ ${applicable} = "never" ] && [ -z "$FOOTER" ] && echo "true")

    if [ "$always_case" = "true" ] || [ "$never_case" = "true" ]; then
      modal "${level}" "${i18n.t(`footer_empty_${applicable}`)}"
    fi
  }
  checkFooterEmpty
  `
  return checkFooterEmpty;
}

export function footerMaxLineLength(ruleConfig) {
  const { level = 0, applicable = 'always', value = 5 } = ruleConfig;
  if(level === 0) return '';

  const footerMaxLineLengthStr= `
  footer_max_line_length() {
    LINE_COUNT=$(echo "$FOOTER" | wc -l)

    always_case=$([ "${applicable}" = "always" ] && [ "$LINE_COUNT" -gt "${value}" ] && echo "true")
    never_case=$([ "${applicable}" = "never" ] && [ "$LINE_COUNT" -lt "${value}" ] && echo "true")

    if [ "$always_case" = "true" ] || [ "$never_case" = "true" ]; then
      modal "${level}" "${i18n.t(`footer_max_line_length_${applicable}`, { length: value})}"
    fi
  }
  footer_max_line_length
  `;

  return footerMaxLineLengthStr;
}

export function footerMaxLength(ruleConfig) {
  const { level = 0, applicable = 'always', value = 72 } = ruleConfig;
  if(level === 0) return '';

  const footerMaxLength= `
  footer_max_length() {
    echo "$FOOTER" | while IFS= read -r line
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
      modal "${level}" "${i18n.t(`footer_max_length_${applicable}`, { length: value})}"
    fi
  }
  footer_max_length
  `;

  return footerMaxLength;
}

export function footerMinLength(ruleConfig) {
  const { level = 0, applicable = 'always', value = 0 } = ruleConfig;
  if(level === 0) return '';

  const footerMinLength= `
  footer_min_length() {
    echo "$FOOTER" | while IFS= read -r line
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
      modal "${level}" "${i18n.t(`footer_min_length_${applicable}`, { length: value})}"
    fi
  }
  footer_min_length
  `;

  return footerMinLength;
}