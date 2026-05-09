// ═══════ INIT GUARD ═══════
function initCharts() {
  if (typeof Chart === 'undefined') {
    console.error('Chart.js failed to load. Retrying in 500ms...');
    setTimeout(initCharts, 500);
    return;
  }
  try {

// ═══════ THEME SYSTEM ═══════
const THEME_KEY = 'sam-etf-theme';
function getTheme() { return localStorage.getItem(THEME_KEY) || 'dark'; }
function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem(THEME_KEY, theme);
  document.querySelectorAll('#themeToggle button').forEach(b => {
    b.classList.toggle('active', b.dataset.theme === theme);
  });
  if (window._charts) {
    const colors = getThemeColors();
    Chart.defaults.color = colors.textMuted;
    window._charts.forEach(c => {
      if (c.options.scales) {
        Object.values(c.options.scales).forEach(s => {
          if (s.ticks) s.ticks.color = colors.text2;
          if (s.grid) s.grid.color = colors.grid;
          if (s.title) s.title.color = colors.textMuted;
        });
      }
      c.data.datasets.forEach(ds => {
        if (ds.borderColor === '#11151f' || ds.borderColor === '#ffffff') ds.borderColor = colors.surface;
      });
      c.update('none');
    });
  }
}
function getThemeColors() {
  const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
  return isDark
    ? { textMuted:'#6b7894', text2:'#a1adc7', grid:'rgba(31,41,64,0.5)', surface:'#11151f', tooltipBg:'rgba(7,9,15,0.95)', tooltipBody:'#a1adc7' }
    : { textMuted:'#64748b', text2:'#475569', grid:'rgba(203,213,225,0.5)', surface:'#ffffff', tooltipBg:'rgba(15,23,42,0.95)', tooltipBody:'#cbd5e1' };
}
window._charts = [];
applyTheme(getTheme());
document.querySelectorAll('#themeToggle button').forEach(btn => {
  btn.addEventListener('click', () => applyTheme(btn.dataset.theme));
});

// ═══════ DATA (단위: 백만원 amt, 명 cnt) ═══════
const PRODUCTS = [
  { key:'p0', name:'KODEX 반도체',          aum:147554, cnt:11222, color:'#5b8def' },
  { key:'p1', name:'KODEX 레버리지',        aum:75127,  cnt:1117,  color:'#38bdf8' },
  { key:'p2', name:'KODEX AI반도체 → TOP2+', aum:41885,  cnt:6907,  color:'#14b8a6' },
  { key:'p3', name:'TIGER 반도체',          aum:6455,   cnt:489,   color:'#fbbf24' },
  { key:'p4', name:'TIGER TOP10',          aum:267628, cnt:40428, color:'#fb923c' },
  { key:'p5', name:'TIGER TOP10 레버리지',  aum:47573,  cnt:1172,  color:'#f43f5e' },
];
const TOTAL_AUM = 586222;
const TOTAL_CNT = 61335;

const REGIONS = [
  { name:"서울", amt:241152, cnt:16485 }, { name:"경기", amt:200271, cnt:21065 },
  { name:"경남", amt:18281, cnt:3088 }, { name:"대구", amt:15573, cnt:1985 },
  { name:"대전", amt:12922, cnt:1818 }, { name:"인천", amt:11841, cnt:2523 },
  { name:"충북", amt:11802, cnt:1400 }, { name:"부산", amt:11001, cnt:1952 },
  { name:"충남", amt:10898, cnt:1702 }, { name:"광주", amt:10796, cnt:1833 },
  { name:"경북", amt:8802, cnt:1547 }, { name:"세종", amt:8236, cnt:1103 },
  { name:"전북", amt:7344, cnt:1317 }, { name:"강원", amt:5583, cnt:1027 },
  { name:"전남", amt:4778, cnt:928 }, { name:"울산", amt:3663, cnt:807 },
  { name:"제주", amt:3278, cnt:755 },
];

const REGION_BY_PROD = {
  "서울":[66547,42791,15852,1356,91249,23357],"경기":[49958,23983,16192,4718,87264,18156],
  "경남":[4913,538,1336,31,10545,918],"대구":[1729,3612,629,107,8470,1025],
  "대전":[4117,292,799,0,7460,254],"인천":[3127,171,657,0,7725,161],
  "충북":[3691,2424,717,150,4821,0],"부산":[2157,0,200,0,8644,0],
  "충남":[1840,661,788,0,6423,1186],"광주":[2448,0,1028,0,7320,0],
  "경북":[1867,0,664,0,6271,0],"세종":[1345,363,698,93,4836,901],
  "전북":[1047,292,510,0,4201,1294],"강원":[1316,0,700,0,3567,0],
  "전남":[320,0,301,0,4157,0],"울산":[451,0,331,0,2882,0],
  "제주":[680,0,484,0,1793,321],
};

const CITIES = [
  {nm:"강남구",rg:"서울",amt:64519,cnt:1643,prods:[15102,26044,4048,684,12572,6069]},
  {nm:"성남시",rg:"경기",amt:36989,cnt:2285,prods:[7372,7421,2761,856,12980,5599]},
  {nm:"서초구",rg:"서울",amt:35275,cnt:1195,prods:[8863,1352,1325,301,12760,10674]},
  {nm:"수원시",rg:"경기",amt:30122,cnt:2943,prods:[8033,3298,3171,824,12480,2316]},
  {nm:"용인시",rg:"경기",amt:29067,cnt:2720,prods:[8384,3025,2990,528,10459,3681]},
  {nm:"화성시",rg:"경기",amt:24578,cnt:2346,prods:[6473,2750,1521,1375,9786,2673]},
  {nm:"송파구",rg:"서울",amt:23976,cnt:1700,prods:[5445,4474,1398,277,9163,3219]},
  {nm:"고양시",rg:"경기",amt:20710,cnt:1818,prods:[5888,5931,1075,1135,4950,1732]},
  {nm:"용산구",rg:"서울",amt:15130,cnt:424,prods:[4187,0,581,0,10362,0]},
  {nm:"강서구",rg:"서울",amt:13396,cnt:987,prods:[4360,3785,881,0,3484,886]},
  {nm:"마포구",rg:"서울",amt:11344,cnt:858,prods:[4425,1873,1114,18,3765,150]},
  {nm:"청주시",rg:"충북",amt:11214,cnt:1257,prods:[3691,2424,717,150,4233,0]},
  {nm:"양천구",rg:"서울",amt:11212,cnt:834,prods:[2969,2473,1586,0,3821,362]},
  {nm:"영등포구",rg:"서울",amt:10455,cnt:837,prods:[2655,2155,777,37,4050,780]},
  {nm:"창원시",rg:"경남",amt:9605,cnt:1470,prods:[2361,439,838,31,5019,918]},
  {nm:"수성구",rg:"대구",amt:9194,cnt:691,prods:[1443,3450,269,107,2900,1025]},
  {nm:"안양시",rg:"경기",amt:8516,cnt:1063,prods:[1630,578,922,0,4245,1140]},
  {nm:"강동구",rg:"서울",amt:7404,cnt:922,prods:[1797,0,719,0,3779,1109]},
  {nm:"천안시",rg:"충남",amt:7044,cnt:952,prods:[1003,661,568,0,3625,1186]},
  {nm:"부천시",rg:"경기",amt:6987,cnt:840,prods:[2051,282,752,0,3282,621]},
  {nm:"은평구",rg:"서울",amt:6344,cnt:654,prods:[2415,636,453,0,2840,0]},
  {nm:"전주시",rg:"전북",amt:6305,cnt:1016,prods:[1003,292,498,0,3217,1294]},
  {nm:"서구(대전)",rg:"대전",amt:6159,cnt:717,prods:[1798,182,451,0,3474,254]},
  {nm:"남양주시",rg:"경기",amt:5936,cnt:916,prods:[1441,388,770,0,3070,266]},
  {nm:"하남시",rg:"경기",amt:5619,cnt:466,prods:[1790,0,237,0,3592,0]},
  {nm:"유성구",rg:"대전",amt:5103,cnt:747,prods:[1819,109,329,0,2846,0]},
  {nm:"성북구",rg:"서울",amt:4855,cnt:570,prods:[1728,0,82,0,3045,0]},
  {nm:"서대문구",rg:"서울",amt:4653,cnt:554,prods:[1531,0,343,0,2779,0]},
  {nm:"해운대구",rg:"부산",amt:4046,cnt:417,prods:[986,0,117,0,2942,0]},
  {nm:"성동구",rg:"서울",amt:4005,cnt:477,prods:[1196,0,385,0,2423,0]},
  {nm:"파주시",rg:"경기",amt:4000,cnt:598,prods:[951,0,294,0,2756,0]},
  {nm:"동작구",rg:"서울",amt:3980,cnt:629,prods:[1301,0,199,0,2480,0]},
  {nm:"김포시",rg:"경기",amt:3965,cnt:636,prods:[1631,310,374,0,1523,128]},
  {nm:"광진구",rg:"서울",amt:3891,cnt:585,prods:[1762,0,488,0,1642,0]},
  {nm:"노원구",rg:"서울",amt:3802,cnt:739,prods:[1187,0,289,0,2220,107]},
  {nm:"서구(인천)",rg:"인천",amt:3473,cnt:589,prods:[910,171,125,0,2267,0]},
  {nm:"포항시",rg:"경북",amt:3446,cnt:552,prods:[1144,0,331,0,1971,0]},
  {nm:"관악구",rg:"서울",amt:3427,cnt:651,prods:[1263,0,306,39,1819,0]},
  {nm:"진주시",rg:"경남",amt:3336,cnt:540,prods:[1611,0,184,0,1540,0]},
  {nm:"구로구",rg:"서울",amt:3228,cnt:465,prods:[1027,0,379,0,1822,0]},
  {nm:"북구(광주)",rg:"광주",amt:3161,cnt:589,prods:[941,0,457,0,1763,0]},
  {nm:"구미시",rg:"경북",amt:3138,cnt:487,prods:[658,0,315,0,2165,0]},
  {nm:"동대문구",rg:"서울",amt:3109,cnt:473,prods:[840,0,254,0,2015,0]},
  {nm:"김해시",rg:"경남",amt:2944,cnt:598,prods:[442,99,252,0,2152,0]},
  {nm:"제주시",rg:"제주",amt:2930,cnt:657,prods:[618,0,484,0,1507,321]},
  {nm:"연수구",rg:"인천",amt:2756,cnt:489,prods:[874,0,148,0,1572,161]},
  {nm:"광명시",rg:"경기",amt:2676,cnt:406,prods:[1129,0,323,0,1225,0]},
  {nm:"원주시",rg:"강원",amt:2583,cnt:440,prods:[563,0,409,0,1611,0]},
  {nm:"남구(광주)",rg:"광주",amt:2530,cnt:266,prods:[633,0,0,0,1897,0]},
  {nm:"안산시",rg:"경기",amt:2503,cnt:557,prods:[832,0,255,0,1417,0]},
  {nm:"평택시",rg:"경기",amt:2451,cnt:490,prods:[499,0,237,0,1715,0]},
  {nm:"달서구",rg:"대구",amt:2409,cnt:493,prods:[145,162,267,0,1835,0]},
  {nm:"광산구",rg:"광주",amt:2354,cnt:521,prods:[387,0,481,0,1487,0]},
  {nm:"춘천시",rg:"강원",amt:2341,cnt:409,prods:[702,0,291,0,1349,0]},
  {nm:"종로구",rg:"서울",amt:2291,cnt:187,prods:[1421,0,0,0,870,0]},
  {nm:"아산시",rg:"충남",amt:2284,cnt:409,prods:[800,0,191,0,1293,0]},
  {nm:"부평구",rg:"인천",amt:2143,cnt:444,prods:[778,0,187,0,1177,0]},
  {nm:"서구(광주)",rg:"광주",amt:2071,cnt:355,prods:[378,0,90,0,1603,0]},
  {nm:"군포시",rg:"경기",amt:2017,cnt:344,prods:[342,0,130,0,1545,0]},
  {nm:"남구(울산)",rg:"울산",amt:1961,cnt:342,prods:[295,0,257,0,1409,0]},
  {nm:"여수시",rg:"전남",amt:1876,cnt:267,prods:[112,0,187,0,1577,0]},
  {nm:"이천시",rg:"경기",amt:1775,cnt:227,prods:[221,0,0,0,1554,0]},
  {nm:"시흥시",rg:"경기",amt:1708,cnt:436,prods:[477,0,42,0,1188,0]},
  {nm:"의정부시",rg:"경기",amt:1705,cnt:455,prods:[195,0,180,0,1329,0]},
  {nm:"양산시",rg:"경남",amt:1596,cnt:282,prods:[372,0,63,0,1161,0]},
  {nm:"중랑구",rg:"서울",amt:1576,cnt:327,prods:[325,0,36,0,1215,0]},
  {nm:"도봉구",rg:"서울",amt:1560,cnt:299,prods:[465,0,134,0,960,0]},
  {nm:"광주시",rg:"경기",amt:1559,cnt:287,prods:[210,0,57,0,1292,0]},
  {nm:"북구(대구)",rg:"대구",amt:1551,cnt:349,prods:[116,0,83,0,1352,0]},
  {nm:"순천시",rg:"전남",amt:1488,cnt:343,prods:[208,0,87,0,1193,0]},
  {nm:"남동구",rg:"인천",amt:1478,cnt:442,prods:[378,0,197,0,903,0]},
  {nm:"과천시",rg:"경기",amt:1382,cnt:155,prods:[0,0,0,0,1382,0]},
  {nm:"북구(부산)",rg:"부산",amt:1275,cnt:218,prods:[528,0,32,0,715,0]},
  {nm:"구리시",rg:"경기",amt:1256,cnt:239,prods:[217,0,11,0,1027,0]},
  {nm:"의왕시",rg:"경기",amt:1245,cnt:197,prods:[158,0,36,0,1051,0]},
  {nm:"양평군",rg:"경기",amt:1189,cnt:78,prods:[34,0,0,0,1155,0]},
  {nm:"동래구",rg:"부산",amt:1172,cnt:219,prods:[338,0,0,0,834,0]},
  {nm:"부산진구",rg:"부산",amt:1067,cnt:251,prods:[44,0,0,0,1023,0]},
];

const REGION_COLORS = {
  "서울":"#5b8def","경기":"#38bdf8","인천":"#14b8a6","부산":"#fbbf24","대전":"#fb923c",
  "경남":"#f43f5e","대구":"#8b5cf6","광주":"#ec4899","충남":"#84cc16","충북":"#a78bfa",
  "전북":"#f472b6","경북":"#34d399","울산":"#fcd34d","전남":"#67e8f9","강원":"#fda4af","제주":"#94a3b8","세종":"#cbd5e1"
};

const AGE_ORDER = ['20대','30대','40대','50대','60대이상'];
const AGE_SEX = {
  "20대": {"남":{amt:6470,cnt:1412},"여":{amt:7950,cnt:4300}},
  "30대": {"남":{amt:41039,cnt:4596},"여":{amt:22973,cnt:8267}},
  "40대": {"남":{amt:104734,cnt:6595},"여":{amt:50803,cnt:9206}},
  "50대": {"남":{amt:136696,cnt:7459},"여":{amt:71021,cnt:10873}},
  "60대이상": {"남":{amt:96783,cnt:3775},"여":{amt:42160,cnt:3717}},
};

const PROD_AGE_SEX = {
  "p0":{"20대":{"남":{amt:1906,cnt:121},"여":{amt:2167,cnt:578}},"30대":{"남":{amt:9547,cnt:962},"여":{amt:6032,cnt:1451}},"40대":{"남":{amt:23937,cnt:1356},"여":{amt:11838,cnt:1678}},"50대":{"남":{amt:33494,cnt:1519},"여":{amt:19866,cnt:1967}},"60대이상":{"남":{amt:25586,cnt:747},"여":{amt:12517,cnt:707}}},
  "p1":{"20대":{"남":{amt:0,cnt:0},"여":{amt:0,cnt:0}},"30대":{"남":{amt:5611,cnt:110},"여":{amt:578,cnt:12}},"40대":{"남":{amt:18676,cnt:241},"여":{amt:4970,cnt:124}},"50대":{"남":{amt:17485,cnt:262},"여":{amt:4495,cnt:214}},"60대이상":{"남":{amt:17192,cnt:107},"여":{amt:6121,cnt:47}}},
  "p2":{"20대":{"남":{amt:162,cnt:52},"여":{amt:750,cnt:317}},"30대":{"남":{amt:1853,cnt:364},"여":{amt:1870,cnt:876}},"40대":{"남":{amt:5084,cnt:701},"여":{amt:4312,cnt:1147}},"50대":{"남":{amt:10026,cnt:1036},"여":{amt:6737,cnt:1493}},"60대이상":{"남":{amt:8393,cnt:475},"여":{amt:2576,cnt:380}}},
  "p3":{"20대":{"남":{amt:0,cnt:0},"여":{amt:0,cnt:0}},"30대":{"남":{amt:509,cnt:42},"여":{amt:334,cnt:102}},"40대":{"남":{amt:1498,cnt:84},"여":{amt:270,cnt:71}},"50대":{"남":{amt:1641,cnt:92},"여":{amt:2202,cnt:98}},"60대이상":{"남":{amt:0,cnt:0},"여":{amt:0,cnt:0}}},
  "p4":{"20대":{"남":{amt:4402,cnt:1239},"여":{amt:5033,cnt:3405}},"30대":{"남":{amt:18974,cnt:3023},"여":{amt:13962,cnt:5801}},"40대":{"남":{amt:44811,cnt:3923},"여":{amt:27612,cnt:6040}},"50대":{"남":{amt:54773,cnt:4218},"여":{amt:34908,cnt:6952}},"60대이상":{"남":{amt:38760,cnt:2346},"여":{amt:19586,cnt:2548}}},
  "p5":{"20대":{"남":{amt:0,cnt:0},"여":{amt:0,cnt:0}},"30대":{"남":{amt:4544,cnt:95},"여":{amt:197,cnt:25}},"40대":{"남":{amt:10728,cnt:290},"여":{amt:1802,cnt:146}},"50대":{"남":{amt:19278,cnt:332},"여":{amt:2812,cnt:149}},"60대이상":{"남":{amt:6851,cnt:100},"여":{amt:1360,cnt:35}}},
};

const SIDO_AGE_SEX = {
  "서울":{"20대":{"남":{amt:2130,cnt:352},"여":{amt:2874,cnt:1379}},"30대":{"남":{amt:17927,cnt:1365},"여":{amt:8758,cnt:2653}},"40대":{"남":{amt:41195,cnt:1692},"여":{amt:18725,cnt:2373}},"50대":{"남":{amt:52912,cnt:1909},"여":{amt:20036,cnt:2282}},"60대이상":{"남":{amt:49487,cnt:1117},"여":{amt:23399,cnt:1096}}},
  "경기":{"20대":{"남":{amt:1898,cnt:564},"여":{amt:3191,cnt:1360}},"30대":{"남":{amt:15221,cnt:1708},"여":{amt:8169,cnt:2486}},"40대":{"남":{amt:40622,cnt:2524},"여":{amt:17424,cnt:2977}},"50대":{"남":{amt:47262,cnt:2740},"여":{amt:24446,cnt:3504}},"60대이상":{"남":{amt:29991,cnt:1356},"여":{amt:10648,cnt:1273}}},
  "경남":{"20대":{"남":{amt:200,cnt:70},"여":{amt:185,cnt:190}},"30대":{"남":{amt:793,cnt:193},"여":{amt:579,cnt:354}},"40대":{"남":{amt:3089,cnt:311},"여":{amt:1557,cnt:512}},"50대":{"남":{amt:4422,cnt:340},"여":{amt:3176,cnt:670}},"60대이상":{"남":{amt:2579,cnt:146},"여":{amt:1520,cnt:198}}},
  "대구":{"20대":{"남":{amt:153,cnt:47},"여":{amt:111,cnt:124}},"30대":{"남":{amt:594,cnt:115},"여":{amt:386,cnt:218}},"40대":{"남":{amt:1052,cnt:129},"여":{amt:1563,cnt:348}},"50대":{"남":{amt:6220,cnt:272},"여":{amt:3348,cnt:489}},"60대이상":{"남":{amt:1422,cnt:114},"여":{amt:655,cnt:118}}},
  "대전":{"20대":{"남":{amt:183,cnt:50},"여":{amt:200,cnt:137}},"30대":{"남":{amt:617,cnt:113},"여":{amt:459,cnt:200}},"40대":{"남":{amt:1111,cnt:175},"여":{amt:1374,cnt:271}},"50대":{"남":{amt:2581,cnt:252},"여":{amt:2807,cnt:379}},"60대이상":{"남":{amt:2408,cnt:120},"여":{amt:1164,cnt:106}}},
  "인천":{"20대":{"남":{amt:132,cnt:49},"여":{amt:294,cnt:233}},"30대":{"남":{amt:842,cnt:185},"여":{amt:934,cnt:510}},"40대":{"남":{amt:2884,cnt:260},"여":{amt:1056,cnt:368}},"50대":{"남":{amt:2704,cnt:261},"여":{amt:1820,cnt:448}},"60대이상":{"남":{amt:622,cnt:89},"여":{amt:553,cnt:120}}},
  "충북":{"20대":{"남":{amt:1145,cnt:42},"여":{amt:116,cnt:88}},"30대":{"남":{amt:664,cnt:131},"여":{amt:420,cnt:179}},"40대":{"남":{amt:2185,cnt:176},"여":{amt:622,cnt:185}},"50대":{"남":{amt:2229,cnt:151},"여":{amt:1548,cnt:253}},"60대이상":{"남":{amt:2048,cnt:79},"여":{amt:780,cnt:86}}},
  "부산":{"20대":{"남":{amt:33,cnt:21},"여":{amt:110,cnt:88}},"30대":{"남":{amt:663,cnt:94},"여":{amt:461,cnt:347}},"40대":{"남":{amt:1598,cnt:159},"여":{amt:958,cnt:344}},"50대":{"남":{amt:3222,cnt:214},"여":{amt:2245,cnt:445}},"60대이상":{"남":{amt:1093,cnt:125},"여":{amt:617,cnt:115}}},
  "충남":{"20대":{"남":{amt:73,cnt:35},"여":{amt:136,cnt:104}},"30대":{"남":{amt:971,cnt:145},"여":{amt:537,cnt:188}},"40대":{"남":{amt:3299,cnt:250},"여":{amt:911,cnt:269}},"50대":{"남":{amt:2756,cnt:211},"여":{amt:1461,cnt:339}},"60대이상":{"남":{amt:398,cnt:72},"여":{amt:350,cnt:76}}},
  "광주":{"20대":{"남":{amt:153,cnt:42},"여":{amt:217,cnt:150}},"30대":{"남":{amt:230,cnt:72},"여":{amt:567,cnt:220}},"40대":{"남":{amt:1151,cnt:158},"여":{amt:1811,cnt:288}},"50대":{"남":{amt:1913,cnt:211},"여":{amt:2168,cnt:408}},"60대이상":{"남":{amt:2025,cnt:134},"여":{amt:550,cnt:140}}},
  "경북":{"20대":{"남":{amt:120,cnt:42},"여":{amt:55,cnt:82}},"30대":{"남":{amt:460,cnt:85},"여":{amt:338,cnt:199}},"40대":{"남":{amt:1276,cnt:141},"여":{amt:850,cnt:221}},"50대":{"남":{amt:2137,cnt:179},"여":{amt:2042,cnt:419}},"60대이상":{"남":{amt:1096,cnt:91},"여":{amt:411,cnt:75}}},
  "세종":{"20대":{"남":{amt:60,cnt:26},"여":{amt:41,cnt:50}},"30대":{"남":{amt:831,cnt:101},"여":{amt:163,cnt:102}},"40대":{"남":{amt:1501,cnt:144},"여":{amt:871,cnt:206}},"50대":{"남":{amt:2241,cnt:158},"여":{amt:762,cnt:152}},"60대이상":{"남":{amt:1366,cnt:61},"여":{amt:308,cnt:48}}},
  "전북":{"20대":{"남":{amt:45,cnt:21},"여":{amt:203,cnt:133}},"30대":{"남":{amt:269,cnt:50},"여":{amt:290,cnt:163}},"40대":{"남":{amt:1186,cnt:114},"여":{amt:755,cnt:239}},"50대":{"남":{amt:2275,cnt:141},"여":{amt:1348,cnt:276}},"60대이상":{"남":{amt:549,cnt:80},"여":{amt:412,cnt:77}}},
  "강원":{"20대":{"남":{amt:44,cnt:11},"여":{amt:74,cnt:53}},"30대":{"남":{amt:229,cnt:70},"여":{amt:225,cnt:117}},"40대":{"남":{amt:666,cnt:76},"여":{amt:604,cnt:118}},"50대":{"남":{amt:1152,cnt:148},"여":{amt:1303,cnt:221}},"60대이상":{"남":{amt:893,cnt:102},"여":{amt:387,cnt:100}}},
  "전남":{"20대":{"남":{amt:22,cnt:14},"여":{amt:63,cnt:60}},"30대":{"남":{amt:346,cnt:60},"여":{amt:274,cnt:114}},"40대":{"남":{amt:784,cnt:110},"여":{amt:751,cnt:183}},"50대":{"남":{amt:945,cnt:87},"여":{amt:917,cnt:216}},"60대이상":{"남":{amt:529,cnt:45},"여":{amt:123,cnt:29}}},
  "울산":{"20대":{"남":{amt:17,cnt:10},"여":{amt:58,cnt:41}},"30대":{"남":{amt:222,cnt:51},"여":{amt:245,cnt:111}},"40대":{"남":{amt:593,cnt:92},"여":{amt:524,cnt:177}},"50대":{"남":{amt:917,cnt:89},"여":{amt:873,cnt:192}},"60대이상":{"남":{amt:102,cnt:19},"여":{amt:110,cnt:25}}},
  "제주":{"20대":{"남":{amt:62,cnt:16},"여":{amt:21,cnt:28}},"30대":{"남":{amt:162,cnt:58},"여":{amt:169,cnt:106}},"40대":{"남":{amt:542,cnt:84},"여":{amt:447,cnt:127}},"50대":{"남":{amt:806,cnt:96},"여":{amt:722,cnt:180}},"60대이상":{"남":{amt:176,cnt:25},"여":{amt:171,cnt:35}}},
};

// ═══════ CHART DEFAULTS ═══════
const _initColors = getThemeColors();
Chart.defaults.color = _initColors.textMuted;
Chart.defaults.font.family = "'IBM Plex Sans KR', sans-serif";
Chart.defaults.font.size = 11;
function buildTooltipBase() {
  const c = getThemeColors();
  return { backgroundColor:c.tooltipBg, borderColor:'#2c3a5a', borderWidth:1, padding:12, titleColor:'#fff', titleFont:{size:12,weight:'600'}, bodyColor:c.tooltipBody, bodyFont:{size:11,family:"'JetBrains Mono', monospace"}, cornerRadius:6, displayColors:true, boxPadding:4 };
}
const tooltipBase = buildTooltipBase();
const gridLight = { color:_initColors.grid, drawBorder:false };
const gridNone = { display:false };

// ═══════ § 1. DONUT + TABLE ═══════
const _donut = new Chart(document.getElementById('donut'), {
  type:'doughnut',
  data:{ labels:PRODUCTS.map(p=>p.name), datasets:[{ data:PRODUCTS.map(p=>p.aum), backgroundColor:PRODUCTS.map(p=>p.color), borderColor:_initColors.surface, borderWidth:3, hoverOffset:8 }] },
  options:{ responsive:true, maintainAspectRatio:false, cutout:'62%',
    plugins:{ legend:{ position:'bottom', labels:{ padding:14, boxWidth:10, boxHeight:10, font:{size:11} } },
      tooltip:{...tooltipBase, callbacks:{ label:ctx=>{const v=ctx.parsed; return `  ${v.toLocaleString()} M  ·  ${(v/TOTAL_AUM*100).toFixed(1)}%`;}}}}}
});
window._charts.push(_donut);

const prodSorted = [...PRODUCTS].sort((a,b)=>b.aum-a.aum);
document.getElementById('prodTable').innerHTML = prodSorted.map((p,i)=>{
  const perCap = Math.round(p.aum/p.cnt*100);
  return `<tr><td class="rank">${String(i+1).padStart(2,'0')}</td><td><span class="tag" style="background:${p.color}22;color:${p.color}">${p.name}</span></td><td class="num">${(p.aum/1000).toFixed(1)}</td><td class="num">${p.cnt.toLocaleString()}</td><td class="num">${perCap.toLocaleString()}</td></tr>`;
}).join('');

// ═══════ § 2. REGIONS ═══════
const regSorted = [...REGIONS].sort((a,b)=>b.amt-a.amt);
const _regionAmt = new Chart(document.getElementById('regionAmt'), {
  type:'bar',
  data:{ labels:regSorted.map(r=>r.name), datasets:[{ label:'AUM', data:regSorted.map(r=>r.amt), backgroundColor:regSorted.map((r,i)=>`rgba(91,141,239,${Math.max(1-i*0.04,0.25)})`), borderRadius:4 }] },
  options:{ indexAxis:'y', responsive:true, maintainAspectRatio:false,
    plugins:{ legend:{display:false},
      tooltip:{...tooltipBase, callbacks:{ label:ctx=>{const r=regSorted[ctx.dataIndex]; return [`  AUM: ${r.amt.toLocaleString()} M`, `  점유율: ${(r.amt/TOTAL_AUM*100).toFixed(2)}%`, `  인원: ${r.cnt.toLocaleString()}명`];}}}},
    scales:{ x:{grid:gridLight, ticks:{callback:v=>(v/1000).toFixed(0)+'B'}}, y:{grid:gridNone, ticks:{color:'#a1adc7',font:{size:11}}} }}
});

const NAT_PER_CAP_MAN = Math.round(TOTAL_AUM/TOTAL_CNT*100);
const regPerCap = REGIONS.map(r=>({...r, perCap:Math.round(r.amt/r.cnt*100)})).sort((a,b)=>b.perCap-a.perCap);
const _regionPerCap = new Chart(document.getElementById('regionPerCap'), {
  type:'bar',
  data:{ labels:regPerCap.map(r=>r.name), datasets:[{ data:regPerCap.map(r=>r.perCap), backgroundColor:regPerCap.map(r=>r.perCap>NAT_PER_CAP_MAN?'#fbbf24':'rgba(91,141,239,0.55)'), borderRadius:4 }] },
  options:{ indexAxis:'y', responsive:true, maintainAspectRatio:false,
    plugins:{ legend:{display:false},
      tooltip:{...tooltipBase, callbacks:{ label:ctx=>`  1인 평균: ${ctx.parsed.x.toLocaleString()}만원`}}},
    scales:{ x:{grid:gridLight, ticks:{callback:v=>v.toLocaleString()}}, y:{grid:gridNone, ticks:{color:'#a1adc7',font:{size:11}}} }}
});

// ═══════ § 3. HEATMAP ═══════
const heatRegions = Object.keys(REGION_BY_PROD).sort((a,b)=>{
  const ra = REGIONS.find(r=>r.name===a), rb = REGIONS.find(r=>r.name===b);
  return (rb?rb.amt:0)-(ra?ra.amt:0);
});
const prodMax = PRODUCTS.map((_,pi)=>Math.max(...heatRegions.map(rn=>REGION_BY_PROD[rn][pi])));
let heatHTML = '<div class="heatmap"><div class="heat-h"></div>';
PRODUCTS.forEach(p=>{ heatHTML += `<div class="heat-h">${p.name}</div>`; });
heatRegions.forEach(rn=>{
  heatHTML += `<div class="heat-h row">${rn}</div>`;
  PRODUCTS.forEach((p,pi)=>{
    const v = REGION_BY_PROD[rn][pi];
    const ratio = prodMax[pi]>0 ? v/prodMax[pi] : 0;
    let bg, color;
    if (v===0) { bg='var(--surface3)'; color='var(--text-dim)'; }
    else { bg = p.color + Math.round(ratio*200+30).toString(16).padStart(2,'0'); color = ratio>0.5?'#fff':'#ffffffcc'; }
    const display = v>=1000 ? (v/1000).toFixed(0)+'k' : v;
    heatHTML += `<div class="heat-cell" style="background:${bg};color:${color}" title="${rn} · ${p.name}: ${v.toLocaleString()}M">${v===0?'—':display}</div>`;
  });
});
heatHTML += '</div>';
document.getElementById('heatmap').innerHTML = heatHTML;

// ═══════ § 4. CITY STACK ═══════
let cityStackChart = null;
function renderCityStack(n){
  if (cityStackChart) {
    const idx = window._charts.indexOf(cityStackChart);
    if (idx >= 0) window._charts.splice(idx, 1);
    cityStackChart.destroy();
  }
  const sorted = [...CITIES].sort((a,b)=>b.amt-a.amt).slice(0,n);
  const datasets = PRODUCTS.map((p,pi)=>({ label:p.name, data:sorted.map(c=>c.prods[pi]), backgroundColor:p.color, borderRadius:2 }));
  cityStackChart = new Chart(document.getElementById('cityStack'), {
    type:'bar',
    data:{ labels:sorted.map(c=>`${c.nm} (${c.rg})`), datasets },
    options:{ responsive:true, maintainAspectRatio:false,
      plugins:{ legend:{position:'bottom', labels:{boxWidth:10, padding:12, font:{size:10}}},
        tooltip:{...tooltipBase, callbacks:{ label:ctx=>`  ${ctx.dataset.label}: ${ctx.parsed.y.toLocaleString()} M`}}},
      scales:{ x:{stacked:true, grid:gridNone, ticks:{color:'#a1adc7',font:{size:10}, maxRotation:45}},
        y:{stacked:true, grid:gridLight, ticks:{callback:v=>(v/1000).toFixed(0)+'B'}} }}
  });
  window._charts.push(cityStackChart);
}
renderCityStack(10);
document.querySelectorAll('#topNFilter .pill').forEach(pill=>{
  pill.addEventListener('click', ()=>{
    document.querySelectorAll('#topNFilter .pill').forEach(p=>p.classList.remove('active'));
    pill.classList.add('active');
    const n = parseInt(pill.dataset.n);
    document.getElementById('topNLabel').textContent = `TOP ${n}`;
    renderCityStack(n);
  });
});

// ═══════ § 5. SCATTER ═══════
const regionGroups = [...new Set(CITIES.map(c=>c.rg))];
const scatterDS = regionGroups.map(rg=>({
  label:rg,
  data:CITIES.filter(c=>c.rg===rg).map(c=>({ x:c.cnt, y:c.amt, r:Math.max(4,Math.min(20,Math.round(c.amt/c.cnt/20))), nm:c.nm })),
  backgroundColor:(REGION_COLORS[rg]||'#64748b')+'b0',
  borderColor:REGION_COLORS[rg]||'#64748b', borderWidth:1
}));
const _scatter = new Chart(document.getElementById('scatter'), {
  type:'bubble', data:{datasets:scatterDS},
  options:{ responsive:true, maintainAspectRatio:false,
    plugins:{ legend:{display:false},
      tooltip:{...tooltipBase, callbacks:{ label:ctx=>{const d=ctx.raw; return [`  ${d.nm} (${ctx.dataset.label})`, `  인원: ${d.x.toLocaleString()}명`, `  AUM: ${d.y.toLocaleString()}M`, `  1인당: ${Math.round(d.y/d.x*100).toLocaleString()}만원`];}}}},
    scales:{ x:{grid:gridLight, title:{display:true, text:'보유 인원 수 (명)', color:'#6b7894'}, ticks:{callback:v=>v.toLocaleString()}},
      y:{grid:gridLight, title:{display:true, text:'AUM (백만원)', color:'#6b7894'}, ticks:{callback:v=>(v/1000).toFixed(0)+'B'}} }}
});
document.getElementById('scatterCount').textContent = `${CITIES.length} 개 시·구 PLOT`;
const scatterLeg = document.getElementById('scatterLegend');
regionGroups.forEach(rg=>{
  scatterLeg.innerHTML += `<span style="display:inline-flex;align-items:center;gap:6px;margin-right:10px;font-size:11px;color:var(--text-2)"><span style="width:8px;height:8px;border-radius:50%;background:${REGION_COLORS[rg]||'#64748b'}"></span>${rg}</span>`;
});

// ═══════ § 6. PER-CAPITA TOP/BOT ═══════
const perCapData = CITIES.filter(c=>c.cnt>=30).map(c=>({...c, perCap:Math.round(c.amt/c.cnt*100)}));
const top15 = [...perCapData].sort((a,b)=>b.perCap-a.perCap).slice(0,15);
const bot15 = [...perCapData].sort((a,b)=>a.perCap-b.perCap).slice(0,15);
const maxPC = top15[0].perCap;
document.getElementById('topPerCap').innerHTML = top15.map((d,i)=>`
  <tr><td class="rank">${String(i+1).padStart(2,'0')}</td><td>${d.nm}</td>
  <td><span class="tag" style="background:${(REGION_COLORS[d.rg]||'#64748b')}22;color:${REGION_COLORS[d.rg]||'#64748b'}">${d.rg}</span></td>
  <td class="num">${d.perCap.toLocaleString()}</td>
  <td class="bar-cell"><div class="bar-bg"><div class="bar-fill" style="width:${(d.perCap/maxPC*100).toFixed(0)}%;background:linear-gradient(90deg,#fbbf24,#fb923c)"></div></div></td></tr>`).join('');
document.getElementById('botPerCap').innerHTML = bot15.map((d,i)=>`
  <tr><td class="rank">${String(i+1).padStart(2,'0')}</td><td>${d.nm}</td>
  <td><span class="tag" style="background:${(REGION_COLORS[d.rg]||'#64748b')}22;color:${REGION_COLORS[d.rg]||'#64748b'}">${d.rg}</span></td>
  <td class="num">${d.perCap.toLocaleString()}</td>
  <td class="bar-cell"><div class="bar-bg"><div class="bar-fill" style="width:${(d.perCap/maxPC*100).toFixed(0)}%;background:linear-gradient(90deg,#f43f5e,#fb7185)"></div></div></td></tr>`).join('');

// ═══════ § 7. SEOUL & GG ═══════
const seoulCities = CITIES.filter(c=>c.rg==='서울').sort((a,b)=>b.amt-a.amt);
const _seoulBar = new Chart(document.getElementById('seoulBar'), {
  type:'bar',
  data:{ labels:seoulCities.map(c=>c.nm), datasets:PRODUCTS.map((p,pi)=>({label:p.name, data:seoulCities.map(c=>c.prods[pi]), backgroundColor:p.color, borderRadius:2})) },
  options:{ indexAxis:'y', responsive:true, maintainAspectRatio:false,
    plugins:{ legend:{position:'bottom', labels:{boxWidth:8, padding:8, font:{size:9}}},
      tooltip:{...tooltipBase, callbacks:{label:ctx=>`  ${ctx.dataset.label}: ${ctx.parsed.x.toLocaleString()} M`}}},
    scales:{ x:{stacked:true, grid:gridLight, ticks:{callback:v=>(v/1000).toFixed(0)+'B', font:{size:9}}},
      y:{stacked:true, grid:gridNone, ticks:{font:{size:10}, color:'#a1adc7'}} }}
});
const ggCities = CITIES.filter(c=>c.rg==='경기').sort((a,b)=>b.amt-a.amt).slice(0,15);
const _ggBar = new Chart(document.getElementById('ggBar'), {
  type:'bar',
  data:{ labels:ggCities.map(c=>c.nm), datasets:PRODUCTS.map((p,pi)=>({label:p.name, data:ggCities.map(c=>c.prods[pi]), backgroundColor:p.color, borderRadius:2})) },
  options:{ indexAxis:'y', responsive:true, maintainAspectRatio:false,
    plugins:{ legend:{position:'bottom', labels:{boxWidth:8, padding:8, font:{size:9}}},
      tooltip:{...tooltipBase, callbacks:{label:ctx=>`  ${ctx.dataset.label}: ${ctx.parsed.x.toLocaleString()} M`}}},
    scales:{ x:{stacked:true, grid:gridLight, ticks:{callback:v=>(v/1000).toFixed(0)+'B', font:{size:9}}},
      y:{stacked:true, grid:gridNone, ticks:{font:{size:10}, color:'#a1adc7'}} }}
});
window._charts.push(_regionAmt, _regionPerCap, _scatter, _seoulBar, _ggBar);

// ═══════ § 8. 분포 (시·구 1인당 분포) ═══════
const sgPerCap = CITIES.filter(c=>c.cnt>=20).map(c=>({pc:c.amt/c.cnt*100}));
const distBins = [
  { label:"~300만",     min:0, max:300, count:0 },
  { label:"300~500만",  min:300, max:500, count:0 },
  { label:"500~1,000만", min:500, max:1000, count:0 },
  { label:"1,000~2,000만", min:1000, max:2000, count:0 },
  { label:"2,000~3,000만", min:2000, max:3000, count:0 },
  { label:"3,000만+",    min:3000, max:99999, count:0 },
];
sgPerCap.forEach(c => {
  for (const b of distBins) {
    if (c.pc >= b.min && c.pc < b.max) { b.count++; break; }
  }
});
const distMax = Math.max(...distBins.map(b=>b.count));
const distTotal = distBins.reduce((s,b)=>s+b.count,0);
document.getElementById('histRow').innerHTML = distBins.map(b => {
  const h = (b.count/distMax*100).toFixed(0);
  const pct = (b.count/distTotal*100).toFixed(1);
  return `<div class="hist-bar-wrap"><div class="hist-bar" style="height:${h}%"><span class="val">${b.count}곳</span><span class="pct">${pct}%</span></div><div class="hist-label">${b.label}</div></div>`;
}).join('');

// ═══════ § 9. 산업 인접도 ═══════
const INDUSTRY_PROXIMITY = {
  "화성시":95,"수원시":90,"이천시":92,"평택시":88,"청주시":85,
  "용인시":75,"고양시":35,"성남시":55,"안양시":50,"부천시":45,
  "강남구":30,"서초구":28,"송파구":35,"영등포구":40,"마포구":35,
  "강서구":25,"양천구":25,"구로구":40,"관악구":18,"성동구":25,
  "동작구":25,"광진구":20,"강동구":25,"성북구":20,"서대문구":18,
  "은평구":15,"노원구":30,"용산구":20,"종로구":15,"동대문구":18,
  "중랑구":15,"도봉구":15,"강북구":15,
  "천안시":80,"아산시":75,"창원시":50,"김해시":40,"양산시":35,
  "구미시":78,"포항시":50,"경산시":35,"진주시":25,
  "전주시":30,"춘천시":35,"원주시":40,
  "남양주시":30,"파주시":50,"김포시":40,"안산시":40,"시흥시":40,
  "의정부시":20,"광명시":30,"과천시":25,"군포시":30,"하남시":25,
  "유성구":70,"수성구":35,
};
const industryData = CITIES
  .filter(c => INDUSTRY_PROXIMITY[c.nm] !== undefined && c.cnt >= 100)
  .map(c => {
    const kodexShare = c.amt > 0 ? (c.prods[0] / c.amt * 100) : 0;
    return { x: INDUSTRY_PROXIMITY[c.nm], y: kodexShare, r: Math.max(4, Math.min(18, Math.round(c.amt/200))), nm: c.nm, rg: c.rg, amt: c.amt };
  });
const _industryScatter = new Chart(document.getElementById('industryScatter'), {
  type:'bubble',
  data:{ datasets: [{
    label: '시·구', data: industryData,
    backgroundColor: industryData.map(d => { if (d.x >= 70) return 'rgba(244,63,94,0.7)'; if (d.x >= 40) return 'rgba(251,191,36,0.7)'; return 'rgba(91,141,239,0.6)'; }),
    borderColor: industryData.map(d => { if (d.x >= 70) return '#f43f5e'; if (d.x >= 40) return '#fbbf24'; return '#5b8def'; }),
    borderWidth: 1.5,
  }]},
  options:{ responsive:true, maintainAspectRatio:false,
    plugins:{ legend:{display:false},
      tooltip:{...buildTooltipBase(), callbacks:{ label:ctx=>{const d=ctx.raw; return [`  ${d.nm} (${d.rg})`, `  산업 인접도: ${d.x}`, `  KODEX 반도체 비중: ${d.y.toFixed(1)}%`, `  AUM: ${d.amt.toLocaleString()}M`];}}}},
    scales:{
      x:{ grid:gridLight, title:{display:true, text:'반도체 산업 인접도 (추정 0~100)', color:_initColors.textMuted}, min:0, max:100 },
      y:{ grid:gridLight, title:{display:true, text:'KODEX 반도체 비중 (%)', color:_initColors.textMuted}, min:0, max:50, ticks:{callback:v=>v+'%'} }
    }}
});
window._charts.push(_industryScatter);

// ═══════ § 10. 로렌츠 ═══════
const sortedAsc = [...CITIES].sort((a,b)=>a.amt-b.amt);
const totalAumAll = sortedAsc.reduce((s,c)=>s+c.amt, 0);
let cumulPop = 0, cumulAum = 0;
const lorenzPts = [{x:0, y:0}];
sortedAsc.forEach(c => {
  cumulPop += 1; cumulAum += c.amt;
  lorenzPts.push({ x: cumulPop / sortedAsc.length * 100, y: cumulAum / totalAumAll * 100 });
});
let giniSum = 0;
const arr = sortedAsc.map(c=>c.amt);
const meanA = arr.reduce((s,v)=>s+v,0)/arr.length;
for (let i=0;i<arr.length;i++) for (let j=0;j<arr.length;j++) giniSum += Math.abs(arr[i]-arr[j]);
const gini = giniSum / (2*arr.length*arr.length*meanA);
const top10pct = Math.ceil(sortedAsc.length*0.1);
const top10aum = sortedAsc.slice(-top10pct).reduce((s,c)=>s+c.amt,0);
const top10pctShare = (top10aum/totalAumAll*100).toFixed(1);

const equalityLine = [{x:0,y:0},{x:100,y:100}];
const _lorenz = new Chart(document.getElementById('lorenzChart'), {
  type:'line',
  data:{ datasets: [
    { label:'완전 평등선', data:equalityLine, borderColor:'#94a3b8', borderWidth:1.5, borderDash:[6,4], pointRadius:0, fill:false, tension:0 },
    { label:'실제 분포 (로렌츠)', data:lorenzPts, borderColor:'#f43f5e', backgroundColor:'rgba(244,63,94,0.18)', borderWidth:2.5, pointRadius:0, pointHoverRadius:5, fill:'origin', tension:0.3 }
  ]},
  options:{ responsive:true, maintainAspectRatio:false, parsing:false,
    plugins:{ legend:{position:'bottom', labels:{boxWidth:12, padding:12, font:{size:11}}},
      tooltip:{...buildTooltipBase(), callbacks:{label:ctx=>`  시·구 누적 ${ctx.parsed.x.toFixed(1)}% → AUM 누적 ${ctx.parsed.y.toFixed(1)}%`}}},
    scales:{
      x:{ type:'linear', grid:gridLight, title:{display:true, text:'시·구 누적 비율 (%)', color:_initColors.textMuted}, min:0, max:100, ticks:{callback:v=>v+'%'} },
      y:{ grid:gridLight, title:{display:true, text:'AUM 누적 비율 (%)', color:_initColors.textMuted}, min:0, max:100, ticks:{callback:v=>v+'%'} }
    }}
});
window._charts.push(_lorenz);
document.getElementById('giniValue').textContent = gini.toFixed(2);
document.getElementById('top10Value').textContent = top10pctShare + '%';

// ═══════ § 11. 광역 편차 ═══════
const regionGroups2 = {};
CITIES.forEach(c => { if (!regionGroups2[c.rg]) regionGroups2[c.rg] = []; regionGroups2[c.rg].push(c); });
const varianceRows = Object.entries(regionGroups2).map(([rg, list]) => {
  if (list.length < 2) return null;
  const amts = list.map(c => c.amt);
  const mean = amts.reduce((s,v)=>s+v, 0) / amts.length;
  const variance = amts.reduce((s,v)=>s+(v-mean)**2, 0) / amts.length;
  const std = Math.sqrt(variance);
  const cv = mean > 0 ? std / mean : 0;
  return { rg, n:list.length, max: Math.max(...amts), min: Math.min(...amts), cv };
}).filter(Boolean).sort((a,b) => b.cv - a.cv);
const maxCV = Math.max(...varianceRows.map(r=>r.cv));
document.getElementById('varianceTable').innerHTML = varianceRows.map((r,i) => {
  const ratio = r.min > 0 ? (r.max/r.min).toFixed(0) + '×' : '∞';
  const barW = (r.cv/maxCV*100).toFixed(0);
  return `<tr>
    <td class="rank">${String(i+1).padStart(2,'0')}</td>
    <td><strong style="color:var(--text)">${r.rg}</strong></td>
    <td class="num">${r.n}</td>
    <td class="num">${(r.max/1000).toFixed(1)}</td>
    <td class="num">${(r.min/1000).toFixed(2)}</td>
    <td class="num" style="color:var(--accent-warm);font-weight:600">${ratio}</td>
    <td class="num" style="font-weight:700">${r.cv.toFixed(2)}</td>
    <td class="variance-bar-wrap"><div class="variance-bar"><div class="fill" style="width:${barW}%"></div></div></td>
  </tr>`;
}).join('');

// ═══════ § 12. 지도 ═══════
const REGION_AMT_MAP = {};
REGIONS.forEach(r => REGION_AMT_MAP[r.name] = r);
function getMapColor(amt) {
  if (amt >= 200000) return '#1d3a8a';
  if (amt >= 50000)  return '#2451d3';
  if (amt >= 15000)  return '#5b8def';
  if (amt >= 5000)   return '#93b9ff';
  return '#cdddf7';
}
const tooltipEl = document.getElementById('mapTooltip');
document.querySelectorAll('#koreaMap .map-region').forEach(el => {
  const name = el.dataset.name;
  const r = REGION_AMT_MAP[name];
  if (!r) return;
  el.setAttribute('fill', getMapColor(r.amt));
  el.addEventListener('mousemove', (e) => {
    const rect = document.querySelector('.map-svg-wrap').getBoundingClientRect();
    tooltipEl.style.left = (e.clientX - rect.left + 14) + 'px';
    tooltipEl.style.top = (e.clientY - rect.top - 10) + 'px';
    tooltipEl.style.opacity = '1';
    tooltipEl.innerHTML = `<div class="name">${r.name}</div><div class="row"><span>AUM</span><b>${r.amt.toLocaleString()} M</b></div><div class="row"><span>인원</span><b>${r.cnt.toLocaleString()}명</b></div><div class="row"><span>점유율</span><b>${(r.amt/TOTAL_AUM*100).toFixed(2)}%</b></div>`;
  });
  el.addEventListener('mouseleave', () => tooltipEl.style.opacity = '0');
});

// ═══════ § 13. 페어 비교 ═══════
function renderPair() {
  const li = parseInt(document.getElementById('pairLeft').value);
  const ri = parseInt(document.getElementById('pairRight').value);
  document.getElementById('pairHL').textContent = PRODUCTS[li].name;
  document.getElementById('pairHR').textContent = PRODUCTS[ri].name;
  const pairData = REGIONS.map(r => {
    const arr = REGION_BY_PROD[r.name] || [0,0,0,0,0,0];
    return { rg:r.name, l:arr[li], r:arr[ri] };
  }).filter(d => d.l > 0 || d.r > 0).sort((a,b) => (b.l+b.r) - (a.l+a.r));
  const maxVal = Math.max(...pairData.map(d => Math.max(d.l, d.r)));
  document.getElementById('pairBars').innerHTML = pairData.map(d => {
    const lW = (d.l/maxVal*100).toFixed(0);
    const rW = (d.r/maxVal*100).toFixed(0);
    return `<div class="pair-row">
        <div class="val-r" style="text-align:left">${d.l>0 ? d.l.toLocaleString()+'M' : '—'}</div>
        <div class="pair-bar-wrap" style="justify-content:center">
          <div class="pair-bar-l" style="width:${lW/2}%; min-width:${d.l>0?'2px':'0'}">${d.l > maxVal*0.15 ? `<span class="pair-bar-val">${(d.l/1000).toFixed(0)}B</span>` : ''}</div>
          <div class="pair-divider"></div>
          <div class="pair-bar-r" style="width:${rW/2}%; min-width:${d.r>0?'2px':'0'}">${d.r > maxVal*0.15 ? `<span class="pair-bar-val">${(d.r/1000).toFixed(0)}B</span>` : ''}</div>
        </div>
        <div class="val-r"><strong style="color:var(--text)">${d.rg}</strong><br><span style="font-size:9px">${d.r>0 ? d.r.toLocaleString()+'M' : '—'}</span></div>
      </div>`;
  }).join('');
}
document.getElementById('pairLeft').addEventListener('change', renderPair);
document.getElementById('pairRight').addEventListener('change', renderPair);
renderPair();

// ═══════════════════════════════════════════════════════════════
// § 14. 연령 × 성별 매트릭스 (NEW)
// ═══════════════════════════════════════════════════════════════
function renderAgeSexMatrix(metric) {
  const valFn = {
    amt: d => d.amt,
    cnt: d => d.cnt,
    perCap: d => d.cnt > 0 ? Math.round(d.amt/d.cnt*100) : 0
  }[metric];
  const fmt = {
    amt: v => v >= 1000 ? (v/1000).toFixed(1)+'B' : v + 'M',
    cnt: v => v.toLocaleString() + '명',
    perCap: v => v.toLocaleString() + '만원'
  }[metric];
  const allVals = AGE_ORDER.flatMap(age => ['남','여'].map(sex => valFn(AGE_SEX[age][sex])));
  const maxV = Math.max(...allVals);

  let html = '<div class="agesex-grid"><div class="agesex-cell head"></div><div class="agesex-cell head male">남성</div><div class="agesex-cell head female">여성</div>';
  AGE_ORDER.forEach(age => {
    html += `<div class="agesex-cell head row">${age}</div>`;
    ['남','여'].forEach(sex => {
      const v = valFn(AGE_SEX[age][sex]);
      const ratio = maxV>0 ? v/maxV : 0;
      const baseColor = sex === '남' ? '91,141,239' : '244,63,94';
      const bg = `rgba(${baseColor}, ${0.15 + ratio*0.75})`;
      const txtColor = ratio > 0.55 ? '#fff' : 'var(--text)';
      html += `<div class="agesex-cell" style="background:${bg};color:${txtColor}"><div class="big">${fmt(v)}</div></div>`;
    });
  });
  html += '</div>';
  document.getElementById('ageSexMatrix').innerHTML = html;
}
renderAgeSexMatrix('perCap');
document.querySelectorAll('#ageSexToggle .pill').forEach(pill => {
  pill.addEventListener('click', () => {
    document.querySelectorAll('#ageSexToggle .pill').forEach(p => p.classList.remove('active'));
    pill.classList.add('active');
    renderAgeSexMatrix(pill.dataset.metric);
  });
});

// ═══════ § 15. 종목 × 연령 ═══════
const _prodAgeStack = new Chart(document.getElementById('prodAgeStack'), {
  type:'bar',
  data:{ labels: PRODUCTS.map(p => p.name),
    datasets: AGE_ORDER.map((age, idx) => ({
      label: age,
      data: PRODUCTS.map(p => {
        const ms = PROD_AGE_SEX[p.key][age];
        return ms.남.amt + ms.여.amt;
      }),
      backgroundColor: ['#fbbf24','#fb923c','#f43f5e','#5b8def','#14b8a6'][idx],
      borderRadius: 2
    }))
  },
  options:{ responsive:true, maintainAspectRatio:false,
    plugins:{ legend:{position:'bottom', labels:{boxWidth:12, padding:12, font:{size:11}}},
      tooltip:{...buildTooltipBase(), callbacks:{label:ctx=>`  ${ctx.dataset.label}: ${ctx.parsed.y.toLocaleString()}M`}}},
    scales:{
      x:{ stacked:true, grid:gridNone, ticks:{font:{size:10}, color:'#a1adc7'} },
      y:{ stacked:true, grid:gridLight, ticks:{callback:v=>(v/1000).toFixed(0)+'B'} }
    }}
});
window._charts.push(_prodAgeStack);

const _prodAgePerCap = new Chart(document.getElementById('prodAgePerCap'), {
  type:'line',
  data:{ labels: AGE_ORDER,
    datasets: PRODUCTS.map(p => ({
      label: p.name,
      data: AGE_ORDER.map(age => {
        const ms = PROD_AGE_SEX[p.key][age];
        const totalAmt = ms.남.amt + ms.여.amt;
        const totalCnt = ms.남.cnt + ms.여.cnt;
        return totalCnt > 0 ? Math.round(totalAmt/totalCnt*100) : 0;
      }),
      borderColor: p.color,
      backgroundColor: p.color + '33',
      borderWidth: 2.5,
      pointRadius: 4,
      pointHoverRadius: 7,
      tension: 0.3
    }))
  },
  options:{ responsive:true, maintainAspectRatio:false,
    plugins:{ legend:{position:'bottom', labels:{boxWidth:10, padding:10, font:{size:10}}},
      tooltip:{...buildTooltipBase(), callbacks:{label:ctx=>`  ${ctx.dataset.label}: ${ctx.parsed.y.toLocaleString()}만원`}}},
    scales:{
      x:{ grid:gridNone, ticks:{font:{size:11}} },
      y:{ grid:gridLight, ticks:{callback:v=>v.toLocaleString()+'만'} }
    }}
});
window._charts.push(_prodAgePerCap);

// ═══════ § 16. 종목 × 성별 편향 ═══════
let sexBiasHTML = '<div class="sexbias-list">';
PRODUCTS.forEach(p => {
  let mAmt=0, fAmt=0, mCnt=0, fCnt=0;
  AGE_ORDER.forEach(age => {
    mAmt += PROD_AGE_SEX[p.key][age]['남'].amt;
    fAmt += PROD_AGE_SEX[p.key][age]['여'].amt;
    mCnt += PROD_AGE_SEX[p.key][age]['남'].cnt;
    fCnt += PROD_AGE_SEX[p.key][age]['여'].cnt;
  });
  const totalAmt = mAmt + fAmt;
  if (totalAmt === 0) return;
  const mPct = (mAmt/totalAmt*100).toFixed(1);
  const fPct = (fAmt/totalAmt*100).toFixed(1);
  const isLev = p.name.includes('레버리지');
  sexBiasHTML += `<div class="sexbias-row">
      <div class="sexbias-name"><span class="prod-dot" style="background:${p.color}"></span>${p.name}${isLev ? '<span class="lev-tag">LEV</span>' : ''}</div>
      <div class="sexbias-bar">
        <div class="sb-male" style="width:${mPct}%">${mPct}%</div>
        <div class="sb-female" style="width:${fPct}%">${fPct}%</div>
      </div>
      <div class="sexbias-meta">남 ${mCnt.toLocaleString()} · 여 ${fCnt.toLocaleString()}</div>
    </div>`;
});
sexBiasHTML += '</div>';
document.getElementById('sexBiasChart').innerHTML = sexBiasHTML;

// ═══════ § 17. VVIP 풀 ═══════
const VVIP_data = REGIONS.map(r => {
  const lev1 = REGION_BY_PROD[r.name][1];
  const lev2 = REGION_BY_PROD[r.name][5];
  const sas = SIDO_AGE_SEX[r.name];
  if (!sas) return null;
  const sn = sas['60대이상']['남'];
  const sf = sas['60대이상']['여'];
  return { rg:r.name, lev:lev1+lev2, senior:sn.amt+sf.amt, seniorCnt:sn.cnt+sf.cnt };
}).filter(d => d && d.lev > 100).sort((a,b) => b.lev - a.lev).slice(0, 10);

const vvipMaxLev = Math.max(...VVIP_data.map(d=>d.lev));
let vvipHTML = '<table class="tbl"><thead><tr><th>#</th><th>광역</th><th class="num">레버리지 합계</th><th class="num">60대+ 인원</th><th class="num">60대+ AUM</th><th>레버리지 강도</th></tr></thead><tbody>';
VVIP_data.forEach((d,i) => {
  const w = (d.lev/vvipMaxLev*100).toFixed(0);
  vvipHTML += `<tr>
    <td class="rank">${String(i+1).padStart(2,'0')}</td>
    <td><strong style="color:var(--text)">${d.rg}</strong></td>
    <td class="num">${(d.lev/1000).toFixed(1)}B</td>
    <td class="num">${d.seniorCnt.toLocaleString()}명</td>
    <td class="num">${(d.senior/1000).toFixed(1)}B</td>
    <td class="bar-cell"><div class="bar-bg"><div class="bar-fill" style="width:${w}%;background:linear-gradient(90deg,#f43f5e,#fbbf24)"></div></div></td>
  </tr>`;
});
vvipHTML += '</tbody></table>';
document.getElementById('vvipTable').innerHTML = vvipHTML;

const vvipP1 = PROD_AGE_SEX['p1']['60대이상'];
const vvipPerCap_M = vvipP1['남'].cnt > 0 ? Math.round(vvipP1['남'].amt/vvipP1['남'].cnt*100) : 0;
const vvipPerCap_F = vvipP1['여'].cnt > 0 ? Math.round(vvipP1['여'].amt/vvipP1['여'].cnt*100) : 0;
document.getElementById('vvipMaleAvg').textContent = (vvipPerCap_M/10000).toFixed(2) + '억';
document.getElementById('vvipFemaleAvg').textContent = (vvipPerCap_F/10000).toFixed(2) + '억';
document.getElementById('vvipTotalCnt').textContent = (vvipP1['남'].cnt + vvipP1['여'].cnt) + '명';

// ═══════ § 18. 20대 여성 신규 풀 ═══════
const FEMALE20_data = REGIONS.map(r => {
  const sas = SIDO_AGE_SEX[r.name];
  if (!sas) return null;
  const f20 = sas['20대']['여'];
  return { rg:r.name, amt:f20.amt, cnt:f20.cnt, perCap: f20.cnt>0 ? Math.round(f20.amt/f20.cnt*100) : 0 };
}).filter(d=>d && d.cnt>0).sort((a,b) => b.cnt - a.cnt);

const f20MaxCnt = Math.max(...FEMALE20_data.map(d=>d.cnt));
let f20HTML = '';
FEMALE20_data.forEach((d,i) => {
  const w = (d.cnt/f20MaxCnt*100).toFixed(0);
  f20HTML += `<div class="f20-row">
      <div class="f20-rank">${String(i+1).padStart(2,'0')}</div>
      <div class="f20-name">${d.rg}</div>
      <div class="f20-bar"><div class="f20-fill" style="width:${w}%"></div></div>
      <div class="f20-stat"><b>${d.cnt}</b>명 · <span class="muted">${d.perCap}만</span></div>
    </div>`;
});
document.getElementById('f20Section').innerHTML = f20HTML;

const f20Total = AGE_SEX['20대']['여'];
const totalWomen = Object.values(AGE_SEX).reduce((s,o)=>s+o['여'].cnt,0);
document.getElementById('f20TotalCnt').textContent = f20Total.cnt.toLocaleString() + '명';
document.getElementById('f20PerCap').textContent = Math.round(f20Total.amt/f20Total.cnt*100) + '만';
document.getElementById('f20PctOfWomen').textContent = (f20Total.cnt / totalWomen * 100).toFixed(1) + '%';

// ═══════ § 19. 시·도 × 연령 매트릭스 ═══════
const sidoAgeMaxPerCap = (() => {
  let mx = 0;
  Object.values(SIDO_AGE_SEX).forEach(s => {
    AGE_ORDER.forEach(age => {
      const v = s[age]['남'].amt + s[age]['여'].amt;
      const c = s[age]['남'].cnt + s[age]['여'].cnt;
      if (c > 0) mx = Math.max(mx, v/c*100);
    });
  });
  return mx;
})();

let sidoAgeHTML = '<div class="sidoage-grid"><div class="sa-cell head"></div>';
AGE_ORDER.forEach(age => sidoAgeHTML += `<div class="sa-cell head">${age}</div>`);
const orderedSido = REGIONS.map(r => r.name);
orderedSido.forEach(rg => {
  sidoAgeHTML += `<div class="sa-cell head row">${rg}</div>`;
  AGE_ORDER.forEach(age => {
    const s = SIDO_AGE_SEX[rg];
    if (!s) { sidoAgeHTML += '<div class="sa-cell empty">—</div>'; return; }
    const a = s[age]['남'].amt + s[age]['여'].amt;
    const c = s[age]['남'].cnt + s[age]['여'].cnt;
    if (c === 0) { sidoAgeHTML += '<div class="sa-cell empty">—</div>'; return; }
    const pc = Math.round(a/c*100);
    const ratio = pc / sidoAgeMaxPerCap;
    const bg = `rgba(91,141,239,${0.1 + ratio*0.75})`;
    const txt = ratio > 0.55 ? '#fff' : 'var(--text)';
    sidoAgeHTML += `<div class="sa-cell" style="background:${bg};color:${txt}" title="${rg} · ${age}: 1인당 ${pc}만 (${c}명)">${pc}만</div>`;
  });
});
sidoAgeHTML += '</div>';
document.getElementById('sidoAgeMatrix').innerHTML = sidoAgeHTML;

  } catch(e) {
    console.error('Chart rendering error:', e);
    document.querySelectorAll('canvas').forEach(c => {
      const wrap = c.closest('.chart-wrap');
      if (wrap) wrap.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100%;color:#6b7894;font-family:monospace;font-size:11px;">⚠ 차트 로딩 오류 — 콘솔 확인 필요</div>';
    });
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initCharts);
} else {
  initCharts();
}
