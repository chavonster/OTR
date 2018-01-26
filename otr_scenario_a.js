const MAX_RECURSION_DEPTH = 20;
const MAX_STOP_NOT_REACHED = -1;
const PATH_MEETS_CONDITION = 0;
const APPEND_PATH = 2;
const PATH_EXHAUSTED = 1;
const STOPS = 'STOPS';
const SHORTEST = 'SHORTEST';
const MIN_DIST = 'MIN_DIST';
const FILE_PATH = 'input.json';

let fs = require('fs');
//No point behind async call here.
let inputArray = JSON.parse(fs.readFileSync(FILE_PATH, 'utf8')); 

//Initilize map for storing vertices, each vertix is a key for its adjaceny list
//this list includes all other reacable vertices from the key with one step
// and the compatible weight. E.g. in the given graph A -> [{B, 5}, {D, 5}, {E, 7}]
let vertexMap = {};

/*if the list is already created for the "key", then uses it
*else creates new list for the "key" to store multiple values in it.
*/
function addValueToList(key, value)
{    
    vertexMap[key] = vertexMap[key] || [];
    vertexMap[key].push(value);
}

//Parse input and create vertex map
inputArray.forEach(element => {
    let vertex = element[0];
    let neighbours = { 
        adjacent: element[1],
        dist: Number(element[2])
    }
    addValueToList(vertex, neighbours)    
});

/*
* Receives a valid path and returns path's distance.
* Path must be formed as follows X-Y-Z-...
*/
function getTripDistance(str)
{
    let path = str.split("-");
    
    let distTotal = 0;
    for (let i = 1; i < path.length; i++)
    {
        let adjArrForVertex = vertexMap[path[i-1]];
        let adj = adjArrForVertex.find((elem) => {
            return elem.adjacent === path[i];                         
        });
        if (adj === undefined)
        {
            return null;
        }
        distTotal += adj.dist;        
    }
   return distTotal;
}

/*
* Finds all paths for questions 4,5 and 6.
* Contains branching logic based on current question using a flag.
* In case the question needs an additional parameter, it is supplied as arg.
* (This is for questions 4,6)
*/
function findAllPaths(start, end, flag, arg = 0)
{
    depth = 0; //global variable, tracking recursion depth
    let validPaths = [];
    let prevPath = start;    
    let isSamePoint = start === end;    
    findAllPathsRec
    (start, end, flag, arg, prevPath, validPaths, isSamePoint);
    return validPaths;
}

/*
* Recursive function to get all paths. 
* The depth is bouned because of possible cycles in graph.
* The base conditions were determined based on the questions' logic.
*/
function findAllPathsRec(cur, end, flag, arg,
     prevPath, validPaths, isSamePoint)
{    
    depth++;
    if (depth > MAX_RECURSION_DEPTH)
    {
        depth--;
        return;
    }    
    if (isSamePoint)
    {
        isSamePoint = false;
    }
    else if (cur === end)
    { 
        let condition = checkIfConditionMet(flag, arg, prevPath);       
        if(condition === PATH_MEETS_CONDITION)        
        {
            validPaths.push(prevPath);
            depth--;
            return;
        }
        else if (condition === PATH_EXHAUSTED) 
        {
            depth--;
            return;
        }
        else if (condition === APPEND_PATH) { validPaths.push(prevPath);}            
    }
    let adjArrForVertex = vertexMap[cur];    
    
    for (let i = 0; i < adjArrForVertex.length; i++)
    {
        let next = adjArrForVertex[i].adjacent;                         
        findAllPathsRec(next, end, flag, arg, 
            prevPath + '-' + next, validPaths, isSamePoint);                
    }
    depth--;
}

/*
* Checks if the recursion can be determined, depeneding on case
*/
function checkIfConditionMet(flag, arg, path)
{
    if (flag === STOPS)
    {
        if (countStops(path) < arg) {return MAX_STOP_NOT_REACHED;}
        if (countStops(path) === arg) {return PATH_MEETS_CONDITION;} 
        else {return PATH_EXHAUSTED;} 
    }
    if (flag === MIN_DIST)
    {
        if (getTripDistance(path) < arg) { return APPEND_PATH;}            
    }
    if (flag === SHORTEST) { return PATH_MEETS_CONDITION; }
    return PATH_EXHAUSTED;
}

function countStops(path)
{
    return (path.split("-").length -1);
}

function runAllPathsQuestion4()
{
    let paths = findAllPaths('A','C',STOPS, 4);
    return paths.length;
}

function runAllPathsQuestion5()
{
    let paths = findAllPaths('B','B',SHORTEST);
    let distArr = [];
    paths.forEach((elem) =>
    {
        distArr.push(getTripDistance(elem));
    })
    return Math.min(...distArr);
}

function runAllPathsQuestion6()
{
    let paths = findAllPaths('C','C',MIN_DIST, 30);
    return paths.length;
}

let answers = {};

//question 1
answers.a = getTripDistance('A-B-C');

//question 2
answers.b = getTripDistance('A-E-B-C-D');

//question 3
answers.c = getTripDistance('A-E-D');

//question 4
answers.d = runAllPathsQuestion4();

//question 5
answers.e = runAllPathsQuestion5();

//question 6
answers.f = runAllPathsQuestion6();


console.log(JSON.stringify(answers))
