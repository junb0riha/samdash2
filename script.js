const D=window.DASHBOARD_DATA;
const fmt=new Intl.NumberFormat('ko-KR');
const byId=id=>document.getElementById(id);
const num=v=>fmt.format(Math.round(v||0));
const pct=v=>((v||0)*100).toFixed(1)+'%';
const eok=v=>num((v||0)/1e8)+'억';
const man=v=>num((v||0)/10000)+'만원';
const short=p=>p.replace('KODEX ','').replace('TIGER ','').replace('반도체TOP10레버리지','TOP10 Lev').replace('반도체레버리지','Lev').replace('반도체TOP10','TOP10').replace('AI반도체','AI').replace('반도체','반도체');
const productColors={'KODEX AI반도체':'#7cf7c5','KODEX 반도체':'#46d9ff','KODEX 반도체레버리지':'#b997ff','TIGER 반도체':'#f7dd72','TIGER 반도체TOP10':'#ffb15c','TIGER 반도체TOP10레버리지':'#ff6f91'};
const ageOrder=['10대','20대','30대','40대','50대','60대이상'];
function chart(id,type,data,opt={}){return new Chart(byId(id),{type,data,options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{position:'bottom',labels:{boxWidth:10,usePointStyle:true,color:'#c8d7eb'}},tooltip:{callbacks:{label:c=>{const label=c.dataset.label||c.label||'';let v=c.parsed?.y??c.parsed?.x??c.parsed; if(type==='bubble') return c.raw.label+' · '+eok(c.raw.y*1e8)+' · '+num(c.raw.x)+'명 · '+c.raw.quadrant; return label+': '+num(v)+(c.dataset.unit||'')}}}},scales:type==='doughnut'?{}:{x:{grid:{display:false,color:'rgba(255,255,255,.08)'},ticks:{color:'#9db0c8'}},y:{grid:{color:'rgba(255,255,255,.08)'},ticks:{color:'#9db0c8'}}},...opt}})}
function init(){
 const s=D.summary;
 byId('heroMeta').textContent=`${D.meta.reportDate} INTERNAL · ${D.meta.productCount}개 ETF · ${D.meta.provinceCount}개 시도 · ${D.meta.cityCount}개 시군구 · ${num(D.meta.segments)}개 세그먼트`;
 byId('ticker').innerHTML=[['TOTAL',eok(s.totalAum)],['HOLDERS',num(s.totalHolders)+'명'],['KODEX',pct(s.kodexShareAum)],['TIGER',pct(s.tigerShareAum)],['수도권',pct(s.metroShare)],['핵심연령',s.topAgeByAum.age]].map(x=>`<div class="tick"><b>${x[0]}</b>${x[1]}</div>`).join('');
 byId('kpiAum').textContent=eok(s.totalAum); byId('subAum').textContent=`${num(s.totalHolders)}명 · 1인당 ${man(s.avgHolding)}`;
 byId('kpiKodex').textContent=pct(s.kodexShareAum); byId('subKodex').textContent=`KODEX ${eok(s.kodexAum)} / TIGER ${eok(s.tigerAum)}`;
 byId('kpiMale').textContent=`${pct(s.maleAumShare)} / ${pct(s.maleHolderShare)}`; byId('subMale').textContent=`남성 1인당 ${man(s.maleAvg)}`;
 byId('kpiFemale').textContent=`${pct(s.femaleAumShare)} / ${pct(s.femaleHolderShare)}`; byId('subFemale').textContent=`여성 1인당 ${man(s.femaleAvg)}`;
 byId('kpiAge').textContent=s.topAgeByAum.age; byId('subAge').textContent=`AUM ${eok(s.topAgeByAum.aum)} · 보유자 최다 ${s.topAgeByHolders.age}`;
 byId('kpiMetro').textContent=pct(s.metroShare); byId('subMetro').textContent=`서울 ${eok(s.seoulAum)} · 경기 ${eok(s.gyeonggiAum)}`;
}
function narrative(){
 const s=D.summary, top=D.tables.product[0], age=D.tables.ageGap, weak=[...age].sort((a,b)=>a.kodexShare-b.kodexShare)[0], strong=[...age].sort((a,b)=>b.kodexShare-a.kodexShare)[0];
 byId('summaryText').innerHTML=`<p>반도체 ETF 6종 총 보유평가액은 <b>${eok(s.totalAum)}</b>, 총 보유자는 <b>${num(s.totalHolders)}명</b>입니다. 외형은 TIGER가 AUM <b>${pct(s.tigerShareAum)}</b>로 앞서지만, KODEX는 보유자 점유율 <b>${pct(s.kodexShareHolders)}</b> 대비 AUM 점유율 <b>${pct(s.kodexShareAum)}</b>이 높아 1인당 보유금액이 더 큰 구조입니다.</p><p>성별로는 남성이 AUM <b>${pct(s.maleAumShare)}</b>를 차지하지만 보유자 비중은 <b>${pct(s.maleHolderShare)}</b>에 그쳐 고액 투자 성향이 강합니다. 여성은 보유자 기반이 더 두꺼워 대표지수형·AI테마형·적립식 캠페인의 확산 타겟으로 분리하는 편이 좋습니다.</p><p>연령별로는 <b>${s.topAgeByAum.age}</b>가 AUM 기준 핵심이고, KODEX 점유율은 <b>${strong.age}</b>에서 가장 높고 <b>${weak.age}</b>에서 가장 낮습니다. 따라서 리브랜딩/신상품 메시지는 연령대별로 다르게 설계해야 합니다.</p>`;
 byId('productInsight').innerHTML=`<h3>SAM Insight · 상품 구조 해석</h3><ul><li><b>${top.product}</b>는 전체 1위 상품으로, 보유자 기반이 압도적이어서 경쟁사 방어력이 가장 강한 풀입니다.</li><li>KODEX는 총 보유자 수에서는 열위이나 1인당 보유금액이 높아, 단순 대중 확산보다 고액·핵심지역·레버리지 성향 타겟이 우선입니다.</li><li>상품별 성별 비중을 보면 고위험/레버리지 상품은 남성 AUM 의존도가 높고, 대표형 상품은 여성 보유자 확장 여지가 큽니다.</li></ul>`;
 byId('personaInsight').innerHTML=`<h3>SAM Insight · 페르소나 분석</h3><ul><li>50대와 60대 이상은 보유금액 규모가 커서 위클리커버드콜·월분배형 등 인컴 메시지의 1차 타겟입니다.</li><li>30~50대 남성은 1인당 보유금액이 높아 KODEX 반도체레버리지, 삼성전자/하이닉스 레버리지 등 고변동성 상품의 초기 타겟으로 적합합니다.</li><li>여성 및 20~30대는 보유자 수 확장 관점에서 AI반도체·TOP10·소액 적립식 메시지가 효율적입니다.</li></ul>`;
 byId('regionInsight').innerHTML=`<h3>SAM Insight · 지역 구조 해석</h3><ul><li>서울·경기·인천의 수도권 집중도는 <b>${pct(s.metroShare)}</b>로 높지만, 지방 거점은 연령·성별 구성이 달라 일괄 캠페인보다 지역별 페르소나가 중요합니다.</li><li>강남·성남·수원·화성 등 상위 도시에서는 상품 믹스가 다르게 나타나므로, 같은 수도권이라도 리브랜딩/인컴/레버리지 메시지를 분리해야 합니다.</li><li>경쟁사 우위 도시 중 AUM이 큰 곳은 신규 상품 모객보다 KODEX 브랜드 전환 캠페인의 우선순위가 높습니다.</li></ul>`;
 byId('strategyInsight').innerHTML=`<h3>실행 관점 결론</h3><ul><li><b>인컴형</b>: 50대+ AUM 상위 지역에 위클리커버드콜 메시지 집중.</li><li><b>레버리지형</b>: 30~50대 남성 고액 지역에 단일종목 레버리지·반도체 레버리지 메시지 집중.</li><li><b>대중확산형</b>: 여성/2030 보유자 많은 지역에 AI반도체·TOP10·적립식 메시지 적용.</li><li><b>경쟁전환형</b>: TIGER AUM이 크고 KODEX 점유율이 낮은 도시를 별도 전환 리스트로 관리.</li></ul>`;
}
function drawProducts(){
 const p=D.tables.product, m=D.tables.manager;
 chart('productDonut','doughnut',{labels:p.map(x=>short(x.product)),datasets:[{label:'AUM',data:p.map(x=>x.aum/1e8),backgroundColor:p.map(x=>productColors[x.product]),unit:'억'}]},{cutout:'62%'});
 chart('productAvg','bar',{labels:p.map(x=>short(x.product)),datasets:[{label:'1인당 보유금액',data:p.map(x=>x.avg/10000),backgroundColor:p.map(x=>productColors[x.product]),unit:'만원'}]},{indexAxis:'y',plugins:{legend:{display:false}},scales:{x:{ticks:{callback:v=>v+'만원',color:'#9db0c8'}},y:{grid:{display:false},ticks:{color:'#9db0c8'}}}});
 chart('managerDual','bar',{labels:m.map(x=>x.manager),datasets:[{label:'AUM',data:m.map(x=>x.aum/1e8),backgroundColor:m.map(x=>x.manager==='KODEX'?'#46d9ff':'#ffb15c'),unit:'억'},{label:'보유자',data:m.map(x=>x.holders),backgroundColor:m.map(x=>x.manager==='KODEX'?'rgba(70,217,255,.4)':'rgba(255,177,92,.4)'),yAxisID:'y1',unit:'명'}]},{scales:{y:{position:'left',ticks:{callback:v=>v+'억',color:'#9db0c8'}},y1:{position:'right',grid:{drawOnChartArea:false},ticks:{color:'#9db0c8'}}}});
 const pg=D.tables.productGender, products=p.map(x=>x.product), genders=['남','여'];
 chart('productGender','bar',{labels:products.map(short),datasets:genders.map((g,i)=>({label:g,data:products.map(pr=>{const r=pg.find(x=>x.product===pr&&x.gender===g);return r?r.aum/1e8:0}),backgroundColor:i===0?'#46d9ff':'#ff6f91',unit:'억'}))},{scales:{x:{stacked:true,ticks:{color:'#9db0c8'}},y:{stacked:true,ticks:{callback:v=>v+'억',color:'#9db0c8'}}}});
 byId('productTable').innerHTML=table(['종목','구분','AUM','보유자','1인당','AUM 점유'],p.map((r,i)=>[`${i+1}. ${r.product}<div class="barline"><div class="barfill" style="width:${Math.min(100,r.aum/p[0].aum*100)}%"></div></div>`,`<span class="pill ${r.manager==='KODEX'?'kodex':'tiger'}">${r.manager}</span>`,eok(r.aum),num(r.holders)+'명',man(r.avg),pct(r.aum/D.summary.totalAum)]));
}
function drawDemographics(){
 const am=D.tables.ageManager;
 chart('ageManager','bar',{labels:ageOrder,datasets:['KODEX','TIGER'].map((m,i)=>({label:m,data:ageOrder.map(a=>{const r=am.find(x=>x.age===a&&x.manager===m);return r?r.aum/1e8:0}),backgroundColor:i===0?'#46d9ff':'#ffb15c',unit:'억'}))},{scales:{x:{stacked:true,ticks:{color:'#9db0c8'}},y:{stacked:true,ticks:{callback:v=>v+'억',color:'#9db0c8'}}}});
 const gap=D.tables.ageGap;
 chart('ageShare','line',{labels:ageOrder,datasets:[{label:'KODEX AUM 점유율',data:ageOrder.map(a=>gap.find(x=>x.age===a).kodexShare*100),borderColor:'#46d9ff',backgroundColor:'rgba(70,217,255,.15)',fill:true,tension:.35,unit:'%'},{label:'TIGER AUM 점유율',data:ageOrder.map(a=>gap.find(x=>x.age===a).tigerShare*100),borderColor:'#ffb15c',backgroundColor:'rgba(255,177,92,.12)',fill:true,tension:.35,unit:'%'}]},{scales:{y:{min:0,max:100,ticks:{callback:v=>v+'%',color:'#9db0c8'}},x:{ticks:{color:'#9db0c8'}}}});
 const g=D.tables.gender;
 chart('genderGap','bar',{labels:g.map(x=>x.gender),datasets:[{label:'AUM 비중',data:g.map(x=>x.aum/D.summary.totalAum*100),backgroundColor:'#46d9ff',unit:'%'},{label:'보유자 비중',data:g.map(x=>x.holders/D.summary.totalHolders*100),backgroundColor:'#ffb15c',unit:'%'}]},{scales:{y:{ticks:{callback:v=>v+'%',color:'#9db0c8'}},x:{ticks:{color:'#9db0c8'}}}});
 heatAgeGender(); heatProductAge();
 byId('personaTable').innerHTML=table(['페르소나','상품','구분','AUM','보유자','1인당'],D.tables.topPersonaProduct.slice(0,16).map(r=>[`${r.age} ${r.gender}`,short(r.product),`<span class="pill ${r.manager==='KODEX'?'kodex':'tiger'}">${r.manager}</span>`,eok(r.aum),num(r.holders)+'명',man(r.avg)]));
}
function heatAgeGender(){
 const root=byId('ageGenderHeat'), rows=D.tables.ageGender, genders=['남','여'], max=Math.max(...rows.map(x=>x.aum));
 root.innerHTML='<div class="heat-row"><div class="heat-head">연령</div>'+genders.map(g=>`<div class="heat-head">${g}</div>`).join('')+'</div>'+ageOrder.map(a=>`<div class="heat-row"><div class="heat-label">${a}</div>`+genders.map(g=>{const r=rows.find(x=>x.age===a&&x.gender===g)||{aum:0,holders:0,avg:0};const alpha=.08+(r.aum/max)*.72;return `<div class="heat-cell" style="background:rgba(70,217,255,${alpha})"><b>${eok(r.aum)}</b><br><span>${num(r.holders)}명 · ${man(r.avg)}</span></div>`}).join('')+'</div>').join('');
}
function heatProductAge(){
 const root=byId('productAgeHeat'), rows=D.tables.productAge, products=D.tables.product.map(x=>x.product), max=Math.max(...rows.map(x=>x.shareInProduct));
 root.innerHTML='<div class="heat-row"><div class="heat-head">상품</div>'+ageOrder.map(a=>`<div class="heat-head">${a}</div>`).join('')+'</div>'+products.map(p=>`<div class="heat-row"><div class="heat-label">${short(p)}</div>`+ageOrder.map(a=>{const r=rows.find(x=>x.product===p&&x.age===a)||{aum:0,shareInProduct:0};const base=p.startsWith('KODEX')?'70,217,255':'255,177,92';const alpha=.08+(r.shareInProduct/max)*.72;return `<div class="heat-cell" style="background:rgba(${base},${alpha})"><b>${pct(r.shareInProduct)}</b><br><span>${eok(r.aum)}</span></div>`}).join('')+'</div>').join('');
}
function drawRegions(){
 const prov=D.tables.province;
 chart('provinceAum','bar',{labels:prov.map(x=>x.province),datasets:[{label:'AUM',data:prov.map(x=>x.aum/1e8),backgroundColor:'#46d9ff',unit:'억'}]},{indexAxis:'y',plugins:{legend:{display:false}},scales:{x:{ticks:{callback:v=>v+'억',color:'#9db0c8'}},y:{grid:{display:false},ticks:{color:'#9db0c8'}}}});
 const pm=D.tables.provinceManager, labels=prov.map(x=>x.province);
 chart('provinceManager','bar',{labels,datasets:['KODEX','TIGER'].map((m,i)=>({label:m,data:labels.map(l=>{const r=pm.find(x=>x.province===l&&x.manager===m);return r?r.aum/1e8:0}),backgroundColor:i===0?'#46d9ff':'#ffb15c',unit:'억'}))},{indexAxis:'y',scales:{x:{stacked:true,ticks:{callback:v=>v+'억',color:'#9db0c8'}},y:{stacked:true,grid:{display:false},ticks:{color:'#9db0c8'}}}});
 byId('provinceProfile').innerHTML=table(['광역','AUM','보유자','1인당','KODEX 점유','우세연령','여성 보유자','50대+ AUM'],D.tables.provinceProfile.map(r=>[r.province,eok(r.aum),num(r.holders)+'명',man(r.avg),pct(r.kodexShare),r.dominantAge,pct(r.femaleHolderShare),pct(r.seniorAumShare)]));
 const top=D.tables.cityTop20, labels2=top.map(x=>x.label), ctp=D.tables.cityTop20Product, products=D.tables.product.map(x=>x.product);
 chart('cityStack','bar',{labels:labels2,datasets:products.map(p=>({label:short(p),data:labels2.map(l=>{const r=ctp.find(x=>x.label===l&&x.product===p);return r?r.aum/1e8:0}),backgroundColor:productColors[p],unit:'억'}))},{indexAxis:'y',scales:{x:{stacked:true,ticks:{callback:v=>v+'억',color:'#9db0c8'}},y:{stacked:true,grid:{display:false},ticks:{color:'#9db0c8'}}}});
 const q=D.tables.quadrant.filter(x=>x.aum>0).sort((a,b)=>b.aum-a.aum).slice(0,130);
 chart('quadrant','bubble',{datasets:[{label:'시군구',data:q.map(x=>({x:x.holders,y:x.aum/1e8,r:Math.max(4,Math.min(24,x.avg/1400000)),label:x.label,quadrant:x.quadrant})),backgroundColor:'rgba(70,217,255,.38)',borderColor:'#46d9ff'}]},{plugins:{legend:{display:false}},scales:{x:{title:{display:true,text:'보유자 수',color:'#9db0c8'},ticks:{color:'#9db0c8'}},y:{title:{display:true,text:'보유평가액',color:'#9db0c8'},ticks:{callback:v=>v+'억',color:'#9db0c8'}}}});
}
function drawStrategy(){
 byId('strategyCards').innerHTML=D.tables.strategies.map((r,i)=>`<article class="strategy-card"><div class="tag">TARGET ${i+1}</div><h3>${r.title}</h3><small class="muted">${r.subtitle}</small><strong>${eok(r.metric)}</strong><p>${r.holders?num(r.holders)+'명 · ':''}${r.point}</p></article>`).join('');
 byId('incomeTable').innerHTML=smallCity(D.tables.incomeCity);
 byId('leverageTable').innerHTML=smallCity(D.tables.leverageCity);
 byId('femaleTable').innerHTML=smallCity(D.tables.femaleCity);
 byId('attackTable').innerHTML=table(['도시','KODEX 점유','KODEX','TIGER','전환기회 점수'],D.tables.cityAttack.slice(0,20).map(r=>[r.label,pct(r.kodexShare),eok(r.KODEX),eok(r.TIGER),eok(r.opportunityScore)]));
 byId('cohortTable').innerHTML=table(['세그먼트','AUM','보유자','1인당','KODEX 점유'],D.tables.cohort.map(r=>[r.segment,eok(r.aum),num(r.holders)+'명',man(r.avg),pct(r.kodexShare)]));
}
function smallCity(rows){return table(['지역','AUM','보유자','1인당'],rows.slice(0,12).map(r=>[r.label,eok(r.aum),num(r.holders)+'명',man(r.avg)]));}
function table(head,rows){return `<table><thead><tr>${head.map(h=>`<th>${h}</th>`).join('')}</tr></thead><tbody>${rows.map(r=>`<tr>${r.map(c=>`<td>${c}</td>`).join('')}</tr>`).join('')}</tbody></table>`;}
window.addEventListener('DOMContentLoaded',()=>{init();narrative();drawProducts();drawDemographics();drawRegions();drawStrategy();});
