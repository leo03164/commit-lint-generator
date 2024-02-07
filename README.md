<div align="center">
<h1 align="center">Commit Lint Generator</h1>
<img width="70%" height="50%" src="./commit_lint_generator.png">

Construct your team's commit rules through Javascript.
</div>

## Description
Commit Lint Generator is a tool designed for inspecting commits. It takes a `commitlintrc.js` file as configuration, which defines `hooks` and various `rules`. You can specify the `rule` needed for inspection based on a particular hook. All available rules can be found at [commitlint](https://commitlint.js.org/#/reference-rules). For currently supported rules, refer to the Support rules section. Support for additional rules will be gradually added.

## Features
- Checks commit formats based on configured rules.
- Supports multilingual error messages.
- Complies with most POSIX standards.
- Supports any platform.

## Usage 1 (no env)
Using Docker and mounting the project's `.git` and `commitlintrc.js`.
```
docker run -v $(pwd)/.git:/app/.git -v $(pwd)/commitlintrc.js:/app/commitlintrc.js commitlint-generator
```

## Usage 2 (nodeJs)
### 1. Install nodejs
If you do not have nodejs installed, please install it first.
Version information: **`nodejs > 16.13.0`**

### 2. Install required packages
> npm i -g commit-lint-generator


### 3. Define rules
You can define your team's commit standards in `commitlintrc.js`.  
`commitlintrc.js` exports an array named `config`, containing rules specified for each `hook`.

The structure is defined as follows:
```javascript
export const config = [
  {
    hook: "the hook that triggers",
    lang: "en_us",
    rules: [
      {
        name: "rule name",
        level: "0 ignore, 1 yellow text, 2 red text",
        applicable: "always | never when choosing never, it means to reverse the rule",
        value: "rule value"
      },
      {
        name: "header-max-length",
        level: 2,
        applicable: "always",
        value: 10
      },
      // other rules...
    ]
  }
]
```

### 4. Direct use
```bash
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

## Donation
- **Ko-fi**: [![Donate with Ko-fi](https://ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/leo03164)
- **Buy Me a Coffee**: [![Donate with Buy Me a Coffee](https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png)](https://www.buymeacoffee.com/leo03164)

*Read this in other languages: [繁體中文](README.zh.md)*