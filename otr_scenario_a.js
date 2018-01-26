var fs = require('fs');
var inputArray = JSON.parse(fs.readFileSync('input.json', 'utf8')); //No reason for async call

//validate input

var vertexMap = {};

function addValueToList(key, value) {
    //if the list is already created for the "key", then uses it
    //else creates new list for the "key" to store multiple values in it.
    vertexMap[key] = vertexMap[key] || [];
    vertexMap[key].push(value);
}

inputArray.forEach(element => {
    let vertex = element[0];
    let neighbours = { 
        adjacent: element[1],
        dist: Number(element[2])
    }
    addValueToList(vertex, neighbours)    
});

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


function findAllPaths(start, end, flag, arg = 0)
{
    depth = 0; //global variable
    let validPaths = [];
    let prevPath = start;    
    let isSamePoint = start === end;    
    findAllPathsRec
    (start, end, flag, arg, prevPath, validPaths, isSamePoint);
    return validPaths;
}

function findAllPathsRec(cur, end, flag, arg,
     prevPath, validPaths, isSamePoint)
{
    console.log(prevPath);
    depth++;
    if (depth > 20)
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
        if(condition === 0)        
        {
            validPaths.push(prevPath);
            depth--;
            return;
        }
        else if (condition === 1) 
        {
            depth--;
            return;
        }
        else if (condition === 2) { validPaths.push(prevPath);}            
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

function checkIfConditionMet(flag, arg, path)
{
    if (flag === "STOPS")
    {
        if (countStops(path) < arg) {return -1;}
        if (countStops(path) === arg) {return 0;} 
        else {return 1;} 
    }
    if (flag === "MIN_DIST")
    {
        if (getTripDistance(path) < arg) { return 2;}            
    }
    if (flag === "SHORTEST") { return 0; }
    return 1;
}

function countStops(path)
{
    return (path.split("-").length -1);
}

function runAllPathsQuestion4()
{
    let paths = findAllPaths('A','C','STOPS', 4);
    return paths.length;
}

function runAllPathsQuestion5()
{
    let paths = findAllPaths('B','B','SHORTEST');
    let distArr = [];
    paths.forEach((elem) =>
    {
        distArr.push(getTripDistance(elem));
    })
    return Math.min(...distArr);
}

function runAllPathsQuestion6()
{
    let paths = findAllPaths('C','C','MIN_DIST', 30);
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

answers.e = runAllPathsQuestion5();

answers.f = runAllPathsQuestion6();


console.log(JSON.stringify(answers))
