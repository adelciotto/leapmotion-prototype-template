/*
 * leap_controller.js
 * Copyright (C) 2015 adelciotto <anthdel.developer@gmail.com>
 *
 * Distributed under terms of the MIT license.
 */

import Leap from 'leapjs';
import LeapUtils from './leap_utils';
import utils from '../utils';
import _ from 'underscore';

const MinHandVisible = 0.25;
const MinHandConfidence = 0.5;

export default class LeapController {
    constructor(game, options = {}) {
        utils.objCheckDefaults(options, LeapUtils.DefaultOpts);

        this._game = game;
        this._options = options;
        this._listeners = {};
        this._timePinched = 0;

        // initialise leapjs
        this._controller = new Leap.Controller({ enableGestures: true });
        this._controller.connect();
        this._controller.on('frame', this._onFrame.bind(this));
    }

    on(listener, callback, ctx = null, options = {}) {
        utils.objCheckDefaults(options, listener.defaultOpts);

        this._listeners[listener.name] = {
            callback: callback.bind(ctx),
            options: options
        };
    }

    _onFrame(frame) {
        _.each(frame.hands, (hand) => {
            // check the time the hand has been visible to the device.
            // This helps ensure that minor motion or environmental changes not in control of the
            // player don't affect the gameplay.
            if (hand && hand.timeVisible > MinHandVisible && hand.confidence >= MinHandConfidence) {
                if (hand.pinchStrength < this._options.minPinchStrength - 0.25) {
                    this._timePinched = 0;
                }

                _.each(this._listeners, (val, key) => {
                    this[`_process${key}`](frame, hand, val);
                });
            }
        });
    }

    _processOnMove(frame, hand, listener) {
        const opts = listener.options;
        const pos = (opts.axis === LeapUtils.Axis.ALL ? hand.stabilizedPalmPosition :
                hand.stabilizedPalmPosition[opts.axis]);

        listener.callback(pos, hand);
    }

    _processOnRotate(frame, hand, listener) {
        const angle = hand[listener.options.rotAngle]();
        listener.callback(angle);
    }

    _processOnPinching(frame, hand, listener) {
        if (hand.pinchStrength >= this._options.minPinchStrength) {
            listener.callback(LeapUtils.findPinchingFinger(hand), hand);
        }
    }

    _processOnPinched(frame, hand, listener) {
        if (hand.pinchStrength >= this._options.minPinchStrength && this._timePinched <
                listener.options.pinchDuration) {
            listener.callback(LeapUtils.findPinchingFinger(hand), hand);
            this._timePinched += this._game.time.elapsed;
        }
    }
}
