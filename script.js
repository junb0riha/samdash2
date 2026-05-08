
const D = window.DASHBOARD_DATA;
const krwB = v => (v/1e9).toLocaleString('ko-KR',{maximumFractionDigits:1}) + 'B';
const krwEok = v => (v/1e8).toLocaleString('ko-KR',{maximumFractionDigits:0}) + '억원';
const manwon = v => (v/10000).toLocaleString('ko-KR',{maximumFractionDigits:0}) + '만원';
const pct = v => (v*100).toLocaleString('ko-KR',{maximumFractionDigits:1}) + '%';
const num = v => Number(v).toLocaleString('ko-KR');
const shortProduct = p => p.replace('KODEX ','K. ').replace('TIGER ','T. ').replace('반도체TOP10레버리지','TOP10 Lev').replace('반도체TOP10','TOP10').replace('반도체레버리지','반도체 Lev').replace('AI반도체','AI반도체').replace('반도체','반도체');
const palette = ['#46d9ff','#7cf7c5','#ffb15c','#ff6f91','#a78bfa','#facc15','#94a3b8','#38bdf8','#fb7185','#34d399'];
const productColors = {'KODEX 반도체':'#46d9ff','KODEX 반도체레버리지':'#00a6ff','KODEX AI반도체':'#7cf7c5','TIGER 반도체TOP10':'#ffb15c','TIGER 반도체TOP10레버리지':'#ff7a45','TIGER 반도체':'#ffd166'};
Chart.defaults.color = '#b8c7d8';
Chart.defaults.borderColor = 'rgba(255,255,255,.08)';
Chart.defaults.font.family = 'Pretendard,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif';

function setText(id, value){document.getElementById(id).textContent = value;}
function initKpis(){
  const s = D.summary;
  setText('kpiAum', krwEok(s.totalAum)); setText('kpiHolders', num(s.totalHolders)+'명'); setText('kpiAvg', manwon(s.avgHolding));
  setText('kpiKodex', pct(s.kodexShareAum)); setText('kpiMetro', pct(s.metroShare)); setText('kpiTopProduct', shortProduct(s.topProduct.product));
  setText('subAum', krwB(s.totalAum)+' / 데이터 '+num(D.meta.segments)+'개');
  setText('subKodex', 'KODEX '+krwEok(s.kodexAum)+' · TIGER '+krwEok(s.tigerAum));
  setText('subMetro', '서울 '+pct(s.seoulAum/s.totalAum)+' · 경기 '+pct(s.gyeonggiAum/s.totalAum));
  setText('subTopProduct', krwEok(s.topProduct.aum)+' · '+num(s.topProduct.holders)+'명');
  document.getElementById('heroMeta').textContent = `${D.meta.reportDate} INTERNAL · ${D.meta.productCount}개 ETF · ${D.meta.provinceCount}개 시도 · ${D.meta.cityCount}개 시군구`;
}
function chart(id, type, data, options={}){return new Chart(document.getElementById(id),{type,data,options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{position:'bottom',labels:{boxWidth:10,usePointStyle:true}},tooltip:{callbacks:{label:ctx=>`${ctx.dataset.label||ctx.label}: ${ctx.parsed.y!==undefined?num(ctx.parsed.y):num(ctx.parsed)}${ctx.dataset.unit||''}`}}},scales:type==='doughnut'?{}:{x:{grid:{display:false}},y:{ticks:{callback:v=>Number(v).toLocaleString('ko-KR')}}},...options}})}
function productCharts(){
  const p = D.tables.product;
  chart('productDonut','doughnut',{labels:p.map(x=>shortProduct(x.product)),datasets:[{label:'AUM',data:p.map(x=>x.aum/1e8),backgroundColor:p.map(x=>productColors[x.product]||'#999'),unit:'억원'}]}, {cutout:'62%'});
  chart('productAvg','bar',{labels:p.map(x=>shortProduct(x.product)),datasets:[{label:'1인당 보유금액',data:p.map(x=>x.avg/10000),backgroundColor:p.map(x=>productColors[x.product]||'#999'),unit:'만원'}]}, {indexAxis:'y',plugins:{legend:{display:false}},scales:{x:{ticks:{callback:v=>v+'만원'}},y:{grid:{display:false}}}});
  const m = D.tables.manager;
  chart('managerShare','bar',{labels:m.map(x=>x.manager==='KODEX'?'KODEX':'TIGER'),datasets:[{label:'AUM',data:m.map(x=>x.aum/1e8),backgroundColor:m.map(x=>x.manager==='KODEX'?'#46d9ff':'#ffb15c'),unit:'억원'},{label:'보유자',data:m.map(x=>x.holders),backgroundColor:m.map(x=>x.manager==='KODEX'?'rgba(70,217,255,.45)':'rgba(255,177,92,.45)'),unit:'명',yAxisID:'y1'}]}, {scales:{y:{position:'left',ticks:{callback:v=>v+'억'}},y1:{position:'right',grid:{drawOnChartArea:false},ticks:{callback:v=>num(v)}}}});
  renderProductTable();
}
function regionCharts(){
  const prov = D.tables.province;
  chart('provinceAum','bar',{labels:prov.map(x=>x.province),datasets:[{label:'보유평가액',data:prov.map(x=>x.aum/1e8),backgroundColor:'#46d9ff',unit:'억원'}]}, {indexAxis:'y',plugins:{legend:{display:false}},scales:{x:{ticks:{callback:v=>v+'억'}},y:{grid:{display:false}}}});
  chart('provinceAvg','bar',{labels:prov.map(x=>x.province),datasets:[{label:'1인당',data:prov.map(x=>x.avg/10000),backgroundColor:prov.map((x,i)=>i<3?'#7cf7c5':'rgba(124,247,197,.45)'),unit:'만원'}]}, {plugins:{legend:{display:false}},scales:{y:{ticks:{callback:v=>v+'만원'}},x:{grid:{display:false}}}});
  const pm = D.tables.provinceManager;
  const labels = prov.map(x=>x.province);
  chart('provinceManager','bar',{labels,datasets:['KODEX','TIGER'].map((m,i)=>({label:m,data:labels.map(l=>{const r=pm.find(x=>x.province===l&&x.manager===m);return r?r.aum/1e8:0}),backgroundColor:i===0?'#46d9ff':'#ffb15c',unit:'억원'}))}, {indexAxis:'y',scales:{x:{stacked:true,ticks:{callback:v=>v+'억'}},y:{stacked:true,grid:{display:false}}}});
}
function demographicCharts(){
  const ageOrder = ['10대','20대','30대','40대','50대','60대이상'];
  const am = D.tables.ageManager;
  chart('ageStack','bar',{labels:ageOrder,datasets:['KODEX','TIGER'].map((m,i)=>({label:m,data:ageOrder.map(a=>{const r=am.find(x=>x.age===a&&x.manager===m);return r?r.aum/1e8:0}),backgroundColor:i===0?'#46d9ff':'#ffb15c',unit:'억원'}))}, {scales:{x:{stacked:true,grid:{display:false}},y:{stacked:true,ticks:{callback:v=>v+'억'}}}});
  const gm = D.tables.genderManager; const gLabels=['남','여'];
  chart('genderStack','bar',{labels:gLabels,datasets:['KODEX','TIGER'].map((m,i)=>({label:m,data:gLabels.map(g=>{const r=gm.find(x=>x.gender===g&&x.manager===m);return r?r.holders:0}),backgroundColor:i===0?'#46d9ff':'#ffb15c',unit:'명'}))}, {scales:{x:{stacked:true,grid:{display:false}},y:{stacked:true,ticks:{callback:v=>num(v)}}}});
  const gap = D.tables.ageGap.sort((a,b)=>ageOrder.indexOf(a.age)-ageOrder.indexOf(b.age));
  chart('ageShare','line',{labels:gap.map(x=>x.age),datasets:[{label:'KODEX AUM 점유율',data:gap.map(x=>x.kodexShare*100),borderColor:'#46d9ff',backgroundColor:'rgba(70,217,255,.18)',fill:true,tension:.35,unit:'%'},{label:'TIGER AUM 점유율',data:gap.map(x=>x.tigerShare*100),borderColor:'#ffb15c',backgroundColor:'rgba(255,177,92,.12)',fill:true,tension:.35,unit:'%'}]}, {scales:{y:{min:0,max:100,ticks:{callback:v=>v+'%'}},x:{grid:{display:false}}}});
}
function cityCharts(){
  const top = D.tables.cityTop20;
  const labels = top.map(x=>x.label);
  const ctp = D.tables.cityTop20Product;
  const products = D.tables.product.map(x=>x.product);
  chart('cityStack','bar',{labels,datasets:products.map(p=>({label:shortProduct(p),data:labels.map(l=>{const [prov,...rest]=l.split(' '); const city=rest.join(' '); const r=ctp.find(x=>x.province===prov&&x.city===city&&x.product===p);return r?r.aum/1e8:0}),backgroundColor:productColors[p]||'#999',unit:'억원'}))}, {indexAxis:'y',scales:{x:{stacked:true,ticks:{callback:v=>v+'억'}},y:{stacked:true,grid:{display:false}}}});
  const q = D.tables.quadrant.filter(x=>x.aum>0).sort((a,b)=>b.aum-a.aum).slice(0,120);
  chart('quadrant','bubble',{datasets:[{label:'시군구',data:q.map(x=>({x:x.holders,y:x.aum/1e8,r:Math.max(4,Math.min(26,x.avg/700000)) ,label:x.label,avg:x.avg,quadrant:x.quadrant})),backgroundColor:'rgba(70,217,255,.42)',borderColor:'#46d9ff',unit:'억원'}]}, {plugins:{legend:{display:false},tooltip:{callbacks:{label:ctx=>`${ctx.raw.label} · ${krwEok(ctx.raw.y*1e8)} · ${num(ctx.raw.x)}명 · ${manwon(ctx.raw.avg)} · ${ctx.raw.quadrant}`}}},scales:{x:{title:{display:true,text:'보유 인원'},ticks:{callback:v=>num(v)}},y:{title:{display:true,text:'보유 평가액'},ticks:{callback:v=>v+'억'}}}});
  renderCityTable();
}
function heatmap(){
  const products = D.tables.product.map(x=>x.product);
  const provinces = D.tables.province.map(x=>x.province);
  const max = Math.max(...D.tables.heatmap.map(x=>x.share));
  const root = document.getElementById('heatmap');
  const head = document.createElement('div'); head.className='heat-row';
  head.innerHTML = '<div class="heat-head">지역</div>'+products.map(p=>`<div class="heat-head">${shortProduct(p)}</div>`).join(''); root.appendChild(head);
  provinces.forEach(prov=>{
    const row = document.createElement('div'); row.className='heat-row';
    row.innerHTML = `<div class="heat-label">${prov}</div>` + products.map(p=>{
      const r = D.tables.heatmap.find(x=>x.province===prov&&x.product===p) || {aum:0,share:0};
      const alpha = .08 + (r.share/max)*.72;
      const color = p.startsWith('KODEX') ? `rgba(70,217,255,${alpha})` : `rgba(255,177,92,${alpha})`;
      return `<div class="heat-cell" style="background:${color}"><b>${pct(r.share)}</b><br><span>${krwEok(r.aum)}</span></div>`;
    }).join(''); root.appendChild(row);
  });
}
function renderProductTable(){
  const rows = D.tables.product.map((r,i)=>`<tr><td>${i+1}. ${r.product}<div class="barline"><div class="barfill" style="width:${pct(r.aum/D.summary.topProduct.aum)}"></div></div></td><td><span class="pill ${r.manager==='KODEX'?'kodex':'tiger'}">${r.manager}</span></td><td>${krwEok(r.aum)}</td><td>${num(r.holders)}명</td><td>${manwon(r.avg)}</td><td>${pct(r.aum/D.summary.totalAum)}</td></tr>`).join('');
  document.getElementById('productTable').innerHTML = `<table><thead><tr><th>종목</th><th>구분</th><th>AUM</th><th>보유자</th><th>1인당</th><th>점유율</th></tr></thead><tbody>${rows}</tbody></table>`;
}
function renderCityTable(){
  const rows = D.tables.city.slice(0,30).map((r,i)=>`<tr><td>${i+1}. ${r.label}<div class="barline"><div class="barfill" style="width:${pct(r.aum/D.tables.city[0].aum)}"></div></div></td><td>${krwEok(r.aum)}</td><td>${num(r.holders)}명</td><td>${manwon(r.avg)}</td><td>${r.quadrant||''}</td></tr>`).join('');
  document.getElementById('cityTable').innerHTML = `<table><thead><tr><th>시군구</th><th>AUM</th><th>보유자</th><th>1인당</th><th>유형</th></tr></thead><tbody>${rows}</tbody></table>`;
}
function renderAdvantageTable(){
  const rows = D.tables.cityAdvantage.slice(0,15).map((r,i)=>`<tr><td>${i+1}. ${r.label}</td><td>${pct(r.kodexShare)}</td><td>${krwEok(r.KODEX||0)}</td><td>${krwEok(r.TIGER||0)}</td><td>${krwEok(r.total)}</td></tr>`).join('');
  document.getElementById('advantageTable').innerHTML = `<table><thead><tr><th>도시</th><th>KODEX 점유</th><th>KODEX</th><th>TIGER</th><th>전체</th></tr></thead><tbody>${rows}</tbody></table>`;
}
function initInsights(){
  const s = D.summary;
  document.getElementById('summaryText').innerHTML = `현재 데이터 기준 반도체 ETF 6종의 총 보유평가액은 <b>${krwEok(s.totalAum)}</b>, 총 보유자는 <b>${num(s.totalHolders)}명</b>이다. AUM 기준 점유는 KODEX <b>${pct(s.kodexShareAum)}</b>, TIGER <b>${pct(s.tigerShareAum)}</b>로 TIGER가 외형 우위이나, KODEX는 레버리지·AI·본편 조합을 통해 고액/핵심 지역 공략 여지가 크다.`;
  document.getElementById('regionText').innerHTML = `수도권 보유평가액은 <b>${krwEok(s.metroAum)}</b>로 전체의 <b>${pct(s.metroShare)}</b>를 차지한다. 서울과 경기가 시장의 핵심이지만, 충북·충남·경남 등 반도체 산업권의 1인당 보유금액도 높아 지방 거점형 캠페인이 필요하다.`;
  document.getElementById('demoText').innerHTML = `연령별 AUM은 50대, 40대, 60대 이상 순으로 크다. 남성은 AUM 비중이 높고 여성은 보유자 수 비중이 높아, 고액 투자 메시지와 대중형 적립식 메시지를 분리하는 편이 효율적이다.`;
}
function csvDownload(){
  const rows = D.tables.product.map(r=>[r.product,r.manager,r.aum,r.holders,Math.round(r.avg)]);
  const csv = '\ufeff종목,구분,보유평가액,보유자,1인당보유금액\n' + rows.map(r=>r.join(',')).join('\n');
  const blob = new Blob([csv],{type:'text/csv;charset=utf-8'}); const url = URL.createObjectURL(blob);
  const a = document.getElementById('csvBtn'); a.href=url; a.download='semiconductor_etf_summary.csv';
}
window.addEventListener('DOMContentLoaded',()=>{initKpis();initInsights();productCharts();regionCharts();demographicCharts();cityCharts();heatmap();renderAdvantageTable();csvDownload();});
