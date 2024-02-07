#!/bin/bash

# 執行您的 npm package 工具，這裡假設它需要 commitlint.json 配置文件
commitlint-generator

# 保持容器運行，如果您的工具執行完畢就退出，可以忽略下面的命令
tail -f /dev/null
