/*
 * leap_listeners.js
 * Copyright (C) 2015 adelciotto <anthdel.developer@gmail.com>
 *
 * Distributed under terms of the MIT license.
 */

import utils from '../utils';
import LeapUtils from './leap_utils';

const LeapListeners = {
    OnMove: {
        name: 'OnMove',
        defaultOpts: { axis: LeapUtils.Axis.ALL }
    },
    OnRotate: {
        name: 'OnRotate',
        defaultOpts: { rotAngle: LeapUtils.RotAngles.ROLL }
    },
    OnPinching: {
        name: 'OnPinching'
    },
    OnPinched: {
        name: 'OnPinched',
        defaultOpts: { pinchDuration: 15 }
    }
};

utils.objFreezeRecursive(LeapListeners);
export default LeapListeners;

