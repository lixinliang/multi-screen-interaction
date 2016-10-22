import './sass/gamepad.scss';

import getUrlParam from './modules/getUrlParam.js';

document.body.addEventListener('touchmove', ( event ) => {
    event.stopPropagation();
    event.preventDefault();
}, false);

let play = document.querySelector('.play');
let text = document.querySelector('p');

let url = `${ location.protocol }//${ location.hostname }@PORT`;

document.addEventListener('DOMContentLoaded', () => {
    let socket = io.connect(url);
    let uid = getUrlParam('uid');
    if (!uid) {
        text.innerHTML = '连接失败!';
        throw 'Gamepad requires uid!';
    }
    text.innerHTML = '连接成功!<br>正在加入房间...';
    socket.emit('join', uid, ( err ) => {
        if (err) {
            text.innerHTML = '加入房间失败!';
            throw 'Uid is incorrect !';
        }
        /**
        * gamepad:touch
        */
        text.innerHTML = '连接成功!<br>点击屏幕开始游戏';
        play.addEventListener('touchstart', () => {
            play.classList.add('active');
            socket.emit('gamepad:touch');
        }, false);
        play.addEventListener('touchend', () => {
            play.classList.remove('active');
        }, false);
        play.addEventListener('touchcancel', () => {
            play.classList.remove('active');
        }, false);
    });
}, false);
