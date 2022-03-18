

**Connection Information:**

This is the information we used when connecting to the database through python

team071database is the name of the instance

**Data Definition Language (DDL) Commands:**

CREATE TABLE BusLine (

LineID VARCHAR(40) NOT NULL,

Color VARCHAR(10),

Number INTEGER,

PRIMARY KEY(LineID)

);

CREATE TABLE BusStop (

StopID VARCHAR(20) NOT NULL,

StopLatitude REAL,

StopLongitude REAL,

PRIMARY KEY(StopID)

);

CREATE TABLE Buses (

BusID VARCHAR(5) NOT NULL,

LineID VARCHAR(40),

StopOrigin VARCHAR(20),

StopDestination VARCHAR(20),

Direction VARCHAR(10),

ShapeID VARCHAR(40),

PRIMARY KEY(BusID),

FOREIGN KEY(LineID) REFERENCES BusLine(LineID) ON DELETE SET NULL

);

CREATE TABLE Users (

Username VARCHAR(20) NOT NULL,

Password VARCHAR(20) NOT NULL,

PRIMARY KEY(Username)





);

CREATE TABLE FavoriteRoutes (

LineID VARCHAR(40) NOT NULL,

Username VARCHAR(20) NOT NULL,

DateCreated VARCHAR(10),

PRIMARY KEY(LineID, Username),

FOREIGN KEY(LineID) REFERENCES BusLine(LineID) ON DELETE CASCADE,

FOREIGN KEY(Username) REFERENCES Users(Username) ON DELETE CASCADE

);

CREATE TABLE FavoriteStops (

StopID VARCHAR(20) NOT NULL,

Username VARCHAR(20) NOT NULL,

DateCreated VARCHAR(10),

PRIMARY KEY(StopID, Username),

FOREIGN KEY(StopID) REFERENCES BusStop(StopID) ON DELETE CASCADE,

FOREIGN KEY(Username) REFERENCES Users(Username) ON DELETE CASCADE

);

Users - 1000 entries:

FavoriteRoutes - 2960 entries:

FavoriteStops - 2996 entries:





BusStop - 1069 entries:

**Advanced Query 1:**

Retrieve all buses that are part of a user’s favorite routes, as well as starting at one of their

favorite stops

SELECT u.Username, r.LineID, s.StopID, b.BusID, COUNT(b.BusID) AS UsefulBusCount

FROM Users u NATURAL JOIN FavoriteRoutes r NATURAL JOIN FavoriteStops s JOIN Buses

b ON r.LineID = b.LineID OR s.StopID = b.StopOrigin

GROUP BY u.Username, b.BusID, r.LineID, s.StopID

ORDER BY u.Username, b.BusID;





**\*\*NOTE\*\***: Number of rows in set may change depending on what buses are currently being

used as well as the randomized user’s favorites. In this case, we found all buses which were

being used at night (only 20), which may have caused a lower number of rows in set.

Original Explain Analysis:

First Index added onto FavoriteRoutes-DateCreated

CREATE INDEX idx\_date on FavoriteRoutes (DateCreated);





Second Index added onto Buses-StopOrigin and StopDestination

CREATE INDEX idx\_stop on Buses (StopOrign, StopDestination);

Third Index added onto Buses-StopOrigin and StopDestination as well as

FavoriteRoutes-DateCreated and FavoriteStops-DateCreated





We will choose the third indexing design, as it provides the same speed up as the second

indexing design, where the time it takes to execute the query goes from 0.02 seconds to 0.01

seconds. It combines this speed up along with the benefit of the first indexing design, where it

changes the table scan on our FavoriteRoutes table into an index scan, reducing the time of the

scan. The index on the stop origin and stop destination greatly help, as it causes the cost of the

filter, one of the greatest costing attributes at 2546.95 to be reduced down to a cost of 0, with

the time of it being reduced from 12.2 to 0.021. Furthermore, the first inner join’s time is also

reduced from 12.02 to 12.13, to 2.89 to 11.47, causing it to be much more efficient.

**Advanced Query 2:**

Retrieve all routes that are currently being utilized for each user, the information corresponding

to that route, and the total number of buses that are following that route.

SELECT Username, LineID, Number, Direction, COUNT(LineID) AS NumberOfBuses

FROM Buses b NATURAL JOIN BusLine bl NATURAL JOIN FavoriteRoutes f NATURAL JOIN

Users u

GROUP BY Username, LineID, Direction

ORDER BY Username, Number, Direction;

Original Explain Analyze:





First index was added on Buses-Shape

CREATE INDEX idx\_shape on Buses(ShapeID);

Second index was added on Buses-Direction:

CREATE INDEX idx\_dir on Buses (Direction);

Third index was added on BusLine-Number and Color

CREATE INDEX idx\_num\_color on BusLine (Number, Color);





We chose the third indexing design, where we add an index to both the BusLine’s number and

color. This is because it creates an increase in speed from 0.01 to 0.00 seconds from the

original. Although minimal, any increase in speed is good. Because both the first and third

indexing design have this increase in speed, we look further into the analysis. The highest cost

in both designs is the first nested loop inner join. However, in the first design, we see that the

time it takes is between 0.053 and 0.972, however, in the third design, we see that the actual

time is 0.037 and 0.946. As such, the third design could be a bit faster than the first. A very

apparent change is also seen in the time of the table scan on b, where the time in the third

design is 0.013 to 0.017, but in the first, it is 0.023 to 0.028. This is a very drastic difference,

nearly double the speed. As a result, we choose the third indexing design due to these

increases in speed. It is helps that a bus line’s number and color is very correlated to its Line ID,

and thus is efficient to find.

