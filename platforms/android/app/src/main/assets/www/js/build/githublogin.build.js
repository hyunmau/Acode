"use strict";(self.webpackChunkcom_foxdebug_acode=self.webpackChunkcom_foxdebug_acode||[]).push([[260],{53552:function(e,t,n){n.r(t),n.d(t,{default:function(){return b}});var r=n(7449),i=n(76972),o=n.n(i),a=n(89184),s=n.n(a),u=n(30011),c=n(71530),p="<div id='github-login' class='main'>\r\n  <form class='form' action='#'>\r\n    <input type='text' id='token' placeholder='GitHub token' />\r\n\r\n    <span id='error-msg'></span>\r\n    <div class='button-container primary'>\r\n      <button type='submit'>{{login}}</button>\r\n    </div>\r\n  </form>\r\n</div>",d=n(23324),l=n(88819),f=n(59661),g=n(4286),h=n(91400);function b(){return m.apply(this,arguments)}function m(){return(m=(0,r.Z)(o().mark((function e(){var t,n,r,i,a,b,m,k,v;return o().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return v=function(e){e.preventDefault();var n=a.value,r=d.Z.credentials;if(!n)return b.textContent="Please enter GitHub token!";localStorage.setItem("token",r.encrypt(n)),(0,l.Z)(t)},t=(0,c.Z)(strings["github login"]),n=s().parse(u.Z.render(p,strings)),r=n.get(".form"),i=n.get("input"),a=n.get("#token"),b=n.get("#error-msg"),m=s()("a",{className:"icon help",href:f.Z.GITHUB_TOKEN}),k=(0,h.Z)(g.Z.join(DATA_STORAGE,".github")),e.next=11,k.exists();case 11:if(!e.sent){e.next=13;break}k.delete();case 13:t.header.append(m),t.body=n,i.onclick=function(){return b.textContent=""},r.onsubmit=v,actionStack.push({id:"github login",action:t.hide}),t.onhide=function(){d.Z.hideAd(),actionStack.remove("github login")},Object.defineProperty(t,"setMessage",{value:function(e){b.textContent=e}}),app.append(t),d.Z.showAd();case 22:case"end":return e.stop()}}),e)})))).apply(this,arguments)}}}]);