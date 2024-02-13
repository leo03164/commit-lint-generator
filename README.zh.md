<div align="center">
<h1 align="center">Commit Lint Generator</h1>
<img width="70%" height="50%" src="./commit_lint_generator.png">

透過 Javascript 建構團隊的 Commit 規則
</div>

## 描述
Commit Lint Generator 是一個針對 commit 進行檢驗的工具，它會接收一個 `commitlintrc.js` 作為設定檔，該檔案會定義包含 `hooks` 以及各種 `rule`，你可以針對特定的 hook 來指定需要檢查的 `rule`，你可以在 [commitlint](https://commitlint.js.org/#/reference-rules) 找到所有的 rules ，目前所支援的 rules 請參考 Support rules 章節，未來將會逐步支援其他的規則  

## 功能
- 基於設定的 rules 來檢查 commit 格式
- 錯誤訊息支援多國語系
- 符合大部分 POSIX 規範
- 支援任何平台

## 使用方式1 (不建置環境)
使用 docker 並且掛載專案的 `.git` 以及 `commitlintrc.js`
```
docker run --rm -v $(pwd)/.git:/app/.git -v $(pwd)/commitlintrc.js:/app/commitlintrc.js leo03164/commitlint-generator
```

## 使用方式2 (node.js環境)
### 1. 安裝 nodejs
如果你沒有 nodejs 請先安裝 nodejs
版本資訊 **`nodejs > 16.13.0`**

### 2. 安裝必要套件
```
npm i -g commit-lint-generator
```

### 3. 定義規則
你可以在 `commitlintrc.js` 中定義團隊的 commit 規範。  
`commitlintrc.js` 中匯出一個名為 `config` 的陣列，該陣列包含各個 `hooks` 所指定的規則

定義的結構如下
```javascript=
export const config = [
  {
    hook: "觸發的 hook",
    lang: "zh_tw",
    rules: [
      {
        name: "規則名稱",
        level: "0 不理會, 1 黃色文字, 2 紅色文字",
        applicable: "always | never 當選擇 never 時代表將規則反轉",
        value: "規則值"
      },
      {
        name: "header-max-length",
        level: 2,
        applicable: "always",
        value: 10
      },
      // 其他規則們...
    ]
  }
]
```

### 4. 直接使用
```bash=
commitlint-generator
```

## Support rules
**Parser**
- [x] body-leading-blank

**Header**
- [x] header-case
- [x] header-full-stop
- [x] header-max-length
- [x] header-min-length
- [x] header-trim

**Type** 
- [x] type-enum
- [x] type-case

**Body**
- [x] body-full-stop
- [x] body-empty
- [x] body-max-length
- [x] body-max-line-length
- [x] body-min-length
- [x] body-case

**Footer**
- [x] footer-empty
- [x] footer-max-length
- [x] footer-max-line-length
- [x] footer-min-length

## 用行動支持
- **Ko-fi**: [![Donate with Ko-fi](https://ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/leo03164)
- **Buy Me a Coffee**: [![Donate with Buy Me a Coffee](https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png)](https://www.buymeacoffee.com/leo03164)