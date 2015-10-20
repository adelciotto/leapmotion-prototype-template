/*
 * play.js
 * Copyright (C) 2015 adelciotto <anthdel.developer@gmail.com>
 *
 * Distributed under terms of the MIT license.
 */

require('leapjs-plugins');

import { constants } from '../constants';
import Leap from 'leapjs';

export default class PlayState extends Phaser.State {
    create() {
        this.logo = this.add.sprite(this.world.centerX, this.world.centerY,
                                    constants.AssetKeys.PHASER_LOGO);
        this.logo.anchor.set(0.5);
        this.helpText = this.add.text(this.game.width/2, this.game.height*0.9,
                                      'Roll your hand to rotate the image',
                                      { fontSize: 32, align: 'center' });
        this.helpText.anchor.set(0.5);

        this.controller = new Leap.Controller({ enableGestures: true });
        this.controller.connect();

        this.controller.on('frame', this._onFrame.bind(this));
    }

    _onFrame(frame) {
        frame.hands.forEach((hand, idx) => {
            this.logo.rotation = -hand.roll();
        });
    }
}
