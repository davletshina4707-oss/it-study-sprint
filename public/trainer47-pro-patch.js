(()=>{
  const $=(s,r=document)=>r.querySelector(s)
  function patch(){
    const shell=$('.a47-pro-shell');if(!shell)return
    const h=$('.a47-pro-head h2',shell);if(h&&h.textContent.includes('без повторов'))h.textContent='Внимание + логика с защитой от повторов'
    const title=$('.a47-pro-title',shell),lead=$('.a47-pro-lead',shell);if(!title||!lead)return
    if(title.textContent==='Задача на размещение'&&!title.dataset.fixed){
      title.dataset.fixed='1'
      if(lead.textContent.includes('Пять человек')){
        lead.textContent='Пять человек сидят в ряд. Егор сидит первым. Даша — на правом краю. Аня сидит сразу справа от Егора. Борис сидит сразу слева от Даши. Кто сидит в центре?'
        title.dataset.reason='Получается: Егор — 1, Аня — 2, Глеб — 3, Борис — 4, Даша — 5. Значит, в центре Глеб.'
      }else{
        lead.textContent='Четыре человека сидят в ряд. Глеб сидит слева, Борис — справа. Аня не сидит рядом с Борисом. Кто занимает третью позицию?'
        title.dataset.reason='Глеб занимает 1-е место, Борис — 4-е. Аня не может быть на 3-м рядом с Борисом, значит Аня на 2-м, а Даша — на 3-м.'
      }
    }
    if(title.textContent==='Кто говорит правду?'&&lead.textContent.includes('ровно двое')&&!title.dataset.fixed){
      title.dataset.fixed='1'
      lead.textContent='Из четырёх людей ровно один говорит правду. Аня: «Борис лжёт». Борис: «Вика лжёт». Вика: «Аня говорит правду». Глеб: «Борис и Вика оба говорят правду». Кто говорит правду?'
      title.dataset.reason='Если Борис говорит правду, Вика лжёт; тогда Аня тоже лжёт, а фраза Глеба ложна. Получается ровно одна истина — у Бориса. При предположении, что Борис лжёт, истинных высказываний становится больше одного.'
    }
    const fb=$('.a47-pro-feedback',shell)
    if(fb&&fb.style.display!=='none'&&title.dataset.reason&&!fb.dataset.fixed){
      const first=fb.querySelector('b')?.textContent||'';fb.innerHTML=`<b>${first}</b><br>${title.dataset.reason}`;fb.dataset.fixed='1'
    }
  }
  let busy=false;const scan=()=>{if(busy)return;busy=true;requestAnimationFrame(()=>{busy=false;patch()})};new MutationObserver(scan).observe(document.documentElement,{childList:true,subtree:true,attributes:true});scan()
})()
