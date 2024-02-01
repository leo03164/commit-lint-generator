import fs from 'fs';
import path from 'path';
import i18next from '../i18n/settings.js';

import { URL } from 'url';
import { config as defaultConfig } from '../commitlintrc.js'
import { FILE_PERMISSION } from '../global.js';


export async function loadConfig() {
  try {
    const userConfigPath = path.join(process.cwd(), 'commitlintrc.js');
    if (fs.existsSync(userConfigPath)) {
      // 將檔案路徑轉換為跨平台相容的 URL
      const userConfigURL = new URL(`file://${userConfigPath.split(path.sep).join('/')}`).href;
      const userConfig = await import(userConfigURL);
      return userConfig.default || userConfig;
    }
  } catch (error) {
    console.error(`${i18next.t('load_file_error')}: ${error}`);
  }
  return defaultConfig;
}

export function initHook(hookFilePath){
  // 檢查檔案是否存在
  if (fs.existsSync(hookFilePath)) {
    // 如果存在，則先刪除
    fs.unlinkSync(hookFilePath);
  }
}

export function createHookFile(hookFilePath, result) {
  // 產生 git hook 檔案
  fs.writeFileSync(hookFilePath, result);
  fs.chmodSync(hookFilePath, FILE_PERMISSION);
}