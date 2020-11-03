<template>
    <div class="container">
        <div class="controls">
            <button @click="clearBoxes">Clear boxes</button>
            <button @click="addBoxes">Add 10 boxes</button>
            <button @click="addBox">Add box</button>
        </div>
    
        <div class="svg-wrap">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
                <rect width="100" height="100" stroke="black" stroke-width=".5" fill="aliceblue" />
                <rect
                    v-for="box in boxes"
                    :key="box.id"
                    :x="box.x"
                    :y="box.y"
                    :width="box.w"
                    :height="box.h"
                    :transform="`rotate(${box.a})`"
                    transform-origin="50%, 50%"
                    :fill="box.cH"
                />
                <!-- :fill="`hsla(${box.cH}, 100%, 50%)`" -->
            </svg>
        </div>
        <div class="stats">Total boxes: {{boxes.length}}</div>
    </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, ref } from "vue";
import { complete as colors } from '../materialui-swatches';

function rndInt(min: number, max: number, includeMax: 0 | 1 = 1): number {
    return Math.floor(Math.random() * (max - min + includeMax)) + min;
}

function rnd(min: number, max: number, includeMax: 0 | 1 = 1): number {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + includeMax) + min);
}

const enum CONST {
    SCENE_W = 100,
    SCENE_H = 100,
}

const N_SWATCHES = Object.keys(colors).length;

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

type Box = {
    id: string;
    x: number;
    y: number;
    w: number;
    h: number;
    a: number; // angle
    cH: number; // color hue
};

function initBox(): Box {
    return {
        id: Date.now().toString(36),
        x: 50, // TODO: get half of schene width
        y: 50,
        w: 40,
        h: 10,
        a: 0,
        cH: 0,
    };
}

function generateRandomBox(): Box {
    let box = initBox();
    box.w = rnd(40, CONST.SCENE_W);
    box.h = rnd(2, 10);
    box.x = rnd(0, CONST.SCENE_W - box.w);
    box.y = rnd(0, CONST.SCENE_H - box.h);
    //box.a = rnd(0, 360);

    box.cH = getRandomPalleteColor();
    // box.cH = rnd(0, 36, 0) * 10;

    return box;
}

function generateRandomBoxes(total: number): Box[] {
    return Array.from(Array(total), (v, i) => generateRandomBox());
}

export default defineComponent({
    setup() {
        let state = reactive<{boxes: Box[]}>({
            boxes: []
        });

        // const timer = setInterval(() => {
        //     state.boxes.forEach((_) => _.a = _.a + 30);
        // }, 1000);

        onMounted(() => state.boxes.push(...generateRandomBoxes(1)));

        // const clearBoxes = () => {
        //     console.log('before', state.boxes);
        //     state.boxes.length = 0;
        //     console.log('after ', state.boxes);
        // };
        //const clearBoxes = () => state.boxes = reactive([]);
        const clearBoxes = () => state.boxes.length = 0;
        const addBox = () => state.boxes.push(generateRandomBox());
        const addBoxes = () => state.boxes.push(...generateRandomBoxes(10));

        return {
            ...state,
            clearBoxes,
            addBox,
            addBoxes,
        };
    },
});
</script>

<style lang="scss">
    .container {
        background-color: tomato;
        width: 100%;
        height: 100%;
    }
    .controls {
        padding: 1em 0;
        button {
            padding: .4em;
            margin-left: .2em;
        }
    }
    .svg-wrap {
        svg {
            width: 80vw;
            border: 4px solid white;
            //height: 400px;
        }
    }
</style>