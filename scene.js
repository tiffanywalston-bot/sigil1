/**
 * ============================================================
 * SIGIL1 ENGINE
 * Gold Master Scene Definition
 * Version: 1.0
 * ============================================================
 */

export const Scene = {

    metadata: {
        name: "SIGIL1 ENGINE",
        version: "1.0",
        description: "Gold Master Architecture",
        renderer: "Canvas2D",
        state: "STATIC_REFERENCE"
    },

    colors: {
        background: "#04060F",
        gold: "#E9C46A",
        white: "#FFFFFF",
        blue: "#5FB8FF",
        purple: "#B47DFF",
        pink: "#FF8AD8",
        green: "#95F48F",
        orange: "#F7A84B"
    },

    source: {
        id: "source",
        x: 0.5,
        y: 0.05,
        radius: 28,
        glow: 1.0
    },

    axis: {
        id: "core-axis",
        x: 0.5,
        top: 0.05,
        bottom: 0.95
    },

    harmonicAxis: {
        id: "harmonic-axis",
        pulse: true,
        amplitude: 1.0
    },

    geometry: {

        leftIdentity:{
            id:"identity-left",
            x:0.35,
            y:0.28,
            radius:90
        },

        rightIdentity:{
            id:"identity-right",
            x:0.65,
            y:0.28,
            radius:90
        },

        engineCore:{
            id:"engine-core",
            x:0.5,
            y:0.43,
            radius:70
        },

        magneticField:{
            id:"magnetic-field",
            x:0.5,
            y:0.58,
            radius:110
        }
    },

    pregnancyHarmonic:{

        id:"pregnancy-harmonic",

        x:0.5,
        y:0.78,

        jewel:{
            visible:true,
            scale:1.0,
            glow:0.85,
            state:"DORMANT"
        },

        lotus:{
            petals:12,
            scale:1.2
        }

    },

    manifestation:{
        id:"manifestation",
        x:0.5,
        y:0.91
    },

    rings:[

        {
            id:"ring1",
            radius:120,
            thickness:2
        },

        {
            id:"ring2",
            radius:180,
            thickness:2
        },

        {
            id:"ring3",
            radius:250,
            thickness:2
        }

    ],

    instruments:[

        {
            id:"identity-crystal",
            side:"left",
            y:0.28
        },

        {
            id:"intention-prism",
            side:"left",
            y:0.42
        },

        {
            id:"reinforcement-crystal",
            side:"left",
            y:0.54
        },

        {
            id:"axis-anchor",
            side:"left",
            y:0.66
        },

        {
            id:"environment-lantern",
            side:"left",
            y:0.80
        },

        {
            id:"harmonic-resonator",
            side:"right",
            y:0.28
        },

        {
            id:"emotional-amplifier",
            side:"right",
            y:0.42
        },

        {
            id:"wav-resonator",
            side:"right",
            y:0.54
        },

        {
            id:"subliminal-prism",
            side:"right",
            y:0.66
        },

        {
            id:"manifestation-key",
            side:"right",
            y:0.80
        }

    ],

    background:{

        milkyWayTop:true,
        milkyWayBottom:true,
        stars:true,
        constellations:true
    }

};