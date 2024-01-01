export type tag = {
  key: string;
  value: { en: string; cz: string };
};

//export const tagList: tag[] = [
//  { key: 'book', value: { en: 'book', cz: 'kniha' } },
//  {
//    key: 'music_instrument',
//    value: { en: 'music instrument', cz: 'hudební nástroj' },
//  },
//  { key: 'camping', value: { en: 'camping', cz: 'stanování' } },
//  { key: 'games', value: { en: 'games', cz: 'hry' } },
//  { key: 'tools', value: { en: 'tools', cz: 'nářadí' } },
//  { key: 'electronics', value: { en: 'electronics', cz: 'elektronika' } },
//];

export const tagList: string[] = [
  'book',
  'music instrument',
  'camping',
  'games',
  'tools',
  'electronics',
];
