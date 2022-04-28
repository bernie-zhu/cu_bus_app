Stored Procedure

Takes latitude, longitude and username
Returns the user's favorite bus stops with color tags corresponding to how close they are to the inputed coordinates

```

CREATE PROCEDURE Result(
    lat double,
    lon double,
    username VARCHAR(255)
)
begin
    declare stopPointId varchar(255);
    declare stopLat float;
    declare stopLon float;
    declare distance float;
    declare distanceStatus varchar(255);
    declare finished integer default 0;

    
    declare temp cursor 
    for 
        SELECT 3959 * acos(cos(radians(lat)) * 
        cos(radians(uiucbuses.BusStop.StopLatitude)) * 
        cos(radians(uiucbuses.BusStop.StopLongitude) - radians(lon)) + sin(radians(lat)) * 
        sin(radians(uiucbuses.BusStop.StopLatitude))) as d, uiucbuses.BusStop.StopLatitude, uiucbuses.BusStop.StopLongitude, uiucbuses.BusStop.StopID
        FROM uiucbuses.FavoriteStops NATURAL JOIN uiucbuses.BusStop
        WHERE uiucbuses.FavoriteStops.Username = username;
    
     
    declare continue handler
    for not found set finished = 1;
        
    drop table if exists FinalTable;
    create table FinalTable (
        stop_point_id varchar(255),
        stop_lat float,
        stop_lon float,
        distance_status varchar(255)
    );
     
    OPEN temp;
    getDistanceStatus: LOOP
        fetch temp into distance, stopLat, stopLon, stopPointId;
        if finished = 1 then
            leave getDistanceStatus;
        end if;
        if distance > 3 then
            set distanceStatus = 'Red';
        end if;
        if distance <= 3 then
            set distanceStatus = 'Yellow';
        end if;
        if distance <= 1 then
            set distanceStatus = 'Green';
        end if;
             
        insert into FinalTable values (stopPointId, stopLat, stopLon, distanceStatus);
        end loop getDistanceStatus;
    CLOSE temp;
     
     select * from FinalTable order by distance_status asc;
    
end 

```
