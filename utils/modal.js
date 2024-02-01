export function setEditor(){
  const setEditorStr = `
  set_editor() {
    test -z "\${HOOK_EDITOR}" && HOOK_EDITOR=$(git config --get core.editor)
    test -z "\${HOOK_EDITOR}" && HOOK_EDITOR=$VISUAL
    test -z "\${HOOK_EDITOR}" && HOOK_EDITOR=$EDITOR
    test -z "\${HOOK_EDITOR}" && HOOK_EDITOR='vi'
  }  
  `
  return setEditorStr;
}

export function setTTY(){
  const setTTYStr = `
  set_tty(){
    if tty >/dev/null 2>&1; then
      TTY=$(tty)
    else
      TTY=/dev/tty
    fi
  }
  `
  return setTTYStr;
}

export function setModalColor(){
  const setModalColorStr = `
  get_color() {
    # 根據 level 設定顏色
    if [ "$1" -eq 1 ]; then
        # 加粗的黃色
        echo "\x1b[1;33m"
    elif [ "$1" -eq 2 ]; then
        # 加粗的紅色
        echo "\x1b[1;31m"
    else
        # 預設顏色（重置顏色）
        echo "\x1b[0m"
    fi
  }
  `
  return setModalColorStr;
}

export function modal() {
  const modalStr = `
  # $1 = level
  # $2 = msg
  modal() {
    modal_color=$(get_color "$1")
    set_editor
    set_tty

    printf "%b%s%b\n" "\${modal_color}" "$2" "[0m"
    printf "Continue? (y/n): "

    read REPLY < "$TTY"
    case "$REPLY" in
        [Yy]*) ;;
        [Nn]*) echo "Commit cancelled."; exit 1;;
        *) echo "Please answer yes or no."; exit 1;;
    esac
  }
  `;
  return modalStr;
}