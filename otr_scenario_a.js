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
    for (i = 1; i < path.length; i++)
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

function findAllPaths(start, end, flag, arg)
{
    let validPaths = [];
    let prevPath = start;
    findAllPathsRec(start, end, flag, arg, prevPath, validPaths);
    return validPaths;
}

function findAllPathsRec(cur, end, flag, arg, prevPath, validPaths)
{        
    if (cur === end)
    { 
        let condition = checkIfConditionMet(flag, arg, prevPath);       
        if(condition === 0)        
        {
            validPaths.push(prevPath);
            return;
        }
        else if (condition === 1)
        {
            return;
        }            
    }
    let adjArrForVertex = vertexMap[cur];

    for (let i = 0; i < adjArrForVertex.length; i++)
    {
        if (cur === 'A')
        {
            let fuckme = true;
        }
        //prevPath += '-' + cur;
        let next = adjArrForVertex[i].adjacent;
        //prevPath += cur;
        findAllPathsRec(next, end, flag, arg, prevPath + '-' + next, validPaths);        
        //adjArrForVertex = vertexMap[cur];
    }
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
        if (getTripDistance(path) < arg)
        {
            return 0;
        }            
    }
    if (flag === "SHORTEST")
    {
        return 0;
    }
    return 1;
}

function countStops(path)
{
    return (path.split("-").length -1);
}

let answers = {};

//question 1
answers.a = getTripDistance('A-B-C');

//question 2
answers.b = getTripDistance('A-E-B-C-D');

//question 3
answers.c = getTripDistance('A-E-D');

//question 4
answers.d = findAllPaths('A','C','STOPS', 4);


console.log(JSON.stringify(answers))
