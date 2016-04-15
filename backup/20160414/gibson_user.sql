-- MySQL dump 10.13  Distrib 5.7.9, for Win64 (x86_64)
--
-- Host: prod-gibson-instance.cdvppcqaisw3.us-west-2.rds.amazonaws.com    Database: gibson
-- ------------------------------------------------------
-- Server version	5.7.10-log

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
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (1,1,'nanson','$2a$10$NPuvNpPHFVwSzv6S5NAwFOs.cG6haYj7YPnlC9oHJxCNk6yvjrfVi','Zheng','Nanson','1995-03-16','Male','101 Crockamhill Drive','','Toronto',1,'M1S2L2','','','nansonyzzheng@gmail.com',1,0,'2016-04-11 22:05:14','2016-04-13 16:26:31'),(2,1,'student','$2a$12$aLp7ldOqhYRVpKOobJkFKu.VUNDY5GRFFTnnbMHHOrN4gEDfbXipe','McStudent','Student','1997-05-13','Other','1200 Huntingwood Drive','','Toronto',1,'M1S1K7','','','nansonincanada@hotmail.com',0,1,'2016-04-12 04:44:31','2016-04-13 16:27:11'),(3,4,'Timmaaaayy','$2a$12$nMKvMgrbuMe.57yiiWls2.wfgWPDTWH4v5x9YvbEegxViwBmcYIiG','Cheng','Timmy','1995-06-11','Male','26 Statesman Square','','Scarborough',1,'M1S4H6','4162971955','6478948611','timmaaaayycheng@gmail.com',0,1,'2016-04-12 13:41:36','2016-04-14 20:42:43'),(4,1,'t32cheng','$2a$12$kcltBadZwn/qVxdQ/0PwE.6RL4DOyK6h4b9nBRqrt37Zljo3oepRy','Cheng','Timmy','1995-06-11','Male','26 Statesman Square','','Scarborough',1,'M1S4H6','4162971955','6478948611','t32cheng@uwaterloo.ca',0,1,'2016-04-12 13:42:50','2016-04-12 13:48:27'),(5,4,'allenaerosol','$2a$11$NGEhhw7wdW3haIW8r.GBLu8VdU6VGhB36/tc0gOlDC.0HARDTFFvi','Lee','Allen','1995-03-29','Male','157 roxanne cres','','Toronto',1,'M1V4G7','','','iceyallen569@Hotmail.com',0,1,'2016-04-12 15:22:11','2016-04-14 19:25:21'),(6,1,'picturesqued','$2a$12$51ASsSqz4BaNSsORoeWlpeOwn9PQIm6vnElzgy8zOU1jJnofZ9y1m','Fan','Vincent','1995-10-11','Male','5 Briarscross Blvd','5','Toronto',1,'M1S3K1','6475881011','6475881011','aeroarrowlol@hotmail.com',0,0,'2016-04-13 01:00:06','2016-04-13 01:08:10'),(7,1,'Rayden440','$2a$11$IWwjbk4e42jf/XfYgE6pDe0ytIh6G3497gl1W6OB/y3hxA5dtv6KO','Xu','Kevin','1995-07-22','Male','96 Barnwell Dr','','Scarborough',1,'M1V1Y9','','','kevinxu.444@gmail.com',0,0,'2016-04-13 01:28:50','2016-04-13 01:29:09'),(9,4,'test_admin','$2a$10$xktNGVLTfylrG7koeWpvv.XRVkPSldSakRISj.u7B6FxKcT9zf51C','user','admin','2016-01-01','Male','253 Lester Street','403','Waterloo',1,'N2L3W6','','6478948611','nansagad@gmail.com',0,0,'2016-04-13 14:48:55','2016-04-13 16:28:54'),(13,1,'benjixd','$2a$11$gUGCGw8vIj28bKLFujDR2eCLh6UHuWGKM2WAAleZGjIF68zb8lpIS','Zhao','Benjamin','1995-09-02','Male','310 Goldhawk Trail','','Toronto',1,'M1V4H2','14162934186','16472938798','benjamin.zhao1995@hotmail.com',0,0,'2016-04-14 01:40:31','2016-04-14 21:43:22'),(14,1,'yl4zhao','$2a$12$O710sWuelrcXkjVPcd./sODxHte3obdrJGdCAY1xnH6f1XHlzuDJ.','Zhao','Benjamin','1995-09-02','Male','310 Goldhawk Trail','','Toronto',1,'M1V4H2','14162934186','16472938798','benjamin.zhao1995@hotmail.com',0,1,'2016-04-14 13:47:15','2016-04-14 19:22:35');
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

-- Dump completed on 2016-04-14 22:05:29
