# Estimation second round

On April 13 you estimated the effort to implement EZWH (Estimation.md) considering your requirements (RequirementsDocument.md)
At that time the productivity value used was 10 loc per person hour.   

Now, at project end, it is possible to repeat the 
estimation using the actual productivity of your team.


First we collect data from the past.   

We consider two phases in the project: <br>
-New development (release 1): From project start (march 22) to delivery of first version (code release v1, may 25) <br>
-Corrective Maintenance (release 2): fix of defects (if any)  (may 25 to june 8) with delivery of code release v2  <br>
Report effort figures from the timesheet, compute size from the source code.

## New development (release 1  -- march 22 to may 25)
| Measure| Value |
|---|---|
|effort E (report here effort in person hours, for all activities in the period, from your timesheet)  |667|
|size S (report here size in LOC of all code written, excluding test cases)  |4600|
|productivity P = S/E | ~7|
|defects before release D_before (number of defects found and fixed before may 25) | 7|



## Corrective Maintenance (release 2 -- may 26 to june 8)

| Measure | Value|
|---|---|
| effort for non-quality ENQ (effort for all activities in release 2, or effort to fix defects found when running official acceptance tests) |5|
| effort for non quality, relative = ENQ / E |0.007|
|defects after release D (number of defects found running official acceptance tests and  fixed in release 2) |4|
| defects before release vs defects after release = D/D_before |0.57|
|DD = defect density = D/S|0.0015|
|D_fix = average effort to fix a defect = ENQ / D |1.25|
|overall productivity OP = S/(E + ENQ)|6.84|

## Second estimation

Now it is possible to repeat the estimate using values from the past. We can also estimate (roughly) the number of defects and the effort to fix them.

|             | Estimate                        |             
| ----------- | ------------------------------- |  
| NC =  Estimated number of classes to be developed                 |                 35        |             
|  A = Estimated average size per class, in LOC                     |               100          | 
| S_e = Estimated size of project, in LOC (= NC * A)                  |        3500                        |
| E = Estimated effort, in person hours (here use overall productivity OP)  |        500                          |   
| C = Estimated cost, in euro (here use 1 person hour cost = 30 euro)                   |   15000      | 
| D_e = Estimated number of defects = DD * S_e| 5.25|
| Estimated effort for non quality = D_e * D_fix |6.56|
