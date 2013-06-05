Types = {
    Messages: {
        HELLO: 'HELLO',
        ERROR: 'ERROR',
        MAKE_STAR: 'MAKE_STAR',
        MAKE_PLANET: 'MAKE_PLANET',
        SET_RESOURCES: 'SET_RESOURCES'
    },
    Entities: {
        STAR: 'STAR',
        PLANET: 'PLANET'
    }
};

if(!(typeof exports === 'undefined')) {
    module.exports = Types;
}
