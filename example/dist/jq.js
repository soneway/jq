!function(t,n){function e(n){if(this.length=0,"string"==typeof n){if("#"===n[0]){var e=n.slice(1);if(b.test(e)){var i=d.getElementById(e);return i&&(this[this.length++]=i),this}}if("."===n[0]){var o=n.slice(1);if(b.test(o))return r(d.getElementsByClassName(o),this)}if("<"===n[0]&&">"===n[n.length-1]){var c=d.createElement("div");return c.innerHTML=n,r(c.childNodes,this)}return r(d.querySelectorAll(n),this)}return n instanceof p||n===t?(this[this.length++]=n,this):n&&n.length>0?r(n,this):"function"==typeof n?l().ready(n):void 0}function r(t,n){return t?(o(t,function(t){n[n.length++]=t}),n):n}function i(t){return S[t]||(S[t]=new w("(^|\\s)"+t+"(\\s|$)"))}function o(t,n){for(var e=0,r=t.length;r>e;e++)n(t[e])}function c(t,n){var e=t+"-"+n;if(!O[e]){var r=d.createElement(t);j.appendChild(r),O[e]=v(r)[n],j.removeChild(r)}return O[e]}function s(t,e){return l(e===n?t:x.call(t,function(t){return t.matchesSelector(e)}))}function u(t,e,r,i){o(e.split(N),function(e){i===n?t.addEventListener(e,r,!1):t.addEventListener(e,function(n){var e=l(n.target).closest(i,t)[0];e&&r.call(e,n)},!1)})}function a(t,n,e){o(n.split(N),function(n){t.removeEventListener(n,e,!1)})}function f(t){var n=d.createEvent("Events");return n.initEvent(t,!0,!0),n}function h(t){var n=[];for(var e in t)n.push(e+"="+t[e]);return n.join("&")}var l=function(t){return new e(t)},d=t.document,p=t.Node,v=t.getComputedStyle,m={}.toString,g=[],y=g.slice,E=g.indexOf,x=g.filter,C="-webkit-",b=/^[\w-]*$/,N=/\s+/g,S={},w=t.RegExp,j=d.body,O={},T=d.head,A=t.XMLHttpRequest,L=Element.prototype;return L.matchesSelector||(L.matchesSelector=L.webkitMatchesSelector||L.msMatchesSelector||L.mozMatchesSelector),o(["Object","Array","Function"],function(t){l["is"+t]=function(n){return m.call(n)==="[object "+t+"]"}}),l.extend=function(t){if(t===n)return this;if(1===arguments.length){for(var e in t)this[e]=t[e];return this}return o(y.call(arguments,1),function(n){for(var e in n)t[e]=n[e]}),t},l.fn=e.prototype={constructor:e,forEach:function(t){for(var n=0,e=this.length;e>n;n++)t(this[n],n);return this},each:function(t){return this.forEach(function(n,e){t.call(n,e)})},ready:function(t){var n=d.readyState;return"complete"===n||"loaded"===n||"interactive"===n?t():u(d,"DOMContentLoaded",t),this},filter:function(t){return s(this,t)},siblings:function(t){var n=[];return this.forEach(function(t){o(t.parentNode.children,function(e){e!==t&&n.indexOf(e)<0&&n.push(e)})}),s(n,t)},not:function(t){if(t===n)return this;var e=[];return this.forEach(function(n){!n.matchesSelector(t)&&e.push(n)}),l(e)},find:function(t){var n=[];return this.forEach(function(e){o(e.querySelectorAll(t),function(t){n.indexOf(t)<0&&n.push(t)})}),l(n)},eq:function(t){return l(this[t])},children:function(t){var n=[];return this.forEach(function(t){o(t.children,function(t){n.push(t)})}),s(n,t)},parent:function(t){var n=[];return this.forEach(function(t){var e=t.parentNode;e!==d&&n.indexOf(e)<0&&n.push(e)}),s(n,t)},parents:function(t){var n=[];return this.forEach(function(t){for(;t=t.parentNode;)t!==d&&n.indexOf(t)<0&&n.push(t)}),s(n,t)},closest:function(t,n){for(var e=this[0];e&&!e.matchesSelector(t);){var r=e.parentNode;e=r===d?null:e!==n&&r}return l(e)},index:function(t){return t instanceof e&&(t=t[0]),t?E.call(this,t):E.call(this[0].parentNode.children,this[0])},html:function(t){return this.prop("innerHTML",t)},text:function(t){return this.prop("textContent",t)},val:function(t){return this.prop("value",t)},attr:function(t,n,e){return this.prop(t,n,!0,e)},prop:function(t,e,r,i){return i===n&&(i=""),"string"==typeof t&&e===n?(t=i+t,r?this[0].getAttribute(t):this[0][t]):this.forEach(function(n){if(l.isObject(t))for(var o in t){var c=t[o];o=i+o,r?n.setAttribute(o,c):n[o]=c}else t=i+t,r?n.setAttribute(t,e):n[t]=e})},data:function(t,n){return this.attr(t,n,"data-")},removeAttr:function(t){return this.forEach(function(n){o(t.split(N),function(t){n.removeAttribute(t)})})},css:function(t,e){if("string"==typeof t&&e===n){if(this[0]instanceof p){var r=v(this[0]);return r[t]||r[C+t]}return n}return this.forEach(function(n){var r=n.style;if(l.isObject(t))for(var i in t)r[i]=r[C+i]=t[i];else r[t]=r[C+t]=e})},show:function(){return this.forEach(function(t){var n=t.style;return"none"===n.display?n.display=null:void(n.display=c(t.tagName,"display"))})},hide:function(){return this.css("display","none")},fadeIn:function(){return this.removeClass("fade-out").addClass("fade-in")},fadeOut:function(){return this.removeClass("fade-in").addClass("fade-out")},append:function(t,n){var r=t instanceof e?t:l(t);return this.forEach(function(t){r.forEach(function(e){n?t.insertBefore(e,t.firstChild):t.appendChild(e)})})},prepend:function(t){return this.append(t,!0)},appendTo:function(t,n){var r=t instanceof e?t:l(t);return r.append(this,n),this},prependTo:function(t){return this.appendTo(t,!0)},wrap:function(t){var n=t instanceof e?t:l(t);return this.forEach(function(t){t.parentNode.insertBefore(n[0],t),n.append(t)})},offset:function(){var n=this[0].getBoundingClientRect();return n.left+=t.pageXOffset,n.top+=t.pageYOffset,n},width:function(){var n=this[0];return n===t?t.innerWidth:n.offsetWidth},height:function(){var n=this[0];return n===t?t.innerHeight:n.offsetHeight},is:function(t){return t&&this[0].matchesSelector(t)},addClass:function(t){return this.forEach(function(n){var e=n.className,r=t.split(N).filter(function(t){return!i(t).test(e)});r.length>0&&(n.className=[e].concat(r).join(" ").trim())})},removeClass:function(t){return this.forEach(function(e){if(t===n)return e.className="";var r=e.className;o(t.split(N),function(t){r=r.replace(i(t)," ")}),e.className=r.trim()})},hasClass:function(t){return i(t).test(this[0].className)}},l.fn.extend=function(t){l.extend.call(this,t)},l.fn.extend({bind:function(t,n){return this.forEach(function(e){u(e,t,n)})},unbind:function(t,n){return this.forEach(function(e){a(e,t,n)})},delegate:function(t,n,e){return this.forEach(function(r){u(r,t,e,n)})},on:function(t,n,e){return"function"==typeof n?this.bind(t,n):this.delegate(t,n,e)},off:function(t,n){return this.unbind(t,n)},trigger:function(t){return t=f(t),this.forEach(function(n){n.dispatchEvent(t)})}}),o(["click","touchstart","touchmove","touchend","submit","load","resize","change","select"],function(t){l.fn[t]=function(n){return n?this.bind(t,n):this.trigger(t)}}),l.getScript=function(t,n){var e=/(\.js)$/.test(t),r=d.createElement("script");r.type="text/javascript",r.onload=function(){"function"==typeof n&&n(),!e&&T.removeChild(r)},r.src=t,T.appendChild(r)},l.ajax=function(t){t=l.extend({},l.ajax.defaults,t);var n=new A;n.open(t.type.toUpperCase(),t.url,t.async);var e=t.header||{};e["Content-Type"]=t.contentType;for(var r in e)n.setRequestHeader(r,e[r]);n.onreadystatechange=function(){if(4===n.readyState){if(n.status>=200&&n.status<300||304==n.status){var e=t.success;"function"==typeof e&&e(n)}else{var r=t.error;"function"==typeof r&&r(n)}var i=t.complete;"function"==typeof i&&i(n)}},n.send(h(t.data)||null)},l.ajax.defaults={type:"GET",contentType:"application/x-www-form-urlencoded",async:!0},"object"==typeof exports?module.exports=l:void(t.jq=t.$=l)}(window);