/**
 * @name QQEmojiRain
 * @author contentdeleted
 * @description Adds an emoji rain effect similar to the chat client QQ when certain phrases appear in chat
 * @version 0.9
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
            let msg = String(node.innerText).toLowerCase()
            if(/(merry|happy)/.test(msg)) {
              this.createOverlay(msg);
            }
          }
        });
      }
    }

    fixedEmojis = {
        'omar': 'https://cdn.discordapp.com/emojis/373566796013240320.webp?size=56&amp;quality=lossless',
        'randy': 'https://cdn.discordapp.com/emojis/373566894969585664.webp?size=56&quality=lossless',
        'starbound': 'https://cdn.discordapp.com/emojis/373566965291286529.webp?size=56&quality=lossless',
        'christmas': 'https://discord.com/assets/2f5331445a4647af2bb317862b38502a.svg',
        'birthday': '/assets/496cd7d4bfc59cdf6cd8a3285b42b576.svg',
        'easter': '/assets/5ca0c0b0ad60ee4b580e7ed918426cdb.svg',
        'halloween': '/assets/549e0b9954236583f841032b85ba45f9.svg',
        'new year': '/assets/b052a4bef57c1aa73cd7cff5bc4fb61d.svg',
        'matt damon': 'https://camo.githubusercontent.com/7cd99bb9d2d6b925f0e84f1675c71879cfbec05213282ace5aae00c470da8ad2/68747470733a2f2f7261776769742e636f6d2f71697579696e676875612f7765636861742d656d6f7469636f6e732f6d61737465722f696d616765732f636f6d6d616e646f2e706e67',
    }

    createOverlay(msg) {
      const messagesWrapper = document.querySelector("[class^='messagesWrapper-']");
      if(!messagesWrapper) return;
    
      // create emoji array
      let emojis = [];
      Object.entries(this.fixedEmojis).forEach(([word, img]) => {
        if(msg.includes(word)) {
            emojis.push(img);
        }
      });
    
      if(!emojis.length) return;

      // create a new div element
      const newDiv = document.createElement("div");
      
      let maxOffset = -1;
      let total = 50;
      for(let i = 0; i < total; i++) {
        const innerDiv = document.createElement("div");
        const newContent = document.createElement("img");
        newContent.src = emojis[Math.floor((i / total) * emojis.length)];
        newContent.className = "emoji";
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
    }
}