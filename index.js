#!/usr/bin/env node

import path from 'path';
import i18next from './i18n/settings.js';

import { parserCommitStruct } from './rules/parser.js';
import { loadConfig, initHook, createHookFile } from './utils/files.js';
import { ruleMap } from './rules/ruleMap.js';
import { modal, setEditor, setTTY, setModalColor } from './utils/modal.js';
import { styleChecker } from './rules/style.js';

export async function init() {
  const data = await loadConfig();
  const config = data.config;

  config.forEach(hookConfig => {
    const hookName = hookConfig.hook;
    const hookFilePath = path.join('.git', 'hooks', hookName);
  
    initHook(hookFilePath)

    const configLang = hookConfig.lang;
    i18next.changeLanguage(configLang);
    
    const commitParser = parserCommitStruct(hookName);
    const commitHintColor = setModalColor();
    const commitEditor = setEditor();
    const commitTTY = setTTY();
    const commitErrorModal = modal();
    const commitStyle = styleChecker();
  
    const ruleBucket = [
      commitParser, 
      commitHintColor, 
      commitEditor, 
      commitTTY, 
      commitErrorModal, 
      commitStyle
    ];
  
    hookConfig.rules.forEach(rule => {
      const ruleStr = ruleMap[rule.name](rule);
      ruleBucket.push(ruleStr);
    })
  
    const result = ruleBucket.join('\n');
    createHookFile(hookFilePath, result);
  });

  console.log(i18next.t('git_hooks_already_update'));
}

init();