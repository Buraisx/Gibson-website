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
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (1,1,'benjixd','$2a$10$/noSHTvOevlqgDkxjWwZs.sXprk3VcPPf88uyvTF5f0HZSVeA7Xaa','q','q','2016-02-27','Male','310 GOldhawk','','toronto',1,'a1a1a1','','','benjamin.zhao1995@hotmail.com',0,0,'2016-02-27 23:28:14','2016-02-28 07:12:12'),(2,1,'qq','$2a$10$xCftyTvrA48HrBbuz0qGLu0Za1pc9xLiP68HFlKfVlWSdW0Zab3/6','q','q','2016-02-27','Male','qq','','toronto',1,'q1q1q1','','','benjamin.zhao1995@hotmail.com',0,0,'2016-02-27 23:30:57','2016-02-27 23:30:57'),(3,1,'ben','$2a$11$Dp698i8GARNHVPBlgrYtP.SuN4AyhO/P90ud8aZMADuBlKAP2JYjC','q','q','2016-02-27','Male','310 GOldhawk','','qqqq',1,'q1q1q1','','','benjamin.zhao1995@hotmail.com',0,0,'2016-02-27 23:35:36','2016-02-27 23:35:36'),(4,1,'maki','$2a$11$KXfVqYVgrbaV3zHmpfjWDuAw/JalJZIZvfD6Uxk7Oo0cPQsmBZOBq','Nishikino','Maki','1995-03-29','Male','157 pokemon street','','Toronto',1,'A1A1A1','','','icewizard569@hotmail.com',1,1,'2016-02-27 23:41:37','2016-02-27 23:50:19'),(5,1,'salt','$2a$11$Q06LjtNWsYkSfUWjNp7biORyFkFwVStCG1qrYFldDNp8copajUz1e','Chloride','Sodium','1992-05-12','Other','1 Salt Mines Drive','','Salt Lake City',14,'S4L7Y2','','','salt@salt.com',0,0,'2016-02-28 01:47:10','2016-02-28 07:23:01');
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

-- Dump completed on 2016-02-28  2:53:37
