import { reactive, Ref, ref, watch } from "vue";
import { complete as colors } from './materialui-swatches';

function rndInt(min: number, max: number, includeMax: 0 | 1 = 1): number {
    return Math.floor(Math.random() * (max - min + includeMax)) + min;
}

function rnd(min: number, max: number, includeMax: 0 | 1 = 1): number {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + includeMax) + min);
}

export const enum CONST {
    SCENE_W = 100,
    SCENE_H = 100,
}

export const N_SWATCHES = Object.keys(colors).length;

function getRandomPalleteColor() {
    // 1. select pallete
    let keysColors = Object.keys(colors);
    let whichPallete = rndInt(0, keysColors.length, 0);
    let pallete = colors[keysColors[whichPallete]];

    // 2. select color from pallete
    let keys = Object.keys(pallete);
    let nColors = keys.length;
    let colorName = keys[rndInt(0, nColors, 0)];
    let color = pallete[colorName];
    return color;    
}

export type Box = {
    id: string;
    x: number;
    y: number;
    w: number;
    h: number;
    angle: number; // angle in degrees
    fill: number; // color hue
};

function initBox(): Box {
    return {
        id: Date.now().toString(36),
        x: 50, // TODO: get half of schene width
        y: 50,
        w: 40,
        h: 10,
        angle: 0,
        fill: 0,
    };
}

export function generateRandomBox(): Box {
    let box = initBox();
    box.w = rnd(40, CONST.SCENE_W);
    box.h = rnd(1, 3);
    box.x = rnd(0, CONST.SCENE_W - box.w);
    box.y = rnd(0, CONST.SCENE_H - box.h);
    box.fill = getRandomPalleteColor();
    return box;
}

export function generateRandomBoxes(total: number): Box[] {
    return Array.from(Array(total), (v, i) => generateRandomBox());
}

export function useTimeout(timeoutFunc: () => void) {
    let timeoutID = 0;

    const onRotate = (e: MouseEvent) => {
        let checked = (e.target as HTMLInputElement).checked;
        if (checked) {
            if (timeoutID) {
                clearInterval(timeoutID);
                timeoutID = 0;
            }
            timeoutID = window.setInterval(timeoutFunc, 1000);
        } else {
            if (timeoutID) {
                clearInterval(timeoutID);
                timeoutID = 0;
            }
        }
    };
    return {
        onRotate
    }
}

export function useGlobalRotationAngle(boxes: Ref<Box[]>) {

    const state = reactive({
        globalAngle: 0,
        globalAngleOn: false,
    });
    const globalAngleOn = ref(false);

    function onGlobalAngleOn(event: MouseEvent) {
        state.globalAngleOn = (event.target as HTMLInputElement).checked;

        console.log('onGlobalAngleOn', state.globalAngleOn, boxes.value);

        if (state.globalAngleOn) {
            boxes.value.forEach((box) => box.angle = state.globalAngle);
            console.log('a', state.globalAngle, boxes.value);
        }
    }

    watch(() => state.globalAngle, () => {
        if (state.globalAngleOn) {
            boxes.value.forEach((box) => box.angle = state.globalAngle);
            console.log('update');
        }
    });

    return {
        state,
        onGlobalAngleOn
    }
}    
