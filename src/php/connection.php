<?php
    require 'classes.php';

    try
    {
        $oConfiguration = new Configuration('Localhost', 'pin-elektra', 'root', '');
        $oConnection = new PDO("mysql:host=".$oConfiguration->getHost().";dbname=".$oConfiguration->getDbName().';charset=utf8mb4', $oConfiguration->getUsername(), $oConfiguration->getPassword());
        //$oConnection = new PDO("mysql:host=localhost;dbname=pin-elektra;charset=UTF8", $oConfiguration->getUsername(), $oConfiguration->getPassword());
        $oConnection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    }
    catch(PDOException $exception)
    {
        echo $exception->getMessage() . "<br/>";
    }
?>