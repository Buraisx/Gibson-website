-- MySQL dump 10.13  Distrib 5.7.9, for Win32 (AMD64)
--
-- Host: localhost    Database: gibson
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
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (1,1,'benjixd','$2a$12$x0PP5CjGfAkRADqXPGXaJ.Ryow7gPWT.xPdRExKHC/B/YsFnW/Sle','Zhao','Benjamin','1995-09-02','Male','310 Goldhawk Trail','','Toronto',1,'m1v4h2','','','benjamin.zhao1995@hotmail.com',0,1,'2016-03-03 06:09:20','2016-03-06 00:48:11'),(2,1,'benji1','$2a$11$7emmqhMep8XzpG/ng2Azs.Glhk.9nOK9njwFSfaYhPF0svLCEMiuO','q','q','2016-03-05','Male','q','','q',1,'q1q1q1','q','q','benjamin.zhao1995@hotmail.com',0,0,'2016-03-05 17:57:33','2016-03-06 00:23:03'),(3,1,'jorden','$2a$11$y674WHoTXh8U7DR5JzyEEeI9FRx.fEk2RVvOToZyURASVvQXdUCly','Zeng','jorden','2016-02-28','Male','196 Roxanne Crescent','','Scarborough',1,'M1V4G4','','','jordenzeng1995@gmail.com',0,1,'2016-03-05 18:01:06','2016-03-06 00:39:03'),(4,1,'sldjekskcm','$2a$11$QxAZEaSZ64ndlLuoJaLzxOozp4.Mv4JJ2gSexBROCHYlJhu5TFili','ckljilslkx','icjsldck','2016-01-18','Other','123 kkkkkk','','fsdzgxchkjy',3,'Q1Q1Q1','','','kevinxu_95@hotmail.com',0,0,'2016-03-05 18:43:43','2016-03-05 18:44:12'),(5,1,'kevin1','$2a$10$4qr1Zq7XmeAi1JFce.ag8.KkUQHzCIrRKygM.7fAHDtHIB5Sv5qwi','q','q','2016-03-05','Male','q','','toronto',1,'a1a1a1','','','benjamin.zhao1995@hotmail.com',0,0,'2016-03-05 20:36:24','2016-03-05 20:36:41'),(6,1,'allenaerosol','$2a$11$f8l12RrCOhjLac2uAKpGHejc.JLcBMxc4FKTCUuVjO42CXXb81UfW','Lee','Allen','1995-03-29','Male','157 roxanne cres','','Toronto',1,'m1v4g7','','','iceyallen569@Hotmail.com',1,1,'2016-03-05 20:45:10','2016-03-05 20:45:49');
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

-- Dump completed on 2016-03-05 20:13:28
