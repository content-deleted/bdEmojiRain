/**
 * @name QQEmojiRain
 * @author contentdeleted
 * @description Adds an emoji rain effect similar to the chat client QQ when certain phrases appear in chat
 * @version 0.0.2
 * @source https://github.com/content-deleted/bdEmojiRain
 * @updateUrl https://raw.githubusercontent.com/content-deleted/bdEmojiRain/main/QQEmojiRain.plugin.js
 */

 module.exports = class QQEmojiRain {
    'use strict'
    intitalized = false;

    // Called when the plugin is activated (including after reloads)
    start() {
      if(this.intitalized) {
        return
      }

      this.clearState();

      // Add css
      BdApi.injectCSS("QQEmojiRain", `.qqDrop {
        position: absolute;
        bottom: 100%;
        width: 15px;
        height: 120px;
        pointer-events: none;
        animation: qqdropframes 2s linear infinite;
      }
      
      @keyframes qqdropframes {
        0% {
          transform: translateY(0vh);
        }
        85% {
          transform: translateY(96vh);
        }
        100% {
          transform: translateY(96vh) scale(1.5);
        }
      }`);

      console.log("started jacobs plugin");
      this.intitalized = true;
    } 

    // Called when the plugin is deactivated
    stop() {
      if(!this.intitalized) return;
      this.intitalized = false;
    }

    clearState() {
      this.State = {
        running: false,
        rain: {
          matt: -1,
          christmas: -1,
        }
      }
    }

    observer(e) {
      if(e && e.addedNodes && e.addedNodes.length) {
        e.addedNodes.forEach(node => {
          if(node && node.className && String(node.className).startsWith("message")) {
            if(String(node.innerText).toLowerCase().includes("matt damon")) {
              console.log("rain starting");
              this.createOverlay();
            }
          }
        });
      }
    }

    createOverlay() {
      const messagesWrapper = document.querySelector("[class^='messagesWrapper-']");
      if(!messagesWrapper) return;
    
      // create a new div element
      const newDiv = document.createElement("div");
      
      let maxOffset = -1;
      for(let i = 0; i < 50; i++) {
        const innerDiv = document.createElement("div");
        const newContent = document.createTextNode("😅");
        innerDiv.appendChild(newContent);
        innerDiv.className = 'qqDrop';
        let xOffset = Math.random() * 100;
        let tOffset = Math.random() * 2;
        innerDiv.style = `left: ${xOffset}%; animation-delay: ${tOffset}s;`; 
    
        // add the text node to the newly created div
        newDiv.appendChild(innerDiv);

        setTimeout(function() {
          innerDiv.remove();
        }, 2000 * 3 + tOffset * 1000);

        // find max to know when to remove div
        Math.max(maxOffset, tOffset);
      }
    
      // add the newly created element and its content into the DOM
      messagesWrapper.appendChild(newDiv);

      // remove when all drops are gone
      setTimeout(function() {
        newDiv.remove();
      }, 2000 * 5 + maxOffset * 1000);
    }

    onSwitch() {
      this.clearState();
      // this.createOverlay();
    }
}