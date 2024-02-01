import i18n from '../i18n/settings.js';

export function typeEnum(ruleConfig) {
  const { level = 0, applicable = 'always', value = [] } = ruleConfig;
  if(level === 0) return '';

  // 轉換陣列為 Shell 字串格式
  const shellArray = value.map(v => `${v}`).join(" ");

  const checkTypeEnum = `
  typeEnum() {
    valid_types="${shellArray}"
    is_in_white_list=0
    for i in $valid_types; do
        if [ "$i" = "$TYPE" ]; then
            is_in_white_list=1
            break
        fi
    done

    always_case=$([ ${applicable} = always ] && [ "$is_in_white_list" -ne 1 ] && echo "true")
    never_case=$([ ${applicable} = never ] && [ "$is_in_white_list" -eq 1 ] && echo "true")

    if [ "$always_case" = "true" ] || [ "$never_case" = "true" ]; then
      modal "${level}" "${i18n.t(`type_enum_${applicable}`)}"
    fi
  }
  typeEnum
  `
  return checkTypeEnum;
}

export function typeCase(ruleConfig) {
  const { level = 0, applicable = 'always', value = 'lower-case' } = ruleConfig;
  if(level === 0) return '';

  const typeCaseStr= `
  typeCase() {
    style_result=$(check_style "${value}" "$TYPE")
  
    always_case=$([ ${applicable} = always ] && [ "$style_result" = "false" ] && echo "true")
    never_case=$([ ${applicable} = never ] && [ "$style_result" != "false" ] && echo "true")

    if [ "$always_case" = "true" ] || [ "$never_case" = "true" ] ; then
      modal "${level}" "${i18n.t(`type_case_${applicable}`, { style: value})}"
    fi
  }
  typeCase
  `;

  return typeCaseStr;
}