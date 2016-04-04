-- MySQL dump 10.13  Distrib 5.7.9, for Win64 (x86_64)
--
-- Host: 192.168.1.33    Database: gibson
-- ------------------------------------------------------
-- Server version	5.7.11-log

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user` (
  `user_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `rank_id` int(10) unsigned NOT NULL DEFAULT '1',
  `username` varchar(32) NOT NULL,
  `password` varchar(60) NOT NULL,
  `lname` varchar(128) NOT NULL,
  `fname` varchar(128) NOT NULL,
  `birth_date` date NOT NULL,
  `gender` varchar(64) NOT NULL,
  `address` varchar(128) NOT NULL,
  `unit_no` varchar(8) DEFAULT NULL,
  `city` varchar(64) NOT NULL,
  `province_id` int(13) unsigned NOT NULL,
  `postal_code` varchar(6) NOT NULL,
  `primary_phone` varchar(16) DEFAULT NULL,
  `secondary_phone` varchar(16) DEFAULT NULL,
  `email` varchar(128) NOT NULL,
  `send_notification` tinyint(1) unsigned NOT NULL DEFAULT '0',
  `student` tinyint(1) unsigned NOT NULL DEFAULT '0',
  `creation_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `last_login_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `user_id_UNIQUE` (`user_id`),
  UNIQUE KEY `username_UNIQUE` (`username`),
  KEY `province_id` (`province_id`),
  KEY `rank_id_idx` (`rank_id`),
  CONSTRAINT `province_id` FOREIGN KEY (`province_id`) REFERENCES `province` (`province_id`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `rank_id` FOREIGN KEY (`rank_id`) REFERENCES `rank` (`rank_id`) ON DELETE NO ACTION ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (1,4,'benjixd','$2a$10$1DM6kYz6QwRJgf97g11mtuZW7t93s/2e0aCfgR2JZOxSW1rr8MO7S','Zhao','Benjamin','1995-09-02','Male','310 Goldhawk Trail','','Toronto',1,'m1v4h2','','','benjamin.zhao1995@hotmail.com',0,1,'2016-03-03 06:09:20','2016-04-03 18:05:28'),(2,1,'benji1','$2a$11$7emmqhMep8XzpG/ng2Azs.Glhk.9nOK9njwFSfaYhPF0svLCEMiuO','q','q','2016-03-05','Male','q','','q',1,'q1q1q1','q','q','benjamin.zhao1995@hotmail.com',0,0,'2016-03-05 17:57:33','2016-03-19 16:08:38'),(3,4,'jorden','$2a$10$s4lfg2i/PFkT8lsHo.pmrOqNPqHGNU2.X79ENsKNCTUXwGg6O2hyi','Jorden','Michael','1963-02-17','Male','196 NBA Crescent','','Scarborough',1,'M1V4G4','1111111111','2222222222','jordenzeng1995@gmail.com',0,1,'2016-03-05 18:01:06','2016-04-03 21:50:52'),(4,1,'sldjekskcm','$2a$11$QxAZEaSZ64ndlLuoJaLzxOozp4.Mv4JJ2gSexBROCHYlJhu5TFili','ckljilslkx','icjsldck','2016-01-18','Other','123 kkkkkk','','fsdzgxchkjy',3,'Q1Q1Q1','','','kevinxu_95@hotmail.com',0,0,'2016-03-05 18:43:43','2016-03-05 18:44:12'),(5,1,'kevin1','$2a$10$4qr1Zq7XmeAi1JFce.ag8.KkUQHzCIrRKygM.7fAHDtHIB5Sv5qwi','q','q','2016-03-05','Male','q','','toronto',1,'a1a1a1','','','benjamin.zhao1995@hotmail.com',0,0,'2016-03-05 20:36:24','2016-03-05 20:36:41'),(6,4,'allenaerosol','$2a$12$LkIb4gS.Mp6q3mcEfua2Zu82ZB2lUZeJCliXXSMq9dp1YDSUY.s.q','Lee','Allen','1995-03-29','Male','157 roxanne cres','','Toronto',1,'m1v4g7','','','iceyallen569@Hotmail.com',1,1,'2016-03-05 20:45:10','2016-04-03 17:55:57'),(7,1,'jhgsfzdg','$2a$11$oxQFMxWFArWyxj16LD8y9eKRG0MXKrSP2Pjruy3CRV8rB4PasHO6e','nice','meme','2016-03-10','Female','69 KappaRoss','','Waterloo',8,'r4r4r4','','','kevinxu.444@gmail.com',0,0,'2016-03-19 22:18:32','2016-03-19 22:26:56'),(8,1,'jhdgjkgg','$2a$11$cBuKx9ODZtMUfgQkcYGR2e6TyzYrgCjUrniilfhnX/ysleFRs82oi','xcvvsc','fdbdbvd','2016-03-14','Female','533 dvsdcz','','Waterloo',6,'U9U9U9','','','kevinxu.444@gmail.com',0,0,'2016-03-19 23:26:22','2016-03-19 23:26:39'),(9,1,'jcghdfn','$2a$10$6TfUoWyTOE79VA.g1lFs8u/jJeSbapoGuLA68yYBJer4oDc9mrFg2','gafsd','sadfwfw','2016-03-08','Other','88 MPH Lane','','jhnbgsvf',5,'K8K8K8','','','kevinxu.444@gmail.com',0,0,'2016-03-19 23:48:37','2016-03-19 23:48:47'),(10,1,'TestUser1','$2a$10$zFAFBfC3jscfVWHbGNthbuvdrXfpvjMAkJfeDCiF50gXYYFw6eKxC','Xu','Kevin','1995-07-22','Male','96 Barnwell Drive','','Scarborough',1,'M1V1Y9','5197296543','5197296543','kevinxu.444@gmail.com',0,0,'2016-03-25 15:55:27','2016-03-25 16:02:14'),(11,4,'kuntekinte','$2a$10$Uvt6kmfEF791DXW66jzRF.0.rVw4RR8iz1NFsCcauh9vVgPkJsJMq','Cheng','Timmy','2016-03-23','Male','26 Statesman Square','','Toronto',1,'M1S4H6','6478948611','6478948611','timmaaaayycheng@gmail.com',0,0,'2016-03-26 01:27:32','2016-03-26 03:33:23'),(12,1,'t32cheng','$2a$10$xDyiOup0jb7S5ggXgmj.NO2BIk/r5/qy5AN1XY0tdJpFZlKz4dosW','Cheng','Timmy','2016-04-01','Female','253 Lester Street Suite 403','','scarbs',1,'N2L3K8','','','timmaaaayycheng@gmail.com',0,0,'2016-04-03 20:54:56','2016-04-03 22:30:11');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2016-04-03 18:35:56
