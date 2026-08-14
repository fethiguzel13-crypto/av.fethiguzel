import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import {
  getGalaxyApp, inferAppFromPath, translate, pathFromAppUrl, tabsForApp, appHomeUrl
} from '../pure.mjs';

const root = join(import.meta.dirname, '../../..');
const apps = JSON.parse(readFileSync(join(root,'mobile/galaxy/catalog.json'),'utf8')).apps;
const dicts = {
  tr: JSON.parse(readFileSync(join(root,'locales/tr.json'),'utf8')),
  en: JSON.parse(readFileSync(join(root,'locales/en.json'),'utf8')),
  de: JSON.parse(readFileSync(join(root,'locales/de.json'),'utf8')),
  fr: JSON.parse(readFileSync(join(root,'locales/fr.json'),'utf8')),
  ar: JSON.parse(readFileSync(join(root,'locales/ar.json'),'utf8')),
};
console.log('getGalaxyApp(hesap)=', getGalaxyApp(apps,'hesap').packageId);
console.log('infer(/bilgi)=', inferAppFromPath('/bilgi'));
console.log('t(en,common.offline)=', translate(dicts,'en','common.offline'));
console.log('t(tr,common.home)=', translate(dicts,'tr','common.home'));
console.log('pathFromAppUrl(hesap)=', pathFromAppUrl('avfethiguzel://hesap', apps));
console.log('tabs(hesap)=', tabsForApp(apps,'hesap').join(','));
console.log('home(icthat,en)=', appHomeUrl(getGalaxyApp(apps,'icthat'),'en'));
console.log('SMOKE_OK');
