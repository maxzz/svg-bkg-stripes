<template>
    <div class="container">
        <div class="controls">
            <button @click="clearBoxes">Clear boxes</button>
            <button @click="addBoxes">Add 10 boxes</button>
            <button @click="addBox">Add box</button>
        </div>
    
        <div class="svg-wrap">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
                <defs>
                    <linearGradient id="bkg-frame">
                        <stop offset="0%"   stop-color="olive" />
                        <stop offset="100%" stop-color="red" />
                    </linearGradient>
                </defs>

                <rect width="100" height="100" stroke="url(#bkg-frame)" stroke-width=".5" fill="aliceblue" />
                
                <rect x="50" y="50" width="2" height="2" stroke="red" stroke-width="1" fill="tomato" />

                <rect
                    v-for="box in boxes"
                    :key="box.id"
                    :x="box.x"
                    :y="box.y"
                    :width="box.w"
                    :height="box.h"
                    :fill="box.cH"
                    :style="`transform-origin: center; transform: rotate(${box.a}deg)`"
                />
                <!-- :transform="`rotate(${box.a})`" -->
            </svg>
        </div>

        <div v-if="boxes.length" class="css-box" :style="`transform-origin: center; transform: rotate(${boxes[0].a}deg)`"></div>

        <div class="stats">Total boxes: {{boxes.length}}</div>
        <div class="controls">
            <label>
                <input type="checkbox" v-model="optRotate" @click="onRotate"> Rotate
            </label>
        </div>
    </div>
</template>

<script lang="ts">
    import { defineComponent, onMounted, reactive, ref, watch } from "vue";
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
        box.h = rnd(2, 5);
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

    function useTimeout(timeoutFunc: () => void) {
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

    export default defineComponent({
        setup() {
            let state = reactive< { boxes: Box[]; optRotate: boolean } >({
                boxes: [],
                optRotate: false,
            });

            onMounted(() => state.boxes.push(...generateRandomBoxes(1)));

            const clearBoxes = () => state.boxes.length = 0;
            const addBox = () => state.boxes.push(generateRandomBox());
            const addBoxes = () => state.boxes.push(...generateRandomBoxes(10));

            const { onRotate } = useTimeout(() => {
                state.boxes.forEach((_) => _.a = _.a + 30);
            });

            return {
                ...state,
                clearBoxes,
                addBox,
                addBoxes,
                onRotate,
            };
        },
    });
</script>

<style lang="scss">
    .container {
        background-color: tomato;
        width: 100%;
        height: 100%;
        position: relative;
    }
    .controls {
        padding: 1em 0;
        user-select: none;

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
    .css-box {
        width: 300px;
        height: 10px;
        background-color: red;
    }
</style>