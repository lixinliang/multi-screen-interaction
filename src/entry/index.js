import './sass/index.scss';
import $ from 'jquery';
import flappybird from './modules/flappybird';

window.jQuery = $;

let gamepad = `${ location.origin }/_gamepad.html`;

let url = `${ location.protocol }//${ location.hostname }@PORT`;

$(() => {
    let socket = io.connect(url);

    /**
    * Create an unique uid and qrcode
    * @type {Number} uid
    */
    socket.emit('create', ['gamepad:touch'], function ( uid ) {

        /**
         * Create Qrcode, base on uid
         */
        $('.qrcode').qrcode({
            width : 200,
            height : 200,
            correctLevel : 0,
            text : `${ gamepad }?uid=${ uid }`,
        });

        /**
         * Play game
         */
        let game = flappybird();
        socket.on('gamepad:touch', () => {
            game.play();
        });
    });
});
