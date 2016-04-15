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
-- Table structure for table `temp_user`
--

DROP TABLE IF EXISTS `temp_user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `temp_user` (
  `user_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `rank_id` int(10) unsigned NOT NULL,
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
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `user_id_UNIQUE` (`user_id`),
  UNIQUE KEY `username_UNIQUE` (`username`),
  KEY `province_id` (`province_id`)
) ENGINE=InnoDB AUTO_INCREMENT=64 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `temp_user`
--

LOCK TABLES `temp_user` WRITE;
/*!40000 ALTER TABLE `temp_user` DISABLE KEYS */;
INSERT INTO `temp_user` VALUES (46,1,'a','$2a$12$k6QwQAWqiMIyObOoCF44q.dtp6EDp6k7ht2wxZFdqCPUissaWbYoi','a','a','2016-04-04','Male','a','','a',3,'A','','','a',0,0,'2016-04-13 14:40:26'),(50,1,'timmy','$2a$11$yJS8WpCtIohxUz2L5bY8iuUeLiMqp3E/jGpHubw5d9Dyni12W.F7a','Kinte','Kunte','2016-04-01','Male','26 Statesman Square','','Scarborough',1,'M1S4H6','123456789','123456789','timmy.kl.cheng@gmail.com',0,0,'2016-04-13 19:57:48'),(57,1,'hi vincent','$2a$11$K2ahwLHCxlwqKT0b7AajvuKsHFSI1Sqnu8nN4nyV/52QDx1pb3Nyi','a','a','2016-04-08','Female','a','','a',2,'M1S4H7','123','123','asdasdasdada',0,0,'2016-04-13 20:06:37'),(62,1,'ben1111','$2a$11$aTpG1EdZndZfG1NGbUQmN.WL3hDWsAgcTyLVi97eljag/YSm5vtqa','q','q','2016-04-13','Male','310 goldhawk','','toronto',1,'Q1Q1Q1','1923893829','','benjamin.zhao1995@hotmail.com',0,0,'2016-04-14 03:34:02');
/*!40000 ALTER TABLE `temp_user` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2016-04-14 22:05:40
