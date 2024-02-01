// TODO sentence-case, start-case 可能無法滿足
// TODO 如果要使用正則，則很難滿足 POSIX
export function styleChecker() {
  const styleCheckerStr = `
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
  `;

  return styleCheckerStr;
}