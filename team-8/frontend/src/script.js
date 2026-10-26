let isLoggedIn = false;
let pendingProtectedView = "home";
const protectedViews = ['timetable','calendar','memo','contest'];
const viewLabels = {home:'홈',meal:'급식 메뉴',timetable:'주간 시간표',calendar:'학교 일정표',memo:'메모',contest:'대회 신청'};
const authPreviewCards = document.querySelectorAll('.auth-preview');
function refreshAuthPreview() { authPreviewCards.forEach(card => card.classList.toggle('is-locked', !isLoggedIn)); }
authPreviewCards.forEach(card => card.addEventListener('click', () => { if (!isLoggedIn) openLoginModal('home'); }));
refreshAuthPreview();
function openLoginModal(viewName) {
 pendingProtectedView = viewName;
 document.getElementById('loginOverlay').hidden = false;
 document.getElementById('loginPassword').value = '';
 document.getElementById('loginId').focus();
}
function closeLoginModal() {
 document.getElementById('loginOverlay').hidden = true;
}
const days = [
 {label:'월',date:'10.19',full:'10월 19일 월요일',menu:[['🍚','현미밥','곡류'],['🍲','소고기뭇국','국/탕'],['🍗','간장 닭볶음','메인 메뉴'],['🥗','시금치나물','채소'],['🥬','배추김치','김치'],['🍊','귤','후식']],kcal:785,carbs:105,protein:35,note:'새로운 한 주의 시작! 천천히 꼭꼭 씹어 먹어요.'},
 {label:'화',date:'10.20',full:'10월 20일 화요일',menu:[['🍚','흑미밥','곡류'],['🥣','된장찌개','국/탕'],['🐟','고등어구이','메인 메뉴'],['🥚','계란찜','반찬'],['🥬','깍두기','김치'],['🍎','사과','후식']],kcal:810,carbs:110,protein:34,note:'생선과 채소도 함께 먹으면 더 든든해요.'},
 {label:'수',date:'10.21',full:'10월 21일 수요일',menu:[['🍝','토마토 스파게티','면류'],['🍞','마늘빵','빵류'],['🍗','치킨너겟','메인 메뉴'],['🥗','그린 샐러드','채소'],['🥒','오이피클','반찬'],['🥛','우유','음료']],kcal:920,carbs:124,protein:37,note:'오늘은 색다른 메뉴! 채소도 곁들여 먹어요.'},
 {label:'목',date:'10.22',full:'10월 22일 목요일',menu:[['🍚','보리밥','곡류'],['🍲','육개장','국/탕'],['🥩','돈육불고기','메인 메뉴'],['🥦','브로콜리무침','채소'],['🥬','배추김치','김치'],['🍌','바나나','후식']],kcal:860,carbs:116,protein:39,note:'든든하게 먹고 오후 수업도 힘내 봐요.'},
 {label:'금',date:'10.23',full:'10월 23일 금요일',menu:[['🍛','카레라이스','일품요리'],['🍤','새우튀김','메인 메뉴'],['🥗','양배추 샐러드','채소'],['🥣','미소장국','국/탕'],['🥬','깍두기','김치'],['🍮','푸딩','후식']],kcal:895,carbs:128,protein:29,note:'한 주 동안 수고했어요. 즐거운 주말 보내세요!'},
 {label:'토',date:'10.24',full:'10월 24일 토요일',meals:{'조식':{menu:[['🍚','잡곡밥','곡류'],['🍲','콩나물국','국/탕'],['🍖','돼지갈비찜','메인 메뉴'],['🥕','잡채','반찬'],['🥬','배추김치','김치'],['🍇','포도','후식']],kcal:842,carbs:118,protein:32}},note:'토요일은 조식만 제공됩니다.'},
 {label:'일',date:'10.25',full:'10월 25일 일요일',meals:{},note:'일요일은 급식이 제공되지 않습니다.'}
];
const nav = document.getElementById('dayNav');
const list = document.getElementById('menuList');
const homeMealData = [
 {date:'10월 26일 월요일',meals:[{title:'조식',items:['찰보리밥','황태뭇국','과일샐러드','두부조림']},{title:'중식',items:['쌀밥(도정)','열무국수','오이토마토무침','알배추겉절이']},{title:'석식',items:['잡곡밥','계란탕','대파채무침','큐브스테이크']}]},
 {date:'10월 27일 화요일',meals:[{title:'조식',items:['현미밥','소고기뭇국','계란찜','배추김치']},{title:'중식',items:['흑미밥','된장찌개','고등어구이','사과']},{title:'석식',items:['카레라이스','새우튀김','양배추샐러드','깍두기']}]},
 {date:'10월 28일 수요일',meals:[{title:'조식',items:['잡곡밥','콩나물국','잡채','포도']},{title:'중식',items:['토마토스파게티','마늘빵','치킨너겟','그린샐러드']},{title:'석식',items:['보리밥','육개장','돈육불고기','바나나']}]}
];
let homeMealIndex = 0;
function renderHomeMeals(index) {
 homeMealIndex = (index + homeMealData.length) % homeMealData.length;
 const day = homeMealData[homeMealIndex];
 document.getElementById('homeMealDate').textContent = day.date + ' · 예시';
 document.getElementById('homeMealCards').innerHTML = day.meals.map(meal => '<article class="home-meal-card"><h3>' + meal.title + '</h3><ul>' + meal.items.map(item => '<li>' + item + '</li>').join('') + '</ul><span class="meal-status">예시 식단</span></article>').join('');
}
renderHomeMeals(0);
document.getElementById('homeMealPrev').addEventListener('click', () => renderHomeMeals(homeMealIndex - 1));
document.getElementById('homeMealNext').addEventListener('click', () => renderHomeMeals(homeMealIndex + 1));
const events = [{date:'10.27',title:'교내 프로젝트 아이디어 발표',detail:'프로젝트 아이디어를 정리하고 발표 자료를 준비하세요.',tag:'학교 행사'},{date:'10.30',title:'대회 참가 신청 마감 (예시)',detail:'참가 희망자는 신청 정보를 확인하세요.',tag:'신청 마감'},{date:'11.05',title:'동아리 활동 발표회 (예시)',detail:'동아리별 활동 결과를 공유하는 일정입니다.',tag:'학교 행사'}];
function eventMarkup(e){return `<div class="data-item"><div class="data-date">${e.date}</div><div><strong>${e.title}</strong><small>${e.detail}</small><br><span class="pill">${e.tag}</span></div></div>`}
document.getElementById('homeEvents').innerHTML=events.slice(0,2).map(eventMarkup).join('');
document.getElementById('calendarEvents').innerHTML=events.map(eventMarkup).join('');
const timetable=[['1교시','프로그래밍','수학','영어','정보 과학','국어'],['2교시','프로그래밍','국어','수학','프로그래밍','영어'],['3교시','수학','정보 과학','체육','영어','프로그래밍'],['4교시','영어','프로그래밍','국어','수학','창체'],['5교시','국어','체육','프로그래밍','진로','수학'],['6교시','정보 과학','사회','동아리','프로그래밍','자율 학습']];
document.getElementById('timetableBody').innerHTML=timetable.map(row=>`<tr>${row.map((cell,i)=>`<td style="padding:14px 9px;border-bottom:1px solid light-dark(#e6eee8,#34463b);${i===0?'font-weight:800':''}">${cell}</td>`).join('')}</tr>`).join('');
function showView(name){
 if(protectedViews.includes(name) && !isLoggedIn) {
  document.querySelectorAll('.top-link').forEach(b=>b.classList.toggle('active',b.dataset.view==='meal'));
  openLoginModal(name);
  return false;
 }
 document.querySelectorAll('.portal-view').forEach(v=>v.hidden=v.id!==('view-'+name));
 document.querySelectorAll('.portal-tab').forEach(b=>b.classList.toggle('active',b.dataset.view===name));
 document.querySelectorAll('.top-link').forEach(b=>b.classList.toggle('active',b.dataset.view===name));
 document.getElementById('selectedDate').textContent=viewLabels[name]||'학교생활 포털';
 return true;
}
document.querySelectorAll('.portal-tab').forEach(b=>b.addEventListener('click',()=>showView(b.dataset.view)));
document.querySelectorAll('.quick-link').forEach(b=>b.addEventListener('click',()=>showView(b.dataset.go)));
document.querySelectorAll('.top-link').forEach(b => b.addEventListener('click', () => showView(b.dataset.view)));
document.querySelectorAll('[data-go]').forEach(b => b.addEventListener('click', () => {
 const name = b.dataset.go;
 if (!showView(name)) return;
 document.querySelectorAll('.top-link').forEach(x => x.classList.toggle('active', x.dataset.view === name));
 const labels = {home:'홈',meal:'급식',timetable:'시간표',calendar:'일정표',memo:'메모',contest:'대회 신청'};
 document.getElementById('selectedDate').textContent = labels[name] || '학교생활 포털';
}));
document.getElementById('themeToggle').addEventListener('click', () => {
 const dark = document.documentElement.style.colorScheme === 'dark';
 document.documentElement.style.colorScheme = dark ? 'light' : 'dark';
 document.getElementById('themeToggle').textContent = dark ? '☾' : '☀';
});
document.getElementById('loginButton').addEventListener('click', () => {
 if (isLoggedIn) {
  isLoggedIn = false;
  document.getElementById('loginButton').textContent = '로그인';
  refreshAuthPreview();
  showView('meal');
 } else {
  openLoginModal('home');
 }
});
document.getElementById('closeLoginModal').addEventListener('click', closeLoginModal);
document.getElementById('loginOverlay').addEventListener('click', e => {
 if (e.target.id === 'loginOverlay') closeLoginModal();
});
document.addEventListener('keydown', e => {
 if (e.key === 'Escape') closeLoginModal();
});
document.getElementById('loginForm').addEventListener('submit', e => {
 e.preventDefault();
 const user = document.getElementById('loginId').value.trim();
 const password = document.getElementById('loginPassword').value;
 if (!user || !password) return;
 isLoggedIn = true;
 document.getElementById('loginButton').textContent = '로그아웃';
 refreshAuthPreview();
 closeLoginModal();
 showView(pendingProtectedView);
});
document.getElementById('studentCafeLink').addEventListener('click', e => { e.preventDefault(); alert('실제 학생자치정부 카페 주소가 연결되지 않은 시안입니다.'); });
document.getElementById('dismissDashboardBanner').addEventListener('click', () => document.getElementById('dashboardUpdateBanner').remove());
document.getElementById('memoForm').addEventListener('submit', e => {
 e.preventDefault();
 const titleText = document.getElementById('memoTitle').value.trim();
 const contentText = document.getElementById('memoContent').value.trim();
 if (!titleText || !contentText) return;
 const container = document.getElementById('memoList');
 if (container.querySelector('.empty-state')) container.innerHTML = '';
 const item = document.createElement('div');
 item.className = 'data-item';
 const date = document.createElement('div');
 date.className = 'data-date';
 date.textContent = '방금';
 const body = document.createElement('div');
 const title = document.createElement('strong');
 title.textContent = titleText;
 const content = document.createElement('small');
 content.textContent = contentText;
 body.append(title, content);
 item.append(date, body);
 container.prepend(item);
 document.getElementById('recentMemoTitle').textContent = titleText;
 document.getElementById('recentMemoText').textContent = contentText;
 e.target.reset();
});
document.getElementById('contestForm').addEventListener('submit',e=>{e.preventDefault();const name=document.getElementById('contestName').value;const student=document.getElementById('studentName').value.trim();const cls=document.getElementById('studentClass').value.trim();const reason=document.getElementById('contestReason').value.trim();const item=document.createElement('div');item.className='data-item';const date=document.createElement('div');date.className='data-date';date.textContent='등록';const body=document.createElement('div');const title=document.createElement('strong');title.textContent=name;const desc=document.createElement('small');desc.textContent=`${student} · ${cls}${reason?' · '+reason:''}`;const tag=document.createElement('span');tag.className='pill';tag.textContent='브라우저 데모 등록';body.append(title,desc,document.createElement('br'),tag);item.append(date,body);const container=document.getElementById('applicationList');if(container.querySelector('.empty-state'))container.innerHTML='';container.prepend(item);document.getElementById('applicationCount').textContent=`${container.querySelectorAll('.data-item').length}건`;e.target.reset();});
function render(index,mealType='중식'){
 const d=days[index];
 const availableMeals=d.label==='토'?['조식']:d.label==='일'?[]:['조식','중식','석식'];
 if(availableMeals.length && !availableMeals.includes(mealType)) mealType=availableMeals[0];
 document.querySelectorAll('.day-btn').forEach((b,i)=>{b.classList.toggle('active',i===index);b.setAttribute('aria-pressed',i===index?'true':'false')});
 document.getElementById('selectedDate').textContent=d.full;
 const meal=availableMeals.length?(d.meals?d.meals[mealType]:{menu:d.menu,kcal:d.kcal,carbs:d.carbs,protein:d.protein}):null;
 document.getElementById('mealTitle').textContent=d.label==='일'?'오늘은 급식이 없습니다':`${d.label==='토'?'토요일':d.label+'요일'} ${mealType}`;
 document.getElementById('mealType').textContent=d.label==='일'?'일요일 · 급식 없음':d.label==='토'?'토요일 · 조식만 제공':`${mealType} · 예시 식단`;
 document.getElementById('calories').innerHTML=meal?`${meal.kcal} <span>kcal</span>`:'- <span>kcal</span>';
 document.getElementById('carbs').innerHTML=meal?`${meal.carbs} <span>g</span>`:'- <span>g</span>';
 document.getElementById('protein').innerHTML=meal?`${meal.protein} <span>g</span>`:'- <span>g</span>';
 document.getElementById('dailyNote').textContent=d.note;
 document.querySelector('.meal-label').textContent=meal?'🍴 '+mealType.toUpperCase()+' MENU':'📅 오늘은 급식이 없어요';
 list.innerHTML='';
 if(meal){meal.menu.forEach(item=>{const el=document.createElement('div');el.className='menu-item';el.innerHTML=`<div class="food-icon" aria-hidden="true">${item[0]}</div><div><strong>${item[1]}</strong><small>${item[2]}</small></div>`;list.appendChild(el)})}
 else {list.innerHTML='<div class="empty-state" style="grid-column:1/-1">일요일은 급식이 제공되지 않습니다.</div>'}
 let mealNav=document.getElementById('mealTypeNav');
 if(!mealNav){mealNav=document.createElement('div');mealNav.id='mealTypeNav';mealNav.className='week-nav';document.querySelector('#view-meal .section-head').appendChild(mealNav)}
 mealNav.innerHTML='';
 availableMeals.forEach(type=>{const b=document.createElement('button');b.type='button';b.className='day-btn'+(type===mealType?' active':'');b.textContent=type;b.addEventListener('click',()=>render(index,type));mealNav.appendChild(b)});
}
days.forEach((d,i)=>{const b=document.createElement('button');b.className='day-btn';b.innerHTML=`${d.label} <span style="opacity:.7">${d.date}</span>`;b.type='button';b.addEventListener('click',()=>render(i));nav.appendChild(b)});
render(5);
