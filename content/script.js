var OMathContent=(()=>{var c=Object.defineProperty;var T=Object.getOwnPropertyDescriptor;var y=Object.getOwnPropertyNames;var b=Object.prototype.hasOwnProperty;var A=(n,e)=>{for(var t in e)c(n,t,{get:e[t],enumerable:!0})},E=(n,e,t,i)=>{if(e&&typeof e=="object"||typeof e=="function")for(let s of y(e))!b.call(n,s)&&s!==t&&c(n,s,{get:()=>e[s],enumerable:!(i=T(e,s))||i.enumerable});return n};var S=n=>E(c({},"__esModule",{value:!0}),n);var L={};A(L,{initProducts:()=>u});function g(n,e){n.querySelectorAll(".image").forEach(t=>M(t,e?.vendor?.photoSwipe))}function M(n,e){let t=250,i={wheelToZoom:!0,bgOpacity:.9,showAnimationDuration:t,hideAnimationDuration:t},s=new PhotoSwipeLightbox({gallery:n,children:"a[data-pswp-single]",pswpModule:PhotoSwipe,...i,...e});s.on("contentAppend",function(r){s.pswp.currSlide.data.element.querySelector("img").hasAttribute("data-invertible")&&r.content.element.setAttribute("data-invertible","")});let a=new PhotoSwipeDynamicCaption(s,{type:"below",captionContent:r=>{let l=r.data.element.closest(".image").querySelector(":scope > .caption");return l?l.innerHTML:""}});s.init()}function h(n){n.querySelectorAll(".accentBlock").forEach(e=>{let t=e.querySelector(":scope > .side > .expand");t&&t.addEventListener("click",()=>e.toggleAttribute("data-expand-open"))})}var p=class{selectorImages;displayImages;constructor(e){this.selectorImages=e.querySelectorAll(":scope > .selector > .inner > .image"),this.displayImages=e.querySelectorAll(":scope > .display > .displayImage"),this.selectorImages.forEach((s,a)=>s.addEventListener("click",()=>{this.selectorImages.forEach(r=>r.removeAttribute("data-current")),s.setAttribute("data-current",""),this.displayImages.forEach(r=>r.removeAttribute("data-current")),this.displayImages[a].setAttribute("data-current","")}));let t=parseFloat(e.getAttribute("data-start"))-1;t<0&&(t=0),t>this.selectorImages.length-1&&(t=this.selectorImages.length-1);let i=this.selectorImages[t];i&&i.click()}};function d(n){n.querySelectorAll(".gallery").forEach(e=>new p(e))}function f(n){n.querySelectorAll("a.link").forEach(e=>{let t,i=!1;e.addEventListener("click",s=>{i||!e.hasAttribute("data-preview")||(s.preventDefault(),clearTimeout(t),i=!0,t=setTimeout(()=>{i=!1},300),OMathEvent.onLinkClick(e,s))})})}function k(n){n.querySelectorAll(".task").forEach(e=>{e.querySelectorAll(":scope > header > .controls > button").forEach(t=>{t.addEventListener("click",()=>{if(t.classList.contains("generate")){globalThis.GenTaskManager.genTask(e);return}t.getAttribute("data-section")==="similar"&&!e.hasAttribute("data-similar-open")&&(e.hasAttribute("data-tasks-generated")||(e.setAttribute("data-tasks-generated",""),e.parentElement.querySelectorAll(":scope > .similarTasks .task.genTask").forEach(i=>globalThis.GenTaskManager.genTask(i)))),e.toggleAttribute(`data-${t.getAttribute("data-section")}-open`)})})})}var m=class{elements;constructor(e){this.elements={},this.elements.task=e,this.elements.statement=e.querySelector(":scope > .statement"),this.elements.sections={},e.querySelectorAll("section").forEach(t=>{this.elements.sections[t.getAttribute("data-name")]=t})}get statement(){return this.elements.statement.innerHTML}set statement(e){this.elements.statement.innerHTML=e}getSectionNames(){return Object.keys(this.elements.sections)}getSectionContent(e){let t=this.elements.sections[e];return t?t.querySelector(":scope > .inner > .content").innerHTML:null}setSectionContent(e,t){let i=this.elements.sections[e];i&&(i.querySelector(":scope > .inner > .content").innerHTML=t)}},o=class{worker;taskMap={};initWorker(){this.worker=new Worker(globalThis.TaskGenUrl),this.worker.onmessage=e=>{this.setupTask(e.data)}}genTask(e){let t=e.getAttribute("data-script-id");if(this.taskMap[t])return;let i=new m(e);this.taskMap[t]=i,e.setAttribute("data-generating","");let s={};s.scriptId=t,s.script=e.getAttribute("data-script"),s.statement=i.statement;let a={};i.getSectionNames().forEach(r=>{a[r]=i.getSectionContent(r)}),Object.keys(a).length>0&&(s.sections=a),this.worker||this.initWorker(),this.worker.postMessage(s)}setupTask(e){let t=this.taskMap[e.scriptId];t.statement=e.statement,e.sections&&Object.keys(e.sections).forEach(i=>{t.setSectionContent(i,e.sections[i])}),u(t.elements.task,globalThis.OMathContentOptions??{}),t.elements.task.removeAttribute("data-generating"),delete this.taskMap[e.scriptId]}};var w=[g,h,d,f,k];function u(n,e={}){n&&w.forEach(t=>t(n,e))}globalThis.GenTaskManager=new o;return S(L);})();
