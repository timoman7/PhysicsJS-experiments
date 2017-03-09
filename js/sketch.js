var legs = [];
var sX=0;
var sY=0;
var viewWidth;
var viewHeight;
var shapes = ["Rectangle","Circle","Star","Triangle"];
var gui;
var curCan;
var userFunction = function() {};
var globalBodies = [];
function addBody(obj) {
    globalBodies.push(obj);
    return obj;
}
var changeScript = function() {
    var theInput = document.getElementById("myScript");
    userFunction = function() {
        eval(theInput.value.replace(/world/g, "worlda"));
    }
    ;
};
var rigidConstraints;
var hookObject;
var stringObject;
var wheely;
var worlda;
var jellyCube = [];
var edgeP;
function setup(){
Physics(function(world) {
    worlda = world;
    viewWidth = 400;
    viewHeight = 300;
    var renderer = Physics.renderer('canvas', {
        width: viewWidth,
        height: viewHeight,
    });
    // add the renderer
    world.add(renderer);
    // render on each step
    world.on('step', function() {
        world.render();
    });
    // bounds of the window
    var viewportBounds = Physics.aabb(0, 0, viewWidth, viewHeight);
    // constrain objects to these bounds
    edgeP = Physics.behavior('edge-collision-detection', {
        aabb: viewportBounds,
        restitution: 0.6,
        cof: 0.4,
    });
    world.add(edgeP);
    Physics.body('wheel', 'circle', function(parent) {
        return {
            // no need for an init
            // spin the wheel at desired speed
            spin: function(speed) {
                // the wheels are spinning...
                this.state.angular.vel += speed;
            }
        };
    });
    Physics.body('leg', 'rectangle', function(parent) {
        return {
            // no need for an init
            // spin the wheel at desired speed
            mmm: function(timeA) {
                // the wheels are spinning...
                var newForce = createVector(Math.sin(timeA) * 4,Math.cos(timeA) * 2);
                this.applyForce(newForce);
            }
        };
    });
    // add a circle
    wheely = Physics.body('wheel', {
        x: 100,
        // x-coordinate
        y: 200,
        // y-coordinate
        vx: 0.2,
        // velocity in x-direction
        vy: 0.01,
        // velocity in y-direction
        radius: 20,
        restitution: 0.8,
        cof: 1,
    });
    rigidConstraints = Physics.behavior('verlet-constraints', {
        iterations: 3
    });
    hookObject = function(obj) {
        var cfg = [0.6];
        if (arguments.length > 1) {
            cfg = arguments[1];
        }
        for (var i = 0; i < obj.length; i++) {
            for (var j = 0; j < obj.length; j++) {
                if (obj[i] !== obj[j]) {
                    rigidConstraints.distanceConstraint(obj[i], obj[j], cfg);
                }
            }
        }
    }
    stringObject = function(obj, thresh) {
        var cfg = [0.6];
        if (arguments.length > 2) {
            cfg = arguments[2];
        }
        for (var i = 0; i < obj.length; i++) {
            for (var j = 0; j < obj.length; j++) {
                if (obj[i] !== obj[j]) {
                    if ((dist(obj[i].state.pos.x, obj[i].state.pos.y, obj[j].state.pos.x, obj[j].state.pos.y)) < thresh && (dist(obj[i].state.pos.x, obj[i].state.pos.y, obj[j].state.pos.x, obj[j].state.pos.y)) > (thresh * -1)) {
                        rigidConstraints.distanceConstraint(obj[i], obj[j], cfg);
                    }
                }
            }
        }
    }
    for (var sx = 0; sx < 8; sx++) {
        for (var sy = 0; sy < 8; sy++) {
            jellyCube.push(Physics.body('wheel', {
                x: (sx * 14) + 200,
                y: (sy * 14) + 400,
                vx: 0,
                vy: 0,
                radius: 4,
                restitution: 0.8,
                cof: 1,
            }));
        }
    }
    legs.push(addBody(Physics.body('circle', {
        x: 200,
        y: 200,
        vx: 0,
        vy: 0,
        radius: 4,
        restitution: 0.8,
        cof: 0.4,
    })));
    //legs[0]
    legs.push(addBody(Physics.body('circle', {
        x: 200,
        y: 200,
        vx: 0,
        vy: 0,
        radius: 4,
        restitution: 0.8,
        cof: 0.4,
    })));
    //legs[1]
    legs.push(addBody(Physics.body('circle', {
        x: 200,
        y: 240,
        vx: 0,
        vy: 0,
        radius: 4,
        restitution: 0.8,
        cof: 0.4,
    })));
    //legs[2]
    legs.push(addBody(Physics.body('circle', {
        x: 200,
        y: 240,
        vx: 0,
        vy: 0,
        radius: 4,
        restitution: 0.8,
        cof: 0.4,
    })));
    //legs[3]
    legs.push(addBody(Physics.body('leg', {
        x: 200,
        y: 280,
        vx: 0,
        vy: 0,
        width: 40,
        height: 20,
        mass: 4,
        restitution: 0.8,
        cof: 0.4,
    })));
    //legs[4]
    legs.push(addBody(Physics.body('leg', {
        x: 200,
        y: 280,
        vx: 0,
        vy: 0,
        width: 40,
        height: 20,
        mass: 4,
        restitution: 0.8,
        cof: 0.4,
    })));
    //legs[5]
    //0->1
    //0->2
    //2->4
    //1->3
    //3->5
    rigidConstraints.distanceConstraint(legs[0], legs[1], [0.6]);
    rigidConstraints.distanceConstraint(legs[0], legs[2], [0.6]);
    rigidConstraints.distanceConstraint(legs[2], legs[4], [0.6]);
    rigidConstraints.distanceConstraint(legs[1], legs[3], [0.6]);
    rigidConstraints.distanceConstraint(legs[3], legs[5], [0.6]);
    //stringObject(legs, 20, 0.5);
    //stringObject(jellyCube,22,0.5);
    world.on('render', function(data) {
        var renderer = data.renderer;
    });
    world.add(rigidConstraints);
    world.add(jellyCube);
    world.add(legs);
    window.onkeydown = function(e) {
        if (e.keyCode == 37 && e.target == document.body) {
            world.on('step', function(data) {
                console.log(data);
                wheely.spin(-0.03);
                for (var i = 0; i < jellyCube.length; i++) {
                    jellyCube[i].spin(-0.03);
                }
                //tire1.spin( -0.03 );
                //tire2.spin( -0.03 );
                // only execute callback once
                world.off('step', data.handler);
            });
        } else if (e.keyCode == 39 && e.target == document.body) {
            world.on('step', function(data) {
                console.log(data);
                wheely.spin(0.03);
                for (var i = 0; i < jellyCube.length; i++) {
                    jellyCube[i].spin(0.03);
                }
                //tire1.spin( 0.03 );
                //tire2.spin( 0.03 );
                // only execute callback once
                world.off('step', data.handler);
            });
        }
    }
    ;
    try {
        userFunction();
    } catch (err) {
        console.warn(err);
    }
    world.add(Physics.behavior('interactive', {
        el: renderer.container
    }));
    var attractor = Physics.behavior('attractor', {
        order: 0,
        strength: 0.002
    });
    world.on({
        'interact:poke': function(pos) {
            world.wakeUpAll();
            attractor.position(pos);
            world.add(attractor);
        },
        'interact:move': function(pos) {
            attractor.position(pos);
        },
        'interact:release': function() {
            world.wakeUpAll();
            world.remove(attractor);
        }
    });
    // ensure objects bounce when edge collision is detected
    world.add(Physics.behavior('body-impulse-response'));
    //world.add( Physics.behavior('body-collision-detection') );
    world.add(Physics.behavior('sweep-prune'));
    // add some gravity
    world.add(Physics.behavior('constant-acceleration'));
    // subscribe to ticker to advance the simulation
    Physics.util.ticker.on(function(time, dt) {
        document.getElementsByClassName('pjs-layer-main')[0].width = "400";
        document.getElementsByClassName('pjs-layer-main')[0].height = "300";
        world.step(time);
        legs[4].mmm(world.time);
        legs[5].mmm(world.time);
    });
    // start the ticker
    Physics.util.ticker.start();
});
    curCan = createCanvas(viewWidth,viewHeight);
    curCan.elt.style.zIndex=10;
    gui = createGui("Physics");
    //Add size sliders for rectangles
    //Add radius slider for circle
    //Add size sliders for other shapes
    gui.addGlobals("sX","sY","shapes");
    gui.prototype.setPosition(window.windowWidth-240,0);
}
function draw() {
    
}
