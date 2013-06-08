Types = {
    Messages: {
        HELLO: 'HELLO',
        ERROR: 'ERROR',
        MAKE_WORLD: 'MAKE_WORLD',
        MAKE_STAR: 'MAKE_STAR',
        MAKE_PLANET: 'MAKE_PLANET',
        SET_RESOURCES: 'SET_RESOURCES'
    },
    Entities: {
        STAR: 'STAR',
        PLANET: 'PLANET'
    },
    BotLevels: {
        EASY: 'EASY',
        MEDIUM: 'MEDIUM',
        HARD: 'HARD'
    },
    SystemSizes: {
        s3: 3,
        s6: 6,
        s9: 9
    },
    Positions: {
        LEFT: 'left',
        RIGHT: 'right'
    },
    Richness: {
        POOR: 0.7,
        AVERAGE: 1.0,
        RICH: 1.5
    },
    PlanetSizes: {
        SMALL: 10000,
        AVERAGE: 30000,
        LARGE: 80000
    },
    StarSprites: {
        s0: 'sun.png'
    },
    SpeedRatio: {
        PLANET: 50000
    }
};

if(!(typeof exports === 'undefined')) {
    module.exports = Types;
}
