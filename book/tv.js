/* Книга «Случай»: теория вероятностей по Гмурману */
(() => {
const {h, fr} = U;
const add = L => BOOKS.tv.lessons.push(L);
const R = (n,d) => U.fmt(n,d);

/* 1. Классическое определение */
add({
  id:'tv1', title:'Классическое определение вероятности', src:'Гмурман, гл. 1 §1',
  theory:`<p><b>Испытание</b> даёт элементарные исходы. Если они образуют полную группу, несовместны и <b>равновозможны</b>, вероятность события A равна доле благоприятных исходов:</p>
  <div class="f">P(A) = ${fr('m','n')}<small>m — число исходов, благоприятствующих A; n — число всех элементарных исходов. 0 ≤ P(A) ≤ 1.</small></div>
  <p><b>Относительная частота</b> W(A) = m/n, где m — число опытов, в которых A появилось, из n проведённых. При большом n частота устойчиво колеблется около P(A): это <b>статистическое определение</b>.</p>
  <h3>Комбинаторика для подсчёта m и n</h3>
  <div class="f">P<sub>n</sub> = n! &nbsp;&nbsp; A<sub>n</sub><sup>m</sup> = ${fr('n!','(n − m)!')} &nbsp;&nbsp; C<sub>n</sub><sup>m</sup> = ${fr('n!','m!(n − m)!')}<small>перестановки · размещения (порядок важен) · сочетания (порядок не важен)</small></div>`,
  predict:{q:'Бросают две игральные кости. Что выпадает чаще?', opts:['Сумма 7','Сумма 8','Одинаково часто'], a:0,
    why:'Сумме 7 благоприятствуют 6 исходов из 36: (1,6), (2,5), (3,4), (4,3), (5,2), (6,1). Сумме 8 — только 5. Значит P = 6/36 против 5/36.'},
  flap:`<p><b>Задача 1 (Гмурман).</b> Сумма очков чётная, и хотя бы на одной кости шестёрка. Всего исходов 6·6 = 36. Благоприятные: (6,2), (6,4), (6,6), (2,6), (4,6) — пять. P = 5/36.</p>
  <p><b>Задача 4: где ошибка?</b> «Исходов два: сумма равна 3 или нет, значит P = 1/2». Ошибка в том, что эти исходы не равновозможны. Правильно: (1,2) и (2,1), P = 2/36 = 1/18.</p>`,
  figCap:'Таблица 6×6 — все исходы броска двух костей. Заштрихованы благоприятные. Справа внизу — как частота подбирается к вероятности.',
  try:'Выбери событие и брось кости 1000 раз: линия частоты прижмётся к пунктиру вероятности.',
  ch:{q:'Брошены две кости. Найдите вероятность того, что сумма очков равна 8, если известно, что их разность равна 4 (Гмурман, №5в). Ответ — дробью или десятичной.',
    check:s=>U.near(s,0.5,0.005), ans:'1/2',
    hint:'Выбери на рисунке «Разность = 4»: таких исходов 4. Из них у скольких сумма 8? Теперь n — это четыре исхода, а не 36.'},
  fig(el){
    const ev = [
      ['Сумма = 7',(a,b)=>a+b===7],['Сумма = 8',(a,b)=>a+b===8],
      ['Шестёрка и чётная сумма (№1)',(a,b)=>(a===6||b===6)&&(a+b)%2===0],
      ['Сумма = 3 (№4)',(a,b)=>a+b===3],['Разность = 4',(a,b)=>Math.abs(a-b)===4],
      ['Сумма 8 и разность 4 (№5б)',(a,b)=>a+b===8&&Math.abs(a-b)===4]];
    let e = 0, trials = 0, hits = 0, path = [], last = null;
    const sel = U.select('tv1-ev', ev.map(x=>x[0]), v=>{e=v; trials=0; hits=0; path=[]; last=null; draw();});
    const roll = k => { const f = ev[e][1]; for (let i=0;i<k;i++){ const a=1+Math.floor(Math.random()*6), b=1+Math.floor(Math.random()*6); trials++; if (f(a,b)) hits++; last=[a,b]; if (trials<=3000) path.push(hits/trials); } draw(); };
    el.append(h('div',{class:'row'}, h('label',{class:'sr',for:'tv1-ev'},'Событие'), sel, U.btn('Бросить 1 раз',()=>roll(1)), U.btn('×100',()=>roll(100)), U.btn('×1000',()=>roll(1000))));
    const cv = U.canvas(el, w => w<420 ? 1.25 : .78);
    const out = h('div',{class:'readout'}); el.append(out);
    function draw(){
      const {g,W,H} = cv.fit(), c = U.col(), f = ev[e][1];
      const narrow = W<420, side = narrow ? W-40 : Math.min(H-40, W*.52), cell = side/6, ox = 28, oy = 24;
      const pat = U.hatch(g, c.pen, 5); let m = 0;
      U.text(g,'вторая кость →',ox,14,{size:11,color:c.soft});
      for (let a=1;a<=6;a++) for (let b=1;b<=6;b++){
        const x = ox+(b-1)*cell, y = oy+(a-1)*cell, ok = f(a,b); if (ok) m++;
        if (ok){ g.fillStyle = pat; g.fillRect(x,y,cell,cell); }
        g.strokeStyle = c.ink; g.lineWidth = 1; g.strokeRect(x,y,cell,cell);
        U.text(g, `${a},${b}`, x+cell/2, y+cell/2+4, {size:Math.max(10,cell/4.2), align:'center', color: ok?c.ink:c.soft, w: ok?600:400});
        if (last && last[0]===a && last[1]===b){ g.save(); g.shadowColor=c.glow; g.shadowBlur=12; g.strokeStyle=c.glow; g.lineWidth=3; g.strokeRect(x+3,y+3,cell-6,cell-6); g.restore(); }
      }
      for (let a=1;a<=6;a++) U.text(g, a, ox-12, oy+(a-.5)*cell+4, {size:11,color:c.soft,align:'center'});
      // график частоты
      const P = m/36, gx = narrow ? 28 : ox+side+34, gy = narrow ? oy+side+30 : oy, gw = narrow ? W-48 : W-gx-12, gh = narrow ? H-gy-20 : side-20;
      U.text(g,'W(A) — частота',gx,gy-8,{size:11,color:c.soft});
      U.axes(g,gx,gy+gh,gx+gw,gy,c);
      const yv = v => gy+gh - v/Math.max(.35,P*2)*gh;
      g.setLineDash([5,4]); g.strokeStyle=c.stamp; g.beginPath(); g.moveTo(gx,yv(P)); g.lineTo(gx+gw,yv(P)); g.stroke(); g.setLineDash([]);
      U.text(g,'P = '+R(P,3),gx+gw-4,yv(P)-6,{size:12,align:'right',color:c.stamp,kind:'mono'});
      if (path.length>1){ g.strokeStyle=c.pen; g.lineWidth=1.6; g.beginPath(); path.forEach((v,i)=>{ const x=gx+i/(path.length-1)*gw, y=Math.max(gy,yv(v)); i?g.lineTo(x,y):g.moveTo(x,y); }); g.stroke(); }
      U.text(g, 'n = '+trials, gx+gw, gy+gh+14, {size:11,align:'right',color:c.soft,kind:'mono'});
      out.innerHTML = `m = <b>${m}</b>, n = 36 → P(A) = ${m}/36 = <b>${R(P,4)}</b><br>Бросков: ${trials}, событие наступило ${hits} раз → W(A) = <span class="hot">${trials?R(hits/trials,4):'—'}</span>`;
    }
    return draw;
  }
});

/* 2. Геометрическая вероятность */
add({
  id:'tv2', title:'Геометрические вероятности', src:'Гмурман, гл. 1 §2',
  theory:`<p>Когда исходов бесконечно много (точка на отрезке, в фигуре, в теле), вероятность считают через <b>меру</b>: длину, площадь или объём.</p>
  <div class="f">P = ${fr('mes g','mes G')}<small>g — часть области G, попадание в которую благоприятствует событию. Точка «бросается наудачу»: вероятность попасть в g пропорциональна её мере и не зависит от формы и положения.</small></div>
  <h3>Задача о встрече</h3>
  <p>Двое приходят в промежутке [0; T] независимо и наудачу; каждый ждёт другого t минут. Время прихода — точка (x, y) в квадрате T×T. Встреча состоится, если |x − y| ≤ t, то есть точка попала в полосу вдоль диагонали.</p>
  <div class="f">P = ${fr('T² − (T − t)²','T²')} = 1 − (1 − t/T)²</div>`,
  predict:{q:'Двое договорились встретиться между 12 и 13 часами; каждый ждёт 20 минут, потом уходит. Каков шанс встретиться?', opts:['1/3','5/9','2/3'], a:1,
    why:'Вне полосы остаются два угловых треугольника, вместе это квадрат 40×40. P = 1 − (40/60)² = 1 − 4/9 = 5/9 ≈ 0,556.'},
  flap:`<p>Площадь квадрата 60² = 3600. Встрече не благоприятствуют точки, где |x − y| > 20 — это два треугольника с катетами 40, их общая площадь 40² = 1600.</p>
  <p>P = (3600 − 1600)/3600 = 2000/3600 = <b>5/9</b>.</p>
  <p>Метод Монте-Карло на рисунке «бросает» точки в квадрат и проверяет ту же формулу опытом.</p>`,
  figCap:'Квадрат времён прихода. Полоса |x − y| ≤ t — встреча. Точки — случайные пары моментов прихода.',
  try:'Меняй время ожидания t и бросай точки: доля попавших в полосу стремится к формуле.',
  ch:{q:'Те же условия, но каждый ждёт только 15 минут. Найдите вероятность встречи.', check:s=>U.near(s,7/16,0.002), ans:'7/16 = 0,4375',
    hint:'1 − (1 − 15/60)² = 1 − (3/4)².'},
  fig(el){
    let t = 20, pts = [];
    const sl = U.slider('tv2-t','ждут t, мин',0,60,1,t,v=>v+'',v=>{t=v; draw();});
    el.append(h('div',{class:'ctls'}, sl), h('div',{class:'row'}, U.btn('Бросить 200 точек',()=>{ for(let i=0;i<200;i++) pts.push([Math.random()*60,Math.random()*60]); draw(); }), U.btn('Стереть точки',()=>{pts=[]; draw();})));
    const cv = U.canvas(el, w => w<420 ? 1 : .72);
    const out = h('div',{class:'readout'}); el.append(out);
    function draw(){
      const {g,W,H} = cv.fit(), c = U.col();
      const s = Math.min(W-60, H-50), ox = 40, oy = 10, k = s/60;
      const X = x => ox+x*k, Y = y => oy+s-y*k;
      g.fillStyle = U.hatch(g,c.pen,6);
      g.beginPath(); g.moveTo(X(0),Y(0)); g.lineTo(X(t),Y(0)); g.lineTo(X(60),Y(60-t)); g.lineTo(X(60),Y(60)); g.lineTo(X(60-t),Y(60)); g.lineTo(X(0),Y(t)); g.closePath(); g.fill();
      g.strokeStyle = c.pen; g.lineWidth=1.5; g.stroke();
      g.strokeStyle = c.ink; g.lineWidth = 1.6; g.strokeRect(X(0),Y(60),s,s);
      g.setLineDash([3,4]); g.strokeStyle=c.soft; g.beginPath(); g.moveTo(X(0),Y(0)); g.lineTo(X(60),Y(60)); g.stroke(); g.setLineDash([]);
      for (const v of [0,20,40,60]){ U.text(g,v===60?'13:00':'12:'+String(v).padStart(2,'0'),X(v),Y(0)+16,{size:10,align:'center',color:c.soft,kind:'mono'}); U.text(g,v,X(0)-8,Y(v)+4,{size:10,align:'right',color:c.soft,kind:'mono'}); }
      U.text(g,'x — приход первого',X(60),Y(0)+30,{size:11,align:'right',color:c.soft});
      let inn = 0;
      for (const [x,y] of pts){ const ok = Math.abs(x-y)<=t; if (ok) inn++; g.fillStyle = ok ? c.glow : c.soft; g.beginPath(); g.arc(X(x),Y(y),ok?2.6:2,0,7); g.fill(); }
      if (W>480){ const lx = ox+s+16; U.text(g,'|x − y| ≤ t',lx,Y(55),{size:22,kind:'hand',color:c.pen,w:700}); U.text(g,'встреча',lx,Y(50),{size:20,kind:'hand',color:c.pen}); }
      const P = 1-Math.pow(1-t/60,2);
      out.innerHTML = `P = 1 − (1 − ${t}/60)² = <b>${R(P,4)}</b><br>Точек: ${pts.length}, в полосе ${inn} → частота <span class="hot">${pts.length?R(inn/pts.length,4):'—'}</span>`;
    }
    return draw;
  }
});

/* 3. Сложение и умножение, хотя бы одно */
add({
  id:'tv3', title:'Сложение и умножение. Хотя бы одно событие', src:'Гмурман, гл. 2 §1–2',
  theory:`<div class="f">P(A + B) = P(A) + P(B) − P(AB)<small>для несовместных событий P(AB) = 0</small></div>
  <div class="f">P(AB) = P(A)·P<sub>A</sub>(B)<small>для независимых событий P(AB) = P(A)·P(B); P<sub>A</sub>(B) — условная вероятность B при условии, что A наступило</small></div>
  <p><b>Противоположное событие:</b> P(Ā) = 1 − P(A) = q.</p>
  <p><b>Хотя бы одно</b> из n независимых событий — это противоположность событию «ни одно не наступило»:</p>
  <div class="f">P(A) = 1 − q<sub>1</sub>q<sub>2</sub>…q<sub>n</sub>, &nbsp; при равных p: &nbsp; P(A) = 1 − qⁿ</div>
  <p>Сколько нужно испытаний, чтобы P(A) ≥ γ? Из 1 − qⁿ ≥ γ получаем <b>n ≥ ln(1 − γ) / ln q</b>.</p>`,
  predict:{q:'Три стрелка стреляют по разу, каждый попадает с вероятностью 0,5. Какова вероятность хотя бы одного попадания?', opts:['0,5','0,875','1,5, то есть наверняка'], a:1,
    why:'Вероятности нельзя просто сложить: события совместны. Все промахнутся с вероятностью 0,5³ = 0,125, значит хотя бы одно попадание: 1 − 0,125 = 0,875.'},
  flap:`<p><b>Ровно одно попадание</b> из трёх: P = p₁q₂q₃ + q₁p₂q₃ + q₁q₂p₃ — сумма несовместных вариантов, каждый из которых — произведение независимых событий.</p>
  <p><b>Все три</b>: p₁p₂p₃. <b>Ни одного</b>: q₁q₂q₃. Сумма P(0) + P(1) + P(2) + P(3) = 1 — хорошая проверка.</p>`,
  figCap:'Сверху — три стрелка и распределение числа попаданий. Снизу — как растёт 1 − qⁿ с числом выстрелов n.',
  try:'Поставь p = 0,3 и γ = 0,9: найди на нижнем графике первый столбик выше линии γ.',
  ch:{q:'Вероятность попадания при одном выстреле 0,3. Сколько нужно сделать выстрелов, чтобы с вероятностью не менее 0,9 попасть хотя бы один раз?', check:s=>U.near(s,7,0), ans:'7',
    hint:'n ≥ ln(0,1)/ln(0,7) ≈ 6,46. Число выстрелов — целое, округляем вверх.'},
  fig(el){
    const p = [.8,.7,.9]; let pn = .3, gam = .9;
    const ss = p.map((v,i)=>U.slider('tv3-p'+i,`p${i+1}`,0,1,.05,v,x=>R(x,2),x=>{p[i]=x; draw();}));
    const s2 = U.slider('tv3-pn','p',0.05,.9,.05,pn,x=>R(x,2),x=>{pn=x; draw();});
    const s3 = U.slider('tv3-g','γ',.5,.99,.01,gam,x=>R(x,2),x=>{gam=x; draw();});
    el.append(h('div',{class:'ctls'}, ...ss));
    const cv = U.canvas(el, .42);
    el.append(h('div',{class:'ctls'}, s2, s3));
    const cv2 = U.canvas(el, .4);
    const out = h('div',{class:'readout'}); el.append(out);
    function draw(){
      let {g,W,H} = cv.fit(); const c = U.col();
      const q = p.map(x=>1-x);
      const P = [q[0]*q[1]*q[2], p[0]*q[1]*q[2]+q[0]*p[1]*q[2]+q[0]*q[1]*p[2], p[0]*p[1]*q[2]+p[0]*q[1]*p[2]+q[0]*p[1]*p[2], p[0]*p[1]*p[2]];
      // мишени
      const tw = Math.min(W*.42, 230);
      for (let i=0;i<3;i++){ const cx = 24+i*(tw/3)+tw/6-10, cy = H/2-6, r = Math.min(tw/7, H/4);
        for (let k=3;k>0;k--){ g.beginPath(); g.arc(cx,cy,r*k/3,0,7); g.strokeStyle=c.ink; g.lineWidth=1.2; g.stroke(); }
        g.save(); g.globalAlpha = .25+.75*p[i]; g.fillStyle=c.glow; g.beginPath(); g.arc(cx,cy,r/3*p[i]+2,0,7); g.fill(); g.restore();
        U.text(g,'p='+R(p[i],2),cx,cy+r+16,{size:11,align:'center',kind:'mono',color:c.soft}); }
      const bx = 24+tw+20, bw = W-bx-10, by = 18, bh = H-48;
      U.axes(g,bx,by+bh,bx+bw,by,c);
      const cw = bw/4;
      P.forEach((v,k)=>{ const hh = v*bh; g.fillStyle = k>0 ? U.hatch(g,c.pen,5) : c.swash; g.fillRect(bx+k*cw+8,by+bh-hh,cw-16,hh); g.strokeStyle=c.ink; g.strokeRect(bx+k*cw+8,by+bh-hh,cw-16,hh);
        U.text(g,R(v,3),bx+k*cw+cw/2,by+bh-hh-4,{size:11,align:'center',kind:'mono'}); U.text(g,k+'',bx+k*cw+cw/2,by+bh+14,{size:11,align:'center',color:c.soft}); });
      U.text(g,'число попаданий',bx+bw,by+bh+28,{size:11,align:'right',color:c.soft});
      // кривая 1-q^n
      ({g,W,H} = cv2.fit());
      const ax = 34, ay = 10, aw = W-ax-10, ah = H-34, N = 20; U.axes(g,ax,ay+ah,ax+aw,ay,c);
      const yv = v => ay+ah-v*ah; let nmin = Math.ceil(Math.log(1-gam)/Math.log(1-pn));
      for (let n=1;n<=N;n++){ const v = 1-Math.pow(1-pn,n), x = ax+(n-.5)/N*aw, w = aw/N*.6;
        g.fillStyle = n===nmin ? c.glow : (v>=gam ? c.wash : c.paper2); g.fillRect(x-w/2,yv(v),w,ay+ah-yv(v)); g.strokeStyle = c.ink; g.lineWidth=1; g.strokeRect(x-w/2,yv(v),w,ay+ah-yv(v));
        if (n%2===1 || N<12) U.text(g,n,x,ay+ah+13,{size:10,align:'center',color:c.soft,kind:'mono'}); }
      g.setLineDash([5,4]); g.strokeStyle=c.stamp; g.beginPath(); g.moveTo(ax,yv(gam)); g.lineTo(ax+aw,yv(gam)); g.stroke(); g.setLineDash([]);
      U.text(g,'γ',ax-8,yv(gam)+4,{size:12,align:'right',color:c.stamp}); U.text(g,'n',ax+aw,ay+ah+26,{size:11,align:'right',color:c.soft});
      out.innerHTML = `Хотя бы одно: 1 − ${R(q[0],2)}·${R(q[1],2)}·${R(q[2],2)} = <b>${R(1-P[0],4)}</b> · ровно одно: ${R(P[1],4)} · все: ${R(P[3],4)}<br>При p = ${R(pn,2)}: n ≥ ln(${R(1-gam,2)}) / ln(${R(1-pn,2)}) = ${R(Math.log(1-gam)/Math.log(1-pn),2)} → <span class="hot">n = ${nmin}</span>`;
    }
    return draw;
  }
});

/* 4. Полная вероятность и Бейес */
add({
  id:'tv4', title:'Формула полной вероятности и формула Бейеса', src:'Гмурман, гл. 2 §3–4',
  theory:`<p>Событие A может наступить вместе с одной из <b>гипотез</b> B₁, …, Bₙ, образующих полную группу несовместных событий. Тогда</p>
  <div class="f">P(A) = Σ P(B<sub>i</sub>)·P<sub>B<sub>i</sub></sub>(A)<small>формула полной вероятности: «взвешенное среднее» условных вероятностей</small></div>
  <p>Если опыт уже произведён и A <b>наступило</b>, вероятности гипотез переоцениваются:</p>
  <div class="f">P<sub>A</sub>(B<sub>i</sub>) = ${fr('P(B<sub>i</sub>)·P<sub>B<sub>i</sub></sub>(A)','P(A)')}<small>формула Бейеса: до опыта — P(Bᵢ), после опыта — P<sub>A</sub>(Bᵢ)</small></div>
  <p>Порядок решения: 1) назвать гипотезы, 2) найти P(Bᵢ) и проверить, что их сумма равна 1, 3) найти P<sub>Bᵢ</sub>(A), 4) подставить.</p>`,
  predict:{q:'Завод A выпускает 70% деталей, брака у него 1%. Завод B — 30% деталей и 5% брака. Наудачу взятая деталь оказалась бракованной. Откуда она вероятнее?', opts:['С завода A: он делает больше деталей','С завода B','Шансы равны'], a:1,
    why:'Доля «брак и с A» = 0,7·0,01 = 0,007, «брак и с B» = 0,3·0,05 = 0,015. P(A-брак) = 0,022, и по Бейесу P(B | брак) = 0,015/0,022 ≈ 0,68.'},
  flap:`<p><b>Пример из Гмурмана.</b> В пирамиде 10 винтовок, 4 из них с оптическим прицелом. С оптикой стрелок попадает с вероятностью 0,95, без неё — 0,8. Гипотезы: B₁ — взята винтовка с оптикой, P = 0,4; B₂ — без оптики, P = 0,6.</p>
  <p>P(попадание) = 0,4·0,95 + 0,6·0,8 = 0,38 + 0,48 = <b>0,86</b>.</p>
  <p>Если стрелок попал, то P(винтовка была с оптикой) = 0,38/0,86 ≈ 0,44 — чуть больше, чем 0,4 до выстрела.</p>`,
  figCap:'Дерево гипотез: ветви — доли продукции заводов, листья — доля брака. Столбики внизу: вероятности гипотез до и после того, как деталь оказалась бракованной.',
  try:'Подними брак третьего завода до 10%: посмотри, как он «перетягивает» вероятность после опыта.',
  ch:{q:'В пирамиде 10 винтовок, 4 с оптическим прицелом. Вероятность попадания с прицелом 0,95, без него 0,8. Стрелок берёт винтовку наудачу. Найдите вероятность попадания.', check:s=>U.near(s,0.86,0.002), ans:'0,86',
    hint:'Гипотезы: с прицелом (0,4) и без (0,6). P = 0,4·0,95 + 0,6·0,8.'},
  fig(el){
    const w = [50,30,20], d = [2,3,5];
    const sw = w.map((v,i)=>U.slider('tv4-w'+i,`доля ${i+1}, %`,0,100,1,v,x=>x,x=>{w[i]=x; draw();}));
    const sd = d.map((v,i)=>U.slider('tv4-d'+i,`брак ${i+1}, %`,0,15,.5,v,x=>R(x,1),x=>{d[i]=x; draw();}));
    el.append(h('div',{class:'ctls'}, sw[0],sd[0],sw[1],sd[1],sw[2],sd[2]));
    const cv = U.canvas(el, w => w<420 ? .95 : .62);
    const out = h('div',{class:'readout'}); el.append(out);
    function draw(){
      const {g,W,H} = cv.fit(), c = U.col();
      const sum = w.reduce((a,b)=>a+b,0)||1, pb = w.map(x=>x/sum), pa = d.map(x=>x/100);
      const joint = pb.map((v,i)=>v*pa[i]), PA = joint.reduce((a,b)=>a+b,0), post = joint.map(v=>PA?v/PA:0);
      const top = H*.56, rx = 30, ry = top/2;
      g.beginPath(); g.arc(rx,ry,6,0,7); g.fillStyle=c.ink; g.fill();
      for (let i=0;i<3;i++){
        const hx = W*.42, hy = 20+i*(top-40)/2, lx = W-70, ly = hy;
        g.strokeStyle = c.ink; g.lineWidth = 1+pb[i]*5; g.beginPath(); g.moveTo(rx,ry); g.bezierCurveTo(rx+60,ry,hx-60,hy,hx,hy); g.stroke();
        U.text(g,R(pb[i],2),(rx+hx)/2,(ry+hy)/2-6,{size:12,kind:'mono',align:'center',color:c.ink});
        g.beginPath(); g.arc(hx,hy,14,0,7); g.fillStyle=c.paper; g.fill(); g.lineWidth=1.4; g.stroke(); U.text(g,'B'+(i+1),hx,hy+4,{size:12,align:'center',w:600});
        g.save(); g.lineWidth = 1+pa[i]*30; g.strokeStyle = c.bad; g.shadowColor=c.bad; g.shadowBlur = pa[i]*60;
        g.beginPath(); g.moveTo(hx+14,hy); g.lineTo(lx,ly); g.stroke(); g.restore();
        U.text(g,'брак '+R(pa[i],3),(hx+lx)/2,hy-8,{size:11,kind:'mono',align:'center',color:c.soft});
        U.text(g,R(joint[i],4),lx+6,ly+4,{size:12,kind:'mono',color:c.bad});
      }
      // до и после
      const by = top+18, bh = H-by-26, bw = (W-60)/3;
      U.text(g,'до опыта P(Bᵢ)  ·  после: Pₐ(Bᵢ)',30,by-4,{size:11,color:c.soft});
      for (let i=0;i<3;i++){ const x = 30+i*bw;
        const h1 = pb[i]*bh, h2 = post[i]*bh;
        g.fillStyle = c.paper2; g.fillRect(x+6,by+bh-h1,bw/2-10,h1); g.strokeStyle=c.ink; g.lineWidth=1; g.strokeRect(x+6,by+bh-h1,bw/2-10,h1);
        g.fillStyle = U.hatch(g,c.stamp,5); g.fillRect(x+bw/2,by+bh-h2,bw/2-10,h2); g.strokeStyle=c.stamp; g.strokeRect(x+bw/2,by+bh-h2,bw/2-10,h2);
        U.text(g,'B'+(i+1),x+bw/2,by+bh+15,{size:11,align:'center',color:c.soft});
        U.text(g,R(post[i],2),x+bw*.75-5,by+bh-h2-4,{size:11,align:'center',kind:'mono',color:c.stamp}); }
      out.innerHTML = `P(брак) = ${joint.map((v,i)=>R(pb[i],2)+'·'+R(pa[i],3)).join(' + ')} = <b>${R(PA,4)}</b><br>Бейес: ${post.map((v,i)=>`P<sub>A</sub>(B${i+1}) = <span class="hot">${R(v,3)}</span>`).join(' · ')}`;
    }
    return draw;
  }
});

/* 5. Бернулли и наивероятнейшее число */
add({
  id:'tv5', title:'Формула Бернулли. Наивероятнейшее число', src:'Гмурман, гл. 3 §1, §4',
  theory:`<p>Проводится n <b>независимых</b> испытаний, в каждом событие A наступает с одной и той же вероятностью p (q = 1 − p). Вероятность того, что A наступит ровно k раз:</p>
  <div class="f">P<sub>n</sub>(k) = C<sub>n</sub><sup>k</sup> p<sup>k</sup> q<sup>n−k</sup></div>
  <p>Набор P<sub>n</sub>(0), …, P<sub>n</sub>(n) — <b>биномиальное распределение</b>.</p>
  <p><b>Наивероятнейшее число</b> k₀ — то k, при котором P<sub>n</sub>(k) наибольшая. Оно лежит в границах</p>
  <div class="f">np − q ≤ k₀ ≤ np + p<small>отрезок длины 1: если np − q целое, наивероятнейших чисел два — np − q и np + p</small></div>
  <p><b>Хотя бы один раз</b>: P = 1 − qⁿ. <b>Не менее k раз</b>: сумма P<sub>n</sub>(k) + … + P<sub>n</sub>(n).</p>`,
  predict:{q:'Монету бросают 10 раз. Какова вероятность, что герб выпадет ровно 5 раз?', opts:['около 0,5','около 0,25','около 0,1'], a:1,
    why:'P₁₀(5) = C₁₀⁵·0,5¹⁰ = 252/1024 ≈ 0,246. Пять — самый вероятный исход, но вероятность «ровно пять» всё равно меньше трети: остальное делят соседние значения.'},
  flap:`<p><b>Как считать C<sub>n</sub><sup>k</sup> руками:</b> C₁₀³ = (10·9·8)/(1·2·3) = 120. Полезно: C<sub>n</sub><sup>k</sup> = C<sub>n</sub><sup>n−k</sup>.</p>
  <p><b>Пример (Гмурман).</b> Товаровед осматривает 24 изделия, каждое признаётся годным с вероятностью 0,6. np − q = 14,4 − 0,4 = 14, np + p = 14,4 + 0,6 = 15. Граница — целые числа, поэтому наивероятнейших чисел два: 14 и 15.</p>`,
  figCap:'Биномиальное распределение. Светится столбик наивероятнейшего числа k₀, обведён выбранный k.',
  try:'Поставь n = 24, p = 0,6 — две вершины одинаковой высоты.',
  ch:{q:'Товаровед осматривает 24 изделия. Вероятность того, что изделие будет признано годным, равна 0,6. Найдите наивероятнейшее число годных изделий. Если таких чисел два — впишите оба.', ph:'например: 14 и 15',
    check:s=>{ const a=(s.match(/\d+/g)||[]).map(Number).sort((x,y)=>x-y); return a.length===2&&a[0]===14&&a[1]===15; }, ans:'14 и 15',
    wrong:'Не сходится. Подсказка: границы np − q и np + p здесь получаются целыми.', hint:'np − q = 24·0,6 − 0,4; np + p = 24·0,6 + 0,6.'},
  fig(el){
    let n = 10, p = .5, k = 5;
    const sn = U.slider('tv5-n','n',1,50,1,n,null,v=>{n=v; sk.range(0,n); if(k>n){k=n; sk.set(k);} draw();});
    const sp = U.slider('tv5-p','p',.01,.99,.01,p,v=>R(v,2),v=>{p=v; draw();});
    const sk = U.slider('tv5-k','k',0,n,1,k,null,v=>{k=v; draw();});
    el.append(h('div',{class:'ctls'}, sn, sp, sk));
    const cv = U.canvas(el, .55);
    const out = h('div',{class:'readout'}); el.append(out);
    function draw(){
      const {g,W,H} = cv.fit(), c = U.col();
      const P = Array.from({length:n+1},(_,i)=>U.binom(n,i,p)), mx = Math.max(...P);
      const lo = n*p-(1-p), hi = n*p+p;
      const ax = 34, ay = 14, aw = W-ax-10, ah = H-ay-30, bw = aw/(n+1);
      U.axes(g,ax,ay+ah,ax+aw,ay,c);
      P.forEach((v,i)=>{ const x = ax+i*bw, hh = v/mx*(ah-14), k0 = i>=lo-1e-9 && i<=hi+1e-9;
        g.save(); if (k0){ g.shadowColor=c.glow; g.shadowBlur=14; g.fillStyle=c.glow; } else g.fillStyle = U.hatch(g,c.pen,5);
        g.fillRect(x+bw*.12,ay+ah-hh,bw*.76,hh); g.restore();
        g.strokeStyle = i===k ? c.stamp : c.ink; g.lineWidth = i===k ? 2.4 : 1; g.strokeRect(x+bw*.12,ay+ah-hh,bw*.76,hh);
        if (n<=20 || i%5===0) U.text(g,i,x+bw/2,ay+ah+13,{size:10,align:'center',color:c.soft,kind:'mono'}); });
      U.text(g,'k',ax+aw,ay+ah+26,{size:11,align:'right',color:c.soft});
      const ks = []; for (let i=Math.ceil(lo-1e-9);i<=Math.floor(hi+1e-9);i++) if (i>=0&&i<=n) ks.push(i);
      out.innerHTML = `P<sub>${n}</sub>(${k}) = C<sub>${n}</sub><sup>${k}</sup>·${R(p,2)}<sup>${k}</sup>·${R(1-p,2)}<sup>${n-k}</sup> = ${Math.round(U.C(n,k))}·… = <b>${R(P[k],5)}</b><br>${R(lo,2)} ≤ k₀ ≤ ${R(hi,2)} → <span class="hot">k₀ = ${ks.join(' и ')}</span> · хотя бы раз: ${R(1-Math.pow(1-p,n),4)}`;
    }
    return draw;
  }
});

/* 6. Лаплас и Пуассон */
add({
  id:'tv6', title:'Теоремы Лапласа и формула Пуассона', src:'Гмурман, гл. 3 §2–3; гл. 4 §1',
  theory:`<p>При больших n формула Бернулли неудобна. Если npq велико (практически больше 9), работают приближения Муавра — Лапласа:</p>
  <div class="f">P<sub>n</sub>(k) ≈ ${fr('φ(x)','√(npq)')}, &nbsp; x = ${fr('k − np','√(npq)')}<small>локальная теорема; φ(x) = e<sup>−x²/2</sup>/√(2π) — чётная, по таблице</small></div>
  <div class="f">P<sub>n</sub>(k₁ ≤ k ≤ k₂) ≈ Φ(x″) − Φ(x′), &nbsp; x′ = ${fr('k₁ − np','√(npq)')}, x″ = ${fr('k₂ − np','√(npq)')}<small>интегральная теорема; Φ(x) — функция Лапласа, нечётная: Φ(−x) = −Φ(x), при x > 5 Φ(x) ≈ 0,5</small></div>
  <div class="f">P(|m/n − p| ≤ ε) ≈ 2Φ(ε√(n/(pq)))<small>отклонение относительной частоты от вероятности</small></div>
  <p>Если n велико, а p мало (λ = np ≤ 10) — закон <b>Пуассона</b>:</p>
  <div class="f">P<sub>n</sub>(k) ≈ ${fr('λ<sup>k</sup> e<sup>−λ</sup>','k!')}, &nbsp; λ = np</div>`,
  predict:{q:'n = 1000 испытаний, p = 0,001. Какое приближение для P<sub>n</sub>(k) выбрать?', opts:['Локальную теорему Лапласа','Формулу Пуассона','Обе одинаково хороши'], a:1,
    why:'λ = np = 1, а npq ≈ 1 — слишком мало для Лапласа: распределение сильно несимметрично. Для редких событий подходит Пуассон.'},
  flap:`<p><b>Задача (Гмурман).</b> Вероятность события в каждом из 100 независимых испытаний p = 0,8. Найти вероятность того, что событие появится не менее 75 и не более 90 раз.</p>
  <p>np = 80, √(npq) = √(100·0,8·0,2) = 4. x′ = (75 − 80)/4 = −1,25; x″ = (90 − 80)/4 = 2,5.</p>
  <p>P ≈ Φ(2,5) − Φ(−1,25) = Φ(2,5) + Φ(1,25) = 0,4938 + 0,3944 = <b>0,8882</b>.</p>`,
  figCap:'Столбики — точная формула Бернулли. Синяя кривая — приближение Лапласа, фиолетовые точки — Пуассона. Заштрихован интервал k₁…k₂.',
  try:'Сравни: n = 100, p = 0,8 (Лаплас лёг на столбики) и n = 200, p = 0,01 (кривая промахивается, точки Пуассона — нет).',
  ch:{q:'Вероятность события в каждом из 100 независимых испытаний равна 0,8. Найдите вероятность того, что событие появится не менее 75 и не более 90 раз (по интегральной теореме Лапласа).', check:s=>U.near(s,0.8882,0.004), ans:'≈ 0,8882',
    hint:'Поставь на рисунке n = 100, p = 0,8, k₁ = 75, k₂ = 90 и посмотри, чему равны x′ и x″.'},
  fig(el){
    let n = 100, p = .8, k1 = 75, k2 = 90;
    const sn = U.slider('tv6-n','n',10,1000,10,n,null,v=>{n=v; s1.range(0,n); s2.range(0,n); draw();});
    const sp = U.slider('tv6-p','p',.001,.99,.001,p,v=>R(v,3),v=>{p=v; draw();});
    const s1 = U.slider('tv6-k1','k₁',0,n,1,k1,null,v=>{k1=v; draw();});
    const s2 = U.slider('tv6-k2','k₂',0,n,1,k2,null,v=>{k2=v; draw();});
    el.append(h('div',{class:'ctls'}, sn, sp, s1, s2));
    const cv = U.canvas(el, .56);
    const out = h('div',{class:'readout'}); el.append(out);
    function draw(){
      const {g,W,H} = cv.fit(), c = U.col();
      const q = 1-p, mu = n*p, sd = Math.sqrt(n*p*q), lam = n*p;
      let a = Math.max(0, Math.floor(mu-4.5*sd-2)), b = Math.min(n, Math.ceil(mu+4.5*sd+2));
      if (b-a<12){ a = Math.max(0,a-6); b = Math.min(n,b+6); }
      const P = []; for (let k=a;k<=b;k++) P.push(U.binom(n,k,p));
      const mx = Math.max(...P, U.phi(0)/sd)*1.08;
      const ax = 34, ay = 10, aw = W-ax-10, ah = H-ay-30, bw = aw/(b-a+1);
      const X = k => ax+(k-a+.5)*bw, Y = v => ay+ah-v/mx*ah;
      U.axes(g,ax,ay+ah,ax+aw,ay,c);
      const pat = U.hatch(g,c.glow,4);
      for (let k=a;k<=b;k++){ const v = P[k-a], x = X(k)-bw*.4, inI = k>=k1&&k<=k2;
        if (inI){ g.fillStyle = pat; g.fillRect(x,Y(v),bw*.8,ay+ah-Y(v)); }
        g.strokeStyle = c.ink; g.lineWidth = .9; g.strokeRect(x,Y(v),bw*.8,ay+ah-Y(v)); }
      g.strokeStyle = c.pen; g.lineWidth = 2; g.beginPath();
      for (let i=0;i<=200;i++){ const k = a-.5+i/200*(b-a+1), v = sd>0 ? U.phi((k-mu)/sd)/sd : 0; const x = ax+(k-a+.5)*bw; i?g.lineTo(x,Y(v)):g.moveTo(x,Y(v)); } g.stroke();
      if (lam<=200) for (let k=a;k<=b;k++){ const v = U.pois(k,lam); g.fillStyle=c.stamp; g.beginPath(); g.arc(X(k),Y(v),Math.max(2,Math.min(3.5,bw/4)),0,7); g.fill(); }
      const step = Math.ceil((b-a+1)/12);
      for (let k=a;k<=b;k+=step) U.text(g,k,X(k),ay+ah+13,{size:10,align:'center',color:c.soft,kind:'mono'});
      let ex = 0; for (let k=Math.max(0,k1);k<=Math.min(n,k2);k++) ex += U.binom(n,k,p);
      let ps = 0; if (lam<=200) for (let k=Math.max(0,k1);k<=Math.min(n,k2);k++) ps += U.pois(k,lam);
      const x1 = (k1-mu)/sd, x2 = (k2-mu)/sd;
      out.innerHTML = `np = ${R(mu,2)}, √(npq) = ${R(sd,3)}, npq = ${R(sd*sd,2)} ${sd*sd<9?'<span class="bad">(мало для Лапласа)</span>':''}<br>x′ = ${R(x1,3)}, x″ = ${R(x2,3)} → Φ(x″) − Φ(x′) = <b>${R(U.Phi(x2)-U.Phi(x1),4)}</b><br>Точно по Бернулли: <span class="hot">${R(ex,4)}</span> · Пуассон: ${lam<=200?R(ps,4):'—'}`;
    }
    return draw;
  }
});

/* 7. Дискретная СВ: M и D */
add({
  id:'tv7', title:'Дискретная случайная величина: M(X) и D(X)', src:'Гмурман, гл. 4 §1, §3',
  theory:`<p><b>Закон распределения</b> дискретной СВ — таблица значений xᵢ и их вероятностей pᵢ, Σpᵢ = 1.</p>
  <div class="f">M(X) = Σ x<sub>i</sub> p<sub>i</sub> &nbsp;&nbsp; D(X) = M(X²) − [M(X)]² &nbsp;&nbsp; σ(X) = √D(X)</div>
  <p><b>Свойства:</b> M(C) = C; M(CX) = C·M(X); M(X + Y) = M(X) + M(Y); для независимых M(XY) = M(X)·M(Y).<br>
  D(C) = 0; D(CX) = C²·D(X); для независимых D(X ± Y) = D(X) + D(Y).</p>
  <h3>Важные законы</h3>
  <div class="tbl"><table><tr><th>Закон</th><th>P(X = k)</th><th>M(X)</th><th>D(X)</th></tr>
  <tr><td>Биномиальный</td><td>C<sub>n</sub><sup>k</sup>p<sup>k</sup>q<sup>n−k</sup></td><td>np</td><td>npq</td></tr>
  <tr><td>Пуассона</td><td>λ<sup>k</sup>e<sup>−λ</sup>/k!</td><td>λ</td><td>λ</td></tr>
  <tr><td>Геометрический</td><td>q<sup>k−1</sup>p</td><td>1/p</td><td>q/p²</td></tr></table></div>`,
  predict:{q:'X принимает значения 1 и 3, Y — значения 0 и 4, каждое с вероятностью ½. У какой величины дисперсия больше?', opts:['У X','У Y','Одинаковая — ведь M(X) = M(Y) = 2'], a:1,
    why:'Средние равны, но значения Y дальше от центра. D(X) = 1, D(Y) = 4. Дисперсия меряет разброс, а не центр.'},
  flap:`<p><b>Решение задачи:</b> X: −1, 0, 2 с вероятностями 0,2; 0,3; 0,5.</p>
  <p>M(X) = −1·0,2 + 0·0,3 + 2·0,5 = 0,8. M(X²) = 1·0,2 + 0 + 4·0,5 = 2,2.</p>
  <p>D(X) = 2,2 − 0,8² = 2,2 − 0,64 = <b>1,56</b>; σ ≈ 1,249.</p>
  <p>На рисунке M(X) — точка равновесия рычага: грузы pᵢ висят в точках xᵢ.</p>`,
  figCap:'Рычаг: в точках xᵢ висят грузы весом pᵢ. Опора, на которой он уравновешен, — M(X). Скоба показывает ±σ.',
  try:'Впиши в таблицу −1, 0, 2 и вероятности 0,2 0,3 0,5 — опора встанет в 0,8.',
  ch:{q:'Дискретная СВ X задана законом: x = −1, 0, 2 с вероятностями 0,2; 0,3; 0,5. Найдите D(X).', check:s=>U.near(s,1.56,0.005), ans:'1,56', hint:'D = M(X²) − M²(X). Сначала найди M(X) и M(X²).'},
  fig(el){
    const xs = [1,2,4,6], ps = [.1,.4,.3,.2];
    const tb = h('table',{});
    const mk = (arr,i,pre) => { const inp = h('input',{class:'txt',id:`tv7-${pre}${i}`,value:String(arr[i]).replace('.',','),style:'width:4.5em','aria-label':(pre==='x'?'значение ':'вероятность ')+(i+1)});
      inp.addEventListener('input',()=>{ const v = U.num(inp.value); arr[i] = isFinite(v)?v:NaN; draw(); }); return h('td',{},inp); };
    tb.append(h('tr',{},h('th',{},'xᵢ'),...xs.map((_,i)=>mk(xs,i,'x'))), h('tr',{},h('th',{},'pᵢ'),...ps.map((_,i)=>mk(ps,i,'p'))));
    el.append(h('div',{class:'tbl'},tb));
    const cv = U.canvas(el, .5);
    const out = h('div',{class:'readout'}); el.append(out);
    function draw(){
      const {g,W,H} = cv.fit(), c = U.col();
      const ok = xs.every(isFinite) && ps.every(v=>isFinite(v)&&v>=0);
      const sp = ps.reduce((a,b)=>a+(b||0),0);
      if (!ok){ out.innerHTML = '<span class="bad">Впиши числа во все клетки (вероятности ≥ 0).</span>'; return; }
      const M = xs.reduce((s,x,i)=>s+x*ps[i],0), M2 = xs.reduce((s,x,i)=>s+x*x*ps[i],0), D = M2-M*M, sg = Math.sqrt(Math.max(0,D));
      let lo = Math.min(...xs, M-sg)-1, hi = Math.max(...xs, M+sg)+1;
      const X = v => 24+(v-lo)/(hi-lo)*(W-48), by = H*.42;
      g.strokeStyle = c.ink; g.lineWidth = 4; g.beginPath(); g.moveTo(X(lo+.3),by); g.lineTo(X(hi-.3),by); g.stroke();
      for (let v=Math.ceil(lo);v<=hi;v++){ g.lineWidth=1; g.beginPath(); g.moveTo(X(v),by-4); g.lineTo(X(v),by+4); g.stroke(); U.text(g,v,X(v),by-9,{size:10,align:'center',color:c.soft,kind:'mono'}); }
      xs.forEach((x,i)=>{ const s = 10+ps[i]*90; g.strokeStyle=c.ink; g.lineWidth=1; g.beginPath(); g.moveTo(X(x),by); g.lineTo(X(x),by+26); g.stroke();
        g.fillStyle = U.hatch(g,c.pen,5); g.fillRect(X(x)-s/2,by+26,s,s*.8); g.strokeRect(X(x)-s/2,by+26,s,s*.8);
        U.text(g,R(ps[i],2),X(x),by+26+s*.8+14,{size:11,align:'center',kind:'mono'}); });
      g.save(); g.shadowColor=c.glow; g.shadowBlur=14; g.fillStyle=c.glow; g.beginPath(); g.moveTo(X(M),by+3); g.lineTo(X(M)-14,by+30); g.lineTo(X(M)+14,by+30); g.closePath(); g.fill(); g.restore();
      g.strokeStyle=c.ink; g.lineWidth=1.2; g.stroke();
      // σ-скоба
      const sy = 22; g.strokeStyle=c.stamp; g.lineWidth=1.5; g.beginPath(); g.moveTo(X(M-sg),sy+6); g.lineTo(X(M-sg),sy); g.lineTo(X(M+sg),sy); g.lineTo(X(M+sg),sy+6); g.stroke();
      U.text(g,'M ± σ',X(M),sy-5,{size:16,kind:'hand',align:'center',color:c.stamp,w:700});
      out.innerHTML = `Σpᵢ = ${R(sp,2)} ${Math.abs(sp-1)>1e-9?'<span class="bad">— должно быть 1</span>':'<span class="good">✓</span>'}<br>M(X) = <b>${R(M,3)}</b> · M(X²) = ${R(M2,3)} · D(X) = <span class="hot">${R(D,3)}</span> · σ = ${R(sg,3)}`;
    }
    return draw;
  }
});

/* 8. Непрерывные: равномерное, нормальное, показательное */
add({
  id:'tv8', title:'Непрерывные величины: F(x), f(x) и три закона', src:'Гмурман, гл. 6',
  theory:`<div class="f">F(x) = P(X &lt; x), &nbsp; f(x) = F′(x), &nbsp; P(α &lt; X &lt; β) = ∫<sub>α</sub><sup>β</sup> f(x)dx = F(β) − F(α)</div>
  <div class="f">M(X) = ∫ x f(x)dx, &nbsp;&nbsp; D(X) = ∫ x² f(x)dx − [M(X)]²</div>
  <div class="tbl"><table><tr><th>Закон</th><th>f(x)</th><th>M</th><th>D</th></tr>
  <tr><td>Равномерный на (a, b)</td><td>1/(b − a)</td><td>(a + b)/2</td><td>(b − a)²/12</td></tr>
  <tr><td>Нормальный N(a, σ)</td><td>e<sup>−(x−a)²/2σ²</sup>/(σ√2π)</td><td>a</td><td>σ²</td></tr>
  <tr><td>Показательный</td><td>λe<sup>−λx</sup>, x ≥ 0</td><td>1/λ</td><td>1/λ²</td></tr></table></div>
  <div class="f">P(α &lt; X &lt; β) = Φ(${fr('β − a','σ')}) − Φ(${fr('α − a','σ')}), &nbsp; P(|X − a| &lt; δ) = 2Φ(δ/σ)<small>для нормального закона. Правило трёх сигм: P(|X − a| &lt; 3σ) = 2Φ(3) = 0,9973</small></div>
  <p>Для показательного: F(x) = 1 − e<sup>−λx</sup>, функция надёжности R(t) = e<sup>−λt</sup>.</p>`,
  predict:{q:'X распределена нормально. Чему равна P(|X − a| &lt; 3σ)?', opts:['около 0,68','около 0,95','около 0,997'], a:2,
    why:'2Φ(3) = 0,9973. Для σ и 2σ получаем 0,6827 и 0,9545. Отклонение больше 3σ почти невозможно — это и есть правило трёх сигм.'},
  flap:`<p><b>Задача (Гмурман).</b> M(X) = 30, σ = 10, X нормальна. Найти P(10 &lt; X &lt; 50).</p>
  <p>P = Φ((50 − 30)/10) − Φ((10 − 30)/10) = Φ(2) − Φ(−2) = 2Φ(2) = 2·0,4772 = <b>0,9544</b>.</p>
  <p>Заметь: интервал симметричен относительно a, поэтому сразу P(|X − 30| &lt; 20) = 2Φ(20/10).</p>`,
  figCap:'Плотность f(x); заштрихованная площадь — P(α < X < β). Внизу — функция распределения F(x): та же вероятность как разность высот.',
  try:'Выбери нормальный закон, a = 0, σ = 1 и поставь α = −3, β = 3: площадь 0,9973.',
  ch:{q:'Математическое ожидание нормально распределённой величины X равно 30, σ = 10. Найдите P(10 &lt; X &lt; 50).', check:s=>U.near(s,0.9544,0.002), ans:'0,9544', hint:'Интервал симметричен относительно a = 30: P = 2Φ(20/10).'},
  fig(el){
    const D = [
      {name:'Нормальный', ps:[['a',-5,5,.5,0],['σ',.5,3,.1,1]], view:[-12,12], f:(x,[a,s])=>Math.exp(-((x-a)**2)/(2*s*s))/(s*Math.sqrt(2*Math.PI)), F:(x,[a,s])=>.5+U.Phi((x-a)/s), M:([a])=>a, V:([,s])=>s*s},
      {name:'Равномерный', ps:[['a',-10,9,.5,-3],['b',-9,10,.5,5]], view:[-12,12], f:(x,[a,b])=>b>a&&x>=a&&x<=b?1/(b-a):0, F:(x,[a,b])=>b<=a?0:Math.min(1,Math.max(0,(x-a)/(b-a))), M:([a,b])=>(a+b)/2, V:([a,b])=>(b-a)**2/12},
      {name:'Показательный', ps:[['λ',.2,3,.1,.5]], view:[-1,10], f:(x,[l])=>x<0?0:l*Math.exp(-l*x), F:(x,[l])=>x<0?0:1-Math.exp(-l*x), M:([l])=>1/l, V:([l])=>1/(l*l)}];
    let d = 0, par = D[0].ps.map(p=>p[4]), al = -1, be = 1;
    const box = h('div',{class:'ctls'});
    const sa = U.slider('tv8-al','α',-12,12,.5,al,v=>R(v,1),v=>{al=v; draw();});
    const sb = U.slider('tv8-be','β',-12,12,.5,be,v=>R(v,1),v=>{be=v; draw();});
    const build = () => { par = D[d].ps.map(p=>p[4]); box.replaceChildren(...D[d].ps.map((p,i)=>U.slider('tv8-p'+i,p[0],p[1],p[2],p[3],p[4],v=>R(v,1),v=>{par[i]=v; draw();})), sa, sb);
      const [v0,v1] = D[d].view; sa.range(v0,v1); sb.range(v0,v1); if (d===2){ al=0; be=2; } else { al=-1; be=1; } sa.set(al); sb.set(be); };
    el.append(h('div',{class:'row'}, h('label',{class:'sr',for:'tv8-d'},'Закон'), U.select('tv8-d', D.map(x=>x.name), v=>{d=v; build(); draw();})), box);
    build();
    const cv = U.canvas(el, .62);
    const out = h('div',{class:'readout'}); el.append(out);
    function draw(){
      const {g,W,H} = cv.fit(), c = U.col(), Dd = D[d], [v0,v1] = Dd.view;
      const ax = 34, aw = W-ax-12, h1 = H*.6, ay = 8, ah = h1-28, by = h1+8, bh = H-by-22;
      const X = x => ax+(x-v0)/(v1-v0)*aw;
      let mx = 0; for (let i=0;i<=400;i++) mx = Math.max(mx, Dd.f(v0+i/400*(v1-v0),par)); mx = mx*1.1||1;
      const Y = v => ay+ah-v/mx*ah;
      U.axes(g,ax,ay+ah,ax+aw,ay,c);
      const lo = Math.min(al,be), hi = Math.max(al,be);
      g.fillStyle = U.hatch(g,c.pen,5); g.beginPath(); g.moveTo(X(lo),Y(0));
      for (let i=0;i<=200;i++){ const x = lo+i/200*(hi-lo); g.lineTo(X(x),Y(Dd.f(x,par))); } g.lineTo(X(hi),Y(0)); g.closePath(); g.fill();
      g.save(); g.shadowColor = c.glow; g.shadowBlur = 8; g.strokeStyle = c.ink; g.lineWidth = 2; g.beginPath();
      for (let i=0;i<=400;i++){ const x = v0+i/400*(v1-v0), y = Y(Dd.f(x,par)); i?g.lineTo(X(x),y):g.moveTo(X(x),y); } g.stroke(); g.restore();
      for (let v=Math.ceil(v0);v<=v1;v+= (v1-v0)>15?3:1) U.text(g,v,X(v),ay+ah+13,{size:10,align:'center',color:c.soft,kind:'mono'});
      U.text(g,'f(x)',ax+4,ay+12,{size:12,color:c.soft});
      // F(x)
      U.axes(g,ax,by+bh,ax+aw,by,c);
      g.strokeStyle = c.pen; g.lineWidth = 1.8; g.beginPath();
      for (let i=0;i<=400;i++){ const x = v0+i/400*(v1-v0), y = by+bh-Dd.F(x,par)*bh; i?g.lineTo(X(x),y):g.moveTo(X(x),y); } g.stroke();
      const Fa = Dd.F(lo,par), Fb = Dd.F(hi,par);
      g.strokeStyle = c.glow; g.lineWidth = 3; g.beginPath(); g.moveTo(X(hi)+4,by+bh-Fa*bh); g.lineTo(X(hi)+4,by+bh-Fb*bh); g.stroke();
      g.setLineDash([3,3]); g.strokeStyle=c.soft; g.lineWidth=1; g.beginPath(); g.moveTo(X(lo),by+bh-Fa*bh); g.lineTo(X(hi)+4,by+bh-Fa*bh); g.stroke(); g.setLineDash([]);
      U.text(g,'F(x)',ax+4,by+12,{size:12,color:c.soft}); U.text(g,'1',ax-6,by+4,{size:10,align:'right',color:c.soft});
      const Mx = Dd.M(par), V = Dd.V(par);
      out.innerHTML = `P(${R(lo,1)} &lt; X &lt; ${R(hi,1)}) = F(${R(hi,1)}) − F(${R(lo,1)}) = <span class="hot">${R(Fb-Fa,4)}</span><br>M(X) = <b>${R(Mx,3)}</b> · D(X) = ${R(V,3)} · σ = ${R(Math.sqrt(V),3)}`;
    }
    return draw;
  }
});

/* 9. Закон больших чисел */
add({
  id:'tv9', title:'Закон больших чисел. Неравенство Чебышева', src:'Гмурман, гл. 5',
  theory:`<div class="f">P(|X − M(X)| &lt; ε) ≥ 1 − ${fr('D(X)','ε²')}<small>неравенство Чебышева: верно для любой СВ с конечной дисперсией; это нижняя оценка, часто грубая</small></div>
  <p><b>Теорема Чебышева.</b> Если X₁, …, Xₙ попарно независимы и их дисперсии ограничены одной константой C, то среднее арифметическое сходится по вероятности к среднему их математических ожиданий:</p>
  <div class="f">P(|${fr('ΣXᵢ','n')} − ${fr('ΣM(Xᵢ)','n')}| &lt; ε) ≥ 1 − ${fr('C','nε²')} → 1</div>
  <p><b>Теорема Бернулли:</b> относительная частота m/n сходится по вероятности к p. Это и оправдывает статистическое определение вероятности из главы 1.</p>`,
  predict:{q:'Неравенство Чебышева даёт для P(|X − M| &lt; ε)…', opts:['точное значение','нижнюю оценку, часто грубую','верхнюю оценку'], a:1,
    why:'Оценка «не меньше чем 1 − D/ε²» верна для любого закона, поэтому для конкретного она обычно сильно занижена. На рисунке видно: реальная доля заметно выше гарантированной.'},
  flap:`<p><b>Задача (Гмурман).</b> D(X) = 0,004. Оценить вероятность того, что |X − M(X)| &lt; 0,2.</p>
  <p>P ≥ 1 − 0,004/0,2² = 1 − 0,004/0,04 = 1 − 0,1 = <b>0,9</b>.</p>
  <p>На рисунке бросают кость: M = 3,5, D = 35/12 ≈ 2,917. Для среднего из n бросков D(X̄) = D/n.</p>`,
  figCap:'Сверху — среднее число очков после n бросков кости: оно сужается к 3,5. Снизу — гарантия Чебышева против реальной доли серий, уложившихся в ε.',
  try:'Увеличивай n: оценка Чебышева растёт к 1, реальная вероятность — ещё быстрее.',
  ch:{q:'Дисперсия случайной величины X равна 0,004. Оцените снизу вероятность того, что |X − M(X)| &lt; 0,2.', check:s=>U.near(s,0.9,0.001), ans:'0,9', hint:'1 − D/ε², ε = 0,2.'},
  fig(el){
    let n = 100, eps = .3, path = [];
    const sn = U.slider('tv9-n','n бросков в серии',1,500,1,n,null,v=>{n=v; draw();});
    const se = U.slider('tv9-e','ε',.05,1.5,.05,eps,v=>R(v,2),v=>{eps=v; draw();});
    const run = () => { path=[]; let s=0; for (let i=1;i<=2000;i++){ s += 1+Math.floor(Math.random()*6); path.push(s/i); } draw(); };
    el.append(h('div',{class:'ctls'}, sn, se), h('div',{class:'row'}, U.btn('Новая серия 2000 бросков', run)));
    const cv = U.canvas(el, .5), cv2 = U.canvas(el, .24);
    const out = h('div',{class:'readout'}); el.append(out);
    run();
    function draw(){
      let {g,W,H} = cv.fit(); const c = U.col();
      const ax = 34, ay = 8, aw = W-ax-10, ah = H-ay-24, Y = v => ay+ah-(v-1)/5*ah, X = i => ax+i/1999*aw;
      U.axes(g,ax,ay+ah,ax+aw,ay,c);
      g.fillStyle = c.wash; g.fillRect(ax,Y(3.5+eps),aw,Y(3.5-eps)-Y(3.5+eps));
      g.setLineDash([5,4]); g.strokeStyle = c.stamp; g.beginPath(); g.moveTo(ax,Y(3.5)); g.lineTo(ax+aw,Y(3.5)); g.stroke(); g.setLineDash([]);
      for (const v of [1,2,3,4,5,6]) U.text(g,v,ax-8,Y(v)+4,{size:10,align:'right',color:c.soft,kind:'mono'});
      g.strokeStyle = c.ink; g.lineWidth = 1.5; g.beginPath(); path.forEach((v,i)=>{ i?g.lineTo(X(i),Y(v)):g.moveTo(X(i),Y(v)); }); g.stroke();
      g.save(); g.shadowColor=c.glow; g.shadowBlur=10; g.fillStyle=c.glow; g.beginPath(); g.arc(X(n-1),Y(path[n-1]),5,0,7); g.fill(); g.restore();
      U.text(g,'n',ax+aw,ay+ah+16,{size:11,align:'right',color:c.soft});
      // эмпирика: 300 серий по n
      let ok = 0; const T = 300; for (let t=0;t<T;t++){ let s=0; for (let i=0;i<n;i++) s += 1+Math.floor(Math.random()*6); if (Math.abs(s/n-3.5)<eps) ok++; }
      const cheb = Math.max(0, 1-(35/12)/(n*eps*eps)), emp = ok/T;
      ({g,W,H} = cv2.fit());
      const bx = 150, bw = W-bx-60;
      [['Чебышев ≥',cheb,c.stamp],['опыт, 300 серий',emp,c.pen]].forEach(([l,v,col],i)=>{ const y = 8+i*(H/2-2), hh = H/2-14;
        U.text(g,l,bx-8,y+hh/2+4,{size:12,align:'right',color:c.soft}); g.strokeStyle=c.ink; g.lineWidth=1; g.strokeRect(bx,y,bw,hh);
        g.fillStyle = i ? U.hatch(g,col,5) : c.swash; g.fillRect(bx,y,bw*v,hh); g.strokeStyle=col; g.lineWidth=2; g.strokeRect(bx,y,bw*v,hh);
        U.text(g,R(v,3),bx+bw+6,y+hh/2+4,{size:12,kind:'mono',color:col}); });
      out.innerHTML = `D(X̄) = (35/12)/${n} = ${R(35/12/n,4)} → P(|X̄ − 3,5| &lt; ${R(eps,2)}) ≥ 1 − ${R(35/12/n,4)}/${R(eps*eps,4)} = <b>${R(cheb,3)}</b><br>Среднее после ${n} бросков этой серии: <span class="hot">${R(path[n-1],3)}</span>`;
    }
    return draw;
  }
});

/* 10. Выборка и доверительный интервал */
add({
  id:'tv10', title:'Выборка, точечные оценки, доверительный интервал', src:'Гмурман, гл. 9–10',
  theory:`<p><b>Выборка</b> объёма n из генеральной совокупности. Варианты xᵢ, частоты nᵢ, относительные частоты wᵢ = nᵢ/n. <b>Эмпирическая функция</b> F*(x) = nₓ/n, где nₓ — число вариант меньше x. Графики: <b>полигон</b> (точки (xᵢ, nᵢ)) и <b>гистограмма</b> (прямоугольники высотой nᵢ/h).</p>
  <div class="f">x̄<sub>в</sub> = ${fr('Σnᵢxᵢ','n')} &nbsp;&nbsp; D<sub>в</sub> = ${fr('Σnᵢ(xᵢ − x̄)²','n')} = ${fr('Σnᵢxᵢ²','n')} − x̄² &nbsp;&nbsp; s² = ${fr('n','n − 1')}D<sub>в</sub><small>D<sub>в</sub> — смещённая оценка дисперсии, s² — исправленная (несмещённая)</small></div>
  <p>Хорошая оценка — <b>несмещённая</b>, <b>состоятельная</b>, <b>эффективная</b>. Методы получения: метод моментов, метод наибольшего правдоподобия.</p>
  <div class="f">x̄ − t${fr('σ','√n')} &lt; a &lt; x̄ + t${fr('σ','√n')}, &nbsp; 2Φ(t) = γ<small>интервал для a нормального закона при известном σ; δ = tσ/√n — точность. При неизвестном σ вместо σ берут s, а t = t<sub>γ</sub> — по таблице Стьюдента</small></div>`,
  predict:{q:'Надёжность γ подняли с 0,95 до 0,99, остальное не меняли. Доверительный интервал станет…', opts:['уже','шире','таким же'], a:1,
    why:'Из 2Φ(t) = γ: t растёт с 1,96 до 2,58, значит δ = tσ/√n растёт. Чем увереннее хотим быть, тем шире «сеть». Сузить её можно только увеличив n.'},
  flap:`<p><b>Задача (Гмурман).</b> Найти доверительный интервал для a с надёжностью 0,95, если σ = 3, x̄ = 4,1, n = 36.</p>
  <p>2Φ(t) = 0,95 → Φ(t) = 0,475 → t = 1,96. δ = 1,96·3/√36 = 1,96·0,5 = <b>0,98</b>.</p>
  <p>Интервал: 4,1 − 0,98 &lt; a &lt; 4,1 + 0,98, то есть <b>3,12 &lt; a &lt; 5,08</b>.</p>
  <p>Смысл γ = 0,95: из 100 таких выборок примерно 95 интервалов накроют истинное a. Это и показывает рисунок.</p>`,
  figCap:'40 выборок из N(a = 10, σ = 3). У каждой свой интервал x̄ ± δ. Красные промахнулись мимо истинного a.',
  try:'Нажимай «Новые 40 выборок» несколько раз: промахов примерно (1 − γ)·40.',
  ch:{q:'σ = 3, x̄ = 4,1, n = 36, γ = 0,95. Найдите точность оценки δ.', check:s=>U.near(s,0.98,0.005), ans:'0,98 (интервал 3,12 < a < 5,08)', hint:'t = 1,96, δ = tσ/√n.'},
  fig(el){
    let n = 25, gam = .95, S = [];
    const sn = U.slider('tv10-n','n',4,100,1,n,null,v=>{n=v; gen(); });
    const sg = U.slider('tv10-g','γ',.8,.99,.01,gam,v=>R(v,2),v=>{gam=v; draw();});
    const gen = () => { S = Array.from({length:40},()=>{ let s=0; for (let i=0;i<n;i++){ const u=Math.random()||1e-9, v=Math.random(); s += 10+3*Math.sqrt(-2*Math.log(u))*Math.cos(2*Math.PI*v); } return s/n; }); draw(); };
    el.append(h('div',{class:'ctls'}, sn, sg), h('div',{class:'row'}, U.btn('Новые 40 выборок', gen)));
    const cv = U.canvas(el, .7);
    const out = h('div',{class:'readout'}); el.append(out);
    gen();
    function draw(){
      if (!S.length) return;
      const {g,W,H} = cv.fit(), c = U.col();
      const t = U.PhiInv(gam/2), d = t*3/Math.sqrt(n), lo = 10-5, hi = 10+5;
      const X = v => 20+(Math.min(hi,Math.max(lo,v))-lo)/(hi-lo)*(W-40), rh = (H-30)/40;
      let miss = 0;
      g.setLineDash([5,4]); g.strokeStyle = c.stamp; g.lineWidth=1.2; g.beginPath(); g.moveTo(X(10),4); g.lineTo(X(10),H-20); g.stroke(); g.setLineDash([]);
      S.forEach((m,i)=>{ const y = 8+i*rh, bad = Math.abs(m-10)>d; if (bad) miss++;
        g.strokeStyle = bad ? c.bad : c.ink; g.lineWidth = bad ? 2.2 : 1.3;
        g.beginPath(); g.moveTo(X(m-d),y); g.lineTo(X(m+d),y); g.moveTo(X(m-d),y-3); g.lineTo(X(m-d),y+3); g.moveTo(X(m+d),y-3); g.lineTo(X(m+d),y+3); g.stroke();
        g.fillStyle = bad ? c.bad : c.pen; g.beginPath(); g.arc(X(m),y,2.2,0,7); g.fill(); });
      for (let v=lo;v<=hi;v++) U.text(g,v,X(v),H-6,{size:10,align:'center',color:c.soft,kind:'mono'});
      U.text(g,'a = 10',X(10)+4,14,{size:16,kind:'hand',color:c.stamp,w:700});
      out.innerHTML = `2Φ(t) = ${R(gam,2)} → t = ${R(t,3)} · δ = t·3/√${n} = <b>${R(d,3)}</b><br>Накрыли a: <span class="hot">${40-miss} из 40</span> (ожидается ≈ ${R(40*gam,1)})`;
    }
    return draw;
  }
});

/* 11. Критерий Пирсона */
add({
  id:'tv11', title:'Проверка гипотез. Критерий χ² Пирсона', src:'Гмурман, гл. 13 §1, §16–21',
  theory:`<p><b>Нулевая гипотеза</b> H₀ — выдвинутая (например, «кубик честный»), <b>конкурирующая</b> H₁ — противоречащая ей. Ошибка <b>первого рода</b> — отвергнуть верную H₀; её вероятность — <b>уровень значимости</b> α (обычно 0,05 или 0,01). Ошибка <b>второго рода</b> — принять неверную H₀.</p>
  <p><b>Критерий</b> — случайная величина K; область её значений, при которых H₀ отвергают, — <b>критическая область</b>.</p>
  <div class="f">χ²<sub>набл</sub> = Σ ${fr('(nᵢ − nᵢ′)²','nᵢ′')}, &nbsp; k = s − 1 − r<small>nᵢ — эмпирические частоты, nᵢ′ — теоретические; s — число групп; r — число параметров, оценённых по выборке (для нормального r = 2, для Пуассона и показательного r = 1)</small></div>
  <p>Если χ²<sub>набл</sub> &lt; χ²<sub>кр</sub>(α; k) — нет оснований отвергнуть H₀. Если больше — H₀ отвергают.</p>
  <div class="f">χ² = ${fr('(n − 1)s²','σ₀²')} &nbsp;&nbsp; U = ${fr('(m/n − p₀)√n','√(p₀q₀)')}<small>проверка дисперсии нормальной совокупности (k = n − 1) · сравнение относительной частоты с вероятностью p₀ (U сравнивают с u<sub>кр</sub> по функции Лапласа)</small></div>`,
  predict:{q:'Проверяем, честный ли кубик (6 граней, вероятности не оценивали по выборке). Сколько степеней свободы у χ²?', opts:['6','5','4'], a:1,
    why:'k = s − 1 − r = 6 − 1 − 0 = 5. Единицу отнимают, потому что частоты связаны условием Σnᵢ = n.'},
  flap:`<p><b>Решение задачи.</b> 60 бросков, ожидаем по 10 на грань. Наблюдали 8, 12, 9, 11, 6, 14.</p>
  <p>χ² = (4 + 4 + 1 + 1 + 16 + 16)/10 = <b>4,2</b>. χ²<sub>кр</sub>(0,05; 5) = 11,07.</p>
  <p>4,2 &lt; 11,07 — нет оснований отвергнуть гипотезу о честности кубика.</p>`,
  figCap:'Наблюдаемые частоты граней против ожидаемых (пунктир). Внизу — плотность χ² с k = 5, критическая область заштрихована.',
  try:'Утяжели шестёрку на 0,1 и бросай 600 раз: χ² уйдёт за 11,07, и гипотезу отвергнут.',
  ch:{q:'Кубик бросили 60 раз. Грани 1–6 выпали 8, 12, 9, 11, 6, 14 раз. Найдите χ²<sub>набл</sub> для гипотезы о честном кубике.', check:s=>U.near(s,4.2,0.01), ans:'4,2', hint:'Ожидаемая частота каждой грани 60/6 = 10. Сложи (nᵢ − 10)²/10.'},
  fig(el){
    let N = 60, bias = 0, obs = [8,12,9,11,6,14];
    const sN = U.slider('tv11-n','бросков',60,1200,60,N,null,v=>{N=v;});
    const sb = U.slider('tv11-b','перекос «6»',0,.3,.01,bias,v=>'+'+R(v,2),v=>{bias=v;});
    const roll = () => { obs=[0,0,0,0,0,0]; const p=[1,1,1,1,1,1].map((_,i)=>i===5?1/6+bias:1/6-bias/5); for (let t=0;t<N;t++){ let r=Math.random(), k=0; while (k<5 && r>p[k]){ r-=p[k]; k++; } obs[k]++; } draw(); };
    el.append(h('div',{class:'ctls'}, sN, sb), h('div',{class:'row'}, U.btn('Бросить кубик', roll), U.btn('Данные из задачи', ()=>{ obs=[8,12,9,11,6,14]; draw(); })));
    const cv = U.canvas(el, .7);
    const out = h('div',{class:'readout'}); el.append(out);
    function draw(){
      const {g,W,H} = cv.fit(), c = U.col();
      const n = obs.reduce((a,b)=>a+b,0), e = n/6, chi = obs.reduce((s,o)=>s+(o-e)**2/e,0), kr = 11.07;
      const ax = 34, ay = 8, aw = W-ax-10, ah = H*.46, mx = Math.max(...obs, e)*1.15, bw = aw/6;
      U.axes(g,ax,ay+ah,ax+aw,ay,c);
      obs.forEach((o,i)=>{ const hh = o/mx*ah, x = ax+i*bw+bw*.18;
        g.fillStyle = U.hatch(g,c.pen,5); g.fillRect(x,ay+ah-hh,bw*.64,hh); g.strokeStyle=c.ink; g.lineWidth=1; g.strokeRect(x,ay+ah-hh,bw*.64,hh);
        U.text(g,o,x+bw*.32,ay+ah-hh-4,{size:11,align:'center',kind:'mono'}); U.text(g,'грань '+(i+1),x+bw*.32,ay+ah+15,{size:11,align:'center',color:c.soft}); });
      g.setLineDash([5,4]); g.strokeStyle=c.stamp; g.lineWidth=1.5; g.beginPath(); g.moveTo(ax,ay+ah-e/mx*ah); g.lineTo(ax+aw,ay+ah-e/mx*ah); g.stroke(); g.setLineDash([]);
      // плотность χ²(5)
      const by = ay+ah+30, bh = H-by-22, xm = 25, X = v => ax+v/xm*aw, f = x => x<=0?0:Math.pow(x,1.5)*Math.exp(-x/2)/(Math.pow(2,2.5)*1.32934), fm = .16, Y = v => by+bh-v/fm*bh;
      U.axes(g,ax,by+bh,ax+aw,by,c);
      g.fillStyle = U.hatch(g,c.bad,4); g.beginPath(); g.moveTo(X(kr),Y(0)); for (let x=kr;x<=xm;x+=.2) g.lineTo(X(x),Y(f(x))); g.lineTo(X(xm),Y(0)); g.closePath(); g.fill();
      g.strokeStyle=c.ink; g.lineWidth=1.8; g.beginPath(); for (let x=0;x<=xm;x+=.1){ x?g.lineTo(X(x),Y(f(x))):g.moveTo(X(x),Y(0)); } g.stroke();
      U.text(g,'χ²кр = 11,07',X(kr)+4,by+12,{size:11,kind:'mono',color:c.bad});
      g.save(); g.shadowColor=c.glow; g.shadowBlur=12; g.strokeStyle=c.glow; g.lineWidth=3; g.beginPath(); g.moveTo(X(Math.min(chi,xm)),by); g.lineTo(X(Math.min(chi,xm)),by+bh); g.stroke(); g.restore();
      for (let v=0;v<=xm;v+=5) U.text(g,v,X(v),by+bh+13,{size:10,align:'center',color:c.soft,kind:'mono'});
      out.innerHTML = `n = ${n}, nᵢ′ = ${R(e,1)} · χ²<sub>набл</sub> = <span class="hot">${R(chi,2)}</span> ${chi<kr?'<span class="good">&lt; 11,07 — H₀ не отвергаем</span>':'<span class="bad">&gt; 11,07 — H₀ отвергаем</span>'}`;
    }
    return draw;
  }
});

/* Дополнительные задачи из Гмурмана; ответы сверены с разделом «Ответы» книги */
const P = (n, q, t, tol, ans, hint, ph) => ({n, q, ans, hint, ph, check: s => U.near(s, t, tol)});
const MORE = {
  tv1: [
    P(3,'Задумано двузначное число. Найдите вероятность того, что задуманным числом окажется случайно названное двузначное число.',1/90,.0005,'1/90','Двузначных чисел 90 (от 10 до 99), благоприятный исход один.'),
    P(6,'Куб, все грани которого окрашены, распилен на тысячу кубиков одинакового размера, которые затем тщательно перемешаны. Найдите вероятность того, что наудачу извлечённый кубик имеет ровно одну окрашенную грань.',.384,.0005,'0,384','Ребро разрезано на 10 частей. Одну окрашенную грань имеют кубики из «середины» каждой грани: 8×8 на каждой из 6 граней.'),
    P(7,'Монета брошена два раза. Найдите вероятность того, что хотя бы один раз появится «герб».',.75,.0005,'3/4','Равновозможные исходы: ГГ, ГЦ, ЦГ, ЦЦ.')],
  tv2: [
    P(31,'На плоскость, разграфлённую параллельными прямыми на расстоянии 6 см друг от друга, наудачу брошен круг радиуса 1 см. Найдите вероятность того, что круг не пересечёт ни одной из прямых.',2/3,.002,'2/3','Смотри на центр круга между двумя соседними прямыми: он должен отстоять от каждой больше чем на 1 см. Благоприятная длина 6 − 2.'),
    P(32,'На плоскости начерчены две концентрические окружности радиусами 5 и 10 см. Найдите вероятность того, что точка, брошенная наудачу в большой круг, попадёт также в кольцо, образованное этими окружностями.',.75,.0005,'0,75','(π·10² − π·5²) / (π·10²).'),
    P(37,'На отрезке OA длины L наудачу поставлены две точки B(x) и C(y), причём y ≥ x. Найдите вероятность того, что длина отрезка BC окажется меньше L/2.',.75,.0005,'0,75','Все исходы — треугольник 0 ≤ x ≤ y ≤ L площадью L²/2. Неблагоприятные (y − x ≥ L/2) — треугольник с катетами L/2.')],
  tv3: [
    P(47,'В ящике 10 деталей, из которых четыре окрашены. Сборщик наудачу взял три детали. Найдите вероятность того, что хотя бы одна из взятых деталей окрашена.',5/6,.002,'5/6','Противоположное событие — все три неокрашены: C₆³/C₁₀³.'),
    P(51,'Два стрелка стреляют по мишени. Вероятность попадания при одном выстреле для первого 0,7, для второго 0,8. Найдите вероятность того, что при одном залпе в мишень попадёт только один из стрелков.',.38,.0005,'0,38','p₁q₂ + q₁p₂.'),
    P(81,'Устройство содержит два независимо работающих элемента. Вероятности отказа элементов 0,05 и 0,08. Найдите вероятность отказа устройства, если для этого достаточно, чтобы отказал хотя бы один элемент.',.126,.0005,'0,126','1 − (1 − 0,05)(1 − 0,08).')],
  tv4: [
    P(91,'В вычислительной лаборатории шесть клавишных автоматов и четыре полуавтомата. Вероятность того, что за время расчёта автомат не выйдет из строя, 0,95; для полуавтомата 0,8. Студент считает на наудачу выбранной машине. Найдите вероятность того, что до окончания расчёта машина не выйдет из строя.',.89,.0005,'0,89','Гипотезы: взят автомат (0,6) или полуавтомат (0,4).'),
    P(98,'Продолжение задачи на штамп: стрелок поразил мишень из наудачу взятой винтовки. Найдите вероятность того, что винтовка была с оптическим прицелом.',19/43,.002,'19/43 ≈ 0,442; вероятнее, что винтовка была без прицела (24/43)','Формула Бейеса: 0,4·0,95 / 0,86.'),
    P(101,'В больницу поступают 50% больных с заболеванием K, 30% — с заболеванием L, 20% — с заболеванием M. Вероятность полного излечения болезни K равна 0,7, для L и M — 0,8 и 0,9. Больной был выписан здоровым. Найдите вероятность того, что он страдал заболеванием K.',5/11,.002,'5/11 ≈ 0,455','P(здоров) = 0,5·0,7 + 0,3·0,8 + 0,2·0,9 = 0,77.')],
  tv5: [
    P(112,'Монету бросают пять раз. Найдите вероятность того, что «герб» выпадет менее двух раз.',3/16,.001,'3/16','P₅(0) + P₅(1) = (1 + 5)/2⁵.'),
    P(116,'Отрезок AB разделён точкой C в отношении 2:1. На этот отрезок наудачу брошены четыре точки. Найдите вероятность того, что две из них окажутся левее точки C и две — правее.',8/27,.002,'8/27','Каждая точка левее C с вероятностью p = 2/3. По Бернулли: C₄²p²q².'),
    P(146,'Отдел технического контроля проверяет партию из 10 деталей. Вероятность того, что деталь стандартна, 0,75. Найдите наивероятнейшее число деталей, которые будут признаны стандартными.',8,0,'8','np − q ≤ k₀ ≤ np + p при n = 10, p = 0,75.')],
  tv6: [
    P(121,'Вероятность поражения мишени при одном выстреле 0,8. Найдите вероятность того, что при 100 выстрелах мишень будет поражена ровно 75 раз.',.04565,.0015,'≈ 0,04565','Локальная теорема: x = (75 − 80)/4 = −1,25, φ(1,25) = 0,1826, P ≈ φ(x)/√(npq).'),
    P(133,'Вероятность появления события в каждом из 10 000 независимых испытаний 0,75. Найдите вероятность того, что относительная частота появления события отклонится от его вероятности по абсолютной величине не более чем на 0,01.',.979,.003,'≈ 0,979','P ≈ 2Φ(ε√(n/(pq))); ε√(n/(pq)) = 0,01·√(10000/0,1875) ≈ 2,31.'),
    P(177,'Устройство состоит из 1000 элементов, работающих независимо. Вероятность отказа любого элемента за время T равна 0,002. Найдите вероятность того, что за время T откажут ровно три элемента. Принять e⁻² = 0,13534.',.18,.003,'≈ 0,18','Пуассон, λ = np = 2: P = λ³e<sup>−λ</sup>/3!.')],
  tv7: [
    P('188б','Найдите M(X), если X принимает значения 0,21; 0,54; 0,61 с вероятностями 0,1; 0,5; 0,4.',.535,.0005,'0,535','Σxᵢpᵢ.'),
    P(209,'Случайные величины X и Y независимы, D(X) = 4, D(Y) = 5. Найдите дисперсию случайной величины Z = 2X + 3Y.',61,0,'61','D(CX) = C²D(X), а дисперсии независимых величин складываются.'),
    P(214,'Найдите дисперсию числа X отказов элемента в десяти независимых опытах, если вероятность отказа в каждом опыте 0,9.',.9,.0005,'0,9','X распределена биномиально: D = npq.')],
  tv8: [
    P(310,'Автобусы идут строго по расписанию с интервалом 5 мин. Найдите вероятность того, что пассажир, подошедший к остановке, будет ожидать очередной автобус менее 3 мин.',.6,.0005,'0,6','Время ожидания распределено равномерно на (0; 5).'),
    P(332,'Взвешивание производится без систематических ошибок; случайные ошибки подчинены нормальному закону с σ = 20 г. Найдите вероятность того, что ошибка взвешивания не превзойдёт по абсолютной величине 10 г.',.383,.002,'2Φ(0,5) ≈ 0,383','P(|X| &lt; δ) = 2Φ(δ/σ); Φ(0,5) = 0,1915.'),
    P(351,'X распределена по показательному закону с плотностью f(x) = 0,04·e<sup>−0,04x</sup> при x ≥ 0. Найдите вероятность того, что X попадёт в интервал (1; 2).',.038,.0008,'≈ 0,038','P(a &lt; X &lt; b) = e<sup>−λa</sup> − e<sup>−λb</sup>, λ = 0,04.')],
  tv9: [
    P(236,'Используя неравенство Чебышева, оцените вероятность того, что |X − M(X)| &lt; 3σ.',8/9,.002,'≥ 8/9','D = σ², ε = 3σ.'),
    P(244,'Вероятность появления события в каждом испытании 1/4. Используя неравенство Чебышева, оцените вероятность того, что число X появлений события будет заключено в пределах от 150 до 250, если будет произведено 800 испытаний.',.94,.001,'≥ 0,94','M(X) = np = 200, D(X) = npq = 150, ε = 50.'),
    P(246,'X задана законом: значения 0,1; 0,4; 0,6 с вероятностями 0,2; 0,3; 0,5. Используя неравенство Чебышева, оцените вероятность того, что |X − M(X)| &lt; √0,4.',.909,.001,'≥ 0,909','M(X) = 0,44, M(X²) = 0,23, D(X) = 0,0364.')],
  tv10: [
    P(451,'Из генеральной совокупности извлечена выборка объёма n = 60: варианты 1, 3, 6, 26 с частотами 8, 40, 10, 2. Найдите несмещённую оценку генеральной средней.',4,.001,'4','x̄ = Σnᵢxᵢ / n.'),
    P(504,'Выборка из большой партии электроламп содержит 100 ламп, средняя продолжительность горения лампы выборки 1000 ч. С надёжностью 0,95 найдите точность δ доверительного интервала для средней продолжительности горения a всей партии, если σ = 40 ч.',7.84,.01,'δ = 7,84; интервал 992,16 &lt; a &lt; 1007,84','t = 1,96, δ = tσ/√n.'),
    P(507,'Найдите минимальный объём выборки, при котором с надёжностью 0,925 точность оценки математического ожидания нормальной совокупности по выборочной средней равна 0,2, если σ = 1,5.',179,0,'179','2Φ(t) = 0,925 → t = 1,78; n ≥ t²σ²/δ², округлить вверх.')],
  tv11: [
    P(561,'Из нормальной совокупности извлечена выборка объёма n = 17, исправленная выборочная дисперсия s² = 0,24. При α = 0,05 проверяется H₀: σ² = 0,18 против H₁: σ² &gt; 0,18. Найдите χ²<sub>набл</sub>. (χ²<sub>кр</sub>(0,05; 16) = 26,3)',21.33,.02,'21,33 &lt; 26,3 — нет оснований отвергнуть H₀','χ²<sub>набл</sub> = (n − 1)s²/σ₀².'),
    P(589,'Партия принимается, если вероятность брака не превышает 0,03. Среди 400 случайно отобранных изделий оказалось 18 бракованных. Найдите U<sub>набл</sub> для H₀: p = 0,03 при H₁: p &gt; 0,03. (u<sub>кр</sub> = 1,645 при α = 0,05)',1.76,.01,'U<sub>набл</sub> ≈ 1,76 &gt; 1,645 — партию принять нельзя','U = (m/n − p₀)·√n / √(p₀q₀).'),
    P(591,'Вероятность полного выздоровления при лекарстве A равна 0,8. Новое лекарство B назначено 800 больным, 660 из них выздоровели. Найдите U<sub>набл</sub> для H₀: p = 0,8 при H₁: p ≠ 0,8. (u<sub>кр</sub> = 1,96 при α = 0,05)',1.77,.01,'U<sub>набл</sub> ≈ 1,77 &lt; 1,96 — считать B значимо эффективнее нельзя','U = (m/n − p₀)·√n / √(p₀q₀), m/n = 0,825.')]
};
for (const L of BOOKS.tv.lessons) L.more = MORE[L.id];

/* Истории, с которых начинается каждая глава */
const HOOK = {
  tv1:{eye:'Задача Галилея, около 1620 года', title:'Почему на трёх костях 10 выпадает чаще, чем 9?',
    html:`<p>Флорентийские игроки заметили странность. Сумма 9 и сумма 10 раскладываются одинаковым числом способов, по шесть: 9 = 1+2+6 = 1+3+5 = 1+4+4 = 2+2+5 = 2+3+4 = 3+3+3. И всё же 10 выпадает чаще.</p>
    <p>Галилей объяснил: считать нужно не способы, а <b>равновозможные исходы</b>, то есть упорядоченные тройки. «1+4+4» получается тремя исходами, а «3+3+3» — только одним.</p>
    <p class="big">27 против 25 из 216</p><p>Разница около одного процента, а игроки разглядели её на опыте. Вся эта глава — о том, как не спутать способы с исходами.</p>`},
  tv2:{eye:'Граф Бюффон, 1777', title:'Как вычислить π, бросая иглы на пол',
    html:`<p>Пол сложен из досок шириной d. На него наудачу бросают иглу длиной l ≤ d. Бюффон доказал, что игла пересечёт щель с вероятностью</p>
    <p class="big">P = 2l / (πd)</p><p>Значит, π можно найти, просто бросая иглы и считая пересечения. Это первая задача на геометрическую вероятность и первый метод Монте-Карло, на полтора века раньше компьютеров. На рисунке справа ты сделаешь то же самое с точками.</p>`},
  tv3:{eye:'Шевалье де Мере, 1654', title:'Спор, с которого началась теория вероятностей',
    html:`<p>Де Мере стабильно выигрывал, ставя на то, что за 4 броска кости хотя бы раз выпадет шестёрка. Потом он рассудил: две шестёрки на паре костей в 6 раз реже, значит, хватит 24 бросков пары. И начал проигрывать.</p>
    <p class="big">1 − (5/6)⁴ ≈ 0,518 &nbsp;·&nbsp; 1 − (35/36)²⁴ ≈ 0,491</p>
    <p>Он пожаловался Паскалю, Паскаль написал Ферма, и из их переписки выросла теория вероятностей. Формула «хотя бы одно» из этой главы объясняет весь спор за одну строчку.</p>`},
  tv4:{eye:'Парадокс ложной тревоги', title:'Тест точен на 99%. Почему ты, скорее всего, здоров?',
    html:`<p>Болезнь встречается у 1 человека из 1000. Тест находит её у 99% больных, но и у 1% здоровых даёт ложный «плюс». Твой тест положительный. Насколько вероятно, что ты болен?</p>
    <p>Интуиция говорит «99%». Формула Бейеса говорит:</p>
    <p class="big">≈ 9%</p>
    <p>На 1000 человек приходится один больной с «плюсом» и около десяти здоровых с ложным «плюсом». Даже врачи в опросах часто отвечают неверно. После этой главы ты не ошибёшься.</p>`},
  tv5:{eye:'Сэмюэл Пепис и Исаак Ньютон, 1693', title:'Вопрос, который задали Ньютону',
    html:`<p>Что вероятнее: хотя бы одна шестёрка на 6 костях, хотя бы две на 12 или хотя бы три на 18? Интуиция подсказывает «одинаково»: шестёрок в среднем везде ровно столько, сколько нужно.</p>
    <p>Ньютон посчитал и ответил: вероятнее всего первый вариант.</p>
    <p class="big">0,665 · 0,619 · 0,597</p>
    <p>Все три числа — это формула Бернулли из этой главы. Попробуй потом проверить их на рисунке.</p>`},
  tv6:{eye:'Владислав Борткевич, 1898', title:'Лошади, копыта и закон Пуассона',
    html:`<p>Борткевич собрал данные по 10 корпусам прусской кавалерии за 20 лет: сколько солдат в год погибло от удара лошадиным копытом. Всего 122 случая на 200 «корпусо-лет», то есть λ = 0,61.</p>
    <p>Закон Пуассона предсказал, что лет без единой такой гибели будет около 109.</p>
    <p class="big">Предсказано 108,7 — было 109</p>
    <p>Редкие независимые события подчиняются Пуассону с пугающей точностью: аварии, опечатки, звонки в колл-центр, распад атомов.</p>`},
  tv7:{eye:'Европейская рулетка', title:'Почему казино никогда не проигрывает',
    html:`<p>На колесе 37 ячеек: 18 красных, 18 чёрных и зеро. Ставишь рубль на красное: выигрываешь рубль с вероятностью 18/37, проигрываешь — с вероятностью 19/37.</p>
    <p class="big">M(X) = 18/37 − 19/37 = −1/37 ≈ −0,027</p>
    <p>С каждого поставленного рубля казино в среднем забирает 2,7 копейки. Одна ставка — лотерея, миллион ставок — гарантированный доход. Это и есть математическое ожидание.</p>`},
  tv8:{eye:'Фрэнсис Гальтон, 1889', title:'Доска, на которой шарики рисуют колокол',
    html:`<p>Гальтон сделал доску со штырьками. На каждом штырьке шарик отскакивает влево или вправо с вероятностью ½. Путь каждого шарика непредсказуем, но внизу они выстраиваются в один и тот же колокол.</p>
    <p class="big">Хаос в каждом шарике, порядок в куче</p>
    <p>Этот колокол — нормальный закон. Он возникает везде, где много мелких независимых причин складываются вместе: рост людей, ошибки измерений, баллы за экзамен. Доска Гальтона работает на обложке этой книги.</p>`},
  tv9:{eye:'Бюффон и Карл Пирсон', title:'Сколько раз нужно бросить монету?',
    html:`<p>Бюффон бросил монету 4040 раз, и герб выпал 2048 раз. Карл Пирсон бросил 24 000 раз и получил 12 012 гербов.</p>
    <p class="big">0,5069 → 0,5005</p>
    <p>Чем больше бросков, тем ближе частота к ½: это закон больших чисел. Но он говорит только о долях. Он не обещает, что гербы и решки когда-нибудь «уравняются». Монета не помнит прошлых бросков.</p>`},
  tv10:{eye:'Пивоварня Guinness, 1908', title:'Статистик под псевдонимом Стьюдент',
    html:`<p>Уильям Госсет работал на пивоварне Guinness и проверял качество ячменя по нескольким образцам. Формулы, рассчитанные на большие выборки, на малых давали слишком узкие интервалы.</p>
    <p>Госсет вывел новое распределение, а опубликовал его под псевдонимом <b>Student</b>: пивоварня не разрешала сотрудникам печататься под своим именем.</p>
    <p class="big">t-распределение Стьюдента</p>
    <p>Теперь его используют, когда σ неизвестна, а выборка мала. Оно ждёт тебя в конце этой главы.</p>`},
  tv11:{eye:'Рональд Фишер, 1936', title:'Слишком хорошо, чтобы быть правдой',
    html:`<p>Фишер проверил по χ² знаменитые опыты Грегора Менделя с горохом и пришёл к неожиданному выводу: данные согласуются с теорией <b>слишком</b> хорошо. Случайно получить такое совпадение почти невозможно.</p>
    <p class="big">χ² подозрительно мал</p>
    <p>Споры, подправлял ли кто-то результаты, идут до сих пор. Критерий ловит не только расхождения, но и подозрительную идеальность.</p>`}
};
for (const L of BOOKS.tv.lessons) L.hook = HOOK[L.id];

/* Обложка: доска Гальтона */
BOOKS.tv.cover = el => {
  const R = 12, PEAK = U.C(R, R/2)/Math.pow(2, R);
  let N = 500, dropped = 0, frame = 0, balls = [], bins = new Array(R+1).fill(0), running = false;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const cv = U.canvas(el, w => w<420 ? .9 : .62);
  const info = h('p',{class:'cap'});
  const more = U.btn('Ещё 500 шариков', ()=>{ N += 500; if (reduce) fill(); else start(); });
  el.append(h('div',{class:'row',style:'justify-content:space-between'}, info, more));
  const fill = () => { while (dropped < N){ let k = 0; for (let r=0;r<R;r++) k += Math.random()<.5 ? 1 : 0; bins[k]++; dropped++; } draw(); };
  function draw(){
    const {g,W,H} = cv.fit(), c = U.col();
    const gap = Math.min((W-20)/(R+2), 30), vg = H*.5/R, cx = W/2, top = 10, by = top + R*vg + 10, bh = H - by - 18;
    const landed = bins.reduce((a,b)=>a+b,0), mx = Math.max(...bins, landed*PEAK, 8);
    // столбики
    for (let k=0;k<=R;k++){ const x = cx + (k - R/2)*gap, hh = bins[k]/mx*bh;
      g.fillStyle = U.hatch(g,c.pen,5); g.fillRect(x-gap*.42, by+bh-hh, gap*.84, hh); g.strokeStyle = c.ink; g.lineWidth = 1; g.strokeRect(x-gap*.42, by+bh-hh, gap*.84, hh); }
    g.strokeStyle = c.ink; g.lineWidth = 1.4; g.beginPath(); g.moveTo(cx-(R/2+.8)*gap, by+bh); g.lineTo(cx+(R/2+.8)*gap, by+bh); g.stroke();
    // теоретический колокол
    if (landed > 30){ g.save(); g.strokeStyle = c.stamp; g.lineWidth = 2; g.setLineDash([6,4]); g.beginPath();
      for (let i=0;i<=120;i++){ const k = -0.6 + i/120*(R+1.2), y = by+bh - landed*U.phi((k-R/2)/Math.sqrt(R/4))/Math.sqrt(R/4)/mx*bh; const x = cx + (k-R/2)*gap; i?g.lineTo(x,y):g.moveTo(x,y); }
      g.stroke(); g.restore(); }
    // штырьки
    g.fillStyle = c.ink;
    for (let r=0;r<R;r++) for (let j=0;j<=r;j++){ g.beginPath(); g.arc(cx+(j-r/2)*gap, top+r*vg+vg*.75, 2.2, 0, 7); g.fill(); }
    // шарики
    g.save(); g.shadowColor = c.glow; g.shadowBlur = 8; g.fillStyle = c.glow;
    for (const b of balls){ const xa = cx+(b.k-b.r/2)*gap, xb = cx+(b.k+b.n-(b.r+1)/2)*gap;
      const x = xa+(xb-xa)*b.t, y = top + (b.r+b.t)*vg + vg*.35 - Math.sin(b.t*Math.PI)*vg*.35; g.beginPath(); g.arc(x,y,3.4,0,7); g.fill(); }
    g.restore();
    info.textContent = `Шариков: ${landed}. Каждый отскакивает влево или вправо с вероятностью ½ — пунктир показывает нормальный закон.`;
  }
  function step(){
    if (!el.isConnected){ running = false; return; }
    frame++;
    if (dropped < N && frame % 2 === 0){ balls.push({r:0,k:0,t:0,n:Math.random()<.5?0:1}); dropped++; }
    for (const b of balls){ b.t += .2; if (b.t >= 1){ b.k += b.n; b.r++; b.t = 0; b.n = Math.random()<.5?0:1; if (b.r >= R){ bins[b.k]++; b.done = true; } } }
    balls = balls.filter(b=>!b.done);
    draw();
    if (balls.length || dropped < N) requestAnimationFrame(step); else running = false;
  }
  function start(){ if (!running){ running = true; requestAnimationFrame(step); } }
  if (reduce) fill(); else start();
  return draw;
};
})();
