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
        3: 'Three planets',
        6: 'Six planets',
        9: 'Nine planets'
    },
    Positions: {
        LEFT: 'left',
        RIGHT: 'right'
    }
};

if(!(typeof exports === 'undefined')) {
    module.exports = Types;
}
