Our trigger checks the user's favorite routes, and if any of the favorite routes originate from a deleted stop's ID, then that favorite route will be removed at well.

```
CREATE TRIGGER delete_stop AFTER DELETE ON FavoriteStops FOR EACH ROW
BEGIN
    SET @numRoutes = (SELECT COUNT(LineID) FROM FavoriteRoutes WHERE Username = OLD.Username);
    IF @numRoutes > 0 THEN
        DELETE FavoriteRoutes
        FROM FavoriteRoutes
        INNER JOIN Buses ON FavoriteRoutes.LineID = Buses.LineID
        WHERE Buses.StopOrigin LIKE CONCAT(OLD.StopID, "%") AND Username = Old.Username;
    END IF;
END;
```
