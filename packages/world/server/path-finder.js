
const { Grid, AStarFinder } = require('pathfinding');

class PathFinder
{

    constructor()
    {
        this.finder = new AStarFinder();
        this.world = false;
        this.grid = false;
        this.bodies = {};
    }

    createGridFromMap()
    {
        // @NOTE: here we create an empty grid with the size of the current scene, then we mark the collisions when the
        // layers and world contents are created. See class P2world, line 83, method "setWalkableAt".
        this.grid = new Grid(this.world.mapJson.width, this.world.mapJson.height);
    }

    addBodyToProcess(body)
    {
        this.bodies[body.id] = body;
    }

    findPath(from, to)
    {
        // we need a new grid clone for every path find.
        let grid = this.grid.clone();
        let path = this.finder.findPath(from[0], from[1], to[0], to[1], grid);
        if(!path.length && this.world.tryClosestPath){
            let newTo = [1, 1];
            if(from[0] < to[0]){
                newTo[0] = -1;
            }
            if(from[1] < to[1]){
                newTo[1] = -1;
            }
            // @TODO: improve how to check the closest nodes.
            // check all closest nodes:
            let worldW = this.world.mapJson.width;
            let worldH = this.world.mapJson.height;
            let testPointA = (to[0]+newTo[0] > worldW ? to[0]+newTo[0] : worldW);
            let testPointB = (to[1]+newTo[1] > worldH ? to[1]+newTo[1] : worldH);
            let testPointC = (to[0]-newTo[0] < 0 ? to[0]-newTo[0] : 0);
            let testPointD = (to[1]-newTo[1] < 0 ? to[1]-newTo[1] : 0);
            let nodeTo = this.grid.getNodeAt(testPointA, to[1]);
            if(nodeTo && !nodeTo.walkable){
                nodeTo = this.grid.getNodeAt(to[0], testPointB);
                if(nodeTo && !nodeTo.walkable){
                    nodeTo = this.grid.getNodeAt(testPointA, testPointB);
                    if(nodeTo && !nodeTo.walkable){
                        nodeTo = this.grid.getNodeAt(testPointC, to[1]);
                        if(nodeTo && !nodeTo.walkable){
                            nodeTo = this.grid.getNodeAt(to[0], testPointD);
                            if(nodeTo && !nodeTo.walkable){
                                nodeTo = this.grid.getNodeAt(testPointC, testPointD);
                                if(nodeTo && !nodeTo.walkable){
                                    nodeTo = this.grid.getNodeAt(testPointC, testPointB);
                                    if(nodeTo && !nodeTo.walkable){
                                        nodeTo = this.grid.getNodeAt(testPointA, testPointD);
                                    }
                                }
                            }
                        }
                    }
                }
            }
            if(nodeTo && nodeTo.walkable){
                grid = this.grid.clone();
                path = this.finder.findPath(from[0], from[1], nodeTo.x, nodeTo.y, grid);
            }
        }
        return path;
    }

}

module.exports.PathFinder = PathFinder;