# Project for On Track Retail

Files included:
README.md - this file
otr_scanario_a.js - the solution
input.json - input file

How to run the programme:
1. if required, change location of input.json in the code (line 9).
2. run the programme with node.js.

Overview:
This solution solves all six questions described in scenario A for the general case.
For bigger graphs it is advised to increase the maximum depth of the recursion, 
otherwise solutions could be missed.

Sofware Assumptions:
- Validated input
- recursion maximum depth is adjusted to the input graph

Bugs Worth Mentioning:
During testing 2 small design bugs came up.
- recursion associated the case where start = end
as the base condition to end recursion.
- The graph contains cycles. This is dangerous when recursing
over the possible paths. I had to hardstop recursion at a
certain depth to prevent stack overflow.

Retrospective:
A BDS approach to this problem might have been less precarious in terms of a potenial stack overflow and 
more efficient in terms of the number of traverses until the shortest path is found. On the other hand, 
in this case the graph is weighted, hence the inherent BDS advantage in finding the shortest path is cancelled out.
Moreover, this solution provides a relatively flexible function that could be adjusted for each of the different 
questions in this project using branching logic. 


Created by Tomer Levy.
