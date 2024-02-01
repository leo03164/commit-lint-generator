import fs from 'fs';
import path from 'path';
import i18next from 'i18next';
import { fileURLToPath } from 'url';

// 設置 __dirname
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// 加載 JSON 檔案的函數
const loadJsonFile = (filePath) => {
  const absolutePath = path.join(__dirname, filePath);
  const fileContents = fs.readFileSync(absolutePath, 'utf8');
  return JSON.parse(fileContents);
};

// 使用 __dirname 來解析 JSON 文件的路徑
const enTranslation = loadJsonFile('./lang/en_us.json');
const zhTranslation = loadJsonFile('./lang/zh_tw.json');

// 初始化 i18next
i18next.init({
  resources: {
    en_us: { translation: enTranslation },
    zh_tw: { translation: zhTranslation }
  },
  lng: 'en_us',
  fallbackLng: 'en_us',
  interpolation: {
    escapeValue: false
  }
});

export default i18next;
