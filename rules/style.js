export function styleChecker() {
  const styleCheckerStr = `
  check_style() (
    style_name="$1"
    string="$2"

    case "$style_name" in
        "lower-case")
            echo "$string" | grep -qE '^[a-z]+$' && echo "true" || echo "false"
            ;;
        "upper-case")
            echo "$string" | grep -qE '^[A-Z]+$' && echo "true" || echo "false"
            ;;
        "camel-case")
            echo "$string" | grep -qE '^[a-z]+([A-Z][a-z]+)*$' && echo "true" || echo "false"
            ;;
        "kebab-case")
            echo "$string" | grep -qE '^[a-z]+(-[a-z]+)*$' && echo "true" || echo "false"
            ;;
        "pascal-case")
            echo "$string" | grep -qE '^[A-Z][a-z]+([A-Z][a-z]+)*$' && echo "true" || echo "false"
            ;;
        "sentence-case")
            echo "$string" | grep -qE '^[A-Z][a-z]*([ ][a-z]+)*$' && echo "true" || echo "false"
            ;;
        "snake-case")
            echo "$string" | grep -qE '^[a-z]+(_[a-z]+)*$' && echo "true" || echo "false"
            ;;
        "start-case")
            echo "$string" | grep -qE '^[A-Z][a-z]*([ ][A-Z][a-z]*)*$' && echo "true" || echo "false"
            ;;
        *)
            echo "Unknown style"
            ;;
    esac
  )
  `;

  return styleCheckerStr;
}