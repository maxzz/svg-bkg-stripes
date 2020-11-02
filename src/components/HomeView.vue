<template>
    <div class="container">
        <button @click="addBox">Add stripe</button>
    
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
                    :fill="`hsla(${box.cH}, 100%, 50%)`"
                />
            </svg>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, reactive } from "vue";
import * as colors from '../materialui-swatches';

function randomFlt(min: number, max: number, includeMax: 0 | 1 = 1): number {
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

type Box = {
    id: string;
    x: number;
    y: number;
    w: number;
    h: number;
    a: number; // angle
    cH: number; // color hue
};

function generateBox(): Box {
    return {
        id: Date.now().toString(36),
        x: 50,
        y: 50,
        w: 40,
        h: 10,
        a: 0,
        cH: 0,
    };
}

function generateRandomBox(): Box {
    let box = generateBox();
    box.w = rnd(40, CONST.SCENE_W);
    box.h = rnd(2, 10);
    box.x = rnd(0, CONST.SCENE_W - box.w);
    box.y = rnd(0, CONST.SCENE_H - box.h);
    //box.a = rnd(0, 360);
    box.cH = rnd(0, 36, 0) * 10;
    return box;
}

function generateRandomBoxes(total: number): Box[] {
    return Array.from(Array(total), (v, i) => generateRandomBox());
}

export default defineComponent({
    setup() {
        let state = reactive<{boxes: Box[]}>({
            boxes: generateRandomBoxes(10)
        });

        console.log('colors', colors);

        // const timer = setInterval(() => {
        //     state.boxes.forEach((_) => _.a = _.a + 30);
        // }, 1000);

        const addBox = () => state.boxes.push(generateRandomBox());

        return {
            ...state,
            addBox,
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
    .svg-wrap {
        svg {
            width: 80vw;
            border: 4px solid white;
            //height: 400px;
        }
    }
</style>